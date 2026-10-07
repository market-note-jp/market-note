import assert from "node:assert/strict";
import { readFileSync, readdirSync } from "node:fs";
import { createHash } from "node:crypto";
import test from "node:test";
import { loadArticleRegistry } from "./article-registry.mjs";
const registry = await loadArticleRegistry();
const catalog = JSON.parse(readFileSync("content/editorial-titles.json", "utf8"));
const decode = s => s.replaceAll("&amp;", "&").replaceAll("&quot;", '"').replaceAll("&#x27;", "'").replaceAll("&lt;", "<").replaceAll("&gt;", ">");
const hash = s => createHash("sha256").update(s).digest("hex");
const baseline = JSON.parse(readFileSync("tests/fixtures/article-preservation.json", "utf8"));

test("every archive article aligns its card, H1, HTML and social titles", () => {
  assert.equal(registry.length, Object.keys(catalog).length + readdirSync("content/daily").filter(name => /^daily-.*\.json$/.test(name)).length);
  for (const article of registry) {
    const html = readFileSync(`out${article.href}/index.html`, "utf8");
    const title = article.title;
    assert.ok(html.includes('id="main-content"'), article.href);
    assert.equal(decode(html.match(/<h1[^>]*>(.*?)<\/h1>/s)?.[1] ?? ""), title, article.href);
    assert.equal(decode(html.match(/<title>(.*?)<\/title>/s)?.[1] ?? ""), `${title} | Market Note`, article.href);
    for (const name of ["og:title", "twitter:title"]) assert.equal(decode(html.match(new RegExp(`<meta (?:name|property)="${name}" content="([^"]*)"`))?.[1] ?? ""), `${title} | Market Note`, `${article.href} ${name}`);
    const description = decode(html.match(/<meta name="description" content="([^"]*)"/)?.[1] ?? "");
    assert.ok(description, article.href);
    for (const name of ["og:description", "twitter:description"]) assert.equal(decode(html.match(new RegExp(`<meta (?:name|property)="${name}" content="([^"]*)"`))?.[1] ?? ""), description, article.href);
    if (["日次レポート", "週次レポート"].includes(article.kind)) assert.ok(!/^(デイリー・マーケットブリーフィング|週次マーケットニュースレポート)/.test(title), article.href);
  }
  assert.equal(new Set(registry.map(article => article.title)).size, registry.length, "Article titles must be unique");
  assert.ok(Object.keys(catalog).length >= 71);
});
test("all static article bodies, sources and publication date markup remain byte-identical", () => {
  for (const [file, expected] of Object.entries(baseline.static)) {
    const source = readFileSync(file, "utf8");
    assert.equal(hash(source.slice(source.lastIndexOf('<div', source.indexOf('report-body')))), expected.bodySha256, file);
    assert.ok(source.includes(expected.dateMarkup), file);
  }
});
test("all content-driven non-title fields including URLs, body and timestamps are preserved", () => {
  for (const [file, expected] of Object.entries(baseline.daily)) {
    const article = JSON.parse(readFileSync(file, "utf8"));
    for (const key of ["title", "headline", "description"]) delete article[key];
    assert.equal(hash(JSON.stringify(article)), expected, file);
  }
});

test("all five company article publication metadata dates are retained", () => {
  for (const slug of ["corporate-ajinomoto-abf-2026-08-30", "corporate-fanuc-2026-09-22", "corporate-kanematsu-2026-08-30", "corporate-sanrio-2026-08-23", "kioxia-per-2026-09-23"]) {
    const html = readFileSync(`out/articles/${slug}/index.html`, "utf8");
    assert.ok(html.includes(`property="article:published_time" content="${catalog[slug].publishedTime}"`), slug);
  }
});
