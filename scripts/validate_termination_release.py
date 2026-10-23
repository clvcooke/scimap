#!/usr/bin/env python3
"""Verify a generated termination release against its manifest."""

import argparse
import hashlib
import importlib.util
import json
import math
from pathlib import Path


def _load_tile_reader():
    path = Path(__file__).with_name("vector_tiles.py")
    spec = importlib.util.spec_from_file_location(path.stem, path)
    module = importlib.util.module_from_spec(spec)
    spec.loader.exec_module(module)
    return module.read_tile


read_tile = _load_tile_reader()
TERRITORY_FIPS = {"60", "66", "69", "72", "78"}
TERRITORY_STATES = {"AS", "GU", "MP", "PR", "VI"}
ID_WIDTH = {"counties": 5, "districts": 4}
# Table "total_*" values are current measures; they must match these tile properties.
TABLE_TO_TILE = {
    "total_econ_loss": "terminated_current_econ_loss",
    "total_funding_loss": "terminated_current_loss",
    "total_job_loss": "terminated_current_job_loss",
    "nih_econ_loss": "nih_current_econ_loss",
    "nih_funding_loss": "nih_current_loss",
    "nih_job_loss": "nih_current_job_loss",
    "nsf_econ_loss": "nsf_current_econ_loss",
    "nsf_funding_loss": "nsf_current_loss",
    "nsf_job_loss": "nsf_current_job_loss",
}
# Tile totals and their agency parts: (total, current part names, overall total, overall part names).
TILE_SUMS = [
    (f"terminated_current_{kind}", f"terminated_{kind}")
    for kind in ("loss", "econ_loss", "job_loss")
]


def check_tile_feature(level, identifier, properties):
    """Totals equal NIH + NSF, and current loss never exceeds overall loss."""
    for current, overall in TILE_SUMS:
        if current not in properties or overall not in properties:
            continue
        kind = current.removeprefix("terminated_current_")
        for total, parts in (
            (current, (f"nih_current_{kind}", f"nsf_current_{kind}")),
            (overall, (f"nih_overall_{kind}", f"nsf_overall_{kind}")),
        ):
            if all(part in properties for part in parts):
                expected = sum(properties[part] for part in parts)
                if not math.isclose(properties[total], expected, rel_tol=1e-6, abs_tol=0.05):
                    raise RuntimeError(f"{level} {identifier}: {total} {properties[total]} != NIH + NSF {expected}")
        if properties[current] > properties[overall] * (1 + 1e-6) + 0.05:
            raise RuntimeError(f"{level} {identifier}: {current} exceeds {overall}")


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

    reject_undeclared_files(root, artifacts)
    for warning in validate_tile_content(root, manifest):
        print(f"Warning: {warning}")
    return manifest


def tile_id(level, value):
    return str(value).zfill(ID_WIDTH[level]) if level in ID_WIDTH else str(value)


def is_territory(level, identifier):
    return identifier in TERRITORY_STATES if level == "states" else identifier[:2] in TERRITORY_FIPS


def validate_tile_content(root, manifest):
    """Decode every tile; check structure, table coverage and values. Returns warnings."""
    warnings = []
    metric_properties = {metric["tile_property"] for metric in manifest["metrics"].values() if "tile_property" in metric}
    for level, record in manifest["artifacts"]["tiles"].items():
        features = {}
        for path in sorted((root / "tiles" / level).rglob("*.pbf")):
            layers = read_tile(path.read_bytes())
            unexpected = set(layers) - {record["layer"]}
            if unexpected:
                raise RuntimeError(f"Unexpected tile layer in {path}: {', '.join(sorted(unexpected))}")
            for properties in layers.get(record["layer"], []):
                if record["id_property"] not in properties:
                    raise RuntimeError(f"{level} tile feature without {record['id_property']}: {path}")
                identifier = tile_id(level, properties[record["id_property"]])
                for name in metric_properties | {n for n in TABLE_TO_TILE.values() if n in properties}:
                    value = properties.get(name)
                    if not isinstance(value, (int, float)) or not math.isfinite(value) or value < -1e-6:
                        raise RuntimeError(f"{level} {properties[record['id_property']]} has invalid {name}: {value!r}")
                # A feature repeats across tiles and zooms; every copy must carry the same values.
                first = features.setdefault(identifier, properties)
                if first is not properties and first != properties:
                    raise RuntimeError(f"{level} {identifier} has different values in {path}")
                if first is properties:
                    check_tile_feature(level, identifier, properties)
        if not features:
            raise RuntimeError(f"No {record['layer']} features in {level} tiles")

        table = json.loads((root / manifest["artifacts"]["tables"][level]["path"]).read_text())
        columns = [column for column in TABLE_TO_TILE if column in table[0]]
        aggregates, missing = {}, []
        for row in table:
            identifier = tile_id(level, row["id"])
            feature = features.get(identifier)
            if level == "counties" and is_territory(level, identifier) and identifier[:2] + "000" in features:
                # The territory-wide feature carries the sum of all of the territory's counties.
                totals = aggregates.setdefault(identifier[:2] + "000", dict.fromkeys(columns, 0.0))
                for column in columns:
                    totals[column] += row[column]
                if feature is None:
                    continue
            if feature is None:
                (warnings if is_territory(level, identifier) else missing).append(
                    f"{level} {identifier} ({row.get('name')}) is in the table but on no map tile "
                    f"(${row['total_econ_loss']:,.2f} current economic loss)"
                )
                continue
            for column in columns:
                prop = TABLE_TO_TILE[column]
                if not math.isclose(row[column], feature[prop], rel_tol=1e-6, abs_tol=0.01):
                    raise RuntimeError(f"{level} {identifier}: table {column} {row[column]} != tile {prop} {feature[prop]}")
        if missing:
            raise RuntimeError("; ".join(missing[:10]))
        # Shapes without a table row may exist only with zero loss (e.g. counties with no grants).
        listed = {tile_id(level, row["id"]) for row in table} | set(aggregates)
        unlisted = [
            identifier for identifier, properties in features.items()
            if identifier not in listed and any(properties.get(prop) for prop in TABLE_TO_TILE.values())
        ]
        if unlisted:
            raise RuntimeError(f"{level} tile features with losses but no table row: {', '.join(sorted(unlisted)[:10])}")
        for aggregate, totals in aggregates.items():
            for column in columns:
                prop = TABLE_TO_TILE[column]
                if not math.isclose(totals[column], features[aggregate][prop], rel_tol=1e-6, abs_tol=0.05):
                    raise RuntimeError(
                        f"Territory aggregate {aggregate}: table rows sum {column} {totals[column]} != tile {prop} {features[aggregate][prop]}"
                    )
    return warnings


def reject_undeclared_files(root, artifacts):
    """Everything in the directory is published, so nothing may be undeclared."""
    declared = {"manifest.json"}
    for group in ("tables", "downloads", "inputs"):
        declared.update(record["path"] for record in artifacts[group].values() if record)
    declared.update(artifacts[name]["path"] for name in ("institutions", "state_totals"))
    tile_dirs = tuple(f"tiles/{level}/" for level in artifacts["tiles"])
    extra = sorted(
        relative
        for relative in (path.relative_to(root).as_posix() for path in root.rglob("*") if path.is_file())
        if relative not in declared and not relative.startswith(tile_dirs)
    )
    if extra:
        raise RuntimeError(f"Undeclared files in release: {', '.join(extra[:10])}")


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("release")
    args = parser.parse_args()
    manifest = validate_release(Path(args.release).resolve())
    counts = {name: item["file_count"] for name, item in manifest["artifacts"]["tiles"].items()}
    print(f"Validated candidate {manifest['release_id']}: {counts}")


if __name__ == "__main__":
    main()
