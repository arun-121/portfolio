"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import PlaceTime from "@/components/PlaceTime";

export default function SiteNav() {
  const pathname = usePathname();
  return (
    <header className="nav">
      <div className="wrap navInner">
        <Link
          href="/"
          className="navBrand"
          aria-current={pathname === "/" ? "page" : undefined}
        >
          <svg viewBox="0 0 32 32" width="28" height="28" aria-hidden="true">
            <path d="M16 5c8 4 9 15 0 22C7 20 8 9 16 5Z" fill="#a4441b" />
            <path d="M16 10v15" stroke="#f3eee1" strokeWidth="1.6" strokeLinecap="round" />
          </svg>
          <span className="navName">Arun S R</span>
        </Link>
        <PlaceTime place="Chennai" className="navPlace" />
        <button type="button" className="kbd" onClick={() => window.dispatchEvent(new Event("open-palette"))} aria-label="Open command palette">
          <span aria-hidden="true">⌘</span>K
        </button>
      </div>
    </header>
  );
}
