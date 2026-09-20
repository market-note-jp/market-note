import Link from "next/link";
import LegacyPage from "./page-legacy";

const latestArticles = [
  {
    date: "2026-09-21 07:00",
    title: "デイリー・マーケットブリーフィング（2026年9月21日）",
    excerpt: "CXMTのDRAM量産、米中AI・重要鉱物協議、FRBのインフレ警戒、中東情勢、日銀利上げ後の日本市場を整理。",
    href: "/articles/daily-2026-09-21",
  },
  {
    date: "2026-09-20 07:00",
    title: "デイリー・マーケットブリーフィング（2026年9月20日・週末版）",
    excerpt: "CXMTのDRAM量産、米中協議、中国LPR、FRBのインフレ警戒、リヤド攻撃と湾岸市場を整理。",
    href: "/articles/daily-2026-09-20",
  },
];

export default function Home() {
  return (
    <>
      <section className="latest-report-strip" aria-label="最新の日次レポート">
        <div className="latest-report-inner">
          <p className="eyebrow">LATEST MARKET NOTE</p>
          <h2>最新の日次レポート</h2>
          <div className="latest-report-grid">
            {latestArticles.map((article) => (
              <Link className="latest-report-card" href={article.href} key={article.href}>
                <time>{article.date}</time>
                <h3>{article.title}</h3>
                <p>{article.excerpt}</p>
                <span>全文を読む →</span>
              </Link>
            ))}
          </div>
        </div>
      </section>
      <LegacyPage />
    </>
  );
}
