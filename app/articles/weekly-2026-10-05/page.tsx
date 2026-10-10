import type { Metadata } from "next";
import Link from "next/link";
import editorialTitles from "../../../content/editorial-titles.json";
import { createArticleMetadata } from "../../../lib/article-metadata";

const editorial = editorialTitles["weekly-2026-10-05"];
export const metadata: Metadata = createArticleMetadata(editorial);

const sources = [
  ["日経平均プロフィル：2026年10月2日の指数終値", "https://indexes.nikkei.co.jp/nkave/archives/summary?dt=20261002&idx=nk225"],
  ["日経平均プロフィル：2026年10月9日の指数終値", "https://indexes.nikkei.co.jp/nkave/archives/summary?dt=20261009&idx=nk225"],
  ["AP通信：2026年10月9日の米主要指数と週間変化", "https://apnews.com/article/dafbd0c4037ee10e2a9e305f3cfa8e70"],
  ["AP通信：2026年10月2日の米主要指数と週間変化", "https://apnews.com/article/48e9066481cba91a5d7c6688aa74a5cd"],
  ["Nasdaq提供・セントルイス連銀FRED：PHLX Semiconductor、2026年10月2日", "https://fred.stlouisfed.org/data/NASDAQSOX"],
  ["Investing.com日本語版：SOX指数2026年10月9日の日次履歴", "https://jp.investing.com/indices/phlx-semiconductor-historical-data"],
  ["日本銀行：2026年10月8日地域経済報告（さくらレポート）", "https://www.boj.or.jp/research/brp/rer/rer261008.htm"],
  ["総務省統計局：2026年8月家計調査、10月9日公表", "https://www.stat.go.jp/data/kakei/sokuhou/tsuki/index.html"],
  ["Reuters：2026年10月8日の米半導体株・原油と金利", "https://www.reuters.com/business/wall-st-futures-slide-rising-oil-yields-dampen-mood-2026-10-08/"],
  ["Reuters：2026年10月9日の世界株式・AI関連株と債券", "https://www.reuters.com/world/china/global-markets-wrapup-1-2026-10-09/"],
  ["Reuters：2026年10月9日のBrent・WTI原油清算値", "https://www.reuters.com/business/energy/oil-falls-trump-comments-iran-talks-ease-supply-concerns-2026-10-09/"],
  ["AP通信：2026年10月9日の米国株・米10年債利回り", "https://apnews.com/article/5d0f953dbf96febb0690c1aef23fa8a9"],
  ["日本銀行：2026年10月5日内田副総裁講演", "https://www.boj.or.jp/about/press/koen_2026/ko261005a.htm"],
  ["Business Insider：2026年10月5日、Citadel SecuritiesのScott Rubner氏の見通し", "https://www.businessinsider.com/stock-market-outlook-citadel-securities-q3-earnings-tech-investing-october-2026-10"],
  ["Reuters：2026年10月9日、PIMCOのDan Ivascyn氏の米金利リスク見通し", "https://www.reuters.com/markets/us/us-10-year-treasury-yield-risks-hitting-6-first-time-since-2000-pimcos-ivascyn-2026-10-09/"],
  ["米労働統計局（BLS）：2026年10月の公表予定", "https://www.bls.gov/schedule/2026/10_sched.htm"],
  ["Reuters：2026年10月9日公表、翌週の米銀行決算・CPIの注目点", "https://www.reuters.com/business/wall-st-week-ahead-bank-earnings-cpi-headline-busy-markets-week-sp-500-hovers-2026-10-09/"],
  ["日本取引所グループ：2026年10月の市場カレンダー", "https://www.jpx.co.jp/calendar/index.html"],
  ["日本取引所グループ：2026年10月12日のデリバティブ祝日取引", "https://www.jpx.co.jp/news/2040/20261009-01.html"],
] as const;

function Ref({ ids }: { ids: number[] }) {
  return <span className="source-note">{ids.map((id) => <a key={id} href={sources[id - 1][1]} target="_blank" rel="noreferrer"> [{id}]</a>)}</span>;
}

export default function WeeklyMarketOctober5() {
  return (
    <main id="main-content" className="article-page">
      <Link className="back-link" href="/">← 記事一覧へ戻る</Link>
      <article>
        <header className="report-header">
          <p className="report-label">WEEKLY MARKET REPORT</p>
          <h1>{editorial.title}</h1>
          <p className="report-date">公開日：2026年10月10日／対象週：2026年10月5日（月）〜10月9日（金）</p>
        </header>
        <div className="report-body">
          <section>
            <h2>今週の要約：米国の株高と半導体株安、日本株の上昇が並存</h2>
            <p>10月5日〜9日は日経平均が前週末比+1.06%、ダウ平均が+0.93%、NASDAQ総合が+0.64%と上昇した一方、SOX（フィラデルフィア半導体株指数）は-4.30%となった。米国株の主要指数が週間上昇したことと、AI関連設備投資への懸念から半導体関連株が調整したことは、同時に起きている。指数が上がったという一つの情報だけでは、投資家の評価がどの業種にも同じように向いているとは読めない。<Ref ids={[1, 2, 3, 4, 5, 6, 9, 10]} /></p>
            <p>日本では日銀の地域経済報告が一部地域の改善を示す一方、8月の家計消費は実質で前年同月比減少した。米国では原油高と長期金利高止まりが株式の割引率と企業の調達コストの重荷になっている。来週は米消費者物価指数（CPI）、生産者物価指数（PPI）、大手銀行の決算が、インフレと企業利益の両面を検証する材料になる。<Ref ids={[7, 8, 11, 12, 16, 17]} /></p>
            <p><strong>本誌の分析：</strong>AIを巡る需要期待は消えていないが、資金調達・設備投資に対して将来どれだけ利益と現金収入が生まれるかが、株価の選別により強く反映され始めている。エネルギー価格と長期金利が高い環境では、売上拡大だけでは高い評価倍率を正当化しにくい。</p>
            <p className="source-note">情報確認基準：2026年10月10日朝（日本時間）。日本株は10月9日東京市場、米国株・米国債・原油は10月9日米国市場の報道・終値が対象。週次騰落率は9月ではなく2026年10月2日と10月9日の各終値を比較した。日本の10月9日現物終値は、同日夜の米国株の反応を含まない。</p>
          </section>
          <section>
            <h2>主要4指数：前週末終値と当週末終値</h2>
            <div className="table-wrap"><table className="report-table">
              <thead><tr><th>指数</th><th>10月2日終値</th><th>10月9日終値</th><th>週間騰落率</th><th>根拠</th></tr></thead>
              <tbody>
                <tr><td>日経平均株価（円）</td><td>68,309.46</td><td>69,030.92</td><td>+1.06%</td><td><Ref ids={[1, 2]} /></td></tr>
                <tr><td>ダウ工業株30種平均（ポイント）</td><td>51,176.96</td><td>51,654.95</td><td>+0.93%</td><td><Ref ids={[3, 4]} /></td></tr>
                <tr><td>NASDAQ総合指数（ポイント）</td><td>27,190.86</td><td>27,366.17</td><td>+0.64%</td><td><Ref ids={[3, 4]} /></td></tr>
                <tr><td>SOX／フィラデルフィア半導体株指数（ポイント）</td><td>13,136.67</td><td>12,572.4</td><td>-4.30%</td><td><Ref ids={[5, 6]} /></td></tr>
              </tbody>
            </table></div>
            <p>計算は「（2026年10月9日終値÷10月2日終値−1）×100」、小数第3位を四捨五入した。配当再投資を含む投資収益率ではない。ナスダック指数は<strong>NASDAQ総合</strong>を採用し、NASDAQ 100ではない。APが伝えるダウ・NASDAQ総合の週間変化とも整合する。<Ref ids={[3, 4]} /></p>
            <p className="source-note">SOXの10月2日値はNasdaq提供のFRED系列。FREDは本稿の確認時点で10月8日までの公開だったため、10月9日値はInvesting.com日本語版の履歴（小数第1位）を暫定的に使用した。提供元更新後に照合・修正が必要になる場合がある。別の地域向け履歴ページや取引時間中の速報は一致しないことがあるため、確定値と精度の違いを明示した。<Ref ids={[5, 6]} /></p>
          </section>
          <section>
            <h2>日本株：週初の上昇と、地域景況・家計消費の濃淡</h2>
            <h3>公表された事実</h3>
            <p>日経平均は10月2日終値68,309.46円から10月9日に69,030.92円となった。10月9日だけを見ると前日比11.19円安（-0.02%）だが、週間では721.46円の上昇である。週中の急伸とその後の伸び悩みは、週末の小幅安と週間上昇が両立する理由になる。<Ref ids={[1, 2]} /></p>
            <p>日銀が10月8日に公表したさくらレポートは、地域景況の改善が一様ではないことを示した。一部地域では景気判断が前回から改善したが、各地域の消費や設備投資には違いがある。地域の企業ヒアリングに基づく判断を、全国のGDP成長率や上場企業全体の増益率に置き換えてはいけない。<Ref ids={[7]} /></p>
            <p>総務省統計局の10月9日公表資料によると、二人以上世帯の8月消費支出は1世帯当たり310,975円。物価変動を除いた実質支出は前年同月比3.1%減、季節調整済みの前月比は0.1%増だった。前年同月比と前月比で方向が違うため、片方の数字だけで消費回復・悪化を断定しない。<Ref ids={[8]} /></p>
            <h3>市場への意味（本誌の分析）</h3>
            <p>国内景気の緩やかな改善と、家計の実質購買力の弱さは矛盾しない。輸出関連企業、設備投資関連企業、消費関連企業では、為替と原材料価格への感応度が異なるためだ。日本株の週間上昇を日本経済の全面的な改善とみなさず、来週以降は内需企業の客数・販売単価、製造業の受注・利益率を分けて確認したい。</p>
          </section>
          <section>
            <h2>米国株：指数は週間上昇、半導体は利益の実現性を再評価</h2>
            <h3>株価と報道で確認できること</h3>
            <p>10月9日の米株式市場ではダウが51,654.95、NASDAQ総合が27,366.17で終了した。APによると同日のダウは423.31ポイント上昇し、S&amp;P 500は7,811.54となった。週全体でも主要株価指数はプラスで引けた。<Ref ids={[3, 12]} /></p>
            <p>一方、10月8日のReuters報道では原油・債券金利の上昇とAI関連の収益見通しへの疑問が半導体株の売り材料となった。10月9日には株式全体が反発したものの、半導体指数には調整が残った。報道された未確定の個別企業の売上予想を、企業の正式な確定決算や当局開示と同等に扱うべきではない。<Ref ids={[9, 10]} /></p>
            <p>市場の別の変化として、ReutersとAPは衛星通信サービスに関連した周波数取得の発表を受け、米通信事業者と通信塔関連企業の株価が異なる反応を示したと報じた。AI以外にも新規参入や事業構造の変化によって、同じ市場の業種間格差が広がり得る。<Ref ids={[10, 12]} /></p>
            <h3>本誌の分析：設備投資からキャッシュフローへ</h3>
            <p>AI関連企業の受注・設備投資の拡大が確認されても、長期的な投資リターンは別問題だ。事業者がGPU・電力・ネットワーク・データセンター建設に支出した額と、将来その資産から回収する現金には時差がある。長期金利が上がれば、将来キャッシュフローの現在価値が低下し、融資・社債による資金調達の負担も増える。今回のSOX下落は、そのリスクが意識される局面を示すが、指数下落だけで個別企業の事業価値が低下したと断定することはできない。</p>
          </section>
          <section>
            <h2>金利・為替・原油・債券を横断する</h2>
            <div className="table-wrap"><table className="report-table">
              <thead><tr><th>市場</th><th>10月9日中心の確認値</th><th>解釈と注意点</th></tr></thead>
              <tbody>
                <tr><td>米10年国債利回り</td><td>10月9日のAP終盤報道で5.24%<Ref ids={[12]} /></td><td>割引率と企業調達コストに影響。利回り上昇は既発債価格の下落を意味する</td></tr>
                <tr><td>ドル円</td><td>10月9日取引時間帯、1ドルおおむね158円台前半<Ref ids={[10]} /></td><td>市場時点で動く気配値。東京・NYの同一時点終値として扱わない</td></tr>
                <tr><td>Brent原油先物</td><td>10月9日清算値104.72米ドル／バレル<Ref ids={[11]} /></td><td>供給懸念と需給緩和期待が交錯。現物価格ではない</td></tr>
                <tr><td>WTI原油先物</td><td>10月9日清算値91.85米ドル／バレル<Ref ids={[11]} /></td><td>米国湾岸の供給停止・中東関連ニュースを消化</td></tr>
                <tr><td>日本国債</td><td>10月9日の同一時点の公的な長期金利終値は本稿で未確定</td><td>数値を補作せず、国内金利上昇が不動産・借入企業に及ぼす影響を分析対象とする</td></tr>
              </tbody>
            </table></div>
            <p>Reutersは10月9日の原油について、米メキシコ湾での悪天候に伴う生産停止と、中東を巡る供給期待の変化を伝えた。値動きは同じ日の取引時間中と清算後で異なる。原油高はエネルギー企業には増収材料になり得るが、航空・運輸・化学・消費関連にはコスト増となる場合がある。<Ref ids={[11]} /></p>
            <p><strong>本誌の分析：</strong>金利上昇と原油高が同時に進むと、企業の仕入れ・輸送費と資金コストが上がる。高成長企業でも、それに見合う価格転嫁力と利益率が必要になる。逆に原油供給が正常化し金利が安定すれば、需給改善への期待が利益見通しに先行して株価へ反映される可能性がある。ここでは予想と既に確認された市場価格を区別する。</p>
          </section>
          <section>
            <h2>市場関係者の視点：強気・弱気・中立を比較</h2>
            <p>次の分類は本誌が確認可能な発言内容を整理したもの。本人が市場全体に正式な「強気」「中立」「弱気」のレーティングを付した意味ではなく、対象市場・分析期間は一致しない。逐語引用ではなく要旨を記す。</p>
            <ul className="viewpoints">
              <li><strong>強気寄り：Scott Rubner氏（Citadel Securities、10月5日のBusiness Insider報道）。</strong>四半期企業決算、株式市場でのポジション調整、買い需要の回復を根拠に、10月以降の米国株に建設的な見通しを示した。これは同氏の条件付き市場見解であり、将来の株高が確定したという意味ではない。<Ref ids={[14]} /></li>
              <li><strong>弱気・金利リスク重視：Dan Ivascyn氏（PIMCO、10月9日のReuters／FT報道）。</strong>米10年債利回りが6%に達する可能性に言及し、5.5%以上への上昇は株式や社債などのリスク資産に下押し圧力となり得ると警告した。6%は観測された利回りではなく想定シナリオである。<Ref ids={[15]} /></li>
              <li><strong>中立・両面評価：内田眞一氏（日本銀行副総裁、10月5日講演）。</strong>AI投資による需要押し上げや金融環境への影響と、投資収益が期待を下回る場合の調整リスクなど複数の経路を説明した。金融政策当局者の分析であり、個別の株式推奨ではない。<Ref ids={[13]} /></li>
            </ul>
            <p><strong>本誌の分析：</strong>見解の分岐は、企業利益の拡大余地を重視するか、高金利下での将来利益の割引や資金調達負担を重視するかにある。「株式市場全体の底堅さ」と「半導体の利益実現に対する慎重さ」は必ずしも排反しない。翌週は決算と物価データで、どのシナリオが裏付けられるか検証する。</p>
          </section>
          <section>
            <h2>翌週10月12日（月）〜16日（金）の注目点</h2>
            <ol>
              <li><strong>10月12日（月）日本はスポーツの日。</strong>東京証券取引所の現物市場は休業。大阪取引所などの対象デリバティブでは祝日取引が予定されるため、日経平均の現物終値と先物の値動きを混同しない。米国では株式市場と債券市場の休日扱いが異なる点にも注意する。<Ref ids={[18, 19]} /></li>
              <li><strong>10月13日以降：米大手銀行の2026年7〜9月期決算。</strong>ReutersはJPMorgan Chase、Citigroup、Goldman Sachs、Wells Fargoなどの決算を注目材料として挙げた。貸倒引当金、預貸利ざや、投資銀行手数料、借入需要を別々に確認する。実際の日程・数値は各社公表で再確認する。<Ref ids={[17]} /></li>
              <li><strong>10月14日（水）米東部時間8:30：9月CPI。</strong>日本時間21:30。原油高がどの程度コア物価・サービス物価に波及しているかと、金融政策の織り込みがどのように変化するかを見る。<Ref ids={[16]} /></li>
              <li><strong>10月15日（木）米東部時間8:30：9月PPI。</strong>日本時間21:30。企業が直面する仕入れコストの変化を点検する。PPIと翌期企業利益の変化を機械的に同一視しない。<Ref ids={[16]} /></li>
              <li><strong>10月16日（金）米東部時間8:30：9月輸出入物価指数。</strong>日本時間21:30。為替・輸入エネルギー価格の影響を確認する。<Ref ids={[16]} /></li>
              <li><strong>通週：AI関連設備投資と国債市場。</strong>半導体・データセンター関連企業の発表では受注だけでなく利益率、設備投資支出、フリーキャッシュフローを確認。米10年債利回りと原油相場が同時に動いた際の株式セクター別反応も追う。</li>
            </ol>
            <p className="source-note">時刻は公表カレンダーに基づく予定で、変更される場合がある。米東部時間はこの期間サマータイム（EDT）を前提に日本時間へ換算。未来の決算結果・統計数値は予測しない。</p>
          </section>
          <section>
            <h2>次週を読むための条件分岐（本誌の分析）</h2>
            <p><strong>上向きに働く条件：</strong>原油価格と米長期金利が落ち着き、CPI・PPIのインフレ圧力が鈍化し、銀行やAI関連企業の利益見通しが維持されること。その場合、資金コストへの懸念が後退する余地がある。</p>
            <p><strong>下向きに働く条件：</strong>エネルギー価格上昇が物価の広範な再加速につながり、国債利回りがさらに上昇する一方、企業の利益見通しが弱まること。その場合、割引率と利益の両面から株価評価が圧迫され得る。</p>
            <p><strong>中立の条件：</strong>金融環境が厳しくても利益の伸びる企業と、調達・輸入コストの高い企業で業績格差が残ること。指数の方向より、個別企業の金利感応度とキャッシュフローの確からしさが重要になる。以上はいずれも条件付きの分析であって、実際の相場や個別銘柄のリターンを保証するものではない。</p>
          </section>
          <section>
            <h2>出典一覧</h2>
            <p>指数算定機関、日本銀行、総務省統計局、米BLS、日本取引所グループの一次情報と、AP・Reutersなどの主要報道を参照した。見解は報道日と発言者を明示し、企業による公式開示ではない報道上の推計や市場予想を確定実績として扱わない。FREDや指数履歴など更新型ページは2026年10月10日朝の確認内容。</p>
            <ol>{sources.map(([label, url]) => <li key={url}><a href={url} target="_blank" rel="noreferrer">{label}</a></li>)}</ol>
          </section>
          <section className="disclaimer">
            <h2>注意事項</h2>
            <p>本記事は公表済みの情報と出典を整理したもので、特定の金融商品の売買を推奨する投資助言ではありません。市場価格・統計・企業の見通しは後日改定され得ます。事実と区別した分析・条件付きの見通しは将来の結果を保証せず、投資には元本割れを含むリスクがあります。判断は各自の目的、資産状況、リスク許容度を踏まえて行ってください。</p>
          </section>
        </div>
      </article>
    </main>
  );
}
