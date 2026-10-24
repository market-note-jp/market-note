import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { scaleIndex } from '../lib/market-breadth/engine.mjs';

const data = JSON.parse(await readFile(new URL('../app/market-breadth/snapshot.json', import.meta.url), 'utf8'));
const home = () => readFile(new URL('../out/index.html', import.meta.url), 'utf8');
const page = () => readFile(new URL('../out/market-breadth/index.html', import.meta.url), 'utf8');

test('published aggregate has aligned dates, units, membership and reproducible independent points', () => {
  const m = data.metrics;
  assert.equal(data.validation.constituentSetMatch, true);
  assert.equal(data.validation.count, 225);
  assert.equal(m.advancers + m.decliners + m.unchanged, 225);
  assert.equal(m.advancerPct, m.advancers / 225 * 100);
  assert.equal(data.baseValue, m.nikkeiPreviousClose);
  assert.equal(data.official.rows.at(-1).date, data.date);
  assert.equal(data.official.rows.at(-1).close, m.nikkeiClose);
  assert.equal(data.official.rows.at(-2).date, data.baseDate);
  assert.equal(data.official.rows.at(-2).close, data.baseValue);
  const scaled = scaleIndex([{date: data.baseDate, ew: 100}, {date: data.date, ew: 100 * (1 + m.equalWeightReturnPct / 100)}], data.baseValue);
  assert.equal(scaled.series.at(-1).level.toFixed(2), '62582.22');
  assert.equal(scaled.series.at(-1).pointChange.toFixed(2), '-325.62');
  for (const row of data.official.rows) assert.equal(row.up + row.down + row.flat, 225);
  for (const source of Object.values(data.source)) assert.match(source.url, /^https:\/\//);
});

test('homepage exposes the indicator below the existing hero and links to its native route', async () => {
  const html = await home();
  assert.ok(html.indexOf('class="market-hero"') < html.indexOf('class="breadth-home content-width"'));
  assert.ok(html.includes('id="breadth-home-title"'));
  assert.ok(html.includes('href="/market-note/market-breadth/"'));
  assert.ok(html.includes('62,582.22'));
  assert.ok(html.includes('MN225・日本株指標'));
  assert.ok(!html.includes('market-note-breadth-lab-syota'));
});

test('native page is readable without another sign-in and preserves shared navigation, data dates and sources', async () => {
  const html = await page();
  assert.equal((html.match(/class="site-header"/g) ?? []).length, 1);
  assert.equal((html.match(/class="site-footer"/g) ?? []).length, 1);
  assert.ok(html.includes('<h1>Market Note 225</h1>'));
  assert.ok(html.includes('62,582.22'));
  assert.ok(html.includes('62,693.16'));
  assert.ok(html.includes('2026-10-23'));
  assert.ok(html.includes('最新履歴を確認中'));
  assert.ok(html.includes('独自指数の蓄積履歴'));
  assert.ok(html.includes('独自指数の履歴をCSV出力'));
  assert.ok(html.includes('均等加重ラボ・CSV計算'));
  assert.ok(html.includes(data.source.validation.url.replaceAll('&', '&amp;')));
  assert.ok(html.includes(data.source.prices.url));
  assert.ok(!/<iframe\b/i.test(html));
  assert.ok(!/PRIVATE WORKSPACE|syota’s|サインインが必要/.test(html));
});
