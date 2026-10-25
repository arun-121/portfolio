"use client";

import { useEffect, useState } from "react";
import { SITE } from "@/lib/site";

const fmt = new Intl.DateTimeFormat("en-IN", {
  timeZone: SITE.timeZone,
  hour: "numeric",
  minute: "2-digit",
  second: "2-digit",
  hour12: true,
});

/** Chennai time, ticking each second. Empty until mounted so server and client markup match. */
export default function LiveClock() {
  const [now, setNow] = useState<Date | null>(null);

  useEffect(() => {
    setNow(new Date());
    const id = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(id);
  }, []);

  return (
    <span className="liveClock" aria-label="Local time in Chennai">
      <span className="liveClockPlace">Chennai</span>
      <time dateTime={now?.toISOString()} suppressHydrationWarning>
        {now ? fmt.format(now) : " "}
      </time>
    </span>
  );
}
