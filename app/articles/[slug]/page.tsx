import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
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
  return {
    title: `${article.title} | Market Note`,
    description: article.description,
  };
}

function Sources({ sources }: { sources: SourceLink[] }) {
  return (
    <p className="inline-sources">
      {sources.map((source, index) => (
        <span key={source.url}>
          {index > 0 ? " ／ " : ""}
          <a href={source.url} target="_blank" rel="noreferrer">{source.label}</a>
        </span>
      ))}
    </p>
  );
}

export default async function ContentDrivenDailyArticle({ params }: PageProps) {
  const { slug } = await params;
  const article = getDailyArticle(slug);
  if (!article) notFound();

  return (
    <main className="article-page">
      <Link className="back-link" href="/">← 記事一覧へ戻る</Link>
      <article>
        <header className="report-header">
          <p className="report-label">{article.label}</p>
          <h1>{article.headline}</h1>
          <p className="report-date">{article.displayDate}</p>
        </header>

        <div className="report-body">
          {article.sections.map((section) => (
            <section key={section.heading}>
              <h2>{section.heading}</h2>

              {section.paragraphs?.map((paragraph) => <p key={paragraph}>{paragraph}</p>)}

              {section.table && (
                <div className="table-wrap">
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
        </div>
      </article>
    </main>
  );
}
