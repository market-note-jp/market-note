import type { ArticleTable } from "../../lib/article-content";

/** Visualizes only explicit percentage changes already present in the source table. */
export default function SnapshotChart({ table }: { table: ArticleTable }) {
  const indices = table.rows.filter(row => /^(S&P500|NASDAQ総合|NYダウ|日経平均)$/.test(row[0]));
  const points = indices.flatMap(row => {
    const match = row[1]?.match(/([+−-]\d+(?:\.\d+)?)%/);
    return match ? [{ label: row[0], change: Number(match[1].replace("−", "-")), text: match[1] + "%", asof: row[2] }] : [];
  });
  if (points.length < 2) return null;
  const max = Math.max(...points.map(point => Math.abs(point.change)), .01);
  return <figure className="snapshot-chart">
    <figcaption><span className="kicker">MARKET AT A GLANCE</span><strong>主要株価指数の前日比</strong><span>上表の記載値を可視化 / リアルタイムデータではありません</span></figcaption>
    <div className="snapshot-bars">{points.map(point => <div className="snapshot-bar-row" key={point.label}><span>{point.label}</span><div><i style={{ width: `${Math.abs(point.change) / max * 100}%` }} className={point.change < 0 ? "is-negative" : ""} /></div><strong>{point.text}</strong><small>{point.asof}</small></div>)}</div>
  </figure>;
}
