import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "デイリー・マーケットブリーフィング（2026年8月13日） | Market Note",
  description:
    "米CPI、米国株、Sony・TSMC、日本企業のAI活用、米PPIを整理した2026年8月13日のマーケットブリーフィング。",
};

export default function DailyReportAugust13() {
  return (
    <main className="article-page">
      <Link className="back-link" href="/">← 記事一覧へ戻る</Link>

      <article>
        <header className="report-header">
          <p className="report-label">DAILY MARKET BRIEFING</p>
          <h1>デイリー・マーケットブリーフィング</h1>
          <p className="report-date">2026年8月13日（木）</p>
        </header>

        <div className="report-body">
          <section>
            <h2>今日の結論</h2>
            <p>
              12日に公表された米7月CPIは前月比0.1%、前年比3.4%と、インフレ再加速への警戒を和らげた。コアCPIも前月比0.2%、前年比2.5%まで鈍化し、弱い雇用統計と合わせて9月の追加利上げ圧力は後退した。
            </p>
            <p>
              株式市場ではS&amp;P500とNASDAQが上昇し、AI関連株の強さが続いた。一方、日本ではSonyとTSMCの大型JVや企業のAI導入余地が材料となっている。次の焦点は今夜の米PPIで、CPIの落ち着きが企業段階の物価にも確認できるかが重要になる。
            </p>
          </section>

          <section>
            <h2>市場スナップショット</h2>
            <div className="table-wrap">
              <table>
                <thead>
                  <tr>
                    <th>対象</th>
                    <th>確認できた値・予定</th>
                    <th>読み方</th>
                  </tr>
                </thead>
                <tbody>
                  <tr><td>米CPI（7月）</td><td>前月比+0.1%、前年比+3.4%</td><td>総合インフレは小幅鈍化</td></tr>
                  <tr><td>米コアCPI（7月）</td><td>前月比+0.2%、前年比+2.5%</td><td>基調的な物価圧力も鈍化</td></tr>
                  <tr><td>S&amp;P500（8月12日）</td><td>7,748.50（+0.3%）</td><td>CPIを好感し反発</td></tr>
                  <tr><td>NASDAQ総合（8月12日）</td><td>26,588.49（+0.5%）</td><td>AI・成長株が相対優位</td></tr>
                  <tr><td>米PPI（7月）</td><td>8月13日 8:30 ET公表予定</td><td>企業段階の物価を確認</td></tr>
                </tbody>
              </table>
            </div>
            <p className="inline-sources">
              <a href="https://www.reuters.com/business/view-market-shrugs-off-in-line-july-cpi-report-2026-08-12/" target="_blank" rel="noreferrer">Reuters・米CPIと市場反応（2026年8月12日）</a>
              <a href="https://apnews.com/article/c2b9200bd737220ef848a37ffea21f95" target="_blank" rel="noreferrer">AP・米主要株価指数（2026年8月12日）</a>
              <a href="https://www.bls.gov/schedule/news_release/ppi.htm" target="_blank" rel="noreferrer">米労働統計局・PPI公表日程（2026年8月13日確認）</a>
            </p>
          </section>

          <section>
            <h2>1．米7月CPIは前年比3.4%――追加利上げ圧力が後退</h2>
            <p>
              7月の米CPIは前月比0.1%、前年比3.4%となり、6月の前年比3.5%から小幅に鈍化した。食品とエネルギーを除くコアCPIは前月比0.2%、前年比2.5%で、基調的な物価圧力も緩やかになった。
            </p>
            <p className="inline-sources"><a href="https://www.reuters.com/business/view-market-shrugs-off-in-line-july-cpi-report-2026-08-12/" target="_blank" rel="noreferrer">Reuters・7月CPI（2026年8月12日）</a></p>
            <h3>株価・市場への影響</h3>
            <p>インフレ上振れリスクが後退したことで米金利は低下しやすく、PERの高いAI・半導体株には追い風となる。ただし、原油高が8月物価へ転嫁される可能性は残る。</p>
            <h3>次の注目点</h3>
            <ul><li>今夜のPPIがCPIと同じ方向に鈍化するか</li><li>米2年債利回りと9月FOMCの利上げ織り込み</li><li>原油高が8月CPIへ波及するか</li></ul>
          </section>

          <section>
            <h2>2．S&amp;P500とNASDAQは反発――AI株が相場を支える</h2>
            <p>
              12日のS&amp;P500は20.30ポイント高の7,748.50、NASDAQ総合は143.04ポイント高の26,588.49。ダウ平均は21.58ドル安の53,770.27だった。インフレ鈍化とAI関連企業の好業績が成長株を支えた。
            </p>
            <p className="inline-sources"><a href="https://apnews.com/article/c2b9200bd737220ef848a37ffea21f95" target="_blank" rel="noreferrer">AP・8月12日の米主要指数（2026年8月12日）</a></p>
            <h3>株価・市場への影響</h3>
            <p>指数全体よりもAI・半導体など利益成長の高い分野へ資金が集まる構図が続く。金利低下が重なると、グロース株の評価倍率がさらに高まりやすい。</p>
            <h3>次の注目点</h3>
            <ul><li>S&amp;P500が前週の最高値を更新できるか</li><li>AI株以外へ上昇が広がるか</li><li>PPI後の長期金利の反応</li></ul>
          </section>

          <section>
            <h2>3．SonyとTSMC、約47億ドルの画像センサーJV――熊本で2029年量産へ</h2>
            <p>
              Sony Group傘下のSony Semiconductor SolutionsとTSMCは、熊本で次世代画像センサーを開発・生産する合弁会社を設立する。Reutersによると総投資額は約46.9億ドルで、Sonyが支配株主となり、2029年の量産開始を目指す。
            </p>
            <p className="inline-sources"><a href="https://www.reuters.com/world/asia-pacific/tsmc-invest-18-bln-joint-venture-with-sony-image-sensors-2026-08-11/" target="_blank" rel="noreferrer">Reuters・SonyとTSMCのJV（2026年8月11日）</a></p>
            <h3>株価・市場への影響</h3>
            <p>日本国内の半導体投資がロジックだけでなく画像センサーへ広がる。製造装置、材料、電力設備、工場インフラなど周辺企業への波及が焦点になる。</p>
            <h3>次の注目点</h3>
            <ul><li>日本政府の支援規模</li><li>設備投資の発注先</li><li>スマホ以外の車載・ロボティクス用途の拡大</li></ul>
          </section>

          <section>
            <h2>4．日本企業の8割超がAIを本格導入せず――投資余地は大きい</h2>
            <p>
              Reutersの企業調査では、日本企業の80%以上がAIを全社的には本格導入していない。全社利用は16%にとどまり、多くは文書作成など限定用途にとどまる。裏返せば、国内のAI導入余地はなお大きい。
            </p>
            <p className="inline-sources"><a href="https://www.reuters.com/world/asia-pacific/strong-majority-japanese-firms-have-yet-fully-embrace-ai-2026-08-12/" target="_blank" rel="noreferrer">Reuters・日本企業のAI活用調査（2026年8月12日）</a></p>
            <h3>株価・市場への影響</h3>
            <p>国内AI投資は、GPUやデータセンターだけでなく、業務ソフト、SI、クラウド、セキュリティへ裾野が広がる可能性がある。</p>
            <h3>次の注目点</h3>
            <ul><li>企業のAI予算の増加率</li><li>国内クラウド・データセンター投資</li><li>AI導入が人件費や生産性に与える効果</li></ul>
          </section>

          <section>
            <h2>5．今夜は米PPI――CPI後の次の金利材料</h2>
            <p>
              米労働統計局は7月PPIを8月13日8時30分（米東部時間）に公表する。CPIが落ち着いた直後だけに、企業段階でも物価圧力が弱まれば、9月FOMCでの追加利上げ観測はさらに後退しやすい。
            </p>
            <p className="inline-sources"><a href="https://www.bls.gov/schedule/news_release/ppi.htm" target="_blank" rel="noreferrer">米労働統計局・PPI公表日程（2026年8月13日確認）</a></p>
            <h3>株価・市場への影響</h3>
            <p>PPI下振れは金利低下を通じて成長株の支援材料、上振れは逆にドル高・金利高・グロース株調整の組み合わせになり得る。</p>
            <h3>次の注目点</h3>
            <ul><li>最終需要PPIの前月比</li><li>サービス価格の粘着性</li><li>PCEへの波及</li></ul>
          </section>

          <p className="disclaimer">
            これは投資助言ではなく、2026年8月13日時点で確認できた公開情報に基づく市場概況の整理です。掲載した数値・見通しは将来の市場動向や投資成果を保証するものではありません。投資判断は、ご自身の目的、資金状況、リスク許容度を踏まえて行ってください。
          </p>
        </div>
      </article>
    </main>
  );
}
