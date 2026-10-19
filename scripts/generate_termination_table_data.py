"""
Generate pre-aggregated JSON table data from termination CSVs.

Reads each geographic level's NIH and NSF termination CSVs, takes the latest
week's current totals, and writes a compact JSON array for each level. Commands
with options default to scripts/outputs/tables; for compatibility, the bare
command writes src/data. Region names come from the bundled baseline table JSON.

Usage:
    python scripts/generate_termination_table_data.py [--output-dir PATH]
"""

import argparse
import csv
import json
import os
import sys

SCRIPT_DIR = os.path.dirname(os.path.abspath(__file__))
PROJECT_ROOT = os.path.join(SCRIPT_DIR, "..")
NIH_DIR = os.path.join(PROJECT_ROOT, "data", "terminations", "Terminations NIH")
NSF_DIR = os.path.join(PROJECT_ROOT, "data", "terminations", "Terminations NSF")
LABEL_DIR = os.path.join(PROJECT_ROOT, "src", "data")
LEGACY_OUTPUT_DIR = LABEL_DIR
DEFAULT_OUTPUT_DIR = os.path.join(SCRIPT_DIR, "outputs", "tables")
OUTPUT_DIR = DEFAULT_OUTPUT_DIR

LEVELS = {
    "states": {
        "nih_csv": os.path.join(NIH_DIR, "terminations_state.csv"),
        "nsf_csv": os.path.join(NSF_DIR, "terminations_state_nsf.csv"),
        "id_col": "state",
    },
    "counties": {
        "nih_csv": os.path.join(NIH_DIR, "terminations_county.csv"),
        "nsf_csv": os.path.join(NSF_DIR, "terminations_county_nsf.csv"),
        "id_col": "FIPS",
    },
    "districts": {
        "nih_csv": os.path.join(NIH_DIR, "terminations_district.csv"),
        "nsf_csv": os.path.join(NSF_DIR, "terminations_district_nsf.csv"),
        "id_col": "GEOID",
    },
}

VALUE_FIELDS = ["current_loss", "current_econ_loss", "current_job_loss"]


def cli_output_dir(requested, argument_count):
    if requested:
        return requested
    return LEGACY_OUTPUT_DIR if argument_count == 1 else DEFAULT_OUTPUT_DIR


def safe_float(val):
    if val is None or val.strip() in ("", "NA", "NaN", "null"):
        return None
    return float(val)


def rounded(value, digits):
    return None if value is None else round(value, digits)


def agency_value(regions, rid, field):
    """An absent agency row is zero; a present but missing value stays missing."""
    return 0.0 if rid not in regions else regions[rid][field]


def combined_value(nih_value, nsf_value, digits):
    if nih_value is None or nsf_value is None:
        return None
    return round(nih_value + nsf_value, digits)


def load_name_lookup(level_name):
    """Load region names from existing baseline table JSON."""
    baseline_path = os.path.join(LABEL_DIR, f"table_{level_name}.json")
    if not os.path.exists(baseline_path):
        return {}
    with open(baseline_path, encoding="utf-8") as f:
        rows = json.load(f)
    return {row["id"]: row["name"] for row in rows}


def read_weeks(csv_path):
    weeks = set()
    with open(csv_path, newline="", encoding="utf-8") as f:
        reader = csv.DictReader(f)
        for row in reader:
            w = row.get("week")
            if w:
                weeks.add(w)
    return weeks


def shared_latest_week(*csv_paths):
    """Return the latest ISO-date week that appears in every given CSV."""
    sets = [read_weeks(p) for p in csv_paths]
    shared = set.intersection(*sets)
    if not shared:
        raise RuntimeError(f"No shared weeks across {csv_paths}")
    return max(shared)


def load_week(csv_path, id_col, target_week):
    """Load rows for exactly `target_week` from a terminations CSV, keyed by id."""
    regions = {}

    with open(csv_path, newline="", encoding="utf-8") as f:
        reader = csv.DictReader(f)
        for row in reader:
            rid = row[id_col]
            if not rid or row.get("week") != target_week:
                continue

            entry = {}
            for field in VALUE_FIELDS:
                entry[field] = safe_float(row.get(field))
            regions[rid] = entry

    if not regions:
        raise RuntimeError(f"Reporting week {target_week} is absent from {csv_path}")
    return regions


def merge_nih_nsf(nih_regions, nsf_regions, name_lookup, id_col):
    """Merge NIH and NSF data, compute totals, attach names."""
    all_ids = set(nih_regions.keys()) | set(nsf_regions.keys())
    result = []

    for rid in sorted(all_ids):
        nih_econ = agency_value(nih_regions, rid, "current_econ_loss")
        nih_funding = agency_value(nih_regions, rid, "current_loss")
        nih_jobs = agency_value(nih_regions, rid, "current_job_loss")
        nsf_econ = agency_value(nsf_regions, rid, "current_econ_loss")
        nsf_funding = agency_value(nsf_regions, rid, "current_loss")
        nsf_jobs = agency_value(nsf_regions, rid, "current_job_loss")

        entry = {
            "id": rid,
            "name": name_lookup.get(rid, rid),
            "nih_econ_loss": rounded(nih_econ, 2),
            "nih_funding_loss": rounded(nih_funding, 2),
            "nih_job_loss": rounded(nih_jobs, 4),
            "nsf_econ_loss": rounded(nsf_econ, 2),
            "nsf_funding_loss": rounded(nsf_funding, 2),
            "nsf_job_loss": rounded(nsf_jobs, 4),
            "total_econ_loss": combined_value(nih_econ, nsf_econ, 2),
            "total_funding_loss": combined_value(nih_funding, nsf_funding, 2),
            "total_job_loss": combined_value(nih_jobs, nsf_jobs, 4),
        }
        result.append(entry)

    return result


def main(output_dir=None, nih_dir=None, nsf_dir=None, labels_dir=None, reporting_week=None):
    global OUTPUT_DIR, LABEL_DIR
    if output_dir is not None:
        OUTPUT_DIR = os.path.abspath(output_dir)
    if labels_dir is not None:
        LABEL_DIR = os.path.abspath(labels_dir)
    if nih_dir is not None:
        for config in LEVELS.values():
            config["nih_csv"] = os.path.join(
                os.path.abspath(nih_dir), os.path.basename(config["nih_csv"])
            )
    if nsf_dir is not None:
        for config in LEVELS.values():
            config["nsf_csv"] = os.path.join(
                os.path.abspath(nsf_dir), os.path.basename(config["nsf_csv"])
            )
    os.makedirs(OUTPUT_DIR, exist_ok=True)

    for level_name, config in LEVELS.items():
        print(f"Processing {level_name}...")

        name_lookup = load_name_lookup(level_name)
        print(f"  Name lookup: {len(name_lookup)} entries")

        target_week = reporting_week or shared_latest_week(
            config["nih_csv"], config["nsf_csv"]
        )
        print(f"  Reporting week: {target_week}")

        nih_regions = load_week(config["nih_csv"], config["id_col"], target_week)
        print(f"  NIH: {len(nih_regions)} regions")

        nsf_regions = load_week(config["nsf_csv"], config["id_col"], target_week)
        print(f"  NSF: {len(nsf_regions)} regions")

        rows = merge_nih_nsf(nih_regions, nsf_regions, name_lookup, config["id_col"])

        output_path = os.path.join(OUTPUT_DIR, f"table_terminations_{level_name}.json")
        with open(output_path, "w", encoding="utf-8") as f:
            json.dump(rows, f, separators=(",", ":"))

        print(f"  Merged: {len(rows)} regions -> {output_path}")

    print("\nDone!")


if __name__ == "__main__":
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument(
        "--nih-dir", default=NIH_DIR, help="Directory containing NIH termination CSVs"
    )
    parser.add_argument(
        "--nsf-dir", default=NSF_DIR, help="Directory containing NSF termination CSVs"
    )
    parser.add_argument(
        "--labels-dir", default=LABEL_DIR, help="Directory containing baseline table JSON"
    )
    parser.add_argument(
        "--output-dir",
        help="Output directory (bare command: src/data; otherwise scripts/outputs/tables)",
    )
    parser.add_argument("--week", help="Exact ISO reporting week to generate")
    args = parser.parse_args()
    output_dir = cli_output_dir(args.output_dir, len(sys.argv))
    main(output_dir, args.nih_dir, args.nsf_dir, args.labels_dir, args.week)
