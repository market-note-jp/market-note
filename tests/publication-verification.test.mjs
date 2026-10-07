import assert from "node:assert/strict";
import test from "node:test";
import { verifyPublication, verifyRenderedArticle } from "../scripts/verify-publication.mjs";

const sha = "a".repeat(40);
const date = "2026-10-06";
const article = { slug: `daily-${date}`, headline: "Test headline", displayDate: date, title: "Test title", dateTime: `${date}T07:00:00+09:00`, date: `${date} 07:00`, excerpt: "Test excerpt", sections: [{ heading: "Conclusion", paragraphs: ["Verified & sourced body"], sources: [{ label: "Source", url: "https://example.com/report" }] }], disclaimer: { heading: "Notice", paragraphs: ["Informational only"] } };
const href = `/market-note/articles/${article.slug}/`;
const card = `<h3>${article.title}</h3><time dateTime="${article.dateTime}">${article.date}</time><p class="article-excerpt">${article.excerpt}</p>`;
const homepage = `</header><main class="site-shell"><section class="market-hero"></section><section id="latest"><a href="${href}">${card}</a></section><section id="companies"></section><section id="articles"><a href="${href}">${card}</a></section><section id="policy"></section></main>`;
const articleHtml = `<article><h1>${article.title}</h1><p class="report-date">${date}</p><div class="report-body"><section><h2>Conclusion</h2><p>Verified &amp; sourced body</p><p class="inline-sources"><span><a href="https://example.com/report" target="_blank" rel="noreferrer">Source</a></span></p></section><section class="disclaimer"><h2>Notice</h2><p>Informational only</p></section></div></article>`;

function mockFetch({ head = sha, conclusion = "success", deploy = "success", body = articleHtml, home = homepage, race = false } = {}) {
  let mainReads = 0;
  return async (url) => {
    let value;
    if (url.endsWith("/branches/main")) value = { commit: { sha: race && ++mainReads > 1 ? "b".repeat(40) : head } };
    else if (url.includes("/contents/")) value = { encoding: "base64", content: Buffer.from(JSON.stringify(article)).toString("base64") };
    else if (url.includes("/workflows/pages.yml/runs?")) value = { workflow_runs: [{ id: 123, head_sha: sha, head_branch: "main", event: "push", status: "completed", conclusion }] };
    else if (url.includes("/actions/runs/123/jobs?")) value = { jobs: [{ name: "build", status: "completed", conclusion: "success" }, { name: "deploy", status: "completed", conclusion: deploy }] };
    else value = url.includes("/articles/") ? body : home;
    return { ok: true, status: 200, json: async () => value, text: async () => value };
  };
}

test("publication requires matching main, successful build/deploy and visible article", async () => {
  const result = await verifyPublication({ date, sha, fetchImpl: mockFetch() });
  assert.equal(result.status, "published");
  assert.equal(result.commit, sha);
});
test("historical publication can verify the exact article without requiring a latest card", async () => {
  const olderHome = homepage.replaceAll(href, "/market-note/articles/newer-report/");
  const result = await verifyPublication({ date, sha, fetchImpl: mockFetch({ home: olderHome }), requireHomepagePlacement: false });
  assert.equal(result.status, "published");
  assert.equal(result.commit, sha);
});
for (const [name, options] of [
  ["branch-only save", { head: "b".repeat(40) }],
  ["failed workflow", { conclusion: "failure" }],
  ["skipped deployment", { deploy: "skipped" }],
  ["stale article body", { body: articleHtml.replace("Verified &amp; sourced body", "Yesterday's body") }],
  ["missing homepage registration", { home: homepage.replaceAll(href, "/market-note/articles/yesterday/") }],
  ["concurrent main update", { race: true }],
]) {
  test(`does not call ${name} published`, async () => {
    await assert.rejects(verifyPublication({ date, sha, fetchImpl: mockFetch(options) }));
  });
}
test("report text hidden only in script data is not accepted", () => {
  const body = articleHtml.replace("<p>Verified &amp; sourced body</p>", "") + '<script>Verified &amp; sourced body</script>';
  assert.throws(() => verifyRenderedArticle(article, homepage, body));
});
test("a missing source link or hero layout fails verification", () => {
  assert.throws(() => verifyRenderedArticle(article, homepage, articleHtml.replace('href="https://example.com/report"', "")));
  assert.throws(() => verifyRenderedArticle(article, homepage.replace('class="market-hero"', 'class="report-list"'), articleHtml));
});
test("network errors remain unverified", async () => {
  await assert.rejects(verifyPublication({ date, sha, fetchImpl: async () => ({ ok: false, status: 503 }) }), /503/);
});

test("script text within the report body cannot substitute for visible content", () => {
  const body = articleHtml.replace("<p>Verified &amp; sourced body</p>", "<script>Verified &amp; sourced body</script>");
  assert.throws(() => verifyRenderedArticle(article, homepage, body));
});
test("wrong table values fail even when the expected number appears in prose", () => {
  const withTable = structuredClone(article);
  withTable.sections[0].paragraphs = ["Yield is 5.31%"];
  withTable.sections[0].table = { headers: ["Yield"], rows: [["5.31%"]] };
  const correct = articleHtml.replace("<p>Verified &amp; sourced body</p>", '<p>Yield is 5.31%</p><div class="table-wrap"><table><thead><tr><th>Yield</th></tr></thead><tbody><tr><td>5.31%</td></tr></tbody></table></div>');
  verifyRenderedArticle(withTable, homepage, correct);
  for (const wrong of ["9.99%", "15.31%"]) assert.throws(() => verifyRenderedArticle(withTable, homepage, correct.replace("<td>5.31%</td>", `<td>${wrong}</td>`)));
});
test("stale homepage excerpt and title fail even with correct links", () => {
  assert.throws(() => verifyRenderedArticle(article, homepage.replaceAll(article.excerpt, "Stale excerpt"), articleHtml));
  assert.throws(() => verifyRenderedArticle(article, homepage.replaceAll(article.title, "Stale title"), articleHtml));
});
