import type { Metadata } from "next";
import Link from "next/link";
import BreadthDashboard from "./dashboard";
import "./breadth.css";

export const metadata: Metadata = {
  title: "Market Note 225 | 日本株の均等加重指数",
  description: "225社を同じ重みで見るMarket Note独自指数。日経平均との比較、騰落率中央値、上昇銘柄比率、CSVによる追加計算と算出方法を公開。",
};

export default function MarketBreadthPage() {
  return <main id="main-content" className="breadth-page content-width">
    <Link href="/" className="breadth-back">← Market Note ホーム</Link>
    <header className="breadth-heading">
      <div><p className="kicker">JAPAN EQUITIES / EQUAL WEIGHT</p><h1>Market Note 225</h1><p>一社ずつ、同じ重さで見る日本株。</p></div>
      <span className="breadth-badge">独自均等加重指数</span>
    </header>
    <BreadthDashboard />
  </main>;
}
