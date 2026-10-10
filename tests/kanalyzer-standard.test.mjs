import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import { createRequire } from "node:module";
import vm from "node:vm";
import ts from "typescript";
import React from "react";
import { renderToStaticMarkup } from "react-dom/server";

const url = new URL("../app/company-analysis/analysis-form.tsx", import.meta.url);
const compiled = ts.transpileModule(fs.readFileSync(url, "utf8") + "\nexport { AnalysisDetails };", {
  compilerOptions: { module: ts.ModuleKind.CommonJS, jsx: ts.JsxEmit.ReactJSX, target: ts.ScriptTarget.ES2022 },
}).outputText;
const exports = {};
vm.runInNewContext(compiled, { exports, require: createRequire(url) });

function result(treasury = null) {
  return { profile: "standard", latest: { periodEnd: "2025-03-31" },
    metrics: [{ key: "roic", label: "ROIC", value: "12.0%" }],
    records: [{ period_end: "2025-03-31", issued_shares: 1000, treasury_shares: treasury,
      shares_for_valuation: treasury === null ? null : 1000 - treasury, revenue: 10000, net_income: 100,
      equity: 500, roic: 12 }],
  };
}

test("issued shares remain visible when treasury shares are unknown; valuation stays unavailable", () => {
  const html = renderToStaticMarkup(React.createElement(exports.AnalysisDetails, { analysis: result() }));
  assert.match(html, /発行済株式総数（自己株式を含む）<\/span><strong>1,000株/);
  assert.match(html, /自己株式数<\/span><strong>-/);
  assert.match(html, /自己株式を除く株式数<\/span><strong>-/);
  assert.match(html, /ROIC計算内訳/);
  assert.doesNotMatch(html, /<h3>DCF分析/);
});

test("an explicit zero treasury balance is shown as zero and permits valuation", () => {
  const html = renderToStaticMarkup(React.createElement(exports.AnalysisDetails, { analysis: result(0) }));
  assert.match(html, /自己株式数<\/span><strong>0株/);
  assert.match(html, /自己株式を除く株式数<\/span><strong>1,000株/);
});

test("the initial form selects three years and offers statements without a DCF option", () => {
  const html = renderToStaticMarkup(React.createElement(exports.AnalysisForm));
  assert.match(html, /<option value="3" selected="">3年/);
  assert.doesNotMatch(html, /DCF|WACC|永続成長率/);
});

test("all requested statement columns render with EPS precision and stock units", () => {
  const data = result();
  Object.assign(data.records[0], { reported_eps: 94.93, reported_bps: 338.45, gross_profit: 300000000,
    gross_margin: 28.10, capital_stock: 53076000000, financing_cf: -111325000000,
    issued_shares: 295863421, accounting_standard: "日本会計基準", source_updated_at: "2026-06-23 13:19" });
  const html = renderToStaticMarkup(React.createElement(exports.AnalysisDetails, { analysis: data }));
  for (const label of ["業績", "財務", "キャッシュフロー", "売上総利益", "粗利率", "経常利益率", "資本金", "減価償却費・償却費", "財務CF", "原資料提出日", "発行済株式総数（期末・千株）"]) assert.ok(html.includes(label), label);
  assert.match(html, /94\.93円/);
  assert.match(html, /338\.45円/);
  assert.match(html, /295,863\.421/);
  assert.match(html, /-111,325百万円/);
  assert.doesNotMatch(html, /DCF|WACC|永続成長率/);
});

test("forecast rows cannot enter the actual statement tables", () => {
  const data = result();
  data.records.push({ period_end: "2027-03-31", record_type: "forecast", revenue: 777777000000 });
  const html = renderToStaticMarkup(React.createElement(exports.AnalysisDetails, { analysis: data }));
  assert.doesNotMatch(html, /2027-03-31|777,777/);
});
