import type { Metadata } from "next";
import Link from "next/link";
import { reportHtml, reportTitle, reportLead } from "./report-content";
import styles from "./report.module.css";

const description = "前通期実績53.3倍、直近12カ月参考21.6倍、市場予想4.5倍。キオクシアのPERを利益の定義から読み解き、AI需要、長期契約、設備投資と現金収支を検証。";

export const metadata: Metadata = {
  title: `${reportTitle} | Market Note`,
  description,
  openGraph: { title: reportTitle, description, type: "article", publishedTime: "2026-09-23T00:00:00+09:00" },
  twitter: { card: "summary", title: reportTitle, description },
};

export default function KioxiaPerReport() {
  return (
    <main className="article-page">
      <Link className="back-link" href="/">記事一覧へ戻る</Link>
      <article>
        <header className="report-header">
          <p className="report-label">CORPORATE RESEARCH</p>
          <h1>{reportTitle}</h1>
          <p className="report-lead">{reportLead}</p>
          <p className="report-date">公開日：2026年9月23日</p>
        </header>
        <div className={`report-body ${styles.prose}`} dangerouslySetInnerHTML={{ __html: reportHtml }} />
      </article>
    </main>
  );
}
