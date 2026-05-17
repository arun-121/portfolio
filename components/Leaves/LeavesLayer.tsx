"use client";

import { useCallback, useMemo, useRef, useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { playCrack, warmAudio, type CrackVariant } from "@/lib/leafAudio";
import styles from "./leafPile.module.css";

/** Hover: a little lighter damping so the twist eases in kindly, not snappy-UI. */
const springLeafHover = {
  type: "spring" as const,
  stiffness: 220,
  damping: 20,
  mass: 1.05,
};
const springLeafTap = {
  type: "spring" as const,
  stiffness: 520,
  damping: 32,
  mass: 0.58,
};
/** Crack: quick release with a hint of rebound — satisfying without chaos. */
const springShard = {
  type: "spring" as const,
  stiffness: 420,
  damping: 26,
  mass: 0.62,
};

function leafRestFilter(item: PileItem) {
  const b = 0.84 + item.zNorm * 0.16;
  return `brightness(${b.toFixed(3)}) saturate(0.96)`;
}

function leafWarmFilter(item: PileItem) {
  const b = 0.87 + item.zNorm * 0.1;
  return `brightness(${b.toFixed(3)}) saturate(1.08)`;
}

/** Soft contact shadow — wide blur, low alpha (avoids graphic cut-out look). */
function leafShadowStyle(item: PileItem, lifted = false): React.CSSProperties {
  const z = item.zNorm;
  const lift = lifted ? 1.15 : 1;
  const oy = (2 + z * 3.5) * lift;
  const blur = 8 + z * 10;
  const alpha = 0.055 + z * 0.065;
  return {
    "--leaf-ds": `0px ${oy.toFixed(1)}px ${blur.toFixed(1)}px rgba(28, 18, 8, ${alpha.toFixed(3)})`,
  } as React.CSSProperties;
}

const LEAF_FILES = [
  "/leaves/leaf-1.webp",
  "/leaves/leaf-2.webp",
  "/leaves/leaf-3.webp",
  "/leaves/leaf-5.png",
];

const FRAGMENT_COLORS = [
  "#7E5530",
  "#5B3A1C",
  "#9A7148",
  "#3F2510",
  "#8B6240",
  "#42260F",
];

// ── leaf-image fracture wedges ───────────────────────────────────────
interface Shard {
  clip: string;
  dx: number;
  dy: number;
  baseRotation: number;
}
const SHARDS: Shard[] = [
  { clip: "polygon(50% 50%, 40% 0%, 60% 0%)",                    dx:  0,    dy: -1,    baseRotation:  -8 },
  { clip: "polygon(50% 50%, 60% 0%, 100% 0%, 100% 30%)",         dx:  0.75, dy: -0.65, baseRotation:  22 },
  { clip: "polygon(50% 50%, 100% 30%, 100% 100%, 60% 100%)",     dx:  1,    dy:  0.35, baseRotation:  16 },
  { clip: "polygon(50% 50%, 60% 100%, 40% 100%)",                dx:  0,    dy:  1,    baseRotation:  10 },
  { clip: "polygon(50% 50%, 40% 100%, 0% 100%, 0% 30%)",         dx: -1,    dy:  0.35, baseRotation: -16 },
  { clip: "polygon(50% 50%, 0% 30%, 0% 0%, 40% 0%)",             dx: -0.75, dy: -0.65, baseRotation: -22 },
];

/** Leaf count — balance density vs scroll/hover repaint cost */
const LEAF_COUNT = 42;

interface PileItem {
  x: number;
  y: number;
  rot: number;
  size: number;
  zIndex: number;
  pitch: number;
  /** 0–3 — distinct crack recipe per leaf */
  crackVariant: CrackVariant;
  src: string;
  /** Sort key only — no CSS translateZ (3D + z-index breaks hit-testing) */
  z3d: number;
  /** tilt around X axis (leaf leaning forward/back), degrees */
  rotX: number;
  /** tilt around Y axis (leaf turned left/right), degrees */
  rotY: number;
  /** 0..1, 0 = far back, 1 = close — brightness only */
  zNorm: number;
}

interface AmbientChip {
  x: number;
  y: number;
  rot: number;
  size: number;
  opacity: number;
  zIndex: number;
  src: string;
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

// Many mini-piles, scattered. Depth for visuals = size + brightness; z3d is
// only used to sort z-index (flat stacking — reliable pointer events).
interface MiniPile {
  cx: number;
  cy: number;
  rx: number;
  ry: number;
  weight: number;
}

/** Scatter ~18 tight mini-piles with minimum spacing — looks like separate heaps. */
function buildMiniPiles(): MiniPile[] {
  const out: MiniPile[] = [];
  const rng = mulberry32(7781);
  const targets = 18;
  const placed: { cx: number; cy: number }[] = [];
  const minDist = 9.2;
  let guard = 0;
  while (out.length < targets && guard < 500) {
    guard += 1;
    const cx = 7 + rng() * 86;
    const cy = 44 + rng() * 42; /* full vertical spread — not a single horizontal band */
    if (placed.some((p) => Math.hypot(p.cx - cx, p.cy - cy) < minDist)) continue;
    placed.push({ cx, cy });
    out.push({
      cx,
      cy,
      rx: 2.8 + rng() * 3.8,
      ry: 2.4 + rng() * 3.2,
      weight: 0.5 + rng(),
    });
  }
  if (out.length === 0) {
    out.push({ cx: 50, cy: 68, rx: 8, ry: 6, weight: 1 });
  }
  return out;
}

const MINI_PILES = buildMiniPiles();
const TOTAL_MINI_WEIGHT = MINI_PILES.reduce((s, c) => s + c.weight, 0);
const STRAY_RATIO = 0.38;

function pickMiniPile(r: number): MiniPile {
  let acc = 0;
  const target = r * TOTAL_MINI_WEIGHT;
  for (const c of MINI_PILES) {
    acc += c.weight;
    if (target <= acc) return c;
  }
  return MINI_PILES[MINI_PILES.length - 1]!;
}

const PILE: PileItem[] = (() => {
  const items: PileItem[] = [];

  // Z range: logical depth for ordering only (not applied as translateZ)
  const Z_FAR = -170;
  const Z_NEAR = 45;
  const Z_RANGE = Z_NEAR - Z_FAR;

  for (let i = 0; i < LEAF_COUNT; i++) {
    const rng = mulberry32(i * 9301 + 49297);
    let x: number;
    let y: number;

    /* Depth first — drives “horizon vs near your feet” placement */
    const z3d = Z_FAR + rng() * Z_RANGE;
    const zNorm = (z3d - Z_FAR) / Z_RANGE;

    if (rng() < STRAY_RATIO) {
      /* Wind-blown strays — looser, slightly biased drift */
      x = 6 + rng() * 88 + (rng() - 0.35) * 6;
      y = 48 + rng() * 40;
    } else {
      const c = pickMiniPile(rng());
      const angle = rng() * Math.PI * 2;
      /* Denser pile cores — less uniform disk, more natural heaps */
      const rad = Math.pow(rng(), 1.72);
      x = c.cx + Math.cos(angle) * rad * c.rx;
      y = c.cy + Math.sin(angle) * rad * c.ry;
      /* Organic overlap — nudge toward heap center sometimes */
      if (rng() < 0.42) {
        x += (c.cx - x) * (0.12 + rng() * 0.18);
        y += (c.cy - y) * (0.1 + rng() * 0.16);
      }
    }

    /* Imperfect scatter — breaks grid-like placement */
    x += (rng() - 0.5) * 2.8;
    y += (rng() - 0.5) * 2.2;

    y = Math.max(38, Math.min(94, y));
    x = Math.max(3, Math.min(97, x));

    // Subtle tilt — frontal pile; strong tilt reads oblique / “from the side”
    const rotX = (rng() - 0.5) * 18;
    const rotY = (rng() - 0.5) * 22;

    // size variation, then perspective scales it further by translateZ
    const sizeBase = 84 - (1 - zNorm) * 16;
    const sizeJitter = (rng() - 0.5) * 24;
    const size = Math.max(38, sizeBase + sizeJitter);

    items.push({
      x,
      y,
      rot: rng() * 360,
      size,
      zIndex: 0,
      pitch: 0.7 + rng() * 0.7,
      crackVariant: Math.floor(rng() * 4) as CrackVariant,
      src: LEAF_FILES[Math.floor(rng() * LEAF_FILES.length)],
      z3d,
      rotX,
      rotY,
      zNorm,
    });
  }

  /* Stacking: 2D z-index only. Do NOT combine translateZ + preserve-3d here —
     browsers paint 3D overlap inconsistent with z-index → most clicks miss. */
  items.sort((a, b) => a.z3d - b.z3d);
  items.forEach((item, i) => {
    item.zIndex = 1000 + i;
  });
  return items;
})();

/** Small resting chips — wind scatter, not clickable */
const AMBIENT_CHIPS: AmbientChip[] = (() => {
  const chips: AmbientChip[] = [];
  for (let i = 0; i < 14; i++) {
    const rng = mulberry32(i * 4177 + 90210);
    chips.push({
      x: 10 + rng() * 80,
      y: 52 + rng() * 38,
      rot: rng() * 360,
      size: 12 + rng() * 20,
      opacity: 0.28 + rng() * 0.38,
      zIndex: 600 + Math.floor(rng() * 350),
      src: LEAF_FILES[Math.floor(rng() * LEAF_FILES.length)],
    });
  }
  return chips;
})();

// ── crack: shard transforms + fragment burst ─────────────────────────

interface Fragment {
  id: number;
  dx: number;
  dy: number;
  dz: number;
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
  const count = 4 + Math.floor(Math.random() * 4);
  const out: Fragment[] = [];
  for (let i = 0; i < count; i++) {
    const angle = Math.random() * Math.PI * 2;
    const distance = 28 + Math.random() * 60;
    const sizeBase = 3 + Math.random() * 5;
    out.push({
      id: i,
      dx: Math.cos(angle) * distance,
      dy: Math.sin(angle) * distance + Math.random() * 16,
      dz: (Math.random() - 0.35) * 90,
      rot: (Math.random() - 0.5) * 1440,
      size: sizeBase,
      color: FRAGMENT_COLORS[Math.floor(Math.random() * FRAGMENT_COLORS.length)],
      points: makeFragmentPoints(Math.floor(Math.random() * 1e9), sizeBase),
      duration: 620 + Math.random() * 420,
      delay: Math.random() * 60,
    });
  }
  return out;
}

interface ShardTransform {
  tx: number;
  ty: number;
  tz: number;
  rot: number;
  rotX: number;
  rotY: number;
}

/** 3D scatter: outward in the leaf plane + depth toward camera + tumble. */
function rollShards(): ShardTransform[] {
  return SHARDS.map((s) => {
    const distance = 28 + Math.random() * 26;
    const jitter = (Math.random() - 0.5) * 0.35;
    const dx = s.dx + jitter;
    const dy = s.dy + jitter * 0.45;
    const len = Math.hypot(dx, dy) || 1;
    // Depth: mix of “lift off the pile” and toward/away from viewer (px in 3D space).
    const lift = 12 + Math.random() * 36;
    const towardCam = (Math.random() - 0.25) * 48;
    const tz = towardCam + (Math.random() - 0.5) * 22;
    return {
      tx: (dx / len) * distance,
      ty: (dy / len) * distance - lift * 0.15,
      tz,
      rot: s.baseRotation + (Math.random() - 0.5) * 52,
      rotX: (Math.random() - 0.5) * 64,
      rotY: (Math.random() - 0.5) * 58,
    };
  });
}

function PileLeaf({
  item,
  index,
  totalLeaves,
}: {
  item: PileItem;
  index: number;
  totalLeaves: number;
}) {
  const reducedMotion = useReducedMotion();
  const [hovered, setHovered] = useState(false);
  const [cracked, setCracked] = useState(false);
  const [fragments, setFragments] = useState<Fragment[] | null>(null);
  const [shardTransforms, setShardTransforms] = useState<ShardTransform[] | null>(
    null,
  );
  const [crackKey, setCrackKey] = useState(0);

  const zIndex =
    hovered && !cracked ? 12_050 : item.zIndex;

  /** Per-leaf hover twist — like one corner lifting in a draft; no hover scale pop. */
  const hoverTwist = useMemo(() => {
    const rng = mulberry32(
      index * 9743 + (item.z3d | 0) + Math.floor(item.rot * 17),
    );
    return {
      rotX: (rng() - 0.5) * 5.5,
      rotY: (rng() - 0.5) * 6,
      rotZ: (rng() - 0.5) * 4.5,
    };
  }, [index, item.z3d, item.rot]);

  const handleClick = useCallback(() => {
    if (cracked) return;
    setCracked(true);
    setShardTransforms(rollShards());
    setFragments(rollFragments());
    setCrackKey((k) => k + 1);
    playCrack(item.pitch, item.crackVariant);
    window.setTimeout(() => setFragments(null), 1200);
  }, [cracked, item.pitch, item.crackVariant]);

  const enableLeafMotion = !reducedMotion && !cracked;

  const shadowStyle = useMemo(
    () => leafShadowStyle(item, hovered && !cracked),
    [item, hovered, cracked],
  );

  return (
    <motion.button
      type="button"
      className={`${styles.leaf} ${cracked ? styles.cracked : ""}`}
      style={{
        left: `${item.x}%`,
        top: `${item.y}%`,
        width: `${item.size}px`,
        height: `${item.size}px`,
        zIndex,
        transformStyle: cracked ? "preserve-3d" : "flat",
        ...shadowStyle,
      }}
      initial={false}
      animate={{
        opacity: 1,
        scale: 1,
        x: "-50%",
        y: "-50%",
        rotateX: item.rotX,
        rotateY: item.rotY,
        rotateZ: item.rot,
        filter: leafRestFilter(item),
      }}
      whileHover={
        enableLeafMotion
          ? {
              rotateX: item.rotX + hoverTwist.rotX,
              rotateY: item.rotY + hoverTwist.rotY,
              rotateZ: item.rot + hoverTwist.rotZ,
              filter: leafWarmFilter(item),
              transition: springLeafHover,
            }
          : undefined
      }
      whileTap={
        enableLeafMotion
          ? {
              rotateX: item.rotX + hoverTwist.rotX + 3.2,
              rotateY: item.rotY + hoverTwist.rotY * 0.88,
              rotateZ: item.rot + hoverTwist.rotZ * 0.75,
              scale: 0.986,
              filter: leafRestFilter(item),
              transition: springLeafTap,
            }
          : undefined
      }
      onHoverStart={() => {
        if (!cracked) setHovered(true);
      }}
      onHoverEnd={() => setHovered(false)}
      onClick={handleClick}
      onPointerEnter={warmAudio}
      {...(cracked
        ? { tabIndex: -1, "aria-hidden": true }
        : {
            tabIndex: 0,
            "aria-label": `Crack leaf ${index + 1} of ${totalLeaves}`,
            "aria-posinset": index + 1,
            "aria-setsize": totalLeaves,
          })}
    >
      {cracked && shardTransforms ? (
        SHARDS.map((shard, i) => {
          const t = shardTransforms[i]!;
          return (
            <motion.img
              key={i}
              src={item.src}
              alt=""
              draggable={false}
              className={styles.shard}
              style={{
                clipPath: shard.clip,
                WebkitClipPath: shard.clip,
              }}
              initial={
                reducedMotion
                  ? {
                      x: t.tx,
                      y: t.ty,
                      z: t.tz,
                      rotateX: t.rotX,
                      rotateY: t.rotY,
                      rotateZ: t.rot,
                    }
                  : {
                      x: 0,
                      y: 0,
                      z: 0,
                      rotateX: 0,
                      rotateY: 0,
                      rotateZ: 0,
                    }
              }
              animate={{
                x: t.tx,
                y: t.ty,
                z: t.tz,
                rotateX: t.rotX,
                rotateY: t.rotY,
                rotateZ: t.rot,
              }}
              transition={{
                ...springShard,
                delay: reducedMotion ? 0 : i * 0.026,
              }}
            />
          );
        })
      ) : (
        <img
          src={item.src}
          alt=""
          draggable={false}
          className={styles.leafImg}
        />
      )}
      {fragments && !reducedMotion && (
        <span className={styles.fragments} key={crackKey} aria-hidden="true">
          {fragments.map((f) => (
            <motion.span
              key={f.id}
              className={styles.fragment}
              initial={{ opacity: 0, scale: 0.25, x: 0, y: 0, z: 0, rotate: 0 }}
              animate={{
                opacity: [0, 1, 0],
                x: f.dx,
                y: f.dy,
                z: f.dz,
                rotate: f.rot,
                scale: [0.35, 1.08, 0.52],
              }}
              transition={{
                duration: f.duration / 1000,
                delay: f.delay / 1000,
                times: [0, 0.11, 1],
                ease: ["easeOut", "easeInOut"],
              }}
            >
              <svg
                width={f.size * 2.4}
                height={f.size * 2.4}
                viewBox={`-${f.size * 1.2} -${f.size * 1.2} ${f.size * 2.4} ${f.size * 2.4}`}
              >
                <polygon points={f.points} fill={f.color} />
              </svg>
            </motion.span>
          ))}
        </span>
      )}
    </motion.button>
  );
}

function PileScene() {
  const planeRef = useRef<HTMLDivElement>(null);
  const reducedMotion = useReducedMotion();

  const handlePileMove = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      if (reducedMotion || !planeRef.current) return;
      const r = planeRef.current.getBoundingClientRect();
      const nx = (e.clientX - r.left) / r.width - 0.5;
      const ny = (e.clientY - r.top) / r.height - 0.5;
      planeRef.current.style.setProperty("--parx", `${(nx * 5).toFixed(2)}px`);
      planeRef.current.style.setProperty("--pary", `${(ny * 3).toFixed(2)}px`);
    },
    [reducedMotion],
  );

  const handlePileLeave = useCallback(() => {
    if (!planeRef.current) return;
    planeRef.current.style.setProperty("--parx", "0px");
    planeRef.current.style.setProperty("--pary", "0px");
  }, []);

  return (
    <div
      className={styles.pile}
      role="group"
      aria-label="Leaf pile"
      onMouseMove={handlePileMove}
      onMouseLeave={handlePileLeave}
    >
      <div ref={planeRef} className={styles.pilePlane}>
        {AMBIENT_CHIPS.map((chip, i) => (
          <img
            key={`chip-${i}`}
            src={chip.src}
            alt=""
            draggable={false}
            className={styles.ambientChip}
            aria-hidden
            style={{
              left: `${chip.x}%`,
              top: `${chip.y}%`,
              width: `${chip.size}px`,
              height: `${chip.size}px`,
              zIndex: chip.zIndex,
              opacity: chip.opacity,
              transform: `translate(-50%, -50%) rotate(${chip.rot}deg)`,
            }}
          />
        ))}
        {PILE.map((item, i) => (
          <PileLeaf
            key={i}
            item={item}
            index={i}
            totalLeaves={PILE.length}
          />
        ))}
      </div>
    </div>
  );
}

export default function LeavesLayer() {
  return (
    <section
      className={styles.section}
      aria-labelledby="leaf-invite-heading"
      aria-describedby="leaf-pile-hint"
    >
      <p id="leaf-invite-heading" className={styles.invite}>
        I gathered some leaves for you to crack.
      </p>
      <p className={styles.inviteSub}>They&apos;re crunchy.</p>
      <p id="leaf-pile-hint" className="sr-only">
        {LEAF_COUNT} dry leaves are scattered below. Activate any leaf to
        crack it. Cracked leaves are removed from keyboard navigation.
      </p>

      <PileScene />
    </section>
  );
}
