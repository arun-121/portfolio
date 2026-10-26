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
