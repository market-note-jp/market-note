import type { Metadata } from "next";
import Link from "next/link";
import editorialTitles from "../../../content/editorial-titles.json";
import { createArticleMetadata } from "../../../lib/article-metadata";

const editorial = editorialTitles["weekly-2026-11-02"];
export const metadata: Metadata = createArticleMetadata(editorial);

const sources = [
  ["日本経済新聞社・日経平均日次サマリー（2026年10月30日）", "https://indexes.nikkei.co.jp/nkave/archives/summary?dt=20261030&idx=nk225"],
  ["日本経済新聞社・日経平均の日次履歴（2026年11月6日更新）", "https://indexes.nikkei.co.jp/en/nkave/archives/data"],
  ["AP・米主要指数の確定終値（2026年10月30日）", "https://apnews.com/article/a01d3551e794fed1a0c317c20bc3f0a2"],
  ["AP・米主要指数の確定終値（2026年11月6日）", "https://apnews.com/article/806f71d95105bc7efbc760b194dd8cad"],
  ["Yahoo Finance・SOX日次履歴のClose欄（2026年10月30日・11月6日分、7日朝確認）", "https://finance.yahoo.com/quote/%5ESOX/history/?frequency=1d"],
  ["Nasdaq提供・FREDのSOX日次系列（2026年11月5日更新、10月30日値を照合）", "https://fred.stlouisfed.org/series/NASDAQSOX"],
  ["JPX・現物市場の休業日一覧（2026年11月7日確認）", "https://www.jpx.co.jp/corporate/about-jpx/calendar/index.html"],
  ["FNN・東京市場の6日終値とAI関連株の売り（2026年11月6日）", "https://www.fnn.jp/articles/-/1147372"],
  ["トヨタ自動車・2027年3月期第2四半期決算と通期会社予想（2026年11月5日）", "https://pressroom.toyota.com/tmc-announces-april-through-september-2026-financial-results/"],
  ["Reuters・米中間選挙後のAI関連株の下落と翌週の焦点、Marvin Loh氏の見方（2026年11月6日）", "https://www.reuters.com/business/wall-st-week-ahead-tech-swoon-roils-market-us-inflation-data-tap-2026-11-06/"],
  ["Qualcomm・2026年度第4四半期決算、SEC提出の決算リリース（2026年11月4日）", "https://www.sec.gov/Archives/edgar/data/804328/000080432826000127/qcom092726erex991.htm"],
  ["米労働統計局（BLS）・10月雇用統計、Summary table B（2026年11月6日）", "https://www.bls.gov/news.release/archives/empsit_11062026.htm"],
  ["Reuters・雇用統計後の米国債、ドル円、原油（2026年11月6日更新）", "https://www.reuters.com/business/energy/global-markets-global-markets-2026-11-05/"],
  ["WSJ・米引け後の株式、国債、ドルとWTI先物（2026年11月6日）", "https://www.wsj.com/finance/stocks/u-s-stocks-mixed-after-jobs-data-muted-ai-rebound-945344f6"],
  ["Reuters（Fidelity掲載）・JefferiesのJane Gibbons氏の見方（2026年11月6日）", "https://www.fidelity.com/news/article/us-markets/202611060435RTRSNEWSCOMBINED_L3N46N0QW_1"],
  ["Reuters（Fidelity掲載）・Themis TradingのJoe Saluzzi氏の見方（2026年11月6日）", "https://www.fidelity.com/news/article/us-markets/202611061028RTRSNEWSCOMBINED_L3N46N1EV_1"],
  ["BLS・11月の統計公表日程、CPIとPPI（2026年11月3日更新）", "https://www.bls.gov/schedule/2026/11_sched.htm"],
  ["ソフトバンクグループ・第2四半期の決算発表予定（2026年10月2日告知）", "https://group.softbank/ja-JP/news/info/20261002"],
  ["StockQ・SOXの日次値（2026年11月6日分、7日朝照合）", "https://stockq.org/index/SOX.php"],
] as const;

function Ref({ ids }: { ids: number[] }) {
  return <span className="source-note">{ids.map(id => <a key={id} href={sources[id - 1][1]} target="_blank" rel="noreferrer"> [{id}]</a>)}</span>;
}

export default function WeeklyMarketNovember02() {
  return <main id="main-content" className="article-page">
    <Link className="back-link" href="/">← 記事一覧へ戻る</Link>
    <article>
      <header className="report-header">
        <p className="report-label">WEEKLY MARKET REPORT</p>
        <h1>{editorial.title}</h1>
        <p className="report-date">公開日：2026年11月7日／対象週：2026年11月2日（月）〜11月6日（金）</p>
      </header>
      <div className="report-body">
        <section>
          <h2>今週の要約：AI関連株の売りが日米に波及</h2>
          <p>米中間選挙後、データセンターの建設やAI規制を巡る不透明感が相場の焦点になった。米国で5日にAI関連株が売られ、6日の東京でも半導体関連を中心に下落が広がった。日経平均、ダウ平均、NASDAQ総合、SOXはいずれも週間で下落した。<Ref ids={[1, 2, 3, 4, 5, 8, 10]} /></p>
          <p><strong>本誌の分析：</strong>建設計画が遅れれば、電力・設備・半導体の受注時期に影響し得る。選挙結果から、許認可の変更や既存案件の中止までを一足飛びに結論づけることはできない。来週は物価統計で資金調達環境を、企業決算で契約と投資の進捗を点検したい。</p>
          <p className="source-note">情報基準：2026年11月7日08:00 JST。日本株は6日の東京市場、米株は6日の米通常取引の終値。米国の6日16:00 ESTは日本の7日06:00に当たり、米雇用統計も6日の東京現物引け後に発表された。</p>
        </section>
        <section>
          <h2>主要4指数：10月30日と11月6日の終値を比較</h2>
          <div className="table-wrap"><table className="report-table">
            <thead><tr><th scope="col">指数</th><th scope="col">10月30日終値</th><th scope="col">11月6日終値</th><th scope="col">週間騰落率</th><th scope="col">出典</th></tr></thead>
            <tbody>
              <tr><th scope="row">日経平均株価（円）</th><td>63,290.11</td><td>57,434.77</td><td>-9.25%</td><td><Ref ids={[1, 2]} /></td></tr>
              <tr><th scope="row">ダウ工業株30種平均（ポイント）</th><td>51,770.31</td><td>51,285.73</td><td>-0.94%</td><td><Ref ids={[3, 4]} /></td></tr>
              <tr><th scope="row">NASDAQ総合（ポイント）</th><td>25,437.00</td><td>24,579.42</td><td>-3.37%</td><td><Ref ids={[3, 4]} /></td></tr>
              <tr><th scope="row">SOX・フィラデルフィア半導体株指数（ポイント）</th><td>10,688.80</td><td>9,390.25</td><td>-12.15%</td><td><Ref ids={[5, 6, 19]} /></td></tr>
            </tbody>
          </table></div>
          <p>日経平均は週間-9.25%、ダウ平均は週間-0.94%、NASDAQ総合は週間-3.37%、SOXは週間-12.15%。両市場とも前週最終取引日は10月30日、当週最終取引日は11月6日。週間騰落率は「（11月6日終値÷10月30日終値−1）×100」で、小数第2位に丸めた。配当再投資や通貨換算を含まない価格指数を使用し、NASDAQは総合指数を採用した。</p>
          <p className="source-note">SOXはYahoo Financeの日次Close欄で両日をそろえた。10月30日はNasdaq提供のFRED、11月6日はStockQでも照合。確認時点のFREDは11月5日までで、6日の取引中の値は使用していない。<Ref ids={[5, 6, 19]} /></p>
        </section>
        <section>
          <h2>日本株：半導体株に売り、トヨタは通期見通しを公表</h2>
          <p>文化の日で11月3日の東証現物は休場。6日は米国の前日の売りが東京に波及し、半導体関連を中心に売りが出た。日経平均の週末の値だけでは、個別企業の利益への影響までは分からない。<Ref ids={[1, 2, 7, 8]} /></p>
          <p>トヨタ自動車は5日、2026年4〜9月期の連結決算を発表した。2027年3月期通期の会社予想は、1ドル157円を前提に営業利益3.9兆円。これは通期の予想であり、上期に計上した利益や市場予想とは区別する。<Ref ids={[9]} /></p>
          <p><strong>本誌の分析：</strong>日本の半導体関連株をみるときは、米国の建設許認可と装置の発注時期を分けたい。自動車株では、ドル円だけでなく、販売台数と車種構成、現地生産・調達が採算にどう効くかを点検したい。</p>
        </section>
        <section>
          <h2>米国株：選挙後はAI規制を警戒、企業は部材高への対応も</h2>
          <p>Reutersによると、3日の中間選挙で民主党が連邦議会の上下両院を制した。データセンターが集積する州の選挙結果も受け、5日には建設や規制への懸念から関連株が売られた。6日はAI関連株に買い戻しが入ったとAPが報じた。選挙結果を受けた株価の反応と、実際の規制・許認可の変更は別の段階にある。<Ref ids={[4, 10]} /></p>
          <p>Qualcommは4日の決算資料で、ウエハー製造、先端パッケージ、メモリーなどで部材・工程コストの上昇を指摘し、製品価格への反映を進めていると説明した。QCT部門の粗利益率に価格対応の効果が本格的に出るのは2027年度後半との会社見通しで、実績ではない。<Ref ids={[11]} /></p>
          <p><strong>本誌の分析：</strong>半導体株には最終需要の伸びと、部材高を販売価格に移せるかという別々の問いがある。契約価格の改定と原価の反映には時間差があり、受注が続くだけで短期の利益率が守られるとは限らない。</p>
        </section>
        <section>
          <h2>金利・為替・原油・債券：雇用統計で米国債の買いが一服</h2>
          <p>BLSの事業所調査では、季節調整済み非農業部門雇用者数の前月差は9月の6.0万人増から10月の16.5万人増となった。いずれも11月6日公表時点の暫定値。別の家計調査で測る10月の失業率は4.1%だった。<Ref ids={[12]} /></p>
          <p>Reutersによると、株安で安全資産を求める動きが出た後、6日の雇用統計を受け米10年債利回りは4.86%付近へ持ち直し、同日の外国為替市場ではドルが対円で上昇した。原油先物の6日清算値は北海ブレントが1バレル98.32ドル、ニューヨークのWTIが90.83ドル。いずれも現地6日の観測で、株価と同時刻の評価や週間騰落率ではない。<Ref ids={[13, 14]} /></p>
          <p><strong>本誌の分析：</strong>米国債は株安時の逃避先になり得るが、雇用や物価が底堅ければ、追加利上げを意識した売りが出やすい。原油は中東の供給・輸送を巡る見通しにも左右される。ドル建て原油とドル円が同時に上がる局面では、日本の輸入企業にとって円建て調達費への影響が重なる。</p>
        </section>
        <section>
          <h2>市場関係者の見方：強気・慎重・中立</h2>
          <p>以下の分類は本誌による。いずれも11月6日時点の見解である。</p>
          <ul>
            <li><strong>強気寄り：</strong>Jefferiesの株式ストラテジスト、Jane Gibbons氏は、5日の売りをAI支出、政策、インフレへの不安が重なった反応と捉え、企業の基礎条件が一変したとの見方を取らなかった。<Ref ids={[15]} /></li>
            <li><strong>慎重：</strong>State Streetのシニア・グローバル・マクロ・ストラテジスト、Marvin Loh氏は、AI株の上昇を支えてきた勢いは崩れやすく、建設の減速がどの程度か見えるまで政策や規制の不透明感が残ると指摘した。<Ref ids={[10]} /></li>
            <li><strong>中立・条件付き：</strong>Themis Tradingの株式取引共同責任者、Joe Saluzzi氏は、雇用の強さは通常なら利上げを支持する一方、株式市場の変動が大きいときにFRBが引き締めるかは別の判断だと指摘した。<Ref ids={[16]} /></li>
          </ul>
        </section>
        <section>
          <h2>翌週11月9日〜13日の注目点</h2>
          <ol>
            <li><strong>11月10日：ソフトバンクグループの決算。</strong>投資先の評価額の変動と実際の現金収支を分け、追加出資の予定と調達手段を確認する。<Ref ids={[18]} /></li>
            <li><strong>11月10日：米10月CPI、13日：米10月PPI。</strong>ともに米東部時間8:30、日本時間22:30の予定。エネルギーの影響に加え、サービス価格と企業の仕入れ価格に上昇が広がっているかを点検する。<Ref ids={[17]} /></li>
            <li><strong>通週：米テック決算。</strong>ReutersはCoreWeave、Cisco、Applied Materialsを挙げた。顧客の需要見通しに加え、契約が売上に計上される時期、設備の稼働、支出に必要な資金に注目する。<Ref ids={[10]} /></li>
          </ol>
          <p><strong>条件付きの見通し：</strong>物価に再加速の兆しがなく、決算で受注や稼働の裏付けが得られれば、今週の売りは落ち着く余地がある。物価高と投資計画の後ずれが重なる場合は、資金調達費と利益見通しの両方が株価の重荷になり得る。</p>
        </section>
        <section>
          <h2>出典一覧</h2>
          <p>指数算定機関、取引所、企業開示、BLSと主要報道を参照。更新型ページは情報基準時点の内容で、後日改定される場合がある。</p>
          <ol>{sources.map(([label, url]) => <li key={url}><a href={url} target="_blank" rel="noreferrer">{label}</a></li>)}</ol>
        </section>
        <section className="disclaimer">
          <h2>注意事項</h2>
          <p>本記事は公開情報を整理した情報提供であり、特定の金融商品の売買を推奨する投資助言ではありません。実績、会社の見通し、市場関係者の見解、本誌の分析を区別しています。将来の価格や投資成果を保証するものではなく、投資には元本割れのリスクがあります。</p>
        </section>
      </div>
    </article>
  </main>;
}
