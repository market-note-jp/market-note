import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';

// Load the browser ESM directly, with no dependency on a package.json module type.
const source = await readFile(new URL('../lib/market-breadth/engine.mjs', import.meta.url), 'utf8');
const { parseCSV, analyzePrices, scaleIndex } = await import(`data:text/javascript;base64,${Buffer.from(source).toString('base64')}`);

const near = (actual, expected, tolerance = 1e-10) => assert.ok(Math.abs(actual - expected) < tolerance, `${actual} ≈ ${expected}`);
const row = (date, code, adjusted_close, name = code) => ({ date, code, adjusted_close, name });

test('CSV parses BOM, CRLF, comma, escaped quote and embedded newline', () => {
  const rows = parseCSV('\uFEFFdate,code,name,adjusted_close\r\n2026-10-01,130A,"A, B ""社""",100\r\n2026-10-02,130A,"二行\r\nの社名",110\r\n');
  assert.equal(rows.length, 2);
  assert.equal(rows[0].name, 'A, B "社"');
  assert.equal(rows[1].name, '二行\r\nの社名');
});

test('CSV rejects unmatched quotes, duplicate headers and inconsistent columns', () => {
  assert.throws(() => parseCSV('date,code\n"2026-10-01,7203'), /閉じられて/);
  assert.throws(() => parseCSV('date,date\na,b'), /列名が重複/);
  assert.throws(() => parseCSV('date,code\n2026-10-01,7203,100'), /列数/);
});

test('known daily returns, breadth including unchanged and sorted normalized dates', () => {
  const analysis = analyzePrices([
    row('2026/10/2', 'A', 110), row('2026/10/1', 'A', 100),
    row('2026-10-01', 'B', 100), row('2026-10-02', 'B', 90),
    row('2026-10-01', 'C', 100), row('2026-10-02', 'C', 100)
  ]);
  assert.equal(analysis.count, 3);
  assert.equal(analysis.complete, false);
  assert.equal(analysis.series[0].date, '2026-10-01');
  assert.equal(analysis.series[0].return, null);
  assert.equal(analysis.series[0].median, null);
  assert.equal(analysis.series[0].advanceRatio, null);
  const last = analysis.series[1];
  near(last.return, 0);
  near(last.ew, 100);
  near(last.median, 0);
  near(last.advanceRatio, 100 / 3);
  assert.deepEqual([last.advancers, last.decliners, last.unchanged], [1, 1, 1]);
});

test('index compounds daily equal-weight means, rather than adding cumulative returns', () => {
  const analysis = analyzePrices([
    row('2026-10-01', 'A', 100), row('2026-10-01', 'B', 100),
    row('2026-10-02', 'A', 110), row('2026-10-02', 'B', 110),
    row('2026-10-05', 'A', 121), row('2026-10-05', 'B', 121)
  ]);
  near(analysis.series[2].ew, 121);
});

test('daily rebalancing differs from a fixed-share buy-and-hold portfolio', () => {
  const analysis = analyzePrices([
    row('2026-10-01', 'A', 100), row('2026-10-01', 'B', 100),
    row('2026-10-02', 'A', 110), row('2026-10-02', 'B', 90),
    row('2026-10-05', 'A', 99), row('2026-10-05', 'B', 99)
  ]);
  near(analysis.series[2].ew, 100);
  assert.notEqual(analysis.series[2].ew, 99);
});

test('median uses the two central observations for an even universe', () => {
  const analysis = analyzePrices([
    row('2026-10-01', 'A', 100), row('2026-10-01', 'B', 100),
    row('2026-10-02', 'A', 110), row('2026-10-02', 'B', 104)
  ]);
  near(analysis.series[1].median, 0.07);
});

test('rejects incomplete panels instead of skipping missing prices or changing membership', () => {
  assert.throws(() => analyzePrices([
    row('2026-10-01', 'A', 100), row('2026-10-01', 'B', 100),
    row('2026-10-02', 'A', 101)
  ]), /2026-10-02.*不足：B/);
  assert.throws(() => analyzePrices([
    row('2026-10-01', 'A', 100), row('2026-10-02', 'B', 100)
  ]), /銘柄入れ替え/);
});

test('rejects duplicates after date normalization, impossible dates and nonpositive prices', () => {
  assert.throws(() => analyzePrices([row('2026/10/1', 'A', 100), row('2026-10-01', 'A', 100)]), /重複/);
  assert.throws(() => analyzePrices([row('2026-02-30', 'A', 100)]), /実在しません/);
  for (const price of [0, -1, '', null, 'abc', Infinity]) {
    assert.throws(() => analyzePrices([row('2026-10-01', 'A', price)]), /0より大きい/);
  }
});

test('25-session moving average includes today and requires a full warm-up', () => {
  const rows = [];
  for (let day = 1; day <= 25; day += 1) {
    rows.push(row(`2026-10-${String(day).padStart(2, '0')}`, 'A', 100 + day));
    rows.push(row(`2026-10-${String(day).padStart(2, '0')}`, 'B', 100));
  }
  const analysis = analyzePrices(rows);
  assert.equal(analysis.series[23].aboveMA25, null);
  assert.equal(analysis.series[23].maEligible, 0);
  assert.equal(analysis.series[24].aboveMA25, 50);
  assert.equal(analysis.series[24].maEligible, 2);
  assert.equal(analysis.stocks[0].aboveMA25, true);
  assert.equal(analysis.stocks[1].aboveMA25, false);
});

test('complete identifies 225 complete price histories', () => {
  const rows = [];
  for (let code = 1; code <= 225; code += 1) {
    rows.push(row('2026-10-01', String(code), 100));
    rows.push(row('2026-10-02', String(code), 101));
  }
  const analysis = analyzePrices(rows);
  assert.equal(analysis.complete, true);
  assert.equal(analysis.count, 225);
  near(analysis.series[1].ew, 101);
});

test('a constant decimal-priced stock is not above its moving average', () => {
  const rows = Array.from({ length: 25 }, (_, index) => row(`2026-10-${String(index + 1).padStart(2, '0')}`, 'A', 125.13));
  const analysis = analyzePrices(rows);
  assert.equal(analysis.series.at(-1).aboveMA25, 0);
  assert.equal(analysis.stocks[0].aboveMA25, false);
});

test('split-adjusted prices do not invent a loss and raw prices are rejected', () => {
  const analysis = analyzePrices([row('2026-10-01', 'A', 500), row('2026-10-02', 'A', 500)]);
  near(analysis.series[1].return, 0);
  assert.throws(() => analyzePrices([row('2026-10-01', 'A', 100)], { adjustment: 'raw' }), /未調整/);
  assert.throws(() => analyzePrices([row('2026-10-01', 'A', 100)], { universe: 'historical' }), /固定構成/);
});

test('independent index keeps a fixed base and compounds without a benchmark reset', () => {
  const analysis = analyzePrices([
    row('2026-10-01', 'A', 100), row('2026-10-02', 'A', 110), row('2026-10-05', 'A', 121)
  ]);
  const scaled = scaleIndex(analysis.series, 10000);
  assert.equal(scaled.baseDate, '2026-10-01');
  assert.equal(scaled.baseValue, 10000);
  near(scaled.series[0].level, 10000);
  near(scaled.series[1].level, 11000);
  near(scaled.series[2].level, 12100);
  near(scaled.series[2].pointChange, 1100);
  // Cropping a chart uses the existing levels; it must not reset the latest level.
  near(scaled.series.slice(-1)[0].level, 12100);
  assert.equal(scaled.series[0].pointChange, null);
  assert.equal(analysis.series[0].level, undefined);
});

test('independent index rejects invalid scales and index observations', () => {
  const series = [{ date: '2026-10-22', ew: 100 }];
  for (const base of [0, -1, NaN, Infinity, '100']) assert.throws(() => scaleIndex(series, base), /基準値/);
  assert.throws(() => scaleIndex([]), /履歴/);
  assert.throws(() => scaleIndex([{ date: '2026-10-22', ew: 0 }]), /初期値/);
  assert.throws(() => scaleIndex([...series, { date: '2026-10-23', ew: NaN }]), /指数値/);
});
