"use client";

import { memo } from "react";

// Inline maple leaf SVG, split into 5 lobe paths that can be flung
// outward with arbitrary per-crack trajectories. The pile component
// rolls fresh trajectories every click so no two cracks of the same
// leaf look identical.

export type LobeName = "top" | "upperR" | "lowerR" | "lowerL" | "upperL";

export const LOBE_PATHS: Record<LobeName, string> = {
  top:    "M 18 -24 C 14 -30, 8 -38, 0 -48 C -8 -38, -14 -30, -18 -24 L 0 0 Z",
  upperR: "M 16 8 C 26 0, 35 -8, 38 -16 C 30 -18, 22 -22, 18 -24 L 0 0 Z",
  lowerR: "M 0 40 C 8 38, 18 34, 25 22 C 20 16, 14 10, 16 8 L 0 0 Z",
  lowerL: "M -16 8 C -14 10, -20 16, -25 22 C -18 34, -8 38, 0 40 L 0 0 Z",
  upperL: "M -18 -24 C -22 -22, -30 -18, -38 -16 C -35 -8, -26 0, -16 8 L 0 0 Z",
};

export const LOBE_VEINS: Record<LobeName, string[]> = {
  top: [
    "M 0 0 L 0 -44",
    "M 0 -20 L -10 -28",
    "M 0 -20 L 10 -28",
    "M 0 -32 L -6 -38",
    "M 0 -32 L 6 -38",
  ],
  upperR: [
    "M 0 0 L 35 -15",
    "M 14 -6 L 22 -18",
    "M 20 -8 L 28 -3",
  ],
  lowerR: [
    "M 0 0 L 22 22",
    "M 8 8 L 18 16",
    "M 12 14 L 20 26",
  ],
  lowerL: [
    "M 0 0 L -22 22",
    "M -8 8 L -18 16",
    "M -12 14 L -20 26",
  ],
  upperL: [
    "M 0 0 L -35 -15",
    "M -14 -6 L -22 -18",
    "M -20 -8 L -28 -3",
  ],
};

export const LOBE_NAMES: LobeName[] = ["top", "upperR", "lowerR", "lowerL", "upperL"];

// Each lobe's default trajectory direction. The pile component layers
// randomization on top of these — angle/distance/rotation all jitter.
export const LOBE_DIRECTIONS: Record<LobeName, { dx: number; dy: number; rot: number }> = {
  top:    { dx:  0,   dy: -1,   rot:   0 },
  upperR: { dx:  0.9, dy: -0.5, rot:  35 },
  lowerR: { dx:  0.7, dy:  0.7, rot:  22 },
  lowerL: { dx: -0.7, dy:  0.7, rot: -22 },
  upperL: { dx: -0.9, dy: -0.5, rot: -35 },
};

// Dry-brown palette — every leaf picks one entry. Mid is the body color,
// light is the highlight at the leaf's center, dark is the rim + veins.
export const PALETTE: Array<{ light: string; mid: string; dark: string }> = [
  { light: "#B0865A", mid: "#7E5530", dark: "#3F2510" },
  { light: "#A07550", mid: "#6E4828", dark: "#3A2010" },
  { light: "#C49770", mid: "#8B6240", dark: "#4A2E18" },
  { light: "#9C7148", mid: "#6A4220", dark: "#341E0E" },
  { light: "#A88860", mid: "#766040", dark: "#3E2E1A" },
  { light: "#B58660", mid: "#84572E", dark: "#42260F" },
];

// Per-lobe trajectory override — the pile rolls these freshly each click
export interface LobeTransform {
  dx: number;   // pixel offset along x (in SVG viewBox units)
  dy: number;
  rot: number;  // degrees
}

interface Props {
  paletteIndex: number;
  uid: string;
  /** When set, each lobe flies to its override position; otherwise lobes rest. */
  lobeOverrides?: Partial<Record<LobeName, LobeTransform>>;
}

function MapleLeafImpl({ paletteIndex, uid, lobeOverrides }: Props) {
  const palette = PALETTE[paletteIndex % PALETTE.length];
  const gradId = `mg-${uid}`;
  const cracking = !!lobeOverrides;

  return (
    <svg viewBox="-50 -55 100 110" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <radialGradient id={gradId} cx="0.5" cy="0.42" r="0.62">
          <stop offset="0%" stopColor={palette.light} />
          <stop offset="55%" stopColor={palette.mid} />
          <stop offset="100%" stopColor={palette.dark} />
        </radialGradient>
      </defs>

      <path
        d="M 0 40 Q 1 47, 3 52"
        stroke={palette.dark}
        strokeWidth={1.6}
        fill="none"
        strokeLinecap="round"
      />

      {LOBE_NAMES.map((name) => {
        const override = lobeOverrides?.[name];
        const transform = override
          ? `translate(${override.dx.toFixed(2)}, ${override.dy.toFixed(2)}) rotate(${override.rot.toFixed(1)})`
          : undefined;
        return (
          <g
            key={name}
            transform={transform}
            style={{
              transition: cracking
                ? "transform 200ms cubic-bezier(0.55, 0, 0.35, 1)"
                : "transform 950ms cubic-bezier(0.16, 1, 0.3, 1)",
              transformOrigin: "0 0",
            }}
          >
            <path
              d={LOBE_PATHS[name]}
              fill={`url(#${gradId})`}
              stroke={palette.dark}
              strokeWidth={0.9}
              strokeLinejoin="round"
            />
            {LOBE_VEINS[name].map((d, i) => (
              <path
                key={i}
                d={d}
                stroke={palette.dark}
                strokeWidth={i === 0 ? 1.0 : 0.6}
                fill="none"
                opacity={i === 0 ? 0.72 : 0.5}
                strokeLinecap="round"
              />
            ))}
          </g>
        );
      })}
    </svg>
  );
}

export const MapleLeaf = memo(MapleLeafImpl);
