import test from "node:test";
import assert from "node:assert/strict";
import {readFile} from "node:fs/promises";
import {validateFeed, latestClosedSession, FEED_URL} from "../lib/market-breadth/feed.mjs";

const saved = JSON.parse(await readFile(new URL("../app/market-breadth/snapshot.json", import.meta.url)));
const now = new Date("2026-10-28T10:00:00Z");

test("verified saved feed is accepted without a runtime date reset", () => {
  assert.equal(validateFeed(saved, saved, now), true);
  assert.match(FEED_URL, /market-breadth-data\/base100\/latest.json$/);
});

test("equivalent bundled decimal precision is accepted while actual history edits remain rejected", () => {
  const bundled = structuredClone(saved);
  bundled.history[1].ew += 1e-14;
  bundled.history[1].median += Number.EPSILON;
  assert.equal(validateFeed(saved, bundled, now), true);
  bundled.history[1].median += 1e-5;
  assert.equal(validateFeed(saved, bundled, now), false);
});

test("corrupt values, rebasing, changed history, stale revisions and missing official rows fail closed", () => {
  const changes = [x => {x.level += 1;}, x => {x.baseValue = 62907.84;}, x => {x.official.rows.find(row => row.date === x.baseDate).close = 100;}, x => {x.baseDate = "2026-10-23";}, x => {x.history[1].return = 0.01;}, x => {x.inputSHA256 = "a".repeat(64);}, x => {x.official.rows.pop();}, x => {x.metrics.nikkeiClose = Infinity;}, x => {x.metrics.advancers = 82;}, x => {x.history[1].maEligible = 226;}, x => {x.source.prices.url = "https://example.com";}];
  for (const change of changes) {
    const candidate = structuredClone(saved); change(candidate);
    assert.equal(validateFeed(candidate, saved, now), false);
  }
  assert.equal(validateFeed(null, saved, now), false);
});

test("close cutoff, weekends, Japanese holidays and exchange year end select actual sessions", () => {
  for (const [instant, expected] of [["2026-10-26T15:29:00+09:00", "2026-10-23"], ["2026-10-26T15:30:00+09:00", "2026-10-26"], ["2026-11-03T19:00:00+09:00", "2026-11-02"], ["2027-01-04T15:29:00+09:00", "2026-12-30"], ["2026-10-25T19:00:00+09:00", "2026-10-23"]]) assert.equal(latestClosedSession(saved.calendar, new Date(instant)), expected);
  assert.equal(latestClosedSession(saved.calendar, new Date("2028-01-04T19:00:00+09:00")), null);
});

test("a new validated session extends both history and official comparison without altering the baseline", () => {
  const next = structuredClone(saved), old = next.history.at(-1);
  next.date = "2026-10-29";
  next.history.push({...old, date: next.date, ew: old.ew * 1.01, return: 0.01, median: 0.01, advancers: 225, decliners: 0, unchanged: 0, advanceRatio: 100});
  next.level *= 1.01; next.pointChange = next.level - saved.level;
  next.inputSHA256 = "b".repeat(64);
  const previousClose = saved.metrics.nikkeiClose;
  next.metrics = {...saved.metrics, nikkeiClose: previousClose + 100, nikkeiPreviousClose: previousClose, nikkeiChange: 100, nikkeiReturnPct: 100 / previousClose * 100, equalWeightReturnPct: 1, medianReturnPct: 1, advancers: 225, decliners: 0, unchanged: 0, advancerPct: 100, nikkeiMinusEqualWeightPp: 100 / previousClose * 100 - 1};
  const url = "https://indexes.nikkei.co.jp/nkave/archives/summary?dt=20261029&idx=nk225";
  next.official.rows.push({date: next.date, close: previousClose + 100, change: 100, changePct: next.metrics.nikkeiReturnPct, up: 225, down: 0, flat: 0, url});
  next.source.validation.url = url;
  next.observedAt = "2026-10-29T15:45:00+09:00";
  next.updatedAt = "2026-10-29T17:30:00+09:00";
  const future = new Date("2026-10-29T19:00:00+09:00");
  assert.equal(validateFeed(next, saved, future), true);
  assert.equal(validateFeed(next, saved, now), false);
  assert.equal(validateFeed(saved, next, future), false);
  next.history.at(-1).date = next.date = "2026-10-30";
  assert.equal(validateFeed(next, saved, new Date("2026-10-30T19:00:00+09:00")), false);
});
