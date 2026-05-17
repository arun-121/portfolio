"use client";

import { useCallback, useMemo, useState } from "react";
import { playCrack, warmAudio } from "@/lib/leafAudio";
import styles from "./leafPile.module.css";

// Six real dry-leaf cutouts saved under public/leaves/. Mix of webp and
// png — the browser handles both. Filenames hardcoded so we can pick
// deterministically per pile item.
const LEAF_FILES = [
  "/leaves/leaf-1.webp",
  "/leaves/leaf-2.webp",
  "/leaves/leaf-3.webp",
  "/leaves/leaf-5.png",
];

// Fragment chips use a fixed warm-brown palette since we can't sample
// pixels from the image at runtime. These match the dry-leaf range.
const FRAGMENT_COLORS = [
  "#7E5530",
  "#5B3A1C",
  "#9A7148",
  "#3F2510",
  "#8B6240",
  "#42260F",
];

// Six wedge regions that tile the leaf image box. Each is a CSS polygon
// clip-path string — the leaf gets rendered six times stacked, each copy
// clipped to one wedge. When cracked, each wedge translates outward in
// its own direction, carrying its slice of the photograph with it.
//
// Wedges meet at center (50%, 50%) and reach out to the box edges.
interface Shard {
  clip: string;
  dx: number;       // direction unit vector
  dy: number;
  baseRotation: number; // degrees
}
const SHARDS: Shard[] = [
  { // top
    clip: "polygon(50% 50%, 40% 0%, 60% 0%)",
    dx:  0,   dy: -1,    baseRotation: -8,
  },
  { // upper-right
    clip: "polygon(50% 50%, 60% 0%, 100% 0%, 100% 30%)",
    dx:  0.75, dy: -0.65, baseRotation: 22,
  },
  { // right-bottom
    clip: "polygon(50% 50%, 100% 30%, 100% 100%, 60% 100%)",
    dx:  1,    dy:  0.35, baseRotation: 16,
  },
  { // bottom
    clip: "polygon(50% 50%, 60% 100%, 40% 100%)",
    dx:  0,    dy:  1,    baseRotation: 10,
  },
  { // lower-left
    clip: "polygon(50% 50%, 40% 100%, 0% 100%, 0% 30%)",
    dx: -1,    dy:  0.35, baseRotation: -16,
  },
  { // upper-left
    clip: "polygon(50% 50%, 0% 30%, 0% 0%, 40% 0%)",
    dx: -0.75, dy: -0.65, baseRotation: -22,
  },
];

const LEAF_COUNT = 180;

interface PileItem {
  x: number;       // % across the pile container
  y: number;       // % down the pile container
  rot: number;
  size: number;
  zIndex: number;
  pitch: number;
  src: string;
  depth: number;
}

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

// ── small piles + scattered strays ───────────────────────────────────
// Multiple low clusters across the bottom (no single tall hill), with
// scattered strays in the gaps. Reads like leaves blown around with a
// few mounds, not one heaped pile.
//
// Each cluster has a center, a radius (spread), and a weight (relative
// share of cluster-placed leaves). Some leaves are placed as "strays"
// uniformly across the area, not in any cluster — these are the leaves
// blown away from the piles.

interface Cluster {
  cx: number; // center x %
  cy: number; // center y % (lower = closer to camera)
  rx: number; // horizontal radius %
  ry: number; // vertical radius % (clusters are flatter than circular)
  weight: number;
}

const CLUSTERS: Cluster[] = [
  { cx: 18, cy: 80, rx: 13, ry: 7,  weight: 1.0 },
  { cx: 38, cy: 72, rx: 17, ry: 10, weight: 1.6 }, // main cluster, slightly left of center
  { cx: 58, cy: 76, rx: 15, ry: 8,  weight: 1.3 },
  { cx: 78, cy: 82, rx: 12, ry: 7,  weight: 1.0 },
  { cx: 50, cy: 62, rx: 9,  ry: 6,  weight: 0.6 }, // small cluster higher up, more sparse
];
const TOTAL_CLUSTER_WEIGHT = CLUSTERS.reduce((s, c) => s + c.weight, 0);

// share of leaves that don't belong to any cluster — scattered strays
const STRAY_RATIO = 0.30;

function pickCluster(r: number): Cluster {
  let acc = 0;
  const target = r * TOTAL_CLUSTER_WEIGHT;
  for (const c of CLUSTERS) {
    acc += c.weight;
    if (target <= acc) return c;
  }
  return CLUSTERS[CLUSTERS.length - 1];
}

const PILE: PileItem[] = (() => {
  const items: PileItem[] = [];

  for (let i = 0; i < LEAF_COUNT; i++) {
    const rng = mulberry32(i * 9301 + 49297);
    let x: number, y: number;

    if (rng() < STRAY_RATIO) {
      // stray leaf: scattered anywhere across the bottom half of the area
      x = 2 + rng() * 96;
      // strays tend to be lower (fewer high strays — leaves don't float)
      y = 48 + rng() * rng() * 50; // 48..98, biased toward middle
    } else {
      // cluster leaf: pick a weighted cluster, place near its center
      const c = pickCluster(rng());
      // gaussian-ish offset within an ellipse (sqrt for area-uniform)
      const angle = rng() * Math.PI * 2;
      const r = Math.sqrt(rng());
      x = c.cx + Math.cos(angle) * r * c.rx;
      y = c.cy + Math.sin(angle) * r * c.ry;
    }

    // depth derives from y (lower = closer to camera = bigger + brighter)
    const depth = Math.max(0, Math.min(1, (95 - y) / 50));

    const sizeBase = 78 - depth * 26;
    const sizeJitter = (rng() - 0.5) * 24;
    const size = Math.max(36, sizeBase + sizeJitter);

    const zIndex = Math.floor((1 - depth) * 120 + rng() * 30);

    items.push({
      x,
      y,
      rot: rng() * 360,
      size,
      zIndex,
      pitch: 0.7 + rng() * 0.7,
      src: LEAF_FILES[Math.floor(rng() * LEAF_FILES.length)],
      depth,
    });
  }

  items.sort((a, b) => a.zIndex - b.zIndex);
  return items;
})();

// ── crack: shake + burst of fragments ────────────────────────────────

interface Fragment {
  id: number;
  dx: number;
  dy: number;
  rot: number;
  size: number;
  color: string;
  points: string;
  duration: number;
  delay: number;
}

function makeFragmentPoints(seed: number, baseRadius: number): string {
  const rng = mulberry32(seed);
  const sides = 4 + Math.floor(rng() * 3);
  const points: string[] = [];
  for (let i = 0; i < sides; i++) {
    const angle = (i / sides) * Math.PI * 2 + rng() * 0.4;
    const r = baseRadius * (0.65 + rng() * 0.7);
    points.push(`${(Math.cos(angle) * r).toFixed(2)},${(Math.sin(angle) * r).toFixed(2)}`);
  }
  return points.join(" ");
}

function rollFragments(): Fragment[] {
  const count = 12 + Math.floor(Math.random() * 6); // 12–17
  const out: Fragment[] = [];
  for (let i = 0; i < count; i++) {
    const angle = Math.random() * Math.PI * 2;
    const distance = 30 + Math.random() * 70;
    const sizeBase = 3 + Math.random() * 6;
    out.push({
      id: i,
      dx: Math.cos(angle) * distance,
      dy: Math.sin(angle) * distance + Math.random() * 18,
      rot: (Math.random() - 0.5) * 1440,
      size: sizeBase,
      color: FRAGMENT_COLORS[Math.floor(Math.random() * FRAGMENT_COLORS.length)],
      points: makeFragmentPoints(Math.floor(Math.random() * 1e9), sizeBase),
      duration: 620 + Math.random() * 480,
      delay: Math.random() * 60,
    });
  }
  return out;
}

// Per-shard randomized trajectory rolled fresh on each crack so no two
// breaks of the same leaf look identical.
interface ShardTransform {
  tx: number;
  ty: number;
  rot: number;
}

function rollShards(): ShardTransform[] {
  return SHARDS.map((s) => {
    const distance = 28 + Math.random() * 18; // px outward
    const jitter = (Math.random() - 0.5) * 0.3; // small direction jitter
    const dx = s.dx + jitter;
    const dy = s.dy + jitter * 0.5;
    const len = Math.hypot(dx, dy) || 1;
    return {
      tx: (dx / len) * distance,
      ty: (dy / len) * distance,
      rot: s.baseRotation + (Math.random() - 0.5) * 36,
    };
  });
}

function PileLeaf({ item }: { item: PileItem }) {
  const [cracking, setCracking] = useState(false);
  const [fragments, setFragments] = useState<Fragment[] | null>(null);
  const [shardTransforms, setShardTransforms] = useState<ShardTransform[] | null>(
    null,
  );
  const [crackKey, setCrackKey] = useState(0);

  const handleClick = useCallback(() => {
    if (cracking) return; // already cracked — stays cracked, no re-trigger
    setCracking(true);
    setShardTransforms(rollShards());
    setFragments(rollFragments());
    setCrackKey((k) => k + 1);
    playCrack(item.pitch);
    // shards stay in their cracked positions forever — no snap-back.
    // only the dust fragments clean themselves up so they don't pile up
    // in the DOM.
    window.setTimeout(() => setFragments(null), 1200);
  }, [cracking, item.pitch]);

  return (
    <button
      type="button"
      className={`${styles.leaf} ${cracking ? styles.cracking : ""}`}
      style={
        {
          "--x": `${item.x}%`,
          "--y": `${item.y}%`,
          "--rot": `${item.rot}deg`,
          "--size": `${item.size}px`,
          "--z": item.zIndex,
          "--depth-dim": `${0.78 + (1 - item.depth) * 0.22}`,
          "--depth-squash": `${1 - item.depth * 0.12}`,
        } as React.CSSProperties
      }
      onClick={handleClick}
      onPointerEnter={warmAudio}
      aria-label="A dry leaf — press to crack"
    >
      {/* Six clipped copies of the same image — at rest they tile back
          into the whole leaf; on crack each carries its slice outward. */}
      {SHARDS.map((shard, i) => {
        const tx = shardTransforms?.[i]?.tx ?? 0;
        const ty = shardTransforms?.[i]?.ty ?? 0;
        const rot = shardTransforms?.[i]?.rot ?? 0;
        const cracked = !!shardTransforms;
        return (
          <img
            key={i}
            src={item.src}
            alt=""
            draggable={false}
            className={styles.shard}
            style={
              {
                clipPath: shard.clip,
                WebkitClipPath: shard.clip,
                transform: cracked
                  ? `translate(${tx.toFixed(1)}px, ${ty.toFixed(1)}px) rotate(${rot.toFixed(1)}deg)`
                  : "translate(0, 0) rotate(0deg)",
              } as React.CSSProperties
            }
          />
        );
      })}
      {fragments && (
        <span className={styles.fragments} key={crackKey} aria-hidden="true">
          {fragments.map((f) => (
            <span
              key={f.id}
              className={styles.fragment}
              style={
                {
                  "--dx": `${f.dx.toFixed(2)}px`,
                  "--dy": `${f.dy.toFixed(2)}px`,
                  "--rot": `${f.rot.toFixed(1)}deg`,
                  "--dur": `${f.duration.toFixed(0)}ms`,
                  "--delay": `${f.delay.toFixed(0)}ms`,
                } as React.CSSProperties
              }
            >
              <svg
                width={f.size * 2.4}
                height={f.size * 2.4}
                viewBox={`-${f.size * 1.2} -${f.size * 1.2} ${f.size * 2.4} ${f.size * 2.4}`}
              >
                <polygon points={f.points} fill={f.color} />
              </svg>
            </span>
          ))}
        </span>
      )}
    </button>
  );
}

export default function LeavesLayer() {
  return (
    <section className={styles.section} aria-label="A pile of dry leaves">
      <p className={styles.invite}>
        I gathered some leaves for you to crack.
      </p>
      <p className={styles.inviteSub}>
        They snap a little differently each time.
      </p>

      <div className={styles.pile}>
        {PILE.map((item, i) => (
          <PileLeaf key={i} item={item} />
        ))}
      </div>
    </section>
  );
}
