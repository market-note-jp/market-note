"use client";

import { useState } from "react";
import { analyzePrices, parseCSV, scaleIndex } from "../../lib/market-breadth/engine.mjs";
import type { Analysis, PriceRow } from "../../lib/market-breadth/engine.mjs";
import { useMarketBreadthSnapshot, type Snapshot } from "./use-snapshot";

type Dataset = { kind: "real" | "imported" | "sample"; name: string; analysis: Analysis; baseValue: number; source: string };
type Benchmark = { date: string; nikkei225: number; topix?: number | null };
type PlotRow = { date: string; own: number; nk?: number | null; topix?: number | null };
type PlotLine = { key: "own" | "nk" | "topix"; label: string; color: string };
const fmt = (value: number | null, digits = 2) => value === null ? "—" : value.toLocaleString("ja-JP", {minimumFractionDigits: digits, maximumFractionDigits: digits});
const signed = (value: number | null, digits = 2) => value === null ? "—" : `${value > 0 ? "+" : value < 0 ? "−" : ""}${fmt(Math.abs(value), digits)}`;
const tone = (value: number | null) => value === null || value === 0 ? "" : value < 0 ? "breadth-negative" : "breadth-positive";
function initialDataset(snapshot: Snapshot): Dataset {
  return {kind: "real", name: snapshot.name, baseValue: snapshot.baseValue, source: snapshot.source.prices.url, analysis: {
    series: snapshot.history,
    stocks: [], count: 225, complete: true, adjustment: "split", universe: "point-in-time"
  }};
}

function plot(rows: PlotRow[], lines: PlotLine[], label: string, height = 250) {
  const values = lines.flatMap(line => rows.map(row => row[line.key]).filter((v): v is number => v != null));
  if (!values.length) return <p className="breadth-empty">比較できる履歴がありません。</p>;
  const W = 760, H = height, left = values.some(v => Math.abs(v) > 1000) ? 76 : 45, right = 25, top = 18, bottom = 33;
  let low = Math.min(...values), high = Math.max(...values);
  const span = high - low || 2;
  low -= span * 0.15; high += span * 0.15;
  const x = (index: number) => left + index / Math.max(1, rows.length - 1) * (W - left - right);
  const y = (value: number) => top + (high - value) / (high - low) * (H - top - bottom);
  const ticks = [...new Set([0, Math.floor((rows.length - 1) / 2), rows.length - 1])];
  return <svg className="breadth-chart" viewBox={`0 0 ${W} ${H}`} role="img" aria-label={label}>
    {Array.from({length: 5}, (_, i) => {const value = low + (high - low) * i / 4; return <g key={i}><line className="grid" x1={left} x2={W - right} y1={y(value)} y2={y(value)}/><text x={left - 10} y={y(value) + 3} textAnchor="end">{fmt(value, 1)}</text></g>;})}
    {ticks.map(i => <text key={i} x={x(i)} y={H - 10} textAnchor="middle">{rows[i].date.slice(5).replace("-", "/")}</text>)}
    {lines.map(line => <g key={line.key}><path d={rows.map((row, i) => {const v = row[line.key]; return v == null ? "" : `${i === 0 || rows[i - 1][line.key] == null ? "M" : "L"}${x(i)},${y(v)}`;}).join(" ")} stroke={line.color} strokeWidth="2.5" strokeLinecap="round" fill="none"/>{rows.map((row, i) => {const value = row[line.key]; return value == null ? null : <circle key={row.date} cx={x(i)} cy={y(value)} r={i === rows.length - 1 ? 4 : 2.5} fill={line.color} stroke="white" strokeWidth="1.3"><title>{row.date} {line.label} {fmt(value, 3)}</title></circle>;})}</g>)}
  </svg>;
}

function breadthBars(rows: Snapshot["official"]["rows"]) {
  return <svg className="breadth-chart" viewBox="0 0 760 115" role="img" aria-label="日経225の上昇銘柄比率。破線は50%。">
    <line x1="45" x2="735" y1="46" y2="46" stroke="#cbd6c2" strokeDasharray="3 3"/><text x="36" y="49" textAnchor="end">50%</text>
    {rows.map((row, i) => {const ratio = row.up / 225, x = 45 + i / rows.length * 690 + 6, width = 690 / rows.length - 12; return <g key={row.date}><rect x={x} y={7 + 78 * (1 - ratio)} width={width} height={78 * ratio} fill={ratio > 0.5 ? "#8ba98b" : "#d4c9ae"} rx="2"><title>{row.date} 上昇{row.up}/225社・{fmt(ratio * 100, 1)}%</title></rect>{[0, 7, rows.length - 1].includes(i) && <text x={x + width / 2} y="108" textAnchor="middle">{row.date.slice(5).replace("-", "/")}</text>}</g>;})}
  </svg>;
}

function csv(headers: string[], rows: (string | number | boolean | null)[][]) {
  return [headers, ...rows].map(row => row.map(value => {let text = String(value ?? ""); if (typeof value === "string" && /^[=+@-]/.test(text)) text = "'" + text; return `"${text.replaceAll('"', '""')}"`;}).join(",")).join("\r\n");
}
function download(name: string, text: string) {
  const a = document.createElement("a"), url = URL.createObjectURL(new Blob(["\uFEFF", text], {type: "text/csv;charset=utf-8"}));
  a.href = url; a.download = name; a.click(); setTimeout(() => URL.revokeObjectURL(url), 1000);
}

function syntheticDataset(): {data: Dataset; benchmark: Benchmark[]} {
  const rows: PriceRow[] = [], dates: string[] = [], day = new Date("2026-08-03T00:00:00Z");
  while (dates.length < 40) {if (![0, 6].includes(day.getUTCDay())) dates.push(day.toISOString().slice(0, 10)); day.setUTCDate(day.getUTCDate() + 1);}
  const prices = Array.from({length: 225}, (_, i) => 1000 + i * 9), benchmark: Benchmark[] = [];
  let weighted = 10000;
  dates.forEach((date, t) => {
    const returns = prices.map((price, i) => {
      const r = t === 0 ? 0 : i < 4 ? 0.009 + Math.sin(t * 0.5 + i) * 0.007 : -0.0015 + Math.sin(t * 0.6 + i * 0.63) * 0.011;
      prices[i] = price * (1 + r);
      rows.push({date, code: `S${String(i + 1).padStart(3, "0")}`, name: `架空企業 ${i + 1}`, adjusted_close: prices[i]}); return r;
    });
    if (t) weighted *= 1 + returns.slice(0, 4).reduce((a, b) => a + b, 0) / 4 * 0.3407 + returns.slice(4).reduce((a, b) => a + b, 0) / 221 * 0.6593;
    benchmark.push({date, nikkei225: weighted});
  });
  return {data: {kind: "sample", name: "架空225社均等指数", analysis: analyzePrices(rows), baseValue: 10000, source: "生成した架空データ"}, benchmark};
}

export default function BreadthDashboard() {
  const {data: snapshot, status} = useMarketBreadthSnapshot();
  const officialBenchmark: Benchmark[] = snapshot.official.rows.map(row => ({date: row.date, nikkei225: row.close}));
  const recentOfficial = snapshot.official.rows.slice(-20);
  const [tab, setTab] = useState("overview");
  const [dataset, setDataset] = useState<Dataset>(() => initialDataset(snapshot));
  const [benchmark, setBenchmark] = useState<Benchmark[]>(officialBenchmark);
  const [sampleBenchmark, setSampleBenchmark] = useState<Benchmark[]>([]);
  const [period, setPeriod] = useState("all"), [scale, setScale] = useState("level");
  const [pricesFile, setPricesFile] = useState<File | null>(null), [benchmarkFile, setBenchmarkFile] = useState<File | null>(null);
  const [adjustment, setAdjustment] = useState("split"), [source, setSource] = useState("");
  const [message, setMessage] = useState(""), [error, setError] = useState(false), [busy, setBusy] = useState(false);
  const [search, setSearch] = useState(""), [ascending, setAscending] = useState(false);
  const current = tab !== "lab" || dataset.kind === "real" ? initialDataset(snapshot) : dataset;
  const a = current.analysis, own = scaleIndex(a.series, current.baseValue), last = own.series[own.series.length - 1];
  const b = new Map((current.kind === "real" ? officialBenchmark : current.kind === "sample" ? sampleBenchmark : benchmark).map(row => [row.date, row]));
  const shown = period === "5" ? own.series.slice(-5) : period === "20" ? own.series.slice(-20) : own.series;
  const anchor = own.series[0], unit = scale === "level" ? own.baseValue : 100;
  const hasNK = a.adjustment === "split" && Boolean(b.get(anchor.date)?.nikkei225) && shown.every(row => Boolean(b.get(row.date)?.nikkei225));
  const hasTopix = a.adjustment === "split" && Boolean(b.get(anchor.date)?.topix) && shown.every(row => Boolean(b.get(row.date)?.topix));
  const lines: PlotLine[] = [{key: "own", label: current.name, color: "#34715a"}];
  if (hasNK) lines.push({key: "nk", label: current.kind === "sample" ? "架空の加重指数" : current.kind !== "real" && scale === "level" ? "日経平均（基準換算）" : "日経平均", color: "#7595ab"});
  if (hasTopix) lines.push({key: "topix", label: scale === "level" ? "TOPIX（基準換算）" : "TOPIX", color: "#b0a57d"});
  const chartRows: PlotRow[] = shown.map(row => ({date: row.date, own: scale === "level" ? row.level : row.ew / anchor.ew * 100, nk: hasNK ? b.get(row.date)!.nikkei225 / b.get(anchor.date)!.nikkei225 * unit : null, topix: hasTopix ? b.get(row.date)!.topix! / b.get(anchor.date)!.topix! * unit : null}));

  const exportSummary = () => download(`market-note-225-${current.kind}-${last.date}.csv`, csv(["date", "index_points", "point_change", "daily_return_pct", "median_return_pct", "advancer_pct", "above_ma25_pct", "ma_eligible", "count", "nikkei_close", "nikkei_minus_mn225_points", "base_date", "base_value", "dataset", "source", "adjustment"], own.series.map(row => [row.date, row.level, row.pointChange, row.return === null ? null : row.return * 100, row.median === null ? null : row.median * 100, row.advanceRatio, row.aboveMA25, row.maEligible, row.count, current.kind === "real" ? b.get(row.date)?.nikkei225 ?? null : null, current.kind === "real" && b.get(row.date) ? b.get(row.date)!.nikkei225 - row.level : null, own.baseDate, own.baseValue, current.name, current.source, a.adjustment])));

  async function importPrices() {
    setMessage(""); setError(false); setBusy(true);
    try {
      if (!pricesFile) throw new Error("株価CSVを選択してください。");
      if (pricesFile.size > 10 * 1024 * 1024) throw new Error("10MB以下のCSVを選択してください。");
      const parsed = parseCSV(await pricesFile.text());
      if (parsed.length > 150000) throw new Error("1ファイル15万行まで対応しています。");
      const rows: PriceRow[] = parsed.map(row => ({date: row.date, code: row.code, name: row.name, adjusted_close: row.adjusted_close}));
      const analysis = analyzePrices(rows, {expectedCount: 225, adjustment, universe: "fixed"});
      if (analysis.series.length < 2 || analysis.series.length > 20000) throw new Error("2日分以上・2万日分以下の履歴を指定してください。");
      setDataset({kind: "imported", name: `${analysis.count}社均等加重${analysis.complete ? "" : "参考"}指数`, analysis, baseValue: 10000, source: source.trim() || pricesFile.name});
      setPeriod("all"); setSearch(""); setMessage(`${analysis.count}社・${analysis.series.length}日分を計算しました。${analysis.complete ? "社数は225社。公式構成との照合は未実施です。" : "225社以外の参考指数です。"}`);
    } catch (e) {setError(true); setMessage(e instanceof Error ? e.message : String(e));} finally {setBusy(false);}
  }

  async function importBenchmark() {
    setMessage(""); setError(false);
    try {
      if (!benchmarkFile) throw new Error("比較指数CSVを選択してください。");
      if (benchmarkFile.size > 10 * 1024 * 1024) throw new Error("10MB以下のCSVを選択してください。");
      const rows = parseCSV(await benchmarkFile.text()), dates = new Set<string>();
      if (!rows.length) throw new Error("比較指数の履歴が空です。");
      const parsed = rows.map(row => {
        const date = new Date(row.date + "T00:00:00Z");
        if (!/^\d{4}-\d{2}-\d{2}$/.test(row.date) || !Number.isFinite(date.getTime()) || date.toISOString().slice(0, 10) !== row.date) throw new Error(`日付「${row.date}」を確認してください。`);
        if (dates.has(row.date)) throw new Error(`${row.date}が重複しています。`);
        dates.add(row.date);
        const nk = Number(row.nikkei225), topix = row.topix?.trim() ? Number(row.topix) : null;
        if (!Number.isFinite(nk) || nk <= 0 || (topix !== null && (!Number.isFinite(topix) || topix <= 0))) throw new Error(`${row.date}の指数値を確認してください。`);
        return {date: row.date, nikkei225: nk, topix};
      }).sort((x, y) => x.date.localeCompare(y.date));
      setBenchmark(parsed); setMessage(`${parsed.length}日分の比較指数を取り込みました。取り込んだ株価と基準日・表示日・配当条件が揃う場合に重ねます。`);
    } catch (e) {setError(true); setMessage(e instanceof Error ? e.message : String(e));}
  }

  return <>
    <nav className="breadth-tabs" aria-label="日本株指標の表示">{[["overview", "市場の広がり"], ["lab", "均等加重ラボ・CSV計算"], ["method", "算出方法・出典"]].map(([key, text]) => <button key={key} type="button" aria-pressed={tab === key} onClick={() => setTab(key)}>{text}</button>)}</nav>
    <div className={`breadth-notice ${current.kind === "sample" ? "sample" : ""}`} role="status">{current.kind === "real" ? `観測：${snapshot.date} 終値 / 225社を公式構成と照合済み。${a.series.length - 1}営業日分の騰落率を蓄積。${status}。` : current.kind === "sample" ? "架空データ・40日分。日付は平日を使用し、実際の取引日は再現していません。市場の実績ではありません。" : `持ち込みデータ：${a.count}社・${a.series.length}日分。公式構成との一致は未確認です。`}</div>
    <section className="breadth-stats" aria-label="日本株指標の数値">
      <div className="breadth-stat"><span className="breadth-stat-label">{current.name}</span><strong>{fmt(last.level)}<small>pt</small></strong><small className={tone(last.return)}>{signed(last.pointChange)}pt（{signed(last.return === null ? null : last.return * 100)}%）</small></div>
      <div className="breadth-stat"><span className="breadth-stat-label">{tab === "lab" ? "騰落率の中央値" : "日経平均株価"}</span><strong>{tab === "lab" ? fmt(last.median === null ? null : last.median * 100) : fmt(snapshot.metrics.nikkeiClose)}<small>{tab === "lab" ? "%" : "円"}</small></strong><small>{tab === "lab" ? `${last.date} / ${a.count}社` : `前日比 ${signed(snapshot.metrics.nikkeiReturnPct)}%`}</small></div>
      <div className="breadth-stat"><span className="breadth-stat-label">上昇銘柄比率</span><strong>{fmt(last.advanceRatio, 1)}<small>%</small></strong><small>{last.advancers ?? "—"}社上昇 / 全{a.count}社</small></div>
      <div className="breadth-stat"><span className="breadth-stat-label">{tab === "lab" ? "25日移動平均超え" : "騰落率の中央値"}</span><strong>{tab === "lab" ? last.aboveMA25 === null ? "未算出" : fmt(last.aboveMA25, 1) : fmt(snapshot.metrics.medianReturnPct)}<small>{tab !== "lab" || last.aboveMA25 !== null ? "%" : ""}</small></strong><small>{tab === "lab" ? last.aboveMA25 === null ? `25日分が必要（現在${a.series.length}日）` : `判定可能 ${last.maEligible}/${a.count}社` : "225社を並べた、真ん中の騰落率"}</small></div>
    </section>
    <div className="breadth-origin">固定基準日 {own.baseDate} = {fmt(own.baseValue)}pt。以後は前日の独自指数に各社の平均騰落率を反映。日経平均と基準を揃えるのは初日だけです。{current.kind !== "real" && "持ち込み・架空データは初日10,000ptから開始。"}</div>

    {tab !== "method" && <section className="breadth-panel" aria-labelledby="breadth-comparison-title">
      <div className="breadth-panel-head"><div><h2 id="breadth-comparison-title">独自指数を、日経平均と並べる</h2><p className="breadth-small">固定基準 {own.baseDate} = {fmt(unit)}{scale === "level" ? "pt" : ""} / {a.adjustment === "total" ? "配当再投資込み" : "配当なし"}</p></div><div className="breadth-controls breadth-tabs">{[["level", "独自指数"], ["100", "基準100"]].map(([key, text]) => <button key={key} aria-pressed={scale === key} onClick={() => setScale(key)}>{text}</button>)}{[["all", "全期間"], ["20", "20日"], ["5", "5日"]].map(([key, text]) => <button key={key} aria-pressed={period === key} onClick={() => setPeriod(key)}>{text}</button>)}</div></div>
      <div className="breadth-legend">{lines.map(line => <span key={line.key}><i style={{background: line.color}}/>{line.label}</span>)}</div>
      {plot(chartRows, lines, `${current.name}と比較指数の推移。固定基準日${own.baseDate}、基準値${unit}。正確な値は履歴表またはCSVを参照。`, 275)}
      <div className="breadth-chart-note"><span>表示期間を変えても基準値は固定。{hasNK ? "" : "比較には基準日・表示日のデータと配当条件の一致が必要です。"}</span>{current.kind === "real" && scale === "level" && <span>終値の数値差（日経平均 − 独自指数）：{fmt(snapshot.metrics.nikkeiClose - last.level)}pt</span>}</div>
      <button className="breadth-button" style={{marginTop: 17}} onClick={exportSummary}>独自指数の履歴をCSV出力 ↗</button>
    </section>}

    {tab !== "method" && <section className="breadth-panel"><h2>独自指数の蓄積履歴</h2><p className="breadth-small">{own.baseDate}から{last.date}まで・基準日を含む{a.series.length}観測。表は直近60日、CSVは全期間。{current.kind === "real" && "取引終了後に検証した値を保存し、休場日の行は作りません。"}</p><div className="breadth-table"><table><thead><tr><th>観測日</th><th>MN225（pt）</th><th>前日比</th><th>日経平均（円）</th><th>数値差（pt）</th><th>上昇比率</th><th>25日線超え</th><th>判定可能社数</th></tr></thead><tbody>{own.series.slice(-60).reverse().map(row => <tr key={row.date}><td>{row.date}</td><td>{fmt(row.level)}</td><td className={tone(row.return)}>{signed(row.return === null ? null : row.return * 100)}%</td><td>{current.kind === "real" ? fmt(b.get(row.date)?.nikkei225 ?? null) : "—"}</td><td>{current.kind === "real" && b.get(row.date) ? fmt(b.get(row.date)!.nikkei225 - row.level) : "—"}</td><td>{fmt(row.advanceRatio, 1)}%</td><td>{row.aboveMA25 === null ? "未算出" : `${fmt(row.aboveMA25, 1)}%`}</td><td>{row.maEligible}/{a.count}</td></tr>)}</tbody></table></div><p className="breadth-small">数値差＝日経平均の終値 − MN225。基準日以降の累積差で、適正株価を示しません。25日線は各社25観測が揃ってから算出します。</p></section>}

    {tab === "overview" && <>
      <div className="breadth-grid"><section className="breadth-panel"><h2>日経平均と、上昇の広がり</h2><p>{recentOfficial[0].date}〜{snapshot.date}の{recentOfficial.length}営業日。上：日経平均（初日 = 100）／下：上昇銘柄比率。</p>{plot(recentOfficial.map(row => ({date: row.date, own: row.close / recentOfficial[0].close * 100})), [{key: "own", label: "日経平均", color: "#447563"}], `日経平均の推移。${recentOfficial[0].date}を100。`)}{breadthBars(recentOfficial)}<p className="breadth-small">企業数と騰落率は別の指標。上昇銘柄比率だけでは、均等加重のリターンは分かりません。</p></section><section className="breadth-panel"><h2>225社の騰落分布</h2><div className="breadth-ratio">{snapshot.metrics.advancers}<small> / 225</small></div><p>{snapshot.date}に上昇した企業</p><div className="breadth-heatmap" role="img" aria-label={`上昇${snapshot.metrics.advancers}社、下落${snapshot.metrics.decliners}社、変わらず${snapshot.metrics.unchanged}社`}>{Array.from({length: 225}, (_, i) => <span key={i} className={i < snapshot.metrics.advancers ? "up" : i >= snapshot.metrics.advancers + snapshot.metrics.decliners ? "flat" : ""} aria-hidden="true"/>)}</div><div className="breadth-breakdown"><span>上昇{snapshot.metrics.advancers}</span><span>下落{snapshot.metrics.decliners}</span><span>横ばい{snapshot.metrics.unchanged}</span></div><p className="breadth-small">1マス＝1社。騰落別の分布で、個別銘柄の配置ではありません。</p></section></div>
      <section className="breadth-panel"><h2>公式サマリーの履歴</h2><p className="breadth-small">直近60営業日を表示。</p><div className="breadth-table"><table><thead><tr><th>観測日</th><th>日経平均</th><th>前日比</th><th>上昇</th><th>下落</th><th>横ばい</th><th>上昇比率</th><th>出典</th></tr></thead><tbody>{snapshot.official.rows.slice(-60).reverse().map(row => <tr key={row.date}><td>{row.date}</td><td>{fmt(row.close)}</td><td className={tone(row.changePct)}>{signed(row.changePct)}%</td><td>{row.up}</td><td>{row.down}</td><td>{row.flat}</td><td>{fmt(row.up / 225 * 100, 1)}%</td><td><a href={row.url} target="_blank" rel="noreferrer">公式 ↗</a></td></tr>)}</tbody></table></div></section>
    </>}

    {tab === "lab" && <>
      <section className="breadth-panel"><h2>株価CSVで、履歴を追加して計算する</h2><p>同じ銘柄集合を、すべての日付で揃えてください。225社以外は社数を明記した参考指数になります。</p><div className="breadth-data-grid"><div><label className="breadth-field">株価CSV（UTF-8・10MB以下）<input type="file" accept=".csv,text/csv" onChange={e => setPricesFile(e.target.files?.[0] ?? null)}/></label><label className="breadth-field">調整条件<select value={adjustment} onChange={e => setAdjustment(e.target.value)}><option value="split">株式分割・併合等のみ調整済み</option><option value="total">配当再投資込みの調整済み株価</option></select></label><label className="breadth-field">データの出所<input value={source} onChange={e => setSource(e.target.value)} maxLength={180} placeholder="例：利用許諾のある証券会社の株価データ"/></label><button className="breadth-button primary" onClick={importPrices} disabled={busy}>{busy ? "計算中…" : "取り込んで計算する"}</button></div><div><pre className="breadth-code">{"date,code,name,adjusted_close\n2026-10-01,A001,例示企業A,100\n2026-10-01,A002,例示企業B,100\n2026-10-02,A001,例示企業A,110\n2026-10-02,A002,例示企業B,90"}</pre><p className="breadth-small">上記は形式を示す架空の2社。日付・コードの重複、銘柄欠損、0以下の価格はエラーになります。分割未調整の価格は使わないでください。</p><p className="breadth-small">ファイルはこのブラウザ内で計算します。取り込みに外部送信は伴いません。このページを閉じると取り込みデータは消えるため、必要な結果はCSV出力してください。</p></div></div>
        <details className="breadth-disclosure"><summary>日経平均・TOPIXの比較履歴も追加する</summary><p>列はdate,nikkei225,topix。TOPIXは任意。持ち込み株価と同じ基準日・表示日のデータを揃えます。配当込み株価と配当なし指数は重ねません。</p><label className="breadth-field">比較指数CSV<input type="file" accept=".csv,text/csv" onChange={e => setBenchmarkFile(e.target.files?.[0] ?? null)}/></label><button className="breadth-button" onClick={importBenchmark}>比較指数を取り込む</button></details>
        {message && <div className={`breadth-message ${error ? "error" : ""}`} role="status">{message}</div>}
        <div className="breadth-controls" style={{marginTop: 20}}><button className="breadth-button" onClick={() => {const s = syntheticDataset(); setDataset(s.data); setSampleBenchmark(s.benchmark); setPeriod("all"); setSearch(""); setMessage("");}}>架空データで操作を試す</button><button className="breadth-button" onClick={() => {setDataset(initialDataset(snapshot)); setPeriod("all"); setSearch(""); setMessage("");}}>収録実測に戻す</button></div>
      </section>
      <section className="breadth-panel"><div className="breadth-panel-head"><div><h2>各社の値動き</h2><p>銘柄数 {a.count} / 基準の1社比重 {fmt(100 / a.count, 4)}% / 毎日リバランス / 売買コスト除外</p></div>{a.stocks.length > 0 && <div className="breadth-controls"><input className="breadth-search" aria-label="銘柄を検索" placeholder="銘柄名・コードを検索" value={search} onChange={e => setSearch(e.target.value)}/><button className="breadth-button" onClick={() => setAscending(!ascending)}>騰落率 {ascending ? "↑" : "↓"}</button></div>}</div>
        {a.stocks.length === 0 ? <p className="breadth-empty">収録実測では独自指数・集計値を公開しています。各社の内訳と25日線は、株価CSVを取り込むと表示できます。</p> : <div className="breadth-table breadth-stock-table"><table><thead><tr><th>コード / 銘柄名</th><th>最新価格</th><th>騰落率</th><th>均等加重への寄与</th><th>25日線超え</th></tr></thead><tbody>{a.stocks.filter(stock => (stock.code + stock.name).toLowerCase().includes(search.toLowerCase())).sort((x, y) => (ascending ? 1 : -1) * ((x.return ?? 0) - (y.return ?? 0))).map(stock => <tr key={stock.code}><td>{stock.code} {stock.name}</td><td>{fmt(stock.close)}</td><td className={tone(stock.return)}>{signed(stock.return === null ? null : stock.return * 100)}%</td><td>{signed(stock.return === null ? null : stock.return / a.count * 100, 4)}%ポイント</td><td>{stock.aboveMA25 === null ? "未算出" : stock.aboveMA25 ? "○" : "×"}</td></tr>)}</tbody></table></div>}
      </section>
    </>}

    {tab === "method" && <>
      <div className="breadth-method-grid"><section className="breadth-panel"><h2>一社ずつ、同じ比重で</h2><div className="breadth-formula">各社の騰落率 = 当日調整済み価格 ÷ 前日調整済み価格 − 1</div><p>225社の騰落率を平均します。前日引けで一社あたり1/225の同じ比重へ戻す仮想ポートフォリオです。同じ上昇率なら、どの企業も同じ寄与になります。</p></section><section className="breadth-panel"><h2>独自指数を連鎖させる</h2><div className="breadth-formula">当日指数 = 前日指数 ×（1＋平均騰落率）</div><p>Market Note 225は2026/10/22の日経平均と同じ62,907.84から開始。以後は独立して計算します。基準を変えれば絶対値は変わるため、日経平均の適正価格を示すものではありません。</p></section><section className="breadth-panel"><h2>分布を見る3つの指標</h2><ul><li>中央値：各社の騰落率を並べた真ん中。</li><li>上昇比率：上昇社数÷全対象社数。横ばいも分母。</li><li>25日線超え：当日を含む直近25観測の平均より当日価格が高い社数の比率。</li></ul><p>25観測未満は未算出。入力の日付が営業日として連続していることが前提です。</p></section><section className="breadth-panel"><h2>重みづけの違い</h2><p>日経平均は調整後の株価に応じた比重。均等加重は企業ごとに同じ比重です。10/23の上位4社は日経平均で合計34.07%。225社均等なら同じ4社は1.78%です。</p><div className="breadth-table"><table><thead><tr><th>企業</th><th>日経平均の比重</th></tr></thead><tbody>{snapshot.official.weights.map(row => <tr key={row.code}><td>{row.name}</td><td>{fmt(row.weight)}%</td></tr>)}</tbody></table></div></section></div>
      <section className="breadth-panel"><h2>収録範囲と、比較の条件</h2>{[
        ["実測の収録期間", `${snapshot.baseDate}の基準値から${snapshot.date}まで、${snapshot.history.length - 1}営業日分の騰落率を蓄積しています。毎回225社を当日有効な公式構成と照合し、上昇・下落・横ばいの社数も公式サマリーと突き合わせます。過去の独自指数を推定して埋めることはしません。`],
        ["欠損・入れ替え・生存者バイアス", "自動収録は当日有効な225社を使用します。入れ替え日は新規銘柄の前日基準価格から騰落率を算出し、25日線の履歴はその銘柄について再開します。営業日が抜けた場合は追加を止め、検証済みの履歴を復旧します。CSVは全日同じ銘柄集合が必要で、全社同時に抜けた営業日は検出できません。現在の225社を過去に固定したCSVには生存者バイアスがあります。"],
        ["株式分割と配当の扱い", "自動収録は提供元の前日比が示す基準価格を使い、配当を加算しません。分割・併合等の日も前日基準価格の調整を前提とします。長期CSVは調整済み価格が必要です。配当再投資込み価格は指定できますが、配当なし指数と比較表示しません。提供元の調整が正しいかは別途確認が必要です。"],
        ["予測との違い", "この指標は市場の集中と広がりを観察する道具です。乖離が将来の下落確率を高めるという検証は未実施。225社以外の小型株を含む日本株全体を表す指数でもありません。"],
        ["取引後の更新と履歴保存", "日本時間の平日夕方に更新を実行します。休場日を除き、同じ日付は1件だけ保存。取得漏れや照合不一致があれば直近の検証済み値を保ち、日付を進めません。表示ページは保存済み履歴を読み込み、開いている間は5分ごとに確認します。取得に失敗した場合はその状態を表示します。CSV出力は全履歴・基準日・出所を含みます。持ち込みCSVはブラウザ内の一時データです。"]
      ].map(([title, text]) => <details className="breadth-disclosure" key={title}><summary>{title}</summary><p>{text}</p></details>)}</section>
    </>}

    <div className="breadth-sources"><strong>出典・計算：</strong><a href={snapshot.source.validation.url} target="_blank" rel="noreferrer">日経平均プロフィル・日次サマリー</a> ／ <a href={snapshot.source.constituents.url} target="_blank" rel="noreferrer">公式構成銘柄</a> ／ <a href={snapshot.source.prices.url} target="_blank" rel="noreferrer">トレーダーズ・ウェブ・225社株価</a>（{snapshot.observedAt.replace("T", " ").replace("+09:00", " JST")}観測）。均等加重指数・中央値・指数値はMarket Noteの独自計算。日経の公式指数ではありません。</div>
  </>;
}
