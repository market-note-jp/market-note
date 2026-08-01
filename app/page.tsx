import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Market Note | 日米市場を、毎朝読む",
  description: "日本株・米国株・半導体・マクロを、公開情報に基づいて読み解く市場アーカイブ。",
};

const stories = [
  {
    tag: "AI・半導体",
    title: "AI投資は収益化の段階へ。大型決算が示した選別の視点",
    text: "クラウドの成長と設備投資の回収が、半導体・周辺産業の評価を左右する局面です。",
    time: "本日のブリーフィング",
  },
  {
    tag: "日本株",
    title: "日銀の据え置き後、円相場と企業決算をどう読むか",
    text: "金利・為替・エネルギーコストを分けて見ることで、業種ごとの影響を整理します。",
    time: "日本市場",
  },
  {
    tag: "米国株",
    title: "雇用統計を前に、長期金利とハイテク株が再び焦点に",
    text: "景気の強さとインフレの粘着性を、市場がどう織り込むかを追います。",
    time: "来週の注目点",
  },
];

const reports = [
  { type: "DAILY / 2026.08.01", title: "AI投資への信頼は回復。ただし半導体の調整終了は未確認。", summary: "AmazonとMicrosoftの決算は、AIインフラ投資が収益につながる道筋を示しました。一方、7月の半導体セクターは大きく調整し、原油高と長期金利上昇も評価の重しです。", impact: "クラウド需要・長期契約・受注残を数字で示せる企業に選別的な追い風。日本では半導体装置、メモリー、光通信、電力・冷却関連の見通しが焦点です。", watch: "SOXの戻りの持続性、メモリー在庫・価格、中国勢の増産、米雇用統計、日米金利差。" },
  { type: "WEEKLY / 2026.07.27–31", title: "大型テック決算で米株は反発、日銀と円相場が日本株の変数に。", summary: "ダウは週+1.0%、ナスダック総合は+1.6%。Amazonの好決算が支えとなった一方、AI投資の回収時期とインフレ懸念が半導体株の変動を大きくしました。日銀は政策金利を1%に据え置きました。", impact: "米国では決算内容による銘柄選別、日本では為替・金利に敏感な輸出、銀行、不動産などで見方が分かれる環境です。", watch: "米ISM、JOLTS、ADP、雇用統計。国内は賃金・雇用統計と主要企業の決算、ドル円と原油の動き。" },
];

export default function Home() {
  return (
    <main>
      <header className="site-header">
        <a className="brand" href="#top" aria-label="Market Note ホーム">
          MARKET <span>NOTE</span>
        </a>
        <nav aria-label="主要ナビゲーション">
          <a href="#archive">記事一覧</a>
          <a href="#themes">テーマ</a>
          <a href="#about">このサイトについて</a>
        </nav>
      </header>

      <section className="hero" id="top">
        <div className="eyebrow">MARKET RESEARCH ARCHIVE / TOKYO</div>
        <p className="issue">2026.08.02 &nbsp; SUNDAY</p>
        <h1>市場のノイズをほどき、<br />明日の論点を残す。</h1>
        <p className="hero-copy">
          日本株と米国株を、決算・金利・為替・半導体から読み解く個人の市場ノート。<br />
          速報ではなく、公開情報をもとにした検証可能な整理を届けます。
        </p>
        <a className="button" href="#archive">記事一覧を見る <span>→</span></a>
      </section>

      <section className="strip" aria-label="今朝のキーワード">
        <p>FOCUS</p><span>AI投資の収益化</span><span>日銀と円相場</span><span>金利・原油・インフレ</span>
      </section>

      <section className="content-section lead-section" id="daily">
        <div className="section-label">01 / DAILY BRIEFING</div>
        <div className="lead-grid">
          <article className="lead-story">
            <p className="story-meta">2026.08.01　|　週末版</p>
            <h2>AI投資への信頼は戻った。<br />ただし、半導体の調整はまだ終わっていない。</h2>
            <p>
              MicrosoftとAmazonの決算は、AIインフラ投資が売上と利益に結びつく道筋を示しました。一方で、原油高・長期金利・中国勢との競争は、半導体セクターの評価に残る重要な変数です。
            </p>
            <div className="takeaway"><b>今日の論点</b><span>「AI需要の強さ」より、「投資回収を数字で示せるか」</span></div>
            <a className="text-link" href="#weekly">続きを読む <span>→</span></a>
          </article>
          <aside className="market-panel" aria-label="今週の市場テーマ">
            <p className="panel-kicker">THIS WEEK / 3 POINTS</p>
            <ol>
              <li><span>01</span><p><b>米国大型決算</b>クラウド成長と設備投資の回収</p></li>
              <li><span>02</span><p><b>日銀の政策姿勢</b>追加利上げ観測と円相場</p></li>
              <li><span>03</span><p><b>インフレ再燃リスク</b>原油と債券利回りの上昇</p></li>
            </ol>
          </aside>
        </div>
      </section>

      <section className="content-section stories" id="themes">
        <div className="section-heading"><div className="section-label">02 / LATEST NOTES</div><p>市場を動かす材料を、テーマ別に。</p></div>
        <div className="story-grid">
          {stories.map((story, index) => (
            <article className="story-card" key={story.title}>
              <div className={`card-art art-${index + 1}`} aria-hidden="true"><span>{String(index + 1).padStart(2, "0")}</span></div>
              <p className="story-meta">{story.tag}　/　{story.time}</p>
              <h3>{story.title}</h3>
              <p>{story.text}</p>
              <a href="#about" aria-label={`${story.title} を読む`}>NOTE <span>↗</span></a>
            </article>
          ))}
        </div>
      </section>

      <section className="weekly" id="weekly">
        <div><p className="section-label">03 / WEEKLY REVIEW</p><h2>一週間の動きを、<br />一つの見取り図に。</h2></div>
        <div className="weekly-copy"><p>日経平均、ダウ、ナスダック、SOXを軸に、決算・中銀・為替・コモディティの動きを毎週土曜にまとめます。</p><a className="button light" href="#about">週次レポートを読む <span>→</span></a></div>
      </section>

      <section className="content-section archive" id="archive" aria-labelledby="archive-heading">
        <div className="section-heading"><div className="section-label">04 / REPORT ARCHIVE</div><p>日次と週次を、あとから読み返せる形で。</p></div>
        <h2 id="archive-heading">最新のレポート</h2>
        <div className="report-list">
          {reports.map((report) => <article className="report" key={report.type}>
            <p className="story-meta">{report.type}</p><h3>{report.title}</h3><p>{report.summary}</p>
            <details><summary>全文を読む <span>＋</span></summary><div className="report-detail"><div className="wide"><b>概要</b><p>{report.summary}</p></div><div><b>市場への影響</b><p>{report.impact}</p></div><div><b>次の注目点</b><p>{report.watch}</p></div><div className="wide"><b>背景と読み方</b><p>AI・半導体は、設備投資が売上・受注残・利益率に変換されるかが評価の分岐点です。日本株では米半導体株、日米金利差、円相場を併せて見ます。米国では原油と債券利回りが、インフレ見通しを通じて高PER株の評価を左右します。</p></div><div className="wide"><b>主要ソース</b><p><a href="https://apnews.com/article/wall-street-stocks-dow-nasdaq-37d8d182f02f0fcdcf9f7db67e6dfadd">AP</a>　<a href="https://www.boj.or.jp/en/">日本銀行</a>　<a href="https://www.newyorkfed.org/research/calendars/i-aug26.html">NY連銀</a></p></div><p className="disclaimer">公開情報に基づく市場概況の整理であり、投資助言ではありません。</p></div></details>
          </article>)}
        </div>
      </section>

      <section className="content-section about" id="about">
        <div className="section-label">05 / EDITORIAL POLICY</div>
        <div><h2>公開情報を、<br />あとから確かめられる形で。</h2><p>一次情報・信頼できる報道・市場参加者の見方を区別し、出典と日付を残します。記事本文の転載や未確認情報の拡散は行いません。個別銘柄の売買推奨ではなく、市場環境を理解するためのリサーチノートです。</p></div>
      </section>

      <footer><span>MARKET NOTE</span><p>Independent market research archive. Not investment advice.</p><p>© 2026</p></footer>
    </main>
  );
}
