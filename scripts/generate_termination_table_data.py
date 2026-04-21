"""
Generate pre-aggregated JSON table data from termination CSVs.

Reads each geographic level's NIH and NSF termination CSVs, takes the latest
week's cumulative totals, and writes a compact JSON array for each level into
src/data/.  Region names are pulled from the existing baseline table JSON.

Usage:
    python scripts/generate_termination_table_data.py
"""

import csv
import json
import os

SCRIPT_DIR = os.path.dirname(os.path.abspath(__file__))
PROJECT_ROOT = os.path.join(SCRIPT_DIR, "..")
NIH_DIR = os.path.join(PROJECT_ROOT, "data", "terminations", "nih")
NSF_DIR = os.path.join(PROJECT_ROOT, "data", "terminations", "nsf")
OUTPUT_DIR = os.path.join(PROJECT_ROOT, "src", "data")

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

VALUE_FIELDS = ["overall_loss", "overall_econ_loss", "overall_job_loss"]


def safe_float(val):
    if not val or val == "NA":
        return 0.0
    return float(val)


def load_name_lookup(level_name):
    """Load region names from existing baseline table JSON."""
    baseline_path = os.path.join(OUTPUT_DIR, f"table_{level_name}.json")
    if not os.path.exists(baseline_path):
        return {}
    with open(baseline_path, encoding="utf-8") as f:
        rows = json.load(f)
    return {row["id"]: row["name"] for row in rows}


def parse_week(w):
    """NIH weeks are integers-as-strings ("1", "2", ..., "51"); NSF weeks are
    ISO date strings ("2025-02-28"). Parse NIH as int so "51" > "9"; NSF dates
    sort correctly as strings."""
    try:
        return int(w)
    except (ValueError, TypeError):
        return w


def load_latest_week(csv_path, id_col):
    """Load a terminations CSV, return only the latest week's data per region."""
    regions = {}

    with open(csv_path, newline="", encoding="utf-8") as f:
        reader = csv.DictReader(f)
        for row in reader:
            rid = row[id_col]
            if not rid:
                continue

            week = parse_week(row["week"])

            if rid not in regions or week > regions[rid]["_week"]:
                entry = {"_week": week}
                for field in VALUE_FIELDS:
                    entry[field] = safe_float(row.get(field))
                regions[rid] = entry
            elif week == regions[rid]["_week"]:
                # Same week — sum (shouldn't happen but be safe)
                for field in VALUE_FIELDS:
                    regions[rid][field] += safe_float(row.get(field))

    # Strip internal _week field
    for entry in regions.values():
        del entry["_week"]

    return regions


def merge_nih_nsf(nih_regions, nsf_regions, name_lookup, id_col):
    """Merge NIH and NSF data, compute totals, attach names."""
    all_ids = set(nih_regions.keys()) | set(nsf_regions.keys())
    result = []

    for rid in all_ids:
        nih = nih_regions.get(rid, {})
        nsf = nsf_regions.get(rid, {})

        name = name_lookup.get(rid, rid)

        entry = {
            "id": rid,
            "name": name,
            # NIH
            "nih_econ_loss": round(nih.get("overall_econ_loss", 0), 2),
            "nih_funding_loss": round(nih.get("overall_loss", 0), 2),
            "nih_job_loss": round(nih.get("overall_job_loss", 0), 4),
            # NSF
            "nsf_econ_loss": round(nsf.get("overall_econ_loss", 0), 2),
            "nsf_funding_loss": round(nsf.get("overall_loss", 0), 2),
            "nsf_job_loss": round(nsf.get("overall_job_loss", 0), 4),
            # Totals
            "total_econ_loss": round(
                nih.get("overall_econ_loss", 0) + nsf.get("overall_econ_loss", 0), 2
            ),
            "total_funding_loss": round(
                nih.get("overall_loss", 0) + nsf.get("overall_loss", 0), 2
            ),
            "total_job_loss": round(
                nih.get("overall_job_loss", 0) + nsf.get("overall_job_loss", 0), 4
            ),
        }
        result.append(entry)

    return result


def main():
    os.makedirs(OUTPUT_DIR, exist_ok=True)

    for level_name, config in LEVELS.items():
        print(f"Processing {level_name}...")

        name_lookup = load_name_lookup(level_name)
        print(f"  Name lookup: {len(name_lookup)} entries")

        nih_regions = load_latest_week(config["nih_csv"], config["id_col"])
        print(f"  NIH: {len(nih_regions)} regions")

        nsf_regions = load_latest_week(config["nsf_csv"], config["id_col"])
        print(f"  NSF: {len(nsf_regions)} regions")

        rows = merge_nih_nsf(nih_regions, nsf_regions, name_lookup, config["id_col"])

        output_path = os.path.join(OUTPUT_DIR, f"table_terminations_{level_name}.json")
        with open(output_path, "w", encoding="utf-8") as f:
            json.dump(rows, f, separators=(",", ":"))

        print(f"  Merged: {len(rows)} regions -> {output_path}")

    print("\nDone!")


if __name__ == "__main__":
    main()
