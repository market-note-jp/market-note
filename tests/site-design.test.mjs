import assert from "node:assert/strict";
import { readFile, access } from "node:fs/promises";
import test from "node:test";
import ts from "typescript";

const root = new URL("../", import.meta.url);
const htmlAt = (path = "") => readFile(new URL(`../out/${path}index.html`, import.meta.url), "utf8");

function articleRegistry(source) {
  const ast = ts.createSourceFile("page.tsx", source, ts.ScriptTarget.Latest, true, ts.ScriptKind.TSX);
  for (const statement of ast.statements) {
    if (!ts.isVariableStatement(statement)) continue;
    const declaration = statement.declarationList.declarations.find((item) => item.name.getText(ast) === "articles");
    if (!declaration?.initializer || !ts.isArrayLiteralExpression(declaration.initializer)) continue;
    return declaration.initializer.elements.map((element) => {
      assert.ok(ts.isObjectLiteralExpression(element));
      return Object.fromEntries(element.properties.map((property) => {
        assert.ok(ts.isPropertyAssignment(property) && ts.isStringLiteral(property.initializer));
        return [property.name.getText(ast), property.initializer.text];
      }));
    });
  }
  throw new Error("Article registry not found");
}

test("the article registry has unique entries and exported article routes", async () => {
  const after = articleRegistry(await readFile(new URL("app/page.tsx", root), "utf8"));
  assert.ok(after.some((article) => article.href === "/articles/corporate-fanuc-2026-09-22"));
  assert.equal(new Set(after.map((article) => article.href)).size, after.length);
  for (const article of after) await access(new URL(`out${article.href}/index.html`, root));
});

test("the homepage exports the masthead, latest reports, company section and archive", async () => {
  const html = await htmlAt();
  for (const id of ["home-title", "latest", "companies", "articles", "policy"]) {
    assert.ok(html.includes(`id="${id}"`), `Missing ${id}`);
  }
  assert.ok(html.includes("2026-09-05"));
  assert.ok(html.includes("直近の予定"));
  assert.ok(html.includes("NYSE休場"));
  assert.ok(html.includes("/market-note/market-district-v1.webp"));
  assert.equal((html.match(/class="company-story"/g) ?? []).length, 5);
  assert.ok(html.includes("ファナック（6954）企業レポート"));
});

test("the reviewed Kioxia article preserves tables, sources, chart and supplement", async () => {
  const html = await htmlAt("articles/kioxia-per-2026-09-23/");
  assert.equal((html.match(/<table>/g) ?? []).length, 9);
  assert.equal((html.match(/<details>/g) ?? []).length, 1);
  for (let source = 1; source <= 11; source++) assert.ok(html.includes(`id="s${source}"`));
  assert.ok(html.includes("実績と予想で変わる数字の読み方"));
  assert.ok(html.includes("単位：百万円"));
  assert.ok(html.includes("免責事項"));
  assert.ok(!/確認稿|未公開|公開前に編集責任者/.test(html));
  assert.ok(html.includes("/market-note/reports/kioxia-per-2026-09-23/per-definitions.png"));
  await access(new URL("out/reports/kioxia-per-2026-09-23/per-definitions.png", root));
  assert.ok((await htmlAt()).includes("/market-note/articles/kioxia-per-2026-09-23/"));
});

test("all primary routes have exactly one shared header and footer", async () => {
  for (const route of ["", "calendar/", "articles/corporate-kanematsu-2026-08-30/", "articles/corporate-fanuc-2026-09-22/", "articles/daily-2026-09-05/"]) {
    const html = await htmlAt(route);
    assert.equal((html.match(/class="site-header"/g) ?? []).length, 1, route);
    assert.equal((html.match(/class="site-footer"/g) ?? []).length, 1, route);
    assert.ok(html.includes('href="/market-note/#companies"'), route);
    assert.ok(html.includes('href="/market-note/calendar/"'), route);
  }
});

test("visible internal links point to exported pages", async () => {
  for (const route of ["", "calendar/"]) {
    const html = await htmlAt(route);
    for (const link of html.matchAll(/<a\b[^>]*href="([^"]+)"/g)) {
      const href = link[1];
      if (!href.startsWith("/market-note/")) continue;
      const path = href.slice("/market-note/".length).split(/[?#]/)[0];
      await access(new URL(`out/${path.replace(/\/$/, "")}${path ? "/" : ""}index.html`, root));
    }
  }
});

test("the calendar keeps the sourced schedules and report tables survive the redesign", async () => {
  const calendar = await htmlAt("calendar/");
  assert.ok(calendar.includes("68"));
  assert.ok(calendar.includes("Oracle FY2027 Q1"));
  assert.ok(calendar.includes('value="休場"'));
  const report = await htmlAt("articles/corporate-kanematsu-2026-08-30/");
  assert.ok(report.includes("<table"));
  assert.ok(report.includes("百万円"));
  assert.ok(report.includes("https://www.kanematsu.co.jp/"));
  const fanuc = await htmlAt("articles/corporate-fanuc-2026-09-22/");
  assert.ok(fanuc.includes("11年間の業績推移"));
  assert.ok(fanuc.includes("単位：百万円"));
  assert.ok(fanuc.includes("▲34.2％"));
  assert.ok(fanuc.includes("fanuc_company_report_2026-09-22.pdf"));
  await access(new URL("out/reports/fanuc_company_report_2026-09-22.pdf", root));
  await access(new URL("out/reports/fanuc_calculation_notes_2026-09-22.md", root));
});

test("the masthead asset is an optimized local WebP", async () => {
  const bytes = await readFile(new URL("public/market-district-v1.webp", root));
  assert.equal(bytes.subarray(0, 4).toString(), "RIFF");
  assert.equal(bytes.subarray(8, 12).toString(), "WEBP");
  assert.ok(bytes.length < 400_000);
  const exported = await readFile(new URL("out/market-district-v1.webp", root));
  assert.deepEqual(exported, bytes);
});
