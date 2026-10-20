#!/usr/bin/env python3
"""Publish a validated termination release to a new, immutable R2 directory.

Order: validate locally, refuse a non-empty destination, upload everything
except the manifest, verify the upload against the local release (rclone
size/hash check plus public downloads of representative files), then upload
the manifest last. A release without a public manifest is incomplete; a
retry must use a new release ID. This command never writes selection
pointers such as latest-validated.json or website-release.json.
"""

import argparse
from datetime import datetime, timezone
import hashlib
import importlib.util
import json
from pathlib import Path
import subprocess
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


def rclone(*args, capture=False):
    command = ["rclone", *map(str, args)]
    print("Running:", " ".join(command))
    result = subprocess.run(command, capture_output=capture, text=True)
    if result.returncode != 0:
        detail = f": {result.stderr.strip()}" if capture and result.stderr else ""
        raise RuntimeError(f"rclone {args[0]} failed with exit code {result.returncode}{detail}")
    return result.stdout if capture else None


def destination_is_empty(destination):
    return not rclone("lsf", "--max-depth", "1", f"{destination}/", capture=True).strip()


def sample_files(root, manifest):
    """Small JSON artifacts plus a deterministic spread of tiles per level."""
    artifacts = manifest["artifacts"]
    records = [
        *artifacts["tables"].values(),
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
    destination = f"{args.remote.rstrip('/')}/{prefix}/{release_id}"
    public_url = f"{args.public_base.rstrip('/')}/{prefix}/{release_id}"
    record_path = Path(args.record).resolve() if args.record else (
        SCRIPT_DIR / "outputs" / "uploads" / f"{release_id}.json"
    )
    record = {
        "release_id": release_id,
        "destination": destination,
        "public_url": public_url,
        "manifest_sha256": validator.sha256(root / "manifest.json"),
        "local": local_inventory(root),
        "started_at": datetime.now(timezone.utc).isoformat(),
        "status": "started",
    }
    print(f"Publishing {release_id}: {record['local']['objects']} objects, "
          f"{record['local']['bytes']} bytes -> {destination}")
    if args.dry_run:
        print("Dry run: nothing uploaded")
        return record

    if not destination_is_empty(destination):
        raise SystemExit(f"Refusing to publish into non-empty destination: {destination}")

    record_path.parent.mkdir(parents=True, exist_ok=True)
    try:
        transfers = ["--transfers", args.transfers, "--checkers", args.transfers]
        rclone("copy", root, destination, "--exclude", "/manifest.json", *transfers)
        record["status"] = "uploaded"
        rclone("check", root, destination, "--one-way", "--exclude", "/manifest.json", *transfers)
        record["status"] = "checked"
        record["public_samples"] = verify_public(root, public_url, sample_files(root, manifest))
        record["status"] = "verified"

        rclone("copyto", root / "manifest.json", f"{destination}/manifest.json")
        verify_public(root, public_url, ["manifest.json"])
        record["status"] = "published"
    except Exception as error:
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
    parser.add_argument("--remote", default=DEFAULT_REMOTE, help="rclone remote and bucket")
    parser.add_argument("--prefix", default=DEFAULT_PREFIX)
    parser.add_argument("--public-base", default=DEFAULT_PUBLIC_BASE)
    parser.add_argument("--record", help="Upload record path (default: scripts/outputs/uploads/<release-id>.json)")
    parser.add_argument("--transfers", type=int, default=32)
    parser.add_argument("--dry-run", action="store_true")
    return parser.parse_args(argv)


def main(argv=None):
    publish_release(parse_args(argv))


if __name__ == "__main__":
    main()
