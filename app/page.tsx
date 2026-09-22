import Link from "next/link";
import LegacyPage from "./page-legacy";

const latestDailyReports = [
  {
    date: "2026-09-23 07:00",
    title: "デイリー・マーケットブリーフィング（2026年9月23日）",
    excerpt: "Alibaba新AIチップ、Meta MuseとNASDAQ最高値、原油100ドル割れ、FRB、日銀1.25%後の市場を整理。",
    href: "/articles/daily-2026-09-23",
  },
  {
    date: "2026-09-22 07:00",
    title: "デイリー・マーケットブリーフィング（2026年9月22日）",
    excerpt: "AMDの1兆ドル突破、米国株最高値、SoftBankのOpenAI投資債、TSMC先端パッケージ、円157円台を整理。",
    href: "/articles/daily-2026-09-22",
  },
  {
    date: "2026-09-21 07:00",
    title: "デイリー・マーケットブリーフィング（2026年9月21日）",
    excerpt: "CXMTのDRAM量産、米中AI・重要鉱物協議、FRB、中東情勢、日銀利上げ後の市場を整理。",
    href: "/articles/daily-2026-09-21",
  },
  {
    date: "2026-09-20 07:00",
    title: "デイリー・マーケットブリーフィング（2026年9月20日）",
    excerpt: "CXMT、米中協議、中国LPR、FRB、中東情勢を整理。",
    href: "/articles/daily-2026-09-20",
  },
];

export default function Home() {
  return (
    <>
      <section className="latest-daily-reports" style={{ maxWidth: 1180, margin: "24px auto 0", padding: "0 24px" }}>
        <p style={{ fontSize: 12, fontWeight: 700, letterSpacing: ".08em", marginBottom: 10 }}>LATEST DAILY REPORTS</p>
        <div style={{ display: "grid", gap: 10 }}>
          {latestDailyReports.map((article) => (
            <Link key={article.href} href={article.href} style={{ display: "block", padding: 16, border: "1px solid rgba(127,127,127,.25)", borderRadius: 12, textDecoration: "none", color: "inherit" }}>
              <time style={{ fontSize: 12, opacity: .7 }}>{article.date}</time>
              <h2 style={{ fontSize: 18, margin: "5px 0" }}>{article.title}</h2>
              <p style={{ margin: 0, opacity: .8 }}>{article.excerpt}</p>
            </Link>
          ))}
        </div>
      </section>
      <LegacyPage />
    </>
  );
}
