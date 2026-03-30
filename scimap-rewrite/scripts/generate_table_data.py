"""
Generate pre-aggregated JSON table data from baseline CSVs.

Reads each geographic level's CSV, groups by region, sums the numeric
columns across all institutes, and writes a compact JSON array for each
level into src/data/.  The frontend imports these directly instead of
parsing and aggregating raw CSVs at runtime.

Usage:
    python scripts/generate_table_data.py
"""

import csv
import json
import os

SCRIPT_DIR = os.path.dirname(os.path.abspath(__file__))
PROJECT_ROOT = os.path.join(SCRIPT_DIR, "..")
DATA_DIR = os.path.join(PROJECT_ROOT, "data", "baseline")
OUTPUT_DIR = os.path.join(PROJECT_ROOT, "src", "data")

LEVELS = {
    "states": {
        "csv": os.path.join(DATA_DIR, "baseline_state.csv"),
        "id_col": "state",
        "name_col": None,
        "state_col": None,
    },
    "counties": {
        "csv": os.path.join(DATA_DIR, "baseline_county.csv"),
        "id_col": "FIPS",
        "name_col": "name",
        "state_col": "state",
    },
    "districts": {
        "csv": os.path.join(DATA_DIR, "baseline_district.csv"),
        "id_col": "GEOID",
        "name_col": None,
        "state_col": "state",
    },
    "cities": {
        "csv": os.path.join(DATA_DIR, "baseline_city.csv"),
        "id_col": "CBSA_FIPS",
        "name_col": "CBSA_NAME",
        "state_col": None,
    },
}

SUM_FIELDS = ["econ_impact", "raw_funding", "jobs"]


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


def aggregate_csv(config):
    """Read a baseline CSV and return a list of aggregated region dicts."""
    id_col = config["id_col"]
    name_col = config["name_col"]
    state_col = config["state_col"]

    regions = {}  # id -> {id, name, econ_impact, raw_funding, jobs, pop_2024}

    with open(config["csv"], newline="", encoding="utf-8") as f:
        reader = csv.DictReader(f)
        for row in reader:
            rid = row[id_col]
            if not rid:
                continue

            if rid not in regions:
                # Derive name
                if name_col and row.get(name_col):
                    name = row[name_col]
                elif state_col and row.get(state_col):
                    # Districts: "AL-01" format
                    name = f"{row[state_col]}-{rid[-2:]}"
                else:
                    name = rid

                regions[rid] = {
                    "id": rid,
                    "name": name,
                    "econ_impact": 0.0,
                    "raw_funding": 0.0,
                    "jobs": 0.0,
                    "pop_2024": safe_int(row.get("pop_2024")),
                }

            entry = regions[rid]
            for field in SUM_FIELDS:
                entry[field] += safe_float(row.get(field))

    # Round floats to avoid excessive JSON precision
    result = []
    for entry in regions.values():
        entry["econ_impact"] = round(entry["econ_impact"], 2)
        entry["raw_funding"] = round(entry["raw_funding"], 2)
        entry["jobs"] = round(entry["jobs"], 4)
        result.append(entry)

    return result


def main():
    os.makedirs(OUTPUT_DIR, exist_ok=True)

    for level_name, config in LEVELS.items():
        print(f"Processing {level_name}...")
        rows = aggregate_csv(config)

        output_path = os.path.join(OUTPUT_DIR, f"table_{level_name}.json")
        with open(output_path, "w", encoding="utf-8") as f:
            json.dump(rows, f, separators=(",", ":"))

        print(f"  {len(rows)} regions -> {output_path}")

    print("\nDone!")


if __name__ == "__main__":
    main()
