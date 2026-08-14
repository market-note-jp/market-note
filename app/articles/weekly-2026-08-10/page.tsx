import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "週次マーケットニュースレポート（2026年8月10日〜14日） | Market Note",
  description: "日本株・米国株・日経平均・ダウ平均・NASDAQ総合・SOX指数をまとめた週次マーケットニュースレポート。",
};

export default function WeeklyReportAugust10() {
  return (
    <main className="article-page">
      <Link className="back-link" href="/">← 記事一覧へ戻る</Link>

      <article>
        <header className="report-header">
          <p className="report-label">WEEKLY MARKET REPORT</p>
          <h1>週次マーケットニュースレポート（2026年8月10日〜14日）</h1>
          <p className="report-date">公開日：2026年8月15日</p>
        </header>

        <div className="report-body">
          <section>
            <h2>今週の要約</h2>
            <p>
              今週は、日本株と米国株で方向感が分かれました。日経平均は8月7日の65,606.71から14日の68,713.80へ4.7%上昇し、週中には連日で高値圏を切り上げました。一方、米国では7月CPIとPPIが比較的落ち着き、追加利上げ観測が後退したものの、14日の弱い小売売上高と中東情勢を背景とした原油高が景気・インフレ双方への警戒を残しました。
            </p>
            <p>
              米国株はS&P500が週間では3週連続高となった一方、ダウ平均は0.6%安、NASDAQ総合は0.1%高と小幅な動きでした。SOX指数は週初に2.9%下落した後、12〜13日に反発し、週間では0.5%高。AI・半導体需要そのものは強いものの、Applied Materialsが好決算・強い見通しにもかかわらず売られたことは、株価に織り込まれた期待値の高さを示す材料になりました。
            </p>
          </section>

          <section>
            <h2>主要指数の週間変動</h2>
            <div className="table-wrap">
              <table className="report-table">
                <thead>
                  <tr><th>指数</th><th>8月14日終値</th><th>週間騰落率</th><th>主な材料</th></tr>
                </thead>
                <tbody>
                  <tr><td>日経平均</td><td>68,713.80</td><td>+4.7%</td><td>米株高、AI・半導体株の反発、国内決算、円安基調</td></tr>
                  <tr><td>ダウ平均</td><td>53,732.41</td><td>-0.6%</td><td>小売売上高の弱さ、原油高、セクター間の選別</td></tr>
                  <tr><td>NASDAQ総合</td><td>26,729.16</td><td>+0.1%</td><td>インフレ鈍化と金利観測、AI関連株の底堅さ</td></tr>
                  <tr><td>SOX指数</td><td>12,417.0</td><td>+0.5%</td><td>週初の調整後に反発、AI需要期待と高バリュエーションが綱引き</td></tr>
                </tbody>
              </table>
            </div>
            <p className="source-note">
              日経平均は<a href="https://indexes.nikkei.co.jp/nkave/archives/data?list=daily" target="_blank" rel="noreferrer">日経平均公式ヒストリカルデータ（8月14日更新）</a>、米主要指数の14日終値と週間騰落率は<a href="https://apnews.com/article/41b7cf2acc6562758183b1c5eae73635" target="_blank" rel="noreferrer">AP（8月14日）</a>で確認しました。SOXは<a href="https://www.investing.com/indices/phlx-semiconductor-historical-data" target="_blank" rel="noreferrer">PHLX Semiconductor Index履歴データ（8月14日）</a>の8月7日12,356.8と8月14日12,417.0から算出しています。米国ハイテク指数にはNASDAQ総合を採用しています。
            </p>
          </section>

          <section>
            <h2>日本株の主なニュースと要因</h2>
            <ul>
              <li><strong>日経平均は週間4.7%高：</strong>8月10日の66,970.22から12日67,524.06、13日68,308.59、14日68,713.80へ上昇しました。11日は休場で営業日は4日でした。指数水準は<a href="https://indexes.nikkei.co.jp/nkave/archives/data?list=daily" target="_blank" rel="noreferrer">日経平均公式（8月14日）</a>で確認しています。</li>
              <li><strong>日銀の追加利上げ観測が強まる：</strong>Reutersは14日、日銀が9月17〜18日の会合で追加利上げを検討し得ると報道しました。6月に政策金利を1%へ引き上げた後も、物価圧力と円安への警戒が続いています。<a href="https://www.reuters.com/world/asia-pacific/boj-eyeing-september-rate-hike-faster-pace-tightening-sources-say-2026-08-14/" target="_blank" rel="noreferrer">Reuters（8月14日）</a></li>
              <li><strong>企業物価は高止まり：</strong>7月の企業物価指数は前年比7.2%上昇。非鉄金属は前年比40.6%高、円ベースの輸入物価も29.1%上昇し、原材料高と円安によるコスト圧力が続きました。<a href="https://www.reuters.com/world/asia-pacific/japans-wholesale-inflation-spikes-july-bolsters-rate-hike-chance-2026-08-13/" target="_blank" rel="noreferrer">Reuters（8月13日）</a></li>
              <li><strong>円相場は依然として株価の重要変数：</strong>週後半もドル円は160円近辺が意識され、米10年債利回りと日本国債利回りの差がキャリートレードを支える一方、日銀の利上げ観測は円高要因となりました。<a href="https://www.reuters.com/world/china/global-markets-view-europe-2026-08-14/" target="_blank" rel="noreferrer">Reuters（8月14日）</a></li>
            </ul>
          </section>

          <section>
            <h2>米国株の主なニュースと要因</h2>
            <ul>
              <li><strong>CPIはインフレ鈍化を示唆：</strong>7月CPIは前月比0.1%、前年比3.4%、コアCPIは前月比0.2%、前年比2.5%。市場予想におおむね沿い、9月FOMCでの追加利上げを急ぐ必要性が薄れたとの受け止めにつながりました。<a href="https://www.reuters.com/business/view-market-shrugs-off-in-line-july-cpi-report-2026-08-12/" target="_blank" rel="noreferrer">Reuters（8月12日）</a></li>
              <li><strong>PPIも落ち着く：</strong>7月PPIは前月比横ばい、前年比4.7%と、6月の前年比5.5%から鈍化しました。Fedの政策金利は3.50〜3.75%で、9月会合の利上げ確率は週後半に低下しました。<a href="https://www.reuters.com/business/us-producer-prices-unchanged-july-2026-08-13/" target="_blank" rel="noreferrer">Reuters（8月13日）</a></li>
              <li><strong>小売売上高は予想外の減少：</strong>7月小売売上高は前月比0.6%減と9カ月ぶりに減少し、GDP算定に近いコア売上高も0.4%減でした。インフレ鈍化にはプラスでも、消費・景気の減速という別のリスクを意識させました。<a href="https://www.reuters.com/business/us-retail-sales-unexpectedly-fall-july-2026-08-14/" target="_blank" rel="noreferrer">Reuters（8月14日）</a></li>
              <li><strong>Applied Materialsは好決算でも下落：</strong>第3四半期売上高は前年比25%増の91.2億ドル、次四半期売上高見通しも市場予想を上回りましたが、株価は14日に5%超下落しました。AI設備投資の強さと同時に、高い期待をさらに上回る必要がある現在の半導体株の難しさを示しています。<a href="https://www.reuters.com/business/applied-materials-forecasts-quarterly-revenue-above-estimates-2026-08-13/" target="_blank" rel="noreferrer">Reuters（8月13日）</a></li>
            </ul>
          </section>

          <section>
            <h2>市場関係者の見方</h2>
            <ul className="viewpoints">
              <li><strong>強気：</strong>Reutersの週末展望では、決算発表済み企業の約85%が市場予想を上回り、AIインフラ関連を中心とする企業利益がマクロ不安を相殺するとの見方が紹介されています。大手テックのAI設備投資は今年7,000億ドルを超える見込みとされ、利益成長が続く限り株価の支えになるとの評価です。<a href="https://www.reuters.com/legal/transactional/wall-st-week-ahead-with-fed-mum-next-move-investors-look-earnings-keep-stocks-2026-08-14/" target="_blank" rel="noreferrer">Reuters（8月14日）</a></li>
              <li><strong>中立・慎重：</strong>Richmond連銀のThomas Barkin総裁は、現行金利が十分に引き締め的で、足元のインフレ上昇には関税・原油・AI投資など一時的要因が含まれる可能性を示しました。一方、Cleveland連銀のBeth Hammack総裁はインフレ目標への信認を重視し、早期利上げを支持しています。Fed内部でも判断が割れています。<a href="https://www.reuters.com/business/cooler-inflation-data-may-force-warshs-divided-fed-hold-line-rates-2026-08-14/" target="_blank" rel="noreferrer">Reuters（8月14日）</a></li>
              <li><strong>弱気・リスク警戒：</strong>米株は高値圏にある一方、S&P500の予想PERは約20倍まで上昇しています。14日は弱い小売売上高と中東情勢を受けて主要指数が下落し、Applied MaterialsなどAI関連株にも利益確定が出ました。利益成長が期待を下回る場合、高バリュエーションが調整幅を大きくするリスクがあります。<a href="https://www.reuters.com/business/wall-st-futures-muted-higher-oil-prices-temper-risk-appetite-after-sp-record-2026-08-14/" target="_blank" rel="noreferrer">Reuters（8月14日）</a></li>
            </ul>
          </section>

          <section>
            <h2>相場環境：金利・為替・原油・債券・リスク選好</h2>
            <p><strong>米金利・債券：</strong>米10年債利回りは週末時点で4.7%近辺。CPI・PPIの落ち着きと弱い小売売上高は短期的な利上げ観測を後退させましたが、今週の10年・30年国債入札は長期金利の高さと財政・インフレへの警戒を映しました。Reutersによると30年債入札利回りは25年ぶりの高水準でした。<a href="https://www.reuters.com/podcasts/reuters-morning-bid/hot-yields-cool-prices-2026-08-14/" target="_blank" rel="noreferrer">Reuters（8月14日）</a></p>
            <p><strong>為替：</strong>ドル円は160円近辺が再び焦点です。米国の利上げ観測後退はドル安要因ですが、日米金利差は依然大きく、円の持続的な上昇には日銀の政策正常化ペースも重要です。<a href="https://www.reuters.com/world/china/global-markets-view-europe-2026-08-14/" target="_blank" rel="noreferrer">Reuters（8月14日）</a></p>
            <p><strong>原油：</strong>14日のWTIは82.40ドル、Brentは88.60ドル近辺まで上昇しました。米・イラン協議の停滞やホルムズ海峡を巡る供給不安が再び価格を押し上げ、インフレ鈍化を相殺し得るリスクとなっています。<a href="https://www.reuters.com/world/china/global-markets-wrapup-1-2026-08-14/" target="_blank" rel="noreferrer">Reuters（8月14日）</a></p>
            <p><strong>リスク選好：</strong>VIXは14台と低水準で、米国株全体のリスク選好はなお崩れていません。ただし、株価高・低VIXと、長期金利・原油・地政学リスクの高さが同居しており、相場の安定を当然視しにくい環境です。</p>
          </section>

          <section>
            <h2>翌週の注目点</h2>
            <ul>
              <li><strong>日本の4〜6月期GDP：</strong>1次速報は8月17日8時50分に公表予定です。内閣府の公式日程で確認できます。Reutersは年率2%程度の成長が見込まれるとの市場観測を紹介しており、個人消費・設備投資の中身が日銀の9月利上げ観測に影響します。<a href="https://www.esri.cao.go.jp/en/sna/data/sokuhou/files/2025/qe254/pdf/gaiyou2541_e.pdf" target="_blank" rel="noreferrer">内閣府 公表日程</a></li>
              <li><strong>日本の7月CPI：</strong>8月21日に2025年基準で初の月次CPIが公表されます。Reuters調査ではコアCPIは前年比1.8%への加速予想。企業物価の高さが消費者物価へどこまで波及するかが焦点です。<a href="https://www.stat.go.jp/english/data/cpi/" target="_blank" rel="noreferrer">総務省統計局</a> / <a href="https://www.reuters.com/world/asia-pacific/japans-july-core-inflation-seen-18-higher-energy-costs-2026-08-14/" target="_blank" rel="noreferrer">Reuters（8月14日）</a></li>
              <li><strong>米消費関連企業の決算：</strong>WalmartやHome Depotなどの決算は、7月小売売上高が弱かった後だけに、米消費の実態を確認する材料になります。<a href="https://www.reuters.com/business/take-five/global-markets-themes-graphic-2026-08-14/" target="_blank" rel="noreferrer">Reuters（8月14日）</a></li>
              <li><strong>FOMC議事要旨と米経済指標：</strong>7月FOMC議事要旨に加え、住宅着工、鉱工業生産、PMIなどが予定されています。インフレ鈍化と景気減速のどちらをFedがより重く見るかを確認します。</li>
              <li><strong>原油と中東情勢：</strong>Brentが90ドル近辺へ再上昇しており、供給不安が強まれば、インフレ期待→長期金利上昇→高PER株のバリュエーション調整という経路に注意が必要です。</li>
            </ul>
          </section>

          <section>
            <h2>今週の整理</h2>
            <p>
              今週は「物価が落ち着けば株高」という単純な構図ではありませんでした。米CPIとPPIはFedの追加利上げ圧力を弱めましたが、長期国債利回りは高く、原油も再び上昇しています。さらに、小売売上高の弱さは金利低下にはプラスでも、企業利益にとっては景気減速というマイナス要因です。
            </p>
            <p>
              日本株では、日経平均が大きく上昇する一方、日銀の9月利上げ観測と円相場が新たな変数になっています。米国株ではAI投資の強さが続く一方、Applied Materialsの株価反応が示すように「好業績」と「株価上昇」が必ずしも同義ではありません。翌週は、日本のGDP・CPI、米消費企業の決算、FOMC議事要旨、原油を組み合わせて確認する局面です。
            </p>
          </section>

          <section>
            <h2>主な出典</h2>
            <ul>
              <li><a href="https://indexes.nikkei.co.jp/nkave/archives/data?list=daily" target="_blank" rel="noreferrer">日経平均プロフィル — ヒストリカルデータ（2026年8月14日更新）</a></li>
              <li><a href="https://apnews.com/article/41b7cf2acc6562758183b1c5eae73635" target="_blank" rel="noreferrer">AP — How major US stock indexes fared Friday 8/14/2026（2026年8月14日）</a></li>
              <li><a href="https://www.reuters.com/business/view-market-shrugs-off-in-line-july-cpi-report-2026-08-12/" target="_blank" rel="noreferrer">Reuters — July CPI（2026年8月12日）</a></li>
              <li><a href="https://www.reuters.com/business/us-producer-prices-unchanged-july-2026-08-13/" target="_blank" rel="noreferrer">Reuters — July PPI（2026年8月13日）</a></li>
              <li><a href="https://www.reuters.com/business/us-retail-sales-unexpectedly-fall-july-2026-08-14/" target="_blank" rel="noreferrer">Reuters — July retail sales（2026年8月14日）</a></li>
              <li><a href="https://www.reuters.com/world/asia-pacific/boj-eyeing-september-rate-hike-faster-pace-tightening-sources-say-2026-08-14/" target="_blank" rel="noreferrer">Reuters — BOJ policy outlook（2026年8月14日）</a></li>
              <li><a href="https://www.reuters.com/world/asia-pacific/japans-wholesale-inflation-spikes-july-bolsters-rate-hike-chance-2026-08-13/" target="_blank" rel="noreferrer">Reuters — Japan wholesale inflation（2026年8月13日）</a></li>
              <li><a href="https://www.reuters.com/business/applied-materials-forecasts-quarterly-revenue-above-estimates-2026-08-13/" target="_blank" rel="noreferrer">Reuters — Applied Materials earnings（2026年8月13日）</a></li>
              <li><a href="https://www.reuters.com/legal/transactional/wall-st-week-ahead-with-fed-mum-next-move-investors-look-earnings-keep-stocks-2026-08-14/" target="_blank" rel="noreferrer">Reuters — Wall St Week Ahead（2026年8月14日）</a></li>
            </ul>
          </section>

          <p className="disclaimer">
            これは投資助言ではなく、2026年8月15日時点の公開情報に基づく市場概況の整理です。記載した指数・価格・市場見通しは将来の市場動向や投資成果を保証するものではありません。市場変動の要因は複数存在するため、単一のニュースや指標だけで値動きを断定していません。投資判断は各自の資産状況、投資目的、リスク許容度を踏まえて行ってください。
          </p>
        </div>
      </article>
    </main>
  );
}
