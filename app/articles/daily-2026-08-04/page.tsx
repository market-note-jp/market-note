import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "デイリー・マーケットブリーフィング（2026年8月4日） | Market Note",
  description: "米国株、AI・半導体、日本株、為替、原油、米景気指標をまとめた2026年8月4日のマーケットブリーフィング。",
};

export default function DailyReportAugust4() {
  return (
    <main className="article-page">
      <Link className="back-link" href="/">← 記事一覧へ戻る</Link>

      <article>
        <header className="report-header">
          <p className="report-label">DAILY MARKET BRIEFING</p>
          <h1>デイリー・マーケットブリーフィング</h1>
          <p className="report-date">2026年8月4日（火）</p>
        </header>

        <div className="report-body">
          <section>
            <h2>今日の結論</h2>
            <p>米国株は、原油価格の急落でインフレ懸念がいったん和らぎ、<strong>大型株から小型株まで買いが広がるリスク選好の相場</strong>となった。</p>
            <p>ただし、米製造業の回復とAI企業の強い決算は、企業利益には追い風である一方、金利が下がり続けるとの期待を弱める可能性がある。</p>
            <p>日本株は米株高を受けて上昇したものの、円買い介入後のドル円と国内金利、今週集中する企業決算を同時に見極める局面だ。今日の焦点は、<strong>指数の上昇より、業績で買われる企業へ資金が広がるか</strong>にある。</p>
          </section>

          <section>
            <h2>1．原油安で米国株が全面高――ダウは最高値</h2>
            <p>8月3日の米国市場では、S&amp;P500が1.5％高の7,600.50、ダウ平均が1.3％高の53,178.41、NASDAQ総合が2.1％高の25,913.90で終了した。ダウは最高値を更新し、小型株のRussell 2000も1.7％上昇した。</p>
            <p>ブレント原油が4.7％下落し、エネルギー高によるインフレ再加速と長期金利上昇への懸念が後退したことが、市場全体の買い材料になった。</p>
            <p className="inline-sources"><a href="https://apnews.com/article/f8e5f81b45c83878f5b7f69832bb0c95" target="_blank" rel="noreferrer">AP・主要指数（8月3日）</a><a href="https://apnews.com/article/d19a8f9a77b6fceca41da3e4b6bf17aa" target="_blank" rel="noreferrer">AP・市場概況（8月3日）</a></p>

            <h3>株価・市場への影響</h3>
            <p>原油安と金利低下が同時に進む局面では、航空、運輸、消費関連、高PERの成長株に追い風になりやすい。一方、エネルギー株には利益確定売りが出やすい。</p>
            <p>今回の上昇はAI大型株だけに集中せず、小型株にも波及した。上昇銘柄の広がりが続けば、指数上昇の持続性を支える材料になる。</p>

            <h3>次の注目点</h3>
            <ul>
              <li>原油安が一日限りで終わらないか</li>
              <li>米10年債利回りが再上昇しないか</li>
              <li>小型株と景気敏感株への資金流入が続くか</li>
              <li>S&amp;P500が過去最高値を明確に上回れるか</li>
            </ul>
          </section>

          <section>
            <h2>2．Palantir決算――AIソフトウェアの収益化を確認</h2>
            <p>Palantirの4～6月期は、米国商業部門の売上高が前年同期比149％増となり、全社売上高も82％増加した。会社は2026年の米国商業部門の売上見通しを従来より引き上げた。</p>
            <p>クラウド大手の設備投資だけでなく、AIソフトウェアを導入する企業側で契約と売上が増えていることは、AI投資の裾野が広がっている可能性を示す。</p>
            <p className="inline-sources"><a href="https://www.stocktitan.net/news/PLTR/palantir-reports-q2-2026-u-s-comm-revenue-growth-of-149-y-y-and-c8762wptyyap.html" target="_blank" rel="noreferrer">Palantir決算発表（8月3日）</a></p>

            <h3>株価・市場への影響</h3>
            <p>AI関連でも、設備投資額の大きさではなく、顧客数、契約残、売上成長、利益率を数字で示せる企業が評価されやすい。これはクラウド、データ分析、サイバーセキュリティ企業への選別を強める材料になる。</p>
            <p>ただし、高い成長率がすでに株価へ織り込まれている場合、好決算でも値動きが大きくなる可能性がある。</p>

            <h3>次の注目点</h3>
            <ul>
              <li>米国商業部門の契約増加が継続するか</li>
              <li>売上成長と営業利益率を両立できるか</li>
              <li>政府向けから民間向けへ顧客基盤が広がるか</li>
              <li>好決算後の株価が上昇を維持できるか</li>
            </ul>
          </section>

          <section>
            <h2>3．日経平均は0.3％高――円介入後の157円台を注視</h2>
            <p>8月4日の日経平均は0.3％高の63,957.53で終了した。ドル円は1ドル＝157.80円付近となり、前週の共同為替介入後も円相場の変動が続いている。</p>
            <p>米国株高は日本の半導体・グロース株を支える一方、円高方向への動きは自動車や電機など輸出企業の業績換算に逆風となり得る。日本株では、指数全体よりも決算内容と為替前提による選別が強まりやすい。</p>
            <p className="inline-sources"><a href="https://apnews.com/article/fbbe6128d618509e33d45a493c2615b1" target="_blank" rel="noreferrer">AP・東京市場（8月4日）</a></p>

            <h3>日本企業の決算</h3>
            <p>8月4日は日本製鉄などの決算発表が予定されている。今週は製造業を中心に決算が続くため、売上高だけでなく、原材料価格、為替前提、価格転嫁、通期見通しの修正を確認する必要がある。</p>
            <p className="inline-sources"><a href="https://www.ir-searcher.com/kessan_schedule.php?date=2026-08-04" target="_blank" rel="noreferrer">8月4日決算スケジュール</a><a href="https://www.kabutore.biz/kessan/schedule.html?date=2026-08-04" target="_blank" rel="noreferrer">主要決算予定</a></p>

            <h3>次の注目点</h3>
            <ul>
              <li>ドル円が157円台を維持するか</li>
              <li>追加介入への警戒が続くか</li>
              <li>企業の通期見通しと想定為替レート</li>
              <li>半導体株の上昇が東京市場で持続するか</li>
            </ul>
          </section>

          <section>
            <h2>4．米製造業は4年超ぶりの高水準――金利には両刃の剣</h2>
            <p>7月のISM製造業景況指数は55.6へ上昇し、米製造業の活動が4年超ぶりの高い水準となった。50を上回る数値は製造業活動の拡大を示す。</p>
            <p>景気の底堅さは企業利益と景気敏感株にはプラスだが、需要が強すぎればインフレ圧力と金融引き締め観測を再び高める可能性がある。</p>
            <p className="inline-sources"><a href="https://www.reuters.com/business/us-manufacturing-activity-jumps-more-than-four-year-high-july-2026-08-03/" target="_blank" rel="noreferrer">Reuters（8月3日）</a><a href="https://www.newyorkfed.org/research/calendars/i-aug26.html" target="_blank" rel="noreferrer">NY連銀・経済指標日程</a></p>

            <h3>株価・市場への影響</h3>
            <p>資本財、素材、運輸、産業機械などには需要回復期待が追い風になりやすい。一方、強い景気指標で長期金利が上昇すれば、利益が将来に偏る高PER株には逆風となる。</p>

            <h3>次の注目点</h3>
            <ul>
              <li>新規受注と雇用指数の改善が続くか</li>
              <li>仕入れ価格指数が再上昇しないか</li>
              <li>JOLTS、ADP雇用、雇用統計との整合性</li>
              <li>強い景気と金利低下が両立するか</li>
            </ul>
          </section>

          <section>
            <h2>5．半導体株は反発しても選別継続――Micronの乱高下が示す不安定さ</h2>
            <p>8月3日のMicron株は一時6.4％安まで下落した後に切り返し、0.8％高で終了した。AI・メモリー需要への期待は残る一方、短期のポジション調整と高い評価への警戒が、同じ日の中でも大きな値動きを生んでいる。</p>
            <p>半導体相場は「AI需要があるか」だけではなく、在庫、メモリー価格、設備投資負担、受注の利益転換まで確認する段階へ移っている。</p>
            <p className="inline-sources"><a href="https://apnews.com/article/d19a8f9a77b6fceca41da3e4b6bf17aa" target="_blank" rel="noreferrer">AP（8月3日）</a><a href="https://investor.onsemi.com/events/event-details/onsemi-second-quarter-2026-earnings-conference-call" target="_blank" rel="noreferrer">onsemi決算イベント（8月3日）</a></p>

            <h3>株価・市場への影響</h3>
            <p>日本ではアドバンテスト、東京エレクトロン、SCREEN、キオクシアなどが米半導体株の影響を受けやすい。ただし、指数連動の買い戻しと業績を根拠とする買いを区別する必要がある。</p>

            <h3>次の注目点</h3>
            <ul>
              <li>SOX指数の反発が数日続くか</li>
              <li>メモリー価格と在庫の改善</li>
              <li>AIデータセンター向け受注の利益率</li>
              <li>半導体株の出来高を伴う上昇</li>
            </ul>
          </section>

          <section>
            <h2>今日の優先チェック項目</h2>
            <ol>
              <li><strong>原油安と米長期金利低下が続くか</strong></li>
              <li><strong>Palantir決算後にAIソフトウェアへ買いが広がるか</strong></li>
              <li><strong>日経平均より、決算銘柄の通期見通しが評価されるか</strong></li>
              <li><strong>ドル円157円台と追加介入リスク</strong></li>
              <li><strong>JOLTSから雇用統計までの指標が金利観測をどう動かすか</strong></li>
            </ol>
          </section>

          <section>
            <h2>現時点の見方</h2>
            <p>原油安、米株高、AI企業の強い決算はリスク選好を支えている。しかし、製造業の回復が金利上昇につながれば、高PER株の上値を抑える可能性がある。</p>
            <p>いま評価されやすいのは、</p>
            <blockquote>需要の強さを、契約・売上・利益率・キャッシュフローへ変換できる企業</blockquote>
            <p>だ。指数上昇だけを追うより、決算後も業績予想が上方修正され、株価が上昇を維持できる企業を確認したい。</p>
          </section>

          <p className="disclaimer">これは投資助言ではなく、2026年8月4日時点の公開情報に基づく市場概況の整理です。</p>
        </div>
      </article>
    </main>
  );
}
