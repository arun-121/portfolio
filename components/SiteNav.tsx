"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import type { ReactNode } from "react";
import type { Weather } from "@/lib/weather";
import PlaceTime from "@/components/PlaceTime";

/** song: the Spotify item, rendered on the server; weather: Chennai now, fetched on the server. */
export default function SiteNav({ song, weather }: { song?: ReactNode; weather?: Weather | null }) {
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
        {song}
        <PlaceTime place="Chennai" className="navPlace" weather={weather} />
        <button type="button" className="kbd" onClick={() => window.dispatchEvent(new Event("open-palette"))} aria-label="Open command palette">
          <span aria-hidden="true">⌘</span>K
        </button>
      </div>
    </header>
  );
}
