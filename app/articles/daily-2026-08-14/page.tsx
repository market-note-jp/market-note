import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "デイリー・マーケットブリーフィング（2026年8月14日） | Market Note",
  description:
    "米PPI、米国株最高値、Applied Materials、日本株、原油とドル円を整理した2026年8月14日のマーケットブリーフィング。",
};

export default function DailyReportAugust14() {
  return (
    <main className="article-page">
      <Link className="back-link" href="/">← 記事一覧へ戻る</Link>

      <article>
        <header className="report-header">
          <p className="report-label">DAILY MARKET BRIEFING</p>
          <h1>デイリー・マーケットブリーフィング</h1>
          <p className="report-date">2026年8月14日（金）</p>
        </header>

        <div className="report-body">
          <section>
            <h2>今日の結論</h2>
            <p>
              13日の米7月PPIは前月比横ばい、前年比4.7%となり、6月の5.5%から大きく鈍化した。CPIに続いて企業段階の物価も落ち着いたことで9月FOMCの追加利上げ観測が後退し、S&amp;P500は史上最高値を更新した。
            </p>
            <p>
              AI・半導体ではApplied MaterialsがAI向けDRAM、先端ロジック、先端パッケージ需要を背景に強い見通しを示した。一方、好決算でも時間外で株価は下落しており、AI相場では「業績が良いか」だけでなく「市場期待をどこまで上回るか」が株価を左右している。
            </p>
          </section>

          <section>
            <h2>市場スナップショット</h2>
            <div className="table-wrap">
              <table>
                <thead><tr><th>対象</th><th>確認できた値・変化</th><th>読み方</th></tr></thead>
                <tbody>
                  <tr><td>米PPI（7月）</td><td>前月比0.0%、前年比+4.7%</td><td>予想を下回りインフレ鈍化</td></tr>
                  <tr><td>S&amp;P500（8月13日）</td><td>7,798.99（+0.65%）</td><td>史上最高値を更新</td></tr>
                  <tr><td>NASDAQ総合（8月13日）</td><td>26,803.03（+0.81%）</td><td>大型テック・半導体が主導</td></tr>
                  <tr><td>ブレント原油（8月13日）</td><td>87.07ドル（-2%超）</td><td>インフレ懸念を緩和</td></tr>
                  <tr><td>ドル円（8月13日）</td><td>159円台後半</td><td>日米金融政策の差を意識</td></tr>
                </tbody>
              </table>
            </div>
            <p className="inline-sources">
              <a href="https://www.reuters.com/business/us-producer-prices-unchanged-july-2026-08-13/" target="_blank" rel="noreferrer">Reuters・米PPI（2026年8月13日）</a>
              <a href="https://apnews.com/article/892c5409d8ed26bfd5965eb2a89d9005" target="_blank" rel="noreferrer">AP・米主要株価指数（2026年8月13日）</a>
              <a href="https://www.reuters.com/world/china/global-markets-global-markets-2026-08-13/" target="_blank" rel="noreferrer">Reuters・世界市場、原油（2026年8月13日）</a>
            </p>
          </section>

          <section>
            <h2>1．米PPIは前月比横ばい――9月利上げ観測が後退</h2>
            <p>
              米7月PPIは前月比0.0%で、Reuters集計の市場予想+0.2%を下回った。前年比では4.7%と6月の5.5%から鈍化。サービス価格は0.2%上昇した一方、財価格は0.7%低下した。
            </p>
            <p className="inline-sources"><a href="https://www.reuters.com/business/us-producer-prices-unchanged-july-2026-08-13/" target="_blank" rel="noreferrer">Reuters・7月PPI（2026年8月13日）</a></p>
            <h3>株価・市場への影響</h3>
            <p>CPIに続くインフレ鈍化で、FRBが9月に追加利上げする必要性は低下した。金利低下はAI・半導体など高PER銘柄の評価を支えやすい。</p>
            <h3>次の注目点</h3>
            <ul><li>7月PCEデフレーター</li><li>FRB高官発言で9月据え置き観測が定着するか</li><li>原油再上昇が8月物価へ与える影響</li></ul>
          </section>

          <section>
            <h2>2．S&amp;P500は7,798.99で最高値――半導体株も上昇</h2>
            <p>
              13日のS&amp;P500は0.65%高の7,798.99、NASDAQ総合は0.81%高の26,803.03、ダウ平均は0.13%高の53,839.99で終了した。Sandiskは13.7%、Micronは4.2%上昇し、メモリ関連が相場を押し上げた。
            </p>
            <p className="inline-sources"><a href="https://www.reuters.com/business/retail-consumer/wall-st-futures-tick-higher-oil-retreats-ahead-inflation-data-2026-08-13/" target="_blank" rel="noreferrer">Reuters・米国株（2026年8月13日）</a></p>
            <h3>株価・市場への影響</h3>
            <p>インフレ鈍化とAI需要の両方が同時に追い風となり、成長株に有利な環境が形成されている。ただし最高値圏では期待値も高く、決算の小さな失望でも売りが大きくなりやすい。</p>
            <h3>次の注目点</h3>
            <ul><li>最高値更新が大型テック以外へ広がるか</li><li>メモリ株の上昇が日本の半導体関連へ波及するか</li><li>米10年債利回りが4.6%台を維持するか</li></ul>
          </section>

          <section>
            <h2>3．Applied Materials、AI需要で強い見通し――それでも時間外は下落</h2>
            <p>
              Applied Materialsの2026年度第3四半期売上高は91.2億ドルで市場予想を上回った。会社は第4四半期売上高を約102.5億ドル（±5億ドル）と見込み、市場予想の約95.4億ドルを上回る。DRAM、先端ロジック、先端パッケージが成長を支え、2026年のパッケージ関連売上成長率見通しも70%超へ引き上げた。
            </p>
            <p>
              ただし株価は時間外で約4%下落した。株価が年初来で大きく上昇していたため、良好な決算だけでは高い期待をさらに上回れなかった。
            </p>
            <p className="inline-sources">
              <a href="https://www.reuters.com/business/applied-materials-forecasts-quarterly-revenue-above-estimates-2026-08-13/" target="_blank" rel="noreferrer">Reuters・Applied Materials決算（2026年8月13日）</a>
              <a href="https://ir.appliedmaterials.com/events/event-details/q3-2026-applied-materials-earnings-conference-call" target="_blank" rel="noreferrer">Applied Materials IR・Q3 2026決算イベント（2026年8月13日）</a>
            </p>
            <h3>株価・市場への影響</h3>
            <p>AI向け設備投資の強さは、製造装置、メモリ、先端パッケージ関連企業の需要見通しを支える。一方、「好決算でも売られる」動きはAI関連の期待値がかなり高いことを示す。</p>
            <h3>次の注目点</h3>
            <ul><li>DRAM設備投資の持続性</li><li>先端パッケージ売上の70%超成長が実現するか</li><li>東京エレクトロン、アドバンテストなど日本株への連想</li></ul>
          </section>

          <section>
            <h2>4．日本株は半導体主導で上昇――日銀利上げ観測も強まる</h2>
            <p>
              13日のアジア市場では米CPI後のリスク選好と半導体株高が波及し、日本の日経平均は上昇した。Reutersは日経平均が1.61%上昇したと報じた。一方、日本の7月企業物価は前年比7.2%上昇とされ、日銀の追加利上げ観測も意識された。
            </p>
            <p className="inline-sources"><a href="https://www.reuters.com/world/china/global-markets-view-europe-2026-08-13/" target="_blank" rel="noreferrer">Reuters・日本株と日銀観測（2026年8月13日）</a></p>
            <h3>株価・市場への影響</h3>
            <p>米金利低下は日本の半導体株に追い風だが、国内物価上昇による日銀利上げ観測は高PER銘柄の逆風になり得る。米国と日本で金融政策の方向感が分かれる点に注意が必要。</p>
            <h3>次の注目点</h3>
            <ul><li>日銀の利上げ時期</li><li>半導体株高がTOPIX全体へ広がるか</li><li>円相場が日本株の業種間格差を広げるか</li></ul>
          </section>

          <section>
            <h2>5．原油は反落、ドル円は159円台――インフレと日米金利差を再評価</h2>
            <p>
              13日のブレント原油は2%超下落し87.07ドル、WTIは81.25ドルとなった。需要見通しの引き下げや米在庫増加が重石となった。為替ではドル円が159円台後半で推移し、米利上げ観測後退と日銀利上げ観測が交錯している。
            </p>
            <p className="inline-sources">
              <a href="https://www.reuters.com/world/china/global-markets-global-markets-2026-08-13/" target="_blank" rel="noreferrer">Reuters・世界市場と原油（2026年8月13日）</a>
              <a href="https://www.reuters.com/world/asia-pacific/dollar-treads-water-fed-hike-bets-pared-benign-us-inflation-2026-08-13/" target="_blank" rel="noreferrer">Reuters・為替市場（2026年8月13日）</a>
            </p>
            <h3>株価・市場への影響</h3>
            <p>原油安はインフレ期待を抑え、金利敏感株にはプラス。一方、円安が続けば日本の輸入コストは高止まりし、国内物価と日銀政策への圧力が残る。</p>
            <h3>次の注目点</h3>
            <ul><li>ブレント原油が85ドルを割り込むか</li><li>ドル円160円付近で政策当局の警戒が強まるか</li><li>日米金利差縮小が円高材料になるか</li></ul>
          </section>

          <p className="disclaimer">
            これは投資助言ではなく、2026年8月14日時点で確認できた公開情報に基づく市場概況の整理です。掲載した数値・見通しは将来の市場動向や投資成果を保証するものではありません。投資判断は、ご自身の目的、資金状況、リスク許容度を踏まえて行ってください。
          </p>
        </div>
      </article>
    </main>
  );
}
