#!/usr/bin/env python3
"""Publish a validated termination release to a new, immutable R2 directory.

Order: validate locally, refuse a non-empty destination, upload everything
except the manifest, download every uploaded object and check its size and
SHA-256, check public checksums, then upload the manifest last. Uploads use
the AWS CLI against the R2 S3 endpoint. Machine-consumed calls force JSON
output, disable paging and prompts, and reject a listing that is blank,
malformed, or incomplete. This command never calls rclone and never writes
selection pointers such as latest-validated.json or website-release.json.

A release without a public manifest is incomplete. A retry must use a new
release ID. The upload record stores the publisher git revision separately
from the candidate manifest's code provenance. The release directory is not
rewritten.
"""

import argparse
import base64
from datetime import datetime, timezone
import hashlib
import importlib.util
import json
import os
from pathlib import Path
import signal
import subprocess
import tempfile
import urllib.request
import uuid

SCRIPT_DIR = Path(__file__).resolve().parent
DEFAULT_REMOTE = "r2:scimap-data"
DEFAULT_PREFIX = "terminations/releases"
DEFAULT_PUBLIC_BASE = "https://data.scienceimpacts.org"
TILE_SAMPLES_PER_LEVEL = 3


def load_validator():
    path = SCRIPT_DIR / "validate_termination_release.py"
    spec = importlib.util.spec_from_file_location(path.stem, path)
    module = importlib.util.module_from_spec(spec)
    spec.loader.exec_module(module)
    return module


validator = load_validator()


def bucket_name(remote):
    if remote.startswith("s3://"):
        return remote[5:].split("/", 1)[0]
    if ":" in remote:
        return remote.split(":", 1)[1].split("/", 1)[0]
    return remote


def aws_environment():
    """Map R2 credentials into the AWS CLI environment. Never prints them."""
    missing = []
    access_key = os.environ.get("R2_ACCESS_KEY_ID")
    secret_key = os.environ.get("R2_SECRET_ACCESS_KEY")
    endpoint = os.environ.get("R2_ENDPOINT")
    account = os.environ.get("R2_ACCOUNT_ID")
    if not access_key:
        missing.append("R2_ACCESS_KEY_ID")
    if not secret_key:
        missing.append("R2_SECRET_ACCESS_KEY")
    if not endpoint:
        if account:
            endpoint = f"https://{account}.r2.cloudflarestorage.com"
        else:
            missing.append("R2_ENDPOINT or R2_ACCOUNT_ID")
    if missing:
        raise SystemExit(
            "Missing publication credentials: "
            + ", ".join(missing)
            + ". Native R2 publishing needs R2_ACCESS_KEY_ID, R2_SECRET_ACCESS_KEY, "
            "and R2_ENDPOINT or R2_ACCOUNT_ID."
        )
    env = os.environ.copy()
    env["AWS_ACCESS_KEY_ID"] = access_key
    env["AWS_SECRET_ACCESS_KEY"] = secret_key
    env["AWS_DEFAULT_REGION"] = "auto"
    return env, endpoint


def command_name(args):
    return args[1] if len(args) > 1 else args[0]


def aws(*args, capture=False):
    env, endpoint = aws_environment()
    # Operator output, pager, and prompt preferences must not change results.
    env["AWS_DEFAULT_OUTPUT"] = "json"
    env["AWS_PAGER"] = ""
    env["AWS_CLI_AUTO_PROMPT"] = "off"
    command = [
        "aws",
        *map(str, args),
        "--endpoint-url", endpoint,
        "--output", "json",
        "--no-cli-pager",
        "--no-cli-auto-prompt",
    ]
    print("Running:", " ".join(command))
    result = subprocess.run(command, capture_output=capture, text=True, env=env)
    if result.returncode != 0:
        detail = f": {result.stderr.strip()}" if capture and result.stderr else ""
        raise RuntimeError(f"aws {command_name(args)} failed with exit code {result.returncode}{detail}")
    return result.stdout if capture else None


def aws_json(*args):
    stdout = aws(*args, capture=True)
    name = command_name(args)
    if stdout is None or not stdout.strip():
        raise RuntimeError(f"aws {name} returned no JSON")
    try:
        payload = json.loads(stdout)
    except json.JSONDecodeError as error:
        raise RuntimeError(f"aws {name} returned malformed JSON") from error
    if not isinstance(payload, dict):
        raise RuntimeError(f"aws {name} returned JSON that is not an object")
    return payload


def listing_page(*args, prefix):
    """Require a complete ListObjectsV2 page. Never treat a bad page as empty."""
    page = aws_json(*args)
    key_count = page.get("KeyCount")
    truncated = page.get("IsTruncated")
    contents = page.get("Contents", [])
    common_prefixes = page.get("CommonPrefixes", [])
    if type(key_count) is not int or key_count < 0 or type(truncated) is not bool:
        raise RuntimeError(f"Listing response is missing KeyCount or IsTruncated: {prefix}")
    if not isinstance(contents, list) or not isinstance(common_prefixes, list):
        raise RuntimeError(f"Listing response has an invalid key listing: {prefix}")
    if len(contents) != key_count:
        raise RuntimeError(f"Listing response KeyCount does not match Contents: {prefix}")
    for item in contents:
        key = item.get("Key") if isinstance(item, dict) else None
        if type(key) is not str or not key:
            raise RuntimeError(f"Listing response contains an object without a key: {prefix}")
    for item in common_prefixes:
        common = item.get("Prefix") if isinstance(item, dict) else None
        if type(common) is not str or not common:
            raise RuntimeError(f"Listing response contains an invalid common prefix: {prefix}")
    if truncated and (type(page.get("NextContinuationToken")) is not str or not page["NextContinuationToken"]):
        raise RuntimeError(f"Truncated listing without a continuation token: {prefix}")
    return page


def release_files(root, include_manifest):
    files = []
    for path in sorted(root.rglob("*")):
        if not path.is_file():
            continue
        relative = path.relative_to(root).as_posix()
        if relative == "manifest.json" and not include_manifest:
            continue
        files.append((relative, path))
    return files


def destination_is_empty(bucket, prefix):
    page = listing_page(
        "s3api", "list-objects-v2",
        "--bucket", bucket,
        "--prefix", prefix,
        "--max-keys", "1",
        prefix=prefix,
    )
    return page["KeyCount"] == 0 and not page.get("Contents") and not page.get("CommonPrefixes") and not page["IsTruncated"]


def list_keys(bucket, prefix):
    keys = []
    token = None
    while True:
        command = ["s3api", "list-objects-v2", "--bucket", bucket, "--prefix", prefix]
        if token:
            command.extend(["--continuation-token", token])
        page = listing_page(*command, prefix=prefix)
        keys.extend(item["Key"] for item in page.get("Contents", []))
        if not page["IsTruncated"]:
            return keys
        token = page["NextContinuationToken"]


def put_file(bucket, key, path):
    content_md5 = base64.b64encode(hashlib.md5(path.read_bytes()).digest()).decode("ascii")
    aws(
        "s3api", "put-object",
        "--bucket", bucket,
        "--key", key,
        "--body", path,
        "--content-md5", content_md5,
        "--if-none-match", "*",
    )


def upload_files(bucket, prefix, files):
    for relative, path in files:
        put_file(bucket, prefix + relative, path)


def verify_objects(bucket, prefix, files):
    """Download every object and compare its bytes. Do not trust checksum headers."""
    for relative, path in files:
        key = prefix + relative
        local = path.read_bytes()
        with tempfile.TemporaryDirectory(prefix="scimap-release-") as tmp:
            outfile = Path(tmp) / "object"
            aws(
                "s3api", "get-object",
                "--bucket", bucket,
                "--key", key,
                outfile,
                capture=True,
            )
            remote = outfile.read_bytes()
        if len(remote) != len(local) or hashlib.sha256(remote).digest() != hashlib.sha256(local).digest():
            raise RuntimeError(f"Remote checksum mismatch: {key}")


def verify_remote(bucket, prefix, root):
    files = release_files(root, include_manifest=False)
    expected = {prefix + relative for relative, _path in files}
    found = set(list_keys(bucket, prefix))
    if found != expected:
        missing = sorted(expected - found)[:5]
        extra = sorted(found - expected)[:5]
        raise RuntimeError(f"Remote release does not match local files; missing={missing} extra={extra}")
    verify_objects(bucket, prefix, files)


def publisher_provenance():
    """Git identity of this publisher, kept apart from the candidate manifest."""
    repo = SCRIPT_DIR.parent
    script = SCRIPT_DIR / "publish_termination_release.py"
    record = {"script_sha256": hashlib.sha256(script.read_bytes()).hexdigest()}
    try:
        revision = subprocess.run(
            ["git", "-C", str(repo), "rev-parse", "HEAD"],
            check=True,
            capture_output=True,
            text=True,
        ).stdout.strip()
        status = subprocess.run(
            ["git", "-C", str(repo), "status", "--porcelain"],
            check=True,
            capture_output=True,
            text=True,
        ).stdout
        record["revision"] = revision
        record["dirty"] = bool(status.strip())
    except (subprocess.CalledProcessError, FileNotFoundError) as error:
        record["revision"] = None
        record["dirty"] = None
        record["error"] = str(error)
    return record


def sample_files(root, manifest):
    """Hash every JSON/CSV artifact publicly, plus representative tiles per level."""
    artifacts = manifest["artifacts"]
    records = [
        *artifacts["tables"].values(),
        *artifacts["downloads"].values(),
        artifacts["institutions"],
        artifacts["state_totals"],
        *(record for record in artifacts["inputs"].values() if record is not None),
    ]
    paths = [record["path"] for record in records]
    for level in artifacts["tiles"]:
        tiles = sorted(
            path.relative_to(root).as_posix()
            for path in (root / "tiles" / level).rglob("*.pbf")
        )
        if not tiles:
            raise RuntimeError(f"No tiles found for {level}")
        step = max(1, len(tiles) // TILE_SAMPLES_PER_LEVEL)
        paths.extend(tiles[::step][:TILE_SAMPLES_PER_LEVEL])
    return paths


def fetch_sha256(url):
    # Cache-bust so a 404 cached before the upload cannot mask the new object.
    request = urllib.request.Request(
        f"{url}?verify={uuid.uuid4().hex}",
        headers={"User-Agent": "scimap-release-publisher", "Accept-Encoding": "identity"},
    )
    digest = hashlib.sha256()
    with urllib.request.urlopen(request, timeout=60) as response:
        for block in iter(lambda: response.read(1024 * 1024), b""):
            digest.update(block)
    return digest.hexdigest()


def verify_public(root, public_url, paths):
    results = []
    for path in paths:
        expected = validator.sha256(root / path)
        actual = fetch_sha256(f"{public_url}/{path}")
        results.append({"path": path, "sha256": actual, "matches": actual == expected})
        if actual != expected:
            raise RuntimeError(f"Public copy does not match local release: {path}")
    return results


def local_inventory(root):
    files = [path for path in root.rglob("*") if path.is_file()]
    return {"objects": len(files), "bytes": sum(path.stat().st_size for path in files)}


def publish_release(args):
    root = Path(args.release).resolve()
    manifest = validator.validate_release(root)
    release_id = manifest["release_id"]
    prefix = args.prefix.strip("/")
    bucket = bucket_name(args.remote)
    key_prefix = f"{prefix}/{release_id}/"
    destination = f"s3://{bucket}/{key_prefix.rstrip('/')}"
    public_url = f"{args.public_base.rstrip('/')}/{prefix}/{release_id}"
    started_at = datetime.now(timezone.utc)
    # One record per attempt, so a refused retry never overwrites an earlier failure.
    record_path = Path(args.record).resolve() if args.record else (
        SCRIPT_DIR / "outputs" / "uploads" / f"{release_id}-{started_at:%Y%m%dT%H%M%SZ}.json"
    )
    record = {
        "release_id": release_id,
        "destination": destination,
        "public_url": public_url,
        "transport": "aws-cli",
        "publisher_code": publisher_provenance(),
        "candidate_code": manifest.get("code"),
        "manifest_sha256": validator.sha256(root / "manifest.json"),
        "local": local_inventory(root),
        "verification": {
            "remote_check": "All objects: downloaded bytes, sizes, and SHA-256",
            "public_sha256": "Every JSON and CSV artifact, representative tiles, then the manifest",
        },
        "started_at": started_at.isoformat(),
        "status": "started",
    }
    print(f"Publishing {release_id}: {record['local']['objects']} objects, "
          f"{record['local']['bytes']} bytes -> {destination}")
    if args.dry_run:
        print("Dry run: nothing uploaded")
        return record

    record_path.parent.mkdir(parents=True, exist_ok=True)

    def advance(status):
        # Saved at every stage so even a hard kill leaves the last completed stage on disk.
        record["status"] = status
        record["updated_at"] = datetime.now(timezone.utc).isoformat()
        record_path.write_text(json.dumps(record, indent=2, sort_keys=True) + "\n")

    try:
        advance("started")
        if not destination_is_empty(bucket, key_prefix):
            record["status"] = "refused"
            raise SystemExit(f"Refusing to publish into non-empty destination: {destination}")
        advance("uploading")
        upload_files(bucket, key_prefix, release_files(root, include_manifest=False))
        advance("uploaded")
        verify_remote(bucket, key_prefix, root)
        advance("checked")
        record["public_samples"] = verify_public(root, public_url, sample_files(root, manifest))
        advance("verified")

        manifest_file = [(relative, path) for relative, path in release_files(root, include_manifest=True) if relative == "manifest.json"]
        upload_files(bucket, key_prefix, manifest_file)
        verify_objects(bucket, key_prefix, manifest_file)
        advance("manifest_uploaded")
        verify_public(root, public_url, ["manifest.json"])
        record["status"] = "published"
    except KeyboardInterrupt:
        record["interrupted_during"] = record["status"]
        record["status"] = "interrupted"
        record["error"] = "Interrupted before completion"
        raise
    except (Exception, SystemExit) as error:
        record["error"] = str(error)
        raise
    finally:
        record["finished_at"] = datetime.now(timezone.utc).isoformat()
        record_path.write_text(json.dumps(record, indent=2, sort_keys=True) + "\n")
        print(f"Upload record ({record['status']}): {record_path}")

    print(f"Published {public_url}/manifest.json")
    return record


def parse_args(argv=None):
    parser = argparse.ArgumentParser(description=__doc__.splitlines()[0])
    parser.add_argument("release", help="Local release directory; its manifest names the destination")
    parser.add_argument("--remote", default=DEFAULT_REMOTE, help="R2 bucket as r2:name, s3://name, or a bare bucket name")
    parser.add_argument("--prefix", default=DEFAULT_PREFIX)
    parser.add_argument("--public-base", default=DEFAULT_PUBLIC_BASE)
    parser.add_argument("--record", help="Upload record path (default: scripts/outputs/uploads/<release-id>-<UTC time>.json)")
    parser.add_argument("--transfers", type=int, default=32, help="Accepted for compatibility; puts stay sequential")
    parser.add_argument("--dry-run", action="store_true")
    return parser.parse_args(argv)


def raise_interrupt(signum, frame):
    raise KeyboardInterrupt


def main(argv=None):
    # CI cancellation sends SIGTERM; record it like Ctrl-C instead of dying silently.
    signal.signal(signal.SIGTERM, raise_interrupt)
    publish_release(parse_args(argv))


if __name__ == "__main__":
    main()
