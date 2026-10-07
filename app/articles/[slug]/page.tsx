import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import SnapshotChart from "../../components/snapshot-chart";
import { createArticleMetadata } from "../../../lib/article-metadata";
import {
  getDailyArticle,
  getDailyArticles,
  type SourceLink,
} from "../../../lib/article-content";

type PageProps = {
  params: Promise<{ slug: string }>;
};

export const dynamicParams = false;

export function generateStaticParams() {
  return getDailyArticles().map((article) => ({ slug: article.slug }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const article = getDailyArticle(slug);
  if (!article) return {};
  return createArticleMetadata(article);
}

function Sources({ sources }: { sources: SourceLink[] }) {
  return (
    <div className="source-panel"><span className="source-panel-label">出典・参考資料</span><p className="inline-sources">
      {sources.map((source, index) => (
        <span key={source.url}>
          <span className="source-number">{String(index + 1).padStart(2, "0")}</span>
          <a href={source.url} target="_blank" rel="noreferrer">{source.label}</a>
        </span>
      ))}
    </p></div>
  );
}

export default async function ContentDrivenDailyArticle({ params }: PageProps) {
  const { slug } = await params;
  const article = getDailyArticle(slug);
  if (!article) notFound();

  return (
    <main className="article-page editorial-article" id="main-content">
      <Link className="back-link" href="/">MARKET NOTE / レポート</Link>
      <article>
        <header className="report-header">
          <p className="report-label">{article.label}</p>
          <h1>{article.title}</h1>
          <p className="report-deck">{article.excerpt}</p>
          <div className="article-byline"><span className="byline-mark" aria-hidden="true">M</span><span>Market Note Research<time className="report-date" dateTime={article.dateTime}>{article.displayDate} · {article.date.slice(11)} JST</time></span><span className="article-status">公開情報・出典付き</span></div>
        </header>

        <div className="article-reading-layout">
          <aside className="article-toc"><p className="kicker">IN THIS REPORT</p><p className="toc-heading">この記事の内容</p><nav aria-label="記事の目次"><ol>{article.sections.map((section, index) => <li key={section.heading}><a href={`#section-${index}`}><span>{String(index + 1).padStart(2, "0")}</span>{section.heading.replace(/^\d+．/, "")}</a></li>)}</ol></nav><p className="toc-note">数値・見解は記事に記載された基準日時点のものです。</p></aside>
          <div className="report-body">
          {article.sections.map((section, sectionIndex) => (
            <section id={`section-${sectionIndex}`} className={sectionIndex === 0 ? "article-takeaway" : undefined} key={section.heading}>
              <h2>{section.heading}</h2>

              {section.paragraphs?.map((paragraph) => <p key={paragraph}>{paragraph}</p>)}

              {section.table && (
                <div className="table-wrap" role="region" aria-label={`${section.heading}のデータ表（横にスクロールできます）`} tabIndex={0}>
                  <table>
                    <thead>
                      <tr>{section.table.headers.map((header) => <th key={header}>{header}</th>)}</tr>
                    </thead>
                    <tbody>
                      {section.table.rows.map((row, rowIndex) => (
                        <tr key={`${section.heading}-${rowIndex}`}>
                          {row.map((cell, cellIndex) => <td key={`${rowIndex}-${cellIndex}`}>{cell}</td>)}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
              {section.table && <SnapshotChart table={section.table} />}

              {section.sources?.length ? <Sources sources={section.sources} /> : null}

              {section.subsections?.map((subsection) => (
                <div key={subsection.heading}>
                  <h3>{subsection.heading}</h3>
                  {subsection.paragraphs?.map((paragraph) => <p key={paragraph}>{paragraph}</p>)}
                  {subsection.bullets?.length ? (
                    <ul>{subsection.bullets.map((bullet) => <li key={bullet}>{bullet}</li>)}</ul>
                  ) : null}
                </div>
              ))}
            </section>
          ))}

          <section className="disclaimer">
            <h2>{article.disclaimer.heading}</h2>
            {article.disclaimer.paragraphs.map((paragraph) => <p key={paragraph}>{paragraph}</p>)}
          </section>
          <Link className="article-end-link" href="/#articles">レポート一覧に戻る <span aria-hidden="true">↗</span></Link>
        </div>
        </div>
      </article>
    </main>
  );
}
