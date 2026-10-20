import assert from 'node:assert/strict';
import { createServer } from 'node:http';
import { readFile, stat, mkdir, writeFile } from 'node:fs/promises';
import { resolve, extname, sep } from 'node:path';
import { chromium } from 'playwright';
import AxeBuilder from '@axe-core/playwright';
import { filterNews, publicationDay, sourceHealth } from '../lib/news-search.mjs';

const root = process.cwd();
const out = resolve(root, 'out');
const artifacts = resolve(root, 'artifacts/browser-qa/news');
await mkdir(artifacts, { recursive: true });
const json = async path => JSON.parse(await readFile(resolve(root, path), 'utf8'));
const feed = await json('data/news/feed.json');
const analysis = await json('data/news/analysis.json');
const registry = await json('data/news/sources.json');
const companies = await json('data/news/companies.json');
const articles = [...feed.articles, ...analysis];
const sources = registry.map(source => ({ ...source, status: source.kind === 'analysis' ? 'local' : 'uninitialized', lastSuccessAt: null, error: null, ...feed.sources.find(state => state.id === source.id) }));
const snapshotTime = Date.parse(feed.generatedAt);
assert.ok(Number.isFinite(snapshotTime), 'The snapshot must have its real generation time');
const currentTime = snapshotTime + 60 * 60 * 1000;
const types = { '.html': 'text/html', '.js': 'text/javascript', '.css': 'text/css', '.json': 'application/json', '.woff2': 'font/woff2', '.webp': 'image/webp', '.png': 'image/png', '.svg': 'image/svg+xml' };
const server = createServer(async (request, response) => {
  try {
    const pathname = decodeURIComponent(new URL(request.url, 'http://localhost').pathname);
    if (!pathname.startsWith('/market-note/')) { response.writeHead(404).end(); return; }
    let file = resolve(out, pathname.slice('/market-note/'.length) || 'index.html');
    if (file !== out && !file.startsWith(`${out}${sep}`)) { response.writeHead(403).end(); return; }
    if ((await stat(file)).isDirectory()) file += '/index.html';
    response.writeHead(200, { 'Content-Type': types[extname(file)] || 'application/octet-stream' }).end(await readFile(file));
  } catch { response.writeHead(404).end(); }
});
await new Promise(resolve => server.listen(0, '127.0.0.1', resolve));
const origin = `http://127.0.0.1:${server.address().port}`;
const base = `${origin}/market-note/`;
const report = { checked: [], interactions: [], accessibility: [], errors: [], blockedRemoteRequests: [], backendRequests: [] };
let browser;
try {
  browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({ locale: 'ja-JP', timezoneId: 'Asia/Tokyo', reducedMotion: 'reduce', deviceScaleFactor: 1 });
  // QA never calls financial backends or any other remote website.
  await context.route('**/*', route => {
    const request = route.request();
    if (request.method() === 'POST' || request.url().includes('kanalyzer-analysis-api')) {
      report.backendRequests.push(request.url());
      return route.abort();
    }
    if (new URL(request.url()).origin !== origin) {
      report.blockedRemoteRequests.push(request.url());
      return route.abort();
    }
    return route.continue();
  });
  const page = await context.newPage();
  await page.clock.install({ time: new Date(currentTime) });
  page.on('pageerror', error => report.errors.push(error.message));
  for (const width of [320, 390, 768, 1081, 1240, 1440]) {
    await page.setViewportSize({ width, height: 1000 });
    for (const route of ['news/', 'companies/', 'companies/285A/']) {
      await page.goto(base + route, { waitUntil: 'networkidle' });
      const overflow = await page.evaluate(() => document.documentElement.scrollWidth > innerWidth);
      const overflowing = await page.evaluate(() => Array.from(document.querySelectorAll('body *')).filter(element => {
        const bounds = element.getBoundingClientRect();
        return bounds.width > 0 && (bounds.right > innerWidth + 1 || bounds.left < -1) && getComputedStyle(element).position !== 'fixed';
      }).map(element => ({ tag: element.tagName, class: element.className })).slice(0, 10));
      report.checked.push({ width, route, overflow, overflowing });
      assert.equal(overflow, false, `${route} horizontal overflow at ${width}px`);
      if ([390, 1440].includes(width)) {
        const label = route.replaceAll('/', '-');
        await page.screenshot({ path: `${artifacts}/${label}${width}.png`, fullPage: true });
        await page.screenshot({ path: `${artifacts}/${label}${width}-viewport.png` });
        const axe = await new AxeBuilder({ page }).withTags(['wcag2a', 'wcag2aa', 'wcag21aa']).analyze();
        report.accessibility.push({ width, route, violations: axe.violations.map(violation => ({
          id: violation.id, impact: violation.impact,
          nodes: violation.nodes.map(node => ({ target: node.target, summary: node.failureSummary })),
        })) });
      }
    }
  }

  await page.setViewportSize({ width: 1440, height: 1000 });
  await page.goto(base + 'news/', { waitUntil: 'networkidle' });
  assert.equal(await page.locator('.news-article-card').count(), Math.min(20, articles.length));
  // An ingestion failure is a legitimate state to publish, not a QA failure.
  async function assertSourceHealth(now) {
    const expected = sources.map(source => sourceHealth(source, now).state).sort();
    const actual = await page.locator('.news-health').evaluateAll(elements => elements.map(element => [...element.classList].find(name => name.startsWith('news-health-')).replace('news-health-', '')).sort());
    assert.deepEqual(actual, expected, 'Source health must reflect stored failures and current clock');
  }
  await assertSourceHealth(currentTime);
  const search = async query => {
    await page.locator('#news-query').fill(query);
    await page.getByRole('button', { name: '検索', exact: true }).click();
  };
  const reset = () => page.getByRole('button', { name: '条件をリセット', exact: true }).click();
  await search('6954');
  assert.ok(await page.locator('.news-article-card').count() > 0);
  assert.equal(new URL(page.url()).searchParams.get('q'), '6954');
  assert.ok((await page.locator('.news-article-card').allTextContents()).every(text => text.includes('ファナック')));
  await search('285A');
  assert.ok(await page.locator('.news-article-card').count() > 0);
  assert.ok((await page.locator('.news-article-card').allTextContents()).every(text => text.includes('キオクシア')));
  await page.goBack();
  await page.waitForFunction(() => document.querySelector('#news-query').value === '6954');
  await page.goForward();
  await page.waitForFunction(() => document.querySelector('#news-query').value === '285A');
  await search('FANUC');
  assert.ok(await page.locator('.news-article-card').count() > 0);
  report.interactions.push('Company code/name/alias search and browser Back/Forward restore URL and query');

  await reset();
  await page.locator('#news-query').fill('Unsubmitted draft');
  await reset();
  assert.equal(await page.locator('#news-query').inputValue(), '', 'Reset also clears an unsubmitted draft');
  await page.getByLabel('発行元', { exact: true }).selectOption('frb-monetary');
  const expectedSourceCount = filterNews(articles, companies, { source: 'frb-monetary' }).length;
  assert.equal(await page.locator('.news-article-card').count(), Math.min(20, expectedSourceCount));
  assert.ok((await page.locator('.news-publisher').allTextContents()).every(text => text === 'FRB・金融政策'));
  await reset();
  await page.locator('.news-topic-row').getByRole('button', { name: '半導体', exact: true }).click();
  assert.ok(await page.locator('.news-article-card').count() > 0);
  assert.equal(new URL(page.url()).searchParams.get('topic'), '半導体');
  await reset();
  const knownDay = publicationDay(filterNews(articles)[0]);
  const nextDay = new Date(Date.parse(`${knownDay}T00:00:00Z`) + 86400000).toISOString().slice(0, 10);
  await page.getByLabel('開始日', { exact: true }).fill(nextDay);
  await page.getByLabel('終了日', { exact: true }).fill(knownDay);
  assert.match(await page.locator('.news-date-error').textContent(), /開始日は終了日以前/);
  await page.getByLabel('開始日', { exact: true }).fill(knownDay);
  assert.ok(await page.locator('.news-card-bottom time').count() > 0);
  assert.ok((await page.locator('.news-card-bottom time').allTextContents()).every(text => text.includes(knownDay.replaceAll('-', '.'))));
  await reset();
  await page.getByLabel('情報の種類', { exact: true }).selectOption('media');
  assert.match(await page.locator('.news-empty').textContent(), /現在収録していません/);
  report.interactions.push('Reset, source/topic/date/type filters, invalid dates and explicit press-outlet coverage gap');

  await reset();
  await search('zzzz-no-results');
  assert.match(await page.locator('.news-empty').textContent(), /一致する結果がありません/);
  await page.getByRole('button', { name: 'すべての収録情報を見る', exact: true }).click();
  await page.getByRole('button', { name: '出来事で比較', exact: true }).click();
  assert.match(await page.locator('.news-empty').textContent(), /比較できる出来事はまだありません/);
  await page.getByRole('button', { name: '記事一覧を見る', exact: true }).click();
  report.interactions.push('No-result coverage caveat and honest empty event-comparison state');

  const staleTime = currentTime + 48 * 3600000;
  await page.clock.setFixedTime(new Date(staleTime));
  await page.reload({ waitUntil: 'networkidle' });
  await assertSourceHealth(staleTime);
  assert.ok(await page.locator('.news-health-stale, .news-health-error, .news-health-unknown').count() > 0);
  assert.match(await page.locator('.news-warning').first().textContent(), /取得状況に注意/);
  assert.equal(await page.locator('.news-article-card').count(), Math.min(20, articles.length));
  await page.locator('#news-sources').screenshot({ path: `${artifacts}/source-status-stale-1440.png` });
  report.interactions.push('Advancing browser clock by 48 hours flags delays/failures and preserves cached articles');

  await page.goto(base + 'companies/285A/', { waitUntil: 'networkidle' });
  await page.getByRole('link', { name: 'この企業を財務分析', exact: true }).click();
  await page.waitForFunction(() => Array.from(document.querySelectorAll('input')).some(input => input.value === 'キオクシアホールディングス'));
  assert.equal(new URL(page.url()).searchParams.get('company'), 'キオクシアホールディングス');
  assert.deepEqual(report.backendRequests, [], 'Opening the prefilled form must never start analysis');
  report.interactions.push('Company → financial analysis prefills the company name without backend execution');

  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto(base + 'news/', { waitUntil: 'networkidle' });
  await page.getByRole('button', { name: 'メニューを開く', exact: true }).click();
  assert.equal(await page.locator('#mobile-menu').isVisible(), true);
  await page.keyboard.press('Escape');
  assert.equal(await page.locator('#mobile-menu').isHidden(), true);
  assert.equal(await page.getByRole('button', { name: 'メニューを開く', exact: true }).evaluate(element => element === document.activeElement), true);
  await page.getByRole('button', { name: 'メニューを開く', exact: true }).click();
  await page.getByRole('navigation', { name: 'モバイルナビゲーション', exact: true }).getByRole('link', { name: /ニュース探索/ }).click();
  assert.equal(await page.evaluate(() => document.body.style.overflow), '');
  report.interactions.push('Mobile discovery navigation, body-scroll restoration and Escape focus restoration');

  assert.deepEqual(report.errors, [], 'Browser runtime errors');
  assert.deepEqual(report.backendRequests, [], 'Financial backend or other POST calls');
  const serious = report.accessibility.flatMap(check => check.violations.filter(violation => ['serious', 'critical'].includes(violation.impact)).map(violation => ({ ...violation, width: check.width, route: check.route })));
  assert.deepEqual(serious, [], 'Serious accessibility violations; inspect the JSON artifact');
  console.log(`News browser QA passed ${report.checked.length} responsive pages and ${report.interactions.length} interaction groups.`);
} catch (error) {
  report.failure = String(error.stack || error);
  console.error(report.failure);
  process.exitCode = 1;
} finally {
  await writeFile(`${artifacts}/qa-results.json`, JSON.stringify(report, null, 2));
  await browser?.close();
  await new Promise(resolve => server.close(resolve));
}
