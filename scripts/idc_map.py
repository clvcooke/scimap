"""
Generate MVT tiles for the indirect-cost (IDC) map.

Reads SciMap_Maps output/IDC_state.csv, IDC_county.csv, and IDC_district.csv.
State and county maps reuse the at-large district polygon for a territory
when that territory has a district row. Guam, Puerto Rico, and the U.S.
Virgin Islands have rows. American Samoa and the Northern Mariana Islands
do not. This script does not invent those values. County rows whose FIPS
is already a territory (including Puerto Rico municipios) are dropped
before that injection so the map does not draw the territory twice.

Does not upload. Publish the new prefix with the AWS CLI.
"""

import os
import subprocess

import pandas as pd

from fy27_budget import (
    OUTPUT_DIR,
    TERRITORY_DISTRICT_GEOIDS,
    assert_territory_geometries,
    build_geojson,
    download_geo_refs,
    geo_path,
    inject_territory_features,
    load_geometries,
    save_geojson,
)

SCRIPT_DIR = os.path.dirname(os.path.abspath(__file__))
PROJECT_ROOT = os.path.join(SCRIPT_DIR, "..")
DATA_DIR = os.path.join(PROJECT_ROOT, "data", "idc")

TILE_VERSION = "v1"
VALUE_COLUMNS = ["IDC_loss", "IDC_econ_loss", "IDC_job_loss"]
# Real county FIPS prefixes. The map feature for these areas is the at-large
# district polygon, not the county polygon.
TERRITORY_COUNTY_PREFIXES = {"60", "66", "69", "72", "78"}

NAME_TO_ABBREV = {
    "Alabama": "AL",
    "Alaska": "AK",
    "Arizona": "AZ",
    "Arkansas": "AR",
    "California": "CA",
    "Colorado": "CO",
    "Connecticut": "CT",
    "Delaware": "DE",
    "District of Columbia": "DC",
    "Florida": "FL",
    "Georgia": "GA",
    "Hawaii": "HI",
    "Idaho": "ID",
    "Illinois": "IL",
    "Indiana": "IN",
    "Iowa": "IA",
    "Kansas": "KS",
    "Kentucky": "KY",
    "Louisiana": "LA",
    "Maine": "ME",
    "Maryland": "MD",
    "Massachusetts": "MA",
    "Michigan": "MI",
    "Minnesota": "MN",
    "Mississippi": "MS",
    "Missouri": "MO",
    "Montana": "MT",
    "Nebraska": "NE",
    "Nevada": "NV",
    "New Hampshire": "NH",
    "New Jersey": "NJ",
    "New Mexico": "NM",
    "New York": "NY",
    "North Carolina": "NC",
    "North Dakota": "ND",
    "Ohio": "OH",
    "Oklahoma": "OK",
    "Oregon": "OR",
    "Pennsylvania": "PA",
    "Rhode Island": "RI",
    "South Carolina": "SC",
    "South Dakota": "SD",
    "Tennessee": "TN",
    "Texas": "TX",
    "Utah": "UT",
    "Vermont": "VT",
    "Virginia": "VA",
    "Washington": "WA",
    "West Virginia": "WV",
    "Wisconsin": "WI",
    "Wyoming": "WY",
    "American Samoa": "AS",
    "Guam": "GU",
    "Northern Mariana Islands": "MP",
    "Puerto Rico": "PR",
    "Virgin Islands": "VI",
}


def drop_unused(df):
    drop = [column for column in df.columns if str(column).startswith("Unnamed") or str(column).endswith("_log")]
    return df.drop(columns=drop)


def read_table(path):
    frame = pd.read_csv(path)
    return drop_unused(frame)


def pad_key(series, width):
    numeric = pd.to_numeric(series, errors="coerce")
    if numeric.isna().any():
        raise RuntimeError(f"Missing geographic ids in a {width}-digit key")
    return numeric.round().astype("int64").astype(str).str.zfill(width)


def add_state_codes(df):
    """Map IDC state names onto the abbreviations the state geometry uses."""
    frame = df.copy()
    missing = sorted(set(frame["state"].astype(str)) - set(NAME_TO_ABBREV))
    if missing:
        raise RuntimeError("IDC state names have no abbreviation: " + ", ".join(missing))
    frame["state_code"] = frame["state"].map(NAME_TO_ABBREV)
    return frame


def drop_territory_counties(df):
    """Remove territory county rows so injection can add one polygon per territory."""
    frame = df.copy()
    frame["FIPS"] = pad_key(frame["FIPS"], 5)
    prefix = frame["FIPS"].str.slice(0, 2)
    dropped = int(prefix.isin(TERRITORY_COUNTY_PREFIXES).sum())
    print(f"  Dropped {dropped} territory county rows; the at-large district polygon replaces them")
    return frame[~prefix.isin(TERRITORY_COUNTY_PREFIXES)].copy()


def prepare_districts(df):
    """The district CSV calls the GEOID `FIPS`. The map reads `GEOID`."""
    frame = df.copy()
    frame["state"] = frame["state_name"]
    missing = sorted(set(frame["state"].astype(str)) - set(NAME_TO_ABBREV))
    if missing:
        raise RuntimeError("IDC district state names have no abbreviation: " + ", ".join(missing))
    frame["state_code"] = frame["state"].map(NAME_TO_ABBREV)
    frame["GEOID"] = frame["FIPS"]
    return frame.drop(columns=["FIPS", "state_name"])


def load_territory_district_data(district_config):
    territory_geoids = set(TERRITORY_DISTRICT_GEOIDS.values())
    all_geoms = load_geometries(
        district_config["geo"],
        district_config["geo_key"],
        geo_key_pad=district_config.get("geo_key_pad"),
    )
    territory_geoms = {key: value for key, value in all_geoms.items() if key in territory_geoids}
    assert_territory_geometries(territory_geoms)

    districts = prepare_districts(read_table(district_config["csv"]))
    districts["GEOID"] = pad_key(districts["GEOID"], 4)
    territory = districts[districts["GEOID"].isin(territory_geoids)].copy()
    present = sorted(territory["GEOID"].astype(str))
    print(f"  Territory district rows in the IDC source: {', '.join(present) or 'none'}")
    missing = sorted(territory_geoids - set(present))
    if missing:
        print(
            "  No IDC row for "
            + ", ".join(missing)
            + ". Those territories are left off the map. Values are not invented."
        )
    keep = ["GEOID", "state", "state_code", *VALUE_COLUMNS]
    return territory_geoms, territory[keep]


def generate_tiles(geojson_path, tile_output_dir, zoom, layer):
    os.makedirs(os.path.dirname(tile_output_dir), exist_ok=True)
    command = [
        "tippecanoe",
        f"-z{zoom}",
        "-e", tile_output_dir,
        "--drop-densest-as-needed",
        "--no-tile-size-limit",
        "--no-tile-compression",
        "-l", layer,
        "--force",
        geojson_path,
    ]
    print(f"  Running: {' '.join(command)}")
    result = subprocess.run(command)
    if result.returncode != 0:
        raise RuntimeError(f"tippecanoe failed with exit code {result.returncode}")
    print(f"  Tiles generated: {tile_output_dir}")


def build_levels():
    return {
        "states": {
            "csv": os.path.join(DATA_DIR, "IDC_state.csv"),
            "geo": geo_path("merged_data_states_CLIP.geojson"),
            "csv_key": "state_code",
            "geo_key": "state_code",
            "zoom": 7,
            "layer": "idc_state",
            "prepare": add_state_codes,
        },
        "counties": {
            "csv": os.path.join(DATA_DIR, "IDC_county.csv"),
            "geo": geo_path("merged_data_counties_CLIP_Compress.geojson"),
            "csv_key": "FIPS",
            "geo_key": "FIPS",
            "csv_key_pad": 5,
            "geo_key_pad": 5,
            "zoom": 9,
            "layer": "idc_county",
            "before_inject": drop_territory_counties,
        },
        "districts": {
            "csv": os.path.join(DATA_DIR, "IDC_district.csv"),
            "geo": geo_path("CongDist_shp_119"),
            "csv_key": "GEOID",
            "geo_key": "GEOID",
            "csv_key_pad": 4,
            "geo_key_pad": 4,
            "zoom": 9,
            "layer": "idc_district",
            "prepare": prepare_districts,
        },
    }


def process_level(name, config, territory_geoms, territory_df):
    print(f"\n{'=' * 60}")
    print(f"Processing: {name}")
    print(f"{'=' * 60}")

    geometries = load_geometries(
        config["geo"],
        config["geo_key"],
        geo_key_pad=config.get("geo_key_pad"),
    )
    print(f"  Loaded {len(geometries)} geometries")

    frame = read_table(config["csv"])
    if config.get("prepare"):
        frame = config["prepare"](frame)
    pad_width = config.get("csv_key_pad")
    if pad_width:
        frame[config["csv_key"]] = pad_key(frame[config["csv_key"]], pad_width)
    else:
        frame[config["csv_key"]] = frame[config["csv_key"]].astype(str)
    if name != "districts" and config.get("before_inject"):
        frame = config["before_inject"](frame)
        # The county drop already wrote the padded key. Pad again only if a
        # prepare step did not. before_inject for counties returns padded FIPS.
    if name != "districts":
        print("Injecting territory rows that exist in the IDC district file...")
        frame, geometries = inject_territory_features(
            name, frame, geometries, config["csv_key"], territory_geoms, territory_df
        )

    geojson_data = build_geojson(frame, geometries, config["csv_key"])
    tile_name = f"tiles_{name}_idc_{TILE_VERSION}"
    geojson_output = os.path.join(OUTPUT_DIR, f"idc_{name}.geojson")
    save_geojson(geojson_data, geojson_output)
    generate_tiles(geojson_output, os.path.join(OUTPUT_DIR, tile_name), config["zoom"], config["layer"])
    print(f"Done: {name}. Publish {tile_name} with the AWS CLI. This generator does not upload.")


def main():
    print("Ensuring geo-reference data is cached...")
    download_geo_refs()
    levels = build_levels()
    for config in levels.values():
        if not os.path.exists(config["csv"]):
            raise SystemExit(f"Missing IDC source CSV: {config['csv']}")

    print("\nPre-loading territory district data...")
    territory_geoms, territory_df = load_territory_district_data(levels["districts"])
    print(f"  Loaded {len(territory_geoms)} territory geometries, {len(territory_df)} territory rows")
    for name, config in levels.items():
        process_level(name, config, territory_geoms, territory_df)
    print("\nAll IDC levels complete!")


if __name__ == "__main__":
    main()
