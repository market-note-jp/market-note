import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "週次マーケットニュースレポート（2026年8月17日〜21日） | Market Note",
  description: "日本株・米国株・日経平均・ダウ平均・NASDAQ総合・SOX指数をまとめた週次マーケットニュースレポート。",
};

export default function WeeklyReportAugust17() {
  return (
    <main className="article-page">
      <Link className="back-link" href="/">← 記事一覧へ戻る</Link>
      <article>
        <header className="report-header">
          <p className="report-label">WEEKLY MARKET REPORT</p>
          <h1>週次マーケットニュースレポート（2026年8月17日〜21日）</h1>
          <p className="report-date">公開日：2026年8月22日</p>
        </header>

        <div className="report-body">
          <section>
            <h2>今週の要約</h2>
            <p>今週は、世界的な長期金利上昇と原油高が、株式市場の高いバリュエーションを揺さぶりました。米国では財政・国債需給への懸念から30年国債利回りが一時5.34%と2007年以来の高水準に達し、AI・半導体を中心とする成長株に売りが波及しました。米国株は金曜日に反発したものの、ダウ平均は週間0.85%安、NASDAQ総合は2.05%安。SOX指数は約5.8%下落しました。</p>
            <p>日本株も同じ構図の影響を強く受けました。日経平均は17日に69,220.25まで上昇した後、18〜19日に急落し、21日は66,016.36で終了。前週末比では約3.9%安でした。中東情勢を背景とする原油高、日本の長期金利上昇、AI・半導体株の利益確定が重なった一方、20日には米財務省による長期国債買い戻し拡大を受けて反発するなど、金利が株価を左右する一週間でした。</p>
          </section>

          <section>
            <h2>主要指数の週間変動</h2>
            <div className="table-wrap">
              <table className="report-table">
                <thead><tr><th>指数</th><th>8月21日終値</th><th>週間騰落率</th><th>主な材料</th></tr></thead>
                <tbody>
                  <tr><td>日経平均</td><td>66,016.36</td><td>-3.9%</td><td>原油高、国内外の長期金利上昇、AI・半導体株の調整</td></tr>
                  <tr><td>ダウ平均</td><td>53,277.01</td><td>-0.85%</td><td>長期金利上昇と消費懸念。金曜は+0.98%反発</td></tr>
                  <tr><td>NASDAQ総合</td><td>26,180.45</td><td>-2.05%</td><td>高金利への警戒と大型テック・半導体株の売り</td></tr>
                  <tr><td>SOX指数</td><td>11,693.9</td><td>約-5.8%</td><td>AI・半導体株の利益確定、長期金利上昇</td></tr>
                </tbody>
              </table>
            </div>
            <p className="source-note">日経平均は<a href="https://indexes.nikkei.co.jp/nkave/archives/data/" target="_blank" rel="noreferrer">日経平均公式ヒストリカルデータ（8月21日更新）</a>の8月14日68,713.80と21日66,016.36から算出。米国株は<a href="https://apnews.com/article/09c079b43680c3e4564346892b5dc824" target="_blank" rel="noreferrer">AP（8月21日）</a>で終値と週間騰落率を確認しました。SOXは<a href="https://www.investing.com/indices/phlx-semiconductor-historical-data" target="_blank" rel="noreferrer">PHLX Semiconductor Index履歴データ（8月21日）</a>の8月14日12,417.0と21日11,693.9から算出しています。米国ハイテク指数にはNASDAQ総合を採用しています。</p>
          </section>

          <section>
            <h2>日本株の主なニュースと要因</h2>
            <ul>
              <li><strong>日経平均は高値から急反落：</strong>17日の69,220.25から19日には65,326.42まで下落。18日は中東情勢の停滞による原油高と金利上昇で2.5%安、19日は米半導体株安が波及して3.2%安となりました。週末21日は66,016.36まで戻したものの、週間では約3.9%下落しました。<a href="https://indexes.nikkei.co.jp/nkave/archives/data/" target="_blank" rel="noreferrer">日経平均公式（8月21日）</a></li>
              <li><strong>日本の長期金利が30年ぶりの水準：</strong>10年国債利回りは18日に2.945%まで上昇し、1996年以来の高水準となりました。海外金利上昇に加え、日銀の9月利上げ観測が金利上昇圧力になっています。<a href="https://www.investing.com/news/economy-news/japans-10year-government-bond-yield-rises-to-threedecade-peak-4864126" target="_blank" rel="noreferrer">Reuters配信（8月18日）</a></li>
              <li><strong>4〜6月GDPは年率1.1%増：</strong>実質GDPは前期比0.3%、年率1.1%増と市場予想を下回りました。個人消費と設備投資が弱く、輸出が下支えしました。景気の弱さとインフレ圧力が併存しており、日銀には難しい政策環境です。<a href="https://www.reuters.com/world/asia-pacific/japans-economy-grows-slower-than-expected-april-june-2026-08-17/" target="_blank" rel="noreferrer">Reuters（8月17日）</a></li>
              <li><strong>7月CPIはコア1.8%：</strong>生鮮食品を除く全国CPIは前年比1.8%、生鮮食品・エネルギーを除く指数は1.9%上昇しました。数字自体は予想通りでしたが、原油高と円安が今後の物価を再加速させる可能性は残ります。<a href="https://www.reuters.com/world/asia-pacific/japan-july-core-cpi-rises-18-yryr-2026-08-20/" target="_blank" rel="noreferrer">Reuters（8月21日公表分）</a></li>
            </ul>
          </section>

          <section>
            <h2>米国株の主なニュースと要因</h2>
            <ul>
              <li><strong>長期金利が株式の最大の重石：</strong>米30年国債利回りは週中に5.34%まで上昇し、2007年以来の高水準。財政赤字、40兆ドルを超える政府債務、原油高によるインフレ懸念が長期債売りにつながりました。<a href="https://www.reuters.com/commentary/reuters-open-interest/global-markets-view-usa-2026-08-21/" target="_blank" rel="noreferrer">Reuters（8月21日）</a></li>
              <li><strong>半導体株が大きく調整：</strong>SOX指数は週間で約5.8%下落しました。AI需要の長期成長期待が崩れたというより、高いバリュエーションに長期金利上昇が重なり、利益確定が集中した面が大きいとみられます。翌週のNVIDIA決算がAI相場の重要な再評価材料になります。<a href="https://www.reuters.com/business/wall-st-week-ahead-nvidia-earnings-jackson-hole-test-pillars-stock-rally-2026-08-21/" target="_blank" rel="noreferrer">Reuters（8月21日）</a></li>
              <li><strong>Walmartが米消費への警戒を強める：</strong>米既存店売上高は2.6%増と市場予想3.8%を下回り、6年ぶりの低い伸びとなりました。通期見通しは引き上げたものの、燃料高などによる家計圧迫が意識され、株価は9%下落しました。<a href="https://www.reuters.com/business/walmart-reports-rare-comparable-sales-miss-consumers-pare-back-spending-2026-08-20/" target="_blank" rel="noreferrer">Reuters（8月20日）</a></li>
              <li><strong>金曜は反発：</strong>21日はダウ+0.98%、NASDAQ総合+0.43%。Ross Storesなどの決算や企業活動の底堅さが買い材料となりましたが、週間では主要指数がそろって下落しました。<a href="https://apnews.com/article/09c079b43680c3e4564346892b5dc824" target="_blank" rel="noreferrer">AP（8月21日）</a></li>
            </ul>
          </section>

          <section>
            <h2>市場関係者の見方</h2>
            <ul className="viewpoints">
              <li><strong>強気：</strong>NVIDIAについては、AIインフラ需要の拡大が続くとの見方が依然優勢です。8月26日の決算はAI投資サイクルの持続性を測る最大のイベントで、ReutersはNVIDIAが金融機関6社と5000億ドル超のAIインフラ金融を目指す枠組みを組んだことも紹介しています。企業利益が期待を上回り続ければ、今週の調整は金利主導の一時的なものとなる可能性があります。<a href="https://www.reuters.com/business/wall-st-week-ahead-nvidia-earnings-jackson-hole-test-pillars-stock-rally-2026-08-21/" target="_blank" rel="noreferrer">Reuters（8月21日）</a></li>
              <li><strong>中立・慎重：</strong>Nomura SecuritiesのWataru Akiyama氏は、金利上昇が株式の相対的な割高感を意識させると指摘しました。一方、20日のように金利が低下すれば幅広い銘柄へ買いが戻っており、企業ファンダメンタルズと金利の綱引きが続く局面です。<a href="https://www.brecorder.com/news/40435417" target="_blank" rel="noreferrer">Reuters配信（8月18日）</a></li>
              <li><strong>弱気・リスク警戒：</strong>Saxo BankのCharu Chanana氏は、米10年債利回り上昇が続けば株式の要求収益率を押し上げ、金融環境を引き締め、レバレッジの高い企業や政府に圧力をかけると指摘しました。AI設備投資は巨額の資金調達を必要とするため、長期金利の高止まりはAIテーマにも無関係ではありません。<a href="https://www.streetinsider.com/Reuters/Bond%2Byields%2Brise%2C%2Boil%2Bextends%2Bgains%2Bas%2BUS-Iran%2Bceasefire%2Bexpires/26939378.html" target="_blank" rel="noreferrer">Reuters配信（8月18日）</a></li>
            </ul>
          </section>

          <section>
            <h2>相場環境：金利・為替・原油・債券・リスク選好</h2>
            <p><strong>米金利・債券：</strong>週末の米10年債利回りは4.7%台、30年債は5.2%台。米財務省は長期債の買い戻し規模を倍増させましたが、財政・国債需給への懸念は消えていません。<a href="https://www.reuters.com/world/china/global-markets-global-markets-2026-08-21/" target="_blank" rel="noreferrer">Reuters（8月21日）</a></p>
            <p><strong>日本金利：</strong>10年JGB利回りは週中に2.945%まで上昇。日銀の追加利上げ観測と世界的な債券売りが重なりました。金利上昇は銀行などには追い風になり得る一方、高PERの成長株には逆風です。</p>
            <p><strong>為替：</strong>ドルは週間で主要通貨に対して約1%下落しました。ドル円は160円近辺が引き続き重要水準ですが、米金利上昇だけでドル高にならず、米財政への懸念もドルの重石となっています。<a href="https://www.reuters.com/world/china/global-markets-global-markets-2026-08-21/" target="_blank" rel="noreferrer">Reuters（8月21日）</a></p>
            <p><strong>原油：</strong>Brentは週末に95ドル近辺まで上昇し、週間でも大幅高。米国がイランへの制裁強化を示したことやホルムズ海峡を巡る供給不安が背景です。原油高は企業コストとインフレ期待を通じて、株式・債券双方に影響します。</p>
            <p><strong>リスク選好：</strong>今週は明確にリスクオフ寄りでした。ただし全面的な景気後退取引ではなく、金・資源・暗号資産など一部資産は上昇しており、「現金化」よりも「高金利に弱い資産からのローテーション」という側面もあります。</p>
          </section>

          <section>
            <h2>翌週の注目点</h2>
            <ul>
              <li><strong>NVIDIA決算（8月26日）：</strong>AI設備投資の実需、データセンター売上高、次四半期見通しが最大の焦点。SOXが今週大きく下落した直後だけに、好決算でも市場の高い期待値を超えられるかが重要です。<a href="https://www.reuters.com/business/wall-st-week-ahead-nvidia-earnings-jackson-hole-test-pillars-stock-rally-2026-08-21/" target="_blank" rel="noreferrer">Reuters（8月21日）</a></li>
              <li><strong>Jackson Hole：</strong>Fed議長Kevin Warsh氏の就任後初のJackson Holeでの発言が予定されています。市場は9月利上げを約35%、年内利上げを約66%織り込んでおり、インフレと長期金利への認識が相場を動かす可能性があります。</li>
              <li><strong>米PCE・GDP・耐久財受注：</strong>インフレが再加速しているのか、実体経済が金利上昇に耐えているのかを確認する週になります。特に原油高がインフレ期待へ波及するかが焦点です。<a href="https://www.wsj.com/economy/central-banking/week-ahead-for-fx-bonds-warsh-speech-at-jackson-hole-u-s-pce-data-in-focus-1b33f004" target="_blank" rel="noreferrer">WSJ（8月21日）</a></li>
              <li><strong>日銀と円相場：</strong>日本のCPIは落ち着いている一方、原油高と円安が先行き物価を押し上げる可能性があります。9月会合での追加利上げ観測と10年JGB利回り3%近辺の動きに注意が必要です。</li>
              <li><strong>中東・原油：</strong>ホルムズ海峡を巡る供給制約が長期化すれば、原油高→インフレ期待上昇→長期金利上昇→成長株のバリュエーション圧縮という経路が再び強まります。</li>
            </ul>
          </section>

          <section>
            <h2>来週を見るうえでの整理</h2>
            <p>今週の調整は、AI需要そのものが崩れたというより、長期金利という「割引率」が急上昇したことで高バリュエーション株が再評価された面が大きいと考えられます。そのため、翌週はNVIDIAの業績だけを見ても不十分です。</p>
            <p><strong>AI企業利益 × 米長期金利 × 原油 × Fedの政策姿勢 × 日本の金利正常化</strong>を同時に見る必要があります。NVIDIAが強い数字を出しても長期金利がさらに上昇すれば株価反応は限定され得ます。逆に、金利が落ち着きAI需要が確認されれば、今週売られた半導体株への買い戻し余地が生まれます。</p>
            <p>日本株では、日経平均のウェート上位に半導体・AI関連銘柄が多いため、米SOXと米長期金利の影響が指数に増幅されやすい構造が続きます。一方で、金利上昇局面では銀行、資源、海運などへのローテーションが起きやすく、指数だけでは市場内部の強弱を捉えにくい点にも注意が必要です。</p>
          </section>

          <section>
            <h2>主な出典</h2>
            <ul>
              <li><a href="https://indexes.nikkei.co.jp/nkave/archives/data/" target="_blank" rel="noreferrer">Nikkei Indexes — 日経平均ヒストリカルデータ（2026年8月21日更新）</a></li>
              <li><a href="https://apnews.com/article/09c079b43680c3e4564346892b5dc824" target="_blank" rel="noreferrer">AP — How major US stock indexes fared Friday 8/21/2026（2026年8月21日）</a></li>
              <li><a href="https://www.reuters.com/world/china/global-markets-global-markets-2026-08-21/" target="_blank" rel="noreferrer">Reuters — Global stocks close out a tough week as bond yields, oil stay high（2026年8月21日）</a></li>
              <li><a href="https://www.reuters.com/business/wall-st-week-ahead-nvidia-earnings-jackson-hole-test-pillars-stock-rally-2026-08-21/" target="_blank" rel="noreferrer">Reuters — Nvidia earnings, Jackson Hole to test pillars of stock rally（2026年8月21日）</a></li>
              <li><a href="https://www.reuters.com/world/asia-pacific/japan-july-core-cpi-rises-18-yryr-2026-08-20/" target="_blank" rel="noreferrer">Reuters — Japan July core CPI rises 1.8%（2026年8月21日公表分）</a></li>
              <li><a href="https://www.reuters.com/world/asia-pacific/japans-economy-grows-slower-than-expected-april-june-2026-08-17/" target="_blank" rel="noreferrer">Reuters — Japan Q2 GDP（2026年8月17日）</a></li>
              <li><a href="https://www.reuters.com/business/walmart-reports-rare-comparable-sales-miss-consumers-pare-back-spending-2026-08-20/" target="_blank" rel="noreferrer">Reuters — Walmart Q2（2026年8月20日）</a></li>
              <li><a href="https://www.investing.com/indices/phlx-semiconductor-historical-data" target="_blank" rel="noreferrer">PHLX Semiconductor Index Historical Data（2026年8月21日確認）</a></li>
            </ul>
          </section>

          <section className="disclaimer">
            <h2>注意事項</h2>
            <p>本記事は公開情報をもとに市場動向を整理することを目的としたものであり、特定の金融商品の購入・売却を推奨する投資助言ではありません。株式・債券・為替・商品等への投資には元本割れを含むリスクがあります。投資判断は各自の資産状況、投資目的、リスク許容度等を踏まえて行ってください。</p>
            <p>市場変動の要因は複数存在し、記事内の説明は公開情報に基づく整理です。特定の一要因によって価格変動を断定するものではありません。</p>
          </section>
        </div>
      </article>
    </main>
  );
}
