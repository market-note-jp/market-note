/**
 * Market Breadth Lab — fixed-universe, daily equal-weight research calculations.
 * Prices must already be adjusted for splits/corporate actions. Cash dividends
 * are excluded for adjustment='split', included for adjustment='total'.
 */

function fail(message) {
  throw new Error(message);
}

/** Parse comma-separated UTF-8 text, preserving quoted commas and newlines. */
export function parseCSV(input) {
  if (typeof input !== 'string') fail('CSVを文字列として読み込めませんでした。');
  const text = input.replace(/^\uFEFF/, '');
  const records = [];
  let row = [];
  let field = '';
  let quoted = false;
  let afterQuote = false;
  let line = 1;
  const pushField = () => {
    row.push(field);
    field = '';
    afterQuote = false;
  };
  const pushRow = () => {
    pushField();
    if (row.some(value => value.trim() !== '')) records.push({ values: row, line });
    row = [];
  };
  for (let i = 0; i < text.length; i += 1) {
    const char = text[i];
    if (quoted) {
      if (char === '"') {
        if (text[i + 1] === '"') {
          field += '"';
          i += 1;
        } else {
          quoted = false;
          afterQuote = true;
        }
      } else {
        field += char;
        if (char === '\n') line += 1;
      }
      continue;
    }
    if (char === ',') {
      pushField();
    } else if (char === '\r' || char === '\n') {
      pushRow();
      if (char === '\r' && text[i + 1] === '\n') i += 1;
      line += 1;
    } else if (char === '"') {
      if (field !== '' || afterQuote) fail(`CSV ${line}行目：引用符の位置が不正です。`);
      quoted = true;
    } else if (afterQuote) {
      if (char !== ' ' && char !== '\t') fail(`CSV ${line}行目：閉じ引用符の後に不正な文字があります。`);
    } else {
      field += char;
    }
  }
  if (quoted) fail('CSVの引用符が閉じられていません。');
  if (field !== '' || row.length > 0 || afterQuote) pushRow();
  if (records.length === 0) fail('CSVが空です。');
  const headers = records[0].values.map(value => value.trim());
  if (headers.some(header => !header)) fail('CSVの列名に空欄があります。');
  if (new Set(headers).size !== headers.length) fail('CSVの列名が重複しています。');
  return records.slice(1).map(record => {
    if (record.values.length !== headers.length) {
      fail(`CSV ${record.line}行目：列数が${record.values.length}列です。見出しの${headers.length}列に揃えてください。`);
    }
    return Object.fromEntries(headers.map((header, index) => [header, record.values[index]]));
  });
}

function normalizedDate(value, rowNumber) {
  const raw = String(value ?? '').trim();
  const match = /^(\d{4})[-/](\d{1,2})[-/](\d{1,2})$/.exec(raw);
  if (!match) fail(`${rowNumber}件目：日付「${raw}」をYYYY-MM-DD形式で指定してください。`);
  const year = Number(match[1]);
  const month = Number(match[2]);
  const day = Number(match[3]);
  const date = `${match[1]}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
  const parsed = new Date(`${date}T00:00:00.000Z`);
  if (year < 1 || !Number.isFinite(parsed.getTime()) || parsed.getUTCFullYear() !== year || parsed.getUTCMonth() + 1 !== month || parsed.getUTCDate() !== day) {
    fail(`${rowNumber}件目：日付「${raw}」は実在しません。`);
  }
  return date;
}

function median(values) {
  const sorted = [...values].sort((a, b) => a - b);
  const mid = Math.floor(sorted.length / 2);
  return sorted.length % 2 ? sorted[mid] : (sorted[mid - 1] + sorted[mid]) / 2;
}

function codeList(codes) {
  return codes.slice(0, 8).join('、') + (codes.length > 8 ? ` ほか${codes.length - 8}銘柄` : '');
}

/**
 * Analyze a complete rectangular fixed-universe price panel.
 * Return/median use fractions; advanceRatio/aboveMA25 use 0–100 percentages.
 * Index begins at 100 and compounds each session's mean return.
 * No missing values or changing membership are silently imputed.
 * A missing session for the ENTIRE universe cannot be detected without an
 * external trading calendar. Dates provided by the caller define sessions.
 */
export function analyzePrices(rows, options = {}) {
  const expectedCount = options.expectedCount ?? 225;
  const adjustment = options.adjustment ?? 'split';
  const universe = options.universe ?? 'fixed';
  if (!Array.isArray(rows) || rows.length === 0) fail('分析する株価データがありません。');
  if (!Number.isInteger(expectedCount) || expectedCount < 1) fail('期待銘柄数は1以上の整数で指定してください。');
  if (universe !== 'fixed') fail('この版は期間中に同じ銘柄集合を使う固定構成方式に対応しています。銘柄入れ替えを含むデータは使用できません。');
  if (!['split', 'total'].includes(adjustment)) fail('株価調整はsplit（分割等のみ調整）またはtotal（配当再投資込み）を指定してください。未調整株価は使用できません。');

  const byDate = new Map();
  const allCodes = new Set();
  const names = new Map();
  rows.forEach((row, index) => {
    if (!row || typeof row !== 'object' || Array.isArray(row)) fail(`${index + 1}件目：株価データの形式が不正です。`);
    const date = normalizedDate(row.date, index + 1);
    const code = String(row.code ?? '').trim();
    if (!/^[A-Za-z0-9][A-Za-z0-9._-]*$/.test(code)) fail(`${index + 1}件目：銘柄コード「${code}」が不正です。`);
    const rawPrice = row.adjusted_close;
    const price = typeof rawPrice === 'number' ? rawPrice : Number(String(rawPrice ?? '').trim());
    if (!Number.isFinite(price) || price <= 0) fail(`${date} / ${code}：adjusted_closeは0より大きい有限の数値で指定してください。`);
    const daily = byDate.get(date) ?? new Map();
    if (daily.has(code)) fail(`${date} / ${code}：同じ日付・銘柄コードのデータが重複しています。`);
    const name = String(row.name ?? '').trim() || code;
    daily.set(code, { price, name });
    byDate.set(date, daily);
    allCodes.add(code);
    names.set(code, name);
  });

  const codes = [...allCodes].sort();
  const dates = [...byDate.keys()].sort();
  const count = codes.length;
  dates.forEach(date => {
    const daily = byDate.get(date);
    const missing = codes.filter(code => !daily.has(code));
    if (missing.length > 0) fail(`${date}：対象${count}銘柄中${daily.size}銘柄しかありません。不足：${codeList(missing)}。全期間の銘柄集合を揃えてください（欠損・銘柄入れ替えには未対応）。`);
  });

  const priceHistory = new Map(codes.map(code => [code, []]));
  const series = [];
  let ew = 100;
  let stocks = [];
  dates.forEach((date, dateIndex) => {
    const daily = byDate.get(date);
    const returns = [];
    let advancers = dateIndex > 0 ? 0 : null;
    let decliners = dateIndex > 0 ? 0 : null;
    let unchanged = dateIndex > 0 ? 0 : null;
    let above = 0;
    let maEligible = 0;
    stocks = codes.map(code => {
      const history = priceHistory.get(code);
      const { price: close, name } = daily.get(code);
      const prior = history[history.length - 1];
      const change = dateIndex > 0 ? close / prior - 1 : null;
      history.push(close);
      if (change !== null) {
        if (!Number.isFinite(change)) fail(`${date} / ${code}：価格比率が大きすぎて計算できません。`);
        returns.push(change);
        if (change > 0) advancers += 1;
        else if (change < 0) decliners += 1;
        else unchanged += 1;
      }
      let aboveMA25 = null;
      if (history.length >= 25) {
        // Sum price differences so a constant decimal-price history compares
        // exactly equal instead of drifting above its mean through rounding.
        const distanceFromMA = history.slice(-25).reduce((sum, price) => sum + (close - price) / 25, 0);
        aboveMA25 = distanceFromMA > 0;
        maEligible += 1;
        if (aboveMA25) above += 1;
      }
      return { code, name: name || names.get(code) || code, return: change, aboveMA25, close };
    });
    const change = dateIndex > 0 ? returns.reduce((sum, value) => sum + value / count, 0) : null;
    if (change !== null) ew *= 1 + change;
    if (!Number.isFinite(ew) || ew <= 0) fail(`${date}：指数値が計算可能な範囲を超えました。株価と調整方法を確認してください。`);
    series.push({
      date,
      ew,
      return: change,
      median: dateIndex > 0 ? median(returns) : null,
      advanceRatio: dateIndex > 0 ? advancers / count * 100 : null,
      aboveMA25: maEligible > 0 ? above / maEligible * 100 : null,
      advancers,
      decliners,
      unchanged,
      count,
      maEligible
    });
  });
  return { series, stocks, count, complete: count === expectedCount, adjustment, universe };
}

/** Give an equal-weight series its own fixed scale, without daily re-anchoring. */
export function scaleIndex(series, baseValue = 10000) {
  if (!Array.isArray(series) || series.length === 0) fail('指数の履歴がありません。');
  if (!Number.isFinite(baseValue) || baseValue <= 0) fail('指数の基準値は0より大きい数値を指定してください。');
  const initial = series[0].ew;
  if (!Number.isFinite(initial) || initial <= 0) fail('指数の初期値が不正です。');
  let previous = null;
  const scaled = series.map(row => {
    if (!Number.isFinite(row.ew) || row.ew <= 0) fail(`${row.date}：指数値が不正です。`);
    const level = baseValue * (row.ew / initial);
    if (!Number.isFinite(level) || level <= 0) fail(`${row.date}：指数の基準換算値が計算範囲を超えました。`);
    const pointChange = previous === null ? null : level - previous;
    previous = level;
    return { ...row, level, pointChange };
  });
  return { baseDate: series[0].date, baseValue, series: scaled };
}
