import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "週次マーケットニュースレポート（2026年9月28日〜10月2日） | Market Note",
  description: "日経平均+2.93%、ダウ-1.26%、NASDAQ総合+0.45%、SOX+3.69%。米雇用、日銀短観、AI需要、金利・原油と翌週の焦点を検証。",
};

const sources = [
  ["日経指数公式：9月25日日次サマリー", "https://indexes.nikkei.co.jp/nkave/archives/summary?dt=20260925&idx=nk225"],
  ["日経指数公式：10月2日日次サマリー", "https://indexes.nikkei.co.jp/nkave/archives/summary?dt=20261002&idx=nk225"],
  ["AP：10月2日米国株終値・週間騰落", "https://apnews.com/article/48e9066481cba91a5d7c6688aa74a5cd"],
  ["Nasdaq提供・FRED：PHLX Semiconductor（NASDAQSOX）", "https://fred.stlouisfed.org/series/NASDAQSOX"],
  ["Tallac Options：SOX日次履歴（9月25日・10月2日）", "https://tallacoptions.com/Indices/SOX"],
  ["BLS：2026年9月雇用統計（10月2日公表・保存版）", "https://www.bls.gov/news.release/archives/empsit_10022026.htm"],
  ["日本銀行：2026年9月短観概要（10月1日公表）", "https://www.boj.or.jp/en/statistics/tk/gaiyo/2026/tka2609.pdf"],
  ["Reuters／Economic Times：10月2日日本株と市場関係者見解", "https://economictimes.indiatimes.com/markets/us-stocks/news/global-markets-japans-nikkei-retreats-from-6-week-high-as-investors-lock-in-gains/articleshow/134633243.cms"],
  ["Micron：2026年度第4四半期・通期決算（9月30日）", "https://investors.micron.com/news/press-release/2026/Micron-Technology-Inc--Reports-Record-Fiscal-Fourth-Quarter-and-Full-Year-2026-Results/default.aspx"],
  ["Reuters／London South East：10月2日米国株・利上げ観測", "https://www.lse.co.uk/news/us-stocks-equities-close-higher-as-softer-jobs-data-quiets-rate-hike-expectations-asxmwpmbeyprqb8.html?mobile_view=desktop"],
  ["AP：10月2日の米国株・米10年債利回り", "https://apnews.com/article/stocks-markets-bonds-us-oil-a2b99562febc21d84955e243c87f5d31"],
  ["Reuters／Business Recorder：10月2日原油清算値（10月3日掲載）", "https://www.brecorder.com/news/40442436"],
  ["Reuters／MarketScreener：10月2日アジア時間の為替・債券", "https://www.marketscreener.com/news/asian-shares-fall-after-wild-swings-in-bonds-fx-before-us-jobs-data-ce785ddadd8ef226"],
  ["Reuters／MarketScreener：企業利益の持続性を巡る見解（10月1日）", "https://ca.marketscreener.com/news/investors-wary-of-slowdown-in-us-corporate-profit-boom-ce785ad3df8ef426"],
  ["日本銀行：公表予定（10月2日更新）", "https://www.boj.or.jp/about/calendar/index.htm"],
  ["財務省：10月5日〜9日の週間予定", "https://www.mof.go.jp/public_relations/weekly_schedule/index.htm"],
  ["Federal Reserve：2026年10月の公表・講演予定", "https://www.federalreserve.gov/newsevents/2026-october.htm"],
] as const;

function Ref({ ids }: { ids: number[] }) {
  return <span className="source-note">{ids.map((id) => <a key={id} href={sources[id - 1][1]} target="_blank" rel="noreferrer"> [{id}]</a>)}</span>;
}

export default function WeeklyReportSeptember28() {
  return (
    <main className="article-page">
      <Link className="back-link" href="/">← 記事一覧へ戻る</Link>
      <article>
        <header className="report-header">
          <p className="report-label">WEEKLY MARKET REPORT</p>
          <h1>週次マーケットニュースレポート（2026年9月28日〜10月2日）</h1>
          <p className="report-date">公開日：2026年10月3日／対象週：9月28日（月）〜10月2日（金）</p>
        </header>
        <div className="report-body">
          <section>
            <h2>今週の要約：半導体の強さと、高金利への警戒が併存</h2>
            <p>日本株は週間で上昇し、米国株は指数間で方向が分かれた。日経平均は+2.93%、ダウ平均は-1.26%、NASDAQ総合は+0.45%、SOXは+3.69%。金曜日の米国株反発だけで週全体を判断すると、ダウの週間下落を見落とす。今週は半導体関連の強さと、広範な株式に対する金利の重さを併せて読む必要がある。<Ref ids={[1, 2, 3, 4, 5]} /></p>
            <p>米9月雇用統計は雇用の伸び鈍化を示し、追加利上げ観測を後退させた。日本の短観は大企業製造業の改善と非製造業の悪化が同居。Micronの決算はAI向けメモリー需要の強さを示したが、それが市場全体の景気や全企業の利益成長を保証するわけではない。<Ref ids={[6, 7, 8, 9, 10]} /></p>
            <p><strong>本誌の分析：</strong>利益成長への期待が金利負担を上回れる分野に選別が続いた週と捉える。雇用減速は割引率の面では支援材料になり得る一方、需要減速を通じて企業利益に逆風にもなる。原油・長期金利が高いままなら、金融政策への安心感だけで株高が持続するとは限らない。</p>
            <p className="source-note">情報は10月3日の作成時に再確認。株価は各国の10月2日通常取引終値、週間比較は9月25日終値を基準とする。東京の10月2日終値は同日夜の米雇用統計と米国株の反応を含まない。為替・債券は下記の報道時点、原油は先物清算値。8:00時点に取得済みだったとする記事ではない。</p>
          </section>

          <section>
            <h2>主要指数：終値と週間騰落率</h2>
            <div className="table-wrap"><table className="report-table">
              <thead><tr><th>指数</th><th>9月25日終値</th><th>10月2日終値</th><th>週間騰落率</th><th>出典</th></tr></thead>
              <tbody>
                <tr><td>日経平均（円）</td><td>66,364.20</td><td>68,309.46</td><td>+2.93%</td><td><Ref ids={[1, 2]} /></td></tr>
                <tr><td>ダウ平均</td><td>51,828.62</td><td>51,176.96</td><td>-1.26%</td><td><Ref ids={[3]} /></td></tr>
                <tr><td>NASDAQ総合</td><td>27,068.71</td><td>27,190.86</td><td>+0.45%</td><td><Ref ids={[3]} /></td></tr>
                <tr><td>SOX（フィラデルフィア半導体株指数）</td><td>12,668.93</td><td>13,136.67</td><td>+3.69%</td><td><Ref ids={[4, 5]} /></td></tr>
              </tbody>
            </table></div>
            <p>計算式は「（10月2日終値 ÷ 9月25日終値 − 1）×100」。配当を含まない価格指数の変化を小数第2位に丸めた。ダウとNASDAQ総合の比較元は、APの週末終値と週間ポイント差（ダウ-651.66、NASDAQ+122.15）から逆算。米国ハイテク指数はNASDAQ総合を採用し、NASDAQ100とは区別した。SOXはTallacの日次履歴を用い、10月2日値をNasdaq提供のFRED系列でも照合した。<Ref ids={[3, 4, 5]} /></p>
            <p className="source-note">Reutersの米国株速報には暫定値があるため、終値表はAPの確定値を採用。SOXは確認できた両日の値で再計算し、以前の作成過程にあった+3.66%は採用していない。</p>
          </section>

          <section>
            <h2>日本株：週間上昇の一方、短観は業種間で濃淡</h2>
            <h3>公表事実・報道</h3>
            <p>日経平均は10月2日に647.26円安の68,309.46円で終了したが、前週末比では1,945.26円上昇した。当日は構成銘柄のうち173銘柄が下落、51銘柄が上昇しており、週末は利益確定の広がりも確認できる。<Ref ids={[1, 2]} /></p>
            <p>10月1日公表の日銀短観では、大企業製造業の業況判断DIは6月の+22から+24へ改善し、大企業非製造業は+37から+35へ低下した。DIは「良い」と答えた企業割合から「悪い」を引いた値で、利益や生産の伸び率ではない。<Ref ids={[7]} /></p>
            <p>Reutersは10月2日の日本株について、前日の大幅上昇後の利益確定に加え、金利・インフレ・地政学リスクへの警戒を報じた。東海東京インテリジェンス・ラボの岡本雄太氏は短期の過熱感を指摘しつつ、短観を背景に国内株の見通しには前向きな評価を示した。<Ref ids={[8]} /></p>
            <h3>市場への影響（分析）</h3>
            <p>製造業の改善を日本経済全体の一様な加速とみなすのは早い。輸出・AI関連の需要と、内需企業のコスト負担は分けて見る必要がある。円安は海外利益の円換算を押し上げ得るが、原材料・燃料輸入や家計の購買力には負担となる。翌週は製造業の強さが地域景況感や消費にも波及しているかを確認したい。</p>
          </section>

          <section>
            <h2>米国株：雇用減速とAI需要、二つの材料</h2>
            <h3>米雇用統計（一次情報）</h3>
            <p>BLSによる9月の非農業部門雇用者数は前月比2.9万人増、失業率は4.2%。7月は2.1万人増から1.0万人減、8月は16.2万人増から13.3万人増へ改定され、2カ月合計で6.0万人の下方改定となった。平均時給の伸びは前月比0.1%、前年同月比3.0%だった。いずれも10月2日公表時点の値で、後日改定され得る。<Ref ids={[6]} /></p>
            <p>Reutersによると、CME FedWatchが示す10月会合での25bp以上の利上げ確率は10月2日時点で22.7%となり、1週間前の64.2%から低下した。これは先物市場から導かれる、その時点の織り込みであり、FRBの確約ではない。<Ref ids={[10]} /></p>
            <h3>Micron決算（企業発表）</h3>
            <p>Micronは9月30日、9月3日を期末とする2026年度第4四半期売上高542.3億ドル、GAAP純利益377.0億ドルを発表した。会社はAI主導の需要と事業執行を好業績の背景に挙げ、2027年度に一段の成長を見込むとした。この見通しは会社側の予測で、実現した業績とは区別する。<Ref ids={[9]} /></p>
            <h3>市場への影響（分析）</h3>
            <p>雇用減速を受けた金利期待の変化と、半導体企業の業績拡大は、異なる経路から株式評価を支える。ただし、AI向け売上が増えても株価が必ず上がるわけではない。期待との差、供給増加、設備投資と現金収支を併せて見る必要がある。SOXの週間上昇率はNASDAQ総合を上回ったが、この指数差だけから投資資金の流入額や個別銘柄の上昇理由までは特定できない。</p>
          </section>

          <section>
            <h2>金利・為替・原油・債券</h2>
            <div className="table-wrap"><table className="report-table">
              <thead><tr><th>対象</th><th>確認値・時点</th><th>読み方</th></tr></thead>
              <tbody>
                <tr><td>米10年国債利回り</td><td>10月2日のAP終盤報道で5.28%。同日一時5.17%未満、前日高値は約5.35%<Ref ids={[11]} /></td><td>雇用統計後に低下したが反転。週末にも高金利負担が残った</td></tr>
                <tr><td>米2年国債利回り</td><td>10月2日アジア時間4.8039%（Reuters）<Ref ids={[13]} /></td><td>米雇用統計前の観測値。米10年債の終盤値と直接比較して利回り差を算出しない</td></tr>
                <tr><td>ドル円</td><td>10月2日アジア時間1ドル158.13円（Reuters）<Ref ids={[13]} /></td><td>ニューヨーク終値ではない。円安による輸入コストを注視</td></tr>
                <tr><td>Brent原油先物</td><td>10月2日清算値102.25ドル／バレル<Ref ids={[12]} /></td><td>供給回復期待と地政学・石油製品供給リスクが交錯</td></tr>
                <tr><td>WTI原油先物</td><td>10月2日清算値91.11ドル／バレル、週間-1.6%（報道値）<Ref ids={[12]} /></td><td>欧州の軽油備蓄放出に関する報道などを消化</td></tr>
              </tbody>
            </table></div>
            <p>ReutersはBrentの週間変化を+0.11%と報じているが、週中に期近限月の交代があるため、株価指数の同一系列比較とは性質が異なる。原油は現物価格ではなく先物清算値である。備蓄放出の規模・実施条件と、中東からの輸送回復が持続するかが焦点となる。<Ref ids={[12, 13]} /></p>
            <p><strong>債券の整理（分析）：</strong>利回り上昇は、他の条件が同じなら既発債価格の下落を意味する。株式の割引率だけでなく、企業の借換えコストにも影響する。日本国債の10月2日確定終値は今回の確認資料だけで特定できず、数値を補っていない。翌週の10年・30年国債入札は、国内投資家の需要と長期金利の方向を見る材料となる。<Ref ids={[16]} /></p>
          </section>

          <section>
            <h2>市場関係者の見解：強気・弱気・中立</h2>
            <p>以下の分類は発言内容を本誌が整理したもの。本人の正式な投資判断ラベルではなく、対象市場・時間軸も異なる。発言は要約であり、逐語引用ではない。</p>
            <ul className="viewpoints">
              <li><strong>強気寄り（日本株）：</strong>東海東京インテリジェンス・ラボの岡本雄太氏。短期的な利益確定の可能性は認めつつ、製造業の景況改善を背景に日本株の見通しを肯定的に評価した（10月2日）。<Ref ids={[8]} /></li>
              <li><strong>弱気・リスク警戒（米企業利益）：</strong>Greenwood CapitalのCIO、Walter Todd氏。大幅な増益の持続性に疑問を示し、翌年は比較対象の利益水準が高くなる難しさを指摘した（10月1日）。全面的な株式売却推奨とまでは解釈しない。<Ref ids={[14]} /></li>
              <li><strong>中立・慎重な楽観（米国株）：</strong>SummitTX Capitalのトレーディング責任者Robert Bernstone氏。弱めの雇用は短期の利上げ懸念を和らげる一方、景気とインフレへの懸念は残ると評価。年末に向けた上昇余地にも言及した（10月2日）。<Ref ids={[10]} /></li>
            </ul>
            <p><strong>本誌の分析：</strong>見解が分かれる中心は「足元の好業績がどれだけ続くか」と「金利低下期待が需要減速を補えるか」である。日本株の強気材料と米国企業利益への警戒は両立する。単一の発言を市場全体の総意とみなさず、次の決算・金利・消費指標で検証したい。</p>
          </section>

          <section>
            <h2>翌週（10月5日〜9日）の注目点</h2>
            <ol>
              <li><strong>10月5日14:00：日銀の需給ギャップ・潜在成長率等。</strong>製造業の景況感改善が経済全体の需給逼迫を伴うか確認する。6日15:35には植田総裁の全国証券大会での挨拶も予定される（日本時間）。<Ref ids={[15]} /></li>
              <li><strong>10月6日・8日：日本国債入札。</strong>財務省予定では6日に10年、8日に30年国債の入札。需要の強弱と落札利回り、入札後の長期金利を確認する。<Ref ids={[16]} /></li>
              <li><strong>10月7日14:00米東部時間：FOMC議事要旨。</strong>9月15〜16日会合分。日本時間8日3:00の予定。政策判断の根拠を確認するが、議論は最新の9月雇用統計公表より前であることに注意する。<Ref ids={[17]} /></li>
              <li><strong>10月8日：日本の国際収支・地域経済報告。</strong>8:50の8月国際収支速報と14:00の地域経済報告を通じ、海外収益・内需・地域差を点検する（日本時間）。<Ref ids={[15, 16]} /></li>
              <li><strong>10月8日：Waller FRB理事の経済見通し講演。</strong>FRB掲載予定は米東部時間4:30、日本時間17:30。雇用減速とインフレのどちらを重視するか、直近統計後の説明に注目する。<Ref ids={[17]} /></li>
              <li><strong>通週：原油・AI企業の利益見通し。</strong>燃料供給の改善が価格の安定につながるか、AI関連の需要が利益率と現金創出を伴うかを確認する。これは分析上の監視項目であり、特定日の価格予想ではない。</li>
            </ol>
            <p className="source-note">日程は10月3日閲覧時の公式予定。変更される場合がある。翌週の結果は未確定であり、予定と実績を区別している。</p>
          </section>

          <section>
            <h2>来週に向けた分析</h2>
            <p>強気の条件は、原油と長期金利が落ち着き、雇用減速が深刻な需要悪化につながらず、企業の利益見通しが維持されること。弱気の条件は、エネルギー価格が再上昇する一方で消費・雇用が弱まり、利益と評価倍率が同時に圧迫されることだ。中立の見方では、指数全体の方向感より、業種・企業ごとの業績差が重要になる。</p>
            <p>今週の指数差は選別の必要性を示すが、来週の上昇や下落を保証しない。日本株の終値、米国株の終値、米雇用統計の公表時刻をそろえて解釈し、ニュースの印象と計算できる事実を分けて判断したい。</p>
          </section>

          <section>
            <h2>出典一覧</h2>
            <p>一次情報は指数提供元、BLS、日銀、Micron、FRB、財務省。市場の反応と見解はAP・Reutersを参照し、Reuters転載記事は掲載先を併記した。更新型の履歴・予定ページは2026年10月3日に確認した内容に基づく。</p>
            <ol>{sources.map(([label, url]) => <li key={url}><a href={url} target="_blank" rel="noreferrer">{label}</a></li>)}</ol>
          </section>
          <section className="disclaimer">
            <h2>注意事項</h2>
            <p>本記事は公開情報を整理したもので、特定の金融商品の売買を推奨するものではありません。市場価格・経済統計・企業見通しは変動または改定される場合があります。分析と条件付き見通しは将来の成果を保証せず、投資には元本割れを含むリスクがあります。投資判断は各自の目的・資産状況・リスク許容度を踏まえて行ってください。</p>
          </section>
        </div>
      </article>
    </main>
  );
}
