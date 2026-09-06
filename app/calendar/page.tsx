import type { Metadata } from "next";
import Link from "next/link";
import MarketCalendar from "../market-calendar";
import { marketCalendarEvents, marketCalendarReviewedAt } from "../market-calendar-data";

export const metadata: Metadata = {
  title: "市場カレンダー | Market Note",
  description: "決算、経済指標、金融政策、日米市場の休場日を確認できるMarket Noteの市場カレンダー。",
};

export default function CalendarPage() {
  return (
    <main className="site-shell">
      <section className="intro calendar-intro">
        <Link className="calendar-breadcrumb" href="/">ホーム /</Link>
        <p className="kicker">MARKET CALENDAR</p>
        <h1>市場カレンダー</h1>
        <p>主要企業の決算、日米の経済指標・金融政策・休場日。</p>
        <p className="calendar-review-note">予定更新日：{marketCalendarReviewedAt}。時刻は日本時間、休場日は現地市場の取引日基準。公表予定は変更される場合があります。</p>
      </section>

      <section className="calendar-section" aria-labelledby="calendar-title">
        <div className="section-title-row">
          <div>
            <p className="kicker">EVENTS</p>
            <h2 id="calendar-title">市場カレンダー</h2>
          </div>
          <p>{marketCalendarEvents.length}件</p>
        </div>
        <MarketCalendar events={marketCalendarEvents} initialMonth={marketCalendarReviewedAt.slice(0, 7)} />
      </section>

    </main>
  );
}
