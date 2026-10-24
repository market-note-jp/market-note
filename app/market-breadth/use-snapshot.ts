"use client";

import { useEffect, useRef, useState } from "react";
import { FEED_URL, latestClosedSession, validateFeed } from "../../lib/market-breadth/feed.mjs";
import type { BreadthRow } from "../../lib/market-breadth/engine.mjs";
import saved from "./snapshot.json";

export type Snapshot = Omit<typeof saved, "history"> & {history: BreadthRow[]};

export function useMarketBreadthSnapshot() {
  const [data, setData] = useState<Snapshot>(saved);
  const current = useRef<Snapshot>(saved);
  const [status, setStatus] = useState("保存済みデータを表示・最新履歴を確認中");
  useEffect(() => {
    let active = true;
    let controller: AbortController | null = null;
    async function refresh() {
      if (document.visibilityState === "hidden") return;
      controller?.abort();
      const request = new AbortController(); controller = request;
      const timeout = setTimeout(() => request.abort(), 15000);
      try {
        const response = await fetch(FEED_URL, {cache: "no-store", credentials: "omit", signal: request.signal});
        if (!response.ok) throw new Error("feed unavailable");
        const next: unknown = await response.json();
        if (!validateFeed(next, current.current, new Date(), stage => console.warn("MN225 feed check:", stage))) throw new Error("feed validation failed");
        if (!active) return;
        const verified = next as Snapshot;
        current.current = verified; setData(verified);
        setStatus(verified.date === latestClosedSession(verified.calendar) ? "取引後の更新データを取得済み" : "次の取引日分の更新待ち・直近の保存値を表示");
      } catch (error) {
        if (!request.signal.aborted) console.warn("MN225 history refresh:", error);
        if (active) setStatus("最新履歴に接続できないため、直近の保存値を表示");
      } finally { clearTimeout(timeout); }
    }
    void refresh();
    const interval = setInterval(() => { void refresh(); }, 5 * 60 * 1000);
    const visible = () => { void refresh(); };
    document.addEventListener("visibilitychange", visible);
    return () => { active = false; controller?.abort(); clearInterval(interval); document.removeEventListener("visibilitychange", visible); };
  }, []);
  return {data, status};
}
