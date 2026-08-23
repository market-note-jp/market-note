import type { Metadata } from "next";
import Link from "next/link";
import MarketCalendar from "../market-calendar";
import { marketCalendarEvents, marketCalendarReviewedAt } from "../market-calendar-data";

export const metadata: Metadata = {
  title: "市場カレンダー | Market Note",
  description: "決算、経済指標、金融政策イベントを確認できるMarket Noteの市場カレンダー。",
};

export default function CalendarPage() {
  return (
    <main className="site-shell">
      <header className="site-header">
        <Link className="brand" href="/">
          <span className="brand-mark">M</span>
          <span>MARKET NOTE<small>日本株・米国株のニュースレポート</small></span>
        </Link>
        <nav aria-label="メインナビゲーション">
          <Link href="/">記事一覧</Link>
          <Link href="/calendar">市場カレンダー</Link>
          <Link href="/#policy">このサイトについて</Link>
        </nav>
      </header>

      <section className="intro calendar-intro">
        <p className="kicker">MARKET CALENDAR</p>
        <h1>決算と指標を、先に見ておく。</h1>
        <p>主要企業の決算、米日マクロ指標、金融政策イベントを、公式ソースへのリンク付きで整理します。</p>
        <p className="calendar-review-note">最終確認日：{marketCalendarReviewedAt}。公表予定は変更される場合があります。</p>
      </section>

      <section className="calendar-section" aria-labelledby="calendar-title">
        <div className="section-title-row">
          <div>
            <p className="kicker">EVENTS</p>
            <h2 id="calendar-title">市場カレンダー</h2>
          </div>
          <p>{marketCalendarEvents.length}件</p>
        </div>
        <MarketCalendar events={marketCalendarEvents} />
      </section>

      <section className="policy">
        <p className="kicker">EDITORIAL POLICY</p>
        <h2>予定は判断材料の入口として扱います。</h2>
        <p>このカレンダーは、公開予定の確認と記事作成のための整理です。特定の銘柄や指数の売買を推奨するものではありません。</p>
      </section>

      <footer><span>MARKET NOTE</span><span>Public market research archive / Not investment advice.</span></footer>
    </main>
  );
}
