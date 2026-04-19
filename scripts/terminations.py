"""
Process terminated-grants data from data/terminations/ into:
  1. MVT tiles (state, county, district, city) uploaded to Cloudflare R2
  2. src/data/terminated_grants.json  (scatter-plot / cluster-layer data)
  3. src/data/state_total_losses.json (state-level summary)

Input data lives in data/terminations/{nih,nsf}/ with weekly time-series CSVs
at each geographic level plus org-level detail.

Methodology mirrors baseline.py: download geo-reference files, merge data with
geometries, generate GeoJSON, tile with tippecanoe, upload via rclone.
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

NIH_DIR = os.path.join(PROJECT_ROOT, "data", "terminations", "nih")
NSF_DIR = os.path.join(PROJECT_ROOT, "data", "terminations", "nsf")

TILE_VERSION = datetime.now().strftime("%Y-%m-%d") + "c"

# ── Remote geo-reference data (same as baseline.py) ───────────────

R2_BASE = "https://pub-16c87e1620124b38879fbf81846cfc4c.r2.dev/reference-data"
GEO_CACHE_DIR = os.path.join(tempfile.gettempdir(), "scimap_geo_cache")

R2_FILES = [
    "Cities_Counties.zip",
    "CongDist_shp.zip",
    "merged_data_counties_CLIP_Compress.geojson",
    "merged_data_states_CLIP.geojson",
]

VALUE_COLS = [
    "current_loss",
    "current_econ_loss",
    "current_job_loss",
    "overall_loss",
    "overall_econ_loss",
    "overall_job_loss",
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


# ── State FIPS → abbreviation mapping ─────────────────────────────

FIPS_TO_STATE = {
    '01':'AL','02':'AK','04':'AZ','05':'AR','06':'CA','08':'CO','09':'CT',
    '10':'DE','11':'DC','12':'FL','13':'GA','15':'HI','16':'ID','17':'IL',
    '18':'IN','19':'IA','20':'KS','21':'KY','22':'LA','23':'ME','24':'MD',
    '25':'MA','26':'MI','27':'MN','28':'MS','29':'MO','30':'MT','31':'NE',
    '32':'NV','33':'NH','34':'NJ','35':'NM','36':'NY','37':'NC','38':'ND',
    '39':'OH','40':'OK','41':'OR','42':'PA','44':'RI','45':'SC','46':'SD',
    '47':'TN','48':'TX','49':'UT','50':'VT','51':'VA','53':'WA','54':'WV',
    '55':'WI','56':'WY','60':'AS','66':'GU','69':'MP','72':'PR','78':'VI',
}


# ── Geographic level configuration ─────────────────────────────────

def build_levels():
    return {
        "states": {
            "nih_csv": os.path.join(NIH_DIR, "terminations_state.csv"),
            "nsf_csv": os.path.join(NSF_DIR, "terminations_state_nsf.csv"),
            "geo": geo_path("merged_data_states_CLIP.geojson"),
            "csv_key": "state",
            "geo_key": "state_code",
            "zoom": 7,
            "attr_cols": [],  # state abbrev already comes from CSV key
        },
        "counties": {
            "nih_csv": os.path.join(NIH_DIR, "terminations_county.csv"),
            "nsf_csv": os.path.join(NSF_DIR, "terminations_county_nsf.csv"),
            "geo": geo_path("merged_data_counties_CLIP_Compress.geojson"),
            "csv_key": "FIPS",
            "geo_key": "FIPS",
            "zoom": 9,
            "attr_cols": ["county", "state"],  # county name + full state name
        },
        "districts": {
            "nih_csv": os.path.join(NIH_DIR, "terminations_district.csv"),
            "nsf_csv": os.path.join(NSF_DIR, "terminations_district_nsf.csv"),
            "geo": geo_path("CongDist_shp"),
            "csv_key": "GEOID",
            "geo_key": "GEOID",
            "csv_key_pad": 4,
            "zoom": 9,
            "attr_cols": ["STATEFP"],  # state FIPS for deriving abbreviation
        },
        "cities": {
            "nih_csv": os.path.join(NIH_DIR, "terminations_city.csv"),
            # NSF "city" file actually uses county FIPS, not CBSA codes —
            # those losses are already in county tiles, so skip NSF here.
            "nsf_csv": None,
            "geo": geo_path("Cities_Counties"),
            "csv_key": "CBSA_FIPS",
            "geo_key": "FIPSCITY",
            "filter": {"CITYFLAG": 1},
            "dissolve_key": "FIPSCITY",
            "zoom": 9,
        },
    }


# ── Data loading ───────────────────────────────────────────────────

def load_latest_week(csv_path, key_col):
    """
    Load a terminations CSV and return only the latest week's data.

    NIH files use a numeric 'week' column; NSF files use a date-string 'week'.
    Both have the same value columns. We take the row with the max week value
    per geographic unit, which gives the cumulative 'overall_*' totals.
    """
    df = pd.read_csv(csv_path)

    # Normalize key to string — handle float FIPS codes (e.g. 10100.0 → "10100")
    if df[key_col].dtype in ("float64", "float32"):
        df = df.dropna(subset=[key_col])
        df[key_col] = df[key_col].astype(int).astype(str)
    else:
        df[key_col] = df[key_col].astype(str)

    # Find latest week per geographic unit
    # For NIH (numeric week): max int. For NSF (date string): max lexicographic = latest date.
    latest_week = df.groupby(key_col)["week"].transform("max")
    df = df[df["week"] == latest_week].copy()

    # De-duplicate (one row per geo unit)
    df = df.drop_duplicates(subset=[key_col], keep="last")

    return df


def combine_nih_nsf(nih_df, nsf_df, key_col):
    """
    Combine NIH and NSF dataframes on the join key.
    Sum the value columns; keep metadata from NIH (name columns, etc).
    """
    # Keep only key + value columns from each
    nih_vals = nih_df[[key_col] + [c for c in VALUE_COLS if c in nih_df.columns]].copy()
    nsf_vals = nsf_df[[key_col] + [c for c in VALUE_COLS if c in nsf_df.columns]].copy()

    # Rename to avoid collision on merge
    nih_rename = {c: f"nih_{c}" for c in VALUE_COLS if c in nih_vals.columns}
    nsf_rename = {c: f"nsf_{c}" for c in VALUE_COLS if c in nsf_vals.columns}
    nih_vals = nih_vals.rename(columns=nih_rename)
    nsf_vals = nsf_vals.rename(columns=nsf_rename)

    merged = nih_vals.merge(nsf_vals, on=key_col, how="outer")

    # Sum NIH + NSF for each value column
    for col in VALUE_COLS:
        nih_col = f"nih_{col}"
        nsf_col = f"nsf_{col}"
        if nih_col in merged.columns and nsf_col in merged.columns:
            merged[col] = merged[nih_col].fillna(0) + merged[nsf_col].fillna(0)
        elif nih_col in merged.columns:
            merged[col] = merged[nih_col].fillna(0)
        elif nsf_col in merged.columns:
            merged[col] = merged[nsf_col].fillna(0)

    # Also keep individual agency values for potential frontend use
    for col in VALUE_COLS:
        nih_col = f"nih_{col}"
        nsf_col = f"nsf_{col}"
        if nih_col in merged.columns:
            merged[nih_col] = merged[nih_col].fillna(0)
        if nsf_col in merged.columns:
            merged[nsf_col] = merged[nsf_col].fillna(0)

    # Rename combined values to match what the frontend expects
    merged = merged.rename(columns={
        "overall_loss": "terminated_loss",
        "overall_econ_loss": "terminated_econ_loss",
        "overall_job_loss": "terminated_job_loss",
        "current_loss": "terminated_current_loss",
        "current_econ_loss": "terminated_current_econ_loss",
        "current_job_loss": "terminated_current_job_loss",
    })

    # Preserve any non-value metadata from the NIH frame (e.g. CBSA_NAME)
    meta_cols = [c for c in nih_df.columns if c not in VALUE_COLS and c != "week" and c != "week_start" and c != "week_end" and c != key_col]
    if meta_cols:
        meta = nih_df.drop_duplicates(subset=[key_col])[[key_col] + meta_cols]
        merged = merged.merge(meta, on=key_col, how="left")

    return merged


# ── Geometry handling ──────────────────────────────────────────────

def load_geometries(geo_file, geo_key, filter_by=None, dissolve_key=None, attr_cols=None):
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

    geometries = {}
    attributes = {}
    for _, row in gdf.iterrows():
        key = row[geo_key]
        if pd.notna(key) and pd.notna(row.geometry):
            str_key = str(key)
            geometries[str_key] = row.geometry
            if attr_cols:
                attributes[str_key] = {
                    col: row[col] for col in attr_cols if col in row.index and pd.notna(row[col])
                }
    return geometries, attributes


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


# ── Tile generation / upload ───────────────────────────────────────

def to_wsl_path(windows_path):
    abs_path = os.path.abspath(windows_path)
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


# ── Process one geographic level ───────────────────────────────────

def process_level(name, config):
    print(f"\n{'='*60}")
    print(f"Processing: {name}")
    print(f"{'='*60}")

    csv_key = config["csv_key"]
    geo_key = config["geo_key"]
    zoom = config["zoom"]
    pad_width = config.get("csv_key_pad")

    # Load and filter to latest week
    print(f"  Loading NIH: {os.path.basename(config['nih_csv'])}")
    nih_df = load_latest_week(config["nih_csv"], csv_key)
    print(f"    {len(nih_df)} rows (latest week)")

    if config.get("nsf_csv"):
        print(f"  Loading NSF: {os.path.basename(config['nsf_csv'])}")
        nsf_df = load_latest_week(config["nsf_csv"], csv_key)
        print(f"    {len(nsf_df)} rows (latest week)")
        combined = combine_nih_nsf(nih_df, nsf_df, csv_key)
    else:
        print("  NSF: skipped (not available for this level)")
        # Rename columns to match expected output
        combined = nih_df.rename(columns={
            "overall_loss": "terminated_loss",
            "overall_econ_loss": "terminated_econ_loss",
            "overall_job_loss": "terminated_job_loss",
            "current_loss": "terminated_current_loss",
            "current_econ_loss": "terminated_current_econ_loss",
            "current_job_loss": "terminated_current_job_loss",
        })
        # Drop week columns
        combined = combined.drop(columns=["week", "week_start", "week_end"], errors="ignore")

    print(f"  Combined: {len(combined)} rows")

    # Normalize key (zero-pad if needed)
    if pad_width:
        combined[csv_key] = combined[csv_key].astype(str).str.zfill(pad_width)

    # Load geometries and geo attributes
    print(f"  Loading geometries...")
    attr_cols = config.get("attr_cols", [])
    geometries, geo_attrs = load_geometries(
        config["geo"],
        geo_key,
        filter_by=config.get("filter"),
        dissolve_key=config.get("dissolve_key"),
        attr_cols=attr_cols if attr_cols else None,
    )
    print(f"    {len(geometries)} geometries loaded")

    # Ensure every region in the geo reference has a row (no-data = zero terminations)
    all_geo_keys = pd.DataFrame({csv_key: list(geometries.keys())})
    combined = all_geo_keys.merge(combined, on=csv_key, how="left")
    # Fill missing numeric columns with 0
    num_cols = combined.select_dtypes(include="number").columns
    combined[num_cols] = combined[num_cols].fillna(0)
    print(f"  After filling missing regions: {len(combined)} rows")

    # Merge geo attributes (county name, state, etc.) into the dataframe
    if geo_attrs:
        attr_rows = []
        for key, attrs in geo_attrs.items():
            row = {csv_key: key}
            row.update(attrs)
            attr_rows.append(row)
        attr_df = pd.DataFrame(attr_rows)
        combined = combined.merge(attr_df, on=csv_key, how="left")

    # For counties: convert full state name to abbreviation
    if name == "counties" and "state" in combined.columns:
        # The geo file has full state names ("Alabama"); the frontend expects abbreviations ("AL")
        full_to_abbr = {v: k for k, v in {
            'AL':'Alabama','AK':'Alaska','AZ':'Arizona','AR':'Arkansas','CA':'California',
            'CO':'Colorado','CT':'Connecticut','DE':'Delaware','DC':'District of Columbia',
            'FL':'Florida','GA':'Georgia','HI':'Hawaii','ID':'Idaho','IL':'Illinois',
            'IN':'Indiana','IA':'Iowa','KS':'Kansas','KY':'Kentucky','LA':'Louisiana',
            'ME':'Maine','MD':'Maryland','MA':'Massachusetts','MI':'Michigan','MN':'Minnesota',
            'MS':'Mississippi','MO':'Missouri','MT':'Montana','NE':'Nebraska','NV':'Nevada',
            'NH':'New Hampshire','NJ':'New Jersey','NM':'New Mexico','NY':'New York',
            'NC':'North Carolina','ND':'North Dakota','OH':'Ohio','OK':'Oklahoma','OR':'Oregon',
            'PA':'Pennsylvania','RI':'Rhode Island','SC':'South Carolina','SD':'South Dakota',
            'TN':'Tennessee','TX':'Texas','UT':'Utah','VT':'Vermont','VA':'Virginia',
            'WA':'Washington','WV':'West Virginia','WI':'Wisconsin','WY':'Wyoming',
            'AS':'American Samoa','GU':'Guam','MP':'Northern Mariana Islands',
            'PR':'Puerto Rico','VI':'U.S. Virgin Islands',
        }.items()}
        combined["state"] = combined["state"].map(full_to_abbr).fillna(combined["state"])

    # For districts: derive state abbreviation from STATEFP
    if name == "districts" and "STATEFP" in combined.columns:
        combined["state"] = combined["STATEFP"].map(FIPS_TO_STATE)
        combined["state_code"] = combined["state"]
        combined["CD119FP"] = combined[csv_key].astype(str).str[-2:]

    # Build GeoJSON
    geojson = build_geojson(combined, geometries, csv_key)

    tile_name = f"tiles_{name}_total_v{TILE_VERSION}-v2"
    geojson_path = os.path.join(OUTPUT_DIR, f"terminations_{name}.geojson")
    save_geojson(geojson, geojson_path)

    # Generate and upload tiles
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
            # Keep backward compat with fields the frontend may use
            "idc_loss": 0,
            "idc_job_loss": 0,
        }

    output_path = os.path.join(REACT_DATA_DIR, "state_total_losses.json")
    with open(output_path, "w") as f:
        json.dump({"STATE_LOSSES": state_losses}, f)
    print(f"  Saved: {output_path}")


# ── Generate terminated_grants.json (scatter plot data) ────────────

def build_state_centroid_lookup():
    """
    Build a lookup from state_abbreviation -> (lat, lon)
    using state geometry centroids.
    """
    geo_file = geo_path("merged_data_states_CLIP.geojson")
    gdf = gpd.read_file(geo_file)
    if gdf.crs and gdf.crs != "EPSG:4326":
        gdf = gdf.to_crs(epsg=4326)

    lookup = {}
    for _, row in gdf.iterrows():
        state_code = row.get("state_code") or row.get("state") or ""
        if state_code and pd.notna(row.geometry):
            centroid = row.geometry.centroid
            lookup[str(state_code).upper()] = (centroid.y, centroid.x)

    print(f"  State centroid lookup: {len(lookup)} entries")
    return lookup


def generate_terminated_grants():
    """
    Combine NIH + NSF org-level data into terminated_grants.json.
    Geocode orgs to lat/lon via city centroid lookup.
    """
    print("\nGenerating terminated_grants.json...")

    nih_org_path = os.path.join(NIH_DIR, "terminations_org.csv")
    nsf_org_path = os.path.join(NSF_DIR, "terminations_org_nsf.csv")

    # Load org data, latest week only
    nih_orgs = pd.read_csv(nih_org_path)
    nsf_orgs = pd.read_csv(nsf_org_path)

    def latest_org_data(df):
        """Get latest week per org (using org_name + org_city + org_state as key)."""
        latest = df.groupby(["org_name", "org_city", "org_state"])["week"].transform("max")
        df = df[df["week"] == latest].drop_duplicates(
            subset=["org_name", "org_city", "org_state"], keep="last"
        )
        return df

    nih_orgs = latest_org_data(nih_orgs)
    nsf_orgs = latest_org_data(nsf_orgs)

    print(f"  NIH orgs: {len(nih_orgs)}, NSF orgs: {len(nsf_orgs)}")

    # Combine: sum values for orgs that appear in both
    nih_orgs = nih_orgs.set_index(["org_name", "org_city", "org_state"])
    nsf_orgs = nsf_orgs.set_index(["org_name", "org_city", "org_state"])

    # Get all value cols present
    val_cols = [c for c in VALUE_COLS if c in nih_orgs.columns]

    combined = nih_orgs[val_cols].add(nsf_orgs[val_cols], fill_value=0)

    # Add orgs only in one source
    nih_only = nih_orgs.index.difference(nsf_orgs.index)
    nsf_only = nsf_orgs.index.difference(nih_orgs.index)
    both = nih_orgs.index.intersection(nsf_orgs.index)

    frames = []
    if len(both) > 0:
        df_both = combined.loc[both].copy()
        df_both["agency"] = "both"
        frames.append(df_both)
    if len(nih_only) > 0:
        df_nih = nih_orgs.loc[nih_only, val_cols].copy()
        df_nih["agency"] = "nih"
        frames.append(df_nih)
    if len(nsf_only) > 0:
        df_nsf = nsf_orgs.loc[nsf_only, val_cols].copy()
        df_nsf["agency"] = "nsf"
        frames.append(df_nsf)

    all_orgs = pd.concat(frames).reset_index()
    print(f"  Combined orgs: {len(all_orgs)}")

    # Build state centroid lookup for geocoding
    # (org data lacks lat/lon; state centroid is a reasonable fallback)
    centroid_lookup = build_state_centroid_lookup()

    # Geocode and build output
    grant_losses = []
    geocoded = 0
    for _, row in all_orgs.iterrows():
        state_abbr = str(row["org_state"]).upper().strip() if pd.notna(row["org_state"]) else ""
        coords = centroid_lookup.get(state_abbr)

        if coords is None:
            continue  # Skip orgs we can't geocode

        geocoded += 1
        loss = float(row.get("overall_loss", 0) or 0)
        grant_losses.append({
            "org_name": row["org_name"],
            "lat": round(coords[0], 6),
            "lon": round(coords[1], 6),
            "terminated_loss": loss,
            "terminated_num": 1,  # No grant count in new data
            "terminated_loss_noself": loss,
            "agency": row.get("agency", "nih"),
        })

    print(f"  Geocoded: {geocoded}/{len(all_orgs)} orgs")

    # Filter to orgs with actual losses
    grant_losses = [g for g in grant_losses if g["terminated_loss"] > 0]
    print(f"  With losses: {len(grant_losses)} orgs")

    output_path = os.path.join(REACT_DATA_DIR, "terminated_grants.json")
    with open(output_path, "w") as f:
        json.dump({"GRANT_LOSSES": grant_losses}, f)
    print(f"  Saved: {output_path}")


# ── Main ───────────────────────────────────────────────────────────

def main():
    os.makedirs(OUTPUT_DIR, exist_ok=True)

    print("Downloading geo-reference data...")
    download_geo_refs()

    levels = build_levels()
    state_df = None

    for name, config in levels.items():
        result = process_level(name, config)
        if result is not None:
            state_df = result

    print("\nGenerating summary files...")
    if state_df is not None:
        generate_state_totals(state_df)

    generate_terminated_grants()

    # Write tile version for the frontend
    tile_version_path = os.path.join(REACT_DATA_DIR, "tile_version.json")
    with open(tile_version_path, "w") as f:
        json.dump({"TILE_VERSION": TILE_VERSION}, f)
    print(f"\nTile version: {TILE_VERSION}")

    print("\nAll done!")


if __name__ == "__main__":
    main()
