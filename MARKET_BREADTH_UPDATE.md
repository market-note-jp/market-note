# MN225 end-of-day operation

The user authorized unattended post-close updates and permanent accumulation on
2026-10-24. This is a separate indicator, not the editorial daily/weekly report.
Public page: https://market-note-jp.github.io/market-note/market-breadth/ .

## One writer, one schedule

The cloud Automation **Market Note 225 取引後更新** is the only scheduled writer.
It runs on weekdays in the Japanese evening (Asia/Tokyo), after the 15:30 close.
The actual enabled Automation configuration is authoritative; this document alone
does not establish that a schedule exists. No local PC, paid data service, new
account, token, or subscription is needed. Never add a second clock/workflow.

Read current main's `AGENTS.md`, this file, and
`scripts/update_market_breadth.py` through the connected GitHub app each run.
Recreate the Python standard-library helper locally if needed. Do not depend on
previous chat state or an old local checkout. Read the current
`market-breadth-data` branch ref and pin all data reads to that commit SHA.

## Sources and official input

1. Resolve the latest **closed JPX trading session** in Asia/Tokyo. Fetch the
   Cabinet Office holiday CSV:
   https://www8.cao.go.jp/chosei/shukujitsu/syukujitsu.csv . The helper excludes
   weekends, national holidays, January 1–3 and December 31, and refuses an
   unpublished calendar year. Check extraordinary exchange closures against
   https://www.jpx.co.jp/corporate/about-jpx/calendar/index.html ; if the official
   schedule changes, reconcile the calendar before appending.
2. Retrieve the full 225-company end-of-day table from
   https://www.traders.co.jp/market_jp/nikkei225/all/stock-asc using normal public
   HTTP. This route was exercised successfully with all 225 quotes. The parser
   handles the provider's implicit closing cells and alpha stock codes. Do not
   parse an intraday table or a search snippet as the closing input.
3. Use the web/search connector to open the **full** official constituent list
   https://indexes.nikkei.co.jp/nkave/index/component?idx=nk225 and dated summary
   `https://indexes.nikkei.co.jp/nkave/archives/summary?dt=YYYYMMDD&idx=nk225`.
   These web-tool reads were verified. Ordinary HTTP to Nikkei returns 403 in the
   current runtime; do not bypass that denial or infer the data. Read all of the
   long constituent page in additional line ranges as needed. Confirm membership
   effective on the target session, including announced replacements. The page's
   "updated" date need not equal the session if no composition change occurred;
   `componentsAsOf` below records the date for which membership was verified.
4. Write temporary `official.json` with exact source-checked fields:

   ```json
   {"date":"YYYY-MM-DD","componentsAsOf":"YYYY-MM-DD","summaryURL":"https://indexes.nikkei.co.jp/nkave/archives/summary?dt=YYYYMMDD&idx=nk225","close":0,"change":0,"up":0,"down":0,"flat":0,"codes":["225 unique effective security codes"]}
   ```

   Zeros here show the schema only; never publish placeholder numbers. `close`
   and signed `change` are the official close and point change, not a rounded
   percentage. Do not use the upper-ten weight table as the constituent list.

## Compute and publish the data

Download `base100/latest.json`, `base100/state.json`, and inspect the archive paths from the
pinned data SHA under `base100/history/`. Pass `--data` the pinned `base100/` directory. The helper emits relative paths; prefix all three with `base100/` when publishing. Run:

```sh
python scripts/update_market_breadth.py --data DATA_ROOT --official official.json --output CANDIDATE_ROOT
```

Normal runs omit `--at`. The helper downloads current quotes and holidays;
`--quotes-html` / `--holidays-csv` allow exact replay of source responses.
It checks 225 unique official members, date/time, unrounded daily returns versus
displayed returns (within rounding tolerance), official rise/fall/flat totals,
previous official close, immutable baseline, and uninterrupted trading sessions.

- `unchanged`: revalidated same-date fingerprint. **Write nothing**; verify the
  existing public feed and archive. This includes weekends/holidays with no new
  session. Never compound a return twice or create a holiday row.
- `updated`: exactly three candidate files: `latest.json`, `state.json`, and
  `history/YYYY-MM-DD.json`. Preserve every existing history file. The main
  index begins **2026-10-22 = 100pt** and chains from its own prior value,
  never from each new Nikkei close. The aggregate history starts with the
  verified 2026-10-23 return. Do not fabricate earlier MN225 data.
- Error: retry a transient source read within this run. Preserve the last good
  publication. If the issue persists, report the last verified observation date
  and exact blocker. Do not silently fill prices, skip a session, reset a
  baseline, alter source permissions, or overwrite a corrected historical day.
  Recover missed sessions only from fully verified historical 225-company
  inputs for each missing date, processed in order. If unavailable, hold the
  series and report it; never label a broken chain as continuous.

The helper is deliberately a pure preparer with no GitHub credentials. Use the
already authorized **native GitHub connector** to create a tree based on the
pinned data commit's tree, create one commit with the three files, and update
`market-breadth-data` with `expected_sha` and `force:false`. Re-read the ref
immediately before the update; a moved ref requires inspection and recomputation
from the winning state. Do not overwrite concurrent work. No commit to main,
PR, Pages deployment, permission change, or new access token is needed for a
routine data update.

Only aggregate observations, member codes/hashes, and bounded normalized
per-company levels (25 observations) are persisted. Full source quote tables
remain temporary inputs. Newly admitted members start their own normalized
history; MA25 uses eligible members and publishes its coverage. The index is
price-return based, assumes the source's previous-reference-price adjustments,
excludes dividends and transaction costs, and is not an official Nikkei index.

## Completion and readback

After an update, verify current branch SHA equals the intended commit and read
back all three JSON files from that exact SHA. Then fetch the runtime public feed
https://raw.githubusercontent.com/market-note-jp/market-note/market-breadth-data/base100/latest.json
and dated archive. Require matching date, level, fingerprint, history length,
official close and SHA-backed archive; tolerate cache lag only by waiting and
checking again. `lib/market-breadth/feed.mjs` validates the feed and rejects
rollback, changed historical observations, wrong dates, gaps, or a rebased index.
The live homepage and native indicator page fetch this feed on load and every
five minutes while visible. They show the actual observation date and retain a
saved fallback with an explicit connection/update status when needed.

Verify the public indicator remains HTTP 200 and the deployed frontend still
references this runtime feed. A data commit without successful public feed
readback is saved work, not a verified update. Healthy or unchanged runs should
finish quietly; notify the user only about a persistent failure needing action.

## Code changes

For changes to the frontend/helper, follow the existing main publication
contract, preserving editorial content, hero-first layout and verification.
Additional checks:

```sh
python -m unittest discover -s tests -p 'test_market_breadth_update.py'
node --test tests/market-breadth-engine.test.mjs tests/market-breadth-feed.test.mjs tests/market-breadth.test.mjs
```

Static fallback snapshots can advance only to a verified data commit. They must
retain the full original baseline/history. Changing this file alone never proves
that the externally saved Automation prompt or cadence changed.

## Authorized 100-point scale conversion (2026-10-31)

The user selected **2026-10-22 = 100pt**, retaining the same daily equal-weight
calculation and Nikkei 225 constituents. This changes units only, never returns.
The active dataset is `base100/latest.json`, `base100/state.json`, and
`base100/history/YYYY-MM-DD.json` on `market-breadth-data`. Routine updates write
only those three paths. The old root `latest.json`, `state.json` and `history/`
remain frozen and byte-for-byte unchanged; do not resume writes to that scale.

`scripts/rebase_market_breadth.py` performs the one-time conversion from a pinned
original dataset into a separate empty output directory. It checks every dated
archive against the original chain. It reuses the existing 100-based `history.ew`
values, scales point changes, and preserves all dates, returns, breadth metrics,
official Nikkei closes, input fingerprints and normalized per-company histories.
`base100/scale-conversion.json` records the source commit, scale factor and
original baseline. It is provenance, not a new observation or backfilled input.
Do not rerun a migration over an existing dataset.

The frontend rejects any base other than 100 and checks the official Nikkei
baseline against its separately saved official close, not the independent MN225
baseline. Chart comparisons use both series at the same starting scale; never
subtract the yen-denominated Nikkei close from a 100-point MN225 level. CSV keeps
actual Nikkei closes in a separate column from rebased values and point gaps.

This conversion does not recover missing sessions or fix the separate 2026-10-29
source-return validation failure. The existing writer was paused after that
failure. Updating its prompt to the new paths/baseline does not establish that it
has resumed. Resume only after the validation issue and every missing session
have been resolved from fully verified complete source inputs.
