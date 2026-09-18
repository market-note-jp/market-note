import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "週次マーケットニュースレポート（2026年9月14日〜18日） | Market Note",
  description: "日本株・米国株・日経平均・ダウ平均・NASDAQ総合・SOX指数をまとめた週次マーケットニュースレポート。",
};

export default function WeeklyReportSeptember14() {
  return (
    <main className="article-page">
      <Link className="back-link" href="/">← 記事一覧へ戻る</Link>
      <article>
        <header className="report-header">
          <p className="report-label">WEEKLY MARKET REPORT</p>
          <h1>週次マーケットニュースレポート（2026年9月14日〜18日）</h1>
          <p className="report-date">公開日：2026年9月19日</p>
        </header>

        <div className="report-body">
          <section>
            <h2>今週の要約</h2>
            <p>今週は、米連邦準備制度理事会（FRB）と日本銀行がそろって利上げに踏み切る一方、原油が100ドル台に高止まりし、世界的な長期金利上昇が続く「金融引き締めと高エネルギー価格」の週でした。米国ではFRBが政策金利を25bp引き上げ3.75〜4.00%とし、年内の追加利上げ余地を残しました。日本銀行も政策金利を1.00%から1.25%へ引き上げ、31年ぶりの高水準としました。</p>
            <p>株式市場は一枚岩ではありません。米国ではダウ平均が週間1.7%安となる一方、NASDAQ総合は0.7%高、SOX指数も0.83%高。AI・半導体株への資金流入が続く一方、米10年国債利回りが5%近辺まで上昇したことで、広範な株式にはバリュエーション圧力がかかりました。日本では日経平均が前週末64,011.34から65,018.95へ上昇し、週間約1.57%高でした。</p>
            <p>今週の核心は「中央銀行が利上げしても、AI・半導体の利益成長期待は完全には崩れていない」ことです。ただし、原油100ドル超と長期金利5%近辺が長期化すれば、企業利益と株価評価の双方に逆風となるため、リスクオン一辺倒とは評価しにくい状況です。</p>
          </section>

          <section>
            <h2>主要指数の週間変動</h2>
            <div className="table-wrap">
              <table className="report-table">
                <thead><tr><th>指数</th><th>9月18日終値</th><th>週間騰落率</th><th>主な材料</th></tr></thead>
                <tbody>
                  <tr><td>日経平均</td><td>65,018.95</td><td>約+1.57%</td><td>AI・半導体株の反発、原油下落。日銀利上げ後も円安が進行</td></tr>
                  <tr><td>ダウ平均</td><td>51,682.64</td><td>-1.7%</td><td>長期金利上昇、FRB追加利上げ観測、景気敏感株の弱さ</td></tr>
                  <tr><td>NASDAQ総合</td><td>26,522.55</td><td>+0.7%</td><td>半導体・AI株の相対的な強さが金利上昇の逆風を相殺</td></tr>
                  <tr><td>SOX指数</td><td>11,921.69</td><td>約+0.83%</td><td>週前半の調整後、17〜18日に半導体株が急反発</td></tr>
                </tbody>
              </table>
            </div>
            <p className="source-note">日経平均は<a href="https://indexes.nikkei.co.jp/en/nkave/archives/data" target="_blank" rel="noreferrer">日経指数公式（2026年9月18日更新）</a>の9月11日64,011.34と9月18日65,018.95から算出。米国株は<a href="https://apnews.com/article/da0dbe004b6f83c36e7d1626a9741a92" target="_blank" rel="noreferrer">AP（2026年9月18日）</a>で終値と週間騰落率を確認。SOXは<a href="https://www.tallacoptions.com/Indices/SOX" target="_blank" rel="noreferrer">PHLX Semiconductor Index履歴データ（2026年9月18日）</a>の9月11日11,824.00と9月18日11,921.69から算出しています。米国ハイテク指数にはNASDAQ総合を採用しています。</p>
          </section>

          <section>
            <h2>日本株の主なニュースと要因</h2>
            <ul>
              <li><strong>日銀が政策金利を1.25%へ：</strong>日銀は9月18日の金融政策決定会合で政策金利を1.00%から1.25%へ引き上げました。7対2の決定で、31年ぶりの高水準です。原油高や円安による物価上振れリスクを警戒する一方、2人の審議委員は景気への影響を理由に反対しました。<a href="https://www.reuters.com/world/asia-pacific/boj-raises-interest-rates-31-year-high-widely-expected-move-2026-09-18/" target="_blank" rel="noreferrer">Reuters（9月18日）</a></li>
              <li><strong>利上げでも円安：</strong>ドル円は日銀決定後に一時158円台まで円安が進みました。市場は利上げそのものより、追加利上げに関する明確なタカ派ガイダンスが乏しかった点と2人の反対票を重視しました。政府は過度な為替変動への警戒を示しています。<a href="https://www.reuters.com/world/asia-pacific/yen-weak-ahead-boj-decision-rate-hike-expected-2026-09-18/" target="_blank" rel="noreferrer">Reuters（9月18日）</a></li>
              <li><strong>日経平均は週末に反発：</strong>9月18日はAI・半導体関連株の上昇や原油価格の低下を背景に日経平均が約1.4%上昇。キオクシア、レーザーテックなど半導体関連の上昇が目立ちました。日銀利上げは事前に相当程度織り込まれていたとみられます。<a href="https://apnews.com/article/67e71246d3af41bcfc61aa788f9959c7" target="_blank" rel="noreferrer">AP（9月18日）</a></li>
              <li><strong>日本国債利回りは高水準：</strong>10年JGB利回りは3%近辺と約30年ぶりの水準にあり、日銀の正常化と財政拡張への警戒が債券市場の重石です。国内金利上昇は銀行には利ざや改善要因となる一方、高PER株や借入依存度の高い企業には逆風となります。<a href="https://www.reuters.com/world/asia-pacific/boj-set-raise-interest-rates-31-year-high-inflation-risks-loom-2026-09-16/" target="_blank" rel="noreferrer">Reuters（9月16日）</a></li>
            </ul>
          </section>

          <section>
            <h2>米国株の主なニュースと要因</h2>
            <ul>
              <li><strong>FRBが3年ぶりの利上げ：</strong>FRBは9月16日に25bpの利上げを決め、FF金利誘導目標を3.75〜4.00%としました。Kevin Warsh議長の下で初の利上げで、インフレ抑制を優先する姿勢が示されました。政策見通しは年内の追加利上げ余地を残しています。<a href="https://www.federalreserve.gov/monetarypolicy/fomccalendars.htm" target="_blank" rel="noreferrer">Federal Reserve（9月16日）</a> / <a href="https://www.reuters.com/business/nasdaq-futures-lead-wall-st-gains-oil-retreat-eases-inflation-worries-2026-09-18/" target="_blank" rel="noreferrer">Reuters（9月18日）</a></li>
              <li><strong>米10年債利回りが5%へ：</strong>9月18日に米10年国債利回りは5%近辺まで上昇しました。高い実質金利は株式の割引率を押し上げ、特に高バリュエーション銘柄の評価に逆風となります。<a href="https://www.reuters.com/business/nasdaq-futures-lead-wall-st-gains-oil-retreat-eases-inflation-worries-2026-09-18/" target="_blank" rel="noreferrer">Reuters（9月18日）</a></li>
              <li><strong>半導体株は週末に急反発：</strong>SOX指数は9月16日に11,246.11まで下落した後、17日に3.14%、18日に2.78%上昇し11,921.69で終了しました。AI計算需要への期待が金利上昇局面でも半導体株を下支えしています。<a href="https://www.tallacoptions.com/Indices/SOX" target="_blank" rel="noreferrer">PHLX Semiconductor Index履歴（9月18日）</a></li>
              <li><strong>指数間の格差が拡大：</strong>週間ではNASDAQ総合が0.7%高だった一方、ダウは1.7%安。AI・半導体への資金集中と、金融引き締めの影響を受けやすい景気敏感・大型バリュー株の弱さが同居しました。<a href="https://apnews.com/article/da0dbe004b6f83c36e7d1626a9741a92" target="_blank" rel="noreferrer">AP（9月18日）</a></li>
            </ul>
          </section>

          <section>
            <h2>市場関係者の見方</h2>
            <ul className="viewpoints">
              <li><strong>強気：</strong>Morgan StanleyのポートフォリオマネジャーDaniel Skellyは、短期的には原油・高金利・選挙を巡るボラティリティを認めつつ、企業ファンダメンタルズとAI導入の拡大を理由に長期見通しには前向きな姿勢を示しています。<a href="https://www.barrons.com/livecoverage/stock-market-news-today-091826/card/dow-suffers-worst-week-since-march-extending-september-skid-umFn7ypGhw0D2kTu4DsZ" target="_blank" rel="noreferrer">Barron's（9月18日）</a></li>
              <li><strong>中立・慎重：</strong>Horizon Investment ServicesのChuck Carlsonは、FRB会合や金利・原油を巡る大きな材料を消化した週末の市場について、投資家が積極的な方向感を取りにくい状態を指摘しました。NASDAQの強さは確認できる一方、市場の騰落銘柄数は弱く、指数だけで全面的なリスクオンとは判断しにくい状況です。<a href="https://www.reuters.com/business/nasdaq-futures-lead-wall-st-gains-oil-retreat-eases-inflation-worries-2026-09-18/" target="_blank" rel="noreferrer">Reuters（9月18日）</a></li>
              <li><strong>弱気・リスク警戒：</strong>Capital Economicsは、中東紛争が長期化すれば原油が2027年まで100ドル超で推移する可能性を警戒しています。高エネルギー価格が続けばインフレ再加速、追加利上げ、企業マージン圧迫という経路で株式市場への逆風が強まります。<a href="https://www.wsj.com/finance/commodities-futures/oil-falls-as-worries-over-middle-east-supply-disruptions-ease-36be861a" target="_blank" rel="noreferrer">Wall Street Journal（9月18日）</a></li>
            </ul>
          </section>

          <section>
            <h2>相場環境：金利・為替・原油・債券・リスク選好</h2>
            <ul>
              <li><strong>米国金利：</strong>米10年国債利回りは週末に5%近辺、2年債利回りも4.74%近辺まで上昇。FRBの25bp利上げと追加引き締め観測が債券価格を圧迫しました。<a href="https://www.reuters.com/business/nasdaq-futures-lead-wall-st-gains-oil-retreat-eases-inflation-worries-2026-09-18/" target="_blank" rel="noreferrer">Reuters（9月18日）</a></li>
              <li><strong>日本金利：</strong>日銀は政策金利を1.25%へ引き上げました。10年JGB利回りは3%近辺にあり、国内債券市場も超低金利時代から構造転換が進んでいます。<a href="https://www.reuters.com/world/asia-pacific/boj-raises-interest-rates-31-year-high-widely-expected-move-2026-09-18/" target="_blank" rel="noreferrer">Reuters（9月18日）</a></li>
              <li><strong>為替：</strong>ドル円は日銀利上げ後に一時158.05円まで上昇。日米双方が利上げする中でも、米金利の高さと日銀の追加引き締めペースへの疑念がドルを支えました。為替介入への警戒は残ります。<a href="https://www.reuters.com/world/asia-pacific/yen-weak-ahead-boj-decision-rate-hike-expected-2026-09-18/" target="_blank" rel="noreferrer">Reuters（9月18日）</a></li>
              <li><strong>原油：</strong>Brentは104.87ドル、WTIは100.30ドルで週を終えました。サウジの供給障害懸念が一部後退して週後半は下落したものの、ホルムズ海峡を巡る供給リスクは解消していません。<a href="https://www.reuters.com/business/energy/oil-prices-fall-1-hopes-limited-supply-disruptions-2026-09-18/" target="_blank" rel="noreferrer">Reuters（9月18日）</a></li>
              <li><strong>リスク選好：</strong>NASDAQとSOXが週間プラスを維持する一方、ダウは大幅安。リスク選好は「全面的なリスクオン」ではなく、AI・半導体への選別集中と評価するのが妥当です。高金利・高原油・中東情勢が市場全体の上値を抑えています。</li>
            </ul>
          </section>

          <section>
            <h2>翌週の注目点</h2>
            <ol>
              <li><strong>FRB利上げ後の金利再評価：</strong>市場は10月会合での追加利上げ確率を織り込み始めています。米10年債利回りが5%を明確に上抜けるかが、グロース株の評価に直結します。</li>
              <li><strong>米国のフラッシュPMI：</strong>9月23日にS&P Globalの製造業・サービス業PMI速報が予定されています。景気の強さが続けば追加利上げ観測を支え、弱ければ金利上昇を抑える可能性があります。</li>
              <li><strong>米耐久財受注：</strong>9月25日に8月耐久財受注が予定されています。AI・データセンターを含む企業設備投資の強さを確認する材料です。<a href="https://www.census.gov/manufacturing/m3/" target="_blank" rel="noreferrer">U.S. Census Bureau（9月25日予定）</a></li>
              <li><strong>原油と中東情勢：</strong>Brentが100ドルを割り込むか、再び110ドル方向へ上昇するかは、インフレ期待と世界の長期金利を左右します。国連総会を巡る米国・イラン・湾岸諸国の外交動向にも注意が必要です。</li>
              <li><strong>日銀利上げ後の円とJGB：</strong>ドル円158円近辺で政府の介入警戒が再び高まっています。円安継続なら輸入インフレが強まり、日銀の追加利上げ観測が前倒しされる可能性があります。</li>
              <li><strong>AI・半導体の選別：</strong>SOXは週後半に急反発しましたが、米10年金利5%との併存は容易ではありません。今後はAI需要の強さだけでなく、利益成長が高い割引率を上回れる企業かどうかが一段と重要になります。</li>
            </ol>
          </section>

          <section>
            <h2>来週を見るうえでの整理</h2>
            <p>今週は、FRBと日銀の同時利上げという強い金融引き締め材料がありながら、NASDAQ総合とSOX指数は週間プラスを維持しました。これはAI・半導体の利益成長期待が依然として強いことを示します。</p>
            <p>一方、ダウ平均は1.7%下落し、米10年債利回りは5%近辺、原油も100ドルを超えています。したがって「株式市場全体が強い」というより、<strong>高金利と高原油に耐えられる利益成長企業へ資金が集中している</strong>と見る方が実態に近いでしょう。</p>
            <p>翌週は、米長期金利、原油、ドル円、PMI、耐久財受注を同時に確認する必要があります。特に、原油高→インフレ期待上昇→追加利上げ観測→長期金利上昇という連鎖が続くか、それとも原油下落でこの連鎖が弱まるかが、AI・半導体株を含むリスク資産の方向を左右します。</p>
          </section>

          <section>
            <h2>主な出典</h2>
            <ul>
              <li><a href="https://indexes.nikkei.co.jp/en/nkave/archives/data" target="_blank" rel="noreferrer">Nikkei Indexes — Historical Data（2026年9月18日更新）</a></li>
              <li><a href="https://apnews.com/article/da0dbe004b6f83c36e7d1626a9741a92" target="_blank" rel="noreferrer">AP — How major US stock indexes fared Friday 9/18/2026（9月18日）</a></li>
              <li><a href="https://www.reuters.com/business/nasdaq-futures-lead-wall-st-gains-oil-retreat-eases-inflation-worries-2026-09-18/" target="_blank" rel="noreferrer">Reuters — S&amp;P 500, Nasdaq advance, turning the page on a tumultuous week（9月18日）</a></li>
              <li><a href="https://www.reuters.com/world/asia-pacific/boj-raises-interest-rates-31-year-high-widely-expected-move-2026-09-18/" target="_blank" rel="noreferrer">Reuters — BOJ raises interest rates to 31-year high（9月18日）</a></li>
              <li><a href="https://www.reuters.com/world/asia-pacific/yen-weak-ahead-boj-decision-rate-hike-expected-2026-09-18/" target="_blank" rel="noreferrer">Reuters — Dollar advances vs yen after BOJ decision（9月18日）</a></li>
              <li><a href="https://www.reuters.com/business/energy/oil-prices-fall-1-hopes-limited-supply-disruptions-2026-09-18/" target="_blank" rel="noreferrer">Reuters — Oil slides as Saudi supply concerns ease（9月18日）</a></li>
              <li><a href="https://www.tallacoptions.com/Indices/SOX" target="_blank" rel="noreferrer">PHLX Semiconductor Index historical data（9月18日）</a></li>
            </ul>
          </section>

          <section className="disclaimer">
            <h2>注意事項</h2>
            <p>本記事は、公開情報をもとに市場動向を整理することを目的としたものであり、特定の金融商品の購入・売却を推奨するものではありません。株式・債券・為替・商品等への投資には元本割れを含むリスクがあります。投資判断は各自の資産状況、投資目的、リスク許容度等を踏まえて行ってください。</p>
            <p>記事内の市場変動要因は複数の一次情報・主要報道に基づく整理であり、一つの要因によって価格変動を断定するものではありません。数値は各市場の終値・公表時点を基準としています。</p>
          </section>
        </div>
      </article>
    </main>
  );
}
