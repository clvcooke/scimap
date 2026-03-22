import pandas as pd
import geopandas as gpd
import json
import os
import subprocess
import platform

SCRIPT_DIR = os.path.dirname(os.path.abspath(__file__))
PROJECT_ROOT = os.path.join(SCRIPT_DIR, "..")

DATA_DIR = os.path.join(PROJECT_ROOT, "data", "baseline")
GEO_REF_DIR = os.path.join(PROJECT_ROOT, "data", "geo_ref")
OUTPUT_DIR = os.path.join(PROJECT_ROOT, "scripts", "outputs")

TILE_VERSION = "baseline-v1"
VALUE_COLUMNS = ["raw_funding", "econ_impact", "jobs"]

CBSA_GEO_FILE = os.path.join(GEO_REF_DIR, "tl_2024_us_cbsa.shp")

# Each level defines: csv file, geo file, csv merge key, geo merge key,
# and any key transformations needed to align them.
LEVELS = {
    "states": {
        "csv": os.path.join(DATA_DIR, "baseline_state.csv"),
        "geo": os.path.join(GEO_REF_DIR, "merged_data_states_CLIP.geojson"),
        "csv_key": "state",
        "geo_key": "state_code",
        "zoom": 7,
    },
    "counties": {
        "csv": os.path.join(DATA_DIR, "baseline_county.csv"),
        "geo": os.path.join(GEO_REF_DIR, "merged_data_counties_CLIP_Compress.geojson"),
        "csv_key": "FIPS",
        "geo_key": "FIPS",
        "zoom": 9,
    },
    "districts": {
        "csv": os.path.join(DATA_DIR, "baseline_district.csv"),
        "geo": os.path.join(GEO_REF_DIR, "CongDist_shp_119", "Congressional_Districts.shp"),
        "csv_key": "GEOID",
        "geo_key": "GEOID",
        "csv_key_pad": 4,  # zero-pad CSV key to 4 digits to match geo
        "zoom": 9,
    },
    "cities": {
        "csv": os.path.join(DATA_DIR, "baseline_city.csv"),
        "geo": CBSA_GEO_FILE,
        "csv_key": "CBSA_FIPS",
        "geo_key": "CBSAFP",
        "zoom": 9,
    },
}



def load_geometries(geo_path, geo_key):
    """Load a GeoJSON or shapefile and return a dict of key -> geometry."""
    gdf = gpd.read_file(geo_path)
    if gdf.crs and gdf.crs != "EPSG:4326":
        gdf = gdf.to_crs(epsg=4326)

    geometries = {}
    for _, row in gdf.iterrows():
        key = row[geo_key]
        if pd.notna(key) and pd.notna(row.geometry):
            geometries[str(key)] = row.geometry.__geo_interface__

    return geometries


def pivot_baseline_data(csv_path, key_col):
    """
    Pivot baseline CSV so each geographic unit becomes one row with columns like:
    FIC_raw_funding, FIC_econ_impact, FIC_jobs, NCI_raw_funding, ..., pop_2024
    """
    df = pd.read_csv(csv_path)

    pivoted = df.pivot_table(
        index=key_col, columns="funding_ics", values=VALUE_COLUMNS, aggfunc="sum"
    )

    # Flatten multi-level columns: (raw_funding, FIC) -> FIC_raw_funding
    pivoted.columns = [f"{ics}_{metric}" for metric, ics in pivoted.columns]

    # Add pop_2024 (same for all funding_ics rows within a unit)
    pop = df.drop_duplicates(subset=[key_col])[[key_col, "pop_2024"]].set_index(key_col)
    pivoted = pivoted.join(pop)

    pivoted = pivoted.reset_index()
    return pivoted


def build_geojson(pivoted_df, geometries, csv_key):
    """Merge pivoted data with geometries into a GeoJSON FeatureCollection."""
    features = []
    matched = 0
    for _, row in pivoted_df.iterrows():
        key = str(row[csv_key])
        geometry = geometries.get(key)
        if geometry is None:
            continue

        properties = {}
        for col in pivoted_df.columns:
            val = row[col]
            if pd.isna(val):
                properties[col] = None
            elif hasattr(val, "item"):
                properties[col] = val.item()
            else:
                properties[col] = val

        features.append({
            "type": "Feature",
            "geometry": geometry,
            "properties": properties,
        })
        matched += 1

    total = len(pivoted_df)
    if matched < total:
        print(f"  Warning: matched {matched}/{total} features to geometries")

    return {"type": "FeatureCollection", "features": features}


def save_geojson(geojson_data, output_path):
    os.makedirs(os.path.dirname(output_path), exist_ok=True)
    with open(output_path, "w") as f:
        json.dump(geojson_data, f)
    print(f"  Saved: {output_path} ({len(geojson_data['features'])} features)")


def to_wsl_path(windows_path):
    """Convert a Windows path to a WSL /mnt/c/... path."""
    abs_path = os.path.abspath(windows_path)
    drive = abs_path[0].lower()
    rest = abs_path[2:].replace("\\", "/")
    return f"/mnt/{drive}{rest}"


def run_wsl(cmd):
    """Run a command through WSL if on Windows, otherwise directly."""
    if platform.system() == "Windows":
        full_cmd = ["wsl", "bash", "-c", cmd]
    else:
        full_cmd = cmd
    print(f"  Running: {cmd}")
    result = subprocess.run(full_cmd, shell=(platform.system() != "Windows"))
    return result.returncode


def generate_tiles(geojson_path, tile_output_dir, zoom):
    wsl_geojson = to_wsl_path(geojson_path)
    wsl_tile_dir = to_wsl_path(tile_output_dir)
    cmd = (
        f"tippecanoe -z{zoom} -e {wsl_tile_dir} "
        f"--drop-densest-as-needed --no-tile-size-limit --no-tile-compression "
        f"{wsl_geojson}"
        " --force"
    )
    rc = run_wsl(cmd)
    if rc != 0:
        raise RuntimeError(f"tippecanoe failed with exit code {rc}")
    print(f"  Tiles generated: {tile_output_dir}")


def upload_tiles(tile_output_dir, remote_path):
    wsl_tile_dir = to_wsl_path(tile_output_dir)
    cmd = f"rclone copy {wsl_tile_dir}/ r2:scimap-data/{remote_path}/ --transfers 32"
    rc = run_wsl(cmd)
    if rc != 0:
        raise RuntimeError(f"rclone upload failed with exit code {rc}")
    print(f"  Upload complete: {remote_path}")


def process_level(name, config):
    print(f"\n{'='*60}")
    print(f"Processing: {name}")
    print(f"{'='*60}")

    csv_path = config["csv"]
    geo_path = config["geo"]
    csv_key = config["csv_key"]
    geo_key = config["geo_key"]
    zoom = config["zoom"]

    # print(f"Loading geometries from {os.path.basename(geo_path)}...")
    # geometries = load_geometries(geo_path, geo_key)
    # print(f"  Loaded {len(geometries)} geometries")
    #
    # print(f"Pivoting {os.path.basename(csv_path)}...")
    # pivoted = pivot_baseline_data(csv_path, csv_key)
    # print(f"  Pivoted: {len(pivoted)} rows, {len(pivoted.columns)} columns")
    #
    # # Normalize keys to strings for matching
    # pad_width = config.get("csv_key_pad")
    # if pad_width:
    #     pivoted[csv_key] = pivoted[csv_key].astype(str).str.zfill(pad_width)
    # else:
    #     pivoted[csv_key] = pivoted[csv_key].astype(str)

    print("Building GeoJSON...")
    # geojson_data = build_geojson(pivoted, geometries, csv_key)

    tile_name = f"tiles_{name}_baseline_{TILE_VERSION}"
    # geojson_output = os.path.join(OUTPUT_DIR, f"baseline_{name}.geojson")
    # save_geojson(geojson_data, geojson_output)
    #
    # print("Generating tiles...")
    tile_dir = os.path.join(OUTPUT_DIR, tile_name)
    # generate_tiles(geojson_output, tile_dir, zoom)

    print("Uploading tiles...")
    upload_tiles(tile_dir, tile_name)

    print(f"Done: {name}")


def main():
    for name, config in LEVELS.items():
        process_level(name, config)

    print("\nAll levels complete!")


if __name__ == "__main__":
    main()
