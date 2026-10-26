import type { CSSProperties, HTMLAttributes, ReactNode } from "react";

export type PanelVariant = "meadow" | "moss" | "sky" | "golden";

function rng(seed: number) {
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

const num = (n: number) => n.toFixed(1);

/** Three depths of grass blades. Seeded, so server and client markup match. */
const BLADES = (() => {
  const r = rng(404);
  const layers = [
    { count: 70, h: [40, 78], w: [5, 8], fill: ["#6fa456", "#78ad5d", "#68a054"], sway: [4.2, 6.5] },
    { count: 62, h: [56, 100], w: [6, 10], fill: ["#4f8f45", "#57984b", "#4a8641"], sway: [3.4, 5.4] },
    { count: 48, h: [74, 126], w: [7, 12], fill: ["#2f7236", "#357a3a", "#2a6a31"], sway: [2.8, 4.6] },
  ];
  const out: { d: string; fill: string; style: CSSProperties }[] = [];
  layers.forEach((L, li) => {
    for (let i = 0; i < L.count; i++) {
      const x = r() * 1200;
      const h = L.h[0] + r() * (L.h[1] - L.h[0]);
      const w = L.w[0] + r() * (L.w[1] - L.w[0]);
      const lean = (r() - 0.5) * 22;
      const base = 140;
      const d = `M${num(x - w)} ${base} Q${num(x - w * 0.3)} ${num(base - h * 0.55)} ${num(x + lean)} ${num(base - h)} Q${num(x + w * 0.5)} ${num(base - h * 0.5)} ${num(x + w)} ${base}Z`;
      out.push({
        d,
        fill: L.fill[Math.floor(r() * L.fill.length)],
        style: {
          "--r": `${num(1.2 + r() * 2.8 + li * 0.5)}deg`,
          "--t": `${num(L.sway[0] + r() * (L.sway[1] - L.sway[0]))}s`,
          "--d": `${num(-r() * 8)}s`,
        } as CSSProperties,
      });
    }
  });
  return out;
})();

const BIRDS = [
  { y: 16, s: 1, t: 46, d: -8 },
  { y: 24, s: 0.7, t: 58, d: -30 },
  { y: 11, s: 0.55, t: 70, d: -50 },
];

function motes(count: number, seed: number) {
  const r = rng(seed);
  return Array.from({ length: count }, () => ({
    style: {
      left: `${num(r() * 100)}%`,
      bottom: `${num(r() * 40)}%`,
      "--sz": `${num(2.5 + r() * 4)}px`,
      "--dx": `${num((r() - 0.3) * 160)}px`,
      "--t": `${num(11 + r() * 14)}s`,
      "--d": `${num(-r() * 24)}s`,
    } as CSSProperties,
  }));
}
const POLLEN = motes(20, 77);
const FIREFLIES = motes(16, 91);

/**
 * Living scenery panel. Backdrop drifts, light dapples, and optional layers
 * add drifting clouds and sun rays, swaying hills, trees and grass, birds,
 * floating pollen or fireflies. Everything is decorative and aria-hidden.
 */
/** Tiny petals carried across the painting on a slow breeze: [top %, size px, duration s, delay s]. */
const PETALS: [number, number, number, number][] = [
  [18, 5, 14, 0], [28, 4, 17, -6], [36, 6, 12, -3], [44, 4, 19, -11], [52, 5, 15, -8],
  [60, 3, 18, -2], [66, 5, 13, -9], [24, 3, 21, -15], [48, 4, 16, -13], [72, 4, 20, -5],
];

export default function Panel({
  variant = "meadow",
  scenery = false,
  golden = false,
  mist = false,
  grass = false,
  motesKind,
  className = "",
  children,
  ...rest
}: {
  variant?: PanelVariant;
  /** Clouds, rays, hills, canopy and birds. */
  scenery?: boolean;
  /** Golden hour: sun glow, turning rays and drifting mist over a painting. */
  golden?: boolean;
  /** Drifting low mist over a painting (included with golden). */
  mist?: boolean;
  /** Swaying grass along the bottom edge. */
  grass?: boolean;
  /** Floating pollen by day, fireflies by night. */
  motesKind?: "pollen" | "fireflies";
  className?: string;
  children?: ReactNode;
} & HTMLAttributes<HTMLElement>) {
  const motesList = motesKind === "fireflies" ? FIREFLIES : motesKind === "pollen" ? POLLEN : [];
  return (
    <section className={`panel panel-${variant} ${className}`.trim()} {...rest}>
      <span className="panelDapple" aria-hidden="true" />
      {golden && (
        <>
          <span className="panelSun" aria-hidden="true" />
          {PETALS.map(([top, size, dur, delay], i) => (
            <span
              key={`petal-${i}`}
              className="petal"
              aria-hidden="true"
              style={{ "--top": `${top}%`, "--size": `${size}px`, "--dur": `${dur}s`, "--delay": `${delay}s` } as CSSProperties}
            />
          ))}
          <span className="panelRays panelRaysSun" aria-hidden="true" />
        </>
      )}
      {(golden || mist) && (
        <>
          <span className="panelMist panelMist1" aria-hidden="true" />
          <span className="panelMist panelMist2" aria-hidden="true" />
        </>
      )}
      {scenery && (
        <>
          <span className="panelRays" aria-hidden="true" />
          <span className="panelClouds panelCloudsFar" aria-hidden="true" />
          <span className="panelClouds panelCloudsNear" aria-hidden="true" />
          <span className="panelHills" aria-hidden="true" />
          <span className="panelTreeR" aria-hidden="true" />
          <span className="panelTreeL" aria-hidden="true" />
          {BIRDS.map((b, i) => (
            <svg
              key={i}
              className="bird"
              viewBox="0 0 24 10"
              aria-hidden="true"
              style={{ "--y": `${b.y}%`, "--s": b.s, "--t": `${b.t}s`, "--d": `${b.d}s` } as CSSProperties}
            >
              <path className="wing" d="M1 7 Q6 0 12 6 Q18 0 23 7" />
            </svg>
          ))}
        </>
      )}
      {motesList.map((m, i) => (
        <span key={i} className={`mote mote-${motesKind}`} style={m.style} aria-hidden="true" />
      ))}
      {(grass || scenery) && (
        <svg className="panelGrass" viewBox="0 0 1200 140" preserveAspectRatio="none" aria-hidden="true">
          {BLADES.map((b, i) => (
            <path key={i} className="blade" d={b.d} fill={b.fill} style={b.style} />
          ))}
        </svg>
      )}
      <span className="panelGrain" aria-hidden="true" />
      <div className="panelInner">{children}</div>
    </section>
  );
}
