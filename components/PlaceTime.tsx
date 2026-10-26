"use client";

import { useEffect, useState } from "react";
import { Clock, Cloud, CloudFog, CloudLightning, CloudRain, MapPin, Moon, Sun } from "@phosphor-icons/react";
import { SITE } from "@/lib/site";
import type { Weather } from "@/lib/weather";

const fmt = new Intl.DateTimeFormat("en-IN", {
  timeZone: SITE.timeZone,
  hour: "numeric",
  minute: "2-digit",
  hour12: true,
});

function SkyIcon({ w }: { w: Weather }) {
  if (w.sky === "clear") return w.day ? <Sun size={14} aria-hidden /> : <Moon size={14} aria-hidden />;
  if (w.sky === "rain") return <CloudRain size={14} aria-hidden />;
  if (w.sky === "storm") return <CloudLightning size={14} aria-hidden />;
  if (w.sky === "fog") return <CloudFog size={14} aria-hidden />;
  return <Cloud size={14} aria-hidden />;
}

/** Where I am, the weather, and what time it is there. Ticks on the minute; empty until mounted so server and client markup match. */
export default function PlaceTime({
  place = SITE.location,
  className = "placeTime",
  weather,
}: {
  place?: string;
  className?: string;
  weather?: Weather | null;
}) {
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
      {weather && (
        <span className="placeTimeItem" title={weather.words} aria-label={`${weather.words}, ${weather.temp}°C`}>
          <SkyIcon w={weather} />
          {weather.temp}°
        </span>
      )}
      <span className="placeTimeItem" aria-label={now ? `Local time ${fmt.format(now)}` : undefined}>
        <Clock size={14} aria-hidden />
        <time dateTime={now?.toISOString()} suppressHydrationWarning>
          {now ? fmt.format(now) : " "}
        </time>
      </span>
    </span>
  );
}
