"""
Generate MVT tiles for the FY2027 NIH + NSF budget impact map.

Reads per-geography CSVs for NIH and NSF, merges them with geometry files,
and produces vector tiles via tippecanoe.  Upload via rclone.

Usage:
    python scripts/fy27_budget.py
"""

import pandas as pd
import geopandas as gpd
import json
import os
import subprocess
import platform
import tempfile
import urllib.request
import zipfile

SCRIPT_DIR = os.path.dirname(os.path.abspath(__file__))
PROJECT_ROOT = os.path.join(SCRIPT_DIR, "..")

NIH_DIR = os.path.join(PROJECT_ROOT, "data", "2027", "FY2027 NIH Budget")
NSF_DIR = os.path.join(PROJECT_ROOT, "data", "2027", "FY2027 NSF Budget")
OUTPUT_DIR = os.path.join(PROJECT_ROOT, "scripts", "outputs")

TILE_VERSION = "v2"

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


# Resolved paths (populated after download)
def geo_path(name):
    return os.path.join(GEO_CACHE_DIR, name)


def build_levels():
    """Build LEVELS config using cached geo-ref paths."""
    return {
        "states": {
            "nih_csv": os.path.join(NIH_DIR, "NIH_budget27_state.csv"),
            "nsf_csv": os.path.join(NSF_DIR, "NSF_budget27_state.csv"),
            "geo": geo_path("merged_data_states_CLIP.geojson"),
            "csv_key": "state",
            "geo_key": "state_code",
            "zoom": 7,
        },
        "counties": {
            "nih_csv": os.path.join(NIH_DIR, "NIH_budget27_county.csv"),
            "nsf_csv": os.path.join(NSF_DIR, "NSF_budget27_county.csv"),
            "geo": geo_path("merged_data_counties_CLIP_Compress.geojson"),
            "csv_key": "FIPS",
            "geo_key": "FIPS",
            "csv_key_pad": 5,  # ensure "01001" format
            "geo_key_pad": 5,  # geojson has int FIPS (1001) -> zero-pad to "01001"
            "zoom": 9,
        },
        "districts": {
            "nih_csv": os.path.join(NIH_DIR, "NIH_budget27_cong.csv"),
            "nsf_csv": os.path.join(NSF_DIR, "NSF_budget27_cong.csv"),
            "geo": geo_path("CongDist_shp"),
            "csv_key": "GEOID",
            "geo_key": "GEOID",
            "csv_key_pad": 4,
            "zoom": 9,
        },
        "cities": {
            "nih_csv": os.path.join(NIH_DIR, "NIH_budget27_city.csv"),
            "nsf_csv": os.path.join(NSF_DIR, "NSF_budget27_city.csv"),
            "geo": geo_path("Cities_Counties"),
            "csv_key": "CBSA_FIPS",
            "geo_key": "FIPSCITY",
            "geo_filter": {"CITYFLAG": 1},  # only metro-area rows
            "zoom": 9,
        },
    }


def find_shapefile(directory):
    """Find the first .shp file inside a directory tree."""
    for root, _dirs, files in os.walk(directory):
        for f in files:
            if f.endswith(".shp"):
                return os.path.join(root, f)
    return None


def load_geometries(geo_path, geo_key, geo_filter=None, geo_key_pad=None):
    # If geo_path is a directory (extracted zip), find the shapefile inside
    if os.path.isdir(geo_path):
        shp = find_shapefile(geo_path)
        if shp is None:
            raise FileNotFoundError(f"No .shp found in {geo_path}")
        print(f"  Using shapefile: {os.path.basename(shp)}")
        geo_path = shp

    gdf = gpd.read_file(geo_path)
    if gdf.crs and gdf.crs != "EPSG:4326":
        gdf = gdf.to_crs(epsg=4326)

    # Optional row filter (e.g. CITYFLAG == 1 for metro areas)
    if geo_filter:
        for col, val in geo_filter.items():
            gdf = gdf[gdf[col] == val]
        print(f"  Filtered to {len(gdf)} rows ({geo_filter})")

    geometries = {}
    for _, row in gdf.iterrows():
        key = row[geo_key]
        if pd.notna(key) and pd.notna(row.geometry):
            key_str = str(int(key)) if isinstance(key, float) else str(key)
            if geo_key_pad:
                key_str = key_str.zfill(geo_key_pad)
            geometries[key_str] = row.geometry.__geo_interface__
    return geometries


def merge_nih_nsf(nih_csv, nsf_csv, csv_key):
    """
    Load NIH and NSF CSVs and merge on the geographic key.
    Adds a combined econ_budg_total_cuts column.
    """
    nih = pd.read_csv(nih_csv)
    nsf = pd.read_csv(nsf_csv)

    # Normalize key columns to string
    nih[csv_key] = nih[csv_key].astype(str)
    nsf[csv_key] = nsf[csv_key].astype(str)

    # Drop overlapping non-data columns from NSF before merge (keep the csv_key!)
    nsf_drop = [c for c in ["state_name", "state", "name", "rep_name", "pol_party", "state_FIPS", "CBSA_NAME"]
                if c in nsf.columns and c != csv_key]
    nsf_trimmed = nsf.drop(columns=nsf_drop, errors="ignore")

    merged = nih.merge(nsf_trimmed, on=csv_key, how="outer")

    # Compute combined totals (handle columns that may not exist)
    def safe_col(df, col):
        if col in df.columns:
            return pd.to_numeric(df[col], errors="coerce").fillna(0)
        return pd.Series(0, index=df.index)

    merged["econ_budg_total_cuts"] = safe_col(merged, "econ_budg_NIH_cuts") + safe_col(merged, "econ_budg_NSF_cuts")
    merged["budg_total_cuts"] = safe_col(merged, "budg_NIH_cuts") + safe_col(merged, "budg_NSF_cuts")
    merged["jobs_budg_total_cuts"] = safe_col(merged, "jobs_budg_NIH_cuts")

    return merged


def build_geojson(df, geometries, csv_key):
    features = []
    matched = 0
    for _, row in df.iterrows():
        key = str(row[csv_key])
        geometry = geometries.get(key)
        if geometry is None:
            continue

        properties = {}
        for col in df.columns:
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

    total = len(df)
    if matched < total:
        print(f"  Warning: matched {matched}/{total} features to geometries")

    return {"type": "FeatureCollection", "features": features}


def save_geojson(geojson_data, output_path):
    os.makedirs(os.path.dirname(output_path), exist_ok=True)
    with open(output_path, "w") as f:
        json.dump(geojson_data, f)
    print(f"  Saved: {output_path} ({len(geojson_data['features'])} features)")


def to_wsl_path(windows_path):
    abs_path = os.path.abspath(windows_path)
    if platform.system() != "Windows":
        return abs_path
    drive = abs_path[0].lower()
    rest = abs_path[2:].replace("\\", "/")
    return f"/mnt/{drive}{rest}"


def run_wsl(cmd):
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

    csv_key = config["csv_key"]
    geo_key = config["geo_key"]
    zoom = config["zoom"]

    if not os.path.exists(config["geo"]):
        print(f"  SKIPPED: geo file not found: {config['geo']}")
        return

    print(f"Loading geometries from {os.path.basename(config['geo'])}...")
    geometries = load_geometries(
        config["geo"], geo_key,
        geo_filter=config.get("geo_filter"),
        geo_key_pad=config.get("geo_key_pad"),
    )
    print(f"  Loaded {len(geometries)} geometries")

    print(f"Merging NIH + NSF data...")
    merged = merge_nih_nsf(config["nih_csv"], config["nsf_csv"], csv_key)
    print(f"  Merged: {len(merged)} rows, {len(merged.columns)} columns")

    pad_width = config.get("csv_key_pad")
    if pad_width:
        merged[csv_key] = merged[csv_key].astype(str).str.zfill(pad_width)
    else:
        merged[csv_key] = merged[csv_key].astype(str)

    print("Building GeoJSON...")
    geojson_data = build_geojson(merged, geometries, csv_key)

    tile_name = f"tiles_{name}_budget27_{TILE_VERSION}"
    geojson_output = os.path.join(OUTPUT_DIR, f"budget27_{name}.geojson")
    save_geojson(geojson_data, geojson_output)

    print("Generating tiles...")
    tile_dir = os.path.join(OUTPUT_DIR, tile_name)
    generate_tiles(geojson_output, tile_dir, zoom)

    print("Uploading tiles...")
    upload_tiles(tile_dir, tile_name)

    print(f"Done: {name}")


def main():
    print("Ensuring geo-reference data is cached...")
    download_geo_refs()

    levels = build_levels()
    for name, config in levels.items():
        process_level(name, config)

    print("\nAll levels complete!")


if __name__ == "__main__":
    main()
