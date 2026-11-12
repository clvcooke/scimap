# Baseline table population references

These checked-in CSVs make `python scripts/generate_table_data.py --population-only` reproducible from a website checkout. That command changes only `pop_2024` in the existing tables; it does not recalculate funding, jobs, names, IDs or row order.

| File | Provenance | SHA-256 |
|---|---|---|
| `pop_2024_counties.csv` | `FIPS` and `pop_2024` columns from `scienceimpacts/SciMap_Maps` `data/county_pop.csv` at `4684cf10143decacaab65e177dd623ed1d74afd0`, with values/order unchanged | `b35b66b237801f63e038e0c8140b86f03880597a949018cc0bbd26646f2fc9db` |
| `pop_2024_states.csv` | Existing published `pop_2024` values from `src/data/table_states.json` at website commit `cc90f30`; keyed by `id`, sorted, missing zero placeholders converted to blank | `28eb677d33366789482043becbc4e24da13377cdf898b85727108a2be42d01ba` |
| `pop_2024_districts.csv` | Existing published `pop_2024` values from `src/data/table_districts.json` at website commit `cc90f30`; keyed by `id`, sorted, missing zero placeholders converted to blank | `40323e764f128a3b93292017301693491371b2dc70ae3f8d7d609887daecb918` |

The original county source SHA-256 is `773470640fee82d9a8a1b530b63f359c722b2ebfd3efa7436cb1304b839dfc7d`. County/state name columns are omitted so population joins do not add duplicate metadata to map tiles.

The state/district references preserve existing website values; they are not newly sourced population estimates or independent verification of their vintage. All 2,825 previously populated county rows match the county source exactly. This correction restores the other 319 mainland county populations without selecting a new scientific baseline release.

**Territory populations are still waiting on Elena's reviewed data and reference years.** Blank cells mean unavailable, not zero. The current table gaps are 22 county areas, five territory-wide rows and five territory district rows. `CD_pop2024.csv` in the scientific repository does contain territory numbers, but a filename alone does not establish their reference year; these values were not silently substituted into `pop_2024`.

The default full generator still requires the matching NIH/NSF baseline funding CSVs under `data/baseline_new/`. Those inputs are not all present here, and current scientific-repository outputs differ from the website's funding totals. Use `--population-only` for this correction; do not use a newer scientific baseline to reconstruct this patch.

Tests compare every committed table population with these references and check repeatable population-only generation while preserving every other field. Population tests run in the website's GitHub test workflow.
