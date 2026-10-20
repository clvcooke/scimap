#!/usr/bin/env python3
"""Verify a generated termination release against its manifest."""

import argparse
import hashlib
import json
from pathlib import Path


def sha256(path):
    digest = hashlib.sha256()
    with path.open("rb") as source:
        for block in iter(lambda: source.read(1024 * 1024), b""):
            digest.update(block)
    return digest.hexdigest()


def digest_tree(directory):
    digest = hashlib.sha256()
    files = sorted(path for path in directory.rglob("*") if path.is_file())
    for path in files:
        digest.update(path.relative_to(directory).as_posix().encode())
        digest.update(b"\0")
        digest.update(bytes.fromhex(sha256(path)))
    return len(files), digest.hexdigest()


def validate_file(root, record):
    path = root / record["path"]
    if not path.is_file():
        raise RuntimeError(f"Missing release file: {path}")
    if "bytes" in record and path.stat().st_size != record["bytes"]:
        raise RuntimeError(f"Size mismatch: {path}")
    if sha256(path) != record["sha256"]:
        raise RuntimeError(f"Checksum mismatch: {path}")


def validate_release(root):
    manifest_path = root / "manifest.json"
    manifest = json.loads(manifest_path.read_text())
    if manifest.get("status") != "candidate":
        raise RuntimeError("Release manifest is not a candidate")
    if manifest["code"]["scimap"]["dirty"] or manifest["code"]["SciMap_Maps"]["dirty"]:
        raise RuntimeError("Candidate was generated from dirty code")

    artifacts = manifest["artifacts"]
    for record in artifacts["tables"].values():
        validate_file(root, record)
    validate_file(root, artifacts["institutions"])
    validate_file(root, artifacts["state_totals"])
    for record in artifacts["downloads"].values():
        validate_file(root, record)
    for record in artifacts["inputs"].values():
        if record is not None:
            validate_file(root, record)

    for level, record in artifacts["tiles"].items():
        tile_dir = root / "tiles" / level
        count, digest = digest_tree(tile_dir)
        if count != record["file_count"] or digest != record["sha256"]:
            raise RuntimeError(f"Tile tree mismatch: {level}")
    return manifest


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("release")
    args = parser.parse_args()
    manifest = validate_release(Path(args.release).resolve())
    counts = {name: item["file_count"] for name, item in manifest["artifacts"]["tiles"].items()}
    print(f"Validated candidate {manifest['release_id']}: {counts}")


if __name__ == "__main__":
    main()
