"use client";

import { useEffect, useState } from "react";

export default function Freshness({ checkedOn }: { checkedOn: string }) {
  const [stale, setStale] = useState(false);
  useEffect(() => {
    const check = () => setStale(Date.now() - new Date(`${checkedOn}T00:00:00+09:00`).getTime() > 10 * 86400000);
    check();
    const timer = window.setInterval(check, 60000);
    return () => window.clearInterval(timer);
  }, [checkedOn]);
  return stale ? <p className="airi-notice" role="status">最終確認から10日以上経過しています。以下は最新の相場評価ではありません。各項目の観測日をご確認ください。</p> : null;
}
