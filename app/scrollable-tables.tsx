"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";

/** Adds keyboard access to existing report tables without changing report text or sources. */
export default function ScrollableTables() {
  const pathname = usePathname();
  useEffect(() => {
    const enhance = () => {
      document.querySelectorAll<HTMLElement>(".table-wrap, .table-scroll, .airi-table-wrap").forEach((region, index) => {
        if (!region.hasAttribute("tabindex")) region.tabIndex = 0;
        if (!region.hasAttribute("role")) region.setAttribute("role", "region");
        if (!region.hasAttribute("aria-label") && !region.hasAttribute("aria-labelledby")) {
          const caption = region.querySelector("caption")?.textContent?.trim();
          region.setAttribute("aria-label", caption || `データ表 ${index + 1}（横方向にスクロールできます）`);
        }
      });
    };
    enhance();
    const main = document.querySelector("main");
    const observer = new MutationObserver(enhance);
    if (main) observer.observe(main, { childList: true, subtree: true });
    return () => observer.disconnect();
  }, [pathname]);
  return null;
}
