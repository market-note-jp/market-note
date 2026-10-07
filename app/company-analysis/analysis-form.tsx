"use client";

import { FormEvent, useMemo, useState } from "react";
import { CalendarDays, Check, Search } from "lucide-react";

const monthOptions = ["自動推定", "すべての月", ...Array.from({ length: 12 }, (_, index) => `${index + 1}月`)];
import { requestAnalysis } from "./analysis-client.mjs";

type SearchResponse = {
  company?: { name?: string; edinetCode?: string; secCode?: string };
  documents?: Array<{ docId?: string; docDescription?: string; docTypeCode?: string; periodEnd?: string; submitDateTime?: string }>;
  analysis?: {
    latest?: { companyName?: string; edinetCode?: string; secCode?: string; periodEnd?: string; fiscalYear?: string };
    metrics?: Array<{ key?: string; label?: string; value?: string }>;
    anomalies?: Array<{ year?: string; title?: string; message?: string; severity?: string }>;
    comments?: string[];
    records?: AnalysisRecord[];
    priceIndicators?: PriceIndicators;
    dcf?: {
      summary?: DcfSummaryRow[];
      assumptions?: Record<string, number | null>;
      historical?: DcfHistoryRow[];
      latest?: Record<string, number | string | null>;
      model?: DcfModel | null;
      suitability?: { status?: string; message?: string };
    };
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

type DcfSummaryRow = {
  key?: string;
  指標?: string;
  平均?: number | null;
  中央値?: number | null;
  最小値?: number | null;
  最大値?: number | null;
  件数?: number | null;
};

type PriceIndicators = {
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

type DcfHistoryRow = Record<string, string | number | null>;

type DcfModel = {
  error?: string;
  assumptions?: Record<string, number | null>;
  valuation?: Record<string, number | string | null>;
  forecast?: Array<Record<string, number | string | null>>;
  sensitivity?: Array<Record<string, number | string | null>>;
};

const amountColumns: Array<{ key: keyof AnalysisRecord; label: string }> = [
  { key: "revenue", label: "売上高" },
  { key: "operating_income", label: "営業利益" },
  { key: "ordinary_income", label: "経常利益" },
  { key: "pretax_income", label: "税引前利益" },
  { key: "net_income", label: "当期純利益" },
  { key: "total_assets", label: "総資産" },
  { key: "equity", label: "自己資本" },
  { key: "operating_cf", label: "営業CF" },
  { key: "investing_cf", label: "投資CF" },
  { key: "capex", label: "CAPEX" },
  { key: "depreciation", label: "減価償却費" },
  { key: "interest_bearing_debt", label: "有利子負債" },
  { key: "cash_and_equivalents", label: "現金等" },
  { key: "fcf", label: "FCF" },
];

const ratioColumns: Array<{ key: keyof AnalysisRecord; label: string }> = [
  { key: "sales_growth_rate", label: "売上成長率" },
  { key: "operating_margin", label: "営業利益率" },
  { key: "net_margin", label: "純利益率" },
  { key: "roe", label: "ROE" },
  { key: "roa", label: "ROA" },
  { key: "roic", label: "ROIC" },
  { key: "equity_ratio", label: "自己資本比率" },
  { key: "operating_cf_margin", label: "営業CFマージン" },
  { key: "interest_bearing_debt_ratio", label: "有利子負債比率" },
];

function toDateInput(date: Date) {
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`;
}

function compactAmount(value?: number | null) {
  if (!Number.isFinite(value ?? NaN)) return "-";
  return `${Math.round(Number(value) / 1_000_000).toLocaleString("ja-JP")}百万円`;
}

function percent(value?: number | null) {
  if (!Number.isFinite(value ?? NaN)) return "-";
  return `${Number(value).toFixed(1)}%`;
}

function ratioFromDcf(value?: number | null) {
  if (!Number.isFinite(value ?? NaN)) return "-";
  return `${(Number(value) * 100).toFixed(1)}%`;
}

function yen(value?: number | null) {
  if (!Number.isFinite(value ?? NaN)) return "-";
  return `${Math.round(Number(value)).toLocaleString("ja-JP")}円`;
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

function getDcfMetric(row: DcfSummaryRow, key: keyof DcfSummaryRow) {
  const value = row[key];
  return typeof value === "number" ? value : null;
}

function dcfSummaryValue(row: DcfSummaryRow, field: "平均" | "中央値") {
  const value = getDcfMetric(row, field);
  return /rate|ratio|margin|roic|wacc|growth/.test(row.key || "") ? ratioFromDcf(value) : compactAmount(value);
}

function AnalysisDetails({ analysis }: { analysis: NonNullable<SearchResponse["analysis"]> }) {
  const records = sortedRecords(analysis.records || []);
  const dcfRows = analysis.dcf?.summary || [];
  const dcfLatest = analysis.dcf?.latest || {};
  const dcfHistory = analysis.dcf?.historical || [];
  const dcfModel = analysis.dcf?.model;
  const [currentSharePrice, setCurrentSharePrice] = useState("");
  const [manualShares, setManualShares] = useState("");
  const latestRecord = records.at(-1);
  const priceIndicators = analysis.priceIndicators || {};
  const enteredShares = manualShares.trim() ? numeric(Number(manualShares)) : null;
  const shares = manualShares.trim() ? (enteredShares !== null && enteredShares > 0 ? enteredShares : null) : numeric(priceIndicators.shares_outstanding) || numeric(latestRecord?.shares_for_valuation) || numeric(dcfLatest.shares_for_valuation);
  const price = currentSharePrice.trim() ? numeric(Number(currentSharePrice)) : null;
  const eps = shares && numeric(latestRecord?.net_income) !== null ? numeric(latestRecord?.net_income)! / shares : manualShares.trim() ? null : numeric(priceIndicators.eps);
  const equity = numeric(latestRecord?.equity) ?? numeric(latestRecord?.net_assets);
  const bps = shares && equity !== null ? equity / shares : manualShares.trim() ? null : numeric(priceIndicators.bps);
  const per = price !== null && price > 0 && eps !== null && eps > 0 ? price / eps : null;
  const pbr = price !== null && price > 0 && bps !== null && bps > 0 ? price / bps : null;

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
      {records.some(record => numeric(record.revenue) === null) ? <p className="analysis-note" role="status">売上高を取得できていない年度があります。該当年度の成長率・利益率やDCFは算出できない場合があります。</p> : null}
      <p className="analysis-note">上のFCFと年度別財務表のFCFは営業CF＋投資CFです。DCFで用いる事業キャッシュフローとは計算方法が異なります。</p>
      {analysis.dcf?.suitability?.status === "requires_business_separation" ? <p className="analysis-note" role="status">金融事業を含む全社の指標です。ROICや自動分析コメントを通常の事業会社と比較する際は、事業と負債の範囲を確認してください。全社DCFの株価は保留しています。</p> : null}

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
            <span>株式数を手入力する場合</span>
            <input
              type="number" min="1" step="1"
              inputMode="numeric"
              value={manualShares}
              onChange={(event) => setManualShares(event.target.value)}
              placeholder={shares ? shareCount(shares) : "XBRLから取得できない場合に入力"}
            />
          </label>
        </div>
        <div className="dcf-latest-grid price-grid">
          <div><span>自己株式を除く株式数</span><strong>{shareCount(shares)}</strong></div>
          <div><span>参考EPS（期末株式数ベース）</span><strong>{yen(eps)}</strong></div>
          <div><span>BPS</span><strong>{yen(bps)}</strong></div>
          <div><span>参考実績PER</span><strong>{multiple(per)}</strong></div>
          <div><span>PBR</span><strong>{multiple(pbr)}</strong></div>
          <div><span>株式数の取得元</span><strong>{enteredShares !== null && enteredShares > 0 ? "手入力" : priceIndicators.share_count_source || (shares ? "取得年度の株式数" : "-")}</strong></div>
        </div>
        <p className="analysis-note">参考EPSは純利益を期末株式数で割った試算で、公表EPSの期中平均株式数とは異なります。株式分割があった場合は、株価と株式数の基準をそろえてください。</p>
        {priceIndicators.warnings?.length ? (
          <ul className="compact-note-list">
            {priceIndicators.warnings.map((warning) => <li key={warning}>{warning}</li>)}
          </ul>
        ) : null}
      </section>

      {records.length ? (
        <>
          <section className="analysis-detail-section">
            <div className="analysis-subheading">
              <div>
                <h3>年度別の財務指標</h3>
                <p>取得した有価証券報告書から主要な財務データを年度別に整理しています。</p>
              </div>
            </div>
            <div className="analysis-table-wrap" tabIndex={0} role="region" aria-label="財務データ表。左右にスクロールできます">
              <table className="analysis-table">
                <thead>
                  <tr>
                    <th>決算期</th>
                    {amountColumns.map((column) => <th key={column.key}>{column.label}</th>)}
                    {ratioColumns.map((column) => <th key={column.key}>{column.label}</th>)}
                  </tr>
                </thead>
                <tbody>
                  {records.map((record) => (
                    <tr key={periodLabel(record)}>
                      <td>{periodLabel(record)}</td>
                      {amountColumns.map((column) => <td key={column.key}>{compactAmount(record[column.key] as number | null)}</td>)}
                      {ratioColumns.map((column) => <td key={column.key}>{percent(record[column.key] as number | null)}</td>)}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>

          <section className="analysis-detail-section">
            <div className="analysis-subheading">
              <div>
                <h3>売上・営業利益・FCFの推移</h3>
                <p>金額項目の推移を比較し、成長性とキャッシュ創出力を確認できます。</p>
              </div>
            </div>
            {renderBarChart(records, [
              { key: "revenue", label: "売上高", className: "bar-blue" },
              { key: "operating_income", label: "営業利益", className: "bar-green" },
              { key: "fcf", label: "FCF", className: "bar-ink" },
            ], "amount")}
          </section>

          <section className="analysis-detail-section">
            <div className="analysis-subheading">
              <div>
                <h3>ROE / ROIC / 自己資本比率</h3>
                <p>収益性と財務安全性のバランスを年度別に確認できます。</p>
              </div>
            </div>
            {renderBarChart(records, [
              { key: "roe", label: "ROE", className: "bar-blue" },
              { key: "roic", label: "ROIC", className: "bar-green" },
              { key: "equity_ratio", label: "自己資本比率", className: "bar-warning" },
            ], "ratio")}
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

      {dcfRows.length || Object.keys(dcfLatest).length || dcfHistory.length || dcfModel ? (
        <section className="analysis-detail-section">
          <div className="analysis-subheading">
            <div>
              <h3>DCF分析</h3>
            <p>過去実績をもとに、DCF前提・予測FCF・企業価値を確認できます。試算株価は仮定に基づく参考値です。</p>
            </div>
          </div>
          {dcfRows.length ? (
            <div className="dcf-summary-grid">
              {dcfRows.map((row) => (
                <div key={row.key || row.指標}>
                  <span>{row.指標 || row.key}</span>
                  <strong>{dcfSummaryValue(row, "平均")}</strong>
                  <small>中央値 {dcfSummaryValue(row, "中央値")}</small>
                </div>
              ))}
            </div>
          ) : null}
          {Object.keys(dcfLatest).length || dcfModel?.valuation ? (
            <div className="dcf-latest-grid">
              <div><span>DCF試算株価</span><strong>{yen(numeric(dcfModel?.valuation?.theoretical_share_price))}</strong></div>
              <div><span>企業価値</span><strong>{compactAmount(numeric(dcfModel?.valuation?.enterprise_value))}</strong></div>
              <div><span>株主価値</span><strong>{compactAmount(numeric(dcfModel?.valuation?.equity_value))}</strong></div>
              <div><span>予測FCF現在価値</span><strong>{compactAmount(numeric(dcfModel?.valuation?.forecast_fcf_pv_sum))}</strong></div>
              <div><span>TV現在価値</span><strong>{compactAmount(numeric(dcfModel?.valuation?.terminal_value_pv))}</strong></div>
              <div><span>仮定WACC</span><strong>{ratioFromDcf(numeric(dcfModel?.assumptions?.wacc))}</strong></div>
              <div><span>仮定の永続成長率</span><strong>{ratioFromDcf(numeric(dcfModel?.assumptions?.perpetual_growth_rate))}</strong></div>
              <div><span>計算対象</span><strong>{dcfLatest.row_count_before_dedupe ? `${dcfLatest.row_count_after_dedupe || "-"} / ${dcfLatest.row_count_before_dedupe}件` : "-"}</strong></div>
            </div>
          ) : null}
          {dcfModel?.error ? <div className="notice notice-error">{dcfModel.error}</div> : null}
          {!dcfModel?.error && analysis.dcf?.suitability?.message ? <p className="analysis-note" role="status">{analysis.dcf.suitability.message}</p> : null}
          {!dcfModel ? <p className="analysis-note" role="status">DCFの計算結果は取得できませんでした。売上高などの必須データや分析サービスの対応状況をご確認ください。</p> : null}
          {dcfHistory.length ? (
            <details className="analysis-details-toggle" open>
              <summary>DCF過去実績推移</summary>
              <div className="analysis-table-wrap" tabIndex={0} role="region" aria-label="財務データ表。左右にスクロールできます">
                <table className="analysis-table">
                  <thead>
                    <tr>
                      <th>決算期</th>
                      <th>売上成長率</th>
                      <th>営業利益率</th>
                      <th>実効税率</th>
                      <th>NOPAT</th>
                      <th>平均投下資本</th>
                      <th>CAPEX</th>
                      <th>設備投資率</th>
                      <th>運転資本率</th>
                      <th>DCF FCF</th>
                      <th>FCFマージン</th>
                      <th>ROIC</th>
                    </tr>
                  </thead>
                  <tbody>
                    {dcfHistory.map((row) => (
                      <tr key={`dcf-history-${row.period_end || row.fiscal_year}`}>
                        <td>{String(row.period_end || row.fiscal_year || "-")}</td>
                        <td>{ratioFromDcf(numeric(row.sales_growth_rate))}</td>
                        <td>{ratioFromDcf(numeric(row.operating_margin))}</td>
                        <td>{ratioFromDcf(numeric(row.effective_tax_rate))}</td>
                        <td>{compactAmount(numeric(row.dcf_nopat))}</td>
                        <td>{compactAmount(numeric(row.dcf_average_invested_capital))}</td>
                        <td>{compactAmount(numeric(row.capex_outflow))}</td>
                        <td>{ratioFromDcf(numeric(row.capex_rate))}</td>
                        <td>{ratioFromDcf(numeric(row.working_capital_ratio))}</td>
                        <td>{compactAmount(numeric(row.dcf_fcf))}</td>
                        <td>{ratioFromDcf(numeric(row.fcf_margin))}</td>
                        <td>{ratioFromDcf(numeric(row.roic))}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </details>
          ) : null}
          {dcfModel?.forecast?.length ? (
            <details className="analysis-details-toggle" open>
              <summary>DCF予測テーブル</summary>
              <div className="analysis-table-wrap" tabIndex={0} role="region" aria-label="財務データ表。左右にスクロールできます">
                <table className="analysis-table">
                  <thead>
                    <tr>
                      <th>年</th>
                      <th>売上成長率</th>
                      <th>営業利益率</th>
                      <th>売上高</th>
                      <th>営業利益</th>
                      <th>NOPAT</th>
                      <th>減価償却費</th>
                      <th>CAPEX</th>
                      <th>運転資本増減</th>
                      <th>FCF</th>
                      <th>割引係数</th>
                      <th>割引後FCF</th>
                    </tr>
                  </thead>
                  <tbody>
                    {dcfModel.forecast.map((row) => (
                      <tr key={`forecast-${row.year}`}>
                        <td>{row.year ? `${row.year}年目` : "-"}</td>
                        <td>{ratioFromDcf(numeric(row.sales_growth_rate))}</td>
                        <td>{ratioFromDcf(numeric(row.operating_margin))}</td>
                        <td>{compactAmount(numeric(row.revenue))}</td>
                        <td>{compactAmount(numeric(row.operating_income))}</td>
                        <td>{compactAmount(numeric(row.nopat))}</td>
                        <td>{compactAmount(numeric(row.depreciation))}</td>
                        <td>{compactAmount(numeric(row.capex))}</td>
                        <td>{compactAmount(numeric(row.change_in_working_capital))}</td>
                        <td>{compactAmount(numeric(row.fcf))}</td>
                        <td>{numeric(row.discount_factor)?.toFixed(3) || "-"}</td>
                        <td>{compactAmount(numeric(row.discounted_fcf))}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </details>
          ) : null}
          {dcfModel?.sensitivity?.length ? (
            <details className="analysis-details-toggle">
              <summary>感応度分析</summary>
              <div className="analysis-table-wrap" tabIndex={0} role="region" aria-label="財務データ表。左右にスクロールできます">
                <table className="analysis-table sensitivity-table">
                  <thead>
                    <tr>
                      {Object.keys(dcfModel.sensitivity[0]).map((key) => <th key={key}>{key}</th>)}
                    </tr>
                  </thead>
                  <tbody>
                    {dcfModel.sensitivity.map((row, index) => (
                      <tr key={`sensitivity-${index}`}>
                        {Object.entries(row).map(([key, value]) => (
                          <td key={key}>{key === "永続成長率" ? ratioFromDcf(numeric(value)) : yen(numeric(value))}</td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </details>
          ) : null}
        </section>
      ) : null}

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
    start.setFullYear(end.getFullYear() - 5);
    return { start: toDateInput(start), end: toDateInput(end) };
  }, []);
  const [edinetCode, setEdinetCode] = useState("");
  const [companyKeyword, setCompanyKeyword] = useState("");
  const [years, setYears] = useState("5");
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

      <fieldset className="month-fieldset">
        <legend>検索する提出月</legend>
        <p>通常は自動推定のままで検索できます。必要な場合は複数の月を選択できます。</p>
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

      </fieldset>
      {error ? <div className="notice notice-error" role="alert">{error}</div> : null}
      {loading ? <p className="analysis-loading" role="status">有価証券報告書を取得・分析しています。数分かかる場合があります。</p> : null}
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
