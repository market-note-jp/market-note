import Link from 'next/link';
import { ArrowUpRight, Building2 } from 'lucide-react';
import type { Company, MediaArticle } from '../../lib/news-data';
import { formatNewsDate } from '../../lib/news-search.mjs';

export function CompanyPills({ codes, companies }: { codes: string[]; companies: Company[] }) {
  return <div className="news-company-pills">{codes.map(code => {
    const company = companies.find(item => item.code === code);
    return company ? <Link href={`/companies/${code}`} key={code}><Building2 size={12} aria-hidden="true" />{company.name}<span>{code}</span></Link> : null;
  })}</div>;
}

export function NewsArticleCard({ article, companies, headingLevel = 3 }: { article: MediaArticle; companies: Company[]; headingLevel?: 2 | 3 }) {
  const Heading = headingLevel === 2 ? 'h2' : 'h3';
  const external = !article.url.startsWith('/');
  const label = article.type === 'analysis' ? 'Market Note分析' : '公式発表・一次資料';
  return <article className="news-article-card">
    <div className="news-article-meta"><span className={`news-type news-type-${article.type}`}>{label}</span><span className="news-publisher">{article.sourceName}</span>{article.articleKind && <span>{article.articleKind}</span>}</div>
    <Heading>{external ? <a href={article.url} target="_blank" rel="noopener noreferrer">{article.title}<ArrowUpRight size={17} aria-hidden="true" /><span className="news-sr-only">（新しいタブで原文を開く）</span></a> : <Link href={article.url}>{article.title}<ArrowUpRight size={17} aria-hidden="true" /></Link>}</Heading>
    {article.excerpt && <p className="news-excerpt">{article.excerpt}</p>}
    <CompanyPills codes={article.companyCodes} companies={companies} />
    <div className="news-card-bottom"><span>{article.type === 'analysis' ? '公開' : '配信元記載日'}：{article.publishedAt ? <time dateTime={article.publishedAt}>{formatNewsDate(article.publishedAt, article.datePrecision)}</time> : '日付不明'}</span><span>{article.topics.slice(0, 3).join(' / ')}</span></div>
    {(article.linkNote || article.changeNotice || article.updatedAt) && <details className="news-article-notes"><summary>日時・リンクの補足</summary>{article.updatedAt && <p>配信元の更新：{formatNewsDate(article.updatedAt)}。公表日時とは区別しています。</p>}{article.changeNotice && <p>{article.changeNotice}</p>}{article.linkNote && <p>{article.linkNote}</p>}</details>}
  </article>;
}

export function CoverageNote() {
  return <p className="news-coverage-note"><strong>検索結果がないことは、ニュースが存在しないことを意味しません。</strong><br />検索対象は収録済みの見出し・許諾範囲の概要・メタデータです。企業の網羅的なIR収集や報道媒体の横断検索には対応していません。</p>;
}
