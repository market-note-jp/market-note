import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "週次マーケットニュースレポート（2026年8月3日〜7日） | Market Note",
  description: "日本株・米国株・日経平均・ダウ平均・NASDAQ総合・SOX指数をまとめた週次マーケットニュースレポート。",
};

export default function WeeklyReportAugust3() {
  return (
    <main className="article-page">
      <Link className="back-link" href="/">← 記事一覧へ戻る</Link>

      <article>
        <header className="report-header">
          <p className="report-label">WEEKLY MARKET REPORT</p>
          <h1>週次マーケットニュースレポート（2026年8月3日〜7日）</h1>
          <p className="report-date">公開日：2026年8月8日</p>
        </header>

        <div className="report-body">
          <section>
            <h2>今週の要約</h2>
            <p>
              米国株は、原油価格の下落でインフレ再加速への警戒がいったん和らぐなか、雇用統計を受けた金利観測の変化も支えとなり、主要指数がそろって上昇しました。NASDAQ総合とSOX指数は大型テック・半導体の買い戻しを受けて強く、週末にはNASDAQ総合が26,690.62、SOXが12,356.79で終えました。
            </p>
            <p>
              日本株は、円高方向への変動という輸出株には逆風となり得る材料を抱えながらも、米国の半導体株高を追い風に日経平均が週末比で上昇しました。週の途中には66,000円台を回復する場面もあり、決算と為替前提の差による選別が続きました。
            </p>
          </section>

          <section>
            <h2>主要指数の週間変動</h2>
            <div className="table-wrap">
              <table className="report-table">
                <thead>
                  <tr><th>指数</th><th>8月7日終値</th><th>週間騰落率</th><th>主な材料</th></tr>
                </thead>
                <tbody>
                  <tr><td>日経平均</td><td>65,606.71</td><td>+1.9%</td><td>米半導体株高、円相場、国内企業決算</td></tr>
                  <tr><td>ダウ平均</td><td>54,036.93</td><td>+3.0%</td><td>原油安、金利低下、景気敏感株を含む買い</td></tr>
                  <tr><td>NASDAQ総合</td><td>26,690.62</td><td>+5.2%</td><td>大型テック・半導体株の上昇</td></tr>
                  <tr><td>SOX指数</td><td>12,356.79</td><td>+9.2%</td><td>半導体株の強い反発とAI需要への期待</td></tr>
                </tbody>
              </table>
            </div>
            <p className="source-note">
              日経平均とSOXの週間騰落率は7月31日終値と8月7日終値から算出、ダウ平均・NASDAQ総合の週間騰落率は<a href="https://apnews.com/article/9d586bdbf1fb230dcf1f915dcaf50858" target="_blank" rel="noreferrer">APの週次集計（8月7日）</a>を使用しています。終値系列は<a href="https://finance.yahoo.com/quote/%5EN225/history/" target="_blank" rel="noreferrer">日経平均</a>、<a href="https://finance.yahoo.com/quote/%5ESOX/history/" target="_blank" rel="noreferrer">SOX</a>の履歴データで照合しました。日経平均の8月3日・4日値は<a href="https://indexes.nikkei.co.jp/nkave/archives/data?list=annually%3B" target="_blank" rel="noreferrer">日経平均公式アーカイブ</a>でも確認しています。
            </p>
          </section>

          <section>
            <h2>日本株の主なニュースと要因</h2>
            <ul>
              <li>日経平均は8月3日の63,754.90から週半ばに66,300.44まで上昇し、7日は65,606.71で終了しました。米国の大型テック・半導体株の反発が、日本の値がさ半導体関連株への追い風となりました。</li>
              <li>ドル円は前週末の160円台から週初に157円台へ移り、週末も158円近辺で推移しました。米日が円相場の安定を図る対応を確認したとの報道後も、為替の変動は輸出企業の採算前提と海外投資家のリスク判断に影響し得る材料です。<a href="https://apnews.com/article/7316599afed35629a27ae23a35f569fd" target="_blank" rel="noreferrer">AP（8月3日）</a></li>
              <li>国内では決算発表が集中し、指数全体の動きよりも、想定為替レート、原材料コスト、通期見通しの修正を伴うかどうかで評価が分かれやすい週でした。</li>
            </ul>
          </section>

          <section>
            <h2>米国株の主なニュースと要因</h2>
            <ul>
              <li>週初はブレント原油が急落し、インフレ再加速への不安が緩和しました。8月3日には原油安を受けて米国株が上昇し、NASDAQ総合は2.1%高でした。<a href="https://apnews.com/article/d19a8f9a77b6fceca41da3e4b6bf17aa" target="_blank" rel="noreferrer">AP（8月3日）</a></li>
              <li>7月の米雇用者数は予想に反して2万3,000人減少し、5月・6月分も合計10万3,000人下方改定されました。雇用の弱さは景気の先行き懸念を残す一方、Fedの追加利上げ観測を弱め、週末の株価と債券価格を支えました。<a href="https://apnews.com/article/9c2d147c14bc428458be5a1e83e54957" target="_blank" rel="noreferrer">AP（8月7日）</a></li>
              <li>NvidiaとBroadcomが7日に上昇するなど、テクノロジー株が指数を押し上げました。SOXは週初の11,430.35から12,356.79へ上昇し、AI向け需要への期待は維持された一方、値動きの大きさも残りました。<a href="https://apnews.com/article/9636095906bbb689a1f612bce9a07343" target="_blank" rel="noreferrer">AP（8月7日）</a></li>
            </ul>
          </section>

          <section>
            <h2>市場関係者の見方</h2>
            <ul className="viewpoints">
              <li><strong>金利に追い風との見方：</strong>弱い雇用統計はFedが直近で追加利上げを急がない余地を広げるとの受け止めが市場にあり、米10年債利回りは雇用統計後に低下しました。</li>
              <li><strong>景気への慎重論：</strong>Amova Asset Management AmericasのPeter Graf氏は、金融政策面でのハト派的含意を株式市場が歓迎し得る一方、就業者減少が成長の持続性に与える影響には注意が必要だと述べました。<a href="https://apnews.com/article/9636095906bbb689a1f612bce9a07343" target="_blank" rel="noreferrer">AP（8月7日）</a></li>
              <li><strong>次の分岐点は物価との見方：</strong>Morgan Stanley Wealth ManagementのEllen Zentner氏は、雇用統計で9月の利上げ圧力が和らぐ可能性を指摘しつつ、翌週のインフレ統計が判断材料になるとの見方を示しました。<a href="https://apnews.com/article/9636095906bbb689a1f612bce9a07343" target="_blank" rel="noreferrer">AP（8月7日）</a></li>
            </ul>
          </section>

          <section>
            <h2>相場環境：金利・為替・原油</h2>
            <p>米10年債利回りは雇用統計発表後に4.64%へ低下しました。雇用鈍化は金利低下要因ですが、インフレ率がなお高い場合には、金融政策の判断は単純ではありません。</p>
            <p>ドル円は前週末比で円高方向へ動き、158円近辺で週を終えました。円高は輸入コストにはプラスに働き得る一方、輸出企業の円換算収益には逆風となるため、日本企業決算の想定レートとの比較が重要です。</p>
            <p>ブレント原油は7月31日の1バレル90.12ドルから8月7日には82.27ドルまで低下しました。週初の急落は株式・債券を支えましたが、中東情勢を巡る供給懸念は引き続き価格変動要因です。<a href="https://apnews.com/article/d19a8f9a77b6fceca41da3e4b6bf17aa" target="_blank" rel="noreferrer">AP（8月3日）</a></p>
          </section>

          <section>
            <h2>翌週の注目点</h2>
            <ul>
              <li><strong>米国の物価統計：</strong>7月CPIは米東部時間8月12日に公表予定です。雇用鈍化とインフレの組み合わせがFedの見通しを左右します。<a href="https://www.bls.gov/schedule/news_release/cpi.htm" target="_blank" rel="noreferrer">米労働統計局（BLS）公表日程</a></li>
              <li><strong>米国の金利・原油：</strong>雇用統計後の債券利回りが低下を続けるか、原油が再上昇してインフレ懸念を戻すかを確認します。</li>
              <li><strong>日本の為替・決算：</strong>ドル円の変動と企業の想定為替レート、半導体関連株が米国SOXの上昇を維持できるかが焦点です。</li>
              <li><strong>日本の景気指標：</strong>4〜6月期GDPの1次速報は8月17日8時50分（日本時間）に公表予定で、内需・設備投資の確認材料になります。<a href="https://www.esri.cao.go.jp/en/sna/kouhyou/kouhyou_top.html" target="_blank" rel="noreferrer">内閣府公表日程</a></li>
            </ul>
          </section>

          <p className="disclaimer">
            これは投資助言ではなく、2026年8月8日時点の公開情報に基づく市場概況の整理です。記載した指数・価格は集計時点の終値であり、将来の市場動向を示すものではありません。
          </p>
        </div>
      </article>
    </main>
  );
}
