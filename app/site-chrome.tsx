import Link from "next/link";
import { ArrowUpRight, CalendarDays } from "lucide-react";

export function SiteHeader() {
  return (
    <header className="site-header">
      <div className="site-header-inner">
        <Link className="brand" href="/" aria-label="Market Note ホーム">
          <span className="brand-mark" aria-hidden="true">M</span>
          <span>MARKET NOTE<small>MARKET & CORPORATE RESEARCH</small></span>
        </Link>
        <nav aria-label="メインナビゲーション">
          <Link href="/#articles">レポート</Link>
          <Link href="/#companies">企業分析</Link>
          <Link href="/calendar"><CalendarDays size={16} aria-hidden="true" />市場カレンダー</Link>
          <Link href="/#policy">Market Noteについて</Link>
        </nav>
      </div>
    </header>
  );
}

export function SiteFooter() {
  return (
    <footer className="site-footer">
      <div className="site-footer-inner">
        <div><Link className="footer-brand" href="/">MARKET NOTE</Link><p>市場を読む。企業を知る。</p></div>
        <nav aria-label="フッターナビゲーション">
          <Link href="/#articles">レポート一覧 <ArrowUpRight size={16} aria-hidden="true" /></Link>
          <Link href="/#companies">企業分析 <ArrowUpRight size={16} aria-hidden="true" /></Link>
          <Link href="/calendar">市場カレンダー <ArrowUpRight size={16} aria-hidden="true" /></Link>
        </nav>
      </div>
      <div className="footer-legal"><span>© Market Note</span><span>情報提供を目的とし、投資勧誘・売買推奨は行いません。</span></div>
    </footer>
  );
}
