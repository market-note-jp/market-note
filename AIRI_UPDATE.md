# AIRI — weekly publication

Target: market-note-jp/market-note, main, GitHub Pages at https://market-note-jp.github.io/market-note/airi/ . Preserve this hosting provider. Do not publish to ChatGPT Sites. No paid data subscription is activated by this implementation.

## Scope and status

The existing AIRI 0.1 model has 10 inputs and 3 equal-weight axes. The first public record uses real observations, not the earlier demo or its fictional scores. Four current inputs were confirmed and three price inputs have 50 monthly references on 2026-09-13. Overall AIRI and all three axes remain unavailable because required inputs are missing. This is a data-collection research page, not a calibrated probability model.

The public page is app/airi/page.tsx; generated data is app/airi-data.json. app/site-chrome.tsx contains the navigation link. Avoid editing article files, app/page.tsx, calendar data, fonts, global theme or existing publication workflow for weekly AIRI updates.

## Reproducible update

1. Fetch current main and inspect data/airi/input.json, scripts/airi_model.py, scripts/update_airi.py, and the latest data/airi/releases record. Use an isolated checkout. No stored API credentials are required by the price collector.
2. Verify the latest DFII10 real yield via https://fred.stlouisfed.org/series/DFII10 . Update its value, actual observation date, actual publication date and source in input.json. Retain older values with their original dates when a fresh reading cannot be verified. Never move an observation date forward just because it was checked today.
3. Other inputs may be added only after verifying their identical definitions (see below), all constituent data and public display rights. No invented historical EPS, proxy substitutions or subjective scores. Do not enter a quoted trailing P/E as forward P/E. Do not redistribute ICE HY Top Level Data until the necessary permission exists; its absence remains a missing metric, not zero. Public-source URLs and observed/published dates are required for each number.
4. Run `python scripts/update_airi.py --as-of YYYY-MM-DD --collect-prices` using the current date in Asia/Tokyo. This obtains 5 years of daily split-adjusted closing prices for all 8 stocks from Yahoo Finance, derives 3 metrics, applies the unchanged model and produces the release. This endpoint is not a guaranteed supported API; report failure rather than bypassing access controls. If a complete current common-price series is unavailable, retain older dated observations; the model removes stale ones. The report explicitly marks collection failures.
5. Inspect collection status, dates, source fields and nulls. A completed script is not proof that every data source succeeded. Verify the latest source values using available independent source pages when possible. If no real observations are available, state that explicitly in the update notification.
6. Run `python -m unittest discover -s tests -p 'test_airi.py'` and `GITHUB_ACTIONS=true npm run build:pages`. Stage only data/airi/input.json, app/airi-data.json, and the new data/airi/releases/YYYY-MM-DD.json for routine updates. Treat any unexpected file changes as needing review. No need to re-run optional tests beyond concrete changes.
7. Commit the complete change atomically to main using normal non-force Git updates or GitHub Git trees/commits/ref tools. Re-read main if it moved, and rebase/recompute against its latest snapshot. Never force push. The weekly task is authorized to publish verified AIRI updates to this site's existing main branch. Check Publish Market Note's deployment result. If the public URL cannot be fetched but deployment succeeded, report that distinction; do not claim visual verification or roll back valid data.
8. Notify the user in Japanese with public page URL, which inputs were updated, overall score or reason unavailable, dates, and missing sources. Keep the task enabled after success or failure.

Weekly checking is scheduled separately through ChatGPT Automations. There is intentionally no second GitHub cron trigger: prevent double execution. The existing GitHub Actions workflow publishes on main pushes. A recurring task is cloud-executed; its operation still depends on connector access and source availability.

## Data definitions

Portfolio: NVDA, AVGO, AMD, MSFT, AMZN, GOOGL, META, ORCL; USD, equal allocations at each quarter's first session using previous close. Yahoo `close` is used, not dividend-adjusted `adjclose`. Constituent daily returns are on the common trading-date intersection. The return index is a price-only portfolio; cash dividends are excluded. The same 8 stocks are selected retrospectively; this is not a historical investable-universe backtest.

- forward_pe: 1 / sum(current portfolio weight × next-12-month EPS / split-consistent stock price), only if aggregate earnings yield > 0. Do not average individual PERs.
- ma200_gap_pct: (portfolio price / trailing 200-session average − 1) × 100.
- flow_4w_pct: ARTY net creations over 4 weeks / beginning AUM ×100; exclude appreciation. Do not join incompatible pre-strategy-change history.
- capex_ocf_pct: MSFT, AMZN, GOOGL and META combined cash capital expenditures TTM / combined operating cash flow TTM ×100. Denominator must be positive. Non-AI capex is included; lease-financed capex is not fully captured.
- net_debt_ebitda: combined 8-company interest-bearing debt minus cash/cash equivalents / combined TTM operating profit plus depreciation/amortization. Include finance leases, exclude operating leases; denominator must be positive.
- downside_correlation: mean of all 28 pairwise correlations across the portfolio-down days in the trailing 126 trading sessions; require at least 30 such days and all 28 valid correlations.
- real_yield_pct: DFII10 in percentage units (2.55 means 2.55%).
- eps_downgrade_breadth_pct: (number of next-12-month EPS downgrades − upgrades versus 3 months ago) / 8 ×100. Require all 8 comparisons; record rolling-forecast limitations.
- hy_change_3m_bp: (current HY OAS in % − 3-calendar-month-earlier available OAS in %) ×100. Held unavailable while reuse rights are unresolved.
- below_ma200_pct: percentage of the 8 companies below their own 200-session averages.

## Time, normalization and immutable releases

All as_of dates mean the start of that calendar date. published_at must be strictly earlier than as_of. Observation dates cannot exceed publication dates. Date-only conservative gating excludes same-day values. Financial values older than 200 calendar days, forecast values older than 45, flows older than 14, and prices/yields/spreads older than 10 are unusable.

References are monthly snapshots at the first of each month. The latest 60 reference months strictly before the current month are eligible; at least 36 valid months per input are required. Percentile = 100 × (count below + 0.5 × count equal) / n. Each axis requires >=75% coverage; overall requires all axes plus >=80% total coverage. Do not loosen thresholds to manufacture a score.

Price reference snapshots are reconstructed from currently available split-adjusted prices. Their observed_at and published_at refer to the historical trading close, but the adjusted series is not asserted to be an unrevised historical vintage. This limitation is visible on the page. Do not backdate currently downloaded revised fundamental estimates or treat the price reconstruction as predictive validation. For actual point-in-time source snapshots, archive source evidence before creating monthly entries.

Each dated release is immutable. Same-date reruns with changed inputs are rejected. An identical same-date rerun is idempotent. If a correction is needed, preserve the original release and explicitly implement a versioned correction with a public note rather than overwriting history. Input hashes identify the full submitted input. The visible history includes the latest 52 records; the repository keeps every release. A preceding record counts as a previous-week comparison only when 5–9 days apart and model support is identical. Never join different model/universe versions.

## Remaining work

Source and verify forecast EPS, ETF flows and point-in-time financial history. Complete the real-yield monthly history from publicly reusable FRB data. The collector presently automates only price-derived inputs; the scheduled agent verifies and enters other data. If necessary sources remain unavailable, publish the available observations and explain gaps without claiming a complete risk index. Do not change the formula, buy a subscription, alter the schedule, or manufacture calibration as part of a routine update.

Probability calibration requires a separate time-split study with overlapping 12-month labels purged, calibration plots and Brier scores, enough independent crisis episodes and comparison to simple baselines. It is not part of this release.
