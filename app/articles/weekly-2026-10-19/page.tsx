import type { Metadata } from "next";
import Link from "next/link";
import editorialTitles from "../../../content/editorial-titles.json";
import { createArticleMetadata } from "../../../lib/article-metadata";

const editorial = editorialTitles["weekly-2026-10-19"];
export const metadata: Metadata = createArticleMetadata(editorial);

const sources = [
  ["日本経済新聞社・日経平均日次サマリー（2026年10月16日）", "https://indexes.nikkei.co.jp/nkave/archives/summary?dt=20261016&idx=nk225"],
  ["日本経済新聞社・日経平均日次サマリー（2026年10月23日）", "https://indexes.nikkei.co.jp/nkave/archives/summary?dt=20261023&idx=nk225"],
  ["AP・米主要指数の確定終値（2026年10月16日）", "https://apnews.com/article/c27809783ae3230b44c26e5ee4bea056"],
  ["AP・米主要指数の確定終値（2026年10月23日）", "https://apnews.com/article/e07c72bc5cbe5dffe352ddf30054e35f"],
  ["Nasdaq提供・FRED、SOX日次データ（10月22日更新、16日値を確認）", "https://fred.stlouisfed.org/data/NASDAQSOX"],
  ["Investing.com・SOX日次履歴（2026年10月23日まで、24日朝確認）", "https://jp.investing.com/indices/phlx-semiconductor-historical-data"],
  ["SK hynix・SolidigmのIPO検討中止（2026年10月23日）", "https://news.skhynix.com/en/fact-12/"],
  ["Reuters・ファナックの通期予想修正と需要の内訳（2026年10月23日）", "https://www.reuters.com/jp/economy/544YAX2FXJP7FBCVIOUKY7OG7I-2026-10-23/"],
  ["総務省統計局・全国CPI、2026年9月分、PDF1ページ表1（2026年10月23日）", "https://www.stat.go.jp/data/cpi/sokuhou/tsuki/pdf/zenkoku.pdf"],
  ["Charles Schwab・Joe Mazzola、米国株・債券と市場関係者の見解（2026年10月23日9:19 EDT）", "https://www.schwab.com/learn/story/stock-market-update-open"],
  ["Reuters・10月23日米国株終値とKristina Hooper氏の見方（2026年10月23日）", "https://www.reuters.com/business/wall-street-futures-dip-after-ai-rout-telecoms-slide-2026-10-23/"],
  ["Reuters・AI関連株とArt Hogan氏の見方（2026年10月23日）", "https://www.reuters.com/business/after-previous-days-slump-trading-is-quieter-among-ai-shares-2026-10-23/"],
  ["Reuters・円、ユーロとフランス国債（2026年10月23日）", "https://www.reuters.com/world/asia-pacific/yen-shines-ai-jitters-spur-safe-haven-rush-2026-10-23/"],
  ["Reuters・中東の供給懸念と原油相場（2026年10月23日）", "https://www.reuters.com/business/energy/oil-little-changed-supply-concern-lingers-amid-houthi-attacks-saudi-arabia-2026-10-23/"],
  ["FRB・2026年FOMC日程、October欄（2026年10月24日確認）", "https://www.federalreserve.gov/monetarypolicy/fomccalendars.htm"],
  ["日本銀行・2026年金融政策決定会合日程（2026年10月24日確認）", "https://www.boj.or.jp/mopo/mpmsche_minu/index.htm"],
  ["Reuters・翌週の大型決算とFOMC（2026年10月23日）", "https://www.reuters.com/business/wall-st-week-ahead-earnings-flood-fed-meeting-pose-pivotal-tests-rickety-ai-2026-10-23/"],
] as const;

function Ref({ ids }: { ids: number[] }) {
  return <span className="source-note">{ids.map(id => <a key={id} href={sources[id - 1][1]} target="_blank" rel="noreferrer"> [{id}]</a>)}</span>;
}

export default function WeeklyMarketOctober19() {
  return <main id="main-content" className="article-page">
    <Link className="back-link" href="/">← 記事一覧へ戻る</Link>
    <article>
      <header className="report-header">
        <p className="report-label">WEEKLY MARKET REPORT</p>
        <h1>{editorial.title}</h1>
        <p className="report-date">公開日：2026年10月24日／対象週：2026年10月19日（月）〜10月23日（金）</p>
      </header>
      <div className="report-body">
        <section>
          <h2>今週の要約：AI投資の需要と、資金を集める条件に距離</h2>
          <p>日経平均と米半導体株が週間で下落する一方、ダウ平均は小幅上昇した。AI投資への期待が一斉に消えたというより、設備需要、資金調達、将来の投資回収を分けて評価する局面だった。SolidigmのIPO検討中止と、ファナックの業績予想引き上げは、その違いを示す材料になった。<Ref ids={[1, 2, 3, 4, 5, 6, 7, 8]} /></p>
          <p>原油の供給懸念が残るなか、週後半には米国債や円へ安全を求める動きも報じられた。翌週はFOMC、日銀会合、大手クラウド企業の決算が重なる。設備投資の金額だけでなく、稼働率、売上への転換、現金回収と資金負担を確認したい。これは本誌の分析であり、相場の方向を保証するものではない。<Ref ids={[10, 13, 14, 15, 16, 17]} /></p>
          <p className="source-note">情報基準：2026年10月24日07:55 JST。日本株は23日の東京通常取引、米国株は23日の米国通常取引終値を採用。米国の23日16:00 EDTは日本の24日05:00 JST。日本株の23日終値に、その後の米国市場の値動きは含まれない。</p>
        </section>
        <section>
          <h2>主要4指数：10月16日から23日の週間騰落率</h2>
          <div className="table-wrap"><table className="report-table">
            <thead><tr><th>指数</th><th>10月16日終値</th><th>10月23日終値</th><th>週間騰落率</th><th>出典</th></tr></thead>
            <tbody>
              <tr><td>日経平均株価（円）</td><td>65,324.29</td><td>62,693.16</td><td>-4.03%</td><td><Ref ids={[1, 2]} /></td></tr>
              <tr><td>ダウ工業株30種平均（ポイント）</td><td>52,002.41</td><td>52,215.16</td><td>+0.41%</td><td><Ref ids={[3, 4]} /></td></tr>
              <tr><td>NASDAQ総合（ポイント）</td><td>26,140.03</td><td>25,955.34</td><td>-0.71%</td><td><Ref ids={[3, 4]} /></td></tr>
              <tr><td>SOX・フィラデルフィア半導体株指数（ポイント）</td><td>11,137.3</td><td>10,779.5</td><td>-3.21%</td><td><Ref ids={[5, 6]} /></td></tr>
            </tbody>
          </table></div>
          <p>日経平均は週間-4.03%、ダウ平均は+0.41%、NASDAQ総合は-0.71%、SOXは-3.21%。計算式は「（10月23日終値÷10月16日終値−1）×100」で、小数第2位に丸めた。どちらの日も各市場の最終取引日であり、週初の始値とは比較していない。価格指数の変化で、配当再投資、円換算の米国株投資収益、先物・時間外は含まない。</p>
          <p className="source-note">NASDAQは総合指数を採用し、NASDAQ 100とは区別した。SOXは同じInvesting.com履歴の両日の終値を小数第1位で統一。16日値はNasdaq提供のFRED系列11,137.29とも丸め後に一致する。FREDは確認時点で22日までの更新だったため、23日は二次市場データを使用した。表示値以上の精度を装わず、提供元の後日訂正があれば再確認する。</p>
        </section>
        <section>
          <h2>日本株：指数の下落と設備需要の改善を分けて読む</h2>
          <h3>確認できた事実</h3>
          <p>日経平均は週を通じて下落した。23日の通常取引でも安値から戻したが、前週末の水準は回復しなかった。指数は構成銘柄の値動きとウエートを反映するため、日本の全産業の利益が同じ割合で減ったことを意味しない。<Ref ids={[1, 2]} /></p>
          <p>ファナックは23日、2027年3月期の通期業績予想を上方修正した。Reutersによると、米州・中国の自動化投資や、中国のAIデータセンター・半導体関連などの工作機械需要が支えている。会社予想の修正という事実と、通期実績の確定は別である。決算発表後の反応を23日の東証終値にさかのぼって織り込まれたと扱わない。<Ref ids={[8]} /></p>
          <p>23日公表の9月全国CPIでは、生鮮食品を除く総合の前年同月比は2.1%上昇だった。2025年基準の原数値であり、エネルギーを含む。これを生鮮食品・エネルギーをともに除く系列や、季節調整済み前月比と混ぜない。<Ref ids={[9]} /></p>
          <h3>本誌の分析</h3>
          <p>設備を売る企業の受注と、その設備を使う顧客の投資採算には時間差がある。需要が強い企業でも、在庫・売掛金や生産設備への支出が先行すれば、利益ほどには現金が増えない。国内企業の決算では数量、価格、為替、製品構成を分け、営業CFと設備支出まで見たい。物価上昇は名目売上を押し上げ得るが、仕入れや賃金を十分転嫁できるかが利益率を左右する。</p>
        </section>
        <section>
          <h2>米国株・半導体：SolidigmはIPO検討中止、需要撤回とは異なる</h2>
          <p>SK hynixは23日、Solidigmのpre-IPO・IPOの検討中止を公表した。市場環境と株価動向を踏まえ、既存株主にとって上場が適切か再評価する必要があると説明している。一方、成長見通しと投資の必要性は変わらず、投資時期・規模・調達方法を引き続き検討するという。代替資金の確保完了や、すべての設備投資の撤回を発表したわけではない。<Ref ids={[7]} /></p>
          <p>米国株では週後半にAI関連への警戒が強まり、23日は前日の急落からハイテク株がいくらか落ち着いた。週間ではNASDAQ総合とSOXの下落が残ったが、ダウは上昇した。Reutersは、翌週のAlphabet、Microsoft、Amazonの決算と設備投資計画が焦点になると報じている。<Ref ids={[3, 4, 6, 11, 17]} /></p>
          <p><strong>本誌の分析：</strong>資金調達は「必要額が大きいか」だけでなく、金利、担保、返済期限、発行価格、親会社の負担で採算が変わる。AIサービスの利用拡大、インフラ企業の受注増、投資家が得る収益は同じものではない。株価下落だけで需要崩壊と断定せず、投資計画の修正、契約収入、稼働、現金回収がどう変わるかで仮説を検証する。</p>
        </section>
        <section>
          <h2>金利・債券・為替・原油：インフレ懸念のなかで安全資産も買われる</h2>
          <p><strong>米金利・債券：</strong>Schwabの23日朝の解説は、前日の株安と安全志向のなかで米国債が買われ、長期利回りが低下したと整理した。これは23日米国債の確定終値ではなく、22日から23日朝の状況である。原油高があっても、成長や金融不安への警戒が強まれば債券買いが優勢になることがある。後半は本誌の分析。<Ref ids={[10]} /></p>
          <p><strong>為替・欧州債：</strong>Reutersは23日、AI株売りに伴う安全志向が円を支え、フランスの財政・国債への不安がユーロの重荷になったと報じた。米ドルが常にすべての通貨に対して買われるとは限らない。輸出企業の円換算利益と、輸入企業の調達コストでは為替の影響が異なる。<Ref ids={[13]} /></p>
          <p><strong>原油：</strong>中東の衝突やサウジアラビアへの攻撃を背景とする供給懸念が続き、原油相場は上昇した。需要増だけが価格上昇の理由ではない。日本企業には輸送費、原料費、電力費と家計購買力を通じて波及し得る。個社の影響はヘッジ、契約、価格転嫁の時差で異なる。<Ref ids={[14]} /></p>
          <p className="source-note">この節は各報道が示す観測時点を付した定性的整理。株価指数と同じ時刻にそろえた金利・為替・原油の週間リターン表ではない。異なる時間帯の値や原油の異なる限月を接ぎ合わせた週間騰落率は掲載していない。</p>
        </section>
        <section>
          <h2>市場関係者の見方：強気、弱気、両面評価</h2>
          <p>以下は発言を要約したもの。分類は本誌による整理で、各氏の正式な売買推奨や市場の総意を示すものではない。</p>
          <ul>
            <li><strong>強気寄り・債券からの支援：</strong>Kevin Gordon氏（Schwab、23日）は、債券市場のストレスがピークに近づけば、株式市場が持ち直す余地に言及した。金融環境が落ち着くことを条件とした見方。<Ref ids={[10]} /></li>
            <li><strong>弱気寄り・AI投資の減速リスク：</strong>Kristina Hooper氏（Man Group、23日Reuters）は、翌年のAIデータセンター投資が従来の想定を下回る可能性を指摘した。投資削減の確定発表ではない。<Ref ids={[11]} /></li>
            <li><strong>中立・利益への波及を点検：</strong>Art Hogan氏（B Riley Wealth、23日Reuters）は、エネルギー主導のインフレが企業利益に及ぶことへの懸念と、まだ利益への影響が表れていない点を区別した。直ちに景気後退と決めつける見方ではない。<Ref ids={[12]} /></li>
          </ul>
          <p><strong>本誌の分析：</strong>分岐点は、資本コストの低下が利益を支えるのか、それとも投資減速と費用増が利益見通しを下げるのかにある。金利低下だけを買い材料にせず、その理由がインフレ沈静化なのか、成長不安なのかを併せて確認する。</p>
        </section>
        <section>
          <h2>翌週10月26日〜30日の注目点</h2>
          <ol>
            <li><strong>10月27日・28日：FOMC。</strong>FRB公式日程で確認。政策決定そのものと、物価・景気・金融環境についての説明を分けて読む。将来の利上げ・据え置きを確定事項として書かない。<Ref ids={[15]} /></li>
            <li><strong>10月29日・30日：日銀金融政策決定会合。</strong>30日には展望レポートの基本的見解と総裁会見が予定される。物価見通し、賃金、輸入コスト、政策の条件を確認したい。<Ref ids={[16]} /></li>
            <li><strong>通週：Alphabet、Microsoft、Amazonなどの決算。</strong>Reutersが翌週の注目企業として挙げた。AI・クラウドの需要、設備投資、減価償却、営業CF、リース負担の組み合わせを見る。個別の発表時刻は企業IRで確認する。<Ref ids={[17]} /></li>
            <li><strong>日本企業の決算と原油供給。</strong>ファナックの需要改善が他の装置・部材企業にも広がるか、数量と採算を確認する。中東情勢は見出しの強さだけで判断せず、実際の生産・輸送・供給への影響を追う。これは本誌の検証方針。<Ref ids={[8, 14]} /></li>
          </ol>
          <p><strong>条件付きの見通し：</strong>資金調達環境が安定し、クラウド需要と現金回収が投資を裏付ければ、評価の落ち着く余地がある。逆に供給制約による原油高と利益予想の下方修正が重なれば、利益と評価倍率の両面に圧力がかかり得る。どちらも予測の確定ではなく、翌週の開示で検証するシナリオである。</p>
        </section>
        <section>
          <h2>出典一覧</h2>
          <p>一次情報は指数算定機関、中央銀行、統計局、企業の公表。取得できなかった一次資料の代わりに用いた主要報道は本文と出典で区別した。ファナックの今回の要約はReutersで確認できた内容に限定し、未取得のIR表から数値を推測しない。更新型データは上記情報基準時点の確認内容で、後日改定され得る。</p>
          <ol>{sources.map(([label, url]) => <li key={url}><a href={url} target="_blank" rel="noreferrer">{label}</a></li>)}</ol>
        </section>
        <section className="disclaimer">
          <h2>注意事項</h2>
          <p>本記事は公開情報を整理する情報提供であり、特定の金融商品の売買を推奨する投資助言ではありません。事実、会社予想、市場関係者の見解、本誌の分析を区別しています。将来の相場・企業利益・投資成果を保証しません。投資には元本割れを含むリスクがあります。</p>
        </section>
      </div>
    </article>
  </main>;
}
