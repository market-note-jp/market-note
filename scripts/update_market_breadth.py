"""Validated end-of-day MN225 accumulator. Python standard library only.

Reads a pinned data-branch checkout and verified official inputs, writes a candidate
tree to --output. Never publishes, rewrites a past day, or fills a missing session.
"""
from __future__ import annotations

import argparse
import copy
import csv
import hashlib
import io
import json
import math
import re
import statistics
import urllib.request
from datetime import date, datetime, time, timedelta
from html.parser import HTMLParser
from pathlib import Path
from zoneinfo import ZoneInfo

JST = ZoneInfo("Asia/Tokyo")
PRICES_URL = "https://www.traders.co.jp/market_jp/nikkei225/all/stock-asc"
HOLIDAY_URL = "https://www8.cao.go.jp/chosei/shukujitsu/syukujitsu.csv"
COMPONENTS_URL = "https://indexes.nikkei.co.jp/nkave/index/component?idx=nk225"


def require(condition, message):
    if not condition:
        raise ValueError(message)


def digest(value):
    return hashlib.sha256(json.dumps(value, sort_keys=True, separators=(",", ":"), ensure_ascii=False, allow_nan=False).encode()).hexdigest()


def fetch(url):
    request = urllib.request.Request(url, headers={"User-Agent": "MarketNote-EOD/1.0 (public end-of-day research)"})
    with urllib.request.urlopen(request, timeout=40) as response:
        require(response.status == 200, f"HTTP {response.status}: {url}")
        return response.read()


def calendar_from_csv(raw):
    rows = list(csv.reader(io.StringIO(raw.decode("cp932"))))[1:]
    holidays = sorted({date.fromisoformat(row[0].replace("/", "-") if len(row[0]) == 10 else datetime.strptime(row[0], "%Y/%m/%d").date().isoformat()).isoformat() for row in rows if row and row[0]})
    years = sorted({int(day[:4]) for day in holidays})
    require(years and years[-1] >= 2026, "Official holiday calendar is incomplete")
    for year in years:
        holidays.extend([f"{year}-01-01", f"{year}-01-02", f"{year}-01-03", f"{year}-12-31"])
    return {"years": [year for year in years if year >= 2026], "closedDates": sorted({day for day in holidays if day >= "2026-01-01"}), "source": HOLIDAY_URL}


def is_session(day, calendar):
    require(day.year in calendar["years"], f"Calendar does not cover {day.year}; refresh official holidays first")
    return day.weekday() < 5 and day.isoformat() not in calendar["closedDates"]


def previous_session(day, calendar):
    day -= timedelta(days=1)
    while not is_session(day, calendar):
        day -= timedelta(days=1)
    return day


def latest_closed_session(now, calendar):
    now = now.astimezone(JST)
    day = now.date()
    if is_session(day, calendar) and now.time() >= time(15, 30):
        return day
    return previous_session(day, calendar)


class QuoteTable(HTMLParser):
    """Handles the provider's missing </td> before the description cell."""
    def __init__(self):
        super().__init__(convert_charrefs=True)
        self.rows, self.cells, self.parts = [], None, None

    def flush(self):
        if self.parts is not None and self.cells is not None:
            self.cells.append(" ".join(self.parts).strip())
        self.parts = None

    def handle_starttag(self, tag, attrs):
        if tag == "tr":
            self.cells = []
        elif tag in ("td", "th"):
            self.flush()
            self.parts = []
        elif tag == "br" and self.parts is not None:
            self.parts.append(" ")

    def handle_endtag(self, tag):
        if tag in ("td", "th"):
            self.flush()
        elif tag == "tr":
            self.flush()
            if self.cells:
                self.rows.append(self.cells)
            self.cells = None

    def handle_data(self, data):
        if self.parts is not None:
            self.parts.append(data)


def parse_quotes(html):
    start = html.find("<h1>日経225銘柄</h1>")
    require(start >= 0, "Quote page heading changed")
    body = html[start:]
    stamp = re.search(r'data_table_timestamp[^>]*>\s*(\d{4}/\d{2}/\d{2} \d{2}:\d{2})', body)
    require(stamp, "Missing quote observation time")
    observed = datetime.strptime(stamp[1], "%Y/%m/%d %H:%M").replace(tzinfo=JST)
    table = re.search(r"<table\b[^>]*>.*?</table>", body, re.S)
    require(table, "Missing quote table")
    parser = QuoteTable()
    parser.feed(table[0])
    quotes = []
    for cells in parser.rows:
        if len(cells) < 4:
            continue
        code = re.search(r"\(([0-9A-Z]{4})/東", cells[0])
        if not code:
            continue
        numbers = re.findall(r"[+−-]?[\d,]+(?:\.\d+)?", cells[3])
        require(len(numbers) == 2, f"Missing daily change for {code[1]}")
        number = lambda x: float(x.replace(",", "").replace("−", "-"))
        quotes.append({"code": code[1], "close": number(cells[2]), "change": number(numbers[0]), "displayedChangePct": number(numbers[1])})
    return {"date": observed.date().isoformat(), "observedAt": observed.isoformat(), "rows": quotes}


def validate_inputs(quotes, official, calendar, now):
    target = latest_closed_session(now, calendar).isoformat()
    require(quotes["date"] == official["date"] == target, f"Dates must match latest closed session {target}")
    stamp = datetime.fromisoformat(quotes["observedAt"])
    require(stamp.tzinfo is not None and stamp.astimezone(JST).date().isoformat() == target and stamp.astimezone(JST).time() >= time(15, 30), "Quotes are intraday or lack a time zone")
    require(stamp <= now, "Quote observation is in the future")
    rows = quotes["rows"]
    codes = [row["code"] for row in rows]
    members = official["codes"]
    require(len(codes) == len(set(codes)) == len(members) == len(set(members)) == 225, "Need 225 unique quotes and official constituents")
    require(set(codes) == set(members), "Official constituent set differs from quotes")
    require(all(re.fullmatch(r"[0-9A-Z]{4}", code) for code in codes), "Invalid security code")
    require(official["componentsAsOf"] == target, "Verify constituents effective on the target session")
    require(official["summaryURL"] == f'https://indexes.nikkei.co.jp/nkave/archives/summary?dt={target.replace("-", "")}&idx=nk225', "Wrong official summary URL")
    returns, max_error = [], 0
    for row in rows:
        close, change, displayed = (row[key] for key in ("close", "change", "displayedChangePct"))
        require(all(isinstance(v, (int, float)) and math.isfinite(v) for v in (close, change, displayed)), "Nonfinite quote")
        require(close > 0 and close - change > 0, "Invalid close or previous reference close")
        ret = change / (close - change)
        error = abs(ret * 100 - displayed)
        require(error <= 0.005001, f'Daily return mismatch: {row["code"]}')
        max_error = max(max_error, error)
        returns.append(ret)
    counts = [sum(r > 0 for r in returns), sum(r < 0 for r in returns), sum(r == 0 for r in returns)]
    require(counts == [official["up"], official["down"], official["flat"]] and sum(counts) == 225, "Daily counts do not match official summary")
    require(all(isinstance(official[key], (int, float)) and math.isfinite(official[key]) for key in ("close", "change")), "Invalid official close/change")
    require(official["close"] > 0 and official["close"] - official["change"] > 0, "Invalid official previous close")
    fingerprint = digest({"date": target, "quotes": sorted(rows, key=lambda x: x["code"]), "codes": sorted(members), "close": official["close"], "change": official["change"], "counts": counts})
    return returns, max_error, fingerprint


def accumulate(latest, state, quotes, official, calendar, now):
    returns, max_error, fingerprint = validate_inputs(quotes, official, calendar, now)
    day = quotes["date"]
    require(state["date"] == latest["date"] == latest["history"][-1]["date"], "State/history date mismatch")
    require(state["inputSHA256"] == latest["inputSHA256"], "State/input digest mismatch")
    require(state["baseDate"] == latest["baseDate"] == "2026-10-22" and state["baseValue"] == latest["baseValue"] == 100, "Index baseline must remain 2026-10-22 = 100")
    if day == state["date"]:
        require(fingerprint == state["inputSHA256"], "Past input changed: hold for reviewed correction; never overwrite")
        return {"status": "unchanged", "date": day, "files": {}}
    require(day > state["date"], "Refuse to replace historical data")
    require(previous_session(date.fromisoformat(day), calendar).isoformat() == state["date"], "Missing trading session: recover verified historical inputs before chaining")
    previous_nikkei = official["close"] - official["change"]
    require(abs(previous_nikkei - latest["metrics"]["nikkeiClose"]) <= 0.005, "Official previous close does not match stored close")
    require(abs(state["level"] - latest["level"]) < 1e-7, "Stored index/state mismatch")
    result = copy.deepcopy(latest)
    ew_return = statistics.mean(returns)
    nk_return = official["change"] / previous_nikkei
    level = state["level"] * (1 + ew_return)
    rolling, ma = {}, []
    for quote, ret in zip(quotes["rows"], returns):
        old = state["normalizedLevels"].get(quote["code"])
        require(old is None or (1 <= len(old) <= 25 and all(isinstance(v, (float, int)) and math.isfinite(v) and v > 0 for v in old)), "Invalid moving average state")
        # A newly admitted company starts at its own previous reference close.
        values = ((old if old is not None else [100.0]) + [(old[-1] if old else 100.0) * (1 + ret)])[-25:]
        rolling[quote["code"]] = values
        if len(values) == 25:
            ma.append(values[-1] > statistics.mean(values))
    median = statistics.median(returns)
    row = {"date": day, "ew": level / latest["baseValue"] * 100, "return": ew_return, "median": median, "advanceRatio": official["up"] / 225 * 100, "aboveMA25": sum(ma) / len(ma) * 100 if ma else None, "advancers": official["up"], "decliners": official["down"], "unchanged": official["flat"], "count": 225, "maEligible": len(ma)}
    result.update({"date": day, "observedAt": quotes["observedAt"], "retrieved": now.astimezone(JST).isoformat(), "updatedAt": now.astimezone(JST).isoformat(), "inputSHA256": fingerprint, "constituentsSHA256": digest(sorted(official["codes"])), "level": level, "pointChange": level - state["level"], "calendar": calendar})
    result["history"].append(row)
    result["source"]["validation"]["url"] = official["summaryURL"]
    result["source"]["constituents"]["updated"] = official["componentsAsOf"]
    result["metrics"] = {"nikkeiClose": official["close"], "nikkeiPreviousClose": previous_nikkei, "nikkeiChange": official["change"], "nikkeiReturnPct": nk_return * 100, "equalWeightReturnPct": ew_return * 100, "medianReturnPct": median * 100, "advancers": official["up"], "decliners": official["down"], "unchanged": official["flat"], "advancerPct": official["up"] / 225 * 100, "nikkeiMinusEqualWeightPp": (nk_return - ew_return) * 100}
    result["validation"] = {"count": 225, "constituentSetMatch": True, "officialUp": official["up"], "officialDown": official["down"], "officialFlat": official["flat"], "calculatedUp": official["up"], "calculatedDown": official["down"], "calculatedFlat": official["flat"], "maxAbsoluteDifferenceVsDisplayedReturnPp": max_error}
    result["official"]["rows"].append({"date": day, "close": official["close"], "change": official["change"], "changePct": nk_return * 100, "up": official["up"], "down": official["down"], "flat": official["flat"], "url": official["summaryURL"]})
    result["method"]["historyAvailable"] = f'{len(result["history"]) - 1} daily return observations accumulated since {result["baseDate"]}; no backfilled or simulated observations.'
    new_state = {"schemaVersion": 1, "date": day, "baseDate": latest["baseDate"], "baseValue": latest["baseValue"], "level": level, "inputSHA256": fingerprint, "normalizedLevels": rolling}
    archive = {"schemaVersion": 1, "baseDate": latest["baseDate"], "baseValue": latest["baseValue"], "date": day, "level": level, "pointChange": result["pointChange"], "metrics": result["metrics"], "breadth": row, "source": result["source"], "observedAt": quotes["observedAt"], "retrieved": result["retrieved"], "inputSHA256": fingerprint, "constituentsSHA256": result["constituentsSHA256"], "members": sorted(official["codes"])}
    if "scaleConversion" in latest:
        new_state["scaleConversion"] = copy.deepcopy(latest["scaleConversion"])
        archive["scaleConversion"] = copy.deepcopy(latest["scaleConversion"])
    return {"status": "updated", "date": day, "files": {"latest.json": result, "state.json": new_state, f"history/{day}.json": archive}}


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--data", type=Path, required=True, help="Pinned data branch root containing latest.json and state.json")
    parser.add_argument("--official", type=Path, required=True, help="Source-checked official summary and 225 constituent codes")
    parser.add_argument("--output", type=Path, required=True)
    parser.add_argument("--quotes-html", type=Path, help="Saved full provider HTML for reproducible readback")
    parser.add_argument("--holidays-csv", type=Path)
    parser.add_argument("--at", help="Explicit aware ISO time for replay/testing; omit for normal runs")
    args = parser.parse_args()
    now = datetime.fromisoformat(args.at) if args.at else datetime.now(JST)
    require(now.tzinfo is not None, "Invocation needs a timezone")
    calendar = calendar_from_csv(args.holidays_csv.read_bytes() if args.holidays_csv else fetch(HOLIDAY_URL))
    quotes = parse_quotes(args.quotes_html.read_text() if args.quotes_html else fetch(PRICES_URL).decode("utf-8"))
    official = json.loads(args.official.read_text())
    latest = json.loads((args.data / "latest.json").read_text())
    state = json.loads((args.data / "state.json").read_text())
    result = accumulate(latest, state, quotes, official, calendar, now)
    # Refuse even a candidate tree that would replace an archived date.
    if result["status"] == "updated":
        require(not (args.data / f'history/{result["date"]}.json').exists(), "Archive date already exists")
        for path, value in result["files"].items():
            destination = args.output / path
            destination.parent.mkdir(parents=True, exist_ok=True)
            destination.write_text(json.dumps(value, ensure_ascii=False, indent=2, allow_nan=False) + "\n")
    print(json.dumps({"status": result["status"], "date": result["date"], "paths": list(result["files"]), "inputSHA256": result["files"].get("latest.json", latest)["inputSHA256"]}))


if __name__ == "__main__":
    main()
