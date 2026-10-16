# Market Note cloud publication

Market Note's daily editorial deadline is 07:00 JST Monday through Saturday. Sunday has no new daily report requirement; the latest due daily report is Saturday's. Japanese market holidays do not suspend this editorial cadence. The weekly deadline is Saturday at 08:00 JST. The public destination is https://market-note-jp.github.io/market-note/. Publication does not depend on a local PC. The schedule and article-generation job are configured outside this repository; changing this document does not change or prove that job's configuration.

## The publication boundary

`.github/workflows/pages.yml` runs on pushes to `main`, pull requests targeting `main`, and manual dispatch. A push to an article branch alone does not trigger publication. A pull request checks the site but intentionally skips deployment. Saving a JSON file or obtaining a successful PR build is therefore not publication.

Use these distinct states and report the actual one:

1. **Prepared:** a complete, source-checked article exists.
2. **Saved:** the file is in GitHub, possibly only on an article branch.
3. **On main:** the reviewed content is present at a verified main commit SHA.
4. **Deployed:** the Pages push workflow for that exact SHA has successful `build` and `deploy` jobs.
5. **Published and verified:** the public homepage and article body match the intended content and the layout checks pass.

Never report states 1–4 as state 5. If work is blocked, retain the completed content, report the exact failed operation and current state, and resume the missing step after the blocker is resolved. Do not treat a branch-only save as successful completion or silently leave a draft PR unmerged.

## Daily publication procedure

1. Read the latest `main`, `AGENTS.md`, and most recent daily JSON. Check whether today's file already exists on main or another known article branch. Reuse and review an existing completed file rather than creating a duplicate or overwriting concurrent work.
2. Verify the article's dates, market observation times, figures, source links, and distinction between facts and analysis. Do not publish an empty body, placeholders, invented figures, or unfinished citations.
3. Add exactly one `content/daily/daily-YYYY-MM-DD.json`. The content registry automatically supplies the article page, latest section, and archive. Preserve the hero-first homepage and existing reports.
4. Run the checks below on the final content. For an authorized content-only daily write, prefer a single complete file write to the latest `main`. If a review branch is used, open a PR, validate its exact head, and complete its authorized merge. Record the resulting main SHA and recheck it after the write or merge. Respect access denials; do not change permissions or switch write routes to bypass one.
5. Wait for the Pages push run for that exact main SHA. Inspect `build` and `deploy`; diagnose a failure instead of treating a pending, skipped, or unsuccessful run as done.
6. Run the read-only verification command below. It checks main before and after, the exact-SHA Pages run and both jobs, the existing latest/archive sections, the hero-first layout, and every article paragraph, table cell, source link, subsection, and disclaimer against the JSON at that commit. A stale cache or temporary network/API error remains unverified; retry once the relevant external condition changes. If main moves, inspect and verify the new head rather than using a stale SHA.
7. Report the article URL, main SHA, successful workflow URL, and actual validation result. If public verification is incomplete, say so explicitly.

## Checks

New reports also follow `EVIDENCE_REVIEW.md`: collect the complete declared input
set before making a numeric comparison, record the evidence review with the final
article in one commit, and omit only unsupported comparisons and dependent claims.
From report date 2026-10-18, a missing review or changed article digest fails the
build. The existing exact-SHA deployment, freshness and live checks remain required.

```sh
npm run check:evidence
npm run test:evidence
npm run lint
GITHUB_ACTIONS=true npm run build:pages
node --test tests/homepage-layout.test.mjs tests/site-design.test.mjs tests/market-calendar.test.mjs tests/publication-verification.test.mjs tests/prototype-design.test.mjs tests/article-titles.test.mjs tests/redesign-publication.test.mjs
npm run test:freshness
npm run verify:publication -- YYYY-MM-DD FULL_MAIN_COMMIT_SHA
npm run verify:freshness
```

`verify:publication` performs only public GET requests to this repository and its GitHub Pages site. It does not push, merge, dispatch workflows, create tokens, or require additional credentials. It verifies deployment evidence and the rendered content; it does not replace editorial source checking. Exit code 0 and `status: published` are required for a successful exact-article result. Network errors, API rate limits, concurrent main changes, missing content, and unfinished deployments return a failure.

## Date-aware freshness check and authorized recovery

`npm run verify:freshness` is a separate, read-only current-publication check. It captures the invocation time, computes the expected daily report date in `Asia/Tokyo`, reads that exact JSON on current main, and requires its successful exact-SHA deployment and complete visible homepage/article verification. It never chooses the newest existing JSON as a substitute for the expected date. A green deployment for October 12 cannot satisfy October 13 after 07:00 JST.

- From 07:00 JST Monday–Saturday, that calendar day's report is due. Before 07:00, the previous publishing day's report is due.
- Sunday at any time, and Monday before 07:00, require Saturday's report. A public holiday such as Monday October 12 still requires a Monday report from 07:00.
- Successful output is `status: fresh-and-published`, with `referenceTime`, `expectedDate`, `dueAt`, current `commit`, and verified public URL. Failure exits nonzero.
- `EXPECTED_REPORT_MISSING` means the exact due JSON is missing on an unchanged main. It identifies a content/generation gap, not a deployment failure. `EXPECTED_REPORT_INVALID` identifies a malformed or incomplete article. `PUBLICATION_UNVERIFIED` means the report is on main but deployment or live verification did not pass. `READ_FAILED` is an inconclusive network/API/access error, not evidence of missing content. `MAIN_CHANGED` requires a new-head read before retrying.
- For deterministic diagnosis, `npm run verify:freshness -- --at 2026-10-13T07:00:00+09:00` selects the deadline using an explicit ISO instant. It still inspects the current repository and live site; it does not reconstruct what was public at that historical instant. Routine checks must omit `--at` so they use the current time.
- The expected file must have matching identity, a nonempty body and valid explicit-zone update metadata. Its displayed date must agree with its JST timestamp and cannot predate its report date. A late recovery may retain a later actual update date; the checker must not encourage backdating it to satisfy a deadline.
- Historical article validation remains `npm run verify:publication -- YYYY-MM-DD FULL_MAIN_COMMIT_SHA --article-only`. It intentionally does not assert present-day freshness. The existing monthly article checks retain this mode for older articles.

The existing `Verify Live Market Note` workflow now runs the freshness command after a successful main-push deployment. Deterministic freshness tests run in the existing Publish workflow. Neither workflow has a clock-based schedule, and this change creates no scheduler or generator. When no push occurs, yesterday's completed green run does not turn red by itself. Existing authorized external checks must call the freshness command at their normal wake/check times to discover a missed publication. The callable check detects and classifies gaps; it does not write or publish articles.

For already-authorized Market Note publication and recovery, continue from a detected gap through the missing steps instead of treating a missing file or a saved branch as the outcome:

1. Preserve the failed check's expected date, reference time and exact error. For read/access errors, retry only through permitted routes; do not infer that an article is missing or bypass a denial.
2. Re-read current main and the exact expected date path. Check known article branches for completed work. If the same-day file has appeared, inspect and verify it rather than overwriting it. Reuse a completed source-checked article when possible; if absent, prepare the complete five-topic report with verified sources and facts separated from analysis.
3. State each market observation date and information cutoff. A late recovery uses the actual preparation/update timestamp and describes itself as a late/daytime update; never pretend it was published at 07:00 or incorporate information published after the stated cutoff.
4. Before writing, re-read main and the date path again. Make only the intended daily JSON change and use a compare-and-swap/expected-head lease with a non-forced update. A rejected lease requires inspection and reconciliation of the new head. Never overwrite a concurrent same-day article or force-push to make the write succeed.
5. Run the official checks, complete the authorized main write, wait for that exact commit's build and deploy, then run both exact-article verification and current freshness verification. Recheck current main before reporting completion. If the current editorial deadline changes while recovery is underway, inspect the new expected date rather than passing a stale reference time as a current check.
6. Diagnose and repair in-scope failures and safely retry until the verified publication outcome is established. Additional credentials, broader permissions, new services or other actions outside the authorization still require the appropriate approval. Report a verified blocker truthfully, retain completed work, and resume the dependent step when it is resolved; never claim an unverified publication is complete.

The October 13 incident exposed a separate blind spot from October 6: the post-deployment checker could validate the latest existing file while the next due report did not exist. This guard closes that date-selection gap when invoked. It does not establish why the external generation job failed to deliver the October 13 file, nor prove that its configuration has been repaired.

## October 6, 2026 incident

The completed daily article was saved to `daily-2026-10-06`, while `main` remained on the previous day's content-driven migration. No PR or main push existed, so the Pages workflow had no publication trigger. GitHub reported main as unprotected. These facts establish the missing promotion/deployment step; they do not establish why the external generation job stopped at its branch save. Changes here add a clear completion contract and a tested read-only verifier. The external job still needs to follow this procedure; its configuration and the next scheduled run must be checked separately before claiming recurrence is eliminated.

## Daily and weekly title policy (approved 2026-10-07 JST)

For each new report, choose a concise, unique title naming its actual subject before the date. Use the daily/weekly type as a small label. A subject such as a named company's semiconductor demand or the week's contrast between semiconductor shares, interest rates and employment is appropriate only when the article supports it. Avoid a generic report name plus date, keyword stuffing, unsupported cause-and-effect claims and promises about search ranking. There is no mandatory 32-character rule.

Use one authoritative title for the H1, listing cards, search title, Open Graph and Twitter title; a `Market Note` suffix is permitted. Daily reports use JSON `title`, with an identical `headline` retained as a compatibility alias. Static weekly routes use their entry in `content/editorial-titles.json`. Both use `createArticleMetadata` for aligned title and description tags. Describe the same subject in one concise, factual `description`.

Retitling is not republishing: retain the original slug, URL, publication date/time, source baseline dates and body. Retitle older archives only when explicitly authorized, preserving their subject, body, sources and publication dates.

Before an authorized publication, build the Pages export and run `tests/article-titles.test.mjs` with the existing test suite. Check the rendered H1, listing cards, HTML title, Open Graph/Twitter titles and descriptions, as well as route/date/body preservation.

The generation schedule and job are configured outside this repository. These local authoring instructions do not prove that the external daily/weekly job has adopted this policy. Verify that configuration separately before reporting it changed; no publication or automation change is authorized by these documentation edits alone.

The strict read-only publication verifier now compares complete ordered article semantics across both old and redesigned containers, retaining the exact-main-SHA and successful build/deploy requirements. Run `tests/redesign-publication.test.mjs` against the built export: it includes missing/changed/reordered/hidden body and source regressions plus title, date and chart checks. Passing these local checks is not a live publication result.
