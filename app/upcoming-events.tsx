"use client";
import Link from "next/link";
import { useSyncExternalStore } from "react";
import { ArrowRight, ArrowUpRight, CalendarDays } from "lucide-react";
import { marketCalendarEvents, marketCalendarReviewedAt } from "./market-calendar-data";

export function todayInJapan(now = new Date()) {
  return new Intl.DateTimeFormat("sv-SE", { timeZone: "Asia/Tokyo", year: "numeric", month: "2-digit", day: "2-digit" }).format(now);
}

function subscribeToClock(refresh: () => void) {
  const timer = window.setInterval(refresh, 60_000);
  return () => window.clearInterval(timer);
}

export default function UpcomingEvents({ today }: { today?: string }) {
  // Render a neutral shell during static export, then select using the visitor's JST date.
  const clockToday = useSyncExternalStore(subscribeToClock, todayInJapan, () => "");
  const liveToday = today ?? clockToday;
  const upcoming = marketCalendarEvents.filter(event => event.date >= liveToday)
    .sort((a, b) => `${a.date} ${a.time}`.localeCompare(`${b.date} ${b.time}`)).slice(0, 4);
  return <aside className="upcoming-panel" aria-labelledby="upcoming-title">
    <div className="upcoming-heading"><CalendarDays size={22} aria-hidden="true" /><div><p className="kicker">MARKET CALENDAR</p><h3 id="upcoming-title">直近の予定</h3></div></div>
    <p className="schedule-asof">予定データ更新：{marketCalendarReviewedAt}<br />時刻は日本時間。公表予定は変更される場合があります。</p>
    {!liveToday ? <p className="schedule-empty">現在の日付を確認しています。<noscript>予定は市場カレンダーで確認できます。</noscript></p> : upcoming.length ? <ol className="upcoming-list">{upcoming.map(event => <li key={event.id}><a href={event.sourceUrl} target="_blank" rel="noreferrer">
      <time dateTime={event.date}><strong>{Number(event.date.slice(5, 7))}/{Number(event.date.slice(8, 10))}</strong><span>{event.time}</span></time>
      <div><span className={`event-type event-type-${event.category}`}>{event.category} / {event.region}</span><h4>{event.title}</h4></div><ArrowUpRight size={15} aria-hidden="true" />
    </a></li>)}</ol> : <p className="schedule-empty">現在、登録済みの今後の予定はありません。</p>}
    <Link className="calendar-all-link" href="/calendar">市場カレンダーを見る <ArrowRight size={18} aria-hidden="true" /></Link>
  </aside>;
}
