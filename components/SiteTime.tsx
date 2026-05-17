"use client";

import { useEffect, useState } from "react";
import { SITE } from "@/lib/site";

function formatSiteDateTime(now: Date) {
  const time = new Intl.DateTimeFormat("en-IN", {
    timeZone: SITE.timeZone,
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  }).format(now);

  const date = new Intl.DateTimeFormat("en-IN", {
    timeZone: SITE.timeZone,
    day: "numeric",
    month: "short",
    year: "numeric",
  }).format(now);

  const tz =
    new Intl.DateTimeFormat("en-IN", {
      timeZone: SITE.timeZone,
      timeZoneName: "short",
    })
      .formatToParts(now)
      .find((p) => p.type === "timeZoneName")?.value ?? "IST";

  const iso = new Intl.DateTimeFormat("sv-SE", {
    timeZone: SITE.timeZone,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  })
    .format(now)
    .replace(" ", "T");

  return {
    label: `${SITE.location} · ${date} · ${time} ${tz}`,
    dateTime: `${iso}+05:30`,
  };
}

export default function SiteTime() {
  const [formatted, setFormatted] = useState<{
    label: string;
    dateTime: string;
  } | null>(null);

  useEffect(() => {
    function tick() {
      setFormatted(formatSiteDateTime(new Date()));
    }
    tick();
    const id = setInterval(tick, 30_000);
    return () => clearInterval(id);
  }, []);

  if (!formatted) {
    return (
      <span className="siteTime" aria-hidden="true">
        {SITE.location}
      </span>
    );
  }

  return (
    <time className="siteTime" dateTime={formatted.dateTime}>
      {formatted.label}
    </time>
  );
}
