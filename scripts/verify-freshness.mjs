import { pathToFileURL } from "node:url";
import { verifyPublication } from "./verify-publication.mjs";

const api = "https://api.github.com/repos/market-note-jp/market-note";
const jstOffsetMs = 9 * 60 * 60 * 1000;

export class FreshnessError extends Error {
  constructor(code, message, context = {}, cause) {
    super(message, cause ? { cause } : undefined);
    this.name = "FreshnessError";
    this.code = code;
    this.context = context;
  }
}

function referenceInstant(value) {
  if (value instanceof Date && Number.isFinite(value.getTime())) return new Date(value);
  if (typeof value === "string") {
    const match = value.match(/^(\d{4}-\d{2}-\d{2})T(\d{2}):(\d{2}):(\d{2})(?:\.\d{1,3})?(Z|[+-]\d{2}:\d{2})$/);
    const parsed = new Date(value);
    const calendarDay = match && new Date(`${match[1]}T00:00:00Z`);
    if (match && Number(match[2]) < 24 && Number(match[3]) < 60 && Number(match[4]) < 60 &&
        Number.isFinite(parsed.getTime()) && Number.isFinite(calendarDay.getTime()) &&
        calendarDay.toISOString().slice(0, 10) === match[1]) return parsed;
  }
  throw new FreshnessError("INVALID_REFERENCE_TIME", "Supply an ISO timestamp with an explicit timezone, for example 2026-10-13T07:00:00+09:00.");
}

/** Editorial cadence, not exchange trading days: Monday–Saturday at 07:00 JST. */
export function expectedDailyPublication(at) {
  const instant = referenceInstant(at);
  const day = new Date(instant.getTime() + jstOffsetMs);
  if (day.getUTCHours() < 7) day.setUTCDate(day.getUTCDate() - 1);
  if (day.getUTCDay() === 0) day.setUTCDate(day.getUTCDate() - 1);
  const expectedDate = day.toISOString().slice(0, 10);
  return {
    referenceTime: instant.toISOString(),
    timezone: "Asia/Tokyo",
    expectedDate,
    dueAt: `${expectedDate}T07:00:00+09:00`,
  };
}

export async function verifyFreshness({ at = new Date(), fetchImpl = fetch } = {}) {
  // Capture one reference instant. A slow network request must not move the deadline.
  const expectation = expectedDailyPublication(at);
  const slug = `daily-${expectation.expectedDate}`;
  const mainUrl = `${api}/branches/main`;
  async function get(url, { allowMissing = false } = {}) {
    try {
      const headers = { Accept: "application/vnd.github+json", "Cache-Control": "no-cache" };
      // Reuse only the workflow's existing read-only credential, never send it to Pages.
      if (process.env.GITHUB_TOKEN) headers.Authorization = `Bearer ${process.env.GITHUB_TOKEN}`;
      const response = await fetchImpl(url, { headers, signal: AbortSignal.timeout(30_000), redirect: "error" });
      if (allowMissing && response.status === 404) return null;
      if (!response.ok) throw new Error(`Read failed (${response.status}): ${url}`);
      return await response.json();
    } catch (cause) {
      throw new FreshnessError("READ_FAILED", `Freshness could not be checked: ${cause.message}`, expectation, cause);
    }
  }
  const before = await get(mainUrl);
  const sha = before?.commit?.sha;
  if (!/^[0-9a-f]{40}$/.test(sha ?? "")) {
    throw new FreshnessError("READ_FAILED", "GitHub did not return a valid main commit SHA.", expectation);
  }
  const context = { ...expectation, commit: sha };
  const file = await get(`${api}/contents/content/daily/${slug}.json?ref=${sha}`, { allowMissing: true });
  if (file === null) {
    const after = await get(mainUrl);
    if (after?.commit?.sha !== sha) {
      throw new FreshnessError("MAIN_CHANGED", "Main changed while checking for the expected report; inspect the new head and retry.", context);
    }
    throw new FreshnessError("EXPECTED_REPORT_MISSING", `Content gap: ${slug}.json is missing on main after its ${expectation.dueAt} deadline. This is a missing report, not evidence of a deployment failure.`, context);
  }
  try {
    if (file.encoding !== "base64") throw new Error("Unexpected GitHub content encoding");
    const article = JSON.parse(Buffer.from(file.content, "base64").toString("utf8"));
    if (article.slug !== slug || article.kind !== "日次レポート") throw new Error("Report identity does not match the expected daily date");
    for (const field of ["title", "date", "dateTime", "excerpt", "description", "label", "displayDate"]) {
      if (typeof article[field] !== "string" || !article[field].trim()) throw new Error(`Missing ${field}`);
    }
    const published = referenceInstant(article.dateTime);
    const publishedJst = new Date(published.getTime() + jstOffsetMs).toISOString().slice(0, 16).replace("T", " ");
    // A later recovery keeps its true update date; yesterday's renamed report does not qualify.
    if (publishedJst.slice(0, 10) < expectation.expectedDate || article.date !== publishedJst) {
      throw new Error("Publication date precedes the expected report date or disagrees with its JST timestamp");
    }
    const text = value => typeof value === "string" && value.trim().length > 0;
    const meaningfulSection = section => text(section?.heading) && (
      section.paragraphs?.some(text) || section.table?.rows?.some(row => row?.some(text)) ||
      section.subsections?.some(part => part.paragraphs?.some(text) || part.bullets?.some(text))
    );
    if (!Array.isArray(article.sections) || !article.sections.length || !article.sections.every(meaningfulSection) ||
        !article.disclaimer?.paragraphs?.some(text)) {
      throw new Error("Report body or disclaimer is empty");
    }
  } catch (cause) {
    throw new FreshnessError("EXPECTED_REPORT_INVALID", `The expected report exists but is not a completed daily article: ${cause.message}`, context, cause);
  }
  try {
    const publication = await verifyPublication({ date: expectation.expectedDate, sha, fetchImpl });
    return { ...publication, ...expectation, status: "fresh-and-published" };
  } catch (cause) {
    throw new FreshnessError("PUBLICATION_UNVERIFIED", `The expected report exists on main, but its publication is not verified: ${cause.message}`, context, cause);
  }
}

export function parseFreshnessArgs(args) {
  if (args.length === 0) return {};
  if (args.length === 2 && args[0] === "--at") {
    referenceInstant(args[1]);
    return { at: args[1] };
  }
  throw new FreshnessError("INVALID_ARGUMENTS", "Usage: npm run verify:freshness -- [--at ISO_TIMESTAMP_WITH_TIMEZONE]");
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  try {
    console.log(JSON.stringify(await verifyFreshness(parseFreshnessArgs(process.argv.slice(2))), null, 2));
  } catch (error) {
    console.error(JSON.stringify({ status: "not-verified", code: error.code ?? "UNEXPECTED_ERROR", message: error.message, ...error.context }, null, 2));
    process.exitCode = 1;
  }
}
