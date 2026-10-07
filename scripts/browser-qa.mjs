import assert from "node:assert/strict";
import { createServer } from "node:http";
import { readFile, stat, mkdir, writeFile } from "node:fs/promises";
import { resolve, extname } from "node:path";
import { chromium } from "playwright";
import AxeBuilder from "@axe-core/playwright";

const out = resolve("out");
const artifacts = resolve("artifacts/browser-qa");
await mkdir(artifacts, { recursive: true });
const types = { ".html": "text/html", ".js": "text/javascript", ".css": "text/css", ".json": "application/json", ".woff2": "font/woff2", ".webp": "image/webp", ".png": "image/png", ".svg": "image/svg+xml" };
const server = createServer(async (request, response) => {
  try {
    const pathname = decodeURIComponent(new URL(request.url, "http://localhost").pathname);
    if (!pathname.startsWith("/market-note/")) { response.writeHead(404).end(); return; }
    let file = resolve(out, pathname.slice("/market-note/".length) || "index.html");
    if (file !== out && !file.startsWith(out + "/")) { response.writeHead(403).end(); return; }
    if ((await stat(file)).isDirectory()) file += "/index.html";
    response.writeHead(200, { "Content-Type": types[extname(file)] || "application/octet-stream" }).end(await readFile(file));
  } catch { response.writeHead(404).end(); }
});
await new Promise(resolve => server.listen(0, "127.0.0.1", resolve));
const base = `http://127.0.0.1:${server.address().port}/market-note/`;
let browser;
const report = { checked: [], interactions: [], accessibility: [], errors: [] };
try {
  browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({ locale: "ja-JP", timezoneId: "Asia/Tokyo", reducedMotion: "reduce", deviceScaleFactor: 1 });
  const page = await context.newPage();
  await page.clock.install({ time: new Date("2026-10-07T11:00:00Z") });
  page.on("pageerror", error => report.errors.push(error.message));
  const routes = { home: "", daily: "articles/daily-2026-10-07/", weekly: "articles/weekly-2026-09-28/", company: "articles/kioxia-per-2026-09-23/", calendar: "calendar/", airi: "airi/" };
  for (const width of [360, 390, 768, 1440]) {
    await page.setViewportSize({ width, height: 1000 });
    for (const [label, route] of Object.entries(routes)) {
      await page.goto(base + route, { waitUntil: "networkidle" });
      const overflowing = await page.evaluate(() => Array.from(document.querySelectorAll("body *")).filter(element => {
        if (element.closest(".table-wrap") || element.tagName === "SCRIPT") return false;
        const bounds = element.getBoundingClientRect();
        return bounds.width > 0 && (bounds.right > innerWidth + 1 || bounds.left < -1) && getComputedStyle(element).position !== "fixed";
      }).map(element => ({ tag: element.tagName, class: element.className })).slice(0, 10));
      const overflow = await page.evaluate(() => document.documentElement.scrollWidth > innerWidth);
      report.checked.push({ width, route, overflow, overflowing });
      await page.screenshot({ path: `${artifacts}/${label}-${width}.png`, fullPage: width === 1440 || width === 390 });
      if ([390, 1440].includes(width)) await page.screenshot({ path: `${artifacts}/${label}-${width}-viewport.png` });
      if (width <= 520) {
        const undersized = await page.locator('.brand,.menu-toggle,.tabs button,.period-filter select,.page-button,.calendar-day:enabled,.calendar-segmented button').evaluateAll(elements => elements.filter(element => { const r = element.getBoundingClientRect(); return r.width > 0 && r.height > 0 && (r.width < 43.5 || r.height < 43.5); }).map(element => ({ tag: element.tagName, class: element.className })));
        assert.deepEqual(undersized, [], `Primary mobile targets smaller than 44px: ${route}`);
      }
      assert.equal(overflow, false, `Horizontal page overflow at ${width}: ${route}`);
      const axe = await new AxeBuilder({ page }).withTags(["wcag2a", "wcag2aa", "wcag21aa"]).analyze();
      const violations = axe.violations.map(v => ({ id: v.id, impact: v.impact, description: v.description, nodes: v.nodes.map(n => ({ target: n.target, summary: n.failureSummary })) }));
      report.accessibility.push({ width, route, violations });
    }
  }
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto(base, { waitUntil: "networkidle" });
  const toggle = page.getByRole("button", { name: "メニューを開く", exact: true });
  await toggle.click();
  assert.equal(await page.locator("#mobile-menu").isVisible(), true);
  await page.screenshot({ path: `${artifacts}/mobile-menu-390.png` });
  await page.keyboard.press("Escape");
  assert.equal(await page.locator("#mobile-menu").isHidden(), true);
  assert.equal(await toggle.evaluate(element => element === document.activeElement), true);
  await toggle.click();
  await page.getByRole("navigation", { name: "モバイルナビゲーション" }).getByRole("link", { name: /市場カレンダー/ }).click();
  assert.equal(await page.locator(".month-heading h2").textContent(), "2026年10月");
  assert.equal(await page.evaluate(() => document.body.style.overflow), "");
  await page.goBack({ waitUntil: "networkidle" });
  await page.goto(base, { waitUntil: "networkidle" });
  assert.equal(await page.locator(".upcoming-list time").evaluateAll(elements => elements.every(e => e.getAttribute("datetime") >= "2026-10-07")), true);
  await page.locator(".tabs button").filter({ hasText: "企業" }).click();
  assert.equal(await page.locator(".article-row").count(), 5);
  await page.locator(".tabs button").filter({ hasText: "すべて" }).click();
  await page.getByRole("button", { name: "次のページ", exact: true }).click();
  assert.match(await page.locator(".pagination-summary").textContent(), /11–20/);
  await page.locator(".period-filter select").first().selectOption("2026");
  await page.locator(".period-filter select").last().selectOption("10");
  assert.equal(await page.locator(".article-row time").evaluateAll(elements => elements.every(e => e.textContent.startsWith("2026-10"))), true);
  await page.goto(base + routes.daily, { waitUntil: "networkidle" });
  await page.getByRole("navigation", { name: "記事の目次" }).getByRole("link", { name: /市場スナップショット/ }).click();
  assert.equal(new URL(page.url()).hash, "#section-1");
  assert.equal(await page.locator(".report-body").evaluate(element => getComputedStyle(element).fontSize), "17px");
  assert.equal(await page.evaluate(() => getComputedStyle(document.documentElement).scrollBehavior), "auto");
  await page.clock.setFixedTime(new Date("2026-12-01T10:00:00Z"));
  await page.goto(base, { waitUntil: "networkidle" });
  assert.match(await page.locator(".schedule-empty").textContent(), /登録済みの今後の予定はありません/);
  await page.goto(base + routes.calendar, { waitUntil: "networkidle" });
  assert.equal(await page.locator(".month-heading h2").textContent(), "2026年12月");
  report.interactions.push("Mobile menu open, Escape, focus restoration, navigation and body unlock", "Archive kind/year/month filters and pagination", "October upcoming dates and December empty state", "Article TOC, 17px body text and reduced-motion setting");
  assert.deepEqual(report.errors, [], "Browser runtime errors");
  const serious = report.accessibility.flatMap(check => check.violations.filter(v => ["serious", "critical"].includes(v.impact)).map(v => ({ ...v, width: check.width, route: check.route })));
  assert.deepEqual(serious, [], "Serious accessibility violations; inspect the JSON artifact");
  console.log(`Browser QA passed ${report.checked.length} responsive pages and interaction checks.`);
} catch (error) {
  report.failure = String(error.stack || error);
  console.error(report.failure);
  process.exitCode = 1;
} finally {
  await writeFile(`${artifacts}/qa-results.json`, JSON.stringify(report, null, 2));
  await browser?.close();
  await new Promise(resolve => server.close(resolve));
}
