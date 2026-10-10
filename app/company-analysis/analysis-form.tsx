"use client";

import { FormEvent, useMemo, useState } from "react";
import { CalendarDays, Check, Search } from "lucide-react";

const monthOptions = ["自動推定", "すべての月", ...Array.from({ length: 12 }, (_, index) => `${index + 1}月`)];
import { requestAnalysis } from "./analysis-client.mjs";

type SearchResponse = {
  company?: { name?: string; edinetCode?: string; secCode?: string };
  documents?: Array<{ docId?: string; docDescription?: string; docTypeCode?: string; periodEnd?: string; submitDateTime?: string }>;
  analysis?: {
    profile?: "financial-statements";
    financialBusinessDetected?: boolean;
    latest?: { companyName?: string; edinetCode?: string; secCode?: string; periodEnd?: string; fiscalYear?: string };
    metrics?: Array<{ key?: string; label?: string; value?: string }>;
    anomalies?: Array<{ year?: string; title?: string; message?: string; severity?: string }>;
    comments?: string[];
    records?: AnalysisRecord[];
    priceIndicators?: PriceIndicators;

  } | null;
  message?: string;
  searchNote?: string;
};

type AnalysisRecord = {
  [key: string]: string | number | boolean | null | undefined;
  fiscal_year?: string;
  period_end?: string;
  unit?: string;
  revenue?: number | null;
  operating_income?: number | null;
  ordinary_income?: number | null;
  pretax_income?: number | null;
  income_taxes?: number | null;
  net_income?: number | null;
  total_assets?: number | null;
  net_assets?: number | null;
  equity?: number | null;
  operating_cf?: number | null;
  investing_cf?: number | null;
  financing_cf?: number | null;
  capex?: number | null;
  depreciation?: number | null;
  rnd_expenses?: number | null;
  inventories?: number | null;
  accounts_receivable?: number | null;
  accounts_payable?: number | null;
  interest_bearing_debt?: number | null;
  cash_and_equivalents?: number | null;
  sales_growth_rate?: number | null;
  operating_margin?: number | null;
  ordinary_margin?: number | null;
  pretax_margin?: number | null;
  net_margin?: number | null;
  fcf?: number | null;
  roe?: number | null;
  roa?: number | null;
  roic?: number | null;
  equity_ratio?: number | null;
  operating_cf_margin?: number | null;
  accounts_receivable_growth_rate?: number | null;
  inventory_growth_rate?: number | null;
  interest_bearing_debt_ratio?: number | null;
  roic_tax_rate?: number | null;
  roic_tax_source?: string | null;
  roic_uses_estimated_tax?: boolean | null;
  roic_profit_base?: string | null;
  nopat?: number | null;
  invested_capital?: number | null;
  previous_invested_capital?: number | null;
  average_invested_capital?: number | null;
  roic_invested_capital_formula?: string | null;
  roic_invested_capital_note?: string | null;
  roic_unavailable_reason?: string | null;
  issued_shares?: number | null;
  treasury_shares?: number | null;
  shares_for_valuation?: number | null;
};

type PriceIndicators = {
  eps_source?: string;
  bps_source?: string;
  current_share_price?: number | null;
  issued_shares?: number | null;
  treasury_shares?: number | null;
  shares_outstanding?: number | null;
  share_count_source?: string | null;
  eps?: number | null;
  bps?: number | null;
  per?: number | null;
  pbr?: number | null;
  period_end?: string | null;
  fiscal_year?: string | null;
  warnings?: string[];
};

type FinancialColumn = { key: keyof AnalysisRecord; label: string; format: "amount" | "ratio" | "yen" | "sharesThousands" | "text" | "date" };
const performanceColumns: FinancialColumn[] = [
  { key: "revenue", label: "売上高", format: "amount" },
  { key: "gross_profit", label: "売上総利益", format: "amount" },
  { key: "gross_margin", label: "粗利率", format: "ratio" },
  { key: "operating_income", label: "営業利益", format: "amount" },
  { key: "operating_margin", label: "営業利益率", format: "ratio" },
  { key: "ordinary_income", label: "経常利益", format: "amount" },
  { key: "ordinary_margin", label: "経常利益率", format: "ratio" },
  { key: "net_income", label: "純利益", format: "amount" },
  { key: "accounting_standard", label: "会計方式", format: "text" },
  { key: "source_updated_at", label: "原資料提出日", format: "date" },
];
const financialColumns: FinancialColumn[] = [
  { key: "reported_eps", label: "EPS（公表値・円）", format: "yen" },
  { key: "reported_bps", label: "BPS（公表値・円）", format: "yen" },
  { key: "roa_period_end", label: "ROA（期末総資産）", format: "ratio" },
  { key: "roe_period_end", label: "ROE（期末自己資本）", format: "ratio" },
  { key: "total_assets", label: "総資産", format: "amount" },
  { key: "equity_ratio", label: "自己資本比率", format: "ratio" },
  { key: "capital_stock", label: "資本金", format: "amount" },
  { key: "interest_bearing_debt", label: "有利子負債", format: "amount" },
  { key: "depreciation", label: "減価償却費・償却費", format: "amount" },
  { key: "issued_shares", label: "発行済株式総数（期末・千株）", format: "sharesThousands" },
];
const cashFlowColumns: FinancialColumn[] = [
  { key: "fcf", label: "フリーCF", format: "amount" },
  { key: "operating_cf", label: "営業CF", format: "amount" },
  { key: "investing_cf", label: "投資CF", format: "amount" },
  { key: "financing_cf", label: "財務CF", format: "amount" },
];

function financialCell(record: AnalysisRecord, column: FinancialColumn) {
  const value = record[column.key];
  if (column.format === "text") return typeof value === "string" && value ? value : "-";
  if (column.format === "date") return typeof value === "string" && value ? value.slice(0, 10) : "-";
  const number = numeric(value);
  if (column.format === "ratio") return percent(number);
  if (column.format === "yen") return yen(number);
  if (column.format === "sharesThousands") return number === null ? "-" : (number / 1000).toLocaleString("ja-JP", { maximumFractionDigits: 3 });
  return compactAmount(number);
}

function financialTable(records: AnalysisRecord[], columns: FinancialColumn[], label: string) {
  return <div className="analysis-table-wrap" tabIndex={0} role="region" aria-label={`${label}。左右にスクロールできます`}>
    <table className="analysis-table"><thead><tr><th>決算期（実績）</th>{columns.map(column => <th key={column.key}>{column.label}{column.format === "amount" ? "（百万円）" : ""}</th>)}</tr></thead>
      <tbody>{[...records].reverse().map(record => <tr key={`${label}-${periodLabel(record)}`}><td>{periodLabel(record)}</td>{columns.map(column => <td key={column.key}>{financialCell(record, column)}</td>)}</tr>)}</tbody>
    </table>
  </div>;
}

function toDateInput(date: Date) {
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`;
}

function compactAmount(value?: number | null) {
  if (!Number.isFinite(value ?? NaN)) return "-";
  return `${Math.round(Number(value) / 1_000_000).toLocaleString("ja-JP")}百万円`;
}

function percent(value?: number | null) {
  if (!Number.isFinite(value ?? NaN)) return "-";
  return `${Number(value).toFixed(2)}%`;
}

function yen(value?: number | null) {
  if (!Number.isFinite(value ?? NaN)) return "-";
  return `${Number(value).toLocaleString("ja-JP", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}円`;
}

function multiple(value?: number | null) {
  if (!Number.isFinite(value ?? NaN)) return "-";
  return `${Number(value).toFixed(2)}倍`;
}

function shareCount(value?: number | null) {
  if (!Number.isFinite(value ?? NaN)) return "-";
  return `${Math.round(Number(value)).toLocaleString("ja-JP")}株`;
}

function numeric(value: unknown) {
  return typeof value === "number" && Number.isFinite(value) ? value : null;
}

function periodLabel(record: AnalysisRecord) {
  return record.period_end?.slice(0, 10) || record.fiscal_year || "-";
}

function barHeight(value: number | null | undefined, maxValue: number) {
  if (!Number.isFinite(value ?? NaN) || maxValue <= 0) return "0%";
  return `${Math.min(50, (Math.abs(Number(value)) / maxValue) * 50)}%`;
}

function sortedRecords(records: AnalysisRecord[] = []) {
  return [...records].sort((a, b) => String(a.period_end || a.fiscal_year || "").localeCompare(String(b.period_end || b.fiscal_year || "")));
}

function renderBarChart(
  records: AnalysisRecord[],
  metrics: Array<{ key: keyof AnalysisRecord; label: string; className: string }>,
  mode: "amount" | "ratio",
) {
  const maxValue = Math.max(
    1,
    ...records.flatMap((record) => metrics.map((metric) => Math.abs(Number(record[metric.key]) || 0))),
  );

  return (
    <div className="analysis-chart" role="img" aria-label={metrics.map((metric) => metric.label).join("、") + "の推移"}>
      <div className="analysis-chart-bars">
        {records.map((record) => (
          <div className="analysis-chart-period" key={`${periodLabel(record)}-${metrics.map((metric) => metric.key).join("-")}`}>
            <div className="analysis-chart-column">
              {metrics.map((metric) => {
                const value = record[metric.key];
                const numericValue = typeof value === "number" ? value : null;
                return (
                  <div className="analysis-bar-slot" key={metric.key}><span
                    className={metric.className}
                    data-negative={numericValue !== null && numericValue < 0}
                    style={{ height: barHeight(numericValue, maxValue) }}
                    title={`${metric.label}: ${mode === "amount" ? compactAmount(numericValue) : percent(numericValue)}`}
                  /></div>
                );
              })}
            </div>
            <small>{periodLabel(record).slice(0, 4)}</small>
          </div>
        ))}
      </div>
      <div className="analysis-chart-legend">
        {metrics.map((metric) => (
          <span key={metric.key} className={metric.className}>{metric.label}</span>
        ))}
      </div>
    </div>
  );
}

function AnalysisDetails({ analysis }: { analysis: NonNullable<SearchResponse["analysis"]> }) {
  const records = sortedRecords((analysis.records || []).filter(record => record.record_type !== "forecast"));
  const [currentSharePrice, setCurrentSharePrice] = useState("");
  const [manualShares, setManualShares] = useState("");
  const latestRecord = records.at(-1);
  const priceIndicators = analysis.priceIndicators || {};
  const issuedShares = numeric(priceIndicators.issued_shares) ?? numeric(latestRecord?.issued_shares);
  const treasuryShares = numeric(priceIndicators.treasury_shares) ?? numeric(latestRecord?.treasury_shares);
  const enteredShares = manualShares.trim() ? numeric(Number(manualShares)) : null;
  const shares = manualShares.trim() ? (enteredShares !== null && enteredShares > 0 ? enteredShares : null) : numeric(priceIndicators.shares_outstanding) || numeric(latestRecord?.shares_for_valuation);
  const price = currentSharePrice.trim() ? numeric(Number(currentSharePrice)) : null;
  const reportedEps = numeric(latestRecord?.reported_eps);
  const reportedBps = numeric(latestRecord?.reported_bps);
  const estimatedEps = shares && numeric(latestRecord?.net_income) !== null ? numeric(latestRecord?.net_income)! / shares : null;
  const eps = manualShares.trim() ? estimatedEps : reportedEps ?? numeric(priceIndicators.eps) ?? estimatedEps;
  const equity = numeric(latestRecord?.equity) ?? numeric(latestRecord?.net_assets);
  const estimatedBps = shares && equity !== null ? equity / shares : null;
  const bps = manualShares.trim() ? estimatedBps : reportedBps ?? numeric(priceIndicators.bps) ?? estimatedBps;
  const usesReportedEps = !manualShares.trim() && (reportedEps !== null || priceIndicators.eps_source === "公表値");
  const usesReportedBps = !manualShares.trim() && (reportedBps !== null || priceIndicators.bps_source === "公表値");
  const per = price !== null && price > 0 && eps !== null && eps > 0 ? price / eps : null;
  const pbr = price !== null && price > 0 && bps !== null && bps > 0 ? price / bps : null;
  const priceWarnings = (priceIndicators.warnings || []).filter((warning) =>
    !(price !== null && price > 0 && warning.includes("現在株価が未入力")) &&
    !(shares !== null && shares > 0 && warning.includes("自己株式を除く株式数は未確定"))
  );

  if (!analysis.metrics?.length) return null;

  return (
    <div className="analysis-result-panel">
      <div className="analysis-result-heading">
        <div>
          <span>分析対象企業</span>
          <strong>{analysis.latest?.companyName || "分析対象企業"}</strong>
        </div>
        <small>{analysis.latest?.periodEnd ? `${analysis.latest.periodEnd} 期` : "直近年度"}</small>
      </div>

      <div className="analysis-metric-grid">
        {analysis.metrics.map((metric) => (
          <div key={metric.key || metric.label}>
            <span>{metric.label}</span>
            <strong>{metric.value || "-"}</strong>
          </div>
        ))}
      </div>
      <p className="analysis-note">通期実績を表示しています。金額は百万円、1株指標は円。取得できない項目は「-」で表示します。</p>
      {analysis.financialBusinessDetected ? <p className="analysis-note" role="status">金融事業を含む全社の指標です。ROICを比較する際は事業と負債の範囲を確認してください。</p> : null}

      <section className="analysis-detail-section">
        <div className="analysis-subheading">
          <div>
            <h3>株価指標</h3>
            <p>入力株価と直近年度の実績から参考PER / PBRを試算します。予想PERではありません。</p>
          </div>
        </div>
        <div className="price-input-grid">
          <label>
            <span>現在株価（円）</span>
            <input
              type="number" min="0" step="any"
              inputMode="decimal"
              value={currentSharePrice}
              onChange={(event) => setCurrentSharePrice(event.target.value)}
              placeholder="例: 3000"
            />
          </label>
          <label>
            <span>自己株式を除く株式数を手入力（株）</span>
            <input
              type="number" min="1" step="1"
              inputMode="numeric"
              value={manualShares}
              onChange={(event) => setManualShares(event.target.value)}
              placeholder={shares ? shareCount(shares) : "XBRLから取得できない場合に入力"}
            />
          </label>
        </div>
        <div className="analysis-value-grid price-grid">
          <div><span>発行済株式総数（自己株式を含む）</span><strong>{shareCount(issuedShares)}</strong></div>
          <div><span>自己株式数</span><strong>{shareCount(treasuryShares)}</strong></div>
          <div><span>自己株式を除く株式数</span><strong>{shareCount(shares)}</strong></div>
          <div><span>{usesReportedEps ? "EPS（公表値）" : "参考EPS（期末株式数ベース）"}</span><strong>{yen(eps)}</strong></div>
          <div><span>{usesReportedBps ? "BPS（公表値）" : "参考BPS（期末株式数ベース）"}</span><strong>{yen(bps)}</strong></div>
          <div><span>参考実績PER</span><strong>{multiple(per)}</strong></div>
          <div><span>PBR</span><strong>{multiple(pbr)}</strong></div>
          <div><span>自己株式を除く株式数の取得元</span><strong>{enteredShares !== null && enteredShares > 0 ? "手入力" : priceIndicators.share_count_source || (shares ? "取得年度の株式数" : "-")}</strong></div>
        </div>
        {issuedShares !== null && treasuryShares === null ? <p className="analysis-note" role="status">発行済株式総数は取得できていますが、自己株式数を確定できません。公表EPS・BPSが取得できた場合は参考PER/PBRを計算できます。期末株式数から試算する場合は、自己株式を除く株式数を確認して入力してください。</p> : null}
        <p className="analysis-note">EPS・BPSは公表値を優先します。株式数を手入力した場合は期末株式数で試算します。各年度の公表値は原資料の株式分割調整基準に従うため、現在株価との基準を確認してください。</p>
        {priceWarnings.length ? (
          <ul className="compact-note-list">
            {priceWarnings.map((warning) => <li key={warning}>{warning}</li>)}
          </ul>
        ) : null}
      </section>

      {records.length ? (
        <>
          <section className="analysis-detail-section">
            <div className="analysis-subheading"><div><h3>業績</h3><p>売上・利益・利益率と会計方式。原資料提出日はEDINETへの提出日です。</p></div></div>
            {financialTable(records, performanceColumns, "業績データ表")}
            {renderBarChart(records, [{ key: "revenue", label: "売上高", className: "bar-blue" }, { key: "operating_income", label: "営業利益", className: "bar-green" }, { key: "net_income", label: "純利益", className: "bar-ink" }], "amount")}
          </section>
          <section className="analysis-detail-section">
            <div className="analysis-subheading"><div><h3>財務</h3><p>公表EPS・BPS、財務構成、発行済株式総数。資本金は提出会社の額です。</p></div></div>
            {financialTable(records, financialColumns, "財務データ表")}
            <p className="analysis-note">この表のROA・ROEは純利益÷期末総資産・期末自己資本です。上のROEカードと下の資本効率グラフは期首・期末平均を使用します。EPS・BPSは最新取得書類に再掲された公表値を優先し、再掲値がない年度は当該年度の原資料を使います。発行済株式総数は自己株式を含む期末実数で、EPS・BPSの株式分割調整後の基準と異なる場合があります。</p>
            {renderBarChart(records, [{ key: "roe", label: "ROE（平均自己資本）", className: "bar-blue" }, { key: "roic", label: "ROIC", className: "bar-green" }, { key: "equity_ratio", label: "自己資本比率", className: "bar-warning" }], "ratio")}
          </section>
          <section className="analysis-detail-section">
            <div className="analysis-subheading"><div><h3>キャッシュフロー</h3><p>フリーCFは営業CF＋投資CFで計算します。</p></div></div>
            {financialTable(records, cashFlowColumns, "キャッシュフローデータ表")}
            {renderBarChart(records, [{ key: "operating_cf", label: "営業CF", className: "bar-blue" }, { key: "investing_cf", label: "投資CF", className: "bar-green" }, { key: "fcf", label: "フリーCF", className: "bar-ink" }], "amount")}
          </section>
          <section className="analysis-detail-section">
            <div className="analysis-subheading">
              <div>
                <h3>ROIC計算内訳</h3>
                <p>NOPAT、投下資本、税率の前提を年度別に確認できます。</p>
              </div>
            </div>
            <div className="analysis-table-wrap" tabIndex={0} role="region" aria-label="財務データ表。左右にスクロールできます">
              <table className="analysis-table compact-analysis-table">
                <thead>
                  <tr>
                    <th>決算期</th>
                    <th>NOPAT</th>
                    <th>投下資本</th>
                    <th>平均投下資本</th>
                    <th>税率</th>
                    <th>税率根拠</th>
                    <th>利益ベース</th>
                    <th>ROIC</th>
                    <th>補足</th>
                  </tr>
                </thead>
                <tbody>
                  {records.map((record) => (
                    <tr key={`roic-${periodLabel(record)}`}>
                      <td>{periodLabel(record)}</td>
                      <td>{compactAmount(numeric(record.nopat))}</td>
                      <td>{compactAmount(numeric(record.invested_capital))}</td>
                      <td>{compactAmount(numeric(record.average_invested_capital))}</td>
                      <td>{percent(numeric(record.roic_tax_rate))}</td>
                      <td>{record.roic_tax_source || "-"}</td>
                      <td>{record.roic_profit_base || "-"}</td>
                      <td>{percent(numeric(record.roic))}</td>
                      <td>{record.roic_unavailable_reason || record.roic_invested_capital_note || record.roic_invested_capital_formula || "-"}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>
        </>
      ) : null}

      {records.length ? <details className="document-details"><summary>原資料・取得基準を確認する</summary><ul className="compact-note-list">{[...records].reverse().map(record => <li key={`source-${periodLabel(record)}`}>
        {periodLabel(record)}：{record.consolidation_scope || "連結区分未取得"}／{record.accounting_standard || "会計方式未取得"}／提出日 {String(record.source_updated_at || record.submit_date_time || "-").slice(0, 10)} {typeof record.source_url === "string" && /^https:\/\/disclosure2dl\.edinet-fsa\.go\.jp\//.test(record.source_url) ? <a href={record.source_url} target="_blank" rel="noreferrer">有価証券報告書</a> : null}
        {typeof record.reported_eps_source_doc_id === "string" && /^[A-Z0-9]{8}$/.test(record.reported_eps_source_doc_id) ? <>／<a href={`https://disclosure2dl.edinet-fsa.go.jp/searchdocument/pdf/${record.reported_eps_source_doc_id}.pdf`} target="_blank" rel="noreferrer">EPS再掲元</a></> : null}
        {typeof record.reported_bps_source_doc_id === "string" && /^[A-Z0-9]{8}$/.test(record.reported_bps_source_doc_id) ? <>／<a href={`https://disclosure2dl.edinet-fsa.go.jp/searchdocument/pdf/${record.reported_bps_source_doc_id}.pdf`} target="_blank" rel="noreferrer">BPS再掲元</a></> : null}
      </li>)}</ul></details> : null}

      {analysis.comments?.length || analysis.anomalies?.length ? (
        <section className="analysis-detail-section two-panel-analysis">
          {analysis.comments?.length ? (
            <div className="analysis-comments">
              <strong>自動分析コメント</strong>
              <ul>
                {analysis.comments.map((comment) => <li key={comment}>{comment}</li>)}
              </ul>
            </div>
          ) : null}

          <div className={`analysis-alerts ${analysis.anomalies?.length ? "" : "quiet"}`}>
            <strong>異常検知</strong>
            {analysis.anomalies?.length ? (
              <ul>
                {analysis.anomalies.slice(0, 5).map((item) => (
                  <li key={`${item.year}-${item.title}`}>{item.year} - {item.title}: {item.message}</li>
                ))}
              </ul>
            ) : (
              <p>{Array.isArray(analysis.anomalies) ? "取得できた項目の範囲で、大きな異常値は検出されませんでした。欠損項目は判定対象外です。" : "異常検知の結果は取得できませんでした。"}</p>
            )}
          </div>
        </section>
      ) : null}
    </div>
  );
}

export function AnalysisForm() {
  const defaultDates = useMemo(() => {
    const end = new Date();
    const start = new Date(end);
    start.setFullYear(end.getFullYear() - 3);
    return { start: toDateInput(start), end: toDateInput(end) };
  }, []);
  const [edinetCode, setEdinetCode] = useState("");
  const [companyKeyword, setCompanyKeyword] = useState("");
  const [years, setYears] = useState("3");
  const [includeAmendments, setIncludeAmendments] = useState(false);
  const [autoAnalyze, setAutoAnalyze] = useState(true);
  const [startDate, setStartDate] = useState(defaultDates.start);
  const [endDate, setEndDate] = useState(defaultDates.end);
  const [months, setMonths] = useState<string[]>(["自動推定"]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [result, setResult] = useState<SearchResponse | null>(null);

  function toggleMonth(option: string) {
    setMonths((current) => {
      if (option === "自動推定" || option === "すべての月") {
        return current.includes(option) ? [] : [option];
      }
      const numbered = current.filter((value) => value !== "自動推定" && value !== "すべての月");
      return numbered.includes(option) ? numbered.filter((value) => value !== option) : [...numbered, option];
    });
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    setResult(null);
    if (!edinetCode.trim() && !companyKeyword.trim()) {
      setError("EDINETコードまたは企業名キーワードを入力してください。");
      return;
    }
    if (months.length === 0) {
      setError("検索する提出月を選択してください。");
      return;
    }

    if (!startDate || !endDate || startDate > endDate) {
      setError("検索開始日は終了日以前の日付を指定してください。");
      return;
    }
    setLoading(true);
    try {
      const payload = {
        edinetCode: edinetCode.trim(),
        companyKeyword: companyKeyword.trim(),
        years: Number(years),
        includeAmendments,
        autoAnalyze,
        startDate,
        endDate,
        submissionMonths: months,
      };
      const data = await requestAnalysis(payload) as SearchResponse;
      setResult(data);
    } catch (reason) {
      setError(reason instanceof Error ? reason.message : "検索を実行できませんでした。");
    } finally {
      setLoading(false);
    }
  }

  return (
    <form className="analysis-form" onSubmit={handleSubmit} aria-busy={loading}>
      <fieldset className="analysis-inputs" disabled={loading}>
      <div className="form-grid two-columns">
        <label>
          <span>EDINETコード</span>
          <input autoComplete="off" pattern="[Ee][0-9]{5}" title="Eから始まる5桁の数字（例：E02144）" value={edinetCode} onChange={(event) => setEdinetCode(event.target.value)} placeholder="例: E02144" />
        </label>
        <label>
          <span>企業名キーワード</span>
          <input value={companyKeyword} onChange={(event) => setCompanyKeyword(event.target.value)} placeholder="例: トヨタ自動車" />
        </label>
      </div>

      <div className="form-grid three-columns">
        <label>
          <span>分析期間</span>
          <select value={years} onChange={(event) => { setYears(event.target.value); const start = new Date(`${endDate}T12:00:00`); start.setFullYear(start.getFullYear() - Number(event.target.value)); setStartDate(toDateInput(start)); }}>
            {Array.from({ length: 10 }, (_, index) => index + 1).map((year) => (
              <option key={year} value={year}>{year}年</option>
            ))}
          </select>
        </label>
        <label>
          <span><CalendarDays size={16} aria-hidden="true" /> 検索開始日</span>
          <input type="date" value={startDate} onChange={(event) => setStartDate(event.target.value)} />
        </label>
        <label>
          <span><CalendarDays size={16} aria-hidden="true" /> 検索終了日</span>
          <input type="date" value={endDate} onChange={(event) => setEndDate(event.target.value)} />
        </label>
      </div>

      <fieldset className="month-fieldset" aria-describedby="submission-month-help submission-month-timing">
        <legend>検索する提出月</legend>
        <p id="submission-month-help">通常は自動推定のままで検索できます。必要な場合は複数の月を選択できます。</p>
        <p id="submission-month-timing">有価証券報告書は原則、決算日から3か月以内に提出されます。3月決算なら6月が目安です。見つからない場合は、提出延期や訂正報告書なども考慮して、7月など前後の月も確認してください。</p>
        <div className="month-options">
          {monthOptions.map((option) => (
            <label key={option} className="check-option compact">
              <input type="checkbox" checked={months.includes(option)} onChange={() => toggleMonth(option)} />
              <span>{option}</span>
            </label>
          ))}
        </div>
      </fieldset>

      <div className="form-checks">
        <label className="check-option">
          <input type="checkbox" checked={includeAmendments} onChange={(event) => setIncludeAmendments(event.target.checked)} />
          <span>訂正有価証券報告書も含める</span>
        </label>
        <label className="check-option">
          <input type="checkbox" checked={autoAnalyze} onChange={(event) => setAutoAnalyze(event.target.checked)} />
          <span>検索後に自動で分析する</span>
        </label>
      </div>

      <p className="analysis-note">業績・財務・キャッシュフローの通期実績とROICを取得します。標準は3年分で、1〜10年に変更できます。</p>

      </fieldset>
      {error ? <div className="notice notice-error" role="alert">{error}</div> : null}
      {loading ? <p className="analysis-loading" role="status">有価証券報告書を取得・分析しています。初回は提出日の確認に時間がかかるため、最大10分待ちます。この画面を開いたままお待ちください。</p> : null}
      <button type="submit" className="button button-primary form-submit" disabled={loading}>
        <Search size={18} aria-hidden="true" /> {loading ? "検索しています..." : "企業を検索する"}
      </button>

      {result ? (
        <section className="search-result" aria-live="polite">
          <div className="result-title"><Check size={20} aria-hidden="true" /><strong>{result.documents?.length ? "検索が完了しました" : "該当する書類がありません"}</strong></div>
          <p>{result.company?.name || companyKeyword || edinetCode}の有価証券報告書を{result.documents?.length || 0}件取得しました。</p>
          {!result.documents?.length ? <p>企業名・検索期間・提出月を確認して、もう一度検索してください。</p> : null}
          {result.searchNote ? <small>{result.searchNote}</small> : null}

          {result.analysis ? <AnalysisDetails analysis={result.analysis} /> : null}

          {result.documents?.length ? (
            <details className="document-details">
              <summary>取得した書類を確認する</summary>
              <div className="document-list">
                {result.documents.map((document) => (
                  <div key={document.docId} className="document-row">
                    <strong>{document.docDescription || "有価証券報告書"}</strong>
                    <span>{document.docId}</span>
                    <small>{document.periodEnd || "-"} / {document.submitDateTime || "-"}</small>
                  </div>
                ))}
              </div>
            </details>
          ) : null}
        </section>
      ) : null}
    </form>
  );
}
