"""
Fetch current US legislators from the unitedstates/congress-legislators
GitHub repository and generate src/data/legislators.json.

Requires: requests, pyyaml
Usage: python scripts/update_legislators.py
"""

import json
from collections import defaultdict
from pathlib import Path

import requests
import yaml

SOURCE_URL = "https://raw.githubusercontent.com/unitedstates/congress-legislators/main/legislators-current.yaml"
OUTPUT = Path(__file__).resolve().parent.parent / "src" / "data" / "legislators.json"


def get_official_name(name_obj: dict) -> str:
    """Get the official full name, falling back to first + last."""
    return name_obj.get("official_full") or f"{name_obj['first']} {name_obj['last']}"


def first_senate_start(legislator: dict) -> str:
    """Return the start date of this person's first Senate term."""
    for term in legislator["terms"]:
        if term["type"] == "sen":
            return term["start"]
    return "9999-01-01"


def main():
    print(f"Fetching legislators from {SOURCE_URL} ...")
    resp = requests.get(SOURCE_URL, timeout=30)
    resp.raise_for_status()
    legislators = yaml.safe_load(resp.text)
    print(f"Fetched {len(legislators)} legislators")

    reps: dict[str, dict] = {}
    senators_by_state: dict[str, list[dict]] = defaultdict(list)

    for leg in legislators:
        current_term = leg["terms"][-1]
        name = get_official_name(leg["name"])
        party = current_term["party"]

        if current_term["type"] == "rep":
            state = current_term["state"]
            district = current_term["district"]
            key = f"{state}-{str(district).zfill(2)}"
            reps[key] = {"name": name, "party": party}

        elif current_term["type"] == "sen":
            state = current_term["state"]
            senators_by_state[state].append({
                "name": name,
                "party": party,
                "first_senate_start": first_senate_start(leg),
            })

    # Determine junior/senior senators per state
    # Senior = longer tenure (earlier first senate term start)
    sens: dict[str, dict] = {}
    for state, state_sens in sorted(senators_by_state.items()):
        state_sens.sort(key=lambda s: s["first_senate_start"])
        senior = state_sens[0]  # earliest start = most senior
        junior = state_sens[1] if len(state_sens) > 1 else {"name": "", "party": ""}
        sens[state] = {
            "junior": {"name": junior["name"], "party": junior["party"]},
            "senior": {"name": senior["name"], "party": senior["party"]},
        }

    result = {"reps": dict(sorted(reps.items())), "sens": dict(sorted(sens.items()))}

    OUTPUT.write_text(json.dumps(result), encoding="utf-8")
    print(f"Wrote {len(reps)} reps and {len(sens)} senator groups to {OUTPUT}")


if __name__ == "__main__":
    main()
