import test from "node:test";
import assert from "node:assert/strict";
import { requestAnalysis, ANALYSIS_ENDPOINT } from "../app/company-analysis/analysis-client.mjs";

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
