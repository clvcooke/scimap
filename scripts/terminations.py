"""
Process terminated-grants data from data/terminations/Terminations Combined/
into:
  1. MVT tiles (state, county, district, city) uploaded to Cloudflare R2
  2. src/data/terminated_grants.json  (scatter-plot / cluster-layer data)
  3. src/data/state_total_losses.json (state-level summary)

Input: terminations_org_combined.csv — one row per (org, week) with
.nih, .nsf, .combined suffixed value columns and geocoded lat/lon.

Geographic aggregations (state/county/district/city) are derived by
spatially joining org points to polygon boundaries, then summing per polygon.
"""

import pandas as pd
import geopandas as gpd
import json
import os
import subprocess
import platform
import tempfile
import zipfile
from datetime import datetime

# ── Paths ──────────────────────────────────────────────────────────

SCRIPT_DIR = os.path.dirname(os.path.abspath(__file__))
PROJECT_ROOT = os.path.join(SCRIPT_DIR, "..")
REACT_DATA_DIR = os.path.join(PROJECT_ROOT, "src", "data")
OUTPUT_DIR = os.path.join(SCRIPT_DIR, "outputs")

COMBINED_CSV = os.path.join(
    PROJECT_ROOT, "data", "terminations", "Terminations Combined",
    "terminations_org_combined.csv",
)

TILE_VERSION = datetime.now().strftime("%Y-%m-%d") + "c"

# ── Remote geo-reference data ──────────────────────────────────────

R2_BASE = "https://pub-16c87e1620124b38879fbf81846cfc4c.r2.dev/reference-data"
GEO_CACHE_DIR = os.path.join(tempfile.gettempdir(), "scimap_geo_cache")

R2_FILES = [
    "Cities_Counties.zip",
    "CongDist_shp.zip",
    "merged_data_counties_CLIP_Compress.geojson",
    "merged_data_states_CLIP.geojson",
]

# ── Column definitions ─────────────────────────────────────────────

VALUE_BASES = [
    "current_loss", "current_grant_loss", "current_econ_loss", "current_job_loss",
    "overall_loss", "overall_grant_loss", "overall_econ_loss", "overall_job_loss",
]
ALL_VALUE_COLS = [f"{b}.{s}" for b in VALUE_BASES for s in ("nih", "nsf", "combined")]

# Maps combined-CSV dotted column names to frontend tile property names
COLUMN_RENAMES = {
    "overall_loss.combined":         "terminated_loss",
    "overall_econ_loss.combined":    "terminated_econ_loss",
    "overall_job_loss.combined":     "terminated_job_loss",
    "current_loss.combined":         "terminated_current_loss",
    "current_econ_loss.combined":    "terminated_current_econ_loss",
    "current_job_loss.combined":     "terminated_current_job_loss",
    "overall_loss.nih":              "nih_overall_loss",
    "overall_econ_loss.nih":         "nih_overall_econ_loss",
    "overall_job_loss.nih":          "nih_overall_job_loss",
    "current_loss.nih":              "nih_current_loss",
    "current_econ_loss.nih":         "nih_current_econ_loss",
    "current_job_loss.nih":          "nih_current_job_loss",
    "overall_loss.nsf":              "nsf_overall_loss",
    "overall_econ_loss.nsf":         "nsf_overall_econ_loss",
    "overall_job_loss.nsf":          "nsf_overall_job_loss",
    "current_loss.nsf":              "nsf_current_loss",
    "current_econ_loss.nsf":         "nsf_current_econ_loss",
    "current_job_loss.nsf":          "nsf_current_job_loss",
}

# ── State FIPS → abbreviation mapping ─────────────────────────────

FIPS_TO_STATE = {
    "01": "AL", "02": "AK", "04": "AZ", "05": "AR", "06": "CA", "08": "CO", "09": "CT",
    "10": "DE", "11": "DC", "12": "FL", "13": "GA", "15": "HI", "16": "ID", "17": "IL",
    "18": "IN", "19": "IA", "20": "KS", "21": "KY", "22": "LA", "23": "ME", "24": "MD",
    "25": "MA", "26": "MI", "27": "MN", "28": "MS", "29": "MO", "30": "MT", "31": "NE",
    "32": "NV", "33": "NH", "34": "NJ", "35": "NM", "36": "NY", "37": "NC", "38": "ND",
    "39": "OH", "40": "OK", "41": "OR", "42": "PA", "44": "RI", "45": "SC", "46": "SD",
    "47": "TN", "48": "TX", "49": "UT", "50": "VT", "51": "VA", "53": "WA", "54": "WV",
    "55": "WI", "56": "WY", "60": "AS", "66": "GU", "69": "MP", "72": "PR", "78": "VI",
}

FULL_TO_ABBR = {v: k for k, v in {
    "AL": "Alabama", "AK": "Alaska", "AZ": "Arizona", "AR": "Arkansas", "CA": "California",
    "CO": "Colorado", "CT": "Connecticut", "DE": "Delaware", "DC": "District of Columbia",
    "FL": "Florida", "GA": "Georgia", "HI": "Hawaii", "ID": "Idaho", "IL": "Illinois",
    "IN": "Indiana", "IA": "Iowa", "KS": "Kansas", "KY": "Kentucky", "LA": "Louisiana",
    "ME": "Maine", "MD": "Maryland", "MA": "Massachusetts", "MI": "Michigan", "MN": "Minnesota",
    "MS": "Mississippi", "MO": "Missouri", "MT": "Montana", "NE": "Nebraska", "NV": "Nevada",
    "NH": "New Hampshire", "NJ": "New Jersey", "NM": "New Mexico", "NY": "New York",
    "NC": "North Carolina", "ND": "North Dakota", "OH": "Ohio", "OK": "Oklahoma", "OR": "Oregon",
    "PA": "Pennsylvania", "RI": "Rhode Island", "SC": "South Carolina", "SD": "South Dakota",
    "TN": "Tennessee", "TX": "Texas", "UT": "Utah", "VT": "Vermont", "VA": "Virginia",
    "WA": "Washington", "WV": "West Virginia", "WI": "Wisconsin", "WY": "Wyoming",
    "AS": "American Samoa", "GU": "Guam", "MP": "Northern Mariana Islands",
    "PR": "Puerto Rico", "VI": "U.S. Virgin Islands",
}.items()}


# ── Geo-reference download ─────────────────────────────────────────

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
    for root, _dirs, files in os.walk(directory):
        for f in files:
            if f.endswith(".shp"):
                return os.path.join(root, f)
    raise FileNotFoundError(f"No .shp found in {directory}")


# ── Data loading ───────────────────────────────────────────────────

def load_combined_orgs():
    """Return (df, latest_week) from the combined CSV at its most recent week."""
    df = pd.read_csv(COMBINED_CSV)
    df["week"] = df["week"].astype(str)
    latest_week = df["week"].max()
    df = df[df["week"] == latest_week].drop_duplicates(
        subset=["org_name", "org_city", "org_state"], keep="last"
    )
    print(f"  {len(df)} orgs at week {latest_week}")
    return df, latest_week


def make_orgs_gdf(df):
    """Convert org DataFrame to GeoDataFrame using lat/lon, dropping rows without coordinates."""
    df = df.dropna(subset=["lat", "lon"]).copy()
    gdf = gpd.GeoDataFrame(
        df,
        geometry=gpd.points_from_xy(df["lon"], df["lat"]),
        crs="EPSG:4326",
    )
    return gdf


# ── Polygon loading ────────────────────────────────────────────────

def load_poly_gdf(geo_file, geo_key, filter_by=None, dissolve_key=None, pad_width=None):
    """Load polygon GeoDataFrame, reproject to EPSG:4326, apply optional filter/dissolve."""
    if os.path.isdir(geo_file):
        geo_file = find_shapefile(geo_file)

    gdf = gpd.read_file(geo_file)
    if gdf.crs and gdf.crs != "EPSG:4326":
        gdf = gdf.to_crs(epsg=4326)

    if filter_by:
        for col, val in filter_by.items():
            gdf = gdf[gdf[col] == val]

    if dissolve_key:
        gdf = gdf.dissolve(by=dissolve_key).reset_index()

    gdf[geo_key] = gdf[geo_key].astype(str)
    if pad_width:
        gdf[geo_key] = gdf[geo_key].str.zfill(pad_width)

    return gdf


def gdf_to_geometries(gdf, key_col, attr_cols=None):
    """Extract {key: geometry} dict and optional {key: {attr: val}} dict from a GDF."""
    geometries = {}
    attributes = {}
    for _, row in gdf.iterrows():
        key = str(row[key_col])
        if pd.notna(key) and pd.notna(row.geometry):
            geometries[key] = row.geometry
            if attr_cols:
                attributes[key] = {
                    col: row[col]
                    for col in attr_cols
                    if col in row.index and pd.notna(row[col])
                }
    return geometries, attributes


# ── Aggregation ────────────────────────────────────────────────────

def aggregate_by_state(orgs_df):
    """Group org data by state abbreviation and sum value columns."""
    val_cols = [c for c in ALL_VALUE_COLS if c in orgs_df.columns]
    agg = orgs_df.groupby("org_state")[val_cols].sum().reset_index()
    agg = agg.rename(columns={"org_state": "state"})
    return agg


def aggregate_by_polygon(orgs_gdf, poly_gdf, poly_key):
    """Spatially join org points to polygons and return per-polygon value sums."""
    joined = gpd.sjoin(
        orgs_gdf,
        poly_gdf[[poly_key, "geometry"]],
        how="left",
        predicate="within",
    )
    joined = joined.dropna(subset=[poly_key])
    val_cols = [c for c in ALL_VALUE_COLS if c in joined.columns]
    agg = joined.groupby(poly_key)[val_cols].sum().reset_index()
    return agg


# ── GeoJSON / tile helpers ─────────────────────────────────────────

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
            "geometry": geometry.__geo_interface__,
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
        f"--no-feature-limit --no-tile-size-limit --no-tile-compression "
        f"--no-tiny-polygon-reduction "
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


# ── Geographic level config ────────────────────────────────────────

def build_levels():
    return {
        "states": {
            "geo": geo_path("merged_data_states_CLIP.geojson"),
            "csv_key": "state",
            "geo_key": "state_code",
            "zoom": 7,
            "attr_cols": [],
        },
        "counties": {
            "geo": geo_path("merged_data_counties_CLIP_Compress.geojson"),
            "csv_key": "FIPS",
            "geo_key": "FIPS",
            "zoom": 9,
            "attr_cols": ["county", "state"],
        },
        "districts": {
            "geo": geo_path("CongDist_shp"),
            "csv_key": "GEOID",
            "geo_key": "GEOID",
            "csv_key_pad": 4,
            "zoom": 9,
            "attr_cols": ["STATEFP"],
        },
        "cities": {
            "geo": geo_path("Cities_Counties"),
            "csv_key": "FIPSCITY",
            "geo_key": "FIPSCITY",
            "filter": {"CITYFLAG": 1},
            "dissolve_key": "FIPSCITY",
            "zoom": 9,
            "attr_cols": [],
        },
    }


# ── Process one geographic level ───────────────────────────────────

def process_level(name, config, orgs_gdf, orgs_df):
    print(f"\n{'='*60}")
    print(f"Processing: {name}")
    print(f"{'='*60}")

    csv_key = config["csv_key"]
    geo_key = config["geo_key"]
    zoom = config["zoom"]
    pad_width = config.get("csv_key_pad")
    attr_cols = config.get("attr_cols", [])

    # Load polygon GDF — used for both spatial join and geometry extraction
    print("  Loading geometries...")
    poly_gdf = load_poly_gdf(
        config["geo"],
        geo_key,
        filter_by=config.get("filter"),
        dissolve_key=config.get("dissolve_key"),
        pad_width=pad_width,
    )
    geometries, geo_attrs = gdf_to_geometries(poly_gdf, geo_key, attr_cols or None)
    print(f"    {len(geometries)} polygons")

    # Aggregate org data to this geographic level
    print("  Aggregating orgs...")
    if name == "states":
        combined = aggregate_by_state(orgs_df)
    else:
        combined = aggregate_by_polygon(orgs_gdf, poly_gdf, csv_key)
    print(f"    {len(combined)} regions with data")

    # Rename dotted combined-CSV column names to frontend tile property names
    combined = combined.rename(columns=COLUMN_RENAMES)

    # Ensure every polygon in the geo reference has a row (missing = zero terminations)
    all_geo_keys = pd.DataFrame({csv_key: list(geometries.keys())})
    combined = all_geo_keys.merge(combined, on=csv_key, how="left")
    num_cols = combined.select_dtypes(include="number").columns
    combined[num_cols] = combined[num_cols].fillna(0)
    print(f"  After filling missing regions: {len(combined)} rows")

    # Merge geo attributes (county name, state name, STATEFP, etc.)
    if geo_attrs:
        attr_rows = [{csv_key: k, **v} for k, v in geo_attrs.items()]
        attr_df = pd.DataFrame(attr_rows)
        combined = combined.merge(attr_df, on=csv_key, how="left")

    # County: full state name → abbreviation
    if name == "counties" and "state" in combined.columns:
        combined["state"] = combined["state"].map(FULL_TO_ABBR).fillna(combined["state"])

    # Districts: derive state abbreviation and CD number from STATEFP/GEOID
    if name == "districts" and "STATEFP" in combined.columns:
        combined["state"] = combined["STATEFP"].map(FIPS_TO_STATE)
        combined["state_code"] = combined["state"]
        combined["CD119FP"] = combined[csv_key].astype(str).str[-2:]

    # Build GeoJSON, tile, upload
    geojson = build_geojson(combined, geometries, csv_key)
    tile_name = f"tiles_{name}_total_v{TILE_VERSION}-v2"
    geojson_path = os.path.join(OUTPUT_DIR, f"terminations_{name}.geojson")
    save_geojson(geojson, geojson_path)

    print("  Generating tiles...")
    tile_dir = os.path.join(OUTPUT_DIR, tile_name)
    generate_tiles(geojson_path, tile_dir, zoom)

    print("  Uploading tiles...")
    upload_tiles(tile_dir, tile_name)

    print(f"  Done: {name}")
    return combined if name == "states" else None


# ── Generate state_total_losses.json ───────────────────────────────

def generate_state_totals(state_df):
    """Generate state_total_losses.json for the frontend."""
    state_losses = {}
    for _, row in state_df.iterrows():
        state_code = row["state"]
        state_losses[state_code] = {
            "state_code": state_code,
            "term_loss": row.get("terminated_econ_loss", 0) or 0,
            "term_job_loss": row.get("terminated_job_loss", 0) or 0,
            "idc_loss": 0,
            "idc_job_loss": 0,
        }

    output_path = os.path.join(REACT_DATA_DIR, "state_total_losses.json")
    with open(output_path, "w") as f:
        json.dump({"STATE_LOSSES": state_losses}, f)
    print(f"  Saved: {output_path}")


# ── Generate terminated_grants.json (scatter plot data) ────────────

def generate_terminated_grants(orgs_df):
    """Build terminated_grants.json from combined org data using actual lat/lon."""
    print("\nGenerating terminated_grants.json...")

    df = orgs_df.dropna(subset=["lat", "lon"]).copy()
    df = df[df["overall_loss.combined"] > 0]

    def agency(row):
        nih = row.get("overall_loss.nih", 0) or 0
        nsf = row.get("overall_loss.nsf", 0) or 0
        if nih > 0 and nsf > 0:
            return "both"
        if nsf > 0:
            return "nsf"
        return "nih"

    grant_losses = []
    for _, row in df.iterrows():
        loss = float(row.get("overall_loss.combined", 0) or 0)
        grant_losses.append({
            "org_name": row["org_name"],
            "lat": round(float(row["lat"]), 6),
            "lon": round(float(row["lon"]), 6),
            "terminated_loss": loss,
            "terminated_num": int(row.get("overall_grant_loss.combined", 1) or 1),
            "terminated_loss_noself": loss,
            "agency": agency(row),
        })

    print(f"  {len(grant_losses)} orgs with losses")

    output_path = os.path.join(REACT_DATA_DIR, "terminated_grants.json")
    with open(output_path, "w") as f:
        json.dump({"GRANT_LOSSES": grant_losses}, f)
    print(f"  Saved: {output_path}")


# ── Main ───────────────────────────────────────────────────────────

def main():
    os.makedirs(OUTPUT_DIR, exist_ok=True)

    print("Downloading geo-reference data...")
    download_geo_refs()

    print("\nLoading combined org data...")
    orgs_df, latest_week = load_combined_orgs()
    orgs_gdf = make_orgs_gdf(orgs_df)
    print(f"  {len(orgs_gdf)} orgs with coordinates")

    levels = build_levels()
    state_df = None

    for name, config in levels.items():
        result = process_level(name, config, orgs_gdf, orgs_df)
        if result is not None:
            state_df = result

    print("\nGenerating summary files...")
    if state_df is not None:
        generate_state_totals(state_df)

    generate_terminated_grants(orgs_df)

    tile_version_path = os.path.join(REACT_DATA_DIR, "tile_version.json")
    with open(tile_version_path, "w") as f:
        json.dump({"TILE_VERSION": TILE_VERSION}, f)
    print(f"\nTile version: {TILE_VERSION}")

    print("\nAll done!")


if __name__ == "__main__":
    main()