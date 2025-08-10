import pandas as pd
import geopandas as gpd
import json
import os
import subprocess
from datetime import datetime, timezone, timedelta

import boto3
import requests
import yaml

SCRIPT_DIR = os.path.dirname(os.path.abspath(__file__))
# Convert absolute paths to relative paths
REACT_DATA_DIR = os.path.join(SCRIPT_DIR, "..", "src", "data")
PROJECT_ROOT = SCRIPT_DIR

AWS_ACCESS_KEY_ID = os.getenv("AWS_ACCESS_KEY_ID")
AWS_SECRET_ACCESS_KEY = os.getenv("AWS_SECRET_KEY")

assert AWS_SECRET_ACCESS_KEY is not None
assert AWS_ACCESS_KEY_ID is not None

INPUT_DIR = os.path.join(PROJECT_ROOT, "inputs")
FINAL_OUTPUT_DIR = os.path.join(PROJECT_ROOT, "outputs")

TERM_GRANTS_FILENAME = "terminated_points.csv"
COUNTY_TOTAL_FILENAME = "NIH_impact_county.csv"
STATE_TOTAL_FILENAME = "NIH_impact_state.csv"
CONGRESSIONAL_TOTAL_FILENAME = "NIH_impact_cong.csv"

TOP_FIVE_CONG_IMPACT = "inputs/cong_NIH_top5inst.csv"
NIH_BUDGET_CONG = "inputs/NIH_budget_cong_119.csv"

STATE_TOTAL_LOSSES_OUTPUT_PATH = os.path.join(REACT_DATA_DIR, "state_total_losses.json")
TERMINATED_GRANTS_OUTPUT_PATH = os.path.join(REACT_DATA_DIR, "terminated_grants.json")

COUNTY_GEO_FILE = os.path.join(INPUT_DIR, "merged_data_counties_CLIP_Compress.geojson")
STATE_GEO_FILE = os.path.join(INPUT_DIR, "merged_data_states_CLIP.geojson")
CONGRESSIONAL_GEO_FILE = os.path.join(
    INPUT_DIR, "CongDist_shp_119/Congressional_Districts.shp"
)

COUNTY_OUTPUT_FILE = os.path.join(
    FINAL_OUTPUT_DIR, "merged_data_counties_total.geojson"
)
DISTRICT_INFO_OUTPUT_PATH = os.path.join(
    FINAL_OUTPUT_DIR, "district_info.json"
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
    temp_dir = "/home/colin/data/scimap"
    output_dir = os.path.join(temp_dir, "output")
    os.makedirs(output_dir, exist_ok=True)
    print("Getting fresh data...")
    # Initialize S3 client
    s3_client = boto3.client('s3',
                             aws_access_key_id=AWS_ACCESS_KEY_ID,
                             aws_secret_access_key=AWS_SECRET_ACCESS_KEY,
                             region_name='us-east-2')
    bucket_name = 'weitz-sciimpacts-hhs-pdf'
    today = datetime.now(timezone.utc).strftime('%Y-%m-%d')
    dir_response = s3_client.list_objects_v2(
        Bucket=bucket_name,
        Delimiter='/',
        Prefix=f"{today}"
    )
    target_date = today
    # If no directory for today, try yesterday
    if 'CommonPrefixes' not in dir_response or not dir_response['CommonPrefixes']:
        yesterday = (datetime.now(timezone.utc) - timedelta(days=1)).strftime('%Y-%m-%d')
        print(f"No data found for today ({today}), trying yesterday ({yesterday})")
        dir_response = s3_client.list_objects_v2(
            Bucket=bucket_name,
            Delimiter='/',
            Prefix=f"{yesterday}"
        )
        target_date = yesterday
        if 'CommonPrefixes' not in dir_response or not dir_response['CommonPrefixes']:
            raise Exception(f"No directories found for today ({today}) or yesterday ({yesterday})")

    # Get the latest directory for today
    latest_prefix = dir_response['CommonPrefixes'][-1]['Prefix']
    print(f"Latest prefix: {latest_prefix}")

    files_response = s3_client.list_objects_v2(
        Bucket=bucket_name,
        Prefix=latest_prefix
    )

    print("\nContents of latest directory:")
    if 'Contents' in files_response:
        for item in files_response['Contents']:
            file_name = item['Key'].replace(latest_prefix, '')
            size_mb = item['Size'] / (1024 * 1024)  # Convert to MB
            print(f"├── {file_name} ({size_mb:.2f} MB)")
    else:
        print("Directory is empty")

    files_to_download = [
        'terminated_points.csv',
        'NIH_impact_state.csv',
        'NIH_impact_county.csv',
        'NIH_impact_cong.csv'
    ]

    for file_name in files_to_download:
        s3_path = f"{latest_prefix}{file_name}"
        local_path = os.path.join(output_dir, file_name)
        print(f"Downloading {s3_path}...")
        try:
            s3_client.download_file(bucket_name, s3_path, local_path)
        except s3_client.exceptions.NoSuchKey:
            raise Exception(f"File {file_name} not found in S3 path: {s3_path}")

    print("Data downloaded")
    return temp_dir, f"{target_date}-v2"


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
    return df_total_state, merged_gdf


def process_congressional_data(data_folder):
    congressional_total_file = os.path.join(
        data_folder, "output", CONGRESSIONAL_TOTAL_FILENAME
    )
    df_total_cong = load_data(congressional_total_file)
    congs_gdf = load_data(CONGRESSIONAL_GEO_FILE, file_type="geo")
    congs = gpd.read_file('inputs/CongDist_shp_119/Congressional_Districts.shp')
    congs = congs[congs["GEOID"] != "09ZZ"]
    congs = congs[congs["GEOID"] != "17ZZ"]
    congs = congs[congs["GEOID"] != "33ZZ"]
    congs_gdf["GEOID"] = congs["GEOID"].astype("int64")

    merged_gdf = merge_data(
        df_total_cong, congs_gdf, on="GEOID", columns=["GEOID", "geometry", "CD119FP"]
    )
    merged_gdf = gpd.GeoDataFrame(merged_gdf, geometry="geometry")

    geojson_data = create_geojson(merged_gdf)
    save_geojson(geojson_data, CONGRESSIONAL_OUTPUT_FILE)
    return merged_gdf


def tile_and_upload(version, area: str):
    print(f"Processing tiles: {area}")
    if area == "congs":
        geojson_path = CONGRESSIONAL_OUTPUT_FILE
    elif area == "states":
        geojson_path = STATE_OUTPUT_FILE
    elif area == "counties":
        geojson_path = COUNTY_OUTPUT_FILE
    else:
        raise RuntimeError("Invalid area")
    process_command = f"tippecanoe -z7 -e tiles_{area}_total_v{version} --drop-densest-as-needed --no-tile-size-limit --no-tile-compression {geojson_path}"
    process_response_code = subprocess.run(process_command, shell=True).returncode
    print(f"Completed processing with response code of: {process_response_code}")
    if process_response_code != 0:
        raise RuntimeError("Unable to process tiles")
    print(f"Uploading tiles: {area}")
    upload_command = f"rclone copy tiles_{area}_total_v{version}/ r2:scimap-data/tiles_{area}_total_v{version}/ --transfers 32"
    upload_response_code = subprocess.run(upload_command, shell=True).returncode
    if upload_response_code != 0:
        raise RuntimeError("Unable to upload tiles")
    print(f"Completed upload process with response code of: {upload_response_code}")


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


def generate_district_info(congression_geojson, state_geojson):
    all_info = {}
    top_nih_cong = pd.read_csv(TOP_FIVE_CONG_IMPACT)
    fy26_budg = pd.read_csv(NIH_BUDGET_CONG)
    fy26_budg["GEOID"] = fy26_budg["GEOID"].astype("int64")
    for row in congression_geojson.to_dict("records"):
        state_code = row["state_code"]
        district_num = row["CD119FP"]
        district_geometry = row["geometry"]
        GEOID = row["GEOID"]
        filtered_data = top_nih_cong[top_nih_cong['GEOID'] == int(GEOID)]
        filtered_budg = fy26_budg[fy26_budg['GEOID'] == int(GEOID)].iloc[0]
        top_district_data = filtered_data.to_dict(orient='records')
        state_row = state_geojson[state_geojson["state_code"] == state_code].iloc[0]
        state_geometry = state_row["geometry"]

        district_bounds = district_geometry.bounds
        state_bounds = state_geometry.bounds

        row_without_geometry = row.copy()
        del row_without_geometry['geometry']

        district_info = {
            "district_bounds": {
                "min_lng": district_bounds[0],
                "min_lat": district_bounds[1],
                "max_lng": district_bounds[2],
                "max_lat": district_bounds[3]
            },
            "state_bounds": {
                "min_lng": state_bounds[0],
                "min_lat": state_bounds[1],
                "max_lng": state_bounds[2],
                "max_lat": state_bounds[3]
            },
            "top_five_impact": top_district_data,
            **row_without_geometry,
            "budg_NIH_cuts_econ_loss": filtered_budg["budg_NIH_cuts_econ_loss"],
            "budg_NIH_cuts_job_loss": filtered_budg["budg_NIH_cuts_job_loss"],
            "budg_NIA_cuts_econ_loss": filtered_budg["budg_NIA_cuts_econ_loss"],
            "budg_NCI_cuts_econ_loss": filtered_budg["budg_NCI_cuts_econ_loss"],
            "budg_NIAID_cuts_econ_loss": filtered_budg["budg_NIAID_cuts_econ_loss"]
        }

        all_info[f"{state_code}-{district_num}"] = district_info
    with open(os.path.join(REACT_DATA_DIR, "report_card_info.json"), "w") as fp:
        json.dump(all_info, fp)
    return all_info


def generate_terminated_grants(data_dir):
    terminated_grants_filepath = os.path.join(data_dir, "output", TERM_GRANTS_FILENAME)
    grant_losses = []
    for grant in pd.read_csv(terminated_grants_filepath, encoding="latin-1").to_dict(
            "records"
    ):
        if isinstance(grant["org_name"], str):
            grant_losses.append(grant)
        else:
            print("Bad grant values...")
            print(grant)
    with open(TERMINATED_GRANTS_OUTPUT_PATH, "w") as fp:
        json.dump({"GRANT_LOSSES": grant_losses}, fp)


def generate_tile_version_file(data_version):
    # Data version of the from YYYY-mm-DD-{v}
    date = "-".join(data_version.split("-")[0:3])
    with open(os.path.join(REACT_DATA_DIR, "tile_version.json"), "w") as fp:
        json.dump({"TILE_VERSION": date}, fp)

def generate_legislatures():
    # URL of the YAML file
    url = "https://raw.githubusercontent.com/unitedstates/congress-legislators/refs/heads/main/legislators-current.yaml"
    # Fetch the content from the URL
    try:
        response = requests.get(url)
        # Raise an exception if the request was unsuccessful
        response.raise_for_status()

        # Load the YAML content directly from the response text
        data = yaml.safe_load(response.text)
        reps_by_district = {}
        sen_by_state = {}

        for d in data:
            current_term = d['terms'][-1]
            state = current_term['state']
            if current_term['type'] == 'sen':
                if state not in sen_by_state:
                    sen_by_state[state] = {}
                sen_by_state[state][current_term['state_rank']] = {
                    "name": d['name']["official_full"],
                    "party": current_term['party'],
                }
            else:
                reps_by_district[f"{state}-{current_term['district']:02d}"] = {
                    'name': d['name']["official_full"],
                    'party': current_term['party'],
                }
        with open(os.path.join(REACT_DATA_DIR, "legislators.json"),"w") as fp:
            json.dump({
                "reps": reps_by_district,
                "sens": sen_by_state,
            }, fp)
    except requests.exceptions.RequestException as e:
        print(f"Error fetching the URL: {e}")
    except yaml.YAMLError as e:
        print(f"Error parsing the YAML file: {e}")

if __name__ == "__main__":
    temp_data_dir, date_version = fetch_latest_data()

    print("Processing raw data into GeoJSONs")
    process_county_data(temp_data_dir)
    state_total_dataframe, states_gdf = process_state_data(temp_data_dir)
    process_congressional_data(temp_data_dir)
    congressional_gdf = process_congressional_data(temp_data_dir)

    print("Generating summary files")
    generate_state_totals(state_total_dataframe)
    generate_terminated_grants(temp_data_dir)
    generate_district_info(congressional_gdf, states_gdf)
    print("Generating legislators")
    generate_legislatures()

    # print("Tiling and Uploading")
    # tile_and_upload(date_version, "counties")
    # tile_and_upload(date_version, "states")
    # tile_and_upload(date_version, "congs")
    # generate_tile_version_file(date_version)

    # shutil.rmtree(temp_data_dir)
