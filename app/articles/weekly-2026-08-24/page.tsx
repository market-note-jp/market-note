import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "週次マーケットニュースレポート（2026年8月24日〜28日） | Market Note",
  description: "日本株・米国株・日経平均・ダウ平均・NASDAQ総合・SOX指数をまとめた週次マーケットニュースレポート。",
};

export default function WeeklyReportAugust24() {
  return (
    <main className="article-page">
      <Link className="back-link" href="/">← 記事一覧へ戻る</Link>
      <article>
        <header className="report-header">
          <p className="report-label">WEEKLY MARKET REPORT</p>
          <h1>週次マーケットニュースレポート（2026年8月24日〜28日）</h1>
          <p className="report-date">公開日：2026年8月29日</p>
        </header>

        <div className="report-body">
          <section>
            <h2>今週の要約</h2>
            <p>今週は、NVIDIAの強い決算・長期売上高見通しがAI投資サイクルへの不安を和らげた一方、Federal Reserve（FRB）のKevin Warsh議長がJackson Holeでインフレ抑制を優先する姿勢を改めて示し、9月利上げ観測が再び強まるという、企業業績と金融政策の綱引きになりました。</p>
            <p>米国株は週間では小幅高でした。ダウ平均は0.53%高、NASDAQ総合は0.85%高。一方、PHLX半導体指数（SOX）はNVIDIA決算後に急反発したものの、週初の下落と金曜の反落を吸収できず、週間では約2.18%安でした。日本株は日経平均が前週末の66,016.36から28日の66,405.56へ上昇し、週間約0.59%高となりました。</p>
            <p>マクロ面では、米7月PCE価格指数が前年比3.7%、コアPCEが3.3%とFRBの2%目標を上回る状態が継続。Warsh議長の発言後、9月利上げ確率は約6割へ上昇しました。日本では8月の東京都区部コアCPIが前年比1.8%に加速し、日銀の9月利上げ観測が一段と強まっています。</p>
          </section>

          <section>
            <h2>主要指数の週間変動</h2>
            <div className="table-wrap">
              <table className="report-table">
                <thead><tr><th>指数</th><th>8月28日終値</th><th>週間騰落率</th><th>主な材料</th></tr></thead>
                <tbody>
                  <tr><td>日経平均</td><td>66,405.56</td><td>約+0.59%</td><td>NVIDIA後の半導体株買い、円安。日銀利上げ観測が上値を抑制</td></tr>
                  <tr><td>ダウ平均</td><td>53,559.99</td><td>+0.53%</td><td>企業決算の底堅さと原油安。Warsh発言後は金利上昇が重石</td></tr>
                  <tr><td>NASDAQ総合</td><td>26,402.42</td><td>+0.85%</td><td>NVIDIA・ソフトウェア株高。週末は利上げ観測再燃で反落</td></tr>
                  <tr><td>SOX指数</td><td>11,483.9</td><td>約-2.18%</td><td>NVIDIA決算後は急反発したが、週初安と金曜の半導体売りが残る</td></tr>
                </tbody>
              </table>
            </div>
            <p className="source-note">米国株は<a href="https://apnews.com/article/3f3477bcea915ac53ec2ae905ae57919" target="_blank" rel="noreferrer">AP（2026年8月28日）</a>および<a href="https://www.reuters.com/business/sp-500-nasdaq-futures-slip-after-tech-rally-warshs-speech-awaited-2026-08-28/" target="_blank" rel="noreferrer">Reuters（8月28日）</a>で終値・週間騰落率を確認。SOXは<a href="https://www.investing.com/indices/phlx-semiconductor-historical-data" target="_blank" rel="noreferrer">PHLX Semiconductor Index履歴データ（8月28日）</a>の8月21日11,740.4と28日11,483.9から算出。日経平均は8月21日66,016.36と28日66,405.56から算出しています。米国ハイテク指数にはNASDAQ総合を採用しています。</p>
          </section>

          <section>
            <h2>日本株の主なニュースと要因</h2>
            <ul>
              <li><strong>日経平均は週間で小幅上昇：</strong>週前半はAI・半導体株への警戒で軟調でしたが、NVIDIAの決算と強い長期売上高見通しを受けて、東京エレクトロンやアドバンテストなど半導体関連に買い戻しが入りました。28日は日経平均が0.41%高の66,405.56、TOPIXは0.72%高の4,146.71で終了しました。</li>
              <li><strong>日銀の9月利上げ観測が強まる：</strong>Reutersのエコノミスト調査では、日銀が9月に政策金利を1.25%へ引き上げるとの予想が中心となりました。円安と中東情勢を通じたインフレ圧力が背景です。<a href="https://www.reuters.com/world/asia-pacific/boj-speed-up-its-tightening-campaign-raise-key-rate-125-september-2026-08-25/" target="_blank" rel="noreferrer">Reuters（8月25日）</a></li>
              <li><strong>東京都区部コアCPIは1.8%：</strong>8月の東京都区部コアCPIは前年比1.8%と7月の1.7%から加速。生鮮食品と燃料を除く指数は2.0%となり、日銀が重視する基調的なインフレが2%近辺へ戻っています。<a href="https://www.reuters.com/world/asia-pacific/tokyo-core-inflation-accelerates-august-nears-boj-target-2026-08-27/" target="_blank" rel="noreferrer">Reuters（8月28日公表分）</a></li>
              <li><strong>円買い介入は過去最大規模：</strong>財務省によると、7月30日〜8月26日の為替介入額は15.4兆円と過去最大。にもかかわらずドル円は28日に159.60円付近まで戻り、金融政策を伴わない介入だけでは円安圧力を抑えにくいとの見方が残りました。<a href="https://www.reuters.com/world/asia-pacific/japan-spent-record-965-billion-support-yen-over-past-month-ministry-data-shows-2026-08-28/" target="_blank" rel="noreferrer">Reuters（8月28日）</a></li>
              <li><strong>財政・国債需給も焦点：</strong>高市首相はFY2027の新規国債発行を40兆円程度に抑える方針を示した一方、財務省の国債費要求は36.64兆円と過去最高。金利上昇が財政負担を押し上げる構図が鮮明です。<a href="https://www.reuters.com/world/asia-pacific/japan-aims-cap-fy27-new-bond-issuance-40-trillion-yen-pm-says-yomiuri-interview-2026-08-28/" target="_blank" rel="noreferrer">Reuters（8月28日）</a></li>
            </ul>
          </section>

          <section>
            <h2>米国株の主なニュースと要因</h2>
            <ul>
              <li><strong>NVIDIAがAI投資サイクルへの懸念を和らげる：</strong>NVIDIAは第2四半期売上高96.22億ドルではなく<strong>962.2億ドル</strong>を記録し、前年同期比で2倍超。さらに翌年度売上高が約70%増加する見通しを示し、AIインフラ需要が数年単位で続くとの見方を強めました。<a href="https://www.reuters.com/business/media-telecom/nvidia-forecasts-quarterly-revenue-above-estimates-2026-08-26/" target="_blank" rel="noreferrer">Reuters（8月26日）</a></li>
              <li><strong>NVIDIA決算後に半導体株が急反発：</strong>27日はNVIDIAが6.8%上昇し、Intel、Micron、Broadcomなどにも買いが波及しました。少なくとも16社の証券会社がNVIDIAの目標株価を引き上げています。<a href="https://www.reuters.com/business/nvidia-rises-after-signaling-longer-ai-spending-runway-2026-08-27/" target="_blank" rel="noreferrer">Reuters（8月27日）</a></li>
              <li><strong>ただしAI株内の選別は継続：</strong>28日はNVIDIAが4.6%安、Marvellが10.3%安。AI需要全体への期待は残る一方、個別企業の売上計上時期、利益率、資金調達構造などに対する要求水準は高まっています。<a href="https://www.reuters.com/business/sp-500-nasdaq-futures-slip-after-tech-rally-warshs-speech-awaited-2026-08-28/" target="_blank" rel="noreferrer">Reuters（8月28日）</a></li>
              <li><strong>米Q2 GDPは年率1.5%増：</strong>BEAの第2次推計では4〜6月期実質GDPは年率1.5%増で、1〜3月期の2.1%から減速しました。個人消費、輸出、設備投資は増加した一方、政府支出が減少しました。<a href="https://www.bea.gov/news/2026/gdp-second-estimate-and-corporate-profits-2nd-quarter-2026" target="_blank" rel="noreferrer">米商務省BEA（8月26日）</a></li>
              <li><strong>PCEインフレは依然高い：</strong>7月PCE価格指数は前年比3.7%、コアPCEは3.3%。前月比ではともに0.2%上昇しました。物価が2%目標を明確に上回る状態が続き、金融緩和期待を抑えています。<a href="https://www.bea.gov/news/2026/personal-income-and-outlays-july-2026" target="_blank" rel="noreferrer">米商務省BEA（8月26日）</a></li>
            </ul>
          </section>

          <section>
            <h2>市場関係者の見方</h2>
            <ul className="viewpoints">
              <li><strong>強気：</strong>NVIDIA決算後、少なくとも16社の証券会社が目標株価を引き上げました。JPMorgan、Bernstein、Morgan StanleyなどはAIコンピュート需要の持続性とRubin世代への移行を評価しており、AI設備投資が一過性ではないとの見方が強まっています。<a href="https://www.reuters.com/business/nvidia-rises-after-signaling-longer-ai-spending-runway-2026-08-27/" target="_blank" rel="noreferrer">Reuters（8月27日）</a></li>
              <li><strong>中立・慎重：</strong>Triple D TradingのDennis Dick氏はWarsh議長の発言について、9月利上げを明確に示したわけではなく「50対50」に近いと評価。景気・雇用が崩れていない一方、インフレも完全には抑制されておらず、据え置き余地も残るとみています。<a href="https://www.reuters.com/business/view-rate-hike-expectations-rise-warsh-speech-jackson-hole-2026-08-28/" target="_blank" rel="noreferrer">Reuters（8月28日）</a></li>
              <li><strong>弱気・リスク警戒：</strong>Wells Fargo Investment InstituteのGary Schlossberg氏は、インフレ圧力は今後6〜8カ月でむしろ強まる可能性があり、少なくとも1回の追加利上げが必要になるとの見方を示しました。高PER成長株にとっては金利再上昇がバリュエーション圧縮要因です。<a href="https://www.reuters.com/business/view-rate-hike-expectations-rise-warsh-speech-jackson-hole-2026-08-28/" target="_blank" rel="noreferrer">Reuters（8月28日）</a></li>
            </ul>
          </section>

          <section>
            <h2>相場環境：金利・為替・原油・債券・リスク選好</h2>
            <p><strong>米金利・債券：</strong>Warsh議長の発言後、米2年債利回りは4.34〜4.35%へ上昇し、1カ月ぶりの高水準。10年債利回りは約4.72%、30年債は約5.21%でした。市場が織り込む9月利上げ確率は発言前の約35%から約58〜60%へ上昇しました。<a href="https://www.reuters.com/business/view-rate-hike-expectations-rise-warsh-speech-jackson-hole-2026-08-28/" target="_blank" rel="noreferrer">Reuters（8月28日）</a></p>
            <p><strong>為替：</strong>ドル円は28日に159.60円付近。過去最大規模の円買い介入後も円安圧力が残り、市場は9月の日銀利上げとG20での日米協議を注視しています。<a href="https://www.reuters.com/world/asia-pacific/japans-finance-minister-attend-g20-market-focus-yen-debate-2026-08-28/" target="_blank" rel="noreferrer">Reuters（8月28日）</a></p>
            <p><strong>原油：</strong>Brentは89.31ドル、WTIは83.40ドルで週を終え、週間ではBrentが5%以上、WTIが4%以上下落。ホルムズ海峡の再開に向けた協議への期待が供給不安を和らげました。ただしイラン側は28日時点で海峡を「完全に管理している」と主張しており、地政学リスクは解消していません。<a href="https://www.reuters.com/business/energy/oil-track-weekly-loss-even-iran-tensions-simmer-2026-08-28/" target="_blank" rel="noreferrer">Reuters（8月28日）</a></p>
            <p><strong>リスク選好：</strong>株価指数は週間で小幅高だった一方、8月26日までの週に世界株式ファンドから58.7億ドルが流出し、13週連続の資金流入が途切れました。米国株ファンドからは223.3億ドルが流出しており、指数の底堅さほど投資家心理が一方向に強気とは言い切れません。<a href="https://www.reuters.com/world/china/global-markets-flows-graphic-2026-08-28/" target="_blank" rel="noreferrer">Reuters（8月28日）</a></p>
          </section>

          <section>
            <h2>翌週の注目点</h2>
            <ul>
              <li><strong>9月4日の米雇用統計：</strong>Warsh議長発言で9月利上げ観測が約6割まで上昇したため、8月雇用統計はFOMC判断を大きく左右します。強すぎる雇用は利上げ観測を高め、弱すぎる数字は景気不安を強める可能性があります。<a href="https://www.reuters.com/business/wall-st-week-ahead-jobs-report-broadcom-results-pose-next-hurdles-stock-market-2026-08-28/" target="_blank" rel="noreferrer">Reuters（8月28日）</a></li>
              <li><strong>BroadcomなどAI関連決算：</strong>Broadcom、Dell Technologies、Palo Alto Networksなどの決算が予定されています。NVIDIAが示したAI投資の強さがGPU以外の半導体、ネットワーク、サーバーへ広がっているかが焦点です。</li>
              <li><strong>ISM製造業・サービス業：</strong>景気の粘り強さとインフレ圧力を同時に測る材料。雇用統計と合わせて9月FOMC前の重要データになります。</li>
              <li><strong>G20とドル円：</strong>米国で開催されるG20財務相・中央銀行総裁会議に片山財務相と植田日銀総裁が出席予定。Bessent米財務長官との会談が実現するか、円安と金融政策についてどのようなメッセージが出るかに注目です。<a href="https://www.reuters.com/world/asia-pacific/japans-finance-minister-attend-g20-market-focus-yen-debate-2026-08-28/" target="_blank" rel="noreferrer">Reuters（8月28日）</a></li>
              <li><strong>原油とホルムズ海峡：</strong>原油安は今週の金利・株式市場を支えました。再び供給不安が強まれば、インフレ期待→長期金利上昇→高PER株調整という経路が再燃する可能性があります。</li>
            </ul>
          </section>

          <section>
            <h2>来週を見るうえでの整理</h2>
            <p>今週は「AI需要は強い」という企業業績面の確認と、「インフレはまだ高い」という金融政策面の確認が同時に起きました。NVIDIAの見通しはAI投資サイクルの失速懸念を大きく後退させましたが、FRBが追加利上げへ動けば、その成長期待を評価するための割引率は上昇します。</p>
            <p>したがって来週は、単純な「AI強気」か「金利弱気」ではなく、<strong>企業利益の成長速度が金利上昇によるバリュエーション圧縮を上回れるか</strong>が中心テーマになります。日本株ではこれに加えて、日銀利上げ観測と円相場が指数・セクター選別を左右します。</p>
          </section>

          <section>
            <h2>主な出典</h2>
            <ul>
              <li>Federal Reserve Board, 2026年8月28日 — <a href="https://www.federalreserve.gov/newsevents/speech/warsh20260828a.htm" target="_blank" rel="noreferrer">Keynote remarks by Chairman Warsh at the 2026 Jackson Hole Economic Policy Symposium</a></li>
              <li>U.S. Bureau of Economic Analysis, 2026年8月26日 — <a href="https://www.bea.gov/news/2026/personal-income-and-outlays-july-2026" target="_blank" rel="noreferrer">Personal Income and Outlays, July 2026</a></li>
              <li>U.S. Bureau of Economic Analysis, 2026年8月26日 — <a href="https://www.bea.gov/news/2026/gdp-second-estimate-and-corporate-profits-2nd-quarter-2026" target="_blank" rel="noreferrer">GDP (Second Estimate), 2nd Quarter 2026</a></li>
              <li>Reuters, 2026年8月26日 — <a href="https://www.reuters.com/business/media-telecom/nvidia-forecasts-quarterly-revenue-above-estimates-2026-08-26/" target="_blank" rel="noreferrer">Nvidia forecasts 70% sales growth next year</a></li>
              <li>Reuters, 2026年8月28日 — <a href="https://www.reuters.com/business/sp-500-nasdaq-futures-slip-after-tech-rally-warshs-speech-awaited-2026-08-28/" target="_blank" rel="noreferrer">Wall Street ends lower after Fed Chair Warsh reaffirms inflation fight</a></li>
              <li>Reuters, 2026年8月28日 — <a href="https://www.reuters.com/world/asia-pacific/japan-spent-record-965-billion-support-yen-over-past-month-ministry-data-shows-2026-08-28/" target="_blank" rel="noreferrer">Japan spent record $96.5 billion to support yen</a></li>
              <li>Reuters, 2026年8月28日 — <a href="https://www.reuters.com/business/energy/oil-track-weekly-loss-even-iran-tensions-simmer-2026-08-28/" target="_blank" rel="noreferrer">Oil settles lower on clues about Fed policy, rumors of Hormuz deal</a></li>
              <li>AP, 2026年8月28日 — <a href="https://apnews.com/article/3f3477bcea915ac53ec2ae905ae57919" target="_blank" rel="noreferrer">How major US stock indexes fared Friday 8/28/2026</a></li>
            </ul>
          </section>

          <aside className="disclaimer">
            <strong>注意事項</strong>
            <p>本記事は、公開情報をもとに市場動向を整理することを目的としたものであり、特定の金融商品の購入・売却を推奨する投資助言ではありません。株式・債券・為替・商品等への投資には元本割れを含むリスクがあります。投資判断は各自の資産状況、投資目的、リスク許容度等を踏まえて行ってください。記事内の市場変動要因は複数の報道・市場データに基づく整理であり、一つの要因によって価格変動を断定するものではありません。</p>
          </aside>
        </div>
      </article>
    </main>
  );
}
