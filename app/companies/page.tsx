import type { Metadata } from 'next';
import Link from 'next/link';
import { ArrowLeft, ArrowUpRight, Building2 } from 'lucide-react';
import { getNewsData } from '../../lib/news-data';
import { CoverageNote } from '../news/news-components';
import '../news/news.css';

const title = '企業から探す | Market Note';
const description = 'Market Noteの登録企業から、関連する独自分析・公式発表と財務分析への入口を探す。';
export const metadata: Metadata = { title, description, openGraph: { title, description }, twitter: { title, description } };

export default function CompaniesPage() {
  const data = getNewsData();
  return <main id="main-content" className="news-shell news-wrap news-directory">
    <Link className="news-back-link" href="/news"><ArrowLeft size={15} aria-hidden="true" />ニュース探索へ</Link>
    <p className="kicker">COMPANY DIRECTORY</p><h1>企業から、情報をつなぐ。</h1><p className="news-directory-intro">登録企業{data.companies.length}社の関連記事と独自分析をまとめています。<br />気になる企業を選び、原文や財務分析へ進めます。</p>
    <div className="news-directory-grid">{data.companies.map(company => {
      const articles = data.articles.filter(article => article.companyCodes.includes(company.code));
      const reports = articles.filter(article => article.type === 'analysis');
      return <Link className="news-directory-card" href={`/companies/${company.code}`} key={company.code}><div className="news-directory-top"><span>{company.code}</span><Building2 size={23} aria-hidden="true" /></div><h2>{company.name}</h2><p>{reports.length > 0 ? `Market Note分析 ${reports.length}件` : 'Market Note分析は現在未収録'}<br />公式発表 {articles.filter(article => article.type === 'official').length}件（収録分）</p><span className="news-text-link">企業ページを読む <ArrowUpRight size={17} aria-hidden="true" /></span></Link>;
    })}</div>
    <CoverageNote />
  </main>;
}
