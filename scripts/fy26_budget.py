"""
Generate MVT tiles for the FY2026 NIH budget-cut map.

Reads the current OSF FY2026 NIH outputs (project https://osf.io/h398e/,
folder output/): NIH_budget_state.csv, NIH_budget_county.csv, and
NIH_budget_cong.csv. SciMap_Maps has no FY26 output CSVs. The later OSF
folders 4-22-26 Data and 5-18-26 Data do not contain a newer FY26 extract.
NSF FY26 CSVs exist on OSF and are not part of this map: the page colors
and counts NIH loss only.

Territory rows are copied from the district file onto the state and county
maps with the at-large district polygon, same as baseline and FY27. The
current NIH file has the U.S. Virgin Islands only. American Samoa, Guam,
the Northern Mariana Islands, and Puerto Rico are absent. This script does
not invent those values.

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
DATA_DIR = os.path.join(PROJECT_ROOT, "data", "fy26")

TILE_VERSION = "v1"
VALUE_PREFIX = "budg_"


def drop_unused(df):
    """Drop log duplicates and index columns. The live tiles do not carry them."""
    drop = [
        column
        for column in df.columns
        if str(column).startswith("Unnamed") or str(column).endswith("_log")
    ]
    return df.drop(columns=drop)


def read_table(path):
    try:
        frame = pd.read_csv(path)
    except UnicodeDecodeError:
        frame = pd.read_csv(path, encoding="latin-1")
    return drop_unused(frame)


def pad_key(series, width):
    numeric = pd.to_numeric(series, errors="coerce")
    if numeric.isna().any():
        raise RuntimeError(f"Missing geographic ids in a {width}-digit key")
    return numeric.round().astype("int64").astype(str).str.zfill(width)


def fill_territory_state_codes(df, id_column):
    """Fill a blank state abbreviation from a known territory GEOID."""
    abbrev = {geoid: code for code, geoid in TERRITORY_DISTRICT_GEOIDS.items()}
    frame = df.copy()
    codes = frame[id_column].map(abbrev)
    if "state_code" not in frame.columns:
        frame["state_code"] = codes
        return frame
    blank = frame["state_code"].isna() | frame["state_code"].astype(str).isin(["", "nan"])
    frame.loc[blank, "state_code"] = codes[blank]
    return frame


def load_territory_district_data(district_config):
    """District geometries, plus NIH rows for territories that the source actually has."""
    territory_geoids = set(TERRITORY_DISTRICT_GEOIDS.values())
    all_geoms = load_geometries(
        district_config["geo"],
        district_config["geo_key"],
        geo_key_pad=district_config.get("geo_key_pad"),
    )
    territory_geoms = {key: value for key, value in all_geoms.items() if key in territory_geoids}
    assert_territory_geometries(territory_geoms)

    districts = read_table(district_config["csv"])
    districts["GEOID"] = pad_key(districts["GEOID"], 4)
    districts = fill_territory_state_codes(districts, "GEOID")
    territory = districts[districts["GEOID"].isin(territory_geoids)].copy()
    value_columns = [column for column in territory.columns if column.startswith(VALUE_PREFIX)]
    keep = ["GEOID", "state", "state_code", *value_columns]
    present = sorted(territory["GEOID"].astype(str))
    print(f"  Territory district rows in the NIH FY26 source: {', '.join(present) or 'none'}")
    missing = sorted(territory_geoids - set(present))
    if missing:
        print(
            "  No NIH FY26 row for "
            + ", ".join(missing)
            + ". Those territories are left off the map. Values are not invented."
        )
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
            "csv": os.path.join(DATA_DIR, "NIH_budget_state.csv"),
            "geo": geo_path("merged_data_states_CLIP.geojson"),
            "csv_key": "state_code",
            "geo_key": "state_code",
            "zoom": 7,
            "layer": "budget_state",
        },
        "counties": {
            "csv": os.path.join(DATA_DIR, "NIH_budget_county.csv"),
            "geo": geo_path("merged_data_counties_CLIP_Compress.geojson"),
            "csv_key": "FIPS",
            "geo_key": "FIPS",
            "csv_key_pad": 5,
            "geo_key_pad": 5,
            "zoom": 9,
            "layer": "budget_county",
        },
        "districts": {
            "csv": os.path.join(DATA_DIR, "NIH_budget_cong.csv"),
            "geo": geo_path("CongDist_shp_119"),
            "csv_key": "GEOID",
            "geo_key": "GEOID",
            "csv_key_pad": 4,
            "geo_key_pad": 4,
            "zoom": 9,
            "layer": "budget_congs",
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
    pad_width = config.get("csv_key_pad")
    if pad_width:
        frame[config["csv_key"]] = pad_key(frame[config["csv_key"]], pad_width)
    else:
        frame[config["csv_key"]] = frame[config["csv_key"]].astype(str)
    if name == "districts":
        frame = fill_territory_state_codes(frame, "GEOID")

    if name != "districts":
        print("Injecting territory rows that exist in the NIH FY26 district file...")
        frame, geometries = inject_territory_features(
            name, frame, geometries, config["csv_key"], territory_geoms, territory_df
        )

    geojson_data = build_geojson(frame, geometries, config["csv_key"])
    tile_name = f"tiles_{name}_budget26_{TILE_VERSION}"
    geojson_output = os.path.join(OUTPUT_DIR, f"budget26_{name}.geojson")
    save_geojson(geojson_data, geojson_output)
    generate_tiles(geojson_output, os.path.join(OUTPUT_DIR, tile_name), config["zoom"], config["layer"])
    print(f"Done: {name}. Publish {tile_name} with the AWS CLI. This generator does not upload.")


def main():
    print("Ensuring geo-reference data is cached...")
    download_geo_refs()
    levels = build_levels()
    for config in levels.values():
        if not os.path.exists(config["csv"]):
            raise SystemExit(f"Missing FY26 source CSV: {config['csv']}")

    print("\nPre-loading territory district data...")
    territory_geoms, territory_df = load_territory_district_data(levels["districts"])
    print(f"  Loaded {len(territory_geoms)} territory geometries, {len(territory_df)} territory rows")
    for name, config in levels.items():
        process_level(name, config, territory_geoms, territory_df)
    print("\nAll FY26 levels complete!")


if __name__ == "__main__":
    main()
