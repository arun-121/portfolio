// Each leaf lives inside the field container at the bottom of the page.
// top/left are percentages relative to the field's dimensions.
// Sizes 60–95 px give enough room for the crack pieces to fly without
// running into each other.

export type ShapeKey = "almond" | "narrow" | "oval";

export interface LeafConfig {
  /** vertical position inside the field, e.g. "30%" */
  top: string;
  /** horizontal position inside the field, e.g. "12%" */
  left: string;
  /** base width in pixels — leaf height ≈ 1.65× this */
  size: number;
  /** initial rotation in degrees (compass) */
  rotation: number;
  /** primary leaf color */
  color: string;
  shape?: ShapeKey;
  /** true = pale tan underside up */
  flipped?: boolean;
  /** sound pitch multiplier so leaves don't all sound the same */
  pitch?: number;
  /** small extra rotation amount during the sway loop (degrees) */
  swayAmp?: number;
  /** duration of one sway cycle (seconds) */
  swayDur?: number;
  /** phase offset so leaves don't sway in sync (seconds) */
  swayDelay?: number;
}

export const LEAVES: LeafConfig[] = [
  // ── upper row, varied ──────────────────────────────────────────
  { top: "10%", left: "6%",  size: 72, rotation: -32, color: "#A88461", pitch: 1.00, swayAmp: 2.4, swayDur: 5.6, swayDelay: 0.0 },
  { top: "16%", left: "22%", size: 64, rotation:  48, color: "#B5502A", pitch: 1.14, swayAmp: 2.8, swayDur: 6.4, swayDelay: 1.2, flipped: true },
  { top: "8%",  left: "44%", size: 80, rotation: -12, color: "#C4682E", pitch: 0.92, swayAmp: 2.0, swayDur: 7.0, swayDelay: 0.6 },
  { top: "12%", left: "62%", size: 70, rotation:  88, color: "#C9993A", pitch: 1.06, swayAmp: 3.0, swayDur: 5.8, swayDelay: 1.8 },
  { top: "6%",  left: "82%", size: 78, rotation: -55, color: "#8A7A48", pitch: 0.95, swayAmp: 2.5, swayDur: 6.4, swayDelay: 0.4, flipped: true },

  // ── middle row, larger leaves ───────────────────────────────────
  { top: "42%", left: "12%", size: 88, rotation:  25, color: "#B08258", pitch: 1.10, swayAmp: 2.2, swayDur: 6.8, swayDelay: 2.2 },
  { top: "46%", left: "34%", size: 82, rotation: -68, color: "#7A5030", pitch: 1.20, swayAmp: 3.2, swayDur: 5.6, swayDelay: 0.9 },
  { top: "40%", left: "54%", size: 92, rotation:  18, color: "#A88461", pitch: 0.88, swayAmp: 2.0, swayDur: 7.2, swayDelay: 1.4 },
  { top: "48%", left: "74%", size: 76, rotation: -28, color: "#C4682E", pitch: 1.04, swayAmp: 2.6, swayDur: 6.0, swayDelay: 0.3, flipped: true },

  // ── lower row, overlap into the middle for a natural pile ──────
  { top: "70%", left: "8%",  size: 86, rotation:  62, color: "#B5502A", pitch: 0.96, swayAmp: 2.2, swayDur: 6.6, swayDelay: 1.6 },
  { top: "74%", left: "28%", size: 78, rotation: -42, color: "#8A7A48", pitch: 1.08, swayAmp: 2.5, swayDur: 6.2, swayDelay: 0.7 },
  { top: "68%", left: "48%", size: 90, rotation:  -8, color: "#C9993A", pitch: 1.02, swayAmp: 2.4, swayDur: 7.4, swayDelay: 2.0, flipped: true },
  { top: "76%", left: "66%", size: 74, rotation:  35, color: "#7A5030", pitch: 1.18, swayAmp: 3.0, swayDur: 5.4, swayDelay: 1.0 },
  { top: "72%", left: "86%", size: 82, rotation: -72, color: "#B08258", pitch: 0.90, swayAmp: 2.0, swayDur: 7.0, swayDelay: 0.5 },
];
