import type { Metadata } from "next";
import Link from "next/link";
import editorialTitles from "../../../content/editorial-titles.json";
import { createArticleMetadata } from "../../../lib/article-metadata";

const editorial = editorialTitles["weekly-2026-11-09"];
export const metadata: Metadata = createArticleMetadata(editorial);

const sources = [
  ["日本経済新聞社・日経平均の日次履歴（2026年11月13日更新、6日・13日終値）","https://indexes.nikkei.co.jp/en/nkave/archives/data"],
  ["AP・米主要指数の終値（2026年11月6日）","https://apnews.com/article/806f71d95105bc7efbc760b194dd8cad"],
  ["AP・米主要指数の終値（2026年11月13日）","https://apnews.com/article/12c1e8155fb85c3c7b09e058ed6d3c74"],
  ["Investing.com・SOX日次履歴、取引終了表示（2026年11月13日）","https://www.investing.com/indices/phlx-semiconductor-historical-data"],
  ["Nasdaq提供・FRED、SOX日次系列（2026年11月12日更新）","https://fred.stlouisfed.org/series/NASDAQSOX"],
  ["Reuters・米国株の引けとAnthony Saglimbene氏の見方（2026年11月13日）","https://www.reuters.com/business/nasdaq-futures-dip-nvidia-tumult-keeps-investors-edge-2026-11-13/"],
  ["株探・東京市場の指数寄与（2026年11月13日）","https://s.kabutan.jp/news/n202611131108/"],
  ["ソフトバンクグループ・2027年3月期第2四半期決算（2026年11月10日）","https://group.softbank/event/earnings_2026q2"],
  ["NVIDIA・CEO交代と決算予定（2026年11月12日）","https://nvidianews.nvidia.com/news/nvidia-announces-ceo-transition/"],
  ["CoreWeave・2026年第3四半期決算（2026年11月10日）","https://investors.coreweave.com/news/news-details/2026/CoreWeave-Reports-Strong-Third-Quarter-2026-Results/default.aspx"],
  ["米BLS・10月CPI、Table Aと欠測の注記（2026年11月10日）","https://www.bls.gov/news.release/archives/cpi_11102026.htm"],
  ["Reuters・10月PPIの公表（2026年11月13日）","https://www.reuters.com/business/us-producer-prices-rise-further-october-2026-11-13/"],
  ["Reuters・米国債とドル円の観測（2026年11月13日）","https://www.reuters.com/world/china/global-markets-global-markets-2026-11-13/"],
  ["WSJ・原油先物の清算値（2026年11月13日）","https://www.wsj.com/finance/commodities-futures/oil-slips-again-as-traders-weigh-diplomacy-hopes-808f1641"],
  ["Reuters・原油供給見通しと中東の輸送リスク（2026年11月13日）","https://www.reuters.com/business/energy/oil-prices-set-second-weekly-decline-trump-stay-with-iran-blockade-2026-11-13/"],
  ["Investor’s Business Daily・Joseph Moore氏の見方（2026年11月11日）","https://www.investors.com/news/technology/chip-stocks-rally-amd-txn-arm-mtsi-mu/"],
  ["Reuters・翌週の材料とPatrick Ryan氏の見方（2026年11月13日）","https://www.reuters.com/business/wall-st-week-ahead-nvidia-results-anthropic-ipo-pose-tests-tumultuous-ai-trade-2026-11-13/"],
  ["内閣府・GDP速報の公表予定（2026年11月14日確認）","https://www.esri.cao.go.jp/jp/sna/kouhyou/kouhyou_top.html?vm=r"],
  ["FRB・11月の予定、FOMC議事要旨（2026年11月14日確認）","https://www.federalreserve.gov/newsevents/2026-November.htm"],
] as const;

function Ref({ ids }: { ids: number[] }) {
  return <span className="source-note">{ids.map(id => <a key={id} href={sources[id - 1][1]} target="_blank" rel="noreferrer"> [{id}]</a>)}</span>;
}

export default function WeeklyMarketNovember09() {
  return <main id="main-content" className="article-page">
    <Link className="back-link" href="/">← 記事一覧へ戻る</Link>
    <article>
      <header className="report-header">
        <p className="report-label">WEEKLY MARKET REPORT</p>
        <h1>{editorial.title}</h1>
        <p className="report-date">公開日：2026年11月14日／対象週：2026年11月9日（月）〜11月13日（金）</p>
      </header>
      <div className="report-body">
        <section>
          <h2>今週の要約：週間で反発、週末はAI株に売り</h2>
          <p>日経平均、ダウ平均、NASDAQ総合、SOXはいずれも前週末から上昇した。一方、13日の米市場では半導体などが売られ、NASDAQ総合は下落した。NVIDIAの経営交代を受け、製品の供給だけでなく、取引先への出資や資金面の支援がどう続くかにも関心が集まった。<Ref ids={[1, 2, 3, 4, 6]} /></p>
          <p className="source-note">情報基準：2026年11月14日08:00 JST。日本株は13日の東京市場、米株は13日の通常取引終値。米東部時間13日16:00は日本時間14日06:00。</p>
        </section>
        <section>
          <h2>主要4指数：11月6日と13日の終値</h2>
          <div className="table-wrap"><table className="report-table">
            <thead><tr><th scope="col">指数</th><th scope="col">11月6日終値</th><th scope="col">11月13日終値</th><th scope="col">週間騰落率</th><th scope="col">出典</th></tr></thead>
            <tbody>
                <tr><th scope="row">日経平均（円）</th><td>57,434.77</td><td>61,142.35</td><td>+6.46%</td><td><Ref ids={[1]} /></td></tr>
                <tr><th scope="row">ダウ工業株30種平均（ポイント）</th><td>51,285.73</td><td>52,347.55</td><td>+2.07%</td><td><Ref ids={[2,3]} /></td></tr>
                <tr><th scope="row">NASDAQ総合（ポイント）</th><td>24,579.42</td><td>25,136.27</td><td>+2.27%</td><td><Ref ids={[2,3]} /></td></tr>
                <tr><th scope="row">SOX・フィラデルフィア半導体株指数（ポイント）</th><td>9,390.3</td><td>10,146.3</td><td>+8.05%</td><td><Ref ids={[4,5,6]} /></td></tr>
            </tbody>
          </table></div>
          <p>日経平均は週間+6.46%、ダウ平均は週間+2.07%、NASDAQ総合は週間+2.27%、SOXは週間+8.05%。両市場の前週最終取引日は11月6日、当週最終取引日は13日。「（13日終値÷6日終値−1）×100」を小数第2位に丸めた。配当の再投資や円換算はしていない。NASDAQは総合指数を使用した。</p>
          <p className="source-note">SOXはInvesting.comの取引終了表示付き日次履歴の両日値を小数第1位でそろえた。6日値はNasdaq提供のFRED系列でも丸め後に一致し、13日値はReutersの引け後報道の日次騰落の方向・概数と整合する。13日の取引中の値は採用していない。<Ref ids={[4, 5, 6]} /></p>
        </section>
        <section>
          <h2>日本株：指数は反発、AI関連でも銘柄ごとに明暗</h2>
          <p>13日の東京ではアドバンテストと東京エレクトロンが日経平均の押し上げに寄与し、ソフトバンクグループは押し下げに寄与した。同グループは10日に2027年3月期の中間決算を公表した。<Ref ids={[7, 8]} /></p>
          <p><strong>本誌の分析：</strong>装置・検査の受注と、投資会社が保有する未上場株の評価は、同じAI投資に関わっていても利益に届く経路が違う。装置は顧客の発注・検収時期、投資会社は評価益が売却で現金になる時期と追加出資の負担を確認したい。</p>
        </section>
        <section>
          <h2>米国株：NVIDIAの経営交代と、AIインフラの資金調達</h2>
          <p>NVIDIAは12日、ジェンスン・フアン氏がCEOと取締役を辞任し、CFOのコレット・クレス氏が暫定CEOを兼務すると発表した。取締役会は顧客への約束と製品計画を継続する見通しを示した。13日は同社に加え、AMDやBroadcomにも売りが出た。<Ref ids={[6, 9]} /></p>
          <p>AI向けクラウドのCoreWeaveは10日に7〜9月期決算を発表した。会社が示す受注残には、契約があってもサービスを提供できる状態になることなどが売上認識の条件となる分が含まれる。会社は、顧客契約を裏付けとする資金調達や顧客からの前払いも資金源として挙げた。<Ref ids={[10]} /></p>
          <p><strong>本誌の分析：</strong>受注残はその時点の現金残高ではない。設備の稼働が遅れれば売上計上や入金が後ずれしても、設備代や利息の支払いが先に来る可能性はある。NVIDIAの供給計画と資金支援の方針、顧客自身の資金調達は、それぞれ確認が必要だ。</p>
        </section>
        <section>
          <h2>金利・債券・為替・原油：米国債に売り、ドルは対円で159円台</h2>
          <p>米労働統計局が10日に発表した10月の消費者物価指数は総合で前月比0.4%上昇（季節調整済み）。2025年10月の調査欠測のため、総合指数の前年同月比は公表されていない。13日には生産者物価も公表され、Reutersは、週を通じて追加利上げ観測が強まり、米国債の短期利回りに上昇圧力がかかったと伝えた。13日の同報道でドル円は1ドル159.9円付近だった。<Ref ids={[11, 12, 13]} /></p>
          <p>13日の原油先物の清算値はWTIが1バレル88.56ドル、北海ブレントが95.84ドルだった。原油の供給余剰の見通しと、中東の輸送が再び滞るリスクが両方残る。ドル円の観測、原油の清算値、株価の終値はそれぞれ時点が異なる。<Ref ids={[14, 15]} /></p>
          <p><strong>本誌の分析：</strong>米金利の上昇が続けば、借換えを控える企業や設備投資を借入で賄う企業の費用に波及し得る。日本の輸入企業では、ドル建て原油が弱くても円安で円換算の負担が残る場合がある。</p>
        </section>
        <section>
          <h2>市場関係者の見方：買い場、信認低下、上場での見極め</h2>
          <ul>
            <li><strong>強気寄り：</strong>Morgan StanleyのJoseph Moore氏は、AIインフラ需要に強さがあるとみて、株価下落後のMicronやSandiskを評価した。11日の報道で、NVIDIAが12日に発表したCEO辞任より前の見方。<Ref ids={[16]} /></li>
            <li><strong>慎重：</strong>Ameriprise FinancialのAnthony Saglimbene氏は13日、AI関連への信認が揺らぎ、NVIDIAが資金面から支えてきた成長の先行きが読みにくくなったと指摘した。<Ref ids={[6]} /></li>
            <li><strong>中立・条件付き：</strong>Madison InvestmentsのPatrick Ryan氏は13日、Anthropicの上場後の値動きが弱ければ、AI関連への投資家の不安を示す追加材料になると説明した。上場前の時点での条件付きの見方。<Ref ids={[17]} /></li>
          </ul>
        </section>
        <section>
          <h2>翌週11月16日〜20日の注目点</h2>
          <ol>
            <li><strong>16日：日本の7〜9月期GDPの1次速報。</strong>内閣府は8:50公表予定。全体の成長率に加え、個人消費と設備投資を確認する。<Ref ids={[18]} /></li>
            <li><strong>米国17日（日本18日朝）：NVIDIA決算。</strong>会社発表は米太平洋時間13:20ごろ、日本時間18日06:20ごろを予定。製品供給、取引先への資金支援、暫定経営陣の説明を確認する。<Ref ids={[9]} /></li>
            <li><strong>米国18日：FOMC議事要旨。</strong>10月27〜28日会合の記録。物価と雇用をどう評価したかを確認し、その後に公表された指標と区別して読む。<Ref ids={[19]} /></li>
            <li><strong>米小売売上高とAnthropicの上場予定。</strong>Reutersは17日の小売売上高と翌週の上場を挙げた。上場条件・日程は変更され得る。資金調達額と上場後の時価総額を分け、初値だけでAIサービスの採算を判断しない。<Ref ids={[17]} /></li>
          </ol>
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
