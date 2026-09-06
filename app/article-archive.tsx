"use client";

import Link from "next/link";
import { useState } from "react";
import { ArrowUpRight, ChevronLeft, ChevronRight } from "lucide-react";

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

type ArticleFilter = {
  id: "all" | "daily" | "weekly" | "earnings" | "corporate";
  label: string;
  kind?: string;
};

const articleFilters: ArticleFilter[] = [
  { id: "all", label: "すべて" },
  { id: "daily", label: "日次", kind: "日次レポート" },
  { id: "weekly", label: "週次", kind: "週次レポート" },
  { id: "earnings", label: "決算", kind: "決算記事" },
  { id: "corporate", label: "企業", kind: "企業レポート" },
];

type ArticleFilterId = ArticleFilter["id"];

export default function ArticleArchive({ articles }: { articles: Article[] }) {
  const [currentPage, setCurrentPage] = useState(1);
  const [activeFilter, setActiveFilter] = useState<ArticleFilterId>("all");
  const [selectedYear, setSelectedYear] = useState("");
  const [selectedMonth, setSelectedMonth] = useState("");
  const selectedFilter = articleFilters.find((filter) => filter.id === activeFilter)!;
  const typeFilteredArticles = selectedFilter.kind
    ? articles.filter((article) => article.kind === selectedFilter.kind)
    : articles;
  const availableYears = Array.from(new Set(articles.map((article) => article.date.slice(0, 4))))
    .sort((left, right) => Number(right) - Number(left));
  const availableMonths = Array.from(new Set(
    articles
      .filter((article) => !selectedYear || article.date.startsWith(`${selectedYear}-`))
      .map((article) => article.date.slice(5, 7)),
  )).sort((left, right) => Number(right) - Number(left));
  const filteredArticles = typeFilteredArticles.filter((article) => (
    (!selectedYear || article.date.startsWith(`${selectedYear}-`))
    && (!selectedMonth || article.date.slice(5, 7) === selectedMonth)
  ));
  const pageCount = Math.ceil(filteredArticles.length / ARTICLES_PER_PAGE);
  const startIndex = (currentPage - 1) * ARTICLES_PER_PAGE;
  const pageArticles = filteredArticles.slice(startIndex, startIndex + ARTICLES_PER_PAGE);
  const firstArticleNumber = filteredArticles.length === 0 ? 0 : startIndex + 1;
  const lastArticleNumber = Math.min(startIndex + ARTICLES_PER_PAGE, filteredArticles.length);

  const goToPage = (page: number) => {
    setCurrentPage(page);
    window.requestAnimationFrame(() => {
      document.getElementById("articles")?.scrollIntoView({ behavior: "smooth", block: "start" });
    });
  };

  const selectFilter = (filter: ArticleFilterId) => {
    setActiveFilter(filter);
    setCurrentPage(1);
    window.requestAnimationFrame(() => {
      document.getElementById("articles")?.scrollIntoView({ behavior: "smooth", block: "start" });
    });
  };

  const selectYear = (year: string) => {
    setSelectedYear(year);
    setSelectedMonth("");
    setCurrentPage(1);
  };

  const selectMonth = (month: string) => {
    setSelectedMonth(month);
    setCurrentPage(1);
  };

  const activeFilterLabel = [
    selectedFilter.label,
    selectedYear && `${selectedYear}年`,
    selectedMonth && `${Number(selectedMonth)}月`,
  ].filter(Boolean).join("・");

  return (
    <>
      <nav className="tabs" aria-label="記事の種類">
        {articleFilters.map((filter) => {
          const isActive = filter.id === activeFilter;
          const filterCount = filter.kind
            ? articles.filter((article) => article.kind === filter.kind).length
            : articles.length;

          return (
            <button
              className={`tab${isActive ? " active" : ""}`}
              type="button"
              key={filter.id}
              onClick={() => selectFilter(filter.id)}
              aria-pressed={isActive}
            >
              {filter.label}<span className="tab-count">{filterCount}</span>
            </button>
          );
        })}
      </nav>

      <div className="period-filters" aria-label="記事の期間">
        <label className="period-filter">
          <span>年</span>
          <select value={selectedYear} onChange={(event) => selectYear(event.target.value)}>
            <option value="">すべての年</option>
            {availableYears.map((year) => <option key={year} value={year}>{year}年</option>)}
          </select>
        </label>
        <label className="period-filter">
          <span>月</span>
          <select
            value={selectedMonth}
            onChange={(event) => selectMonth(event.target.value)}
            disabled={!selectedYear}
          >
            <option value="">すべての月</option>
            {availableMonths.map((month) => <option key={month} value={month}>{Number(month)}月</option>)}
          </select>
        </label>
      </div>

      <div className="article-list" aria-live="polite">
        {pageArticles.length === 0 && (
          <p className="empty-articles">選択した条件に当てはまる記事はありません。</p>
        )}
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
              <ArrowUpRight className="article-arrow" size={21} aria-hidden="true" />
            </Link>
          </article>
        ))}
      </div>

      <nav className="pagination" aria-label="記事一覧のページ">
        <p className="pagination-summary">
          <strong>{firstArticleNumber}–{lastArticleNumber}件</strong> / {activeFilterLabel} {filteredArticles.length}件
        </p>
        {pageCount > 1 && (
          <div className="pagination-controls">
            <button
              className="page-button page-button-nav"
              type="button"
              onClick={() => goToPage(currentPage - 1)}
              disabled={currentPage === 1}
              aria-label="前のページ"
              title="前のページ"
            >
              <ChevronLeft size={18} aria-hidden="true" />
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
              aria-label="次のページ"
              title="次のページ"
            >
              <ChevronRight size={18} aria-hidden="true" />
            </button>
          </div>
        )}
      </nav>
    </>
  );
}
