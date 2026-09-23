import assert from "node:assert/strict";
import { readFile, readdir } from "node:fs/promises";
import test from "node:test";
import ts from "typescript";

const root = new URL("../", import.meta.url);
const html = await readFile(new URL("out/index.html", root), "utf8");
const source = await readFile(new URL("app/page.tsx", root), "utf8");
const ast = ts.createSourceFile("page.tsx", source, ts.ScriptTarget.Latest, true, ts.ScriptKind.TSX);
const declaration = ast.statements.filter(ts.isVariableStatement)
  .flatMap((statement) => [...statement.declarationList.declarations])
  .find((item) => item.name.getText(ast) === "articles");
assert.ok(declaration && ts.isArrayLiteralExpression(declaration.initializer), "Keep one homepage article registry");
const articles = declaration.initializer.elements.map((element) => Object.fromEntries(
  element.properties.map((property) => [property.name.getText(ast), property.initializer.text]),
));

test("the header is immediately followed by the homepage photo", () => {
  assert.match(html, /<\/header>\s*<main class="site-shell">\s*<section class="market-hero"/);
  assert.equal((html.match(/class="market-hero"/g) ?? []).length, 1);
});

test("every published daily report is registered in the existing archive", async () => {
  const routes = await readdir(new URL("app/articles/", root), { withFileTypes: true });
  for (const route of routes.filter((entry) => entry.isDirectory() && entry.name.startsWith("daily-"))) {
    assert.ok(articles.some((article) => article.href === `/articles/${route.name}` && article.kind === "日次レポート"), `${route.name} is missing from the article registry`);
  }
});

test("recent daily reports appear in the existing archive and latest section", () => {
  const daily = articles.filter((article) => article.kind === "日次レポート")
    .sort((a, b) => b.date.localeCompare(a.date));
  assert.ok(daily.length >= 4);
  const latest = html.slice(html.indexOf('id="latest"'), html.indexOf('id="companies"'));
  const archive = html.slice(html.indexOf('id="articles"'), html.indexOf('id="policy"'));
  assert.ok(latest.includes(`/market-note${daily[0].href}`), "Latest daily report must use the existing latest section");
  for (const report of daily.slice(0, 4)) {
    assert.ok(archive.includes(`/market-note${report.href}`), `${report.href} must appear in the archive`);
  }
});
