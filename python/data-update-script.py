import pandas as pd
import geopandas as gpd
import json
import os
from subprocess import Popen
from datetime import datetime

BASE_DIR = os.path.expanduser("~/code/scimap-data")
OUTPUT_DIR = os.path.join(BASE_DIR, "Science-Impacts", "output")
INPUT_DIR = os.path.join(BASE_DIR, "inputs")
FINAL_OUTPUT_DIR = os.path.join(BASE_DIR, "outputs")

COUNTY_TOTAL_FILE = os.path.join(OUTPUT_DIR, "NIH_impact_county.csv")
STATE_TOTAL_FILE = os.path.join(OUTPUT_DIR, "NIH_impact_state.csv")
CONGRESSIONAL_TOTAL_FILE = os.path.join(OUTPUT_DIR, "NIH_impact_cong.csv")

COUNTY_GEO_FILE = os.path.join(INPUT_DIR, "merged_data_counties_CLIP_Compress.geojson")
STATE_GEO_FILE = os.path.join(INPUT_DIR, "merged_data_states_CLIP.geojson")
CONGRESSIONAL_GEO_FILE = os.path.join(INPUT_DIR, "CongDist_shp/cb_2022_us_cd118_500k.shp")

COUNTY_OUTPUT_FILE = os.path.join(FINAL_OUTPUT_DIR, "merged_data_counties_total.geojson")
STATE_OUTPUT_FILE = os.path.join(FINAL_OUTPUT_DIR, "merged_data_states_total.geojson")
CONGRESSIONAL_OUTPUT_FILE = os.path.join(FINAL_OUTPUT_DIR, "merged_data_congs_total.geojson")

COLUMNS_TO_DROP_COUNTY = [
    "combined_loss_noself", "terminated_loss_log", "terminated_loss_noself_log",
    "terminated_econ_loss_log", "terminated_job_loss_log", "terminated_econ_loss_noself_log",
    "terminated_job_loss_noself_log", "IDC_loss_log", "IDC_econ_loss_log", "IDC_job_loss_log",
    "grant_funds_log", "grant_funds_econ_log", "combined_job_loss_log"
]


def load_data(file_path, file_type='csv', encoding='latin-1', crs="epsg:4326"):
    if file_type == 'csv':
        return pd.read_csv(file_path, encoding=encoding)
    elif file_type == 'geo':
        gdf = gpd.read_file(file_path)
        if gdf.crs != crs:
            gdf = gdf.to_crs(crs)
        return gdf
    raise RuntimeError()


def merge_data(data_df, geo_df, on, columns):
    return pd.merge(data_df, geo_df[columns], on=on, how='left')


def create_geojson(gdf, columns_to_drop=None):
    if columns_to_drop is not None:
        gdf = gdf.drop(columns=columns_to_drop, errors='ignore')

    features = []
    for _, row in gdf.iterrows():
        if pd.notna(row['geometry']):
            geometry = gpd.GeoSeries([row['geometry']]).__geo_interface__['features'][0]['geometry']
            properties = row.drop('geometry').to_dict()
            features.append({
                "type": "Feature",
                "geometry": geometry,
                "properties": properties
            })

    return {
        "type": "FeatureCollection",
        "features": features
    }


def save_geojson(geojson_data, file_path):
    os.makedirs(os.path.dirname(file_path), exist_ok=True)
    with open(file_path, "w") as f:
        json.dump(geojson_data, f)


def process_county_data():
    df_total_county = load_data(COUNTY_TOTAL_FILE)
    counties_gdf = load_data(COUNTY_GEO_FILE, file_type='geo')

    merged_gdf = merge_data(df_total_county, counties_gdf, on='FIPS', columns=['FIPS', 'geometry'])
    merged_gdf = gpd.GeoDataFrame(merged_gdf, geometry='geometry')

    geojson_data = create_geojson(merged_gdf, columns_to_drop=COLUMNS_TO_DROP_COUNTY)
    save_geojson(geojson_data, COUNTY_OUTPUT_FILE)


def process_state_data():
    df_total_state = load_data(STATE_TOTAL_FILE)
    states_gdf = load_data(STATE_GEO_FILE, file_type='geo')

    merged_gdf = merge_data(df_total_state, states_gdf, on='state_code', columns=['state_code', 'geometry'])
    merged_gdf = gpd.GeoDataFrame(merged_gdf, geometry='geometry')

    geojson_data = create_geojson(merged_gdf)
    save_geojson(geojson_data, STATE_OUTPUT_FILE)


def process_congressional_data():
    df_total_cong = load_data(CONGRESSIONAL_TOTAL_FILE)
    congs_gdf = load_data(CONGRESSIONAL_GEO_FILE, file_type='geo')
    congs_gdf['GEOID'] = congs_gdf['GEOID'].astype('int64')

    merged_gdf = merge_data(df_total_cong, congs_gdf, on='GEOID', columns=['GEOID', 'geometry'])
    merged_gdf = gpd.GeoDataFrame(merged_gdf, geometry='geometry')

    geojson_data = create_geojson(merged_gdf)
    save_geojson(geojson_data, CONGRESSIONAL_OUTPUT_FILE)


def tile_and_upload(version, area: str):
    output_folder = "outputs"
    os.makedirs(output_folder, exist_ok=True)
    process_command = f"tippecanoe -z7 -e tiles_{area}_total_v{version} --drop-densest-as-needed --no-tile-size-limit --no-tile-compression {output_folder}/merged_data_{area}_total.geojson"
    upload_command = f"rclone copy tiles_{area}_total_v{version}/ r2:scimap-data/tiles_{area}_total_v{version}/ --transfers 32"
    Popen(process_command, shell=True).wait()
    Popen(upload_command, shell=True).wait()


if __name__ == "__main__":
    science_impacts_dir = os.path.join(os.path.dirname(BASE_DIR), 'Science-Impacts')
    Popen(['git', 'pull'], cwd=science_impacts_dir).wait()

    # Get the current date and time
    now = datetime.now()

    # Format the date as a string (e.g., YYYY-MM-DD)
    date_version = now.strftime("%Y-%m-%d")

    print("Processing raw data into GeoJSONs")
    process_county_data()
    process_state_data()
    process_congressional_data()

    print("Tiling and Uploading")
    tile_and_upload(date_version, "counties")
    tile_and_upload(date_version, "states")
    tile_and_upload(date_version, "congs")


