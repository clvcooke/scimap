# Termination release selection

The grants page and grants preview in `/maps` load one checksummed manifest and its
JSON artifacts before displaying data. They share the same selection for a page
session. Table CSV exports include the release ID; scientific downloads point to
that same release. A reload reads the selection again. There is no bundled-data
fallback after a failed request, so partial or mixed releases are never displayed.

The review build uses `/termination-selection.json`, which selects the existing
reviewed v2 candidate. No R2 pointer is created by deploying this change. To use
operator selection without rebuilding the site for each release, configure
`VITE_TERMINATION_SELECTION_URL` once to
`https://data.scienceimpacts.org/terminations/website-release.json` and deploy after
the team's exact-release/cutover approval. Configure pointer responses to revalidate
(`Cache-Control: no-cache`) and retain immutable release objects. The selection
helper applies the correct pointer headers. The JSON/PBF CORS allowlist must cover
the deployed origin, Pages previews and `http://localhost:5173`.

## Prepare, select and roll back

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

## Checks before enabling production selection

- Exact candidate approved by Mallory, Elena and Joshua; current website PR remains draft until then.
- Check both `/grants` and `/maps`, NIH/NSF/Combined, all three geographies, exports and scientific downloads.
- In staging, publish B while selecting A; confirm A remains displayed. Select B and reload; confirm all views use B. Roll back to A and reload.
- Run the daily workflow locally first, then with the agreed runner/secrets. Retain reports and stage logs, including an induced builder failure and corrected rerun.
- Assign the operational owner, final freshness/unmatched-location policies and retention rule. No automatic retention deletion is implemented.
