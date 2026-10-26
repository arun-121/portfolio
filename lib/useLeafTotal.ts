"use client";

import { useCallback, useEffect, useRef, useState } from "react";

const ENDPOINT = "/api/leaves";
/** Cracks are sent in small batches, a moment after the last one. */
const FLUSH_AFTER = 1500;

/**
 * Leaves cracked by everyone. Null until loaded, and stays null when the counter isn't set up.
 * add() counts one crack right away on screen and sends it with the next batch.
 */
export function useLeafTotal() {
  const [total, setTotal] = useState<number | null>(null);
  const pending = useRef(0);
  const timer = useRef<ReturnType<typeof setTimeout>>(undefined);

  useEffect(() => {
    let alive = true;
    fetch(ENDPOINT)
      .then((r) => (r.ok ? r.json() : null))
      .then((d: { total: number | null } | null) => {
        if (alive && typeof d?.total === "number") setTotal(d.total + pending.current);
      })
      .catch(() => {});
    return () => {
      alive = false;
    };
  }, []);

  const flush = useCallback(() => {
    clearTimeout(timer.current);
    const n = Math.min(pending.current, 60);
    if (!n) return;
    pending.current -= n;
    fetch(ENDPOINT, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ n }),
      keepalive: true,
    })
      // A refused batch (rate limit, outage) keeps the number already on screen.
      .then((r) => (r.ok ? r.json() : null))
      .then((d: { total: number | null } | null) => {
        if (typeof d?.total === "number") setTotal(d.total + pending.current);
      })
      .catch(() => {});
    if (pending.current) timer.current = setTimeout(flush, FLUSH_AFTER);
  }, []);

  // Leaving the page sends whatever is still waiting.
  useEffect(() => {
    const leave = () => flush();
    window.addEventListener("pagehide", leave);
    return () => {
      window.removeEventListener("pagehide", leave);
      clearTimeout(timer.current);
    };
  }, [flush]);

  const add = useCallback(() => {
    pending.current += 1;
    setTotal((t) => (t === null ? t : t + 1));
    clearTimeout(timer.current);
    timer.current = setTimeout(flush, FLUSH_AFTER);
  }, [flush]);

  return { total, add };
}
