import test from "node:test";
import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import { requestAnalysis, ANALYSIS_ENDPOINT } from "../app/company-analysis/analysis-client.mjs";

test("the exported submission-month group explains filing timing and links its guidance accessibly", async () => {
  const html = await readFile(new URL("../out/company-analysis/index.html", import.meta.url), "utf8");
  const group = html.match(/<fieldset\b([^>]*class="month-fieldset"[^>]*)>([\s\S]*?)<\/fieldset>/);
  assert.ok(group, "Submission-month controls must be present");
  assert.match(group[1], /aria-describedby="submission-month-help submission-month-timing"/);
  assert.match(group[2], /<legend>検索する提出月<\/legend>/);
  assert.match(group[2], /<p id="submission-month-help">通常は自動推定のままで検索できます。必要な場合は複数の月を選択できます。<\/p>/);
  // FSA confirms the ordinary three-month deadline and approved extensions:
  // https://www.fsa.go.jp/news/r8/sonota/20260731/20260731.html
  assert.match(group[2], /<p id="submission-month-timing">有価証券報告書は原則、決算日から3か月以内に提出されます。3月決算なら6月が目安です。見つからない場合は、提出延期や訂正報告書なども考慮して、7月など前後の月も確認してください。<\/p>/);
  assert.ok(group[2].indexOf('id="submission-month-timing"') < group[2].indexOf('class="month-options"'), "Show the hint before the month choices");
  assert.equal((group[2].match(/type="checkbox"/g) ?? []).length, 14);
  assert.equal((group[2].match(/checked=""/g) ?? []).length, 1, "Keep the existing auto-estimation default");
});

test("a Pages search uses one public request and returns missing analysis without fabrication", async () => {
  let calls = 0;
  const payload = { edinetCode: "E02144", years: 1 };
  const result = await requestAnalysis(payload, { fetchImpl: async (url, options) => {
    calls++;
    assert.equal(url, ANALYSIS_ENDPOINT);
    assert.equal(options.credentials, "omit");
    assert.deepEqual(JSON.parse(options.body), payload);
    return Response.json({ documents: [], analysis: null });
  }});
  assert.equal(calls, 1);
  assert.equal(result.analysis, null);
});

test("FastAPI validation and unavailable-source details reach the user", async () => {
  await assert.rejects(requestAnalysis({}, { fetchImpl: async () => Response.json({ detail: "EDINET APIキーが分析サーバーに設定されていません。" }, { status: 503 }) }), /EDINET APIキー/);
});

test("network or CORS failure does not retry a nonexistent static server route", async () => {
  let calls = 0;
  await assert.rejects(requestAnalysis({}, { fetchImpl: async () => { calls++; throw new TypeError("Failed to fetch"); } }), /接続できません/);
  assert.equal(calls, 1);
});

test("an HTML gateway error is reported as unreadable data", async () => {
  await assert.rejects(requestAnalysis({}, { fetchImpl: async () => new Response("<html>Bad Gateway</html>", { status: 502 }) }), /読み取れる結果/);
});

test("a successful but malformed reply cannot become a result", async () => {
  await assert.rejects(requestAnalysis({}, { fetchImpl: async () => Response.json({ error: "unexpected" }) }), /形式/);
});

test("slow analysis aborts and always clears the timeout", async () => {
  await assert.rejects(requestAnalysis({}, { timeoutMs: 10, fetchImpl: async (_, { signal }) => new Promise((resolve, reject) => signal.addEventListener("abort", () => reject(new DOMException("Aborted", "AbortError")), { once: true })) }), /検索期間を短く/);
});
