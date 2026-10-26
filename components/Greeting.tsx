"use client";

import { useEffect, useState } from "react";

const KEY = "visits";
/** Coming back after this long counts as a new visit, so reloads and clicking around don't. */
const NEW_VISIT_AFTER = 30 * 60 * 1000;

let returning: boolean | null = null;

/** Counts this visit once per page load and says whether there was one before. Stays in this browser only. */
function isReturning(): boolean {
  if (returning !== null) return returning;
  try {
    const saved = JSON.parse(localStorage.getItem(KEY) ?? "null") as { n: number; last: number } | null;
    const now = Date.now();
    const n = !saved ? 1 : now - saved.last > NEW_VISIT_AFTER ? saved.n + 1 : saved.n;
    localStorage.setItem(KEY, JSON.stringify({ n, last: now }));
    returning = n > 1;
  } catch {
    returning = false; // storage blocked: the usual greeting
  }
  return returning;
}

/** "Hi, I'm Arun." on a first visit; "Hi again, I'm Arun." when someone comes back. */
export default function Greeting() {
  const [again, setAgain] = useState(false);
  useEffect(() => setAgain(isReturning()), []);

  return (
    <>
      Hi<span className="greetAgain" data-on={again || undefined} aria-hidden={!again}> again</span>, I&rsquo;m Arun.
    </>
  );
}
