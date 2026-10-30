import type { Metadata } from "next";
import Link from "next/link";
import editorialTitles from "../../../content/editorial-titles.json";
import { createArticleMetadata } from "../../../lib/article-metadata";

const editorial = editorialTitles["weekly-2026-10-26"];
export const metadata: Metadata = createArticleMetadata(editorial);

const sources = [
  ["日本経済新聞社・日経平均日次サマリー（2026年10月23日）", "https://indexes.nikkei.co.jp/nkave/archives/summary?dt=20261023&idx=nk225"],
  ["日本経済新聞社・日経平均日次サマリー（2026年10月30日、31日朝確認）", "https://indexes.nikkei.co.jp/nkave/archives/summary"],
  ["AP・米主要指数の確定終値（2026年10月23日）", "https://apnews.com/article/e07c72bc5cbe5dffe352ddf30054e35f"],
  ["AP・米主要指数の確定終値（2026年10月30日）", "https://apnews.com/article/a01d3551e794fed1a0c317c20bc3f0a2"],
  ["Investing.com・SOX日次履歴（2026年10月30日まで、31日朝確認）", "https://jp.investing.com/indices/phlx-semiconductor-historical-data"],
  ["Nasdaq提供・FRED、SOX日次系列（2026年10月29日更新、31日朝確認）", "https://fred.stlouisfed.org/data/NASDAQSOX"],
  ["Amazon・2026年第3四半期決算、連結CF計算書とFCF定義（2026年10月29日）", "https://ir.aboutamazon.com/news-release/news-release-details/2026/Amazon-com-Announces-Third-Quarter-Results/default.aspx"],
  ["日本銀行・当面の金融政策運営、PDF1ページ・注記、3ページ公表日時（2026年10月30日12:02）", "https://www.boj.or.jp/mopo/mpmdeci/mpr_2026/k261030a.pdf"],
  ["FRB・FOMC声明（2026年10月28日14:00 EDT）", "https://www.federalreserve.gov/newsevents/pressreleases/monetary20261028a.htm"],
  ["みんかぶ・キオクシアの決算と初配（2026年10月30日19:11）", "https://minkabu.jp/stock/285A/news/4647746"],
  ["Reuters・米国株終値とOliver Pursche氏の見方（2026年10月30日）", "https://www.reuters.com/business/nasdaq-futures-tumble-amazon-intel-results-deepen-ai-spending-woes-2026-10-30/"],
  ["Reuters配信・Jake Behan氏のAI投資費用への見方、Investing.com掲載（2026年10月30日）", "https://www.investing.com/news/stock-market-news/nasdaq-futures-tumble-as-amazon-intel-results-deepen-ai-spending-woes-4986163"],
  ["Zacks・Tirthankar Chakraborty氏、季節性とAI株への強気論（2026年10月30日）", "https://www.zacks.com/stock/news/3019994/2-ai-stocks-poised-to-surge-on-the-halloween-effect"],
  ["Saxo Bank・Morning Brew、債券・為替・原油の朝の状況（2026年10月30日）", "https://www.home.saxo/en-ch/content/articles/morning-brew/morning-brew-october-30-2026-30102026"],
  ["米BLS・2026年11月の公表予定（2026年10月31日確認）", "https://www.bls.gov/schedule/2026/11_sched.htm"],
  ["米FEC・連邦選挙日程（2026年10月31日確認）", "https://www.fec.gov/introduction-campaign-finance/election-results-and-voting-information/"],
  ["JPX・2026年11月の市場休業日（2026年10月31日確認）", "https://www.jpx.co.jp/corporate/about-jpx/calendar/index.html"],
  ["Charles Schwab・Joe Mazzola、米国株・債券と翌週予定（2026年10月30日9:23 EDT）", "https://www.schwab.com/learn/story/stock-market-update-open"],
] as const;

function Ref({ ids }: { ids: number[] }) {
  return <span className="source-note">{ids.map(id => <a key={id} href={sources[id - 1][1]} target="_blank" rel="noreferrer"> [{id}]</a>)}</span>;
}

export default function WeeklyMarketOctober26() {
  return <main id="main-content" className="article-page">
    <Link className="back-link" href="/">← 記事一覧へ戻る</Link>
    <article>
      <header className="report-header">
        <p className="report-label">WEEKLY MARKET REPORT</p>
        <h1>{editorial.title}</h1>
        <p className="report-date">公開日：2026年10月31日／対象週：2026年10月26日（月）〜10月30日（金）</p>
      </header>
      <div className="report-body">
        <section>
          <h2>今週の要約：需要の強さから、投資後の現金へ</h2>
          <p>AI関連の決算を受けた週末の売りが目立った。週間では日経平均が上昇する一方、ダウ平均・NASDAQ総合・SOXは下落した。日米の中央銀行は政策金利を維持したが、日銀はETF売却ペースを見直した。金利、投資支出、資産売却を一つの「金融緩和・引き締め」という言葉だけで捉えないことが重要になった。<Ref ids={[1, 2, 3, 4, 5, 8, 9]} /></p>
          <p><strong>本誌の分析：</strong>メモリを売る企業の好業績と、購入する企業のFCFへの不安は両立する。支出先の売上が増えても、支出する側の投資回収が証明されたわけではない。翌週は米中間選挙と雇用統計を控えるが、決算では資金の調達方法、設備の稼働、投資後に残る現金を引き続き点検したい。<Ref ids={[7, 10, 15, 16]} /></p>
          <p className="source-note">情報基準：2026年10月31日08:00 JST。日本株は30日東京市場、米株は30日通常取引の終値。米国30日16:00 EDTは日本31日05:00 JSTに当たる。30日の日本株終値には、その後の米国市場の売りや東京引け後の国内決算発表は含まれない。</p>
        </section>
        <section>
          <h2>主要4指数：10月23日と30日の終値を比較</h2>
          <div className="table-wrap"><table className="report-table">
            <thead><tr><th>指数</th><th>10月23日終値</th><th>10月30日終値</th><th>週間騰落率</th><th>根拠</th></tr></thead>
            <tbody>
              <tr><td>日経平均株価（円）</td><td>62,693.16</td><td>63,290.11</td><td>+0.95%</td><td><Ref ids={[1, 2]} /></td></tr>
              <tr><td>ダウ工業株30種平均（ポイント）</td><td>52,215.16</td><td>51,770.31</td><td>-0.85%</td><td><Ref ids={[3, 4, 11]} /></td></tr>
              <tr><td>NASDAQ総合（ポイント）</td><td>25,955.34</td><td>25,437.00</td><td>-2.00%</td><td><Ref ids={[3, 4, 11]} /></td></tr>
              <tr><td>SOX・フィラデルフィア半導体株指数（ポイント）</td><td>10,779.5</td><td>10,688.8</td><td>-0.84%</td><td><Ref ids={[5, 6]} /></td></tr>
            </tbody>
          </table></div>
          <p>日経平均は週間+0.95%、ダウ平均は-0.85%、NASDAQ総合は-2.00%、SOXは-0.84%。両国とも前週最終取引日は10月23日、当週最終取引日は30日。計算は「（30日終値÷23日終値−1）×100」で小数第2位に丸めた。NASDAQは総合指数を採用し、NASDAQ 100とは区別する。いずれも配当再投資・円換算を含まない価格指数の通常取引終値である。</p>
          <p>SOXの30日終値は10,688.8で、29日の11,518.2から前日比-7.20%。週中の上昇があったため、金曜日の大幅安と週間-0.84%は矛盾しない。日次の下落率を週間騰落率として表示しない。<Ref ids={[5]} /></p>
          <p className="source-note">SOXは同じInvesting.com日次履歴の両日値を小数第1位で統一した。Nasdaq提供のFRED系列は確認時点で29日までの更新で、23日値10,779.46は丸め後に一致する。30日は二次市場データを使用しており、提供元の訂正時には再確認が必要になる。</p>
        </section>
        <section>
          <h2>米国株：Amazonの営業CFでも賄えない設備支出</h2>
          <p>Amazonの29日公表決算では、AWSの需要拡大と投資支出の増加が同時に示された。下表は同社の2026年9月30日までの直近12カ月、米ドル・百万単位の連結CF実績。四半期の売上・利益や通期会社予想とは混ぜていない。<Ref ids={[7]} /></p>
          <div className="table-wrap"><table className="report-table">
            <thead><tr><th>項目（2025年10月〜2026年9月、百万ドル）</th><th>金額</th></tr></thead>
            <tbody>
              <tr><td>営業活動によるキャッシュフロー</td><td>168,300</td></tr>
              <tr><td>有形固定資産の取得支出（流出を負数で表示）</td><td>-215,192</td></tr>
              <tr><td>有形固定資産売却収入・インセンティブ</td><td>4,535</td></tr>
              <tr><td>会社定義のFCFを再計算</td><td>-42,357</td></tr>
            </tbody>
          </table></div>
          <p>FCF＝168,300−215,192＋4,535＝−42,357百万ドル。会社の補足表にあるFCFとも一致する。これは営業CFから売却収入等控除後の設備取得支出を差し引いた定義で、買収支出、すべてのリース元本返済や負債の返済まで控除した「自由に配れる現金」ではない。<Ref ids={[7]} /></p>
          <p><strong>本誌の分析：</strong>FCFの流出だけで投資の失敗や資金繰り破綻は確定しない。ただし、投資が継続する間に手元資金・借入・社債でどれだけ補い、その後の収益が資本コストを上回るかを確認する必要がある。売上成長率だけで買い手と売り手の採算を同時に評価することはできない。</p>
          <p>Reutersは30日、AmazonとIntelの発表を受け、AI関連支出と回収時期への警戒が米株の売りにつながったと報じた。これは市場反応の整理であり、各社の事業や財務状態が同一という意味ではない。<Ref ids={[11]} /></p>
        </section>
        <section>
          <h2>日本株：週末の下落と、キオクシアの決算発表を時系列で分ける</h2>
          <p>日経平均は30日に下落したが、23日との比較では週間上昇となった。指数の動きだけでは、半導体関連、内需、金融の需要や利益が同方向に動いたかは分からない。ウエートの大きな銘柄と市場全体の広がりを併せて見る必要がある。<Ref ids={[1, 2]} /></p>
          <p>キオクシアは30日東京市場の取引終了後に決算と初の中間配当を公表した。みんかぶは、生成AI関連を中心とするデータセンター向け需要、販売単価、出荷量などが業績に寄与したと報じた。決算発表後の材料を、同日の東証終値を説明する原因として扱わない。<Ref ids={[10]} /></p>
          <p><strong>本誌の分析：</strong>供給制約でメモリ価格が上がれば、メモリメーカーには追い風となり、購入するサーバー・PCメーカーには費用増となり得る。その後の供給増強が価格をどう変えるか、顧客が支出を続けられるかも重要だ。需要の強さ、売り手の利益、買い手の現金負担をそれぞれ確認したい。</p>
          <p className="source-note">キオクシアの決算原文PDFは今回の取得時にエラーとなったため、未照合の利益倍率・市場予想比較・配当額比較は掲載していない。確認できた主要報道の発表内容と時刻に限定している。</p>
        </section>
        <section>
          <h2>日米の政策：金利維持でも、日銀のETF売却方針は変わる</h2>
          <p>FRBは28日、FF金利の誘導目標レンジを3.75〜4.00%に維持した。声明は経済活動・設備投資の強さと、なお高いインフレを指摘した。据え置きの決定を、次回以降の利下げの約束として扱わない。<Ref ids={[9]} /></p>
          <p>日銀は30日、無担保コール翌日物を1.25%程度で推移するよう促す方針を決定。一方、ETFの年間売却ペースは簿価ベース3,300億円程度から8,600億円程度へ見直し、2027年1月から実施する。両方とも方針上の年間ペースで、実績売却額や時価ではない。市場状況に応じた一時的調整・停止の枠組みは残る。<Ref ids={[8]} /></p>
          <p><strong>本誌の分析：</strong>短期金利の維持は借入費用や為替期待に、ETF売却は株式の需給に働く。簿価の売却額から株価への下押し幅を直接計算することはできない。実際の執行、市場の受け皿、企業利益と民間の資金流入も影響する。</p>
        </section>
        <section>
          <h2>金利・債券・為替・原油：安全志向と供給不安が並存</h2>
          <p>30日朝のSaxoの解説は、米国債に買いが入り、円とスイスフランが安全志向の支えを受けたと整理した。一方、原油は中東の輸送・供給リスクから上昇した。Schwabの同日朝の解説も、ハイテク株への警戒と米国債買いを指摘している。いずれも米国株の30日終値と同時刻の価格表ではなく、朝の観測である。<Ref ids={[14, 18]} /></p>
          <p><strong>本誌の分析：</strong>株安と債券高が同時に起こる場合、金利低下が企業価値を支える効果だけでなく、成長不安の強まりも考える必要がある。原油高は資源企業の販売価格に寄与し得る一方、輸送・製造コストや家計購買力に負担となる。円高・円安の影響も、輸出数量、海外利益の換算、輸入費用で異なる。</p>
          <p className="source-note">観測時点と定義がそろわない金利・為替・原油を接ぎ合わせた週間リターンは掲載していない。株価指数の表とは別に、報道で確認できた資金移動と供給リスクを整理した。</p>
        </section>
        <section>
          <h2>市場関係者の見方：強気・慎重・選別</h2>
          <p>分類は本誌による整理。各見解は相場の確定予測や市場全体の総意ではない。</p>
          <ul>
            <li><strong>強気：</strong>Tirthankar Chakraborty氏（Zacks、30日）は、11月以降の季節性を背景にAI株への強気論を示した。季節性を根拠とする投資観であり、今回の設備投資の回収を証明するものではない。<Ref ids={[13]} /></li>
            <li><strong>慎重：</strong>Jake Behan氏（Direxion、30日Reuters）は、投資家の問いが成長速度だけでなく、成長のために必要な支出へ移ったと指摘した。成長が続いても費用と資金負担が評価を左右するという見方。<Ref ids={[12]} /></li>
            <li><strong>中立・選別：</strong>Oliver Pursche氏（Wealthspire Advisors、30日Reuters）は、投資収益が生じるかと、その実現時期が焦点と説明し、高い期待に応える企業と届かない企業で評価が分かれると述べた。<Ref ids={[11]} /></li>
          </ul>
          <p><strong>本誌の分析：</strong>強気論を採る場合にも、季節性や需要の存在と、個別企業の投資採算は分けたい。慎重論についても、FCF流出が続く期間、調達条件、投資を減らす選択肢を点検し、全社を一律に破綻シナリオへ結び付けない。</p>
        </section>
        <section>
          <h2>翌週11月2日〜6日の注目点</h2>
          <ol>
            <li><strong>11月2日：日銀展望レポートの全文公表予定。</strong>日銀の30日公表資料は14:00を予定している。基本的見解だけでなく背景の需要・物価の説明を確認する。<Ref ids={[8]} /></li>
            <li><strong>11月3日：米中間選挙。</strong>FECで連邦一般選挙の日付を確認。選挙前の予測と確定結果を区別し、税制・規制・財政への影響は議会構成と実際の立法可能性から判断する。日本の現物市場は文化の日で休場。<Ref ids={[16, 17]} /></li>
            <li><strong>11月3日・5日・6日：米雇用関連統計。</strong>BLS予定では3日に9月JOLTS、5日に7〜9月期生産性・費用の速報、6日に10月雇用統計。6日8:30米東部時間は、冬時間への移行後なので日本時間22:30となる。雇用者数だけでなく過去分の改定、失業率、賃金を点検する。<Ref ids={[15]} /></li>
            <li><strong>通週：Apple、AMD、Armなどの決算。</strong>Schwabが翌週の発表予定として挙げた。AI向け需要と、消費者向け機器への費用負担、投資後の現金を確認する。日程変更は企業IRで再確認する。<Ref ids={[18]} /></li>
          </ol>
          <p><strong>条件付きの見通し：</strong>需要と投資の稼働が現金回収に結び付き、資金調達条件が安定すれば、評価が落ち着く余地がある。反対に回収の遅れ、原油高、利益見通しの悪化が重なれば、株価評価への圧力は続き得る。いずれも今後の開示で検証するシナリオで、値動きの断定ではない。</p>
        </section>
        <section>
          <h2>出典一覧</h2>
          <p>指数算定機関、企業IR、中央銀行、BLS、FEC、JPXの一次情報と、AP・Reuters等の報道を参照。SOXの当週末値と取得できなかった企業原文の限界は本文で明記した。更新型ページは情報基準時点の内容であり、今後の改定や記事の更新があり得る。</p>
          <ol>{sources.map(([label, url]) => <li key={url}><a href={url} target="_blank" rel="noreferrer">{label}</a></li>)}</ol>
        </section>
        <section className="disclaimer">
          <h2>注意事項</h2>
          <p>本記事は公開情報を整理する情報提供であり、特定の金融商品の売買を推奨する投資助言ではありません。実績、会社・政策の予定、市場関係者の見解、本誌の分析を区別しています。将来の相場、企業利益、投資成果を保証するものではなく、投資には元本割れを含むリスクがあります。</p>
        </section>
      </div>
    </article>
  </main>;
}
