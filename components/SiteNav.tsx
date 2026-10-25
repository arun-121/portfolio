"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { SITE } from "@/lib/site";

const LINKS = [
  { href: `mailto:${SITE.email}`, label: "Contact" },
];


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
        <nav aria-label="Primary">
          <ul>
            {LINKS.map((l) => {
              const current =
                l.href.startsWith("/") &&
                (pathname === l.href || pathname.startsWith(`${l.href}/`));
              return (
                <li key={l.href}>
                  {l.href.startsWith("/") ? (
                    <Link href={l.href} aria-current={current ? "page" : undefined}>
                      {l.label}
                    </Link>
                  ) : (
                    <a href={l.href}>{l.label}</a>
                  )}
                </li>
              );
            })}
          </ul>
        </nav>
        <button type="button" className="kbd" onClick={() => window.dispatchEvent(new Event("open-palette"))} aria-label="Open command palette">
          <span aria-hidden="true">⌘</span>K
        </button>
      </div>
    </header>
  );
}
