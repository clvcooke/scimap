"""
Generate pre-aggregated JSON table data from FY2027 NIH + NSF budget CSVs.

Reads each geographic level's NIH and NSF FY27 CSVs (one row per region), joins
them on the geographic id, and writes a compact JSON array for each level into
src/data/.  District rows include representative name and party.

Usage:
    python scripts/generate_fy27_budget_table_data.py
"""

import csv
import json
import os

SCRIPT_DIR = os.path.dirname(os.path.abspath(__file__))
PROJECT_ROOT = os.path.join(SCRIPT_DIR, "..")
NIH_DIR = os.path.join(PROJECT_ROOT, "data", "2027", "FY2027 NIH Budget")
NSF_DIR = os.path.join(PROJECT_ROOT, "data", "2027", "FY2027 NSF Budget")
OUTPUT_DIR = os.path.join(PROJECT_ROOT, "src", "data")

LEVELS = {
    "states": {
        "nih_csv": os.path.join(NIH_DIR, "NIH_budget27_state.csv"),
        "nsf_csv": os.path.join(NSF_DIR, "NSF_budget27_state.csv"),
        "id_col": "state",
        "id_pad": None,
        "has_rep": False,
    },
    "counties": {
        "nih_csv": os.path.join(NIH_DIR, "NIH_budget27_county.csv"),
        "nsf_csv": os.path.join(NSF_DIR, "NSF_budget27_county.csv"),
        "id_col": "FIPS",
        "id_pad": 5,
        "has_rep": False,
    },
    "districts": {
        "nih_csv": os.path.join(NIH_DIR, "NIH_budget27_cong.csv"),
        "nsf_csv": os.path.join(NSF_DIR, "NSF_budget27_cong.csv"),
        "id_col": "GEOID",
        "id_pad": 4,
        "has_rep": True,
    },
}

# Source CSV columns that map to table fields
NIH_FIELDS = {
    "econ_loss": "econ_budg_NIH_cuts",
    "funding_cut": "budg_NIH_cuts",
    "jobs_lost": "jobs_budg_NIH_cuts",
}
NSF_FIELDS = {
    "econ_loss": "econ_budg_NSF_cuts",
    "funding_cut": "budg_NSF_cuts",
    "jobs_lost": "jobs_budg_NSF_cuts",
}


def safe_float(val):
    if val is None or val == "" or val == "NA":
        return 0.0
    return float(val)


def load_rows(csv_path, id_col, id_pad):
    rows = {}
    with open(csv_path, newline="", encoding="utf-8") as f:
        reader = csv.DictReader(f)
        for row in reader:
            rid = row.get(id_col)
            if not rid:
                continue
            if id_pad:
                rid = rid.zfill(id_pad)
            rows[rid] = row
    return rows


def region_name(level_name, nih_row, rid):
    if level_name == "states":
        return nih_row.get("state_name") or rid
    if level_name == "counties":
        return nih_row.get("name") or rid
    # districts
    state = nih_row.get("state") or ""
    dd = rid[-2:]
    return f"{state}-{dd}" if state else rid


def build_row(level_name, rid, nih_row, nsf_row, has_rep):
    source_row = nih_row or nsf_row or {}
    name = region_name(level_name, source_row, rid)

    nih_econ = safe_float((nih_row or {}).get(NIH_FIELDS["econ_loss"]))
    nih_funding = safe_float((nih_row or {}).get(NIH_FIELDS["funding_cut"]))
    nih_jobs = safe_float((nih_row or {}).get(NIH_FIELDS["jobs_lost"]))

    nsf_econ = safe_float((nsf_row or {}).get(NSF_FIELDS["econ_loss"]))
    nsf_funding = safe_float((nsf_row or {}).get(NSF_FIELDS["funding_cut"]))
    nsf_jobs = safe_float((nsf_row or {}).get(NSF_FIELDS["jobs_lost"]))

    entry = {
        "id": rid,
        "name": name,
        "nih_econ_loss": round(nih_econ, 2),
        "nih_funding_cut": round(nih_funding, 2),
        "nih_jobs_lost": round(nih_jobs, 4),
        "nsf_econ_loss": round(nsf_econ, 2),
        "nsf_funding_cut": round(nsf_funding, 2),
        "nsf_jobs_lost": round(nsf_jobs, 4),
        "total_econ_loss": round(nih_econ + nsf_econ, 2),
        "total_funding_cut": round(nih_funding + nsf_funding, 2),
        "total_jobs_lost": round(nih_jobs + nsf_jobs, 4),
    }

    if has_rep:
        rep_name = source_row.get("rep_name") or ""
        rep_party = source_row.get("pol_party") or ""
        entry["rep_name"] = rep_name
        entry["rep_party"] = rep_party

    return entry


def main():
    os.makedirs(OUTPUT_DIR, exist_ok=True)

    for level_name, config in LEVELS.items():
        print(f"Processing {level_name}...")

        nih_rows = load_rows(config["nih_csv"], config["id_col"], config["id_pad"])
        print(f"  NIH: {len(nih_rows)} regions")

        nsf_rows = load_rows(config["nsf_csv"], config["id_col"], config["id_pad"])
        print(f"  NSF: {len(nsf_rows)} regions")

        all_ids = set(nih_rows.keys()) | set(nsf_rows.keys())
        rows = [
            build_row(level_name, rid, nih_rows.get(rid), nsf_rows.get(rid), config["has_rep"])
            for rid in sorted(all_ids)
        ]

        output_path = os.path.join(OUTPUT_DIR, f"table_fy27_{level_name}.json")
        with open(output_path, "w", encoding="utf-8") as f:
            json.dump(rows, f, separators=(",", ":"))

        print(f"  Merged: {len(rows)} regions -> {output_path}")

    print("\nDone!")


if __name__ == "__main__":
    main()
