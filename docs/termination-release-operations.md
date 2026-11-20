# Termination release selection

The grants page and grants preview in `/maps` load one checksummed manifest and its
JSON artifacts before displaying data. They share the same selection for a page
session. Table CSV exports include the release ID; scientific downloads point to
that same release. A reload reads the selection again. There is no bundled-data
fallback after a failed request, so partial or mixed releases are never displayed.

The review build uses `/termination-selection.json`, which selects the reviewed
Guam release `2026-10-23-s01-reviewed-20261118-guam-local`. No R2 pointer is created by deploying this change. To use
operator selection without rebuilding the site for each release, configure
`VITE_TERMINATION_SELECTION_URL` once to
`https://data.scienceimpacts.org/terminations/website-release.json` and deploy after
the team's exact-release/cutover approval. Configure pointer responses to revalidate
(`Cache-Control: no-cache`) and retain immutable release objects. The selection
helper applies the correct pointer headers. The JSON/PBF CORS allowlist must cover
the deployed origin, Pages previews and `http://localhost:5173`.

## Prepare, select and roll back

Publish a new release ID with the AWS CLI transport. It does not call rclone:

```sh
python scripts/publish_termination_release.py /path/to/release \
  --remote r2:scimap-data \
  --record /path/to/upload-record.json
```

That command needs `R2_ACCESS_KEY_ID`, `R2_SECRET_ACCESS_KEY`, and `R2_ENDPOINT` or `R2_ACCOUNT_ID`. It refuses a destination that already has objects, puts each object with `If-None-Match: *` and `Content-MD5`, uploads every file except the manifest, downloads every object and checks its size and SHA-256, checks public checksums, and uploads the manifest last. Listings force JSON output, disable the CLI pager and input prompts, and pass `--no-paginate` so this command owns continuation tokens. `AWS_DEFAULT_OUTPUT=off` or `text` cannot make an occupied prefix look empty, and each listing response stays one service page. A blank, malformed, or incomplete listing fails before any upload. The upload record stores the publisher git revision separately from the candidate manifest's code provenance. It does not change `latest-validated.json`, `website-release.json`, or `/termination-selection.json`.

Use an upload record from `publish_termination_release.py` with status `published`.
The selector checks the public manifest hash, validation, code cleanliness, supported
point policy and recorded public checksums for every table/CSV/institution artifact.
A dry run performs reads only. Keep the exact reviewed manifest/hash and actual team
approval in the handoff. `--approved-by` records authorization; it does not grant it.

```sh
python scripts/select_termination_release.py \
  --upload-record /path/to/upload-record.json --pointer website-release \
  --approved-by 'actual approving reviewers' --reason 'approved release cutover'
```

Inspect the prepared result. Add `--apply --record /new/path/selection-record.json`
only for the authorized selection. Run from a shell with the existing R2 rclone
credentials. Each change first archives the previous pointer under
`terminations/selections/`, writes one pointer and checks both object-store and
public contents. Keep local records as private operations evidence.

Rollback uses the exact same command with the earlier approved release's upload
record and a new reason/record. It does not rebuild data or overwrite a release.
Do not change `latest-validated` for a historical replay. Normal daily publication
advances latest only after upload verification and rejects a backwards cutoff.
Neither path automatically selects a release for website production.

If a write times out, the record says `unconfirmed`. Inspect the authenticated
pointer and its public response before taking another action; do not blindly retry.
All pointer writers must share the daily workflow's single concurrency group, or
operators must ensure no run is active before using the local CLI.

## Territory map coverage

State/county geometry references cover the 50 states plus DC. The generator reuses territory-wide polygons from the existing 119th-Congress district reference for Puerto Rico (`7298`), the Virgin Islands (`7898`) and Guam (`6698`). Guam is keyed as `GU` on the state map and `66000` as a territory-wide county aggregate; its table/download county stays `66010`. The tile validator reconciles the aggregate against the county rows. A missing required district polygon fails generation instead of silently dropping the territory.

The reference is `CongDist_shp_119.zip` under the existing R2 reference-data URL in `scripts/terminations.py` (verified SHA-256 `746dd8fd7d07888ba5290b88480011710025aa1a89322438bce428d8f4e59a8b`). Its Guam polygon is valid and covers Guam's native Pacific coordinates; no artificial inset or scientific reassignment is introduced.

Adding this generator support does not change an already-published immutable release. Build from a clean code revision, validate a new release ID, obtain publication approval, then publish/select a new preview candidate. Old releases retain their recorded coverage warnings. The frontend shows a generic "Some areas have limited map coverage" notice whenever the selected manifest lists any warning, and shows no notice when it lists none.

Territory population values are separate from map geometry. The territory state rows and at-large district rows use April 1, 2020 Census counts, stored in the historical `pop_2024` column; they are not 2024 estimates. Puerto Rico municipio rows stay blank. See `scripts/reference/README.md` for sources and the appended territory county rows.

## Checks before enabling production selection

- Exact candidate approved by Mallory, Elena and Joshua; current website PR remains draft until then.
- Check both `/grants` and `/maps`, NIH/NSF/Combined, all three geographies, exports and scientific downloads.
- In staging, publish B while selecting A; confirm A remains displayed. Select B and reload; confirm all views use B. Roll back to A and reload.
- Run the daily workflow locally first, then with the agreed runner/secrets. Retain reports and stage logs, including an induced builder failure and corrected rerun.
- Assign the operational owner, final freshness/unmatched-location policies and retention rule. No automatic retention deletion is implemented.
