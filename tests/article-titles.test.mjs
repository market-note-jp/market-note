import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { createHash } from "node:crypto";
import { createRequire } from "node:module";
import { resolve, dirname } from "node:path";
import test from "node:test";
import ts from "typescript";
import { loadArticleRegistry } from "./article-registry.mjs";
const require = createRequire(import.meta.url);
function load(path) {
  const { outputText } = ts.transpileModule(readFileSync(path, "utf8"), { compilerOptions: { module: ts.ModuleKind.CommonJS, esModuleInterop: true, target: ts.ScriptTarget.ES2022 } });
  const loaded = { exports: {} };
  const localRequire = name => name.startsWith(".") ? (name.endsWith(".json") ? JSON.parse(readFileSync(resolve(dirname(path), name), "utf8")) : load(resolve(dirname(path), `${name}.ts`))) : require(name);
  new Function("require", "module", "exports", outputText)(localRequire, loaded, loaded.exports);
  return loaded.exports;
}
const { resolveArticleTitle, createArticleMetadata, withEditorialTitle } = load(resolve("lib/article-metadata.ts"));
const { getDailyArticles, normalizeDailyArticle } = load(resolve("lib/article-content.ts"));
const daily = JSON.parse(readFileSync("content/daily/daily-2026-10-07.json", "utf8"));
const weekly = JSON.parse(readFileSync("content/editorial-titles.json", "utf8"))["weekly-2026-09-28"];
const decode = s => s.replaceAll("&amp;", "&").replaceAll("&quot;", '"').replaceAll("&#x27;", "'").replaceAll("&lt;", "<").replaceAll("&gt;", ">");
const sha256 = s => createHash("sha256").update(s).digest("hex");
const meta = (html, name) => decode(html.match(new RegExp(`<meta (?:name|property)="${name}" content="([^"]*)"`))?.[1] ?? "");
for (const [slug, editorial] of [["daily-2026-10-07", daily], ["weekly-2026-09-28", weekly]]) {
  test(`${slug}: H1, card, HTML and social titles share one authoritative subject`, async () => {
    const html = readFileSync(`out/articles/${slug}/index.html`, "utf8");
    const title = editorial.title;
    assert.equal(decode(html.match(/<h1[^>]*>(.*?)<\/h1>/s)?.[1] ?? ""), title);
    assert.equal(decode(html.match(/<title>(.*?)<\/title>/s)?.[1] ?? ""), `${title} | Market Note`);
    assert.equal(meta(html, "og:title"), `${title} | Market Note`);
    assert.equal(meta(html, "twitter:title"), `${title} | Market Note`);
    for (const name of ["description", "og:description", "twitter:description"]) assert.equal(meta(html, name), editorial.description);
    const card = (await loadArticleRegistry()).find(a => a.href === `/articles/${slug}`);
    assert.equal(card.title, title);
    assert.ok(html.includes(slug.startsWith("daily") ? "DAILY MARKET BRIEFING" : "WEEKLY MARKET REPORT"));
  });
}
test("legacy title fallback is nonempty and prefers the authoritative title", () => {
  assert.equal(resolveArticleTitle({ title: "  主題  ", headline: "旧見出し" }), "主題");
  assert.equal(resolveArticleTitle({ headline: "旧見出し" }), "旧見出し");
  assert.equal(resolveArticleTitle({ title: "   ", headline: "旧見出し" }), "旧見出し");
  assert.throws(() => resolveArticleTitle({ title: " " }), /non-empty/);
  const metadata = createArticleMetadata({ headline: "旧見出し", excerpt: "既存の概要" });
  assert.equal(metadata.title, "旧見出し | Market Note");
  assert.equal(metadata.description, "既存の概要");
  assert.equal(metadata.openGraph.description, metadata.description);
  assert.equal(metadata.twitter.title, metadata.title);
  assert.equal(createArticleMetadata({ title: "既存タイトル" }).description, "既存タイトル");
});
test("untouched legacy archive entries keep their original fields", () => {
  const original = { href: "/articles/legacy-unlisted", title: "従来の日次タイトル", date: "2026-08-01", excerpt: "既存概要" };
  assert.strictEqual(withEditorialTitle(original), original);
  const current = { href: "/articles/weekly-2026-09-28", title: "旧タイトル", date: "2026-10-03 14:17", dateTime: "2026-10-03T14:17:00+09:00", excerpt: "既存概要" };
  assert.deepEqual(withEditorialTitle(current), { ...current, title: weekly.title });
  for (const article of getDailyArticles()) assert.ok(article.title.trim() && article.headline === article.title);
});
test("selected daily URL, publication time, body, dates and sources are unchanged", () => {
  assert.equal(daily.slug, "daily-2026-10-07");
  assert.equal(daily.date, "2026-10-07 07:00");
  assert.equal(daily.dateTime, "2026-10-07T07:00:00+09:00");
  assert.equal(daily.displayDate, "2026年10月7日（水）");
  const preserved = { ...daily };
  for (const key of ["title", "headline", "description"]) delete preserved[key];
  assert.equal(sha256(JSON.stringify(preserved)), "9e5f275f95af9b3cb664ec111f89a45b0523ed2453081b611fb80b9a5ee89841");
});
test("selected weekly route, publication date, body and sources are unchanged", async () => {
  const source = readFileSync("app/articles/weekly-2026-09-28/page.tsx", "utf8");
  assert.ok(source.includes("公開日：2026年10月3日／対象週：9月28日（月）〜10月2日（金）"));
  assert.equal(sha256(source.slice(source.indexOf('        <div className="report-body">'))), "e90db7071d5dfeca02d6405a1257ea7bf0f4d8eb59f894fbc3cea304dbe6667b");
  const article = (await loadArticleRegistry()).find(a => a.href === "/articles/weekly-2026-09-28");
  assert.equal(article.date, "2026-10-03 14:17");
  assert.equal(article.dateTime, "2026-10-03T14:17:00+09:00");
});
test("authoring guidance separates repository instructions from external job configuration", () => {
  for (const file of ["AGENTS.md", "CLOUD_AUTOMATION.md"]) {
    const text = readFileSync(file, "utf8");
    assert.ok(text.includes("2026-10-07"));
    assert.ok(text.includes("createArticleMetadata"));
    assert.ok(text.includes("32-character"));
    assert.match(text, /external|separately configured/);
  }
});

test("daily schema accepts a title-only input and supports legacy headline fallback", () => {
  const withoutHeadline = { ...daily };
  delete withoutHeadline.headline;
  assert.equal(normalizeDailyArticle(withoutHeadline, "daily-2026-10-07.json").headline, daily.title);
  const legacy = { ...daily, headline: "旧形式の見出し" };
  delete legacy.title;
  assert.equal(normalizeDailyArticle(legacy, "daily-2026-10-07.json").title, "旧形式の見出し");
  const missingBoth = { ...withoutHeadline };
  delete missingBoth.title;
  assert.throws(() => normalizeDailyArticle(missingBoth, "daily-2026-10-07.json"), /non-empty/);
  assert.throws(() => normalizeDailyArticle(withoutHeadline, "daily-2026-10-08.json"), /slug must be/);
});
