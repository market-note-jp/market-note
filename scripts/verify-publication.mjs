import assert from "node:assert/strict";
import { pathToFileURL } from "node:url";
import { verifyArticleSemantics } from "./article-semantics.mjs";

const repository = "market-note-jp/market-note";
const api = `https://api.github.com/repos/${repository}`;
const site = "https://market-note-jp.github.io/market-note/";
const escapeHtml = (value) => value.replace(/[&<>"']/g, (character) => ({
  "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#x27;",
})[character]);

export function verifyRenderedArticle(article, homepage, articleHtml, { requireHomepagePlacement = true } = {}) {
  const href = `/market-note/articles/${article.slug}`;
  // Script/metadata strings are not visible homepage content. Semantic
  // verification rejects hidden, extra, missing and reordered article content.
  const visibleHome = homepage.replace(/<(script|style|template)\b[^>]*>[\s\S]*?<\/\1>/gi, "").replace(/<!--[\s\S]*?-->/g, "");
  assert.match(visibleHome, /<\/header>\s*<main class="site-shell">\s*<section class="market-hero"/, "Homepage must begin with the photo below the header");
  if (requireHomepagePlacement) {
    for (const [start, end] of [["latest", "companies"], ["articles", "policy"]]) {
      const begin = visibleHome.indexOf(`id="${start}"`);
      const finish = visibleHome.indexOf(`id="${end}"`, begin);
      assert.ok(begin >= 0 && finish > begin, `Missing ${start} section`);
      const cards = [...visibleHome.slice(begin, finish).matchAll(/<a\b([^>]*)>([\s\S]*?)<\/a>/g)];
      const card = cards.find((match) => match[1].includes(`href="${href}/"`) || match[1].includes(`href="${href}"`))?.[2];
      assert.ok(card, `${article.slug} is absent from ${start}`);
      assert.ok(card.includes(`<h3>${escapeHtml(article.title)}</h3>`), `Stale ${start} title`);
      assert.ok(card.includes(`<time dateTime="${escapeHtml(article.dateTime)}">`), `Stale ${start} timestamp`);
      if (start === "articles") {
        assert.ok(card.includes(`<p class="article-excerpt">${escapeHtml(article.excerpt)}</p>`), "Stale archive excerpt");
        assert.ok(card.includes(`>${escapeHtml(article.date)}</time>`), "Stale archive display date");
      } else if (card.includes("<p>")) {
        assert.ok(card.includes(`<p>${escapeHtml(article.excerpt)}</p>`), "Stale lead-story excerpt");
      }
    }
  }
  verifyArticleSemantics(article, articleHtml);
}

export async function verifyPublication({ date, sha, fetchImpl = fetch, requireHomepagePlacement = true }) {
  assert.match(date ?? "", /^\d{4}-\d{2}-\d{2}$/, "Supply a date in YYYY-MM-DD form");
  assert.match(sha ?? "", /^[0-9a-f]{40}$/, "Supply the full expected main commit SHA");
  const slug = `daily-${date}`;
  async function get(url, json = true) {
    const headers = { Accept: json ? "application/vnd.github+json" : "text/html", "Cache-Control": "no-cache" };
    // The workflow supplies its existing read-only GitHub token to avoid shared
    // unauthenticated runner-IP limits. Never forward credentials to Pages.
    const token = process.env.GITHUB_TOKEN;
    if (token && url.startsWith("https://api.github.com/")) headers.Authorization = `Bearer ${token}`;
    const response = await fetchImpl(url, {
      headers,
      signal: AbortSignal.timeout(30_000),
      redirect: "error",
    });
    assert.ok(response.ok, `Read failed (${response.status}): ${url}`);
    return json ? response.json() : response.text();
  }
  const mainUrl = `${api}/branches/main`;
  const before = await get(mainUrl);
  assert.equal(before.commit.sha, sha, "Expected commit is not current main; read the new head before retrying");
  const file = await get(`${api}/contents/content/daily/${slug}.json?ref=${sha}`);
  assert.equal(file.encoding, "base64", "Unexpected GitHub content encoding");
  const article = JSON.parse(Buffer.from(file.content, "base64").toString("utf8"));
  assert.equal(article.slug, slug, "Article slug does not match the requested date");
  const runs = await get(`${api}/actions/workflows/pages.yml/runs?branch=main&event=push&head_sha=${sha}&per_page=100`);
  const run = runs.workflow_runs.find((entry) => entry.head_sha === sha && entry.head_branch === "main" && entry.event === "push" && entry.status === "completed" && entry.conclusion === "success");
  assert.ok(run, "No successful Pages push run for this exact main commit; saved or pending is not published");
  assert.ok(Number.isSafeInteger(run.id), "Invalid workflow run ID");
  const jobs = await get(`${api}/actions/runs/${run.id}/jobs?filter=latest&per_page=100`);
  for (const name of ["build", "deploy"]) {
    assert.ok(jobs.jobs.some((job) => job.name === name && job.status === "completed" && job.conclusion === "success"), `${name} has not succeeded for the expected commit`);
  }
  const cacheKey = `verify=${sha}`;
  const [homepage, articleHtml] = await Promise.all([
    get(`${site}?${cacheKey}`, false),
    get(`${site}articles/${slug}/?${cacheKey}`, false),
  ]);
  verifyRenderedArticle(article, homepage, articleHtml, { requireHomepagePlacement });
  const after = await get(mainUrl);
  assert.equal(after.commit.sha, sha, "Main changed during verification; verify the new head before reporting completion");
  return { status: "published", date, commit: sha, workflow: `https://github.com/${repository}/actions/runs/${run.id}`, article: `${site}articles/${slug}/` };
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  try {
    console.log(JSON.stringify(await verifyPublication({ date: process.argv[2], sha: process.argv[3], requireHomepagePlacement: process.argv[4] !== "--article-only" }), null, 2));
  } catch (error) {
    console.error(`Publication is NOT verified: ${error.message}`);
    process.exitCode = 1;
  }
}
