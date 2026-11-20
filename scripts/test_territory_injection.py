import unittest

import pandas as pd

import baseline
import fy27_budget


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
        self.assertEqual(baseline.TILE_VERSION, "baseline-v10")
        self.assertEqual(fy27_budget.TILE_VERSION, "v7")

    def test_missing_required_geometry_fails(self):
        for module in (baseline, fy27_budget):
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
