import assert from "node:assert/strict";
import { readFileSync, readdirSync } from "node:fs";
import test from "node:test";
import { verifyRenderedArticle } from "../scripts/verify-publication.mjs";
const article = JSON.parse(readFileSync("content/daily/daily-2026-10-07.json", "utf8"));
const home = readFileSync("out/index.html", "utf8");
const html = readFileSync("out/articles/daily-2026-10-07/index.html", "utf8");
const encode = value => value.replaceAll("&", "&amp;").replaceAll("<", "&lt;").replaceAll(">", "&gt;").replaceAll('"', "&quot;").replaceAll("'", "&#x27;");
const firstParagraph = `<p>${encode(article.sections[0].paragraphs[0])}</p>`;
const secondParagraph = `<p>${encode(article.sections[0].paragraphs[1])}</p>`;
const source = article.sections.find(section => section.sources?.length).sources[0];
const sourceAnchor = `<a href="${encode(source.url)}" target="_blank" rel="noreferrer">${encode(source.label)}</a>`;
const rejects = (name, mutate) => test(name, () => { const changed = mutate(html); assert.notEqual(changed, html, "Mutation must change the rendered fixture"); assert.throws(() => verifyRenderedArticle(article, home, changed, { requireHomepagePlacement: false })); });

test("actual redesigned export passes full ordered-content verification", () => {
  verifyRenderedArticle(article, home, html, { requireHomepagePlacement: false });
});
rejects("missing body paragraph is rejected", h => h.replace(firstParagraph, ""));
rejects("changed body paragraph is rejected", h => h.replace(firstParagraph, "<p>Changed body text</p>"));
rejects("reordered body paragraphs are rejected", h => h.replace(firstParagraph + secondParagraph, secondParagraph + firstParagraph));
rejects("missing source is rejected", h => h.replace(sourceAnchor, ""));
rejects("changed source URL is rejected", h => h.replace(sourceAnchor, sourceAnchor.replace(encode(source.url), "https://example.com/wrong-source")));
rejects("changed source label is rejected", h => h.replace(sourceAnchor, sourceAnchor.replace(encode(source.label), "Wrong source")));
rejects("hidden source is rejected", h => h.replace(sourceAnchor, sourceAnchor.replace("<a ", '<a hidden="" ')));
rejects("hidden body is rejected", h => h.replace(firstParagraph, firstParagraph.replace("<p>", '<p style="display:none">')));
rejects("script text cannot replace visible body content", h => h.replace(firstParagraph, `<script>${encode(article.sections[0].paragraphs[0])}</script>`));
rejects("unexpected source-panel text is rejected", h => h.replace('<span class="source-panel-label">', '<p>Unexpected extra text</p><span class="source-panel-label">'));
rejects("changed table value is rejected", h => h.replace("<td>7,818.95、+0.58%</td>", "<td>9,999.99、+0.58%</td>"));
rejects("changed chart value is rejected", h => h.replace("<strong>+0.58%</strong>", "<strong>+9.99%</strong>"));
rejects("wrong publication timestamp is rejected", h => h.replace(`class="report-date" dateTime="${article.dateTime}"`, 'class="report-date" dateTime="2026-10-08T07:00:00+09:00"'));
rejects("wrong social title is rejected", h => h.replace(`property="og:title" content="${encode(article.title)} | Market Note"`, 'property="og:title" content="Wrong title"'));
rejects("missing social description is rejected", h => h.replace(/<meta property="og:description" content="[^"]*"\/>/, ""));

test("newest content-driven report retains current homepage placement", () => {
  const file = readdirSync("content/daily").filter(name => /^daily-.*\.json$/.test(name)).sort().at(-1);
  const latest = JSON.parse(readFileSync(`content/daily/${file}`, "utf8"));
  verifyRenderedArticle(latest, home, readFileSync(`out/articles/${latest.slug}/index.html`, "utf8"));
});
rejects("transparent report-body container is rejected", h => h.replace('<div class="report-body">', '<div class="report-body" style="opacity:0">'));
rejects("inert report-body container is rejected", h => h.replace('<div class="report-body">', '<div class="report-body" inert>'));
rejects("hidden report header is rejected", h => h.replace('<header class="report-header">', '<header class="report-header" hidden>'));
rejects("transparent report header is rejected", h => h.replace('<header class="report-header">', '<header class="report-header" style="opacity:0">'));
