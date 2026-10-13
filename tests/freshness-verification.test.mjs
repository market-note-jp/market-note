import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { spawnSync } from "node:child_process";
import test from "node:test";
import { expectedDailyPublication, parseFreshnessArgs, verifyFreshness } from "../scripts/verify-freshness.mjs";

const sha = "a".repeat(40);
const at = "2026-10-13T07:00:00+09:00";
const date = "2026-10-13";
const article = {
  slug: `daily-${date}`, kind: "日次レポート", title: "Today's sourced report", headline: "Today's sourced report",
  date: `${date} 07:00`, dateTime: at, displayDate: date, excerpt: "Today's excerpt", description: "Today's description", label: "DAILY",
  sections: [{ heading: "Conclusion", paragraphs: ["Verified body"], sources: [{ label: "Source", url: "https://example.com/report" }] }],
  disclaimer: { heading: "Notice", paragraphs: ["Informational only"] },
};
const href = `/market-note/articles/${article.slug}/`;
const card = `<h3>${article.title.replaceAll("'", "&#x27;")}</h3><time dateTime="${at}">${article.date}</time><p class="article-excerpt">${article.excerpt.replaceAll("'", "&#x27;")}</p>`;
const home = `</header><main class="site-shell"><section class="market-hero"></section><section id="latest"><a href="${href}">${card}</a></section><section id="companies"></section><section id="articles"><a href="${href}">${card}</a></section><section id="policy"></section></main>`;
const body = `<article><h1>Today's sourced report</h1><p class="report-date">${date}</p><div class="report-body"><section><h2>Conclusion</h2><p>Verified body</p><p class="inline-sources"><span><a href="https://example.com/report" target="_blank" rel="noreferrer">Source</a></span></p></section><section class="disclaimer"><h2>Notice</h2><p>Informational only</p></section></div></article>`;

function mockFetch({ missing = false, status = 200, race = false, conclusion = "success", storedArticle = article, liveBody = body, liveHome = home } = {}) {
  const calls = [];
  let mainReads = 0;
  const fetchImpl = async (url) => {
    calls.push(url);
    let value;
    if (url.endsWith("/branches/main")) value = { commit: { sha: race && ++mainReads > 1 ? "b".repeat(40) : sha } };
    else if (url.includes("/contents/")) {
      if (missing) return { ok: false, status: 404 };
      if (status !== 200) return { ok: false, status };
      value = { encoding: "base64", content: Buffer.from(JSON.stringify(storedArticle)).toString("base64") };
    } else if (url.includes("/workflows/pages.yml/runs?")) value = { workflow_runs: [{ id: 123, head_sha: sha, head_branch: "main", event: "push", status: "completed", conclusion }] };
    else if (url.includes("/actions/runs/123/jobs?")) value = { jobs: ["build", "deploy"].map(name => ({ name, status: "completed", conclusion: "success" })) };
    else value = url.includes("/articles/") ? liveBody : liveHome;
    return { ok: true, status: 200, json: async () => value, text: async () => value };
  };
  return { fetchImpl, calls };
}

for (const [instant, expected] of [
  ["2026-10-12T21:59:59.999Z", "2026-10-12"],
  ["2026-10-12T22:00:00Z", "2026-10-13"],
  ["2026-10-13T07:00:00+09:00", "2026-10-13"],
  ["2026-10-12T15:00:00Z", "2026-10-12"],
  ["2026-10-12T06:59:59+09:00", "2026-10-10"],
  ["2026-10-12T07:00:00+09:00", "2026-10-12"],
  ["2026-10-11T00:00:00+09:00", "2026-10-10"],
  ["2026-10-11T06:59:59+09:00", "2026-10-10"],
  ["2026-10-11T23:59:59+09:00", "2026-10-10"],
  ["2026-10-10T06:59:59+09:00", "2026-10-09"],
  ["2026-10-10T07:00:00+09:00", "2026-10-10"],
  ["2027-01-01T06:59:59+09:00", "2026-12-31"],
  ["2027-01-01T07:00:00+09:00", "2027-01-01"],
  ["2026-11-02T06:59:59+09:00", "2026-10-31"],
  ["2028-03-01T06:59:59+09:00", "2028-02-29"],
]) {
  test(`JST editorial deadline ${instant} requires ${expected}`, () => {
    const result = expectedDailyPublication(instant);
    assert.equal(result.expectedDate, expected);
    assert.equal(result.dueAt, `${expected}T07:00:00+09:00`);
  });
}

test("the expected date is independent of the host timezone", () => {
  for (const TZ of ["UTC", "America/Los_Angeles", "Pacific/Kiritimati"]) {
    const result = spawnSync(process.execPath, ["--input-type=module", "-e", `import { expectedDailyPublication } from './scripts/verify-freshness.mjs'; console.log(expectedDailyPublication('${at}').expectedDate);`], { env: { ...process.env, TZ }, encoding: "utf8" });
    assert.equal(result.status, 0, result.stderr);
    assert.equal(result.stdout.trim(), date);
  }
});
test("reference times reject ambiguous zones, invalid dates and rollover hours", () => {
  for (const value of [undefined, "2026-10-13", "2026-10-13T07:00:00", "2026-02-30T07:00:00Z", "2026-10-13T24:00:00Z", "bad", new Date(NaN)]) {
    assert.throws(() => expectedDailyPublication(value), { code: "INVALID_REFERENCE_TIME" });
  }
});
test("CLI accepts only an explicit --at timestamp or the default current instant", () => {
  assert.deepEqual(parseFreshnessArgs([]), {});
  assert.deepEqual(parseFreshnessArgs(["--at", at]), { at });
  for (const args of [["--at"], [at], ["--article-only"], ["--at", at, "extra"]]) assert.throws(() => parseFreshnessArgs(args), { code: "INVALID_ARGUMENTS" });
});
test("freshness requires the exact expected date and complete live publication", async () => {
  const { fetchImpl, calls } = mockFetch();
  const result = await verifyFreshness({ at, fetchImpl });
  assert.equal(result.status, "fresh-and-published");
  assert.equal(result.expectedDate, date);
  assert.equal(result.commit, sha);
  assert.ok(calls.some(url => url.includes(`/contents/content/daily/daily-${date}.json?ref=${sha}`)));
  assert.equal(result.referenceTime, "2026-10-12T22:00:00.000Z");
});
test("yesterday's successful deployment cannot hide today's missing report", async () => {
  const { fetchImpl, calls } = mockFetch({ missing: true });
  await assert.rejects(verifyFreshness({ at, fetchImpl }), error => error.code === "EXPECTED_REPORT_MISSING" && error.context.expectedDate === date && /not evidence of a deployment failure/.test(error.message));
  assert.ok(!calls.some(url => url.includes("/actions/")), "Do not reinterpret a content gap as a failed deployment");
  assert.ok(!calls.some(url => url.includes("daily-2026-10-12.json")), "Do not fall back to yesterday's existing article");
});
test("a racing publication is not mislabeled as missing content", async () => {
  await assert.rejects(verifyFreshness({ at, fetchImpl: mockFetch({ missing: true, race: true }).fetchImpl }), { code: "MAIN_CHANGED" });
});
test("a future-dated file cannot substitute for the exact expected date", async () => {
  const { fetchImpl, calls } = mockFetch({ missing: true });
  const futureFile = { ...article, slug: "daily-2026-10-14" };
  const fetchWithFuture = async url => url.includes("daily-2026-10-14.json")
    ? { ok: true, status: 200, json: async () => ({ encoding: "base64", content: Buffer.from(JSON.stringify(futureFile)).toString("base64") }) }
    : fetchImpl(url);
  await assert.rejects(verifyFreshness({ at, fetchImpl: fetchWithFuture }), { code: "EXPECTED_REPORT_MISSING" });
  assert.ok(calls.some(url => url.includes("daily-2026-10-13.json")));
  assert.ok(!calls.some(url => url.includes("daily-2026-10-14.json")));
});
test("access errors and network failures never become missing-report findings", async () => {
  for (const status of [403, 429, 503]) await assert.rejects(verifyFreshness({ at, fetchImpl: mockFetch({ status }).fetchImpl }), { code: "READ_FAILED" });
  await assert.rejects(verifyFreshness({ at, fetchImpl: async () => { throw new Error("timeout"); } }), { code: "READ_FAILED" });
});
test("a same-path placeholder, wrong identity or stale timestamp cannot pass freshness", async () => {
  for (const storedArticle of [
    { ...article, slug: "daily-2026-10-12" }, { ...article, sections: [] }, { ...article, sections: [{ heading: "Empty" }] }, { ...article, title: " " },
    { ...article, dateTime: "2026-10-12T07:00:00+09:00", date: "2026-10-12 07:00" },
    { ...article, dateTime: "not a timestamp" }, { ...article, date: "2026-10-13 08:00" },
  ]) {
    await assert.rejects(verifyFreshness({ at, fetchImpl: mockFetch({ storedArticle }).fetchImpl }), { code: "EXPECTED_REPORT_INVALID" });
  }
});
test("late recovery retains its actual timestamp instead of being backdated to 07:00", async () => {
  for (const actualDate of [date, "2026-10-14"]) {
    const storedArticle = { ...article, date: `${actualDate} 13:08`, dateTime: `${actualDate}T13:08:00+09:00`, displayDate: actualDate };
    const liveHome = home.replaceAll(at, storedArticle.dateTime).replaceAll(article.date, storedArticle.date);
    const liveBody = body.replace(`<p class="report-date">${date}</p>`, `<p class="report-date">${actualDate}</p>`);
    const result = await verifyFreshness({ at, fetchImpl: mockFetch({ storedArticle, liveHome, liveBody }).fetchImpl });
    assert.equal(result.status, "fresh-and-published");
    assert.equal(result.expectedDate, date);
  }
});
test("a present report still fails if deployment or live content is unverified", async () => {
  for (const options of [{ conclusion: "failure" }, { conclusion: null }, { liveBody: body.replace("Verified body", "Stale body") }, { liveHome: home.replaceAll(href, "/market-note/articles/daily-2026-10-12/") }, { race: true }]) {
    await assert.rejects(verifyFreshness({ at, fetchImpl: mockFetch(options).fetchImpl }), { code: "PUBLICATION_UNVERIFIED" });
  }
});
test("freshness is called by the existing post-deployment workflow, without a new scheduler", () => {
  const workflow = readFileSync(new URL("../.github/workflows/verify-live.yml", import.meta.url), "utf8");
  assert.match(workflow, /npm run verify:freshness/);
  assert.doesNotMatch(workflow, /\bschedule\s*:|\bcron\s*:/);
  const build = readFileSync(new URL("../.github/workflows/pages.yml", import.meta.url), "utf8");
  assert.match(build, /tests\/freshness-verification\.test\.mjs/);
});
