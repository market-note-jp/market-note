import type { Metadata } from "next";
import Link from "next/link";
import data from "../airi-data.json";
import Freshness from "./freshness";
import Methodology from "./methodology";
import "./airi.css";

export const metadata: Metadata = {
  title: "AIRI | AI株リスク指標 — Market Note",
  description: "AI関連8社の過熱度・脆弱性・悪化兆候を、実データと出典から追跡する研究版指標。週次の記録と算出方法を公開。",
};

type Metric = {key:string;label:string;axis:string;value:number|null;score:number|null;history_n:number;error:string|null;source:string|null;observed_at:string|null};
type Axis = {score:number|null;coverage:number};
type Release = {as_of:string;airi:number|null;axes:Record<string,Axis>;coverage:number;observed_count:number};
type AiriData = Release & {checked_on:string;metrics:Metric[];previous_change:number|null;change_note:string;history:Release[];price_collection:{status?:string};model_version:string};
const snapshot = data as unknown as AiriData;
const axisNames = ["過熱度", "脆弱性", "悪化兆候"];
const explanations = ["価格や資金流入に、期待がどれほど織り込まれているか。", "投資負担・負債・金利・連動性から、ショックへの弱さを測る。", "利益予想・信用・株価の広がりに、悪化が表れているか。"];
const units: Record<string,string> = {forward_pe:"倍",ma200_gap_pct:"%",flow_4w_pct:"%",capex_ocf_pct:"%",net_debt_ebitda:"倍",downside_correlation:"",real_yield_pct:"%",eps_downgrade_breadth_pct:"pt",hy_change_3m_bp:"bp",below_ma200_pct:"%"};
const fmt = (n:number|null) => n === null ? "—" : n.toFixed(1);

export default function AiriPage() {
  const scored=snapshot.metrics.filter(m=>m.score!==null).length;
  const plotted=snapshot.history.filter(r=>r.airi!==null);
  return <main className="airi-page content-width">
    <Link className="airi-back" href="/">Market Note ホームへ</Link>
    <header className="airi-heading"><div><p className="kicker">AI RISK INDEX</p><h1>AIRI <span>AI株リスク指標</span></h1><p>期待の膨張、ショックへの弱さ、悪化の兆候を分けて追跡する。</p></div><span className="airi-version">研究版 v{snapshot.model_version}</span></header>
    <div className="airi-meta"><span>最終確認 <time dateTime={snapshot.checked_on}>{snapshot.checked_on}</time></span><span>毎週土曜の午前に更新・日本時間</span><a href="#methodology">算出方法を見る ↓</a></div>
    <Freshness checkedOn={snapshot.checked_on}/>
    {snapshot.price_collection.status==='failed' && <p className="airi-notice" role="status">今回の株価取得は完了していません。確認済みの過去値は観測日付きで保持し、古すぎる値は計算から除外しています。</p>}
    <section className="airi-overview" aria-label="AIRIの現在値">
      <div className="airi-total"><p>総合 AIRI</p><div className="airi-number">{fmt(snapshot.airi)}<small>/ 100</small></div><span>{snapshot.airi===null ? "算出待ち・必要なデータと履歴を収集中" : "過去の分布に対する相対スコア"}</span><p className="airi-small">前週差 {snapshot.previous_change===null?"—":`${snapshot.previous_change>0?"+":""}${snapshot.previous_change.toFixed(1)} pt`}</p></div>
      <div className="airi-overview-copy"><h2>スコアは暴落確率ではありません</h2><p>100点は、参照する過去の値よりリスク要因が強いことを示します。「100%下落する」という意味ではありません。</p><p>現在値を確認済み <strong>{snapshot.observed_count}/10項目</strong> ／ 履歴がそろい採点可能 <strong>{scored}/10項目</strong></p><p className="airi-small">{snapshot.change_note}</p></div>
    </section>
    <section className="airi-axes" aria-label="3つの評価軸">{axisNames.map((name,i)=>{const axis=snapshot.axes[name];return <article key={name}><div className="airi-axis-title"><span>0{i+1}</span><h2>{name}</h2></div><div className="airi-axis-score">{fmt(axis.score)}<small>/ 100</small></div>{axis.score!==null?<meter min="0" max="100" value={axis.score} aria-label={`${name} ${axis.score.toFixed(1)}点`}/>:<p className="airi-pending">算出に必要な項目が不足</p>}<p>{explanations[i]}</p><p className="airi-small">採点可能な項目 {(axis.coverage*100).toFixed(0)}%</p></article>})}</section>
    <section className="airi-section" aria-labelledby="inputs-heading"><div className="airi-section-heading"><h2 id="inputs-heading">何を見ているか</h2><p>不足をゼロ点として扱わず、値と出典を残します。</p></div><div className="airi-table-wrap"><table><thead><tr><th scope="col">項目</th><th scope="col">実測値</th><th scope="col">スコア</th><th scope="col">観測日</th><th scope="col">状態・出典</th></tr></thead><tbody>{snapshot.metrics.map(m=>{
      const source=m.source?.match(/^https:\/\/[^\s]+/)?.[0];
      return <tr key={m.key}><th scope="row"><span className="airi-axis-label">{m.axis}</span>{m.label}</th><td>{m.value===null?"—":`${m.value.toFixed(2)}${units[m.key]}`}</td><td>{fmt(m.score)}</td><td>{m.observed_at??"—"}</td><td><span>{m.value===null?"データ未取得":m.score===null?`月次履歴 ${m.history_n}/36件以上が必要`:`有効・月次履歴 ${m.history_n}件`}</span>{m.error && m.value===null && <small>{m.error}</small>}{source && <a href={source} target="_blank" rel="noreferrer">出典を確認 ↗</a>}</td></tr>;
    })}</tbody></table></div></section>
    <section className="airi-section" aria-labelledby="history-heading"><div className="airi-section-heading"><h2 id="history-heading">週次の記録</h2><p>初回からの記録を保存。架空の過去スコアは表示しません。</p></div>
      {plotted.length<2 && <p className="airi-history-empty">推移グラフは、総合スコアが算出された記録が2回以上そろうと表示します。</p>}
      {plotted.length>=2 && <svg className="airi-chart" viewBox="0 0 800 220" role="img" aria-label="AIRI総合スコアの週次推移。正確な値は下の表を参照。"><text x="0" y="20">100</text><text x="0" y="200">0</text><line x1="40" x2="780" y1="20" y2="20"/><line x1="40" x2="780" y1="200" y2="200"/>{snapshot.history.map((r,i)=>{if(r.airi===null)return null;const x=40+i*740/Math.max(1,snapshot.history.length-1),y=200-r.airi*1.8,prev=snapshot.history[i-1];return <g key={r.as_of}>{prev?.airi!=null && <line className="airi-chart-line" x1={40+(i-1)*740/(snapshot.history.length-1)} y1={200-prev.airi*1.8} x2={x} y2={y}/>}<circle cx={x} cy={y} r="4"><title>{r.as_of}: {r.airi.toFixed(1)}</title></circle></g>})}</svg>}
      <div className="airi-table-wrap"><table><thead><tr><th>確認日</th><th>総合</th>{axisNames.map(n=><th key={n}>{n}</th>)}<th>確認済み項目</th></tr></thead><tbody>{[...snapshot.history].reverse().map(r=><tr key={r.as_of}><th scope="row">{r.as_of}</th><td>{fmt(r.airi)}</td>{axisNames.map(n=><td key={n}>{fmt(r.axes[n].score)}</td>)}<td>{r.observed_count}/10</td></tr>)}</tbody></table></div>
    </section>
    <Methodology />
  </main>;
}
