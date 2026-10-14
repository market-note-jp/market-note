import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { ArrowLeft, ArrowRight, ArrowUpRight, ChartNoAxesCombined } from 'lucide-react';
import { getNewsData } from '../../../lib/news-data';
import { filterNews } from '../../../lib/news-search.mjs';
import { CoverageNote, NewsArticleCard } from '../../news/news-components';
import '../../news/news.css';

export const dynamicParams = false;
export function generateStaticParams() { return getNewsData().companies.map(company => ({ code: company.code })); }
type Props = { params: Promise<{ code: string }> };
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { code } = await params;
  const company = getNewsData().companies.find(item => item.code === code);
  if (!company) return {};
  const title = `${company.name}（${company.code}）のニュース・分析 | Market Note`;
  const description = `${company.name}の収録済み記事とMarket Noteの独自分析を確認。企業の財務分析につなげます。`;
  return { title, description, openGraph: { title, description }, twitter: { title, description } };
}

export default async function CompanyPage({ params }: Props) {
  const { code } = await params;
  const data = getNewsData();
  const company = data.companies.find(item => item.code === code);
  if (!company) notFound();
  const articles = filterNews(data.articles.filter(article => article.companyCodes.includes(code)), data.companies);
  const reports = articles.filter(article => article.type === 'analysis' && article.articleKind === '企業レポート');
  const related = articles.filter(article => article.type === 'analysis' && article.articleKind !== '企業レポート');
  const official = articles.filter(article => article.type === 'official');
  return <main id="main-content" className="news-shell news-wrap news-company-page">
    <nav className="news-breadcrumb" aria-label="パンくず"><Link href="/news">ニュース探索</Link><span aria-hidden="true">/</span><Link href="/companies">企業を探す</Link><span aria-hidden="true">/</span><span>{company.code}</span></nav>
    <div className="news-company-hero"><section aria-labelledby="company-news-title"><p className="kicker">COMPANY RESEARCH <span className="news-company-code">{company.code}</span></p><h1 id="company-news-title">{company.name}</h1><p>この企業に関連づけられた収録情報と、Market Noteの分析をまとめています。業績や企業価値の背景を、原文と財務データから確かめられます。</p><div className="news-company-stats"><div><strong>{reports.length + related.length}</strong><span>Market Note分析</span></div><div><strong>{official.length}</strong><span>公式発表（収録分）</span></div></div></section>
    <aside className="news-analysis-cta" aria-labelledby="company-analysis-cta"><ChartNoAxesCombined size={25} aria-hidden="true" /><p className="kicker">MARKET NOTE × KANALYZER</p><h2 id="company-analysis-cta">数字から、<br />企業を確かめる。</h2><Link className="news-primary-button" href={`/company-analysis?company=${encodeURIComponent(company.name)}`}>この企業を財務分析 <ArrowUpRight size={16} aria-hidden="true" /></Link><p>企業名を入力した状態で開きます。条件を確認し、検索ボタンを押すと分析を開始します。</p></aside></div>
    <nav className="news-company-tabs" aria-label="企業ページ内の項目"><a href="#company-reports">企業レポート <span>{reports.length}</span></a><a href="#company-related">関連する独自分析 <span>{related.length}</span></a><a href="#company-official">公式発表 <span>{official.length}</span></a></nav>
    <div className="news-company-body"><div>
      <section id="company-reports" className="news-company-section"><p className="kicker">IN-DEPTH RESEARCH</p><h2>Market Noteの企業レポート</h2><p className="news-small-note">事業・業績・リスクを詳しく扱う、本サイトの独自分析です。</p>{reports.length ? reports.map(article => <NewsArticleCard key={article.id} article={article} companies={data.companies} />) : <p className="news-inline-empty">この企業の企業レポートは現在収録していません。</p>}</section>
      <section id="company-related" className="news-company-section"><p className="kicker">RELATED ANALYSIS</p><h2>関連する独自分析</h2><p className="news-small-note">この企業に言及した日次レポートなど。すべてが同じ出来事や決算を扱うわけではありません。</p>{related.length ? related.map(article => <NewsArticleCard key={article.id} article={article} companies={data.companies} />) : <p className="news-inline-empty">関連する独自分析は現在収録していません。</p>}</section>
      <section id="company-official" className="news-company-section"><p className="kicker">OFFICIAL SOURCES</p><h2>公式発表・一次資料</h2>{official.length ? official.map(article => <NewsArticleCard key={article.id} article={article} companies={data.companies} />) : <p className="news-inline-empty">この企業に直接関連づけられた公式発表は現在収録していません。企業IRの網羅的な自動取得は未対応です。発表が存在しないことを意味しません。</p>}</section>
    </div><aside className="news-company-aside"><section className="news-coverage-panel"><p className="kicker">READ WITH CONTEXT</p><h2>情報の範囲を確かめる。</h2><p>公式発表、第三者の報道、本サイトの独自分析は、それぞれ役割が異なります。現在は報道媒体の記事を収録していません。</p><p>企業への関連づけは検索用の索引です。同じ企業への言及だけで、同じ出来事の比較にはまとめません。</p><Link className="news-text-link" href="/news#news-sources">出典と取得状況 <ArrowRight size={14} aria-hidden="true" /></Link></section><Link className="news-text-link" href={`/news?q=${encodeURIComponent(company.code)}`}>ニュース検索で条件を絞る <ArrowRight size={14} aria-hidden="true" /></Link></aside></div>
    <CoverageNote /><Link className="news-back-link" href="/companies"><ArrowLeft size={15} aria-hidden="true" />登録企業一覧へ</Link>
  </main>;
}
