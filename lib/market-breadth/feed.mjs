export const FEED_URL = "https://raw.githubusercontent.com/market-note-jp/market-note/market-breadth-data/base100/latest.json";

const finite = value => typeof value === "number" && Number.isFinite(value);
const near = (a, b) => finite(a) && finite(b) && Math.abs(a - b) < 1e-7;
// JSON bundlers may shorten a decimal by one floating-point ULP. Preserve
// published observations to much finer precision than any displayed metric.
const sameObservation = (a, b) => finite(a) && finite(b) ? Math.abs(a - b) < 1e-10 : a === b;
const validDate = value => typeof value === "string" && /^\d{4}-\d{2}-\d{2}$/.test(value) && new Date(value + "T00:00:00Z").toISOString().slice(0, 10) === value;
const session = (date, calendar) => ![0, 6].includes(new Date(date + "T00:00:00Z").getUTCDay()) && !calendar.closedDates.includes(date);

export function latestClosedSession(calendar, now = new Date()) {
  const jst = new Date(now.getTime() + 9 * 3600000);
  const date = jst.toISOString().slice(0, 10);
  if (!calendar.years.includes(Number(date.slice(0, 4)))) return null;
  if (jst.getUTCHours() * 60 + jst.getUTCMinutes() < 15 * 60 + 30) jst.setUTCDate(jst.getUTCDate() - 1);
  for (let i = 0; i < 14; i++) {
    const day = jst.toISOString().slice(0, 10);
    if (!calendar.years.includes(Number(day.slice(0, 4)))) return null;
    if (session(day, calendar)) return day;
    jst.setUTCDate(jst.getUTCDate() - 1);
  }
  return null;
}

export function validateFeed(value, saved, now = new Date(), diagnose = () => {}) {
  let stage = "envelope";
  const reject = () => { diagnose(stage); return false; };
  try {
    if (!value || value.schemaVersion !== 1 || value.name !== saved.name || value.baseDate !== saved.baseDate || value.baseValue !== 100 || value.baseValue !== saved.baseValue || value.date < saved.date || !validDate(value.date)) return reject();
    stage = "calendar";
    if (!Array.isArray(value.calendar.years) || !Array.isArray(value.calendar.closedDates) || !value.calendar.closedDates.every(validDate)) return reject();
    const expected = latestClosedSession(value.calendar, now);
    stage = `session: expected=${expected}, received=${value.date}`;
    if (expected === null || value.date > expected || !session(value.date, value.calendar)) return reject();
    stage = "membership and fingerprint";
    if (value.validation.count !== 225 || value.validation.constituentSetMatch !== true || !/^[a-f0-9]{64}$/.test(value.inputSHA256)) return reject();
    if (value.date === saved.date && value.inputSHA256 !== saved.inputSHA256) return reject();
    stage = "current metrics";
    const m = value.metrics;
    if (![m.nikkeiClose, m.nikkeiPreviousClose, m.nikkeiChange, m.nikkeiReturnPct, m.equalWeightReturnPct, m.medianReturnPct, m.advancerPct, m.nikkeiMinusEqualWeightPp, value.level, value.pointChange].every(finite)) return reject();
    if (m.nikkeiClose <= 0 || m.nikkeiPreviousClose <= 0 || !near(m.nikkeiClose - m.nikkeiPreviousClose, m.nikkeiChange) || !near(m.nikkeiChange / m.nikkeiPreviousClose * 100, m.nikkeiReturnPct)) return reject();
    stage = "history envelope";
    const rows = value.history;
    if (!Array.isArray(rows) || rows.length < saved.history.length || rows[0].date !== saved.baseDate || rows[0].ew !== 100 || rows[0].return !== null || rows.at(-1).date !== value.date) return reject();
    for (let i = 0; i < rows.length; i++) {
      stage = `history row ${i}`;
      const row = rows[i];
      stage = `history row ${i}: shape`;
      if (!validDate(row.date) || !finite(row.ew) || row.ew <= 0 || row.count !== 225 || !Number.isInteger(row.maEligible) || row.maEligible < 0 || row.maEligible > 225) return reject();
      if (row.aboveMA25 !== null && (!finite(row.aboveMA25) || row.aboveMA25 < 0 || row.aboveMA25 > 100 || !row.maEligible)) return reject();
      if (i) {
        stage = `history row ${i}: chain`;
        if (row.date <= rows[i - 1].date || !session(row.date, value.calendar) || !finite(row.return) || row.return <= -1 || !near(row.ew, rows[i - 1].ew * (1 + row.return)) || !finite(row.median)) return reject();
        const next = new Date(rows[i - 1].date + "T00:00:00Z");
        stage = `history row ${i}: session continuity`;
        do { next.setUTCDate(next.getUTCDate() + 1); } while (!session(next.toISOString().slice(0, 10), value.calendar));
        if (next.toISOString().slice(0, 10) !== row.date) return reject();
        stage = `history row ${i}: breadth counts`;
        if (![row.advancers, row.decliners, row.unchanged].every(n => Number.isInteger(n) && n >= 0) || row.advancers + row.decliners + row.unchanged !== 225 || !near(row.advanceRatio, row.advancers / 225 * 100)) return reject();
      }
      // Previously published history is immutable, including the build fallback.
      const old = saved.history[i];
      stage = `history row ${i}: published observation`;
      if (old && ["date", "ew", "return", "median", "advanceRatio", "aboveMA25", "advancers", "decliners", "unchanged", "maEligible"].some(key => !sameObservation(row[key], old[key]))) return reject();
    }
    stage = "latest history vs metrics";
    const last = rows.at(-1), previous = rows.at(-2);
    if (!near(value.level, last.ew / 100 * value.baseValue) || !near(value.pointChange, (last.ew - previous.ew) / 100 * value.baseValue) || !near(m.equalWeightReturnPct, last.return * 100) || !near(m.medianReturnPct, last.median * 100) || !near(m.advancerPct, last.advanceRatio) || m.advancers !== last.advancers || m.decliners !== last.decliners || m.unchanged !== last.unchanged || !near(m.nikkeiMinusEqualWeightPp, m.nikkeiReturnPct - m.equalWeightReturnPct)) return reject();
    stage = "official comparison";
    if (!Array.isArray(value.official.rows)) return reject();
    const official = new Map(value.official.rows.map(row => [row.date, row]));
    if (official.size !== value.official.rows.length || !near(official.get(value.baseDate)?.close, saved.official.rows.find(row => row.date === saved.baseDate)?.close) || !near(official.get(value.date)?.close, m.nikkeiClose) || !near(official.get(previous.date)?.close, m.nikkeiPreviousClose)) return reject();
    for (const row of value.official.rows) {
      if (!validDate(row.date) || !finite(row.close) || row.close <= 0 || !finite(row.changePct) || row.up + row.down + row.flat !== 225 || row.url !== `https://indexes.nikkei.co.jp/nkave/archives/summary?dt=${row.date.replaceAll("-", "")}&idx=nk225`) return reject();
    }
    for (const row of rows.slice(1)) {
      const matched = official.get(row.date);
      if (!matched || matched.up !== row.advancers || matched.down !== row.decliners || matched.flat !== row.unchanged) return reject();
    }
    stage = "source and timestamps";
    if (value.source.prices.url !== saved.source.prices.url || value.source.constituents.url !== saved.source.constituents.url || value.source.validation.url !== official.get(value.date).url) return reject();
    if (!Number.isFinite(Date.parse(value.observedAt)) || !Number.isFinite(Date.parse(value.updatedAt))) return reject();
    return true;
  } catch (error) { diagnose(`invalid shape: ${error instanceof Error ? error.message : String(error)}`); return false; }
}
