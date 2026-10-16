# Evidence-complete comparisons in Market Note

Approved and integrated on 2026-10-17 JST. Apply the mandatory review to reports
dated 2026-10-18 onward, including daily JSON and dated static weekly/company
routes. Existing archives are preserved; an older report can opt in. This does not
change the generation schedule, article URLs, homepage layout or publication checks.

## Authoring and recovery procedure

1. Before retrieval, list every material numeric comparison in the planned article
   and its required inputs. Include companies, metric, fiscal/observation period,
   unit, actual/company forecast/consensus/market basis, and metric definition.
   Split multi-company/multi-period questions into inputs; do not stop at the first
   relevant page. No invented missing values or zero substitutions.
2. Read original sources first. For each observed value preserve those input
   metadata, the source URL/publication date and table/section locator. PDFs require
   the 1-based PDF page (printed page can be added in the locator). If text extraction
   fails, inspect the page image. A failed search is not evidence of absence.
3. Match metadata to the planned inputs. Explicitly label different actual/forecast
   bases and fiscal periods in the article. Do not compare incompatible definitions
   silently. For FCF state the formula and use cash outflows, not an unrelated capex
   total. Retrieve all required components before calculating.
4. If evidence remains missing, make bounded additional source checks. If still
   unresolved, remove that comparison and every dependent claim from title, deck,
   tables and body; record `withheld` and its reason in the review. Keep supported
   news publishable. State a limitation in the article when material. Never solve a
   gate failure by inventing a value, relabelling a comparison as reviewed, deleting
   the gate, or passing a held claim into the article.
5. Save `content/evidence/<article-slug>.json` together with the completed article
   in the same commit. After reviewing the final article calculate `articleSha256`
   with `articleDigest(files)` from `scripts/check-evidence.mjs`. An article edit
   invalidates that digest and requires another review. Do not merely refresh hashes
   without checking the changed claims. Read the current checked-in review example
   `content/evidence/daily-2026-10-17.json` for the concrete schema.
6. Run `npm run check:evidence` and `npm run test:evidence`, then all existing
   lint/build/site/browser/publication checks. `build` and `build:pages` invoke the
   evidence gate, covering the normal Publish and scheduled Ingest build routes.
   No extra scheduler, paid API, model or crawler is introduced.

## Review structure

Top level: `version: 1`, `articleSlug`, `articleSha256`, explicit-zone `checkedAt`
and `informationCutoff`, `coverage`, `reviewNote`, `comparisons`.

New reports must use `coverage: "all-material-comparisons"`; this is an editorial
attestation covering the complete final article, not an automatic classifier.
An empty comparisons array is valid only after genuinely reviewing an article
without material numeric comparisons and explaining that in `reviewNote`.
`selected-comparisons` is allowed only for opt-in reviews of older archives.

Each comparison records `id`, `question`, `definition`, `status`, `requiredInputs`,
`observations`, `calculations`. Each planned input has `id`, `entity`, `metric`,
`periodStart`, `periodEnd`, `unit`, `basis`, `definition`. An observation copies
those metadata and adds a finite numeric `value` plus `source`: `url`, `publishedOn`,
`locator`, `pdfPage` for PDFs, `kind` (`primary`/`secondary`). A secondary source must
also explain `primaryUnavailableReason`. Publication days must not exceed the
information cutoff's JST day; editors must also check exact release times on that day.

A `ready` comparison requires all inputs plus a `claim` copied verbatim from the
article. Optional calculations have `id`, `operation`, `inputs` (input/calculation
IDs), `definition`, `precision` (0–6), `value` (rounded to that precision). Supported
operations are `sum`, `difference` (first minus second), `ratio-percent` and
`growth-percent` (current, previous; positive previous denominator). Use negative
cash outflows with `sum` for the defined FCF. Never use executable formulas.

A `withheld` comparison records `reason`, `omittedClaim`, an empty `calculations`
array and no `claim`. Its observations can be incomplete. The omitted wording must
not remain in article source. Editors must also remove paraphrases and downstream
claims; exact-string checking cannot discover them automatically.

## Boundaries and first live-content adoption

The first opt-in review covers the Tokyo Steel forecast-versus-prior-forecast and
prior-year-actual comparison in the already published October 17 daily article.
Its body and publication time are preserved. The review is not a new claim that
every fact in that earlier report has been independently reverified.

The gate validates declared dependencies, metadata, locators, arithmetic, review
identity and final-source digest. It does not fetch or understand source documents,
prove a transcribed number is true, decide which comparisons are material, or
guarantee that no unsupported paraphrase was omitted from the review. These remain
source-reading/editorial responsibilities. Existing exact-SHA deployment/live
verifiers remain mandatory; a green evidence check is not publication success.

Static route digests include all `.ts`, `.tsx`, `.json` files below that route;
shared external content imported elsewhere still needs editorial review. Daily
digests cover the complete daily JSON. Review files are internal authoring records,
not extra reader-facing approval steps or a reason to expose implementation details
inside articles.
