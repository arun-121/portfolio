// Five-piece leaf, with irregular fracture lines.
//
// A real dry leaf doesn't split into clean quadrants when you crumple it.
// It fractures along the central spine (midrib) and the two strongest
// lateral veins, leaving roughly:
//
//   ┌────────────┐
//   │   tip      │   ← single fragment containing the tip
//   ├──────┬─────┤
//   │ midL │ midR │   ← two unequal-sized middle pieces, split by spine
//   ├──────┼─────┤
//   │ botL │ botR │   ← two bottom pieces, also split by spine
//   └──────┴─────┘
//
// All five edge boundaries are irregular curves, not straight lines, so
// the leaf reads as a real torn thing rather than a cookie cutter shape.
// Each piece has its own veins baked in (drawn inside the piece's group)
// so the venation breaks naturally when the leaf cracks.

import { type ShapeKey } from "./leafConfigs";

export type PieceName = "tip" | "midL" | "midR" | "botL" | "botR";

export const PIECE_NAMES: PieceName[] = ["tip", "midL", "midR", "botL", "botR"];

interface ShapeDef {
  pieces: Record<PieceName, string>;
  veins: Record<PieceName, string[]>;
  stem: string;
}

// ── almond ────────────────────────────────────────────────────────────
// classic dry-leaf shape, rounded shoulders, pointed tip and base.
// viewBox: -40 -65 80 130
// tip at (0, -55), widest near (±32, -8), base at (0, 55), stem to (2, 64)
//
// Fracture geometry:
//   upper-cross runs irregularly from (-22, -26) → (22, -26)
//                                     with bumps around (-13,-24)/(-2,-25)/(4,-22)/(13,-24)
//   lower-cross runs from (-20, 20) → (20, 22)
//                                     with bumps around (-10,22)/(-2,19)/(3,21)/(12,20)
//   spine runs from (3, -22) → (-1, 0) → (1, 20) → (0, 55)
const almond: ShapeDef = {
  pieces: {
    // ── tip cap — full-width top fragment, above the upper-cross ───
    tip: [
      "M 0 -55",
      "C -7 -53, -18 -44, -22 -26",     // outline down the left
      "C -14 -23, -4 -25, 3 -22",        // upper-cross, left half → spine
      "C 11 -24, 18 -25, 22 -26",        // upper-cross, spine → right
      "C 19 -44, 8 -53, 0 -55 Z",        // outline back to tip
    ].join(" "),

    // ── midL — left middle, between upper-cross and lower-cross ────
    midL: [
      "M -22 -26",                       // start at left end of upper-cross
      "C -29 -22, -32 -14, -32 -4",      // outline left going down
      "C -32 8, -28 17, -20 20",         // outline to left end of lower-cross
      "Q -10 22, 1 20",                  // lower-cross, outline → spine
      "C 2 8, -1 -8, 3 -22",             // spine going up (wavy)
      "C -4 -25, -14 -23, -22 -26 Z",    // upper-cross back to start
    ].join(" "),

    // ── midR — right middle, mirror of midL ──────────────────────
    midR: [
      "M 22 -26",
      "C 29 -22, 32 -14, 32 -4",
      "C 32 8, 28 17, 20 22",
      "Q 10 20, 1 20",
      "C -2 8, 1 -8, 3 -22",
      "C 11 -24, 18 -25, 22 -26 Z",
    ].join(" "),

    // ── botL — bottom-left fragment, below lower-cross ─────────────
    botL: [
      "M -20 20",                        // start at left end of lower-cross
      "Q -10 22, 1 20",                  // lower-cross to spine
      "C 1 32, -2 44, 0 55",             // spine down to base (slight wave)
      "C -6 53, -12 47, -16 38",         // outline up from base
      "C -19 30, -20 24, -20 20 Z",      // outline back to start
    ].join(" "),

    // ── botR — bottom-right, mirror of botL ──────────────────────
    botR: [
      "M 20 22",
      "Q 10 20, 1 20",
      "C 1 32, -2 44, 0 55",
      "C 6 53, 12 47, 16 38",
      "C 19 30, 20 26, 20 22 Z",
    ].join(" "),
  },

  veins: {
    // tip cap: midrib top + a couple of upper laterals
    tip: [
      "M 0 -53 L 0 -23",
      "M 0 -42 Q -5 -45, -16 -34",
      "M 0 -42 Q  5 -45,  16 -34",
      "M 0 -30 Q -8 -32, -19 -26",
      "M 0 -30 Q  8 -32,  19 -26",
    ],
    // midL: half-midrib on the left side of the spine + 2 laterals
    midL: [
      "M -1 -20 C -1 -8, 0 5, 0 19",
      "M 0 -12 Q -8 -14, -22 -8",
      "M 0 3 Q -10 4, -26 4",
      "M 0 15 Q -8 16, -16 22",
    ],
    midR: [
      "M 1 -20 C 1 -8, 0 5, 0 19",
      "M 0 -12 Q  8 -14,  22 -8",
      "M 0 3 Q  10 4,  26 4",
      "M 0 15 Q  8 16,  16 22",
    ],
    // botL: half-midrib bottom + one lateral
    botL: [
      "M 0 21 C 0 32, -1 42, 0 53",
      "M 0 28 Q -7 30, -12 38",
      "M 0 40 Q -4 42, -8 48",
    ],
    botR: [
      "M 0 21 C 0 32,  1 42, 0 53",
      "M 0 28 Q  7 30,  12 38",
      "M 0 40 Q  4 42,  8 48",
    ],
  },

  stem: "M 0 55 Q 1 60, 2 64",
};

export const SHAPES: Record<ShapeKey, ShapeDef> = {
  // for now all variants use the almond breakdown — variety comes from
  // color, rotation, and scale per-leaf. easier to maintain a single
  // well-tuned fracture pattern than three half-good ones.
  almond,
  narrow: almond,
  oval: almond,
};

// ── color helpers ─────────────────────────────────────────────────────

export function lighten(hex: string, amount: number): string {
  const { r, g, b } = hexToRgb(hex);
  return rgbToHex(
    Math.min(255, Math.round(r + (255 - r) * amount)),
    Math.min(255, Math.round(g + (255 - g) * amount)),
    Math.min(255, Math.round(b + (255 - b) * amount)),
  );
}

export function darken(hex: string, amount: number): string {
  const { r, g, b } = hexToRgb(hex);
  return rgbToHex(
    Math.max(0, Math.round(r * (1 - amount))),
    Math.max(0, Math.round(g * (1 - amount))),
    Math.max(0, Math.round(b * (1 - amount))),
  );
}

function hexToRgb(hex: string): { r: number; g: number; b: number } {
  const h = hex.replace("#", "");
  return {
    r: parseInt(h.slice(0, 2), 16),
    g: parseInt(h.slice(2, 4), 16),
    b: parseInt(h.slice(4, 6), 16),
  };
}

function rgbToHex(r: number, g: number, b: number): string {
  const h = (n: number) => n.toString(16).padStart(2, "0");
  return `#${h(r)}${h(g)}${h(b)}`;
}
