"""
Generate pre-aggregated JSON table data from baseline CSVs.

Reads each geographic level's NIH and NSF CSVs, groups by region, sums the
numeric columns across all institutes/accounts, and writes a compact JSON
array for each level into src/data/.  The frontend imports these directly
instead of parsing and aggregating raw CSVs at runtime.

Usage:
    python scripts/generate_table_data.py
"""

import csv
import json
import os

SCRIPT_DIR = os.path.dirname(os.path.abspath(__file__))
PROJECT_ROOT = os.path.join(SCRIPT_DIR, "..")
NIH_DATA_DIR = os.path.join(PROJECT_ROOT, "data", "baseline_new", "Baseline NIH")
NSF_DATA_DIR = os.path.join(PROJECT_ROOT, "data", "baseline_new", "Baseline NSF")
OUTPUT_DIR = os.path.join(PROJECT_ROOT, "src", "data")

LEVELS = {
    "states": {
        "nih_csv": os.path.join(NIH_DATA_DIR, "baseline_state.csv"),
        "nsf_csv": os.path.join(NSF_DATA_DIR, "baseline_state_nsf.csv"),
        "id_col": "state",
        "name_col": None,
        "state_col": None,
    },
    "counties": {
        "nih_csv": os.path.join(NIH_DATA_DIR, "baseline_county.csv"),
        "nsf_csv": os.path.join(NSF_DATA_DIR, "baseline_county_nsf.csv"),
        "id_col": "FIPS",
        "name_col": "name",
        "state_col": "state",
    },
    "districts": {
        "nih_csv": os.path.join(NIH_DATA_DIR, "baseline_district.csv"),
        "nsf_csv": os.path.join(NSF_DATA_DIR, "baseline_district_nsf.csv"),
        "id_col": "GEOID",
        "name_col": None,
        "state_col": "state",
    },
}

NIH_SUM_FIELDS = ["econ_impact", "raw_funding", "jobs"]
NSF_SUM_FIELDS = ["econ_impact", "raw_funding"]


def safe_float(val):
    """Convert a string to float, treating NA/empty as 0."""
    if not val or val == "NA":
        return 0.0
    return float(val)


def safe_int(val):
    """Convert a string to int, treating NA/empty as 0."""
    if not val or val == "NA":
        return 0
    return int(float(val))


def aggregate_csv(csv_path, id_col, name_col, state_col, sum_fields, prefix):
    """Read a baseline CSV and return a dict of id -> aggregated values."""
    regions = {}

    with open(csv_path, newline="", encoding="utf-8") as f:
        reader = csv.DictReader(f)
        for row in reader:
            rid = row[id_col]
            if not rid:
                continue

            # NIH CSVs contain per-IC rows (NCI, NEI, …) plus an aggregate
            # `NIH_tot` row that already sums them — skip it or every metric
            # gets counted twice.
            if row.get("funding_ics") == "NIH_tot":
                continue

            if rid not in regions:
                # Derive name (treat "NA" as missing)
                raw_name = row.get(name_col) if name_col else None
                if raw_name and raw_name != "NA":
                    name = raw_name
                elif state_col and row.get(state_col):
                    name = f"{row[state_col]}-{rid[-2:]}"
                else:
                    name = rid

                regions[rid] = {
                    "id": rid,
                    "name": name,
                    "pop_2024": safe_int(row.get("pop_2024")),
                }
                for field in sum_fields:
                    regions[rid][f"{prefix}{field}"] = 0.0

            entry = regions[rid]
            for field in sum_fields:
                entry[f"{prefix}{field}"] += safe_float(row.get(field))

            # Update pop_2024 if we got a non-zero value and didn't have one
            if entry["pop_2024"] == 0:
                entry["pop_2024"] = safe_int(row.get("pop_2024"))

    return regions


def merge_and_total(nih_regions, nsf_regions):
    """Merge NIH and NSF aggregated dicts, compute totals."""
    all_ids = set(nih_regions.keys()) | set(nsf_regions.keys())
    result = []

    for rid in all_ids:
        nih = nih_regions.get(rid, {})
        nsf = nsf_regions.get(rid, {})

        nih_name = nih.get("name")
        nsf_name = nsf.get("name")
        # Prefer whichever source has a real name (not "NA")
        name = (nih_name if nih_name and nih_name != "NA" else None) or \
               (nsf_name if nsf_name and nsf_name != "NA" else None) or rid

        entry = {
            "id": nih.get("id", nsf.get("id", rid)),
            "name": name,
            "pop_2024": nih.get("pop_2024", nsf.get("pop_2024", 0)),
            # NIH fields
            "nih_econ_impact": round(nih.get("nih_econ_impact", 0), 2),
            "nih_raw_funding": round(nih.get("nih_raw_funding", 0), 2),
            "nih_jobs": round(nih.get("nih_jobs", 0), 4),
            # NSF fields
            "nsf_econ_impact": round(nsf.get("nsf_econ_impact", 0), 2),
            "nsf_raw_funding": round(nsf.get("nsf_raw_funding", 0), 2),
            # Totals
            "total_econ_impact": round(
                nih.get("nih_econ_impact", 0) + nsf.get("nsf_econ_impact", 0), 2
            ),
            "total_raw_funding": round(
                nih.get("nih_raw_funding", 0) + nsf.get("nsf_raw_funding", 0), 2
            ),
        }
        result.append(entry)

    return result


def main():
    os.makedirs(OUTPUT_DIR, exist_ok=True)

    for level_name, config in LEVELS.items():
        print(f"Processing {level_name}...")

        nih_regions = aggregate_csv(
            config["nih_csv"],
            config["id_col"],
            config["name_col"],
            config["state_col"],
            NIH_SUM_FIELDS,
            prefix="nih_",
        )
        print(f"  NIH: {len(nih_regions)} regions")

        nsf_regions = aggregate_csv(
            config["nsf_csv"],
            config["id_col"],
            config["name_col"],
            config["state_col"],
            NSF_SUM_FIELDS,
            prefix="nsf_",
        )
        print(f"  NSF: {len(nsf_regions)} regions")

        rows = merge_and_total(nih_regions, nsf_regions)

        output_path = os.path.join(OUTPUT_DIR, f"table_{level_name}.json")
        with open(output_path, "w", encoding="utf-8") as f:
            json.dump(rows, f, separators=(",", ":"))

        print(f"  Merged: {len(rows)} regions -> {output_path}")

    print("\nDone!")


if __name__ == "__main__":
    main()
