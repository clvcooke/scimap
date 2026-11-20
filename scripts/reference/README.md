# Baseline table population references

These checked-in CSVs make `python scripts/generate_table_data.py --population-only` reproducible from a website checkout. That command changes only `pop_2024` in the existing tables; it does not recalculate funding, jobs, names, IDs or row order.

| File | Provenance | SHA-256 |
|---|---|---|
| `pop_2024_counties.csv` | `FIPS` and `pop_2024` columns from `scienceimpacts/SciMap_Maps` `data/county_pop.csv` at `4684cf10143decacaab65e177dd623ed1d74afd0`, with the original values/order unchanged, plus five appended April 1, 2020 Census rows | `53955b7eede96ffd4fac9f14843db0cbe174f6f219f42ef1a4095cbfb8617a4a` |
| `pop_2024_states.csv` | Existing published `pop_2024` values from `src/data/table_states.json` at website commit `cc90f30`; keyed by `id`, sorted, missing zero placeholders converted to blank, then the five territory blanks filled from the April 1, 2020 Census | `4f57ca24591cfc30a2fac89402781a4559046fb18f49785a92a1afc842e19e9e` |
| `pop_2024_districts.csv` | Existing published `pop_2024` values from `src/data/table_districts.json` at website commit `cc90f30`; keyed by `id`, sorted, missing zero placeholders converted to blank, then the five at-large district blanks filled from the April 1, 2020 Census | `90aacae0ab3ef6c3f8c466cf0138eb16acae66f09dc7925ffd98dad32d0b505e` |

The original county source SHA-256 is `773470640fee82d9a8a1b530b63f359c722b2ebfd3efa7436cb1304b839dfc7d`. County/state name columns are omitted so population joins do not add duplicate metadata to map tiles.

The state/district references preserve existing website values; they are not newly sourced population estimates or independent verification of their vintage. All 2,825 previously populated county rows match the county source exactly. This correction restores the other 319 mainland county populations without selecting a new scientific baseline release.

Blank cells mean unavailable, not zero. `CD_pop2024.csv` in the scientific repository was not used.

The five previously blank territory state rows and at-large district rows now store April 1, 2020 Census counts in the historical `pop_2024` column. They are not 2024 estimates. American Samoa (49,710), Guam (153,836), the Northern Mariana Islands (47,329), and the U.S. Virgin Islands (87,146) are the 2020 Census Island Areas totals (https://www.census.gov/library/stories/2021/10/first-2020-census-united-states-island-areas-data-released-today.html). Puerto Rico (3,285,874) is the 2020 Census of Puerto Rico (https://www.census.gov/library/stories/state-by-state/puerto-rico.html). Each at-large district uses the same territory total: `6098`, `6698`, `6998`, `7298`, `7898`.

Appended county rows are the Census area that matches the NIH/NSF county FIPS, not a second copy of the territory total: `60010` Eastern District 17,059; `60050` Western District 31,819; `66010` Guam 153,836; `69110` Saipan Municipality 43,385; `78030` St. Thomas Island 42,261. American Samoa's county rows omit Manu'a District (832). The Northern Mariana Islands row omits Rota, Tinian, and the Northern Islands. The Virgin Islands row omits St. Croix and St. John. Puerto Rico municipio rows stay blank because those counts are not in these tables.

The full baseline generator reads NIH/NSF CSVs under `data/baseline_new/`. `--population-only` still changes only `pop_2024` on an existing table. A full run replaces funding and jobs from those CSVs.

Tests compare every committed table population with these references and check repeatable population-only generation while preserving every other field. Population tests run in the website's GitHub test workflow.
