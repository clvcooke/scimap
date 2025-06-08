import pandas as pd
import geopandas as gpd
import json
import os
import shutil
from subprocess import Popen, PIPE
from datetime import datetime
import tempfile

SCRIPT_DIR = os.path.dirname(os.path.abspath(__file__))
# Convert absolute paths to relative paths
REACT_DATA_DIR = os.path.join(SCRIPT_DIR, "..", "src", "data")
PROJECT_ROOT = SCRIPT_DIR

GITHUB_PAT = os.getenv("GITHUB_PAT")
assert GITHUB_PAT is not None, "GITHUB_PAT environment variable must be set"

INPUT_DIR = os.path.join(PROJECT_ROOT, "inputs")
FINAL_OUTPUT_DIR = os.path.join(PROJECT_ROOT, "outputs")

TERM_GRANTS_FILENAME = "terminated_points.csv"
COUNTY_TOTAL_FILENAME = "NIH_impact_county.csv"
STATE_TOTAL_FILENAME = "NIH_impact_state.csv"
CONGRESSIONAL_TOTAL_FILENAME = "NIH_impact_cong.csv"

STATE_TOTAL_LOSSES_OUTPUT_PATH = os.path.join(REACT_DATA_DIR, "state_total_losses.json")
TERMINATED_GRANTS_OUTPUT_PATH = os.path.join(REACT_DATA_DIR, "terminated_grants.json")

COUNTY_GEO_FILE = os.path.join(INPUT_DIR, "merged_data_counties_CLIP_Compress.geojson")
STATE_GEO_FILE = os.path.join(INPUT_DIR, "merged_data_states_CLIP.geojson")
CONGRESSIONAL_GEO_FILE = os.path.join(
    INPUT_DIR, "CongDist_shp/cb_2022_us_cd118_500k.shp"
)

COUNTY_OUTPUT_FILE = os.path.join(
    FINAL_OUTPUT_DIR, "merged_data_counties_total.geojson"
)
STATE_OUTPUT_FILE = os.path.join(FINAL_OUTPUT_DIR, "merged_data_states_total.geojson")
CONGRESSIONAL_OUTPUT_FILE = os.path.join(
    FINAL_OUTPUT_DIR, "merged_data_congs_total.geojson"
)

COLUMNS_TO_DROP_COUNTY = [
    "combined_loss_noself",
    "terminated_loss_log",
    "terminated_loss_noself_log",
    "terminated_econ_loss_log",
    "terminated_job_loss_log",
    "terminated_econ_loss_noself_log",
    "terminated_job_loss_noself_log",
    "IDC_loss_log",
    "IDC_econ_loss_log",
    "IDC_job_loss_log",
    "grant_funds_log",
    "grant_funds_econ_log",
    "combined_job_loss_log",
]


def fetch_latest_data():
    """
    Downloads the latest data from the Science-Impacts repository using shallow clone
    Returns the path to the temporary directory containing the data
    """
    # Create a temporary directory
    temp_dir = tempfile.mkdtemp()
    print("Getting fresh data...")
    clone_command = [
        "git",
        "clone",
        "--depth",
        "1",
        "--single-branch",
        "--branch",
        "main",
        f"https://{GITHUB_PAT}@github.com/mjharris95/Science-Impacts.git",
        temp_dir,
    ]

    process = Popen(clone_command).wait()
    print("Data downloaded")
    return temp_dir


def load_data(file_path, file_type="csv", encoding="latin-1", crs="epsg:4326"):
    if file_type == "csv":
        return pd.read_csv(file_path, encoding=encoding)
    elif file_type == "geo":
        gdf = gpd.read_file(file_path)
        if gdf.crs != crs:
            gdf = gdf.to_crs(crs)
        return gdf
    raise RuntimeError()


def merge_data(data_df, geo_df, on, columns):
    return pd.merge(data_df, geo_df[columns], on=on, how="left")


def create_geojson(gdf, columns_to_drop=None):
    if columns_to_drop is not None:
        gdf = gdf.drop(columns=columns_to_drop, errors="ignore")

    features = []
    for _, row in gdf.iterrows():
        if pd.notna(row["geometry"]):
            geometry = gpd.GeoSeries([row["geometry"]]).__geo_interface__["features"][
                0
            ]["geometry"]
            properties = row.drop("geometry").to_dict()
            features.append(
                {"type": "Feature", "geometry": geometry, "properties": properties}
            )

    return {"type": "FeatureCollection", "features": features}


def save_geojson(geojson_data, file_path):
    os.makedirs(os.path.dirname(file_path), exist_ok=True)
    with open(file_path, "w") as f:
        json.dump(geojson_data, f)


def process_county_data(data_folder):
    county_total_file = os.path.join(data_folder, "output", COUNTY_TOTAL_FILENAME)
    df_total_county = load_data(county_total_file)
    counties_gdf = load_data(COUNTY_GEO_FILE, file_type="geo")

    merged_gdf = merge_data(
        df_total_county, counties_gdf, on="FIPS", columns=["FIPS", "geometry"]
    )
    merged_gdf = gpd.GeoDataFrame(merged_gdf, geometry="geometry")

    geojson_data = create_geojson(merged_gdf, columns_to_drop=COLUMNS_TO_DROP_COUNTY)
    save_geojson(geojson_data, COUNTY_OUTPUT_FILE)


def process_state_data(data_folder):
    state_total_file = os.path.join(data_folder, "output", STATE_TOTAL_FILENAME)
    df_total_state = load_data(state_total_file)
    states_gdf = load_data(STATE_GEO_FILE, file_type="geo")

    merged_gdf = merge_data(
        df_total_state, states_gdf, on="state_code", columns=["state_code", "geometry"]
    )
    merged_gdf = gpd.GeoDataFrame(merged_gdf, geometry="geometry")

    geojson_data = create_geojson(merged_gdf)
    save_geojson(geojson_data, STATE_OUTPUT_FILE)
    return df_total_state


def process_congressional_data(data_folder):
    congressional_total_file = os.path.join(
        data_folder, "output", CONGRESSIONAL_TOTAL_FILENAME
    )
    df_total_cong = load_data(congressional_total_file)
    congs_gdf = load_data(CONGRESSIONAL_GEO_FILE, file_type="geo")
    congs_gdf["GEOID"] = congs_gdf["GEOID"].astype("int64")

    merged_gdf = merge_data(
        df_total_cong, congs_gdf, on="GEOID", columns=["GEOID", "geometry"]
    )
    merged_gdf = gpd.GeoDataFrame(merged_gdf, geometry="geometry")

    geojson_data = create_geojson(merged_gdf)
    save_geojson(geojson_data, CONGRESSIONAL_OUTPUT_FILE)


def tile_and_upload(version, area: str):
    output_folder = "outputs"
    os.makedirs(output_folder, exist_ok=True)
    process_command = f"tippecanoe -z7 -e tiles_{area}_total_v{version} --drop-densest-as-needed --no-tile-size-limit --no-tile-compression {output_folder}/merged_data_{area}_total.geojson"
    upload_command = f"rclone copy tiles_{area}_total_v{version}/ r2:scimap-data/tiles_{area}_total_v{version}/ --transfers 32"
    Popen(process_command, shell=True).wait()
    Popen(upload_command, shell=True).wait()


def generate_state_totals(state_dataframe):
    state_losses = {}
    for f in state_dataframe.to_dict("records"):
        state_losses[f["state"]] = {
            "state_code": f["state_code"],
            "idc_loss": f["IDC_econ_loss"],
            "term_loss": f["terminated_econ_loss"],
            "idc_job_loss": f["IDC_job_loss"],
            "term_job_loss": f["terminated_job_loss"],
        }
    with open(STATE_TOTAL_LOSSES_OUTPUT_PATH, "w") as fp:
        json.dump({"STATE_LOSSES": state_losses}, fp)


def generate_terminated_grants(data_dir):
    terminated_grants_filepath = os.path.join(data_dir, "output", TERM_GRANTS_FILENAME)
    grant_losses = []
    for grant in pd.read_csv(terminated_grants_filepath, encoding="latin-1").to_dict(
        "records"
    ):
        grant_losses.append(grant)
    with open(TERMINATED_GRANTS_OUTPUT_PATH, "w") as fp:
        json.dump({"GRANT_LOSSES": grant_losses}, fp)


def generate_tile_version_file(data_version):
    with open(os.path.join(REACT_DATA_DIR, "tile_version.json"), "w") as fp:
        json.dump({"TILE_VERSION": data_version}, fp)


if __name__ == "__main__":
    temp_data_dir = fetch_latest_data()
    date_version = datetime.now().strftime("%Y-%m-%d")

    print("Processing raw data into GeoJSONs")
    process_county_data(temp_data_dir)
    state_total_dataframe = process_state_data(temp_data_dir)
    process_congressional_data(temp_data_dir)

    print("Generating summary files")
    generate_state_totals(state_total_dataframe)
    generate_terminated_grants(temp_data_dir)

    # print("Tiling and Uploading")
    # tile_and_upload(date_version, "counties")
    # tile_and_upload(date_version, "states")
    # tile_and_upload(date_version, "congs")
    generate_tile_version_file(date_version)

    shutil.rmtree(temp_data_dir)
