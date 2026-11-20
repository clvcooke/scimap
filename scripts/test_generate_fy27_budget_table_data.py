import csv
import json
from pathlib import Path
import tempfile
import unittest
from unittest.mock import patch

import generate_fy27_budget_table_data as fy27_tables


def write_csv(path, fieldnames, rows):
    path.parent.mkdir(parents=True, exist_ok=True)
    with path.open("w", newline="") as handle:
        writer = csv.DictWriter(handle, fieldnames=fieldnames)
        writer.writeheader()
        writer.writerows(rows)


class Fy27TerritoryTableTests(unittest.TestCase):
    def test_retired_connecticut_counties_drop_and_missing_state_comes_from_district(self):
        nih_fields = ["budg_NIH_cuts", "econ_budg_NIH_cuts", "jobs_budg_NIH_cuts"]
        nsf_fields = ["budg_NSF_cuts", "econ_budg_NSF_cuts", "jobs_budg_NSF_cuts"]
        with tempfile.TemporaryDirectory() as directory:
            root = Path(directory)
            nih_dir = root / "nih"
            nsf_dir = root / "nsf"
            write_csv(
                nih_dir / "NIH_budget27_state.csv",
                ["state", "state_name", *nih_fields],
                [{"state": "PR", "state_name": "Puerto Rico", "budg_NIH_cuts": "1", "econ_budg_NIH_cuts": "10", "jobs_budg_NIH_cuts": "0.1"}],
            )
            write_csv(
                nsf_dir / "NSF_budget27_state.csv",
                ["state", "state_name", *nsf_fields],
                [{"state": "PR", "state_name": "Puerto Rico", "budg_NSF_cuts": "2", "econ_budg_NSF_cuts": "20", "jobs_budg_NSF_cuts": "0.2"}],
            )
            write_csv(
                nih_dir / "NIH_budget27_county.csv",
                ["FIPS", "name", *nih_fields],
                [{"FIPS": "09190", "name": "Western Connecticut", "budg_NIH_cuts": "3", "econ_budg_NIH_cuts": "30", "jobs_budg_NIH_cuts": "0.3"}],
            )
            write_csv(
                nsf_dir / "NSF_budget27_county.csv",
                ["FIPS", "name", *nsf_fields],
                [{"FIPS": "09190", "name": "Western Connecticut", "budg_NSF_cuts": "4", "econ_budg_NSF_cuts": "40", "jobs_budg_NSF_cuts": "0.4"}],
            )
            write_csv(
                nih_dir / "NIH_budget27_cong.csv",
                ["GEOID", "state", *nih_fields],
                [{"GEOID": "7298", "state": "PR", "budg_NIH_cuts": "1", "econ_budg_NIH_cuts": "10", "jobs_budg_NIH_cuts": "0.1"}],
            )
            write_csv(
                nsf_dir / "NSF_budget27_cong.csv",
                ["GEOID", "state", *nsf_fields],
                [
                    {"GEOID": "6998", "state": "NA", "budg_NSF_cuts": "5", "econ_budg_NSF_cuts": "263130.34", "jobs_budg_NSF_cuts": "0.5"},
                    {"GEOID": "7298", "state": "PR", "budg_NSF_cuts": "2", "econ_budg_NSF_cuts": "20", "jobs_budg_NSF_cuts": "0.2"},
                ],
            )
            levels = {
                "states": {**fy27_tables.LEVELS["states"], "nih_csv": str(nih_dir / "NIH_budget27_state.csv"), "nsf_csv": str(nsf_dir / "NSF_budget27_state.csv")},
                "counties": {**fy27_tables.LEVELS["counties"], "nih_csv": str(nih_dir / "NIH_budget27_county.csv"), "nsf_csv": str(nsf_dir / "NSF_budget27_county.csv")},
                "districts": {**fy27_tables.LEVELS["districts"], "nih_csv": str(nih_dir / "NIH_budget27_cong.csv"), "nsf_csv": str(nsf_dir / "NSF_budget27_cong.csv")},
            }
            with patch.object(fy27_tables, "LEVELS", levels), patch.object(fy27_tables, "OUTPUT_DIR", str(root)):
                fy27_tables.main()

            states = {row["id"]: row for row in json.loads((root / "table_fy27_states.json").read_text())}
            counties = {row["id"]: row for row in json.loads((root / "table_fy27_counties.json").read_text())}
            districts = {row["id"]: row for row in json.loads((root / "table_fy27_districts.json").read_text())}
            self.assertEqual(set(states), {"MP", "PR"})
            self.assertNotIn("NA", states)
            self.assertEqual(states["MP"]["name"], "Northern Mariana Islands")
            self.assertEqual(states["MP"]["nih_econ_loss"], 0)
            self.assertEqual(states["MP"]["nsf_econ_loss"], 263130.34)
            self.assertEqual(states["PR"]["nsf_econ_loss"], 20)
            self.assertEqual(districts["6998"]["name"], "MP-98")
            self.assertEqual(set(counties), {"09190"})
            self.assertNotIn("09001", counties)

    def test_northern_mariana_state_code_na_is_renamed_once(self):
        renamed = fy27_tables.canonicalize_northern_mariana_state({
            "NA": {"state": "NA", "state_name": "Northern Mariana", "econ_budg_NSF_cuts": "263130.34"},
            "PR": {"state": "PR", "state_name": "Puerto Rico"},
        })
        self.assertEqual(set(renamed), {"MP", "PR"})
        self.assertEqual(renamed["MP"]["state_name"], "Northern Mariana Islands")
        rows = fy27_tables.append_district_only_territory_states(
            [fy27_tables.build_row("states", "MP", renamed["MP"], renamed["MP"], False)],
            {},
            {"6998": {"state": "NA", "econ_budg_NSF_cuts": "263130.34", "budg_NSF_cuts": "1", "jobs_budg_NSF_cuts": "1"}},
        )
        self.assertEqual([row["id"] for row in rows], ["MP"])


if __name__ == "__main__":
    unittest.main()
