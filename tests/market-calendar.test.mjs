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
    assert.ok(["決算", "経済指標", "金融政策", "休場"].includes(event.category));
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
  ]);
  const html = render({ initialMonth: "2026-09" });
  assert.match(html, /<option value="休場">休場<\/option>/);
  assert.match(html, /calendar-badge-休場/);
  assert.match(html, /datetime="2026-09-07"/i);
});

test("the update month is selected, with the earliest month as a fallback", () => {
  assert.match(render({ initialMonth: marketCalendarReviewedAt.slice(0, 7) }), /aria-pressed="true">2026年9月<\/button>/);
  assert.match(render({ initialMonth: "2099-01" }), /aria-pressed="true">2026年8月<\/button>/);
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
