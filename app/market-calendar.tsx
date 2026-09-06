"use client";

import { useMemo, useState } from "react";
import type {
  CalendarEventCategory,
  CalendarEventRegion,
  MarketCalendarEvent,
} from "./market-calendar-data";

type MonthKey = `${number}-${string}`;
type CategoryFilter = "すべて" | CalendarEventCategory;
type RegionFilter = "すべて" | CalendarEventRegion;

const categoryFilters: CategoryFilter[] = ["すべて", "経済指標", "決算", "金融政策", "休場"];
const regionFilters: RegionFilter[] = ["すべて", "日本", "米国"];
const weekdays = ["月", "火", "水", "木", "金", "土", "日"];

function toMonthKey(date: string): MonthKey {
  return date.slice(0, 7) as MonthKey;
}

function dateNumber(date: string) {
  return Number(date.slice(8, 10));
}

function getMonthLabel(month: MonthKey) {
  const [year, rawMonth] = month.split("-");
  return `${year}年${Number(rawMonth)}月`;
}

function getWeekday(date: string) {
  const parsed = new Date(`${date}T00:00:00Z`);
  return ["日", "月", "火", "水", "木", "金", "土"][parsed.getUTCDay()];
}

function getCalendarCells(month: MonthKey) {
  const [year, rawMonth] = month.split("-").map(Number);
  const firstDay = new Date(year, rawMonth - 1, 1);
  const daysInMonth = new Date(year, rawMonth, 0).getDate();
  const mondayStartOffset = (firstDay.getDay() + 6) % 7;

  return [
    ...Array.from({ length: mondayStartOffset }, () => null),
    ...Array.from({ length: daysInMonth }, (_, index) => index + 1),
  ];
}

function byDateAndTime(left: MarketCalendarEvent, right: MarketCalendarEvent) {
  return `${left.date} ${left.time}`.localeCompare(`${right.date} ${right.time}`, "ja");
}

function EventBadge({ event }: { event: MarketCalendarEvent }) {
  return (
    <span className={`calendar-badge calendar-badge-${event.category}`}>
      {event.category}
    </span>
  );
}

export default function MarketCalendar({ events, initialMonth }: { events: MarketCalendarEvent[]; initialMonth?: string }) {
  const months = useMemo(
    () => Array.from(new Set(events.map((event) => toMonthKey(event.date)))).sort(),
    [events],
  );
  const [selectedMonth, setSelectedMonth] = useState<MonthKey>(
    months.find((month) => month === initialMonth) ?? months[0],
  );
  const [categoryFilter, setCategoryFilter] = useState<CategoryFilter>("すべて");
  const [regionFilter, setRegionFilter] = useState<RegionFilter>("すべて");
  const [selectedDate, setSelectedDate] = useState("");

  const filteredEvents = events
    .filter((event) => toMonthKey(event.date) === selectedMonth)
    .filter((event) => categoryFilter === "すべて" || event.category === categoryFilter)
    .filter((event) => regionFilter === "すべて" || event.region === regionFilter)
    .sort(byDateAndTime);
  const selectedDateEvents = selectedDate
    ? filteredEvents.filter((event) => event.date === selectedDate)
    : [];
  const listedEvents = selectedDate ? selectedDateEvents : filteredEvents;
  const eventsByDay = filteredEvents.reduce<Record<number, MarketCalendarEvent[]>>((grouped, event) => {
    const day = dateNumber(event.date);
    grouped[day] = [...(grouped[day] ?? []), event];
    return grouped;
  }, {});
  const cells = getCalendarCells(selectedMonth);

  const selectMonth = (month: MonthKey) => {
    setSelectedMonth(month);
    setSelectedDate("");
  };

  return (
    <div className="calendar-tool">
      <div className="calendar-controls" aria-label="予定の表示条件">
        <div className="calendar-control-group">
          <span>月</span>
          <div className="calendar-segmented">
            {months.map((month) => (
              <button
                className={month === selectedMonth ? "is-selected" : ""}
                type="button"
                key={month}
                onClick={() => selectMonth(month)}
                aria-pressed={month === selectedMonth}
              >
                {getMonthLabel(month)}
              </button>
            ))}
          </div>
        </div>
        <label className="calendar-select">
          <span>分類</span>
          <select value={categoryFilter} onChange={(event) => setCategoryFilter(event.target.value as CategoryFilter)}>
            {categoryFilters.map((filter) => <option value={filter} key={filter}>{filter}</option>)}
          </select>
        </label>
        <label className="calendar-select">
          <span>地域</span>
          <select value={regionFilter} onChange={(event) => setRegionFilter(event.target.value as RegionFilter)}>
            {regionFilters.map((filter) => <option value={filter} key={filter}>{filter}</option>)}
          </select>
        </label>
      </div>

      <div className="calendar-layout">
        <section className="month-panel" aria-label={`${getMonthLabel(selectedMonth)}のカレンダー`}>
          <div className="month-heading">
            <p className="kicker">MONTH</p>
            <h2>{getMonthLabel(selectedMonth)}</h2>
          </div>
          <div className="calendar-grid calendar-weekdays">
            {weekdays.map((weekday) => <span key={weekday}>{weekday}</span>)}
          </div>
          <div className="calendar-grid calendar-days">
            {cells.map((day, index) => {
              if (day === null) {
                return <span className="calendar-day is-empty" key={`empty-${index}`} />;
              }

              const dayEvents = eventsByDay[day] ?? [];
              const isoDate = `${selectedMonth}-${String(day).padStart(2, "0")}`;
              const isActive = selectedDate === isoDate;

              return (
                <button
                  className={`calendar-day${dayEvents.length > 0 ? " has-events" : ""}${isActive ? " is-active" : ""}`}
                  type="button"
                  key={isoDate}
                  onClick={() => setSelectedDate(isActive ? "" : isoDate)}
                  disabled={dayEvents.length === 0}
                  aria-pressed={isActive}
                  aria-label={`${day}日 ${dayEvents.length}件の予定`}
                >
                  <span>{day}</span>
                  <span className="day-dots" aria-hidden="true">
                    {dayEvents.slice(0, 3).map((event) => (
                      <i className={`dot dot-${event.category}`} key={event.id} />
                    ))}
                  </span>
                </button>
              );
            })}
          </div>
        </section>

        <section className="event-panel" aria-live="polite" aria-label="予定一覧">
          <div className="event-panel-heading">
            <div>
              <p className="kicker">SCHEDULE</p>
              <h2>{selectedDate ? `${Number(selectedDate.slice(5, 7))}月${Number(selectedDate.slice(8, 10))}日の予定` : "予定一覧"}</h2>
            </div>
            {selectedDate && (
              <button className="clear-date-button" type="button" onClick={() => setSelectedDate("")}>
                全日程
              </button>
            )}
          </div>

          {listedEvents.length === 0 && (
            <p className="empty-articles">選択した条件に当てはまる予定はありません。</p>
          )}

          <div className="event-list">
            {listedEvents.map((event) => (
              <article className="event-row" key={event.id}>
                <div className="event-date">
                  <strong>{dateNumber(event.date)}</strong>
                  <span>{getWeekday(event.date)}</span>
                </div>
                <div className="event-copy">
                  <div className="event-kinds">
                    <EventBadge event={event} />
                    <span>{event.region}</span>
                    <span>重要度：{event.importance}</span>
                  </div>
                  <h3>{event.title}</h3>
                  <p>{event.summary}</p>
                  <p className="event-meta">
                    <time dateTime={/^\d{2}:\d{2}$/.test(event.time) ? `${event.date}T${event.time}:00+09:00` : event.date}>{event.date} {event.time}</time>
                    {event.sourceTime && <span>現地基準：{event.sourceTime}</span>}
                  </p>
                  {event.forecast && (
                    <div className="event-forecast">
                      <div className="event-forecast-heading">
                        <span>市場予想</span>
                        <a href={event.forecast.sourceUrl} target="_blank" rel="noreferrer">
                          {event.forecast.sourceName}
                        </a>
                      </div>
                      <ul>
                        {event.forecast.values.map((value) => <li key={value}>{value}</li>)}
                      </ul>
                      <p>確認日：{event.forecast.reviewedAt}</p>
                    </div>
                  )}
                  <a className="source-link" href={event.sourceUrl} target="_blank" rel="noreferrer">
                    {event.sourceName}
                  </a>
                </div>
              </article>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}
