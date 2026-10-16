import type { Metadata } from "next";
import Link from "next/link";
import editorialTitles from "../../../content/editorial-titles.json";
import { createArticleMetadata } from "../../../lib/article-metadata";

const editorial = editorialTitles["weekly-2026-10-12"];
export const metadata: Metadata = createArticleMetadata(editorial);

const sources = [
 ["日経平均プロフィル：2026年10月9日終値","https://indexes.nikkei.co.jp/nkave/archives/summary?dt=20261009&idx=nk225"],
 ["Yahoo!ファイナンス：日経平均10月9日・16日の日次履歴","https://finance.yahoo.co.jp/quote/998407.O/history"],
 ["AP通信：2026年10月9日の米国株","https://apnews.com/article/dafbd0c4037ee10e2a9e305f3cfa8e70"],
 ["AP通信：2026年10月16日の米国株終値と週間騰落","https://apnews.com/article/c27809783ae3230b44c26e5ee4bea056"],
 ["Investing.com：フィラデルフィア半導体株指数の10月9日・16日終値","https://jp.investing.com/indices/phlx-semiconductor-historical-data"],
 ["日本取引所グループ：2026年10月市場カレンダー","https://www.jpx.co.jp/calendar/index.html"],
 ["マネックス証券：日経平均10月13日〜16日の履歴","https://stocks.monex.co.jp/JP%3A%24MNK/historical"],
 ["米BLS：9月消費者物価指数（2026年10月14日公表）","https://www.bls.gov/news.release/archives/cpi_10142026.htm"],
 ["米BLS：9月生産者物価指数（2026年10月15日公表）","https://www.bls.gov/news.release/archives/ppi_10152026.htm"],
 ["TSMC投資家向け：2026年第3四半期決算・第4四半期見通し","https://investor.tsmc.com/english/quarterly-results/2026/q3"],
 ["TSMC公式：2026年第3四半期決算ニュースリリース","https://pr.tsmc.com/chinese/news/3346"],
 ["ASML公式IR：2026年第3四半期決算（10月14日）","https://investor.asml.com/news-releases/news-release-details/asml-reports-eu11.7-billion-total-net-sales-and-eu5.0-billion-net-income-q3-2026"],
 ["Reuters：10月16日、AI株・CoreWeaveの社債売り","https://www.reuters.com/business/wall-st-futures-mixed-tech-wobbles-again-tesla-gains-2026-10-16/"],
 ["AP通信：10月16日、米国債・原油・米国株","https://apnews.com/article/d2655f64db7ec8ae450525d58f97b628"],
 ["Reuters：10月16日、Brent・WTIの清算値","https://www.reuters.com/business/autos-transportation/oil-edges-down-investors-weigh-possible-us-sanctions-shadow-fleet-2026-10-16/"],
 ["Investor's Business Daily：10月16日、BofAのVivek Arya氏の半導体株評価","https://www.investors.com/news/technology/chip-stocks-continue-downward-streak-pricing-in-a-crash/"],
 ["Business Insider：10月16日、個人・機関投資家のAI株需給とVanda Research","https://www.businessinsider.com/retail-traders-ai-stocks-coreweave-bonds-crwv-citadel-securities-2026-10"],
 ["Reuters：10月16日、FRB議長Kevin Warsh氏の見解","https://www.reuters.com/markets/asia/feds-warsh-gives-no-hint-october-policy-decision-2026-10-16/"],
 ["Reuters：10月16日、IMF専務理事Georgieva氏の見解","https://www.reuters.com/technology/imf-chief-says-ai-risks-may-exceed-opportunities-without-safeguards-ethical-2026-10-16/"],
 ["WSJ：10月16日、米国債利回りの週間推移","https://www.wsj.com/finance/most-jgbs-rise-tracking-gains-in-u-s-treasurys-80602aa7"],
 ["USD/JPY：2026年10月9日・16日の参考相場履歴","https://www.poundsterlinglive.com/history/usd-jpy-2026"],
 ["総務省統計局：日本の消費者物価指数（公表元）","https://www.stat.go.jp/data/cpi/index.html"],
 ["米BLS：2026年10月の統計発表スケジュール","https://www.bls.gov/schedule/2026/10_sched.htm"],
] as const;

function Ref({ ids }: { ids: number[] }) {
 return <span className="source-note">{ids.map((id) => <a key={id} href={sources[id - 1][1]} target="_blank" rel="noreferrer"> [{id}]</a>)}</span>;
}

export default function WeeklyMarketOctober12() {
 return (
  <main id="main-content" className="article-page">
   <Link className="back-link" href="/">← 記事一覧へ戻る</Link>
   <article>
    <header className="report-header">
     <p className="report-label">WEEKLY MARKET REPORT</p>
     <h1>{editorial.title}</h1>
     <p className="report-date">公開日：2026年10月17日／対象週：2026年10月12日（月）〜16日（金）</p>
    </header>
    <div className="report-body">
     <section>
      <h2>今週の要約：半導体の実需は強い。それでも信用不安で株価は下落</h2>
      <p>10月12〜16日の株式市場では日経平均が<strong>-5.37%</strong>、NASDAQ総合指数が<strong>-4.48%</strong>、SOX（フィラデルフィア半導体株指数）が<strong>-11.41%</strong>と下落した。対照的にダウ工業株30種平均は<strong>+0.67%</strong>。AI・半導体を中心に売られた一方、他業種への選別的な資金移動も確認できる。<Ref ids={[1,2,3,4,5]} /></p>
      <p>週中にはASML、TSMCの好決算が公表された。それでもAIインフラに投資する企業の債券調達負担への懸念は強まり、米国株では16日も半導体株が下げた。米9月CPIとPPIの上昇、Brent原油の約110ドルへの接近も投資家のリスク評価に影響した。<Ref ids={[8,9,10,11,12,13,15]} /></p>
      <p><strong>本誌の分析：</strong>今週の主要論点は「AI需要が消えたか」ではなく、「膨大な設備投資がいつ十分なキャッシュフローを生むのか」だ。需要を裏付ける製造業の決算と、資金調達側の信用不安は同時に存在する。特定企業の社債が売られた事実だけで、半導体製造装置メーカーすべての将来受注減を断定することはできない。</p>
      <p className="source-note">データ基準：2026年10月17日朝（日本時間）。日本株は10月16日の東京市場、米国株・米国債・原油は10月16日の米国取引・報道。日本は10月12日（月・祝）が現物市場休場で4営業日。米株は5営業日。<Ref ids={[6]} /></p>
     </section>
     <section>
      <h2>主要4指数：前週最終取引日と当週最終取引日の終値</h2>
      <div className="table-wrap"><table className="report-table">
       <thead><tr><th>指数</th><th>10月9日終値</th><th>10月16日終値</th><th>週間騰落率</th><th>出典</th></tr></thead>
       <tbody>
        <tr><td>日経平均株価（円）</td><td>69,030.92</td><td>65,324.29</td><td>-5.37%</td><td><Ref ids={[1,2,7]} /></td></tr>
        <tr><td>ダウ工業株30種平均（pt）</td><td>51,654.95</td><td>52,002.41</td><td>+0.67%</td><td><Ref ids={[3,4]} /></td></tr>
        <tr><td>NASDAQ総合指数（pt）</td><td>27,366.17</td><td>26,140.03</td><td>-4.48%</td><td><Ref ids={[3,4]} /></td></tr>
        <tr><td>SOX・PHLX半導体株指数（pt）</td><td>12,572.4</td><td>11,137.3</td><td>-11.41%</td><td><Ref ids={[5]} /></td></tr>
       </tbody>
      </table></div>
      <p>計算式は<strong>（10月16日終値÷10月9日終値−1）×100</strong>。小数第3位を四捨五入した。ナスダック指数には<strong>NASDAQ総合</strong>を採用し、NASDAQ 100ではない。SOXは価格指数であり、配当込み指数や決済値とは区別した。配当再投資・円換算を含まない。<Ref ids={[3,4,5]} /></p>
      <p><strong>本誌の分析：</strong>日経平均は週間で3,706.63円下落。NASDAQ総合とSOXの差から、半導体セクターが市場全体より強く売られたことが分かる。指数の値動きを、全構成企業の事業価値の変化と同一視しない。</p>
     </section>
     <section>
      <h2>日本株：木曜の急落と金曜の反発、半導体株の影響</h2>
      <h3>確認された値動き</h3>
      <p>祝日明けの13日、日経平均は67,777.52円で取引を終え、14日は67,744.29円、15日は64,425.95円、16日は65,324.29円。15日の下落は前日比-3,318.34円（-4.90%）、16日は+898.34円（+1.39%）の反発だった。金曜の上昇だけでは週間下落を埋められなかった。<Ref ids={[2,6,7]} /></p>
      <p>10月9日時点の日経平均プロフィルでは、アドバンテスト、東京エレクトロン、ソフトバンクグループなど、AI関連の影響が大きい銘柄が指数の高い比率を占める。世界のAI資金調達不安が日本の半導体関連株と指数に波及しやすいが、日本の内需・金融・資源関連銘柄まで同じ事業環境だとは言えない。<Ref ids={[1,2]} /></p>
      <h3>半導体関連企業への因果関係（本誌の分析）</h3>
      <p>AI利用事業者が計算能力の増強を先送りすれば、まずGPUリース・クラウド契約の交渉や資金調達条件に影響し、その後半導体メーカーや製造装置メーカーの受注に伝わる可能性がある。ただし各社の設備投資計画は複数年のため、影響の時間軸は異なる。アドバンテスト、東京エレクトロン、KOKUSAI ELECTRICではテスト工程と前工程の違いもあり、単純に同率の業績悪化とは見なせない。今週、これら日本企業の具体的な受注減が確認されたと主張するものではない。</p>
     </section>
     <section>
      <h2>米国株：AIインフラの資金調達と株式市場の選別</h2>
      <p>Reutersは10月16日、NVIDIAの出資先であるCoreWeaveの債券が売られ、一部の利回りが15%を超えたと報道した。米国債との利回り差には、資金の回収可能性に対する信用・流動性リスクが含まれる。この特定企業の利回りを米国の標準的な企業調達金利とみなしてはいけない。<Ref ids={[13]} /></p>
      <p>APが示した16日の終値では、NASDAQ総合は前日比約2.1%下落。Micron、AMD、Broadcom、Intelなど半導体関連の主要株が大幅安だった。エネルギー関連株の一部は原油高の恩恵を受け、ダウ平均は週間ではプラスを維持した。<Ref ids={[4,14]} /></p>
      <h3>TSMC・ASML：公表された好決算と株価を分離</h3>
      <p>TSMCは15日、2026年第3四半期の台湾ドル建て売上高<strong>1兆4,942億台湾ドル（前年同期比+50.9%）</strong>、純利益<strong>7,631億台湾ドル（+68.7%）</strong>を公表した。粗利益率66.4%、営業利益率58.7%。米ドル建て売上高は467.2億ドルで前年同期比+41.2%と、為替換算による成長率の違いにも注意が必要。2026年第4四半期の会社売上見通しは523億〜543億米ドルだった。<Ref ids={[10,11]} /></p>
      <p>ASMLは14日、2026年第3四半期の売上高を約117億ユーロ、純利益を約50億ユーロと発表した。両社の一次資料は、少なくとも最先端半導体・製造装置の足元の需要が急消滅していないことを示す。一方、市場価格は将来の利益率、設備投資の持続性、既に織り込んだ成長率、資本コストまで織り込むため、好決算と株安は矛盾しない。<Ref ids={[12]} /></p>
      <p><strong>本誌の分析：</strong>AI半導体の売上が大きく伸びても、購入・リースする企業の投資回収が遅れるなら次の設備投資計画は縮小し得る。逆に利用料収入が予想を上回れば信用不安が和らぐ余地がある。「半導体需要の有無」「データセンター投資の資金効率」「株価の割高・割安」は別問題として検証する。</p>
     </section>
     <section>
      <h2>インフレ：米国CPIとPPI、エネルギー価格の上昇</h2>
      <p>米労働統計局（BLS）が14日に発表した9月CPIは前月比<strong>+0.6%</strong>、前年同月比<strong>+3.7%</strong>。ガソリンは前月比+9.1%、エネルギーは+5.2%。コアCPI（食品とエネルギーを除く）は前月比+0.3%、前年同月比+2.6%だった。総合物価の上昇幅と、エネルギーを除く基調は分けて読む。<Ref ids={[8]} /></p>
      <p>15日の9月PPI（最終需要）は前月比<strong>+1.3%</strong>、前年同月比<strong>+6.3%</strong>。最終需要エネルギー財の指数は前月比+10.8%。生産・輸送にかかる費用の上昇圧力を示すが、PPIの変化が即座にすべての最終消費者価格や企業利益を同率に変えるわけではない。<Ref ids={[9]} /></p>
      <p><strong>本誌の分析：</strong>原油高が長期化すると電力・輸送費を通じてAI投資の採算にも影響する。金融政策による金利上昇のリスクと、原油輸入企業の実質コスト増が重なる一方、資源・エネルギー権益の保有企業には収益増要因となる可能性がある。エネルギー主導の物価上昇を、すべての財・サービスの需要過熱と同一視しない。</p>
     </section>
     <section>
      <h2>金利・為替・原油・債券：国債利回り低下と社債信用懸念が並存</h2>
      <div className="table-wrap"><table className="report-table">
       <thead><tr><th>市場</th><th>10月16日中心の確認値</th><th>確認すべき論点</th></tr></thead>
       <tbody>
        <tr><td>米10年国債利回り</td><td>終盤約5.09〜5.10%<Ref ids={[14,20]} /></td><td>前週約5.24%から低下。インフレと安全資産需要が綱引き</td></tr>
        <tr><td>AIインフラ企業の社債</td><td>CoreWeaveの一部債券利回り15%超（報道）<Ref ids={[13]} /></td><td>発行体固有の信用スプレッドの拡大と、再調達への影響</td></tr>
        <tr><td>ドル／円</td><td>16日、1ドル158円前後。参考履歴終値158.14円<Ref ids={[21]} /></td><td>配信会社や取引時点で相違。東京市場の株価終値との時刻差に注意</td></tr>
        <tr><td>Brent原油先物</td><td>16日清算値109.86米ドル／バレル<Ref ids={[15]} /></td><td>中東情勢・供給リスクとエネルギー輸入コスト</td></tr>
        <tr><td>WTI原油先物</td><td>16日清算値101.41米ドル／バレル<Ref ids={[15]} /></td><td>Brentとは原油規格・需給・引渡地点が異なる</td></tr>
        <tr><td>日本国債</td><td>16日の同一基準による公的10年債終値は未照合</td><td>不確定の数字を補作せず、日銀政策・インフレ期待・国債需給を注視</td></tr>
       </tbody>
      </table></div>
      <p>インフレ指標が強くても米国債利回りは週間で低下し得る。投資家が信用リスクを避けて国債を買うと、債券価格は上昇し利回りは下がる。一方、特定企業の債券が売られれば、その債券利回りは上がり、国債とのスプレッドが広がる。「金利が上昇したからAI株が下がった」と一因だけで説明するより、国債の安全資産需要とAI企業固有の信用リスクを分離するのが適切だ。<Ref ids={[13,14,20]} /></p>
      <p>Reutersが報じた16日の原油上昇には中東の供給不安が影響した。日本のエネルギー輸入コストは円相場にも依存し、同じ原油価格上昇でも円高・円安で受ける影響は異なる。<Ref ids={[15,21]} /></p>
     </section>
     <section>
      <h2>市場関係者の視点：強気・弱気・中立の条件</h2>
      <p>以下は報道された発言を本誌が分類・要約したものであり、本人が株式市場全体に公式の強気・弱気・中立レーティングを付けた意味ではない。対象企業、時間軸、制度上の立場は異なる。</p>
      <ul className="viewpoints">
       <li><strong>強気寄り：Vivek Arya氏（BofA Securities、IBD、10月16日）。</strong>半導体株が既に厳しいシナリオを織り込んでいるとし、AI・データセンター向け需要の持続に建設的な見方を示した。短期的な底値や利益を保証する発言ではない。<Ref ids={[16]} /></li>
       <li><strong>弱気・需給リスク重視：Viraj Patel氏（Vanda Research、Business Insider、10月16日）。</strong>個人のAI株押し目買いが続く一方で、機関投資家は防御的な姿勢を見せており、買いの力が以前ほど強くない可能性を指摘した。需給に関する見解であり、半導体企業の受注減少を認定するものではない。<Ref ids={[17]} /></li>
       <li><strong>中立・両面評価：Kevin Warsh氏（FRB議長、Reuters、10月16日）。</strong>AI投資は短期的な需要・インフレ圧力と、長期的な生産性上昇の双方につながり得ると説明。次回の金融政策判断を先取りしなかった。中央銀行当局者の政策分析であって株価予想ではない。<Ref ids={[18]} /></li>
       <li><strong>構造的リスク：Kristalina Georgieva氏（IMF専務理事、Reuters、10月16日）。</strong>AIの恩恵には電力・デジタル基盤と安全策が必要で、不十分ならリスクが便益を上回り得ると警告。これは市場の具体的な下値を予想したものではない。<Ref ids={[19]} /></li>
      </ul>
      <p><strong>本誌の比較：</strong>強気派は将来需要の底堅さ、弱気派は直近の市場需給・資金繰り、中立派は長短の時間軸を重視している。好決算と株安の両立は、これらの違いから理解できる。<Ref ids={[10,13,16,17,18]} /></p>
     </section>
     <section>
      <h2>翌週10月19日（月）〜23日（金）の注目点</h2>
      <ol>
       <li><strong>10月23日（金）日本の全国CPI（9月分）の公表予定。</strong>総務省統計局で実際の発表時刻・結果を確認し、エネルギー要因と基調物価、円・日本国債への影響を分けて読む。<Ref ids={[22]} /></li>
       <li><strong>米大型企業の決算シーズン。</strong>Tesla、Meta Platformsなどの企業動向では実際の発表予定を各社IRで再確認し、AI設備投資支出、営業キャッシュフロー、クラウド収益化と会社見通しに注目する。<Ref ids={[4,13]} /></li>
       <li><strong>信用スプレッドの推移。</strong>CoreWeaveを含むAI計算資本の社債利回りだけでなく、満期、借換条件、契約上の担保、資金繰りを確認。金融ストレスが実際の半導体発注に波及した証拠があるかを追う。<Ref ids={[13]} /></li>
       <li><strong>FRBと金利の織り込み。</strong>米CPI・PPI上昇後の政策金利見通しを確認する。10月27〜28日のFOMCは翌週19〜23日の後であり、会合当日の結果はまだ出ていない。<Ref ids={[8,9,18,23]} /></li>
       <li><strong>原油・為替と日本企業。</strong>Brentの110ドル接近が持続するか、供給障害が解消するかを確認し、円建てエネルギーコストと企業の価格転嫁力に結びつける。<Ref ids={[15,21]} /></li>
      </ol>
     </section>
     <section>
      <h2>三つのシナリオと検証項目（本誌の予測・分析）</h2>
      <p><strong>上向き：</strong>AIインフラ事業者が資金調達に成功し、半導体メーカーの受注・設備投資計画が維持される一方、原油と金利が落ち着く。市場の信用不安が和らげば評価倍率が戻る可能性がある。</p>
      <p><strong>下向き：</strong>社債の高利回りが継続し、新規設備投資・GPU契約に減額・延期が発生する。さらに半導体メーカー・装置メーカーが受注見通しを下方修正すれば、単なる市場心理ではなく企業利益の下押しへ移行する。</p>
      <p><strong>選別：</strong>TSMCやASMLの先端半導体需要は強く、財務余力の乏しいAI利用企業だけが投資を抑える場合。勝者と敗者は売上成長だけでなく利益率、FCF、受注残、ROIC、負債の償還条件により分かれる可能性がある。</p>
      <p><strong>監視する因果関係：</strong>AI利用企業の資金調達条件→新規クラウド契約・GPU投資→半導体の発注→製造装置の売上、という伝達経路を仮説として追う。債券価格の下落だけで最終段階の装置受注が既に減ったと断定しない。以上は条件付きの仮説であり、実現確率や将来収益を保証するものではない。</p>
     </section>
     <section>
      <h2>出典一覧と数値の確認条件</h2>
      <p>出典は公開日と観測日をなるべく明示し、BLS・企業IR・指数算定機関などの一次資料を優先した。市場価格には取引市場・時点・丸め精度の違いがあり、SOXの配当込み指数、為替の異なる市場終値、日本市場休場日を混同しない。発言者の解釈と確定決算を別々に扱う。最新情報により数値・市場見通しは改定され得る。</p>
      <ol>{sources.map(([label,url]) => <li key={url}><a href={url} target="_blank" rel="noreferrer">{label}</a></li>)}</ol>
     </section>
     <section className="disclaimer">
      <h2>注意事項</h2>
      <p>本記事は公開資料・報道を整理した一般的な市場調査であり、特定の金融商品の売買を推奨する投資助言ではありません。市場価格、統計および企業見通しは後日改定され得ます。本誌の分析・条件付き予測は将来の結果を保証せず、投資には元本割れを含むリスクがあります。事実と仮説・市場関係者の見解を区別してご利用ください。</p>
     </section>
    </div>
   </article>
  </main>
 );
}
