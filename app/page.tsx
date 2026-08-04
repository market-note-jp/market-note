import Link from "next/link";

const articles = [
  {
    kind: "日次レポート",
    date: "2026-08-04 08:00",
    title: "デイリー・マーケットブリーフィング（2026年8月4日）",
    excerpt:
      "原油安を受けた米株高、Palantir決算、日本株・円相場、米製造業、半導体株の選別を整理。",
    href: "/articles/daily-2026-08-04",
  },
  {
    kind: "日次レポート",
    date: "2026-08-01 08:00",
    title: "デイリー・マーケットブリーフィング（2026年8月1日・週末版）",
    excerpt:
      "AmazonとMicrosoftの決算、半導体株の調整、Sony、日銀、円相場と原油をまとめたデイリーブリーフィング。",
    href: "/articles/daily-2026-08-01",
  },
  {
    kind: "週次レポート",
    date: "2026-08-01 08:00",
    title: "週次マーケットニュースレポート（2026年7月27日〜31日）",
    excerpt:
      "大型テック決算、日銀、原油・インフレ、AI・半導体株の調整をまとめた週次レポート。",
    href: "/articles/weekly-2026-07-27",
  },
];

export default function Home() {
  return (
    <main className="site-shell">
      <header className="site-header">
        <Link className="brand" href="/">
          <span className="brand-mark">M</span>
          <span>
            MARKET NOTE
            <small>日本株・米国株のニュースレポート</small>
          </span>
        </Link>
        <nav aria-label="メインナビゲーション">
          <a href="#articles">記事一覧</a>
          <a href="#policy">このサイトについて</a>
        </nav>
      </header>

      <section className="intro">
        <p className="kicker">MARKET REPORT ARCHIVE</p>
        <h1>市場を、あとから読み返せる形に。</h1>
        <p>
          毎日・毎週のマーケットレポートを、公開情報と出典リンクを添えて全文保存する個人アーカイブです。
        </p>
      </section>

      <section className="articles" id="articles" aria-labelledby="articles-title">
        <div className="section-title-row">
          <div>
            <p className="kicker">ARTICLES</p>
            <h2 id="articles-title">記事一覧</h2>
          </div>
          <p>{articles.length}件</p>
        </div>

        <div className="tabs" aria-label="記事の分類">
          <span className="tab active">新着</span>
          <span className="tab">月別</span>
          <span className="tab">テーマ別</span>
        </div>

        <div className="article-list">
          {articles.map((article) => (
            <article className="article-row" key={article.href}>
              <Link href={article.href} aria-label={`${article.title}を読む`}>
                <div className="article-copy">
                  <p className="article-kind">{article.kind}</p>
                  <h3>{article.title}</h3>
                  <p className="article-excerpt">{article.excerpt}</p>
                  <p className="article-meta">
                    <time dateTime="2026-08-01T08:00:00+09:00">{article.date}</time>
                    <span>テーマ：市場ニュース</span>
                  </p>
                </div>
                <span className="article-arrow" aria-hidden="true">→</span>
              </Link>
            </article>
          ))}
        </div>
      </section>

      <section className="policy" id="policy">
        <p className="kicker">EDITORIAL POLICY</p>
        <h2>レポート本文を省略せず保存します。</h2>
        <p>
          ChatGPTで作成された日次・週次レポートの章立て、表、箇条書き、出典リンク、注意書きを保ったまま記事として公開します。
          噂や未確認情報を避け、断定を控えた市場概況として蓄積します。
        </p>
      </section>

      <footer>
        <span>MARKET NOTE</span>
        <span>Public market research archive / Not investment advice.</span>
      </footer>
    </main>
  );
}
