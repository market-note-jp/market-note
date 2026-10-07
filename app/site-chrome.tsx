import Link from "next/link";
import MobileNavigation from "./mobile-navigation";
import { ArrowUpRight, CalendarDays } from "lucide-react";

export function SiteHeader() {
  return (
    <header className="site-header">
      <a className="skip-link" href="#main-content">本文へ移動</a>
      <div className="site-header-inner">
        <Link className="brand" href="/" aria-label="Market Note ホーム">
          <span className="brand-mark" aria-hidden="true">M</span>
          <span>MARKET NOTE<small>MARKET & CORPORATE RESEARCH</small></span>
        </Link>
        <nav className="desktop-navigation" aria-label="メインナビゲーション">
          <Link href="/#articles">レポート</Link>
          <Link href="/#companies">企業レポート</Link>
          <Link href="/company-analysis">財務分析</Link>
          <Link href="/airi">AIRI・AI株指標</Link>
          <Link href="/calendar"><CalendarDays size={16} aria-hidden="true" />市場カレンダー</Link>
          <Link href="/#policy">Market Noteについて</Link>
        </nav>
        <MobileNavigation />
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
          <Link href="/#companies">企業レポート <ArrowUpRight size={16} aria-hidden="true" /></Link>
          <Link href="/company-analysis">財務分析 <ArrowUpRight size={16} aria-hidden="true" /></Link>
          <Link href="/airi">AIRI・AI株指標 <ArrowUpRight size={16} aria-hidden="true" /></Link>
          <Link href="/calendar">市場カレンダー <ArrowUpRight size={16} aria-hidden="true" /></Link>
        </nav>
      </div>
      <div className="footer-legal"><span>© Market Note</span><span>情報提供を目的とし、投資勧誘・売買推奨は行いません。</span></div>
    </footer>
  );
}
