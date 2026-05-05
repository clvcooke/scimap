"""
Generate pre-aggregated JSON table data from the combined terminations CSV.

Reads terminations_org_combined.csv, takes the latest week's cumulative totals,
aggregates to state/county/district level (county and district via spatial join),
and writes a compact JSON array for each level into src/data/.

Region names are pulled from the existing baseline table JSON.

Usage:
    python scripts/generate_termination_table_data.py
"""

import json
import os
import subprocess
import tempfile
import zipfile

import geopandas as gpd
import pandas as pd

SCRIPT_DIR = os.path.dirname(os.path.abspath(__file__))
PROJECT_ROOT = os.path.join(SCRIPT_DIR, "..")
OUTPUT_DIR = os.path.join(PROJECT_ROOT, "src", "data")

COMBINED_CSV = os.path.join(
    PROJECT_ROOT, "data", "terminations", "Terminations Combined",
    "terminations_org_combined.csv",
)

R2_BASE = "https://pub-16c87e1620124b38879fbf81846cfc4c.r2.dev/reference-data"
GEO_CACHE_DIR = os.path.join(tempfile.gettempdir(), "scimap_geo_cache")

GEO_FILES = [
    "CongDist_shp.zip",
    "merged_data_counties_CLIP_Compress.geojson",
]


# ── Geo cache ──────────────────────────────────────────────────────

def ensure_geo_refs():
    """Download required geo-reference files if not already cached."""
    os.makedirs(GEO_CACHE_DIR, exist_ok=True)
    for filename in GEO_FILES:
        local_path = os.path.join(GEO_CACHE_DIR, filename)
        if os.path.exists(local_path):
            continue
        url = f"{R2_BASE}/{filename}"
        print(f"  Downloading: {filename} ...")
        rc = subprocess.run(["curl", "-sL", "-o", local_path, url]).returncode
        if rc != 0:
            raise RuntimeError(f"curl failed for {url} (exit {rc})")
        if filename.endswith(".zip"):
            extract_dir = os.path.join(GEO_CACHE_DIR, os.path.splitext(filename)[0])
            if not os.path.exists(extract_dir):
                with zipfile.ZipFile(local_path, "r") as zf:
                    zf.extractall(extract_dir)


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
    """Return org DataFrame at the most recent week."""
    df = pd.read_csv(COMBINED_CSV)
    df["week"] = df["week"].astype(str)
    latest_week = df["week"].max()
    df = df[df["week"] == latest_week].drop_duplicates(
        subset=["org_name", "org_city", "org_state"], keep="last"
    )
    print(f"  {len(df)} orgs at week {latest_week}")
    return df


def make_orgs_gdf(df):
    """Create GeoDataFrame from org lat/lon, dropping rows without coordinates."""
    df = df.dropna(subset=["lat", "lon"]).copy()
    gdf = gpd.GeoDataFrame(
        df,
        geometry=gpd.points_from_xy(df["lon"], df["lat"]),
        crs="EPSG:4326",
    )
    return gdf


# ── Aggregation ────────────────────────────────────────────────────

AGG_VALUE_COLS = [
    "overall_loss.nih", "overall_econ_loss.nih", "overall_job_loss.nih",
    "overall_loss.nsf", "overall_econ_loss.nsf", "overall_job_loss.nsf",
    "overall_loss.combined", "overall_econ_loss.combined", "overall_job_loss.combined",
]


def aggregate_by_state(orgs_df):
    val_cols = [c for c in AGG_VALUE_COLS if c in orgs_df.columns]
    agg = orgs_df.groupby("org_state")[val_cols].sum().reset_index()
    agg = agg.rename(columns={"org_state": "id"})
    return agg


def aggregate_by_polygon(orgs_gdf, poly_gdf, poly_key):
    joined = gpd.sjoin(
        orgs_gdf,
        poly_gdf[[poly_key, "geometry"]],
        how="left",
        predicate="within",
    )
    joined = joined.dropna(subset=[poly_key])
    val_cols = [c for c in AGG_VALUE_COLS if c in joined.columns]
    agg = joined.groupby(poly_key)[val_cols].sum().reset_index()
    agg = agg.rename(columns={poly_key: "id"})
    return agg


# ── Output row building ────────────────────────────────────────────

def load_name_lookup(level_name):
    """Load region names from existing baseline table JSON."""
    baseline_path = os.path.join(OUTPUT_DIR, f"table_{level_name}.json")
    if not os.path.exists(baseline_path):
        return {}
    with open(baseline_path, encoding="utf-8") as f:
        rows = json.load(f)
    return {row["id"]: row["name"] for row in rows}


def build_rows(agg_df, name_lookup):
    rows = []
    for _, row in agg_df.iterrows():
        rid = str(row["id"])
        rows.append({
            "id": rid,
            "name": name_lookup.get(rid, rid),
            "nih_econ_loss":     round(row.get("overall_econ_loss.nih", 0) or 0, 2),
            "nih_funding_loss":  round(row.get("overall_loss.nih", 0) or 0, 2),
            "nih_job_loss":      round(row.get("overall_job_loss.nih", 0) or 0, 4),
            "nsf_econ_loss":     round(row.get("overall_econ_loss.nsf", 0) or 0, 2),
            "nsf_funding_loss":  round(row.get("overall_loss.nsf", 0) or 0, 2),
            "nsf_job_loss":      round(row.get("overall_job_loss.nsf", 0) or 0, 4),
            "total_econ_loss":   round(row.get("overall_econ_loss.combined", 0) or 0, 2),
            "total_funding_loss": round(row.get("overall_loss.combined", 0) or 0, 2),
            "total_job_loss":    round(row.get("overall_job_loss.combined", 0) or 0, 4),
        })
    return rows


# ── Main ───────────────────────────────────────────────────────────

def main():
    os.makedirs(OUTPUT_DIR, exist_ok=True)

    print("Ensuring geo-reference files...")
    ensure_geo_refs()

    print("\nLoading combined org data...")
    orgs_df = load_combined_orgs()
    orgs_gdf = make_orgs_gdf(orgs_df)

    # States — simple groupby, no spatial join needed
    print("\nProcessing states...")
    name_lookup = load_name_lookup("states")
    print(f"  Name lookup: {len(name_lookup)} entries")
    agg = aggregate_by_state(orgs_df)
    rows = build_rows(agg, name_lookup)
    out_path = os.path.join(OUTPUT_DIR, "table_terminations_states.json")
    with open(out_path, "w", encoding="utf-8") as f:
        json.dump(rows, f, separators=(",", ":"))
    print(f"  {len(rows)} states -> {out_path}")

    # Counties — spatial join against county boundaries
    print("\nProcessing counties...")
    name_lookup = load_name_lookup("counties")
    print(f"  Name lookup: {len(name_lookup)} entries")
    county_gdf = gpd.read_file(geo_path("merged_data_counties_CLIP_Compress.geojson"))
    if county_gdf.crs and county_gdf.crs != "EPSG:4326":
        county_gdf = county_gdf.to_crs(epsg=4326)
    county_gdf["FIPS"] = county_gdf["FIPS"].astype(str)
    agg = aggregate_by_polygon(orgs_gdf, county_gdf, "FIPS")
    rows = build_rows(agg, name_lookup)
    out_path = os.path.join(OUTPUT_DIR, "table_terminations_counties.json")
    with open(out_path, "w", encoding="utf-8") as f:
        json.dump(rows, f, separators=(",", ":"))
    print(f"  {len(rows)} counties -> {out_path}")

    # Districts — spatial join against congressional district boundaries
    print("\nProcessing districts...")
    name_lookup = load_name_lookup("districts")
    print(f"  Name lookup: {len(name_lookup)} entries")
    dist_shp = find_shapefile(geo_path("CongDist_shp"))
    dist_gdf = gpd.read_file(dist_shp)
    if dist_gdf.crs and dist_gdf.crs != "EPSG:4326":
        dist_gdf = dist_gdf.to_crs(epsg=4326)
    dist_gdf["GEOID"] = dist_gdf["GEOID"].astype(str).str.zfill(4)
    agg = aggregate_by_polygon(orgs_gdf, dist_gdf, "GEOID")
    rows = build_rows(agg, name_lookup)
    out_path = os.path.join(OUTPUT_DIR, "table_terminations_districts.json")
    with open(out_path, "w", encoding="utf-8") as f:
        json.dump(rows, f, separators=(",", ":"))
    print(f"  {len(rows)} districts -> {out_path}")

    print("\nDone!")


if __name__ == "__main__":
    main()
