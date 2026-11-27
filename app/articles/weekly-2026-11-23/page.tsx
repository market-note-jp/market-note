import type { Metadata } from "next";
import Link from "next/link";
import editorialTitles from "../../../content/editorial-titles.json";
import { createArticleMetadata } from "../../../lib/article-metadata";

const editorial = editorialTitles["weekly-2026-11-23"];
export const metadata: Metadata = createArticleMetadata(editorial);

const sources = [
  ["日本経済新聞社・日経平均の日次履歴（2026年11月27日更新）","https://indexes.nikkei.co.jp/en/nkave/archives/data"],
  ["AP・11月20日の確定終値（2026年11月20日）","https://apnews.com/article/c10b797a17c2acf37924d834efebe135"],
  ["AP・11月27日の確定終値（2026年11月27日）","https://apnews.com/article/wall-street-stocks-dow-nasdaq-04dab6079cf7f3dfe7285a3cc1f240a2"],
  ["Investing.com・SOX日次履歴のPrice欄（2026年11月27日、28日朝確認）","https://www.investing.com/indices/phlx-semiconductor-historical-data"],
  ["Nasdaq提供・FRED、SOX日次値（2026年11月25日更新）","https://fred.stlouisfed.org/series/NASDAQSOX"],
  ["NVIDIA・フアン氏の経営復帰と調査の継続（2026年11月23日）","https://nvidianews.nvidia.com/news/nvidia-board-reinstates-jensen-huang-as-president-ceo-and-board-director/"],
  ["Reuters・27日の世界市場、米国債（2026年11月27日）","https://www.reuters.com/world/china/global-markets-global-markets-2026-11-27/"],
  ["JPX・休業日一覧（2026年11月28日確認）","https://www.jpx.co.jp/corporate/about-jpx/calendar/"],
  ["NYSE・休場と短縮取引（2026年11月28日確認）","https://www.nyse.com/trade/hours-calendars?os=i"],
  ["日本経済新聞社・27日サマリーとセクター寄与（2026年11月27日）","https://indexes.nikkei.co.jp/nkave/archives/summary"],
  ["総務省統計局・東京都区部11月CPI中旬速報（2026年11月27日）","https://www.stat.go.jp/data/cpi/sokuhou/tsuki/index-t.htm"],
  ["Dell・2027年度第3四半期決算と受注審査（2026年11月24日）","https://investors.delltechnologies.com/news-events/press-releases/detail/1665/dell-technologies-delivers-third-quarter-fiscal-2027-financial-results"],
  ["BEA・10月個人所得と支出、技術注記（2026年11月25日）","https://www.bea.gov/news/2026/personal-income-and-outlays-October-2026"],
  ["Reuters・翌週の米雇用と市場関係者の見方（2026年11月27日）","https://www.reuters.com/business/wall-st-week-ahead-sliding-stock-market-confronts-jobs-data-rate-view-next-tests-2026-11-27/"],
  ["Reuters・ドル円の観測（2026年11月27日）","https://www.reuters.com/world/africa/dollar-lingers-near-22-month-peak-ai-worries-simmer-2026-11-27/"],
  ["Reuters・原油先物清算値と供給懸念（2026年11月27日）","https://www.reuters.com/business/energy/brent-trades-near-months-high-mideast-conflict-threatens-supply-2026-11-27/"],
  ["Reuters配信・Morgan Stanleyの強気論、Investing.com掲載（2026年11月23日）","https://www.investing.com/news/stock-market-news/morgan-stanley-turns-most-bullish-on-stocks-since-april-after-last-weeks-selloff-5045615"],
  ["BLS・12月の公表日程（2026年11月9日更新、28日確認）","https://www.bls.gov/schedule/2026/12_sched_list.htm"],
  ["Yahoo Finance・SOXの27日Close欄（2026年11月27日、28日照合）","https://finance.yahoo.com/quote/%5ESOX/history/"],
] as const;

function Ref({ ids }: { ids: number[] }) {
  return <span className="source-note">{ids.map(id => <a key={id} href={sources[id - 1][1]} target="_blank" rel="noreferrer"> [{id}]</a>)}</span>;
}

export default function WeeklyMarketNovember23() {
  return <main id="main-content" className="article-page">
    <Link className="back-link" href="/">← 記事一覧へ戻る</Link>
    <article>
      <header className="report-header">
        <p className="report-label">WEEKLY MARKET REPORT</p>
        <h1>{editorial.title}</h1>
        <p className="report-date">公開日：2026年11月28日／対象週：2026年11月23日（月）〜11月27日（金）</p>
      </header>
      <div className="report-body">
        <section>
          <h2>今週の要約：AI株が反発、資金調達への疑問は残る</h2>
          <p>日経平均、ダウ平均、NASDAQ総合、SOXはいずれも前週末から上昇した。NVIDIAが23日にジェンスン・フアン氏のCEO復帰を発表し、AI関連への買い戻しを支えた。ただし米株は週中に再び売られる場面もあり、経営体制への安心感だけで投資採算への懸念が解消したわけではない。<Ref ids={[1, 2, 3, 4, 6, 7]} /></p>
          <p><strong>本誌の分析：</strong>顧客の資金調達、設備の稼働、売り手の現金回収は別々の段階にある。経営トップの復帰や受注の存在を、すべての投資の回収が確実になったとの意味では扱わない。翌週は米雇用統計で金利の条件を、企業開示で資金と契約の進捗を点検したい。</p>
          <p className="source-note">情報基準：2026年11月28日08:00 JST。対象は23日（月）〜27日（金）。日本は23日、米国は26日が休場。米株の27日は短縮取引の通常セッション終値で、米東部時間13:00、日本時間28日03:00に終了した。<Ref ids={[8, 9]} /></p>
        </section>
        <section>
          <h2>主要4指数：11月20日と27日の確定終値</h2>
          <div className="table-wrap"><table className="report-table">
            <thead><tr><th scope="col">指数</th><th scope="col">11月20日終値</th><th scope="col">11月27日終値</th><th scope="col">週間騰落率</th><th scope="col">出典</th></tr></thead>
            <tbody>
              <tr><th scope="row">日経平均（円）</th><td>56,436.65</td><td>58,711.11</td><td>+4.03%</td><td><Ref ids={[1]} /></td></tr>
              <tr><th scope="row">ダウ工業株30種平均（ポイント）</th><td>48,147.33</td><td>50,774.94</td><td>+5.46%</td><td><Ref ids={[2,3]} /></td></tr>
              <tr><th scope="row">NASDAQ総合（ポイント）</th><td>22,617.73</td><td>24,129.50</td><td>+6.68%</td><td><Ref ids={[2,3]} /></td></tr>
              <tr><th scope="row">SOX・フィラデルフィア半導体株指数（ポイント）</th><td>8,408.6</td><td>9,186.7</td><td>+9.25%</td><td><Ref ids={[4,5]} /></td></tr>
            </tbody>
          </table></div>
          <p>日経平均は週間+4.03%、ダウ平均は週間+5.46%、NASDAQ総合は週間+6.68%、SOXは週間+9.25%。前週最終取引日は両市場とも11月20日、当週最終取引日は27日。計算は「（27日終値÷20日終値−1）×100」、小数第2位への丸め。配当再投資と円換算は含まない。NASDAQは総合指数を採用し、NASDAQ 100やその先物とは区別した。</p>
          <p className="source-note">SOXは同じInvesting.com日次履歴の終値を小数第1位で統一。20日はNasdaq提供FREDの8,408.59と丸め後に一致する。確認時点のFREDは25日までで、27日は取引終了表示付きの日次履歴を採用。27日のYahoo FinanceのClose欄9,186.71とも丸め後に一致する。リアルタイム欄に残る取引中の値は使用していない。<Ref ids={[4, 5, 19]} /></p>
        </section>
        <section>
          <h2>日本株：週末に買い戻し、東京の物価も公表</h2>
          <p>日経の27日の公式サマリーは、技術、情報通信、素材などが日経平均を押し上げた一方、消費はマイナス寄与だったことを示す。週末の指数上昇を、AIに関わる全銘柄の同時上昇とは捉えない。<Ref ids={[10]} /></p>
          <p>27日には総務省が11月の東京都区部CPI中旬速報を公表した。全国の翌月の確定的な姿ではなく、対象地域と調査時点を限定した物価の材料である。<Ref ids={[11]} /></p>
          <p><strong>本誌の分析：</strong>海外のAI投資が日本の装置・検査・部材企業へ届くまでには、発注と検収の時間差がある。輸出企業は為替換算の追い風だけでなく、販売数量と顧客の支払い能力を確認したい。内需企業では原材料費の転嫁と、値上げ後の数量・客数を分けて見る必要がある。</p>
        </section>
        <section>
          <h2>米国株：NVIDIAのCEO復帰とDellの受注審査</h2>
          <p>NVIDIAは23日、フアン氏が社長・CEO・取締役に即時復帰すると発表した。同時に、独立取締役による委員会の調査は結論に至るまで続けると説明した。復帰の決定と、すべての調査や規制上の問題の解消は同義ではない。<Ref ids={[6]} /></p>
          <p>Dellは24日に2027年度第3四半期決算を発表した。同社はAI受注について、顧客の質と資金調達、用地、電力へのアクセスを審査していると説明した。受注があっても設備を置く場所、電力、支払い能力がそろっているかを確認するという点が重要だ。<Ref ids={[12]} /></p>
          <p><strong>本誌の分析：</strong>受注残は売上でも回収済みの現金でもない。顧客向けの金融債権や在庫を伴う成長では、出荷後の支払いと、仕入れ・返済の期限がずれる可能性がある。需要の存在と、売り手・買い手双方の投資回収を別々に検証したい。</p>
        </section>
        <section>
          <h2>米消費と金利・債券：反発しても金融政策は別の判断</h2>
          <p>BEAは25日に10月の個人所得・支出とPCE物価を公表した。名目支出は増えた一方、実質支出はほぼ横ばいだった。所得増には一時的な医療保険関連の還付も含まれるため、所得総額の動きだけを継続的な賃金の強さと同一視しない。<Ref ids={[13]} /></p>
          <p>27日のReutersの市場概況では、株式への買いが戻る一方、米国債は売りに押される局面があった。株価の反発は、FRBが引き締めを終えるとの確認ではない。市場は翌週の雇用統計と12月会合を意識している。<Ref ids={[7, 14]} /></p>
          <p><strong>本誌の分析：</strong>雇用と消費が強ければ売上を支え得るが、金利が高く保たれる可能性もある。設備投資を借入で賄う企業では、その両面を考える必要がある。国債の値上がりを株安時の必然と考えず、満期と金利感応度も分けたい。</p>
        </section>
        <section>
          <h2>為替・原油：ドル円は159円台、供給リスクを注視</h2>
          <p>27日のReuters為替報道では、ドル円は1ドル159.51円付近。株高時のリスク選好と、通貨の安全資産需要が重なるため、株価だけから為替の方向は決められない。これは報道時点の観測で、東京引けや米株引けと同時刻の評価ではない。<Ref ids={[15]} /></p>
          <p>27日の原油先物清算値は北海ブレントが1バレル95.44ドル、WTIが83.08ドル。Reutersはホルムズ海峡の船舶やサウジのエネルギー施設への攻撃を巡る供給懸念を報じた。WTIは米感謝祭の26日に清算値がなく、株価と同じ休場・清算ルールとは限らない。<Ref ids={[16]} /></p>
          <p><strong>本誌の分析：</strong>原油の供給不安と消費・景気への懸念は同時に価格へ働く。日本企業の費用にはドル建て価格と為替の両方が関わり、ヘッジの更新時期によっても影響が異なる。定義のそろわない価格を接ぎ合わせた週間リターンは掲載しない。</p>
        </section>
        <section>
          <h2>市場関係者の見方：強気・慎重・中立</h2>
          <p>以下は発言・レポートを本誌が分類したもので、市場の総意や確定予測ではない。</p>
          <ul>
            <li><strong>強気：</strong>Morgan StanleyのMike Wilson氏らは23日、前週の売りを事業の基礎条件以上に行き過ぎたと捉え、反発余地を指摘した。<Ref ids={[17]} /></li>
            <li><strong>慎重：</strong>Cresset CapitalのJoseph Zidle氏は27日、CEO復帰でも循環的な資金供給や設備投資の持続性への疑問は解消しないと指摘した。<Ref ids={[14]} /></li>
            <li><strong>中立・条件付き：</strong>Wealth EnhancementのAyako Yoshioka氏は27日、経済の強さがFRBの利上げを後押しするという両面を説明した。<Ref ids={[14]} /></li>
          </ul>
          <p><strong>判断を変える条件：</strong>資金調達条件の安定と受注の現金化が進めば、反発を支える根拠になる。顧客の支払い遅延や契約変更が広がれば、株価反発より慎重論を重く見る。</p>
        </section>
        <section>
          <h2>翌週11月30日〜12月4日の注目点</h2>
          <ol>
            <li><strong>12月1日：米10月JOLTS。</strong>BLS予定は米東部時間10:00、日本時間2日00:00。求人だけでなく採用と離職を確認し、企業が人員を増やす意思と実際の雇用を分ける。<Ref ids={[18]} /></li>
            <li><strong>12月4日：米11月雇用統計。</strong>米東部時間8:30、日本時間22:30。雇用者数、失業率、賃金と過去分の改定を併せて確認し、12月の金融政策への含意を読む。<Ref ids={[18]} /></li>
            <li><strong>通週：AI企業の資金・契約と小売の年末商戦。</strong>短縮取引での反発が通常の出来高の下でも続くか、受注が設備の稼働と入金につながるかを点検する。値動きと決算の確認を混同しない。</li>
          </ol>
          <p><strong>条件付きの見通し：</strong>金利上昇圧力が和らぎ、企業の回収見通しが保たれれば反発が続く余地はある。一方、好調な指標が引き締めを強め、調達費用と顧客の投資意欲を圧迫する場合には再び評価が下がり得る。いずれも今後の開示で検証するシナリオである。</p>
        </section>
        <section>
          <h2>出典一覧</h2>
          <p>指数算定機関、取引所、企業開示、政府統計と主要報道を参照。更新型ページは情報基準時点の内容で、後日改定される場合がある。</p>
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
