# Market Note updates

- The homepage and its single `articles` registry are in `app/page.tsx`.
- Add daily and weekly reports to that registry with kind, date, dateTime, title, excerpt, and href. Preserve existing entries. The existing latest section and filtered archive use this registry and sort by date.
- Keep the shared header immediately followed by `main.site-shell` and its first section, `section.market-hero`. The user explicitly removed reports above the photo. Never add a separate latest/daily report section above the hero or wrap the homepage in another report list.
- Do not recreate `app/page-legacy.tsx` or split the homepage into a legacy page plus a new report wrapper.
- Before publishing, run `npm run lint`, `GITHUB_ACTIONS=true npm run build:pages` (use PowerShell environment syntax on Windows), and `node --test tests/homepage-layout.test.mjs tests/site-design.test.mjs tests/market-calendar.test.mjs`. Keep the homepage layout check in the publishing workflow.
- Check that the public homepage starts with the photo below the header, the new report is in the existing latest/archive sections, and the individual report URL works.
