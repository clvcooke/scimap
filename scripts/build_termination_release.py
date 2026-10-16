"""Build a local prototype termination release from committed analysis outputs."""

import argparse
from datetime import date, datetime, timezone
import hashlib
import json
from pathlib import Path
import re
import shutil
import subprocess
import sys
import tempfile

SCRIPT_DIR = Path(__file__).resolve().parent
PROJECT_ROOT = SCRIPT_DIR.parent
DEFAULT_ANALYSIS_DIR = PROJECT_ROOT.parent / "SciMap_Maps" / "output"
LEVELS = {
    "states": {"max_zoom": 7, "id_property": "state"},
    "counties": {"max_zoom": 9, "id_property": "FIPS"},
    "districts": {"max_zoom": 9, "id_property": "GEOID"},
}
DOWNLOAD_FILES = (
    "terminations_state.csv",
    "terminations_county.csv",
    "terminations_district.csv",
    "terminations_org.csv",
    "terminations_state_nsf.csv",
    "terminations_county_nsf.csv",
    "terminations_district_nsf.csv",
    "terminations_org_nsf.csv",
    "terminations_org_combined.csv",
)


def sha256_file(path):
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
        digest.update(bytes.fromhex(sha256_file(path)))
    return {"file_count": len(files), "sha256": digest.hexdigest()}


def git_state(directory):
    revision = subprocess.run(
        ["git", "-C", str(directory), "rev-parse", "HEAD"],
        check=True,
        capture_output=True,
        text=True,
    ).stdout.strip()
    status = subprocess.run(
        ["git", "-C", str(directory), "status", "--porcelain"],
        check=True,
        capture_output=True,
        text=True,
    ).stdout
    return {"revision": revision, "dirty": bool(status.strip())}


def run(command):
    print("Running:", " ".join(map(str, command)))
    subprocess.run([str(part) for part in command], check=True)


def parse_args(argv=None):
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--analysis-dir", default=DEFAULT_ANALYSIS_DIR)
    parser.add_argument("--week", required=True, help="ISO reporting week")
    parser.add_argument("--release-id", required=True)
    parser.add_argument(
        "--output",
        help="Final release directory (default: scripts/outputs/releases/<release-id>)",
    )
    parser.add_argument(
        "--geo-dir",
        help="Optional directory containing unpacked geographic reference files",
    )
    return parser.parse_args(argv)


def build_release(args):
    if not re.fullmatch(r"[A-Za-z0-9][A-Za-z0-9._-]*", args.release_id):
        raise SystemExit(
            "--release-id must start with a letter or number and may also contain '.', '_' and '-'"
        )
    try:
        date.fromisoformat(args.week)
    except ValueError as error:
        raise SystemExit("--week must be an ISO date such as 2026-09-25") from error

    analysis_dir = Path(args.analysis_dir).resolve()
    output = Path(args.output).resolve() if args.output else (
        SCRIPT_DIR / "outputs" / "releases" / args.release_id
    )
    if output.exists():
        raise SystemExit(f"Refusing to overwrite existing release directory: {output}")

    sources = {}
    for filename in DOWNLOAD_FILES:
        path = analysis_dir / filename
        if not path.is_file():
            raise SystemExit(f"Missing required analysis output: {path}")
        sources[filename] = {"bytes": path.stat().st_size, "sha256": sha256_file(path)}

    output.parent.mkdir(parents=True, exist_ok=True)
    with tempfile.TemporaryDirectory(prefix="termination-release-", dir=output.parent) as temp:
        temp_dir = Path(temp)
        generated = temp_dir / "generated"
        release = temp_dir / "release"
        tables = release / "tables"
        downloads = release / "downloads"
        inputs = release / "inputs"
        for directory in (generated, tables, downloads, inputs):
            directory.mkdir(parents=True, exist_ok=True)

        generator_command = [
            sys.executable,
            SCRIPT_DIR / "terminations.py",
            "--nih-dir",
            analysis_dir,
            "--nsf-dir",
            analysis_dir,
            "--combined-dir",
            analysis_dir,
            "--output-dir",
            generated,
            "--week",
            args.week,
            "--release-id",
            args.release_id,
        ]
        if args.geo_dir:
            generator_command.extend(["--geo-dir", Path(args.geo_dir).resolve()])
        run(generator_command)

        run(
            [
                sys.executable,
                SCRIPT_DIR / "generate_termination_table_data.py",
                "--nih-dir",
                analysis_dir,
                "--nsf-dir",
                analysis_dir,
                "--labels-dir",
                PROJECT_ROOT / "src" / "data",
                "--output-dir",
                tables,
                "--week",
                args.week,
            ]
        )

        tile_manifest = {}
        for level, config in LEVELS.items():
            source = generated / f"tiles_{level}_total_v{args.release_id}-v2"
            destination = release / "tiles" / level
            shutil.copytree(source, destination)
            tile_manifest[level] = {
                "path": f"tiles/{level}/{{z}}/{{x}}/{{y}}.pbf",
                "layer": f"terminations_{level}",
                "min_zoom": 0,
                "max_zoom": config["max_zoom"],
                "id_property": config["id_property"],
                **digest_tree(destination),
            }

        table_manifest = {}
        for level in LEVELS:
            source = tables / f"table_terminations_{level}.json"
            destination = tables / f"{level}.json"
            source.rename(destination)
            table_manifest[level] = {
                "path": f"tables/{level}.json",
                "bytes": destination.stat().st_size,
                "sha256": sha256_file(destination),
            }

        institutions = release / "institutions.json"
        shutil.copy2(generated / "terminated_grants.json", institutions)

        download_manifest = {}
        for filename in DOWNLOAD_FILES:
            destination = downloads / filename
            shutil.copy2(analysis_dir / filename, destination)
            download_manifest[filename] = {
                "path": f"downloads/{filename}",
                **sources[filename],
            }

        source_record = inputs / "analysis-files.json"
        source_record.write_text(json.dumps(sources, indent=2, sort_keys=True) + "\n")

        manifest = {
            "schema_version": 1,
            "status": "prototype",
            "release_id": args.release_id,
            "created_at": datetime.now(timezone.utc).isoformat(),
            "reporting_week": args.week,
            "code": {
                "scimap": git_state(PROJECT_ROOT),
                "SciMap_Maps": git_state(analysis_dir.parent),
            },
            "metrics": {
                "overall": {
                    "description": "Cumulative impact that does not decrease after restoration",
                    "tile_property": "terminated_econ_loss",
                },
                "current": {
                    "description": "Impact still active after restorations",
                    "tile_property": "terminated_current_econ_loss",
                    "tables": True,
                    "institutions": True,
                },
            },
            "limitations": [
                "City/CBSA artifacts are excluded pending identifier and geometry validation.",
                "This prototype packages committed outputs; it is not an independent scientific replay.",
            ],
            "artifacts": {
                "tiles": tile_manifest,
                "tables": table_manifest,
                "institutions": {
                    "path": "institutions.json",
                    "bytes": institutions.stat().st_size,
                    "sha256": sha256_file(institutions),
                },
                "downloads": download_manifest,
                "inputs": {
                    "path": "inputs/analysis-files.json",
                    "sha256": sha256_file(source_record),
                },
            },
        }
        (release / "manifest.json").write_text(
            json.dumps(manifest, indent=2, sort_keys=True) + "\n"
        )
        shutil.move(release, output)

    print(f"Local release created: {output}")
    return output


def main(argv=None):
    build_release(parse_args(argv))


if __name__ == "__main__":
    main()
