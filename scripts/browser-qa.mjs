import assert from "node:assert/strict";
import { createServer } from "node:http";
import { readFile, stat, mkdir, writeFile } from "node:fs/promises";
import { resolve, extname, sep } from "node:path";
import { chromium } from "playwright";
import AxeBuilder from "@axe-core/playwright";
import ts from "typescript";

const calendarModule = { exports: {} };
const calendarSource = await readFile("app/market-calendar-data.ts", "utf8");
const calendarCode = ts.transpileModule(calendarSource, { compilerOptions: { module: ts.ModuleKind.CommonJS } }).outputText;
new Function("module", "exports", calendarCode)(calendarModule, calendarModule.exports);
const calendarEvents = calendarModule.exports.marketCalendarEvents;

const out = resolve("out");
const artifacts = resolve("artifacts/browser-qa");
await mkdir(artifacts, { recursive: true });
const types = { ".html": "text/html", ".js": "text/javascript", ".css": "text/css", ".json": "application/json", ".woff2": "font/woff2", ".webp": "image/webp", ".png": "image/png", ".svg": "image/svg+xml" };
const server = createServer(async (request, response) => {
  try {
    const pathname = decodeURIComponent(new URL(request.url, "http://localhost").pathname);
    if (!pathname.startsWith("/market-note/")) { response.writeHead(404).end(); return; }
    let file = resolve(out, pathname.slice("/market-note/".length) || "index.html");
    if (file !== out && !file.startsWith(out + sep)) { response.writeHead(403).end(); return; }
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
  const routes = { nov01_0: "articles/company-nakanishi-2026-11-01/", nov01_1: "articles/company-verisk-2026-11-01/", nov01_2: "articles/company-loreal-2026-11-01/", nov01_3: "articles/theme-uk-mortgage-reset-arrears-2026-11-01/", nov01_4: "articles/theme-power-acquisition-supply-2026-11-01/", oct31_0: "articles/company-shimano-2026-10-31/", oct31_1: "articles/company-copart-2026-10-31/", oct31_2: "articles/company-halma-2026-10-31/", oct31_3: "articles/theme-us-health-premiums-wages-2026-10-31/", oct31_4: "articles/theme-battery-supply-owner-returns-2026-10-31/", oct30_0: "articles/company-makita-2026-10-30/", oct30_1: "articles/company-republic-services-2026-10-30/", oct30_2: "articles/company-gea-2026-10-30/", oct30_3: "articles/theme-amazon-investment-self-funding-2026-10-30/", oct30_4: "articles/theme-boj-etf-sales-price-impact-2026-10-30/", oct29_0: "articles/company-toto-2026-10-29/", oct29_1: "articles/company-otis-2026-10-29/", oct29_2: "articles/company-experian-2026-10-29/", oct29_3: "articles/theme-alphabet-cloud-cash-2026-10-29/", oct29_4: "articles/theme-fed-hold-dissent-2026-10-29/", oct28_0: "articles/company-hoshizaki-2026-10-28/", oct28_1: "articles/company-ecolab-2026-10-28/", oct28_2: "articles/company-wolters-kluwer-2026-10-28/", oct28_3: "articles/theme-nitto-buyback-eps-2026-10-28/", oct28_4: "articles/theme-corning-contracts-cash-2026-10-28/", oct27_0: "articles/company-nitori-2026-10-27/", oct27_1: "articles/company-waters-2026-10-27/", oct27_2: "articles/company-assa-abloy-2026-10-27/", oct27_3: "articles/theme-meta-funding-cash-timing-2026-10-27/", oct27_4: "articles/theme-japan-corporate-rate-timing-2026-10-27/", oct25_0: "articles/company-disco-2026-10-25/", oct25_1: "articles/company-sonova-2026-10-25/", oct25_2: "articles/company-jack-henry-2026-10-25/", oct25_3: "articles/theme-gold-etf-flows-price-2026-10-25/", oct25_4: "articles/theme-us-deficit-bond-yields-2026-10-25/", oct24_0: "articles/company-obic-2026-10-24/", oct24_1: "articles/company-riken-keiki-2026-10-24/", oct24_2: "articles/company-church-dwight-2026-10-24/", oct24_3: "articles/theme-solidigm-ipo-investment-2026-10-24/", oct24_4: "articles/theme-cpi-energy-2026-10-24/", oct23_1: "articles/company-bunzl-2026-10-23/", oct23_2: "articles/company-nifco-2026-10-23/", oct23_3: "articles/company-rinnai-2026-10-23/", oct23_4: "articles/theme-bloom-revenue-cash-2026-10-23/", oct23_5: "articles/theme-meta-class-c-dilution-2026-10-23/", oct22_1: "articles/company-kikkoman-2026-10-22/", oct22_2: "articles/company-kurita-2026-10-22/", oct22_3: "articles/company-cintas-2026-10-22/", oct22_4: "articles/theme-export-value-profit-2026-10-22/", oct22_5: "articles/theme-inbound-spending-profit-2026-10-22/", oct21_1: "articles/company-nitto-2026-10-21/", oct21_2: "articles/company-smc-2026-10-21/", oct21_3: "articles/company-rollins-2026-10-21/", oct21_4: "articles/theme-profit-margin-growth-2026-10-21/", oct21_5: "articles/theme-tariff-recovery-earnings-2026-10-21/",  aug4: "articles/daily-2026-08-04/", sep5: "articles/daily-2026-09-05/", sep21: "articles/daily-2026-09-21/", sep24: "articles/daily-2026-09-24/", home: "", daily: "articles/daily-2026-10-07/", weekly: "articles/weekly-2026-09-28/", company: "articles/kioxia-per-2026-09-23/", calendar: "calendar/" };
  const retiredAiri = await context.request.get(base + "airi/");
  assert.equal(retiredAiri.status(), 404, "Retired AIRI must not be served");
  report.interactions.push("Retired AIRI URL returns 404");
  for (const width of [360, 390, 768, 1440]) {
    await page.setViewportSize({ width, height: 1000 });
    for (const [label, route] of Object.entries(routes)) {
      const response = await page.goto(base + route, { waitUntil: "networkidle" });
      assert.equal(response?.status(), 200, `Active route must be served: ${route}`);
      assert.equal(await page.locator('a[href*="/airi"]').count(), 0, `Retired AIRI link: ${route}`);
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
  assert.equal(await page.locator('#mobile-menu a[href*="/airi"]').count(), 0);
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
  assert.equal(await page.locator(".article-row").count(), 47);
  assert.equal(await page.locator(".article-row:visible").count(), 10);
  await page.getByRole("button", { name: "次のページ", exact: true }).click();
  assert.equal(await page.locator(".article-row").count(), 47);
  assert.equal(await page.locator(".article-row:visible").count(), 10);
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
  await page.goto(base + routes.company, { waitUntil: "networkidle" });
  const tableRegion = page.locator(".table-scroll").first();
  assert.equal(await tableRegion.getAttribute("tabindex"), "0");
  assert.equal(await tableRegion.getAttribute("role"), "region");
  await tableRegion.focus();
  await tableRegion.press("ArrowRight");
  await page.waitForFunction(() => (document.activeElement?.scrollLeft ?? 0) > 0, null, { timeout: 2000 });
  assert.ok(await tableRegion.evaluate(element => element.scrollLeft) > 0, "Wide report tables must scroll with keyboard arrows");
  report.interactions.push("Legacy report table focus and keyboard horizontal scrolling");
  await page.clock.setFixedTime(new Date("2026-12-01T10:00:00Z"));
  await page.goto(base, { waitUntil: "networkidle" });
  const decemberUpcoming = calendarEvents.filter(e => e.date >= "2026-12-01").sort((a, b) => (a.date + " " + a.time).localeCompare(b.date + " " + b.time)).slice(0, 4);
  assert.ok(decemberUpcoming.length > 0, "December additions must be present");
  assert.deepEqual(await page.locator(".upcoming-list h4").allTextContents(), decemberUpcoming.map(e => e.title));
  await page.goto(base + routes.calendar, { waitUntil: "networkidle" });
  assert.equal(await page.locator(".month-heading h2").textContent(), "2026年12月");
  for (const month of ["2026-10", "2026-11", "2026-12"]) {
    await page.getByRole("button", { name: "2026年" + Number(month.slice(5)) + "月", exact: true }).click();
    const expected = calendarEvents.filter(e => e.date.startsWith(month)).sort((a, b) => (a.date + " " + a.time).localeCompare(b.date + " " + b.time, "ja"));
    assert.deepEqual(await page.locator(".event-row h3").allTextContents(), expected.map(e => e.title));
    assert.deepEqual(await page.locator(".event-row .source-link").evaluateAll(elements => elements.map(e => e.getAttribute("href"))), expected.map(e => e.sourceUrl));
    assert.deepEqual(await page.locator(".event-row .event-date > span").allTextContents(), expected.map(e => ["日", "月", "火", "水", "木", "金", "土"][new Date(e.date + "T00:00:00Z").getUTCDay()]));
    assert.equal(await page.evaluate(() => document.documentElement.scrollWidth > innerWidth), false, month + " mobile overflow");
    await page.screenshot({ path: artifacts + "/calendar-updated-" + month + "-390.png", fullPage: true });
  }
  await page.getByRole("button", { name: "2026年11月", exact: true }).click();
  await page.getByLabel(/^分類/).selectOption("短縮取引");
  assert.equal(await page.locator(".event-row").count(), 1);
  assert.match(await page.locator(".event-row").textContent(), /日本時間11月28日03:00/);
  const afterLast = new Date(calendarEvents.map(e => e.date).sort().at(-1) + "T12:00:00+09:00");
  afterLast.setUTCDate(afterLast.getUTCDate() + 1);
  await page.clock.setFixedTime(afterLast);
  await page.goto(base, { waitUntil: "networkidle" });
  assert.match(await page.locator(".schedule-empty").textContent(), /登録済みの今後の予定はありません/);
  report.interactions.push("Mobile menu open, Escape, focus restoration, navigation and body unlock", "Archive kind/year/month filters and pagination", "October and December upcoming dates, all updated calendar rows, weekdays, source links, short trading and empty state after the last event", "Article TOC, 17px body text and reduced-motion setting");
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