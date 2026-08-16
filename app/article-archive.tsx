"use client";

import Link from "next/link";
import { useState } from "react";

type Article = {
  kind: string;
  theme?: string;
  date: string;
  dateTime?: string;
  title: string;
  excerpt: string;
  href: string;
};

const ARTICLES_PER_PAGE = 10;

export default function ArticleArchive({ articles }: { articles: Article[] }) {
  const [currentPage, setCurrentPage] = useState(1);
  const pageCount = Math.ceil(articles.length / ARTICLES_PER_PAGE);
  const startIndex = (currentPage - 1) * ARTICLES_PER_PAGE;
  const pageArticles = articles.slice(startIndex, startIndex + ARTICLES_PER_PAGE);
  const firstArticleNumber = articles.length === 0 ? 0 : startIndex + 1;
  const lastArticleNumber = Math.min(startIndex + ARTICLES_PER_PAGE, articles.length);

  const goToPage = (page: number) => {
    setCurrentPage(page);
    window.requestAnimationFrame(() => {
      document.getElementById("articles")?.scrollIntoView({ behavior: "smooth", block: "start" });
    });
  };

  return (
    <>
      <div className="article-list" aria-live="polite">
        {pageArticles.map((article) => (
          <article className="article-row" key={article.href}>
            <Link href={article.href} aria-label={`${article.title}を読む`}>
              <div className="article-copy">
                <p className="article-kind">{article.kind}</p>
                <h3>{article.title}</h3>
                <p className="article-excerpt">{article.excerpt}</p>
                <p className="article-meta">
                  <time dateTime={article.dateTime}>{article.date}</time>
                  <span>テーマ：{article.theme ?? "市場ニュース"}</span>
                </p>
              </div>
              <span className="article-arrow" aria-hidden="true">→</span>
            </Link>
          </article>
        ))}
      </div>

      {pageCount > 1 && (
        <nav className="pagination" aria-label="記事一覧のページ">
          <p className="pagination-summary">
            <strong>{firstArticleNumber}–{lastArticleNumber}件</strong> / {articles.length}件
          </p>
          <div className="pagination-controls">
            <button
              className="page-button page-button-nav"
              type="button"
              onClick={() => goToPage(currentPage - 1)}
              disabled={currentPage === 1}
            >
              ← 前へ
            </button>
            {Array.from({ length: pageCount }, (_, index) => index + 1).map((page) => (
              <button
                className={`page-button${page === currentPage ? " is-active" : ""}`}
                type="button"
                key={page}
                onClick={() => goToPage(page)}
                aria-current={page === currentPage ? "page" : undefined}
                aria-label={`${page}ページ目を表示`}
              >
                {page}
              </button>
            ))}
            <button
              className="page-button page-button-nav"
              type="button"
              onClick={() => goToPage(currentPage + 1)}
              disabled={currentPage === pageCount}
            >
              次へ →
            </button>
          </div>
        </nav>
      )}
    </>
  );
}
