import assert from "node:assert/strict";
import { readFile, access } from "node:fs/promises";
import { execFileSync } from "node:child_process";
import { fileURLToPath } from "node:url";
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

test("the redesign preserves every article record and exported article route", async () => {
  const before = articleRegistry(execFileSync("git", ["show", "HEAD:app/page.tsx"], { cwd: fileURLToPath(root), encoding: "utf8" }));
  const after = articleRegistry(await readFile(new URL("app/page.tsx", root), "utf8"));
  assert.deepEqual(after, before);
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
  assert.equal((html.match(/class="company-story"/g) ?? []).length, 3);
});

test("all primary routes have exactly one shared header and footer", async () => {
  for (const route of ["", "calendar/", "articles/corporate-kanematsu-2026-08-30/", "articles/daily-2026-09-05/"]) {
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
});

test("the masthead asset is an optimized local WebP", async () => {
  const bytes = await readFile(new URL("public/market-district-v1.webp", root));
  assert.equal(bytes.subarray(0, 4).toString(), "RIFF");
  assert.equal(bytes.subarray(8, 12).toString(), "WEBP");
  assert.ok(bytes.length < 400_000);
  const exported = await readFile(new URL("out/market-district-v1.webp", root));
  assert.deepEqual(exported, bytes);
});
