import editorialTitles from "../../../content/editorial-titles.json";
import { createArticleMetadata } from "../../../lib/article-metadata";
import type { Metadata } from "next";
import Link from "next/link";
import { reportHtml, reportLead } from "./report-content";
import styles from "./report.module.css";


const editorial = editorialTitles["kioxia-per-2026-09-23"];
export const metadata: Metadata = createArticleMetadata(editorial);

export default function KioxiaPerReport() {
  return (
    <main id="main-content" className="article-page">
      <Link className="back-link" href="/">記事一覧へ戻る</Link>
      <article>
        <header className="report-header">
          <p className="report-label">CORPORATE RESEARCH</p>
          <h1>{editorial.title}</h1>
          <p className="report-lead">{reportLead}</p>
          <p className="report-date">公開日：2026年9月23日</p>
        </header>
        <div className={`report-body ${styles.prose}`} dangerouslySetInnerHTML={{ __html: reportHtml }} />
      </article>
    </main>
  );
}
