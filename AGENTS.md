# Market Note updates

- New daily reports are content-driven. Create exactly one completed JSON file at `content/daily/daily-YYYY-MM-DD.json`. Do not add new daily reports to `app/page.tsx`.
- The JSON filename and `slug` must match. Required top-level fields are `slug`, `kind` (`日次レポート`), `date`, `dateTime`, `title`, `headline`, `excerpt`, `description`, `label`, `displayDate`, non-empty `sections`, and a non-empty `disclaimer`. Use the latest JSON file as the structural template.
- `lib/article-content.ts` discovers `content/daily/daily-*.json` automatically. `app/page.tsx` merges this content with the legacy registry, and `app/articles/[slug]/page.tsx` generates the individual daily page. A completed daily JSON file therefore supplies the article page, latest section, and archive without a second manual registration step.
- `legacyArticles` in `app/page.tsx` exists only for older static routes and non-content-driven reports. Preserve those entries. Do not move a new daily report into `legacyArticles`.
- Keep the shared header immediately followed by `main.site-shell` and its first section, `section.market-hero`. The user explicitly removed reports above the photo. Never add a separate latest/daily report section above the hero or wrap the homepage in another report list.
- Do not recreate `app/page-legacy.tsx` or split the homepage into a legacy page plus a new report wrapper.
- Before publishing, run `npm run lint`, `GITHUB_ACTIONS=true npm run build:pages` (use PowerShell environment syntax on Windows), and `node --test tests/homepage-layout.test.mjs tests/site-design.test.mjs tests/market-calendar.test.mjs`.
- The tests verify both legacy routes and content-driven daily reports. Do not weaken or delete these checks to make a publication pass.
- Check that the public homepage starts with the photo below the header, the new report appears in the existing latest/archive sections, and the individual report URL works.
- For daily automation, prefer one completed JSON write to `main` after reading the latest main. Never publish a placeholder, empty body, incomplete sources, or a second same-day file.
