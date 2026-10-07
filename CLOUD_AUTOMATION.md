# Market Note cloud publication

Market Note runs daily at 07:00 JST and weekly on Saturday at 08:00 JST in the cloud. The public destination is https://market-note-jp.github.io/market-note/. Publication does not depend on a local PC. The schedule and article-generation job are configured outside this repository; changing this document does not change that job's configuration.

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

```sh
npm run lint
GITHUB_ACTIONS=true npm run build:pages
node --test tests/homepage-layout.test.mjs tests/site-design.test.mjs tests/market-calendar.test.mjs tests/publication-verification.test.mjs tests/prototype-design.test.mjs tests/article-titles.test.mjs tests/redesign-publication.test.mjs
npm run verify:publication -- YYYY-MM-DD FULL_MAIN_COMMIT_SHA
```

The verifier performs only public GET requests to this repository and its GitHub Pages site. It does not push, merge, dispatch workflows, create tokens, or require additional credentials. It verifies deployment evidence and the rendered content; it does not replace editorial source checking. Exit code 0 and `status: published` are required for a successful result. Network errors, API rate limits, concurrent main changes, missing content, and unfinished deployments return a failure.

## October 6, 2026 incident

The completed daily article was saved to `daily-2026-10-06`, while `main` remained on the previous day's content-driven migration. No PR or main push existed, so the Pages workflow had no publication trigger. GitHub reported main as unprotected. These facts establish the missing promotion/deployment step; they do not establish why the external generation job stopped at its branch save. Changes here add a clear completion contract and a tested read-only verifier. The external job still needs to follow this procedure; its configuration and the next scheduled run must be checked separately before claiming recurrence is eliminated.

## Daily and weekly title policy (approved 2026-10-07 JST)

For each new report, choose a concise, unique title naming its actual subject before the date. Use the daily/weekly type as a small label. A subject such as a named company's semiconductor demand or the week's contrast between semiconductor shares, interest rates and employment is appropriate only when the article supports it. Avoid a generic report name plus date, keyword stuffing, unsupported cause-and-effect claims and promises about search ranking. There is no mandatory 32-character rule.

Use one authoritative title for the H1, listing cards, search title, Open Graph and Twitter title; a `Market Note` suffix is permitted. Daily reports use JSON `title`, with an identical `headline` retained as a compatibility alias. Static weekly routes use their entry in `content/editorial-titles.json`. Both use `createArticleMetadata` for aligned title and description tags. Describe the same subject in one concise, factual `description`.

Retitling is not republishing: retain the original slug, URL, publication date/time, source baseline dates and body. Retitle older archives only when explicitly authorized, preserving their subject, body, sources and publication dates.

Before an authorized publication, build the Pages export and run `tests/article-titles.test.mjs` with the existing test suite. Check the rendered H1, listing cards, HTML title, Open Graph/Twitter titles and descriptions, as well as route/date/body preservation.

The generation schedule and job are configured outside this repository. These local authoring instructions do not prove that the external daily/weekly job has adopted this policy. Verify that configuration separately before reporting it changed; no publication or automation change is authorized by these documentation edits alone.

The strict read-only publication verifier now compares complete ordered article semantics across both old and redesigned containers, retaining the exact-main-SHA and successful build/deploy requirements. Run `tests/redesign-publication.test.mjs` against the built export: it includes missing/changed/reordered/hidden body and source regressions plus title, date and chart checks. Passing these local checks is not a live publication result.
