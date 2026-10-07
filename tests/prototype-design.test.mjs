import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { createRequire } from "node:module";
import { resolve, dirname } from "node:path";
import test from "node:test";
import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import ts from "typescript";
const require = createRequire(import.meta.url);
function load(path) {
  const source = readFileSync(path, "utf8");
  const { outputText } = ts.transpileModule(source, { compilerOptions: { module: ts.ModuleKind.CommonJS, jsx: ts.JsxEmit.ReactJSX, target: ts.ScriptTarget.ES2022 } });
  const loaded = { exports: {} };
  const localRequire = name => name.startsWith(".") ? (name.endsWith(".json") ? JSON.parse(readFileSync(resolve(dirname(path), name), "utf8")) : load(resolve(dirname(path), `${name}.ts`))) : require(name);
  new Function("require", "module", "exports", outputText)(localRequire, loaded, loaded.exports);
  return loaded.exports;
}
const { default: UpcomingEvents, todayInJapan } = load(resolve("app/upcoming-events.tsx"));
const { default: SnapshotChart } = load(resolve("app/components/snapshot-chart.tsx"));
const render = today => renderToStaticMarkup(createElement(UpcomingEvents, { today }));
test("calendar date follows JST at a UTC date boundary", () => {
  assert.equal(todayInJapan(new Date("2026-10-06T15:01:00Z")), "2026-10-07");
  assert.equal(todayInJapan(new Date("2026-10-06T14:59:00Z")), "2026-10-06");
});
test("upcoming schedules never show past September events as October upcoming", () => {
  const html = render("2026-10-07");
  assert.ok(html.includes('dateTime="2026-10-08"'));
  assert.ok(!html.includes('dateTime="2026-09'));
  assert.ok(!html.includes("NYSE休場"));
  assert.ok(html.includes("予定データ更新："));
});
test("expired schedules use a truthful empty state", () => {
  const html = render("2026-12-01");
  assert.ok(html.includes("登録済みの今後の予定はありません"));
  assert.ok(!html.includes("upcoming-list"));
});
test("snapshot chart uses only explicit stock-index change values from the article", () => {
  const article = JSON.parse(readFileSync("content/daily/daily-2026-10-07.json", "utf8"));
  const table = article.sections.find(s => s.heading === "市場スナップショット").table;
  const html = renderToStaticMarkup(createElement(SnapshotChart, { table }));
  for (const number of ["+0.58%", "+0.45%", "+0.49%", "+1.05%"]) assert.ok(html.includes(number));
  assert.ok(!html.includes("+13.7%"));
  assert.ok(html.includes("リアルタイムデータではありません"));
  assert.equal(renderToStaticMarkup(createElement(SnapshotChart, { table: { headers: [], rows: [["S&P500", "不明", ""]] } })), "");
});
test("new daily layout preserves every paragraph, table cell and source URL", () => {
  const article = JSON.parse(readFileSync("content/daily/daily-2026-10-07.json", "utf8"));
  const html = readFileSync("out/articles/daily-2026-10-07/index.html", "utf8");
  const encode = s => s.replaceAll("&", "&amp;").replaceAll("<", "&lt;").replaceAll(">", "&gt;").replaceAll('"', "&quot;").replaceAll("'", "&#x27;");
  for (const section of article.sections) {
    assert.ok(html.includes(encode(section.heading)));
    for (const text of section.paragraphs ?? []) assert.ok(html.includes(encode(text)));
    for (const row of section.table?.rows ?? []) for (const cell of row) assert.ok(html.includes(encode(cell)));
    for (const source of section.sources ?? []) assert.ok(html.includes(encode(source.url)));
  }
  assert.ok(html.includes('aria-label="記事の目次"'));
  assert.ok(html.includes('class="source-panel"'));
});
test("responsive styles preserve reduced motion and 44px primary control targets", () => {
  const css = readFileSync("app/globals.css", "utf8");
  const menu = readFileSync("app/mobile-navigation.tsx", "utf8");
  const archive = readFileSync("app/article-archive.tsx", "utf8");
  assert.ok(css.includes("prefers-reduced-motion: reduce"));
  assert.ok(css.includes("min-width: 44px"));
  assert.ok(menu.includes('event.key === "Escape"'));
  assert.ok(menu.includes('aria-expanded={open}'));
  assert.ok(menu.includes('event.key === "Tab"'));
  assert.ok(archive.includes('matches ? "auto" : "smooth"'));
});
