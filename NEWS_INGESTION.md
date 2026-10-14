# Permitted news discovery and automatic ingestion

## Scope and rights

The news index contains official RSS/Atom/RDF metadata from the five explicitly
allowlisted feeds in `data/news/sources.json`, plus existing Market Note article
metadata. The registry records each source's rights URL, check date, allowed fields,
format-independent feed URL, 6-hour polling interval and bounded history. Japanese
sources are Statistics Bureau and MOF under PDL 1.0; US sources are Federal Reserve
monetary policy and BLS CPI/employment public-domain feed content. Attribution and
original links are displayed. Images, logos, external article bodies, third-party
licensed media, paywalls, subscriber content and broad crawling are excluded.
The Cabinet Office RSS is deliberately excluded due to its RSS-specific restrictions.
A source's RSS availability alone is not permission to republish it.

This does not cover all Japanese or global news, listed companies or media outlets.
New commercial feeds require a separately verified licence/API. No paid services,
accounts, API keys or AI calls were added. Company name associations are deterministic
navigation aids from our article headline/summary, not investment/event assertions.
No fictional prototype news is included. `MediaArticle` and `CompanyEvent` are separate:
no event clusters are created without verified explicit article membership.

## Timing, identity, failures and corrections

`publishedAt` is the original source-reported publication date, not the ingestion time.
Unknown dates remain null. Date-only Statistics Bureau dates retain their precision;
UI converts full timestamps to JST and labels source timestamps as such. Stable archive
URLs are normalized (HTTPS, tracking parameters/fragment removed) and hashed with source
ID. Rotating Statistics Bureau links also include the source date; their original URL
may now show a later edition, which is disclosed. Dates must never be reset to make
old articles look new. `updatedAt`, `fetchedAt`, `firstFetchedAt`, `sourcePublishedAt`,
`lastChangedAt` and `revisionCount` are independent. A source metadata change is marked
as a detected revision, not a proven factual correction. Missing feed entries remain
in bounded history and are not silently treated as withdrawn or deleted.

A failed fetch/empty or malformed feed preserves prior articles and `lastSuccessAt`,
records `lastAttemptAt` and a bounded error category. Partial success is retained.
HTTP 304 requires a valid previous successful snapshot. Browser source health uses
current time, so a stopped workflow becomes visibly stale even without another build.
Successfully checking a feed does not mean it published a new article.

## Automatic operation and resource limits

`Ingest Market News` runs at 02:17 / 08:17 / 14:17 / 20:17 JST (UTC cron), on manual
workflow_dispatch, and after successful main push/manual `Publish Market Note` runs.
GitHub schedules can be delayed; they are not a real-time delivery guarantee.
Each source gets one request (no retries), 20-second socket timeout, 1 MB maximum
response, 2-second spacing, conditional ETag/Last-Modified requests, and 200 retained
items. Redirects, DTD/entity expansion, arbitrary hosts and non-HTTP article links are
rejected. Workflow jobs have a 10-minute build and 5-minute deploy timeout. At most
1,000 external metadata records and the latest 1,000 owned article index entries are retained. The underlying owned article archive is unchanged. No source article pages are fetched.

Source snapshots are small public Actions artifacts named `market-news-snapshot`
retained for 7 days. The next run inherits the latest completed ingestion snapshot;
this rolling chain retains the bounded corpus beyond a single artifact's lifetime.
Only this repository's known ingestion workflow, main, and approved event types are
eligible; ZIP size, exact filename, schema, allowlisted URLs and digest (when supplied)
are checked. ZIPs are read without filesystem extraction. If a previous artifact has
expired after an outage, checked-in initial data is the fallback and a coverage-gap
warning is preserved. API/validation errors fail the build instead of silently resetting
history. Ordinary main publication also restores the cache, preventing news rollback.

The schedule never writes main or creates another branch. It builds current main with
the fetched snapshot, checks main is unchanged, and deploys through the existing Pages
environment/permissions. A shared concurrency lock prevents competing Pages deployments;
a new main publication can cancel an ingestion. Existing daily generation schedules,
article content and freshness/publication validators remain unchanged. No credentials
are persisted: Actions uses only its short-lived token with read contents/actions,
Pages write and OIDC. Tests use local fixtures and do not call external services.

The repository is public and uses standard GitHub-hosted Ubuntu runners, currently free
under GitHub's public-repository runner policy (checked 2026-10-14):
https://docs.github.com/en/actions/how-tos/write-workflows/choose-where-workflows-run/choose-the-runner-for-a-job
Artifact retention and record caps bound storage; no larger/paid runner is selected.
GitHub may disable schedules after 60 days of repository inactivity. Check Actions if
the source-health panel becomes stale; ongoing daily main updates normally avoid this.

## Verification and maintenance

- `npm run test:news`: local parser, correction, failure, cache and search regression tests
- `npm run lint`
- `GITHUB_ACTIONS=true npm run build:pages`
- Existing repository publication/layout/title/freshness tests plus `tests/news-export.test.mjs`
- Existing browser QA and focused news/mobile/search/back-forward/company-flow checks
- One real allowlisted ingestion and its exact Actions build/deploy must complete before
  reporting automatic setup as working. A configured cron alone is insufficient.
- Public `/news-status.json` records exact deployed snapshot time, source states and item
  IDs so live verification distinguishes deployment from local exports.

To remove/revoke a source, first disable the registry entry, remove its retained data,
run fixture/export checks and publish within the existing authorization. Review source
terms again before widening the fields or adding feeds. Do not add commercial media
merely because a publicly reachable RSS endpoint exists.
