import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import data from "./snapshot.json";
import "./breadth.css";

export default function BreadthHomeCard() {
  const m = data.metrics;
  const level = data.baseValue * (1 + m.equalWeightReturnPct / 100);
  return <section className="breadth-home content-width" aria-labelledby="breadth-home-title">
    <div><p className="kicker">MARKET NOTE 225</p><h2 id="breadth-home-title">日本株の、上昇の広がり。</h2><p className="breadth-small">観測日：{data.date} 終値・配当なし</p></div>
    <div className="breadth-home-value"><span>独自均等加重指数</span><strong>{level.toLocaleString("ja-JP", {minimumFractionDigits:2, maximumFractionDigits:2})}<small>pt</small></strong><span className="breadth-negative">前日比 {m.equalWeightReturnPct.toFixed(2)}%</span></div>
    <div className="breadth-home-detail"><span>日経平均 <b>{m.nikkeiReturnPct.toFixed(2)}%</b></span><span>上昇銘柄 <b>{m.advancers}/225社</b></span><Link href="/market-breadth" className="text-link">指標とチャートを見る <ArrowUpRight size={17} aria-hidden="true" /></Link></div>
  </section>;
}
