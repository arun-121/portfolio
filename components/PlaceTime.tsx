"use client";

import { useEffect, useState } from "react";
import { Clock, MapPin } from "@phosphor-icons/react";
import { SITE } from "@/lib/site";

const fmt = new Intl.DateTimeFormat("en-IN", {
  timeZone: SITE.timeZone,
  hour: "numeric",
  minute: "2-digit",
  hour12: true,
});

/** Where I am and what time it is there. Ticks on the minute; empty until mounted so server and client markup match. */
export default function PlaceTime({ place = SITE.location, className = "placeTime" }: { place?: string; className?: string }) {
  const [now, setNow] = useState<Date | null>(null);

  useEffect(() => {
    let id: ReturnType<typeof setInterval> | undefined;
    const tick = () => setNow(new Date());
    tick();
    const toNextMinute = setTimeout(() => {
      tick();
      id = setInterval(tick, 60_000);
    }, 60_000 - (Date.now() % 60_000));
    return () => {
      clearTimeout(toNextMinute);
      if (id) clearInterval(id);
    };
  }, []);

  return (
    <span className={className}>
      <span className="placeTimeItem">
        <MapPin size={14} aria-hidden />
        {place}
      </span>
      <span className="placeTimeItem" aria-label={now ? `Local time ${fmt.format(now)}` : undefined}>
        <Clock size={14} aria-hidden />
        <time dateTime={now?.toISOString()} suppressHydrationWarning>
          {now ? fmt.format(now) : " "}
        </time>
      </span>
    </span>
  );
}
