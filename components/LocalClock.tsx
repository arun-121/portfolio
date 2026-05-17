"use client";

import { useEffect, useState } from "react";

export default function LocalClock() {
  const [time, setTime] = useState<string>("—");

  useEffect(() => {
    function tick() {
      const d = new Date();
      const hh = String(d.getHours()).padStart(2, "0");
      const mm = String(d.getMinutes()).padStart(2, "0");
      setTime(`${hh}:${mm} local`);
    }
    tick();
    const id = setInterval(tick, 60_000);
    return () => clearInterval(id);
  }, []);

  return <span>{time}</span>;
}
