import type { Metadata } from "next";
import Link from "next/link";
import { AnalysisForm } from "./analysis-form";
import "./analysis.css";

const title = "企業の財務を分析する | Market Note";
const description = "KAnalyzerのEDINET解析で、企業の業績推移・資本効率・キャッシュフロー・DCFを確認する。";
export const metadata: Metadata = {
  title, description,
  openGraph: { title, description }, twitter: { title, description },
};

export default function CompanyAnalysisPage() {
  return <main id="main-content" className="kanalyzer">
    <section className="analysis-intro" aria-labelledby="analysis-title">
      <span className="analysis-eyebrow">MARKET NOTE × KANALYZER</span>
      <h1 id="analysis-title">企業の財務を、<br />自分で読み解く。</h1>
      <p>有価証券報告書から業績と資本効率を整理。企業レポートで読んだ成長やリスクを、財務データから確かめられます。</p>
      <div className="analysis-intro-links"><Link href="/#companies">企業レポートを読む ↗</Link><a href="#analysis-methodology">指標と計算の見方 ↓</a></div>
    </section>
    <section className="analysis-search-panel" aria-labelledby="search-heading">
      <div className="analysis-search-heading"><h2 id="search-heading">企業を検索する</h2><p>日本のEDINET提出企業が対象です。企業名またはEDINETコードを入力してください。</p></div>
      <AnalysisForm />
    </section>
    <section id="analysis-methodology" className="analysis-methodology" aria-labelledby="method-heading">
      <h2 id="method-heading">分析結果の見方</h2>
      <ul>
        <li>有価証券報告書の年度実績を使用します。最新の四半期決算や業績予想とは対象期間が異なります。取得書類の決算期・提出日も確認してください。</li>
        <li>ROE・ROA・ROICやキャッシュフローは、取得できた項目から計算します。欠損は「−」で表示し、ROICの内訳・税率・投下資本は結果の表で確認できます。</li>
        <li>株価を入力すると参考実績PER・PBRを試算できます。株式分割前後の株価と株式数を混在させないでください。</li>
        <li>DCFは過去実績から置いた成長率・利益率・WACC・永続成長率などに依存する試算です。前提・予測FCF・感応度を合わせて確認してください。</li>
        <li>XBRLの自動抽出では企業独自の項目や会計基準の違いを完全には扱えません。金融業など通常の事業会社と異なる財務構造では、ROIC・DCFの適用に注意が必要です。</li>
      </ul>
      <p><a href="https://disclosure2.edinet-fsa.go.jp/" target="_blank" rel="noreferrer">EDINETで原資料を確認 ↗</a></p>
    </section>
  </main>;
}
