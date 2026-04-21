"""
Generate FY27 report card JSONs from NIH + NSF budget CSVs.

Writes two files:
  - src/data/report_card_info_fy27.json       (district-keyed, e.g. "AL-01")
  - src/data/state_report_card_info_fy27.json (state-keyed, e.g. "AL")

Sources:
  - data/2027/FY2027 NIH Budget/NIH_budget27_cong.csv  (district NIH)
  - data/2027/FY2027 NSF Budget/NSF_budget27_cong.csv  (district NSF)
  - data/2027/FY2027 NIH Budget/top5inst_budg27_cong.csv
  - data/2027/FY2027 NIH Budget/NIH_budget27_state.csv  (state NIH)
  - data/2027/FY2027 NSF Budget/NSF_budget27_state.csv  (state NSF)
  - data/2027/FY2027 NIH Budget/top5inst_budg27_state.csv
  - src/data/report_card_info_fy26.json (reuse district/state bounds)

Institute-level breakdowns (NIA, NCI, NIAID) are not yet available for FY27,
so those fields are set to 0. The frontend handles this gracefully.
When institute-level data becomes available, update the CSVs and this script.
"""

import csv
import json
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
NIH_DATA_27 = ROOT / "data" / "2027" / "FY2027 NIH Budget"
NSF_DATA_27 = ROOT / "data" / "2027" / "FY2027 NSF Budget"
FY26_JSON = ROOT / "src" / "data" / "report_card_info_fy26.json"
OUTPUT = ROOT / "src" / "data" / "report_card_info_fy27.json"
STATE_OUTPUT = ROOT / "src" / "data" / "state_report_card_info_fy27.json"


def geoid_to_key(geoid_str: str) -> str:
    """Convert GEOID like '0101' to key like 'AL-01'."""
    # GEOID is state_fips (2 digits) + district (2 digits)
    padded = geoid_str.zfill(4)
    state_fips = padded[:2]
    district = padded[2:]
    state_code = FIPS_TO_STATE.get(state_fips)
    if state_code is None:
        return ""
    return f"{state_code}-{district}"


# FIPS code to state abbreviation
FIPS_TO_STATE = {
    "01": "AL", "02": "AK", "04": "AZ", "05": "AR", "06": "CA",
    "08": "CO", "09": "CT", "10": "DE", "11": "DC", "12": "FL",
    "13": "GA", "15": "HI", "16": "ID", "17": "IL", "18": "IN",
    "19": "IA", "20": "KS", "21": "KY", "22": "LA", "23": "ME",
    "24": "MD", "25": "MA", "26": "MI", "27": "MN", "28": "MS",
    "29": "MO", "30": "MT", "31": "NE", "32": "NV", "33": "NH",
    "34": "NJ", "35": "NM", "36": "NY", "37": "NC", "38": "ND",
    "39": "OH", "40": "OK", "41": "OR", "42": "PA", "44": "RI",
    "45": "SC", "46": "SD", "47": "TN", "48": "TX", "49": "UT",
    "50": "VT", "51": "VA", "53": "WA", "54": "WV", "55": "WI",
    "56": "WY", "60": "AS", "66": "GU", "69": "MP", "72": "PR",
    "78": "VI",
}


def main():
    # Load FY26 for bounds
    with open(FY26_JSON, encoding="utf-8") as f:
        fy26 = json.load(f)

    # Load district-level NIH totals
    districts = {}
    with open(NIH_DATA_27 / "NIH_budget27_cong.csv", encoding="utf-8") as f:
        for row in csv.DictReader(f):
            key = geoid_to_key(row["GEOID"])
            if not key:
                continue
            districts[key] = {
                "state": row["state_name"],
                "state_code": row["state"],
                "GEOID": int(row["GEOID"]),
                "CD119FP": row["GEOID"].zfill(4)[2:],
                "budg_NIH_cuts_econ_loss": float(row["econ_budg_NIH_cuts"]),
                "budg_NIH_cuts_job_loss": float(row["jobs_budg_NIH_cuts"]),
                "budg_NSF_cuts_econ_loss": 0.0,
                "budg_total_cuts_econ_loss": float(row["econ_budg_NIH_cuts"]),
                # Institute breakdowns not yet available for FY27
                "budg_NIA_cuts_econ_loss": 0,
                "budg_NCI_cuts_econ_loss": 0,
                "budg_NIAID_cuts_econ_loss": 0,
            }

    # Load district-level NSF totals and merge
    with open(NSF_DATA_27 / "NSF_budget27_cong.csv", encoding="utf-8") as f:
        for row in csv.DictReader(f):
            key = geoid_to_key(row["GEOID"])
            if not key or key not in districts:
                continue
            nsf_econ = float(row["econ_budg_NSF_cuts"])
            districts[key]["budg_NSF_cuts_econ_loss"] = nsf_econ
            districts[key]["budg_total_cuts_econ_loss"] = (
                districts[key]["budg_NIH_cuts_econ_loss"] + nsf_econ
            )

    # Load top 5 institutions per district
    top5_by_district: dict[str, list] = {}
    with open(NIH_DATA_27 / "top5inst_budg27_cong.csv", encoding="utf-8") as f:
        for row in csv.DictReader(f):
            key = geoid_to_key(row["GEOID"])
            if not key:
                continue
            if key not in top5_by_district:
                top5_by_district[key] = []
            top5_by_district[key].append({
                "org_name": row["org_name"],
                "budg_NIH_cuts_econ_loss": float(row["econ_budg_NIH_cuts"]),
                "budg_NIH_cuts_job_loss": float(row["jobs_budg_NIH_cuts"]),
                # Institute breakdowns not yet available
                "budg_NIA_cuts_econ_loss": 0,
                "budg_NCI_cuts_econ_loss": 0,
                "budg_NIAID_cuts_econ_loss": 0,
            })

    # Combine everything
    result = {}
    for key, district in districts.items():
        # Reuse bounds from FY26 (same 119th Congress districts)
        fy26_entry = fy26.get(key)
        if fy26_entry is None:
            print(f"Warning: no FY26 bounds for {key}, skipping")
            continue

        entry = {
            "district_bounds": fy26_entry["district_bounds"],
            "state_bounds": fy26_entry["state_bounds"],
            "top_five_impact": top5_by_district.get(key, []),
            **district,
        }
        result[key] = entry

    with open(OUTPUT, "w", encoding="utf-8") as f:
        json.dump(result, f)

    print(f"Generated {OUTPUT} with {len(result)} districts")

    state_result = build_state_result(result)
    with open(STATE_OUTPUT, "w", encoding="utf-8") as f:
        json.dump(state_result, f)
    print(f"Generated {STATE_OUTPUT} with {len(state_result)} states")


def build_state_result(districts: dict) -> dict:
    """Assemble state-level entries from state CSVs + reused bounds."""
    # state_bounds are identical across districts in the same state — grab
    # one per state from whatever district we already built.
    bounds_by_state: dict[str, dict] = {}
    name_by_code: dict[str, str] = {}
    for entry in districts.values():
        code = entry["state_code"]
        bounds_by_state.setdefault(code, entry["state_bounds"])
        name_by_code.setdefault(code, entry["state"])

    states: dict[str, dict] = {}

    with open(NIH_DATA_27 / "NIH_budget27_state.csv", encoding="utf-8") as f:
        for row in csv.DictReader(f):
            code = row["state"]
            if code not in bounds_by_state:
                continue
            states[code] = {
                "state": row["state_name"],
                "state_code": code,
                "state_bounds": bounds_by_state[code],
                "budg_NIH_cuts_econ_loss": float(row["econ_budg_NIH_cuts"]),
                "budg_NIH_cuts_job_loss": float(row["jobs_budg_NIH_cuts"]),
                "budg_NSF_cuts_econ_loss": 0.0,
                "budg_total_cuts_econ_loss": float(row["econ_budg_NIH_cuts"]),
                "budg_NIA_cuts_econ_loss": 0,
                "budg_NCI_cuts_econ_loss": 0,
                "budg_NIAID_cuts_econ_loss": 0,
                "top_five_impact": [],
            }

    with open(NSF_DATA_27 / "NSF_budget27_state.csv", encoding="utf-8") as f:
        for row in csv.DictReader(f):
            code = row["state"]
            if code not in states:
                continue
            nsf_econ = float(row["econ_budg_NSF_cuts"])
            states[code]["budg_NSF_cuts_econ_loss"] = nsf_econ
            states[code]["budg_total_cuts_econ_loss"] = (
                states[code]["budg_NIH_cuts_econ_loss"] + nsf_econ
            )

    # top5 per state is keyed by full state_name, not state code
    code_by_name = {v: k for k, v in name_by_code.items()}
    with open(NIH_DATA_27 / "top5inst_budg27_state.csv", encoding="utf-8") as f:
        for row in csv.DictReader(f):
            code = code_by_name.get(row["state_name"])
            if code is None or code not in states:
                continue
            states[code]["top_five_impact"].append({
                "org_name": row["org_name"],
                "budg_NIH_cuts_econ_loss": float(row["econ_budg_NIH_cuts"]),
                "budg_NIH_cuts_job_loss": float(row["jobs_budg_NIH_cuts"]),
                "budg_NIA_cuts_econ_loss": 0,
                "budg_NCI_cuts_econ_loss": 0,
                "budg_NIAID_cuts_econ_loss": 0,
            })

    return states


if __name__ == "__main__":
    main()
