import editorialTitles from "../../../content/editorial-titles.json";
import { createArticleMetadata } from "../../../lib/article-metadata";
import type { Metadata } from "next";
import Link from "next/link";
import { Download, FileSpreadsheet } from "lucide-react";
import { reportHtml } from "./report-content";

const editorial = editorialTitles["corporate-fanuc-2026-09-22"];
export const metadata: Metadata = createArticleMetadata(editorial);

export default function FanucCompanyReport() {
  return (
    <main id="main-content" className="article-page">
      <Link className="back-link" href="/">← 記事一覧へ戻る</Link>

      <article>
        <header className="report-header">
          <p className="report-label">CORPORATE REPORT</p>
          <h1>{editorial.title}</h1>
          <p className="report-lead">回復する受注と、再評価に必要な利益成長</p>
          <p className="report-date">公開日：2026年9月22日</p>
          <div className="report-actions" aria-label="レポート資料">
            <Link href="/reports/fanuc_company_report_2026-09-22.pdf" target="_blank">
              <Download size={17} aria-hidden="true" />PDF版を開く
            </Link>
            <Link className="secondary" href="/reports/fanuc_calculation_notes_2026-09-22.md" target="_blank">
              <FileSpreadsheet size={17} aria-hidden="true" />計算資料を開く
            </Link>
          </div>
        </header>

        <div className="report-body">
          <p className="disclaimer">
            本稿は公開情報に基づく独自の企業研究であり、証券会社の投資判断や市場コンセンサスではありません。特定の有価証券の取得、売却、保有を推奨するものではなく、将来の成果を保証しません。
          </p>
          <div className="report-prose" dangerouslySetInnerHTML={{ __html: reportHtml }} />
        </div>
      </article>
    </main>
  );
}
