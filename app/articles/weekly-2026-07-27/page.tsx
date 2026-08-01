import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "週次マーケットニュースレポート（2026年7月27日〜31日） | Market Note",
  description: "日本株・米国株・日経平均・ダウ平均・ナスダック総合・SOX指数をまとめた週次マーケットニュースレポート。",
};

export default function WeeklyReport() {
  return (
    <main className="article-page">
      <Link className="back-link" href="/">← 記事一覧へ戻る</Link>

      <article>
        <header className="report-header">
          <p className="report-label">WEEKLY MARKET REPORT</p>
          <h1>週次マーケットニュースレポート（2026年7月27日〜31日）</h1>
          <p className="report-date">公開日：2026年8月1日</p>
        </header>

        <div className="report-body">
          <section>
            <h2>今週の要約</h2>
            <p>
              米国株は、大型テック決算への評価が交錯するなか週末に持ち直しました。Amazonの好決算がAI投資の収益化期待を支えた一方、Appleの先行き見通しと高止まりする原油・インフレ懸念が重しでした。
            </p>
            <p>
              日本株はAI・半導体株の調整で週前半に大きく下落し、日銀の据え置き・円相場の急変観測も不確実性を高めました。市場は「AI成長の持続性」と「インフレに対する中銀の姿勢」を同時に見極める局面です。
            </p>
          </section>

          <section>
            <h2>主要指数の週間変動</h2>
            <div className="table-wrap">
              <table className="report-table">
                <thead>
                  <tr><th>指数</th><th>7月31日終値</th><th>週間騰落率</th><th>主な材料</th></tr>
                </thead>
                <tbody>
                  <tr><td>日経平均</td><td>集計時点で終値の公式クロスチェック未了</td><td>—</td><td>7月28日に半導体・AI株主導で3.95%安。日銀・円相場も注目材料</td></tr>
                  <tr><td>ダウ平均</td><td>52,485.03</td><td>+1.0%</td><td>エネルギー・景気敏感株、週末のリスク選好</td></tr>
                  <tr><td>ナスダック総合（採用）</td><td>25,373.85</td><td>+1.6%</td><td>Amazon、Microsoftなどの決算評価で反発</td></tr>
                  <tr><td>SOX指数</td><td>集計時点で確定値確認中</td><td>—</td><td>AI投資回収・中国勢との競争を警戒。週初は2.2%安</td></tr>
                </tbody>
              </table>
            </div>
            <p className="source-note">
              米国3指数の終値・週間騰落率は<a href="https://apnews.com/article/wall-street-stocks-dow-nasdaq-37d8d182f02f0fcdcf9f7db67e6dfadd" target="_blank" rel="noreferrer">AP集計です（7月31日）</a>。
            </p>
            <p className="source-note">
              日経平均は7月24日終値64,611.15から、28日に62,364.92へ急落しました。<a href="https://diamond.jp/zai/articles/-/1070702" target="_blank" rel="noreferrer">ダイヤモンド・ザイ（7月28日）</a>
            </p>
          </section>

          <section>
            <h2>日本株の主なニュースと要因</h2>
            <ul>
              <li>AI・半導体株への利益確定売りが広がり、28日の日経平均は2,566円安。米国の半導体株安が日本の値がさ半導体関連にも波及した可能性があります。</li>
              <li>日銀は31日に政策金利を1%で据え置きました。植田総裁のインフレ警戒姿勢は、追加利上げ観測と円相場の変動要因として意識されました。<a href="https://www.axios.com/2026/07/31/bank-of-japan-rates-yen" target="_blank" rel="noreferrer">Axios（7月31日）</a></li>
              <li>円買い介入観測を含む為替の不安定さは、輸出企業の業績見通しと海外投資家のリスク許容度の双方に影響し得る状況です。</li>
            </ul>
          </section>

          <section>
            <h2>米国株の主なニュースと要因</h2>
            <ul>
              <li>Amazonは利益・クラウド成長の強さを示し、株価は31日に15.3%上昇。AI向け大型投資が収益につながり始めたとの見方を支えました。<a href="https://apnews.com/article/stock-markets-rates-korea-ai-oil-e31b3a442bcb957a53f1823ef21e73e8" target="_blank" rel="noreferrer">AP（7月31日）</a></li>
              <li>Appleは先行きの売上成長見通しが弱く受け止められ、AI大型株が一様には評価されないことを示しました。</li>
              <li>FOMCは政策金利を3.50〜3.75%で据え置き。原油高によるインフレ上振れリスクが残り、債券利回りは上昇しました。<a href="https://www.lemonde.fr/en/economy/article/2026/07/30/fed-keeps-rates-steady-despite-high-inflation_6755980_19.html" target="_blank" rel="noreferrer">Le Monde（7月29日）</a></li>
              <li>半導体は、AI向け設備投資の回収時期と中国の競争力強化を警戒して変動が大きくなりました。SOXは6月22日の高値から大きく調整しており、週初のReuters報道では高値比21%安でした。<a href="https://www.investing.com/news/economy-news/wall-st-futures-rise-as-us-iran-pause-hostilities-4813225" target="_blank" rel="noreferrer">Reuters（7月27日）</a></li>
            </ul>
          </section>

          <section>
            <h2>市場関係者の見方</h2>
            <ul className="viewpoints">
              <li><strong>強気：</strong>Amazonの決算はAI投資の実効性を示す材料となり、クラウド・大型テックの利益成長期待を支えました。</li>
              <li><strong>中立：</strong>U.S. BankのBill Merz氏は、半導体から他セクターへのローテーションと、利上げ観測が市場反応の一因になり得ると指摘しています。<a href="https://www.investing.com/news/economy-news/wall-st-futures-rise-as-us-iran-pause-hostilities-4813225" target="_blank" rel="noreferrer">Reuters（7月27日）</a></li>
              <li><strong>弱気：</strong>Bank of Americaのエコノミストは、インフレ圧力が弱まらなければFedの信認問題につながり得ると警戒しました。<a href="https://apnews.com/article/stock-markets-rates-korea-ai-oil-e31b3a442bcb957a53f1823ef21e73e8" target="_blank" rel="noreferrer">AP（7月31日）</a></li>
            </ul>
          </section>

          <section>
            <h2>相場環境</h2>
            <p>原油は中東情勢を背景に高水準で推移し、インフレ・長期金利への懸念を残しました。</p>
            <p>米金利上昇と日銀の正常化姿勢、円相場の変動が、日本株の輸出・バリュエーション両面で重要な変数です。</p>
            <p>リスク選好は週末に改善した一方、半導体・AI関連では選別色が強まりました。</p>
          </section>

          <section>
            <h2>翌週の注目点</h2>
            <ul>
              <li>米国：8月3日ISM製造業、4日JOLTS、5日ADP雇用・ISM非製造業、7日雇用統計。<a href="https://www.newyorkfed.org/research/calendars/i-aug26.html" target="_blank" rel="noreferrer">NY連銀カレンダー</a></li>
              <li>日本：賃金・雇用関連統計、主要企業の決算、円相場と日銀の追加利上げ観測。</li>
              <li>共通：中東情勢と原油、AI投資に対する企業の収益見通し、半導体株の調整継続性。</li>
            </ul>
          </section>

          <p className="disclaimer">
            これは投資助言ではなく、2026年8月1日時点の公開情報に基づく市場概況の整理です。
          </p>
        </div>
      </article>
    </main>
  );
}
