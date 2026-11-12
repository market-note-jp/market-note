import assert from "node:assert/strict";
import { existsSync, readFileSync, readdirSync } from "node:fs";
import { createHash } from "node:crypto";
import test from "node:test";
import { loadArticleRegistry } from "./article-registry.mjs";
import { verifyResearchArticle } from '../scripts/verify-research-article.mjs';
const registry = await loadArticleRegistry();
const catalog = JSON.parse(readFileSync("content/editorial-titles.json", "utf8"));
const decode = s => s.replaceAll("&amp;", "&").replaceAll("&quot;", '"').replaceAll("&#x27;", "'").replaceAll("&lt;", "<").replaceAll("&gt;", ">");
const hash = s => createHash("sha256").update(s).digest("hex");
const baseline = JSON.parse(readFileSync("tests/fixtures/article-preservation.json", "utf8"));

test("November 4 research retains an explicit title block and Parker company introduction", () => {
  for (const slug of ["company-agc-2026-11-04", "company-parker-hannifin-2026-11-04", "company-diploma-2026-11-04", "theme-amd-profit-working-capital-2026-11-04", "theme-rba-inflation-housing-2026-11-04"]) {
    const article = JSON.parse(readFileSync(`app/articles/${slug}/article.json`, "utf8"));
    assert.equal(article.markdown.trim().split(/\n\s*\n/)[0], `# ${article.title}`, slug);
  }
  const introduction = "Parker Hannifinは、工場や航空機の「動き、流れ、圧力」を制御する部品・システムの会社です。油圧、空圧、フィルター、シールなどを組み合わせ、装置メーカーへの販売と、その後の補修・交換で稼ぎます。";
  const html = readFileSync("out/articles/company-parker-hannifin-2026-11-04/index.html", "utf8");
  assert.ok(html.includes(`<div class="report-body research-article-body"><p>${introduction}</p>`));
});

test("every archive article aligns its card, H1, HTML and social titles", () => {
  assert.equal(registry.length, readdirSync("app/articles", { withFileTypes: true }).filter(entry => entry.isDirectory() && !entry.name.startsWith("[") && existsSync(`app/articles/${entry.name}/page.tsx`)).length + readdirSync("content/daily").filter(name => /^daily-.*\.json$/.test(name)).length);
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

// The November 5 batch must preserve the complete source body and first paragraph.
for (const slug of ["company-nintendo-2026-11-05", "company-autozone-2026-11-05", "company-atlas-copco-2026-11-05", "theme-ism-services-demand-deliveries-2026-11-05", "theme-arm-silicon-gross-margin-2026-11-05"]) {
  test(`${slug}: explicit title, complete visible content and metadata`, () => {
    const article = JSON.parse(readFileSync(`app/articles/${slug}/article.json`, 'utf8'));
    assert.equal(article.markdown.trim().split(/\n\s*\n/)[0], `# ${article.title}`);
    const html = readFileSync(`out/articles/${slug}/index.html`, 'utf8');
    verifyResearchArticle(article, html);
  });
}

// The November 6 batch must preserve the complete source body and first paragraph.
for (const slug of ["company-keyence-2026-11-06", "company-ametek-2026-11-06", "company-kone-2026-11-06", "theme-us-productivity-ai-margins-2026-11-06", "theme-boe-energy-margins-2026-11-06"]) {
  test(`${slug}: explicit title, complete visible content and metadata`, () => {
    const article = JSON.parse(readFileSync(`app/articles/${slug}/article.json`, 'utf8'));
    assert.equal(article.markdown.trim().split(/\n\s*\n/)[0], `# ${article.title}`);
    const html = readFileSync(`out/articles/${slug}/index.html`, 'utf8');
    verifyResearchArticle(article, html);
  });
}

// The November 10 batch preserves complete visible body and publication metadata.
for (const slug of ["company-aosmith-2026-11-10", "company-mccormick-2026-11-10", "theme-cpi-missing-base-2026-11-10"]) {
  test(`${slug}: explicit title, complete visible content and metadata`, () => {
    const article = JSON.parse(readFileSync(`app/articles/${slug}/article.json`, "utf8"));
    assert.equal(article.markdown.trim().split(/\n\s*\n/)[0], `# ${article.title}`);
    verifyResearchArticle(article, readFileSync(`out/articles/${slug}/index.html`, "utf8"));
  });
}

// November 11: preserve complete visible source text and publication metadata.
for (const slug of ["company-wd40-2026-11-11", "company-nordson-2026-11-11", "theme-coreweave-backlog-funding-2026-11-11"]) {
  test(`${slug}: explicit title, complete visible content and metadata`, () => {
    const article = JSON.parse(readFileSync(`app/articles/${slug}/article.json`, "utf8"));
    assert.equal(article.markdown.trim().split(/\n\s*\n/)[0], `# ${article.title}`);
    verifyResearchArticle(article, readFileSync(`out/articles/${slug}/index.html`, "utf8"));
  });
}

// November 12: preserve complete visible source text and publication metadata.
for (const slug of ["company-brown-brown-2026-11-12", "company-monotaro-2026-11-12", "theme-uk-arrears-bank-consumption-2026-11-12"]) {
  test(`${slug}: explicit title, complete visible content and metadata`, () => {
    const article = JSON.parse(readFileSync(`app/articles/${slug}/article.json`, "utf8"));
    assert.equal(article.markdown.trim().split(/\n\s*\n/)[0], `# ${article.title}`);
    verifyResearchArticle(article, readFileSync(`out/articles/${slug}/index.html`, "utf8"));
  });
}
