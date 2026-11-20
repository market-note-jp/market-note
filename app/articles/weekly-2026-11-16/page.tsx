import type { Metadata } from "next";
import Link from "next/link";
import editorialTitles from "../../../content/editorial-titles.json";
import { createArticleMetadata } from "../../../lib/article-metadata";

const editorial = editorialTitles["weekly-2026-11-16"];
export const metadata: Metadata = createArticleMetadata(editorial);

const sources = [
  ["日本経済新聞社・日次履歴（2026年11月20日更新）","https://indexes.nikkei.co.jp/en/nkave/archives/data"],
  ["AP・11月13日の確定終値、Yahoo掲載（2026年11月13日）","https://ca.finance.yahoo.com/news/major-us-stock-indexes-fared-211854052.html"],
  ["AP・11月20日の確定終値（2026年11月20日）","https://apnews.com/article/c10b797a17c2acf37924d834efebe135"],
  ["Investing.com・SOX日次履歴、取引終了表示（2026年11月20日）","https://www.investing.com/indices/phlx-semiconductor-historical-data"],
  ["Nasdaq提供・FRED、SOX日次値（2026年11月19日更新）","https://fred.stlouisfed.org/series/NASDAQSOX"],
  ["NVIDIA・2027年度第3四半期決算（2026年11月17日）","https://nvidianews.nvidia.com/news/nvidia-announces-financial-results-for-third-quarter-fiscal-2027?trk=article-ssr-frontend-pulse_little-text-block"],
  ["Reuters・SECの調査を巡る報道（2026年11月20日）","https://www.reuters.com/world/us-secs-nvidia-probe-is-examining-potential-accounting-issues-sources-say-2026-11-20/"],
  ["日本経済新聞社・セクター別寄与、20日のサマリー（2026年11月20日）","https://indexes.nikkei.co.jp/en/nkave/archives/summary?dt=11202026&idx=nk225"],
  ["内閣府・GDP1次速報の統計表（2026年11月16日）","https://www.esri.cao.go.jp/jp/sna/data/data_list/sokuhou/files/2026/qe263/gdemenuja.html"],
  ["総務省統計局・10月全国CPIの概要（2026年11月20日）","https://www.stat.go.jp/data/cpi/sokuhou/tsuki/index-z.html"],
  ["AP・20日の引け後市場概況（2026年11月20日）","https://apnews.com/article/c4c3f4878b12989347f8a930ed813dad"],
  ["Reuters・ドル円と米金利（2026年11月20日）","https://www.reuters.com/business/dollar-near-19-month-peak-ai-jitters-sap-risk-appetite-2026-11-20/"],
  ["FRB・10月会合議事要旨の公表（2026年11月18日）","https://www.federalreserve.gov/newsevents/pressreleases/monetary20261118a.htm"],
  ["Reuters・20日の市場関係者の見方（2026年11月20日）","https://www.reuters.com/business/view-nasdaq-plunges-5-day-after-anthropic-debut-investors-still-believe-ai-2026-11-20/"],
  ["JPX・休業日一覧（2026年11月21日確認）","https://www.jpx.co.jp/corporate/about-jpx/calendar/"],
  ["Yahoo Finance・SOX日次Close欄（2026年11月20日、21日朝照合）","https://finance.yahoo.com/quote/%5ESOX/history/"],
  ["JPX・23日の祝日取引非実施（2026年11月20日）","https://www.jpx.co.jp/news/2040/20261120-01.html"],
  ["BEA・統計公表予定（2026年11月20日更新）","https://www.bea.gov/news/schedule?output=1"],
  ["NYSE・休場と短縮取引（2026年11月21日確認）","https://www.nyse.com/trade/hours-calendars?os=i"],
] as const;

function Ref({ ids }: { ids: number[] }) {
  return <span className="source-note">{ids.map(id => <a key={id} href={sources[id - 1][1]} target="_blank" rel="noreferrer"> [{id}]</a>)}</span>;
}

export default function WeeklyMarketNovember16() {
  return <main id="main-content" className="article-page">
    <Link className="back-link" href="/">← 記事一覧へ戻る</Link>
    <article>
      <header className="report-header">
        <p className="report-label">WEEKLY MARKET REPORT</p>
        <h1>{editorial.title}</h1>
        <p className="report-date">公開日：2026年11月21日／対象週：2026年11月16日（月）〜11月20日（金）</p>
      </header>
      <div className="report-body">
        <section>
          <h2>今週の要約：決算と上場でも、AI株への売りは止まらず</h2>
          <p>日経平均、ダウ平均、NASDAQ総合、SOXはすべて週間で下落した。米国ではNVIDIAの決算とAnthropicの上場が注目されたが、週末は半導体を中心に売りが広がった。NVIDIAの会計を巡る調査報道も重なり、売上の成長だけでなく、その信頼性と顧客の資金調達が問われる週になった。<Ref ids={[1, 2, 3, 4, 6, 7]} /></p>
          <p><strong>本誌の分析：</strong>好決算と株安は両立する。株価は過去の実績に加え、その先の成長と回収できる現金、要求される利回りを織り込むためだ。今回の下落だけでAI需要の消滅を断定することも、決算だけで調整の終了を判断することもできない。</p>
          <p className="source-note">情報基準：2026年11月21日07:57 JST。日本株は20日の東京市場、米株は20日の通常取引終値。米東部時間20日16:00は日本時間21日06:00。20日の東京終値は、その後の米国市場の下落を含まない。</p>
        </section>
        <section>
          <h2>主要4指数：11月13日と20日の終値を比較</h2>
          <div className="table-wrap"><table className="report-table">
            <thead><tr><th scope="col">指数</th><th scope="col">11月13日終値</th><th scope="col">11月20日終値</th><th scope="col">週間騰落率</th><th scope="col">根拠</th></tr></thead>
            <tbody>
              <tr><th scope="row">日経平均（円）</th><td>61,142.35</td><td>56,436.65</td><td>-7.70%</td><td><Ref ids={[1]} /></td></tr>
              <tr><th scope="row">ダウ工業株30種平均（ポイント）</th><td>52,347.55</td><td>48,147.33</td><td>-8.02%</td><td><Ref ids={[2,3]} /></td></tr>
              <tr><th scope="row">NASDAQ総合（ポイント）</th><td>25,136.27</td><td>22,617.73</td><td>-10.02%</td><td><Ref ids={[2,3]} /></td></tr>
              <tr><th scope="row">SOX・フィラデルフィア半導体株指数（ポイント）</th><td>10,146.3</td><td>8,408.6</td><td>-17.13%</td><td><Ref ids={[4,5,16]} /></td></tr>
            </tbody>
          </table></div>
          <p>日経平均は週間-7.70%、ダウ平均は週間-8.02%、NASDAQ総合は週間-10.02%、SOXは週間-17.13%。両市場とも前週最終取引日は11月13日、当週最終取引日は20日。「（20日終値÷13日終値−1）×100」を小数第2位に丸めた。配当再投資と円換算を含まない価格指数を使用。NASDAQは総合指数を採用し、NASDAQ 100とは区別する。</p>
          <p className="source-note">SOXはInvesting.comの同じ日次履歴の終値を小数第1位で統一。13日値はNasdaq提供のFRED系列でも丸め後に一致し、20日値はYahoo Financeの日次履歴のClose欄とも丸め後に一致する。FREDは確認時点で19日までの更新で、20日の取引中の値は使っていない。<Ref ids={[4, 5, 16]} /></p>
        </section>
        <section>
          <h2>日本株：半導体関連に重荷、物価と金利も点検</h2>
          <p>20日の東京では日経平均が安値引けとなった。日経の公式サマリーでは技術セクターに加え、情報通信、消費、素材などにもマイナス寄与があり、指数の売りは半導体関連だけにとどまらなかった。<Ref ids={[1, 8]} /></p>
          <p>国内では16日に7〜9月期GDPの1次速報、20日に10月全国消費者物価指数が公表された。株価の需給とは別に、個人消費・設備投資と企業の価格転嫁が持続するかを読む材料になる。<Ref ids={[9, 10]} /></p>
          <p><strong>本誌の分析：</strong>AI関連の投資計画が遅れる場合、装置・検査・電線などへ受注や検収の後ずれが波及し得る。一方、株価下落を理由に、関連の薄い企業の需要や財務まで一律に悪化したとは判断できない。顧客構成、受注残の契約条件、売掛金の回収と資金繰りを企業ごとに点検したい。</p>
        </section>
        <section>
          <h2>米国株：NVIDIAの実績と、調査報道を分ける</h2>
          <p>NVIDIAは17日、2026年10月25日終了の2027年度第3四半期決算を公表した。売上高は1,158億ドルで、Vera Rubinの出荷開始を説明した。これは公表済みの四半期実績であり、今後の需要や資金回収を保証する数字ではない。<Ref ids={[6]} /></p>
          <p>20日、Reutersは事情を知る関係者に基づき、米SECが同社の会計上の問題の可能性を調べていると報道した。SECはコメントを控えたとしている。調査の報道を、違反や粉飾が認定されたとの意味で扱わない。<Ref ids={[7]} /></p>
          <p>Anthropicは19日に取引を開始したが、20日には株価が下落し、米株全体の売りも続いた。新規上場による資金調達と、既存のAIインフラへの投資採算は別の問いである。<Ref ids={[11]} /></p>
          <p><strong>本誌の分析：</strong>半導体の販売実績が強くても、その購入資金が借入・出資・前払いに依存すれば、調達条件の変化が将来の発注へ波及する可能性はある。売上、顧客の支払い能力、メーカー側の投資・保証を分けて確認したい。今回の売りを単一の報道だけで説明するのも避けたい。</p>
        </section>
        <section>
          <h2>金利・債券・為替・原油：週末は米国債買い</h2>
          <p>APの20日の引け後報道では、米10年国債利回りは4.93%となり、債券に買いが入った。北海ブレント原油先物は1バレル92.57ドルで清算された。中東の供給・輸送リスクが残る一方、株式市場では成長への警戒も強まっている。<Ref ids={[11]} /></p>
          <p>20日のReuters為替報道では、米金利の低下が円を支え、ドル円は1ドル158.78円付近だった。これは同報道時点の観測で、米株の終値と同時刻の為替レートではない。<Ref ids={[12]} /></p>
          <p>18日に公表されたFOMC議事要旨は10月27〜28日会合の記録で、11月の株安を受けた新たな政策決定ではない。<Ref ids={[13]} /></p>
          <p><strong>本誌の分析：</strong>米国債への逃避買いが起きても、インフレや政策金利の先行き次第で利回りは再び上がり得る。株安と債券高が必ず続くとは限らない。日本企業への影響は、円換算の原料費、海外利益の換算、借換え時期によって異なる。</p>
        </section>
        <section>
          <h2>市場関係者の見方：強気・慎重・中立</h2>
          <p>20日Reutersの取材による見解を本誌が分類した。相場の総意や確定予測ではない。</p>
          <ul>
            <li><strong>強気：</strong>Founder ETFsのMichael Monaghan氏は、短期は感情に左右されても基礎的な事業環境は強いとみる。<Ref ids={[14]} /></li>
            <li><strong>慎重：</strong>Treasury PartnersのRichard Saperstein氏は、建設の減速や調達先の縮小を踏まえ、AI株の評価が見直されていると説明した。<Ref ids={[14]} /></li>
            <li><strong>中立・選別：</strong>CeteraのGene Goldman氏は、決算の強さと、高金利下で許容される株価評価を分けて考える必要を示した。<Ref ids={[14]} /></li>
          </ul>
          <p><strong>判断を変える条件：</strong>注文の現金化と資金調達の安定が確認できれば強気論の裏付けになる。顧客の支払い遅延、契約の変更や借換え条件の悪化が広がれば、慎重論をより重く見る。株価反発だけを確認の代わりにしない。</p>
        </section>
        <section>
          <h2>翌週11月23日〜27日の注目点</h2>
          <ol>
            <li><strong>23日：日本の現物市場は勤労感謝の日で休場。</strong>JPXはBCPテストのため先物・オプションの祝日取引も実施しないと告知。連休中の海外材料が24日の寄り付きに反映され得る。<Ref ids={[15, 17]} /></li>
            <li><strong>25日：米GDP改定値・企業利益、10月個人所得・支出。</strong>BEA予定は米東部時間8:30、日本時間22:30。PCE物価と実質消費を併せて確認し、名目売上だけで需要の強さを判断しない。<Ref ids={[18]} /></li>
            <li><strong>26日：米感謝祭で休場、27日：短縮取引。</strong>NYSEは27日の通常取引を米東部時間13:00、日本時間28日03:00に終了予定。流動性が細る局面の値動きと、継続的な資金流入を区別する。<Ref ids={[19]} /></li>
          </ol>
          <p><strong>条件付きの見通し：</strong>物価の鈍化と企業の回収見通しが両立すれば、売りが落ち着く余地はある。逆に調達難と利益見通しの悪化が重なれば、AI以外にも評価の見直しが波及し得る。いずれも今後の開示で検証するシナリオである。</p>
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
