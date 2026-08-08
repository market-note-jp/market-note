import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "デイリー・マーケットブリーフィング（2026年8月5日） | Market Note",
  description: "米国株、AMD、Palantir、半導体、原油・金利、米求人を整理した2026年8月5日のマーケットブリーフィング。",
};

export default function DailyReportAugust5() {
  return (
    <main className="article-page">
      <Link className="back-link" href="/">← 記事一覧へ戻る</Link>
      <article>
        <header className="report-header">
          <p className="report-label">DAILY MARKET BRIEFING</p>
          <h1>デイリー・マーケットブリーフィング</h1>
          <p className="report-date">2026年8月5日（水）</p>
        </header>

        <div className="report-body">
          <section>
            <h2>今日の結論</h2>
            <p>本稿は8月5日7時（日本時間）までに確認できた公開情報を整理したものだ。米国市場は4日、企業利益の強さと原油安を背景に主要株価指数がそろって上昇し、S&amp;P500とダウ平均は最高値を更新した。</p>
            <p>AI・半導体ではAMDとPalantirの決算が、データセンター投資が売上・利益へ転換されているかを見極める材料となった。一方で、原油、長期金利、米雇用関連指標の変化は、高バリュエーション株の評価を左右し続ける。</p>
          </section>

          <section>
            <h2>市場スナップショット</h2>
            <div className="table-wrap"><table><thead><tr><th>対象</th><th>確認できた値</th><th>確認日</th></tr></thead><tbody>
              <tr><td>S&amp;P500</td><td>7,736.52（+1.8%）</td><td>8月4日・米国終値</td></tr>
              <tr><td>ダウ平均</td><td>54,085.88（+907.47）</td><td>8月4日・米国終値</td></tr>
              <tr><td>NASDAQ総合</td><td>26,584.99（+2.6%）</td><td>8月4日・米国終値</td></tr>
              <tr><td>ブレント原油</td><td>79.36ドル（-5.3%）</td><td>8月4日</td></tr>
              <tr><td>日経平均</td><td>63,957.53</td><td>8月4日・東京終値</td></tr>
            </tbody></table></div>
            <p className="inline-sources"><a href="https://apnews.com/article/stocks-markets-dollar-yen-trump-iran-war-fbbe6128d618509e33d45a493c2615b1" target="_blank" rel="noreferrer">AP・米国市場（2026年8月4日）</a><a href="https://indexes.nikkei.co.jp/nkave/archives/data/" target="_blank" rel="noreferrer">日経平均プロフィル・ヒストリカルデータ（2026年8月4日終値）</a></p>
          </section>

          <section>
            <h2>1．米国株は最高値更新――企業利益と原油安が追い風</h2>
            <p>8月4日の米国市場でS&amp;P500は1.8%高の7,736.52、ダウ平均は907.47ドル高の54,085.88、NASDAQ総合は2.6%高の26,584.99で終えた。APは、企業決算の強さと原油価格の下落が投資家心理を支えたと報じた。</p>
            <p>指数の上昇は好材料だが、利益成長が株価上昇をどこまで支えられるかは、決算の内容と今後の見通しに左右される。指数だけでなく、上昇が一部の大型株に偏っていないかを確認したい。</p>
            <p className="inline-sources"><a href="https://apnews.com/article/stocks-markets-dollar-yen-trump-iran-war-fbbe6128d618509e33d45a493c2615b1" target="_blank" rel="noreferrer">AP・市場概況（2026年8月4日）</a></p>
            <h3>株価・市場への影響</h3><p>長期金利と原油が同時に低下する局面では、成長株、消費、輸送などに追い風が及びやすい。日本株では米国株高が半導体関連やグロース株の支援材料になり得る。</p>
            <h3>次の注目点</h3><ul><li>最高値更新後に利益確定売りが広がるか</li><li>決算後の通期見通しが上向くか</li><li>米長期金利の低下が続くか</li></ul>
          </section>

          <section>
            <h2>2．AMD、データセンターが成長を主導――AI需要を売上で確認</h2>
            <p>AMDが8月4日に公表した2026年4〜6月期の売上高は前年同期比50%増の115億ドル、データセンター部門の売上高は同107%増の67億ドルだった。7〜9月期の売上高は約130億ドル（前後3億ドル）を見込む。</p>
            <p>AIアクセラレーターとサーバーCPUへの需要が数字に表れた一方、ゲーム部門売上は31%減だった。AI関連とそれ以外の需要を一括りにせず、事業別の伸びと利益率を確認することが重要になる。</p>
            <p className="inline-sources"><a href="https://ir.amd.com/news-events/press-releases/detail/1295/amd-reports-second-quarter-2026-financial-results" target="_blank" rel="noreferrer">AMD・2026年第2四半期決算（2026年8月4日）</a></p>
            <h3>株価・市場への影響</h3><p>米国でのデータセンター投資の実需確認は、日本の製造装置、検査、電子部品、メモリー関連への期待を支える材料になり得る。ただし、受注、在庫、利益率まで確認して初めて持続性を判断できる。</p>
            <h3>次の注目点</h3><ul><li>7〜9月期130億ドル見通しの実現性</li><li>データセンター成長と粗利益率の両立</li><li>米半導体株高が東京市場へ波及するか</li></ul>
          </section>

          <section>
            <h2>3．Palantirの好決算――AIソフトウェアの収益化が焦点</h2>
            <p>APによると、Palantirは売上高が93%増となる決算を発表し、2026年通期の売上高見通しを引き上げた。株価は29.5%上昇し、AIソフトウェアでの契約・売上の拡大が市場から評価された。</p>
            <p>AI投資の評価は、半導体やデータセンターの設備投資額だけではない。顧客企業が実際にソフトウェアを導入し、売上高と利益に結びつけられるかが、関連銘柄の選別に影響する。</p>
            <p className="inline-sources"><a href="https://apnews.com/article/stocks-markets-dollar-yen-trump-iran-war-fbbe6128d618509e33d45a493c2615b1" target="_blank" rel="noreferrer">AP・Palantirと米企業決算（2026年8月4日）</a></p>
            <h3>株価・市場への影響</h3><p>AIを使う企業側の売上拡大が続けば、ソフトウェア、クラウド、サイバーセキュリティまで評価対象が広がり得る。一方、高い成長期待が織り込まれた銘柄は、好決算でも値動きが大きくなりやすい。</p>
            <h3>次の注目点</h3><ul><li>契約残高と顧客数の拡大</li><li>売上成長が利益率へ転換するか</li><li>好決算後の株価が上昇を維持できるか</li></ul>
          </section>

          <section>
            <h2>4．原油安と長期金利低下――インフレ懸念はいったん後退</h2>
            <p>ブレント原油は5.3%下落して1バレル79.36ドルとなり、米10年債利回りは4.70%から4.62%へ低下した。原油を巡る供給不安が和らぐとの見方が、インフレと資金調達コストへの警戒を一時的に弱めた。</p>
            <p>ただし、原油相場はホルムズ海峡を巡る報道に左右されやすく、値動きの大きさそのものがリスクである。原油安を恒常的な物価鈍化と同一視しないことが必要だ。</p>
            <p className="inline-sources"><a href="https://apnews.com/article/stocks-markets-dollar-yen-trump-iran-war-fbbe6128d618509e33d45a493c2615b1" target="_blank" rel="noreferrer">AP・原油と米国債利回り（2026年8月4日）</a></p>
            <h3>株価・市場への影響</h3><p>原油安と利回り低下は高PER株や燃料コスト負担の大きい業種には追い風になりやすい。反対にエネルギー株は収益見通しの変動に注意が必要となる。</p>
            <h3>次の注目点</h3><ul><li>原油価格が80ドル前後で落ち着くか</li><li>10年債利回りが再上昇しないか</li><li>期待インフレが再び上向かないか</li></ul>
          </section>

          <section>
            <h2>5．米求人は約740万件――雇用の減速度合いを見極め</h2>
            <p>APが伝えた6月末の米求人件数は約740万件で、5月からは小幅に減少した。水準は市場予想におおむね沿ったものの、雇用関連指標は金融政策と景気の両方を読むうえで重要性を増している。</p>
            <p>求人の減少だけでは景気後退を示さないが、採用、失業保険申請、雇用統計、賃金が同じ方向を示すかを続けて確認する必要がある。</p>
            <p className="inline-sources"><a href="https://apnews.com/article/stocks-markets-dollar-yen-trump-iran-war-fbbe6128d618509e33d45a493c2615b1" target="_blank" rel="noreferrer">AP・米求人統計（2026年8月4日）</a></p>
            <h3>株価・市場への影響</h3><p>雇用の適度な減速は金利低下期待を支え得るが、急速な悪化は企業業績と消費への懸念につながる。市場が金利低下を好感する段階から、景気を警戒する段階へ移るかが分岐点になる。</p>
            <h3>次の注目点</h3><ul><li>新規失業保険申請件数</li><li>7月雇用統計の雇用者数・失業率・賃金</li><li>雇用鈍化とインフレの組み合わせ</li></ul>
          </section>

          <section><h2>今日の優先チェック項目</h2><ol><li><strong>米国株の最高値更新が幅広い銘柄へ波及するか</strong></li><li><strong>AMD・Palantirの成長が受注と利益率で続くか</strong></li><li><strong>原油・米長期金利の低下が持続するか</strong></li><li><strong>日経平均で半導体関連への資金流入が続くか</strong></li><li><strong>雇用関連指標が景気減速を示し始めないか</strong></li></ol></section>
          <section><h2>現時点の見方</h2><p>米国株の上昇は企業利益と原油安に支えられたが、AI関連では売上・利益に結びつく企業と、投資期待が先行する企業の差が拡大しやすい。指数の強さだけでなく、決算後の見通しと金利の反応を併せて見たい。</p></section>
          <p className="disclaimer">これは投資助言ではなく、2026年8月5日7時（日本時間）までに確認できた公開情報に基づく市場概況の整理です。掲載内容は将来の市場動向や投資成果を保証するものではありません。</p>
        </div>
      </article>
    </main>
  );
}
