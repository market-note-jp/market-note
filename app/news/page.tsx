import type { Metadata } from 'next';
import { getNewsData } from '../../lib/news-data';
import NewsExplorer from './news-explorer';
import './news.css';

const title = 'ニュースを探す | Market Note';
const description = '公式発表・経済統計とMarket Noteの独自分析を、企業名・証券コード・テーマ・公表日から探す。原文と企業の財務分析へつなぐ検索ページ。';
export const metadata: Metadata = { title, description, openGraph: { title, description }, twitter: { title, description } };

export default function NewsPage() {
  return <main id="main-content" className="news-shell"><NewsExplorer data={getNewsData()} /></main>;
}
