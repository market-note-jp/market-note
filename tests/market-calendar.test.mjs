import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { createRequire } from "node:module";
import test from "node:test";
import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import ts from "typescript";

const require = createRequire(import.meta.url);

function loadTypeScript(path) {
  const source = readFileSync(new URL(path, import.meta.url), "utf8");
  const { outputText } = ts.transpileModule(source, {
    compilerOptions: {
      module: ts.ModuleKind.CommonJS,
      jsx: ts.JsxEmit.ReactJSX,
      target: ts.ScriptTarget.ES2022,
    },
  });
  const loaded = { exports: {} };
  new Function("require", "module", "exports", outputText)(require, loaded, loaded.exports);
  return loaded.exports;
}

const { marketCalendarEvents: events, marketCalendarReviewedAt } = loadTypeScript("../app/market-calendar-data.ts");
const { default: MarketCalendar } = loadTypeScript("../app/market-calendar.tsx");
const render = (props = {}) => renderToStaticMarkup(createElement(MarketCalendar, { events, ...props }));

test("calendar events have unique IDs, valid dates and sourced schedules", () => {
  assert.equal(new Set(events.map((event) => event.id)).size, events.length);
  for (const event of events) {
    assert.match(event.date, /^\d{4}-\d{2}-\d{2}$/);
    assert.equal(new Date(`${event.date}T00:00:00Z`).toISOString().slice(0, 10), event.date);
    assert.ok(["決算", "経済指標", "金融政策", "休場", "短縮取引"].includes(event.category));
    assert.ok(["日本", "米国"].includes(event.region));
    assert.ok(event.sourceName && event.sourceTime);
    assert.equal(new URL(event.sourceUrl).protocol, "https:");
    if (event.forecast) {
      assert.ok(event.forecast.reviewedAt && event.forecast.sourceName && event.forecast.values.length);
      assert.equal(new URL(event.forecast.sourceUrl).protocol, "https:");
    }
  }
});

test("announced earnings calls convert to the correct JST date", () => {
  const format = new Intl.DateTimeFormat("sv-SE", {
    timeZone: "Asia/Tokyo", year: "numeric", month: "2-digit", day: "2-digit",
    hour: "2-digit", minute: "2-digit", hourCycle: "h23",
  });
  for (const [id, localDate] of [
    ["oracle-fy27-q1", "2026-09-10T16:00:00-05:00"],
    ["adobe-fy26-q3", "2026-09-10T14:00:00-07:00"],
  ]) {
    const event = events.find((item) => item.id === id);
    assert.ok(event);
    assert.equal(`${event.date} ${event.time}`, format.format(new Date(localDate)));
    assert.equal(event.forecast, undefined);
  }
  const fastRetailing = events.find((event) => event.id === "fast-retailing-fy26");
  assert.equal(fastRetailing.date, "2026-10-08");
  assert.equal(fastRetailing.time, "未定");
});

test("holidays use exchange trading dates and a dedicated filter", () => {
  assert.deepEqual(events.filter((event) => event.category === "休場").map((event) => event.date), [
    "2026-09-07", "2026-09-21", "2026-09-22", "2026-09-23", "2026-10-12",
    "2026-11-03", "2026-11-23", "2026-11-26",
  ]);
  const html = render({ initialMonth: "2026-09" });
  assert.match(html, /<option value="休場">休場<\/option>/);
  assert.match(html, /calendar-badge-休場/);
  assert.match(html, /datetime="2026-09-07"/i);
});

test("the update month is selected, with the earliest month as a fallback", () => {
  assert.match(marketCalendarReviewedAt, /^\d{4}-\d{2}-\d{2}$/);
  assert.equal(new Date(`${marketCalendarReviewedAt}T00:00:00Z`).toISOString().slice(0, 10), marketCalendarReviewedAt);
  const reviewedMonth = marketCalendarReviewedAt.slice(0, 7);
  const months = [...new Set(events.map(event => event.date.slice(0, 7)))].sort();
  const selectedMonth = months.includes(reviewedMonth) ? reviewedMonth : months[0];
  const label = month => `${month.slice(0, 4)}年${Number(month.slice(5))}月`;
  assert.ok(render({ initialMonth: reviewedMonth }).includes(`aria-pressed="true">${label(selectedMonth)}</button>`));
  assert.ok(render({ initialMonth: "0000-01" }).includes(`aria-pressed="true">${label(months[0])}</button>`));
});

test("weekdays and timestamps are independent of the host timezone", () => {
  const html = render({ initialMonth: "2026-09" });
  assert.match(html, /<strong>7<\/strong><span>月<\/span>/);
  assert.match(html, /<strong>11<\/strong><span>金<\/span>/);
  assert.match(html, /datetime="2026-09-11T06:00:00\+09:00"/i);
});

test("BOJ decision times do not use the separate press conference time", () => {
  const september = events.find((event) => event.id === "boj-mpm-2026-09");
  const october = events.find((event) => event.id === "boj-mpm-2026-10");
  assert.equal(september.time, "未定");
  assert.match(september.summary, /15:30/);
  assert.equal(october.time, "未定");
});

test("autumn official times retain DST offsets and next-day JST dates", () => {
  const format = new Intl.DateTimeFormat("sv-SE", {
    timeZone: "Asia/Tokyo", year: "numeric", month: "2-digit", day: "2-digit",
    hour: "2-digit", minute: "2-digit", hourCycle: "h23",
  });
  const cases = [
    ["fomc-2026-10", "2026-10-28T14:00:00-04:00"],
    ["fomc-press-conference-2026-10", "2026-10-28T14:30:00-04:00"],
    ["visa-fy26-q4", "2026-10-27T14:00:00-07:00"],
    ["alphabet-2026-q3-call", "2026-10-28T13:30:00-07:00"],
    ["microsoft-fy27-q1-call", "2026-10-28T14:30:00-07:00"],
    ["mastercard-2026-q3-call", "2026-10-29T09:00:00-04:00"],
    ["lilly-2026-q3-call", "2026-10-29T10:00:00-04:00"],
    ["amazon-2026-q3-call", "2026-10-29T14:00:00-07:00"],
    ["intel-2026-q3-call", "2026-10-29T14:00:00-07:00"],
    ["bls-eci-2026-q3", "2026-10-30T08:30:00-04:00"],
    ["apple-fy26-q4-call", "2026-11-02T14:00:00-08:00"],
    ["palantir-2026-q3-call", "2026-11-02T17:00:00-05:00"],
    ["amd-fy26-q3-call", "2026-11-03T17:00:00-05:00"],
    ["qualcomm-fy26-q4-call", "2026-11-04T13:45:00-08:00"],
    ["bls-jolts-2026-09", "2026-11-03T10:00:00-05:00"],
    ["bls-employment-2026-10", "2026-11-06T08:30:00-05:00"],
    ["bls-cpi-2026-10", "2026-11-10T08:30:00-05:00"],
    ["bls-ppi-2026-10", "2026-11-13T08:30:00-05:00"],
    ["us-retail-sales-2026-10", "2026-11-17T08:30:00-05:00"],
    ["fomc-minutes-2026-10", "2026-11-18T14:00:00-05:00"],
    ["bea-gdp-second-2026-q3", "2026-11-25T08:30:00-05:00"],
    ["bea-pce-2026-10", "2026-11-25T08:30:00-05:00"],
    ["us-durable-goods-2026-10", "2026-11-25T08:30:00-05:00"],
    ["fed-beige-book-2026-11", "2026-11-25T14:00:00-05:00"],
    ["bls-jolts-2026-10", "2026-12-01T10:00:00-05:00"],
    ["bls-employment-2026-11", "2026-12-04T08:30:00-05:00"],
  ];
  for (const [id, local] of cases) {
    const event = events.find(e => e.id === id);
    assert.ok(event, id);
    assert.equal(event.date + " " + event.time, format.format(new Date(local)), id);
    assert.match(event.sourceTime, /\d{4}-\d{2}-\d{2}確認/);
    assert.ok(event.sourceTime.match(/(\d{4}-\d{2}-\d{2})確認/)[1] <= marketCalendarReviewedAt);
  }
});

test("releases, calls, unknown times and approximate times remain distinct", () => {
  for (const id of ["hitachi-fy26-q2", "takeda-fy26-q2", "toyota-fy27-q2", "nintendo-fy27-q2", "recruit-fy27-q2", "mufg-fy27-half", "smfg-fy27-half", "boj-mpm-2026-10"]) {
    assert.equal(events.find(e => e.id === id).time, "未定", id);
  }
  for (const event of events.filter(e => e.id.endsWith("-call") || e.id === "visa-fy26-q4")) {
    assert.match(event.title, /決算説明会/);
  }
  for (const [id, time] of [["advantest-fy26-q2", "15:30"], ["tokyo-electron-fy27-q2", "16:00"], ["ntt-fy26-q2", "13:30"], ["mitsubishi-corp-fy26-q2", "14:00"], ["sony-fy26-q2", "15:30"], ["softbank-group-fy27-q2", "15:30"]]) {
    assert.equal(events.find(e => e.id === id).time, time, id);
  }
  assert.equal(events.find(e => e.id === "exxonmobil-2026-q3").time, "19:30ごろ");
  assert.equal(events.find(e => e.id === "japan-unemployment-2026-10").date, "2026-12-01");
  const october = render({ initialMonth: "2026-10" });
  assert.match(october, /datetime="2026-10-30">2026-10-30 19:30ごろ/i);
});

test("short trading uses the local trading day without a false JST timestamp", () => {
  const event = events.find(e => e.id === "nyse-early-close-2026-11");
  assert.equal(event.date, "2026-11-27");
  assert.equal(event.category, "短縮取引");
  assert.equal(event.time, "短縮取引");
  assert.match(event.summary, /日本時間11月28日03:00/);
  assert.match(event.sourceTime, /13:00 EST/);
  const html = render({ initialMonth: "2026-11" });
  assert.match(html, /<option value="短縮取引">短縮取引<\/option>/);
  assert.match(html, /datetime="2026-11-27">2026-11-27 短縮取引/i);
  assert.equal(events.some(e => e.date === "2026-11-11" && e.category === "休場"), false);
});


test("November review additions preserve winter JST conversions and approximate release times", () => {
  const format = new Intl.DateTimeFormat("sv-SE", { timeZone: "Asia/Tokyo", year: "numeric", month: "2-digit", day: "2-digit", hour: "2-digit", minute: "2-digit", hourCycle: "h23" });
  for (const [id, local] of [
    ["arista-2026-q3-call", "2026-11-03T13:30:00-08:00"],
    ["nvidia-fy27-q3-call", "2026-11-17T14:00:00-08:00"],
    ["fomc-2026-12", "2026-12-09T14:00:00-05:00"],
    ["fomc-press-conference-2026-12", "2026-12-09T14:30:00-05:00"],
    ["bls-cpi-2026-11", "2026-12-10T08:30:00-05:00"],
  ]) {
    const event = events.find(e => e.id === id);
    assert.ok(event, id);
    assert.equal(event.date + " " + event.time, format.format(new Date(local)), id);
    assert.match(event.sourceTime, /2026-11-01確認/);
  }
  const release = events.find(e => e.id === "nvidia-fy27-q3-release");
  assert.equal(release.date, "2026-11-18");
  assert.equal(release.time, "06:20ごろ");
  assert.match(release.summary, /厳密な確定時刻ではない/);
  const december = render({ initialMonth: "2026-12" });
  assert.match(december, /datetime="2026-12-10T04:00:00\+09:00"/i);
  assert.match(december, /datetime="2026-12-10T04:30:00\+09:00"/i);
});
