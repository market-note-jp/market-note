"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { ArrowUpRight, Menu, X } from "lucide-react";

const links = [
  ["/#articles", "レポート", "REPORTS"],
  ["/#companies", "企業レポート", "COMPANIES"],
  ["/company-analysis", "財務分析", "KANALYZER"],
  ["/airi", "AIRI・AI株指標", "AI RESEARCH INDEX"],
  ["/calendar", "市場カレンダー", "CALENDAR"],
  ["/#policy", "Market Noteについて", "ABOUT US"],
];

export default function MobileNavigation() {
  const [open, setOpen] = useState(false);
  const button = useRef<HTMLButtonElement>(null);
  const panel = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (!open) return;
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    panel.current?.querySelector<HTMLAnchorElement>("a")?.focus();
    function onKey(event: KeyboardEvent) {
      if (event.key === "Escape") { setOpen(false); button.current?.focus(); }
      if (event.key === "Tab") {
        const targets = [button.current, ...Array.from(panel.current?.querySelectorAll<HTMLAnchorElement>("a") ?? [])].filter(Boolean) as HTMLElement[];
        const first = targets[0], last = targets[targets.length - 1];
        if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last?.focus(); }
        else if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first?.focus(); }
      }
    }
    const media = window.matchMedia("(min-width: 1081px)");
    const resize = () => { if (media.matches) setOpen(false); };
    document.addEventListener("keydown", onKey);
    media.addEventListener("change", resize);
    return () => { document.body.style.overflow = previous; document.removeEventListener("keydown", onKey); media.removeEventListener("change", resize); };
  }, [open]);

  return <div className="mobile-navigation">
    <button className="menu-toggle" type="button" ref={button} aria-expanded={open} aria-controls="mobile-menu" aria-label={open ? "メニューを閉じる" : "メニューを開く"} onClick={() => setOpen(!open)}>
      <span>{open ? "CLOSE" : "MENU"}</span>{open ? <X size={22} /> : <Menu size={22} />}
    </button>
    <div className="mobile-menu" id="mobile-menu" ref={panel} hidden={!open}>
      <p className="kicker">EXPLORE MARKET NOTE</p>
      <nav aria-label="モバイルナビゲーション">
        {links.map(([href, label, english], i) => <Link key={href} href={href} onClick={() => { setOpen(false); button.current?.focus(); }}><span className="menu-number">0{i + 1}</span><span>{label}<small>{english}</small></span><ArrowUpRight size={22} /></Link>)}
      </nav>
      <p className="mobile-menu-note">市場を読む。企業を知る。</p>
    </div>
  </div>;
}
