import pandas as pd
import geopandas as gpd
import json
import os
import subprocess
import platform
import tempfile
import zipfile

SCRIPT_DIR = os.path.dirname(os.path.abspath(__file__))
PROJECT_ROOT = os.path.join(SCRIPT_DIR, "..")

DATA_DIR = os.path.join(PROJECT_ROOT, "data", "baseline")
GEO_REF_DIR = os.path.join(PROJECT_ROOT, "data", "geo_ref")
OUTPUT_DIR = os.path.join(PROJECT_ROOT, "scripts", "outputs")

TILE_VERSION = "baseline-v1"
VALUE_COLUMNS = ["raw_funding", "econ_impact", "jobs"]

# ── Remote geo-reference data (Cloudflare R2) ────────────────────────
R2_BASE = "https://pub-16c87e1620124b38879fbf81846cfc4c.r2.dev/reference-data"
GEO_CACHE_DIR = os.path.join(tempfile.gettempdir(), "scimap_geo_cache")

R2_FILES = [
    "Cities_Counties.zip",
    "CongDist_shp.zip",
    "merged_data_counties_CLIP_Compress.geojson",
    "merged_data_states_CLIP.geojson",
]


def download_geo_refs():
    """Download geo-reference files from R2 into a tmp cache dir, skipping existing."""
    os.makedirs(GEO_CACHE_DIR, exist_ok=True)

    for filename in R2_FILES:
        local_path = os.path.join(GEO_CACHE_DIR, filename)
        if os.path.exists(local_path):
            print(f"  Cached: {filename}")
            continue

        url = f"{R2_BASE}/{filename}"
        print(f"  Downloading: {filename} ...")
        rc = subprocess.run(["curl", "-sL", "-o", local_path, url]).returncode
        if rc != 0:
            raise RuntimeError(f"curl failed for {url} (exit {rc})")
        print(f"  Saved: {local_path}")

        # Auto-extract zip files
        if filename.endswith(".zip"):
            extract_dir = os.path.join(GEO_CACHE_DIR, os.path.splitext(filename)[0])
            if not os.path.exists(extract_dir):
                print(f"  Extracting: {filename} -> {extract_dir}")
                with zipfile.ZipFile(local_path, "r") as zf:
                    zf.extractall(extract_dir)

    print(f"  Geo cache: {GEO_CACHE_DIR}")


def geo_path(name):
    return os.path.join(GEO_CACHE_DIR, name)


def find_shapefile(directory):
    """Find the first .shp file inside a directory tree."""
    for root, _dirs, files in os.walk(directory):
        for f in files:
            if f.endswith(".shp"):
                return os.path.join(root, f)
    raise FileNotFoundError(f"No .shp found in {directory}")


def build_levels():
    """Build LEVELS config using cached geo-ref paths."""
    return {
        "states": {
            "csv": os.path.join(DATA_DIR, "baseline_state.csv"),
            "geo": geo_path("merged_data_states_CLIP.geojson"),
            "csv_key": "state",
            "geo_key": "state_code",
            "zoom": 7,
        },
        "counties": {
            "csv": os.path.join(DATA_DIR, "baseline_county.csv"),
            "geo": geo_path("merged_data_counties_CLIP_Compress.geojson"),
            "csv_key": "FIPS",
            "geo_key": "FIPS",
            "zoom": 9,
        },
        "districts": {
            "csv": os.path.join(DATA_DIR, "baseline_district.csv"),
            "geo": geo_path("CongDist_shp"),
            "csv_key": "GEOID",
            "geo_key": "GEOID",
            "csv_key_pad": 4,  # zero-pad CSV key to 4 digits to match geo
            "zoom": 9,
        },
        "cities": {
            "csv": os.path.join(DATA_DIR, "baseline_city.csv"),
            "geo": os.path.join(GEO_REF_DIR, "tl_2024_us_cbsa.shp"),
            "csv_key": "CBSA_FIPS",
            "geo_key": "CBSAFP",
            "zoom": 9,
        },
    }


def load_geometries(geo_file, geo_key):
    """Load a GeoJSON or shapefile and return a dict of key -> geometry."""
    # If path is a directory, find the shapefile inside it
    if os.path.isdir(geo_file):
        geo_file = find_shapefile(geo_file)

    gdf = gpd.read_file(geo_file)
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
    Also preserves name/state/label columns (e.g. name, state, CBSA_NAME).
    """
    df = pd.read_csv(csv_path)

    pivoted = df.pivot_table(
        index=key_col, columns="funding_ics", values=VALUE_COLUMNS, aggfunc="sum"
    )

    # Flatten multi-level columns: (raw_funding, FIC) -> FIC_raw_funding
    pivoted.columns = [f"{ics}_{metric}" for metric, ics in pivoted.columns]

    # Preserve non-metric columns (pop_2024, name, state, CBSA_NAME, etc.)
    meta_cols = [c for c in df.columns if c not in [key_col, "funding_ics"] + VALUE_COLUMNS]
    meta = df.drop_duplicates(subset=[key_col])[[key_col] + meta_cols].set_index(key_col)
    pivoted = pivoted.join(meta)

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
    geo_file = config["geo"]
    csv_key = config["csv_key"]
    geo_key = config["geo_key"]
    zoom = config["zoom"]

    print(f"Loading geometries from {os.path.basename(geo_file)}...")
    geometries = load_geometries(geo_file, geo_key)
    print(f"  Loaded {len(geometries)} geometries")

    print(f"Pivoting {os.path.basename(csv_path)}...")
    pivoted = pivot_baseline_data(csv_path, csv_key)
    print(f"  Pivoted: {len(pivoted)} rows, {len(pivoted.columns)} columns")

    # Normalize keys to strings for matching
    pad_width = config.get("csv_key_pad")
    if pad_width:
        pivoted[csv_key] = pivoted[csv_key].astype(str).str.zfill(pad_width)
    else:
        pivoted[csv_key] = pivoted[csv_key].astype(str)

    print("Building GeoJSON...")
    geojson_data = build_geojson(pivoted, geometries, csv_key)

    tile_name = f"tiles_{name}_baseline_{TILE_VERSION}"
    geojson_output = os.path.join(OUTPUT_DIR, f"baseline_{name}.geojson")
    save_geojson(geojson_data, geojson_output)

    print("Generating tiles...")
    tile_dir = os.path.join(OUTPUT_DIR, tile_name)
    generate_tiles(geojson_output, tile_dir, zoom)

    print("Uploading tiles...")
    upload_tiles(tile_dir, tile_name)

    print(f"Done: {name}")


def main():
    print("Downloading geo-reference data...")
    download_geo_refs()

    levels = build_levels()
    for name, config in levels.items():
        process_level(name, config)

    print("\nAll levels complete!")


if __name__ == "__main__":
    main()
