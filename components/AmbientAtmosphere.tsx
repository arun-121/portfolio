"use client";

import { useReducedMotion } from "framer-motion";
import { useMemo } from "react";

function mulberry32(seed: number) {
  let a = seed >>> 0;
  return () => {
    a |= 0;
    a = (a + 0x6d2b79f5) | 0;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

const PARTICLES = (() => {
  const out: Array<{
    id: number;
    left: string;
    top: string;
    size: number;
    opacity: number;
    duration: number;
    delay: number;
  }> = [];
  for (let i = 0; i < 22; i++) {
    const rng = mulberry32(i * 7919 + 104729);
    out.push({
      id: i,
      left: `${(rng() * 100).toFixed(2)}%`,
      top: `${(rng() * 100).toFixed(2)}%`,
      size: 1 + rng() * 1.8,
      opacity: 0.025 + rng() * 0.045,
      duration: 52 + rng() * 48,
      delay: -(rng() * 80),
    });
  }
  return out;
})();

export default function AmbientAtmosphere() {
  const reducedMotion = useReducedMotion();
  const particles = useMemo(() => PARTICLES, []);

  return (
    <div
      className="ambientLayer"
      aria-hidden="true"
      data-reduced={reducedMotion ? "true" : undefined}
    >
      <div className="ambientGlow" />
      {!reducedMotion &&
        particles.map((p) => (
          <span
            key={p.id}
            className="ambientDust"
            style={
              {
                left: p.left,
                top: p.top,
                width: `${p.size}px`,
                height: `${p.size}px`,
                opacity: p.opacity,
                "--dust-o": String(p.opacity),
                "--dur": `${p.duration}s`,
                "--delay": `${p.delay}s`,
              } as React.CSSProperties
            }
          />
        ))}
    </div>
  );
}
