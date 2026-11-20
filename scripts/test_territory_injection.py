import unittest

import pandas as pd

import baseline
import fy26_budget
import fy27_budget
import idc_map


EXPECTED = {
    "AS": "6098",
    "GU": "6698",
    "MP": "6998",
    "PR": "7298",
    "VI": "7898",
}


def territory_frame(module):
    geoids = list(module.TERRITORY_DISTRICT_GEOIDS.values())
    geoms = {geoid: {"type": "Polygon", "coordinates": []} for geoid in geoids}
    frame = pd.DataFrame({"GEOID": geoids, "econ": range(len(geoids))})
    return geoms, frame


class TerritoryInjectionTests(unittest.TestCase):
    def test_both_generators_cover_the_same_five_territories(self):
        self.assertEqual(baseline.TERRITORY_DISTRICT_GEOIDS, EXPECTED)
        self.assertEqual(fy27_budget.TERRITORY_DISTRICT_GEOIDS, EXPECTED)
        self.assertEqual(fy26_budget.TERRITORY_DISTRICT_GEOIDS, EXPECTED)
        self.assertEqual(idc_map.TERRITORY_DISTRICT_GEOIDS, EXPECTED)

    def test_missing_required_geometry_fails(self):
        for module in (baseline, fy27_budget, fy26_budget, idc_map):
            with self.subTest(module=module.__name__):
                present = {geoid: {} for geoid in EXPECTED.values() if geoid != "6698"}
                with self.assertRaises(RuntimeError) as caught:
                    module.assert_territory_geometries(present)
                self.assertIn("GU (6698)", str(caught.exception))

    def test_injection_adds_guam_to_state_and_county_outputs(self):
        for module in (baseline, fy27_budget):
            with self.subTest(module=module.__name__):
                geoms, frame = territory_frame(module)
                state_rows = pd.DataFrame({"state": ["MD", "PR"], "econ": [1, 9]})
                state_geoms = {"MD": {"type": "Polygon", "coordinates": []}}
                states, state_out = module.inject_territory_features(
                    "states", state_rows, state_geoms, "state", geoms, frame
                )
                self.assertEqual(list(states["state"]).count("GU"), 1)
                self.assertEqual(list(states["state"]).count("PR"), 1)
                self.assertIn("GU", state_out)
                self.assertEqual(state_out["GU"], geoms["6698"])

                county_rows = pd.DataFrame({
                    "FIPS": ["24001", "66010"],
                    "state": ["MD", "GU"],
                    "econ": [1, 9],
                })
                county_geoms = {"24001": {"type": "Polygon", "coordinates": []}}
                counties, county_out = module.inject_territory_features(
                    "counties", county_rows, county_geoms, "FIPS", geoms, frame
                )
                fips = set(counties["FIPS"].astype(str))
                self.assertIn("6698", fips)
                self.assertNotIn("66010", fips)
                self.assertIn("6698", county_out)

    def test_injected_features_keep_district_population(self):
        geoms, frame = territory_frame(baseline)
        frame["pop_2024"] = [49710, 153836, 47329, 3285874, 87146]
        state_rows = pd.DataFrame({"state": ["MD"], "econ": [1], "pop_2024": [6245314]})
        states, _geometries = baseline.inject_territory_features(
            "states", state_rows, {}, "state", geoms, frame
        )
        guam = states[states["state"] == "GU"].iloc[0]
        self.assertEqual(int(guam["pop_2024"]), 153836)

        county_rows = pd.DataFrame({
            "FIPS": ["24001"],
            "state": ["MD"],
            "econ": [1],
            "pop_2024": [1000],
        })
        counties, _geometries = baseline.inject_territory_features(
            "counties", county_rows, {}, "FIPS", geoms, frame
        )
        guam_county = counties[counties["FIPS"].astype(str) == "6698"].iloc[0]
        self.assertEqual(int(guam_county["pop_2024"]), 153836)

    def test_attach_territory_population_uses_census_counts(self):
        frame = pd.DataFrame({"GEOID": ["6098", "6698", "6998", "7298", "7898"]})
        attached = baseline.attach_territory_population(frame)
        populations = {
            str(row.GEOID): int(row.pop_2024) for row in attached.itertuples(index=False)
        }
        self.assertEqual(populations, {
            "6098": 49710,
            "6698": 153836,
            "6998": 47329,
            "7298": 3285874,
            "7898": 87146,
        })

    def test_county_population_joins_unpadded_fips(self):
        counties = pd.DataFrame({"FIPS": ["6037", "6059", "6111", "24001"]})
        joined = baseline.join_population("counties", baseline.build_levels()["counties"], counties)
        self.assertEqual(list(joined["FIPS"]), ["6037", "6059", "6111", "24001"])
        populations = dict(zip(joined["FIPS"], joined["pop_2024"].astype(int)))
        self.assertEqual(populations["6037"], 9757179)
        self.assertEqual(populations["6059"], 3170435)
        self.assertEqual(populations["6111"], 835427)

    def test_fy26_drops_log_columns(self):
        frame = pd.DataFrame({
            "budg_NIH_cuts": [1.0],
            "budg_NIH_cuts_log": [2.0],
            "state": ["Maryland"],
        })
        kept = fy26_budget.drop_unused(frame)
        self.assertIn("budg_NIH_cuts", kept.columns)
        self.assertNotIn("budg_NIH_cuts_log", kept.columns)

    def test_fy26_fills_blank_territory_state_code(self):
        frame = pd.DataFrame({"GEOID": ["7898", "1101"], "state_code": [None, "DC"]})
        filled = fy26_budget.fill_territory_state_codes(frame, "GEOID")
        self.assertEqual(filled.loc[filled["GEOID"] == "7898", "state_code"].iloc[0], "VI")
        self.assertEqual(filled.loc[filled["GEOID"] == "1101", "state_code"].iloc[0], "DC")

    def test_idc_state_names_map_to_abbreviations(self):
        frame = pd.DataFrame({"state": ["Guam", "Puerto Rico", "Virgin Islands", "Maryland"]})
        coded = idc_map.add_state_codes(frame)
        self.assertEqual(list(coded["state_code"]), ["GU", "PR", "VI", "MD"])

    def test_idc_unknown_state_name_fails(self):
        frame = pd.DataFrame({"state": ["Maryland", "Not A State"]})
        with self.assertRaises(RuntimeError):
            idc_map.add_state_codes(frame)

    def test_idc_county_rows_drop_territory_prefixes(self):
        frame = pd.DataFrame({
            "FIPS": ["24001", "66010", "72013", "78030", "60010", "69110"],
            "name": ["Anne Arundel", "Guam", "Arecibo", "St. Thomas", "Eastern", "Saipan"],
        })
        kept = idc_map.drop_territory_counties(frame)
        self.assertEqual(list(kept["FIPS"]), ["24001"])

    def test_empty_data_row_is_skipped(self):
        geoms, frame = territory_frame(baseline)
        frame = frame[frame["GEOID"] != "7898"]
        state_rows = pd.DataFrame({"state": ["MD"], "econ": [1]})
        states, _geometries = baseline.inject_territory_features(
            "states", state_rows, {}, "state", geoms, frame
        )
        self.assertNotIn("VI", set(states["state"]))
        self.assertIn("GU", set(states["state"]))


if __name__ == "__main__":
    unittest.main()
