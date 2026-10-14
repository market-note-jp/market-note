import assert from 'node:assert/strict';
import test from 'node:test';
import { EMPTY_FILTERS, dateFilterError, filterNews, formatNewsDate, isDate, normalizeSearch, publicationDay, readSearchFilters, sourceHealth, verifiedEvents, writeSearchFilters } from '../lib/news-search.mjs';

const companies = [
  { code: '6954', name: 'ファナック', aliases: ['FANUC'], analysisQuery: 'ファナック' },
  { code: '285A', name: 'キオクシアホールディングス', aliases: ['キオクシア', 'Kioxia'], analysisQuery: 'キオクシア' },
];
function article(overrides) {
  return { id: 'a', title: '設備投資の見通し', type: 'analysis', sourceId: 'market-note', sourceName: 'Market Note', topics: ['決算・業績'], companyCodes: ['6954'], publishedAt: '2026-10-14T06:00:00+09:00', updatedAt: null, fetchedAt: null, url: '/articles/test-fixture', datePrecision: 'datetime', ...overrides };
}
const articles = [
  article({ id: 'fanuc' }),
  article({ id: 'memory', title: '半導体需要と投資', companyCodes: ['285A'], topics: ['半導体'], publishedAt: '2026-10-13', datePrecision: 'date' }),
  article({ id: 'fed', title: 'Monetary policy release', type: 'official', sourceId: 'frb-monetary', sourceName: 'FRB・金融政策', topics: ['金融政策'], companyCodes: [], publishedAt: '2026-10-13T20:00:00Z', fetchedAt: '2026-10-15T10:00:00Z' }),
  article({ id: 'undated', title: '日付未確認の資料', type: 'official', sourceId: 'test-official', sourceName: 'テスト公的機関', companyCodes: [], publishedAt: null, updatedAt: '2026-10-14T10:00:00Z', fetchedAt: '2026-10-14T12:00:00Z' }),
];
const ids = options => filterNews(articles, companies, options).map(item => item.id);

test('company names, ticker codes and aliases search the linked company metadata', () => {
  for (const query of ['ファナック', 'ふぁなっく', 'FANUC', 'ｆａｎｕｃ', '６９５４']) assert.deepEqual(ids({ q: query }), ['fanuc']);
  for (const query of ['285a', 'キオクシア', 'Kioxia']) assert.deepEqual(ids({ q: query }), ['memory']);
  assert.equal(normalizeSearch(' ＡＢＦ　あいう '), 'abf アイウ');
});

test('keywords are AND-combined across headline, source, permitted excerpt and topics', () => {
  assert.deepEqual(ids({ q: '半導体 Kioxia' }), ['memory']);
  assert.deepEqual(ids({ q: 'FRB 金融政策' }), ['fed']);
  assert.deepEqual(ids({ q: 'FANUC 半導体' }), []);
  assert.deepEqual(ids({ q: '設備投資', type: 'analysis', source: 'market-note', topic: '決算・業績' }), ['fanuc']);
  assert.deepEqual(ids({ source: 'frb-monetary', type: 'analysis' }), []);
  assert.deepEqual(ids({ type: 'media' }), []);
});

test('publication filters use JST for timestamps and retain date-only source days', () => {
  assert.equal(publicationDay(articles[2]), '2026-10-14');
  assert.equal(publicationDay(articles[1]), '2026-10-13');
  assert.deepEqual(ids({ from: '2026-10-14', to: '2026-10-14' }), ['fanuc', 'fed']);
  assert.deepEqual(ids({ from: '2026-10-13', to: '2026-10-13' }), ['memory']);
  assert.deepEqual(ids({ from: '2026-10-15' }), []);
  assert.equal(publicationDay(articles[3]), '');
  assert.equal(publicationDay(article({ publishedAt: 'invalid' })), '');
});

test('date-only values display no synthetic time; unknown dates do not use fetch/update time', () => {
  assert.equal(formatNewsDate('2026-10-13', 'date'), '2026.10.13（時刻記載なし）');
  assert.equal(formatNewsDate('2026-10-13T20:00:00Z'), '2026.10.14 05:00 JST');
  assert.equal(formatNewsDate(null), '公表日不明');
  assert.equal(formatNewsDate('invalid'), '公表日不明');
  assert.equal(formatNewsDate('2026-02-30', 'date'), '公表日不明');
  assert.equal(isDate('2024-02-29'), true);
  assert.equal(isDate('2026-02-29'), false);
});

test('mixed timestamp offsets sort by instant, not lexical timestamp', () => {
  const mixed = [article({ id: 'earlier', publishedAt: '2026-10-14T09:00:00+09:00' }), article({ id: 'later', publishedAt: '2026-10-14T02:00:00Z' }), article({ id: 'unknown', publishedAt: null })];
  assert.deepEqual(filterNews(mixed).map(item => item.id), ['later', 'earlier', 'unknown']);
  assert.deepEqual(filterNews(mixed, [], { sort: 'old' }).map(item => item.id), ['earlier', 'later', 'unknown']);
});

test('same-day date-only records have stable order without implying an exact time', () => {
  const mixed = [article({ id: 'date-b', publishedAt: '2026-10-14', datePrecision: 'date' }), article({ id: 'late', publishedAt: '2026-10-14T08:00:00Z' }), article({ id: 'date-a', publishedAt: '2026-10-14', datePrecision: 'date' }), article({ id: 'early', publishedAt: '2026-10-14T00:00:00Z' })];
  assert.deepEqual(filterNews(mixed).map(item => item.id), ['late', 'early', 'date-a', 'date-b']);
  assert.deepEqual(filterNews(mixed, [], { sort: 'old' }).map(item => item.id), ['early', 'late', 'date-a', 'date-b']);
});

test('invalid or reversed date ranges return a clear validation error', () => {
  assert.ok(dateFilterError({ from: '2026-10-15', to: '2026-10-14' }));
  assert.ok(dateFilterError({ from: '2026-99-01' }));
  assert.equal(dateFilterError({ from: '2026-10-14', to: '2026-10-14' }), '');
  assert.deepEqual(ids({ from: '2026-10-15', to: '2026-10-14' }), []);
});

test('query state round trips for shareable URLs and back/forward navigation', () => {
  const filters = { ...EMPTY_FILTERS, q: '味の素 ABF', topic: '半導体', source: 'market-note', type: 'analysis', from: '2026-01-01', to: '2026-10-14', sort: 'old', view: 'events', page: 3 };
  assert.deepEqual(readSearchFilters(writeSearchFilters(filters)), filters);
  assert.equal(writeSearchFilters(EMPTY_FILTERS), '');
  assert.deepEqual(readSearchFilters('?page=-2&type=garbage&view=bad&sort=bad'), EMPTY_FILTERS);
  assert.equal(readSearchFilters('?q=a%26b%3Cscript%3E').q, 'a&b<script>');
});

const source = { id: 'official', kind: 'official', enabled: true, pollHours: 6, status: 'ok', lastSuccessAt: '2026-10-14T00:00:00Z', error: null };
test('source health becomes stale against the current browser clock after two intervals plus tolerance', () => {
  assert.equal(sourceHealth(source, Date.parse('2026-10-14T12:59:59Z')).state, 'ok');
  assert.equal(sourceHealth(source, Date.parse('2026-10-14T13:00:01Z')).state, 'stale');
  assert.equal(sourceHealth(source, null).state, 'checking');
  assert.equal(sourceHealth({ ...source, lastSuccessAt: null }, Date.now()).state, 'unknown');
  assert.equal(sourceHealth(source, Date.parse('2026-10-13T00:00:00Z')).state, 'unknown');
});

test('retrieval failure is never reported as an empty feed or fresh success', () => {
  const failed = sourceHealth({ ...source, status: 'error', error: 'network timeout', itemCount: 12 }, Date.parse('2026-10-14T00:01:00Z'));
  assert.equal(failed.state, 'error');
  assert.match(failed.label, /保存分/);
  assert.equal(sourceHealth({ ...source, kind: 'analysis', status: 'local', pollHours: 0 }, Date.now()).state, 'local');
  assert.equal(sourceHealth({ ...source, enabled: false }, Date.now()).state, 'disabled');
});

test('only explicit, fully resolved editorial events can appear for comparison', () => {
  const event = { id: 'matched', title: '編集確認済みテスト', companyCodes: ['6954'], publishedAt: null, grouping: 'editorial', articleIds: ['fanuc', 'fed'] };
  assert.deepEqual(verifiedEvents([], articles), []);
  assert.equal(verifiedEvents([event], articles)[0].articles.length, 2);
  assert.deepEqual(verifiedEvents([{ ...event, grouping: 'automatic' }], articles), []);
  assert.deepEqual(verifiedEvents([{ ...event, articleIds: ['fanuc', 'missing'] }], articles), []);
  assert.deepEqual(verifiedEvents([{ ...event, articleIds: ['fanuc', 'fanuc'] }], articles), []);
});
