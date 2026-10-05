import assert from "node:assert/strict";
import { fileURLToPath } from "node:url";
import { access, readFile, readdir } from "node:fs/promises";
import { ESLint } from "eslint";
import test from "node:test";
import { loadArticleRegistry, loadContentDrivenArticles } from "./article-registry.mjs";

const root = new URL("../", import.meta.url);
const cwd = fileURLToPath(root);
const html = await readFile(new URL("out/index.html", root), "utf8");
const articles = await loadArticleRegistry();

test("the header is immediately followed by the homepage photo", () => {
  assert.match(html, /<\/header>\s*<main class="site-shell">\s*<section class="market-hero"/);
  assert.equal((html.match(/class="market-hero"/g) ?? []).length, 1);
});

test("every legacy daily route is still represented in the combined registry", async () => {
  const routes = await readdir(new URL("app/articles/", root), { withFileTypes: true });
  for (const route of routes.filter((entry) => entry.isDirectory() && entry.name.startsWith("daily-"))) {
    assert.ok(
      articles.some((article) => article.href === `/articles/${route.name}` && article.kind === "日次レポート"),
      `${route.name} is missing from the combined article registry`,
    );
  }
});

test("content-driven daily reports export without manual homepage registration", async () => {
  const contentDriven = await loadContentDrivenArticles();
  assert.ok(contentDriven.length >= 1, "At least one daily report must exercise the content-driven route");
  const archive = html.slice(html.indexOf('id="articles"'), html.indexOf('id="policy"'));

  for (const article of contentDriven) {
    await access(new URL(`out${article.href}/index.html`, root));
    assert.ok(archive.includes(`/market-note${article.href}`), `${article.href} must appear in the archive`);
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

test("repository lint passes before publication", async () => {
  const eslint = new ESLint({ cwd });
  const results = await eslint.lintFiles(["."]);
  const errors = results.reduce((sum, result) => sum + result.errorCount + result.fatalErrorCount, 0);
  assert.equal(
    errors,
    0,
    results.flatMap((result) => result.messages.map((message) => `${result.filePath}:${message.line ?? 0}:${message.column ?? 0} ${message.message}`)).join("\n"),
  );
});
