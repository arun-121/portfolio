"use client";

import { useEffect, useRef } from "react";

/**
 * Large type section. Every word starts muted and turns to the full text
 * colour, one at a time, as it crosses a trigger line about a third of the
 * way up the viewport. Reverses when scrolling back up.
 */
export default function TaglineReveal({ lines }: { lines: string[] }) {
  const rootRef = useRef<HTMLParagraphElement>(null);

  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;
    const words = Array.from(root.querySelectorAll<HTMLElement>("[data-word]"));

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      words.forEach((w) => (w.dataset.on = "true"));
      return;
    }

    const io = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          const above =
            entry.boundingClientRect.top < (entry.rootBounds?.top ?? 0);
          (entry.target as HTMLElement).dataset.on = String(
            entry.isIntersecting || above,
          );
        }
      },
      { rootMargin: "0px 0px -35% 0px", threshold: 0 },
    );
    words.forEach((w) => io.observe(w));
    return () => io.disconnect();
  }, []);

  const full = lines.join(" ");

  return (
    <p ref={rootRef} className="tagline" aria-label={full}>
      {lines.map((line, li) => (
        <span className="taglineLine" key={li} aria-hidden="true">
          {line.split(" ").map((word, wi) => (
            <span key={wi}>
              <span className="word" data-word data-on="false">
                {word}
              </span>{" "}
            </span>
          ))}
        </span>
      ))}
    </p>
  );
}
