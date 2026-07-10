---
name: update-budget-data
description: Update the FY27 NIH/NSF budget-impact map data end-to-end (tiles, tables, report cards) after new source CSVs land in data/2027. Use when the user says they've updated NIH or NSF FY27 budget data, or asks to refresh/republish the FY27 map, mint a new tile version, or regenerate the budget tables/report cards.
---

# Update FY27 budget-impact data (end-to-end)

This skill republishes the **FY27 budget-cut map** (`/fy27`) after someone drops new
source CSVs into `data/2027/`. It bumps the tile version, regenerates all derived
artifacts, uploads fresh tiles to R2, and verifies the build.

The FY27 map merges **NIH + NSF** per geography, so a change to *either* agency's
CSVs requires the full run below — the tiles, tables, and report cards all bake in
the combined totals.

## Source data (already in place before you start)

Source CSVs live in (both are `.gitignore`d — `data/` is not committed):
- `data/2027/FY2027 NIH Budget/`
- `data/2027/FY2027 NSF Budget/`

Per level the pipeline expects: `*_budget27_state.csv`, `*_budget27_county.csv`,
`*_budget27_cong.csv`, `*_budget27_city.csv`, plus the `top5inst` files used by the
report card. Key columns consumed downstream: `econ_budg_{NIH,NSF}_cuts`,
`budg_{NIH,NSF}_cuts`, `jobs_budg_{NIH,NSF}_cuts`, and the ids `state` / `FIPS` /
`GEOID` / `CBSA_FIPS`, plus `inst_name` in the top5inst files.

## Prerequisites (verify once)

- `tippecanoe` on PATH (`which tippecanoe`)
- `rclone` on PATH with an `r2:` remote configured (`rclone listremotes`)
- Python with `pandas` + `geopandas` (the repo uses miniconda's `python3`)

## Steps

### 0. Sanity-check the new CSV headers
Before running anything, confirm the updated CSVs still have the expected columns —
a header rename upstream silently zeroes a column via the scripts' `safe_*` fallbacks.
```bash
cd "data/2027/FY2027 NSF Budget"   # or NIH
for f in NSF_budget27_state.csv NSF_budget27_county.csv NSF_budget27_cong.csv NSF_budget27_city.csv; do
  echo "=== $f ==="; head -1 "$f"; done
```
Look for `econ_budg_NSF_cuts`, `budg_NSF_cuts`, `jobs_budg_NSF_cuts` (and NIH equivalents).

### 1. Bump the tile version (CACHE-BUSTING — do not skip)
Tiles are CDN-cached by path. Re-running with the same version overwrites the same
R2 path and users keep seeing **stale cached tiles**. Bump the version so a fresh
path is minted. Keep the two locations in sync:

- `scripts/fy27_budget.py` → `TILE_VERSION = "v5"` → bump to `"v6"` (next letter/number)
- `src/lib/fy27-map-config.ts` → the **three** `tileUrl` lines
  (`tiles_counties_budget27_vN`, `tiles_districts_...`, `tiles_states_...`)

> Note: the FY27 map config only wires up counties/districts/states. `fy27_budget.py`
> also builds a `cities` tileset at the same version — harmless, just unused.
> The `TILE_VERSION` here is a simple `vN` counter, **separate** from the date-based
> `src/data/tile_version.json` used by the baseline/terminations maps.

### 2. Regenerate the table JSON
Writes `src/data/table_fy27_{states,counties,districts}.json`.
```bash
python3 scripts/generate_fy27_budget_table_data.py
```

### 3. Regenerate the report cards
Writes `src/data/report_card_info_fy27.json` and `state_report_card_info_fy27.json`.
```bash
python3 scripts/generate_report_card_fy27.py
```
Expected benign warnings: `no FY26 bounds for AS-98 / GU-98 / PR-98 / VI-98` — those
territories have no FY26 district bounds to reuse and are skipped by design.

### 4. Build + upload the tiles (the slow, outward-facing step)
Downloads geo-ref shapefiles to a tmp cache (first run only), builds MVT tiles per
level via tippecanoe, and `rclone copy`s them to `r2:scimap-data/tiles_<level>_budget27_<version>/`.
This **publishes** to R2 — new path, so it will not clobber the currently-live tiles.
```bash
python3 scripts/fy27_budget.py
```
stdout is block-buffered when redirected, so run it in the background and read the
output file at the end rather than expecting live progress. Confirm each level ends
with `Upload complete: tiles_<level>_budget27_<version>`.

### 5. Verify the build
Use `--force` — cached `tsc -b` can miss type errors (Cloudflare builds clean and will catch them).
```bash
npx tsc -b --force && npm run test
```

### 6. Commit
`data/` is gitignored, so the commit is the version bumps + regenerated `src/data/*.json`.
```
git add scripts/fy27_budget.py src/lib/fy27-map-config.ts src/data/
git commit
```
Only commit/push when the user asks. Branch first if on `main`.

## Verification checklist
- [ ] `TILE_VERSION` in `fy27_budget.py` and the 3 `tileUrl`s in `fy27-map-config.ts` all show the **same new** version
- [ ] 5 regenerated files under `src/data/` show up in `git diff --stat`
- [ ] Pipeline printed `Upload complete` for states, counties, districts, cities
- [ ] `tsc -b --force` and tests pass
