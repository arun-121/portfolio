export interface LeafConfig {
  x: number;       // world X (lateral)
  z: number;       // world Z — positive = near camera (bottom of frame, large)
  rotY: number;    // yaw — which compass direction the tip points
  tilt: number;    // pitch off the ground (some leaves leaning, some flat)
  rotZ: number;    // roll — the leaf's own spin around its normal
  scale: number;
  seed: number;
  color: string;
  pitch: number;
  flipped: boolean; // true = upside-down, showing the pale underside
  swayAmp: number;  // 0.4–1.6 multiplier on idle sway (some still, some restless)
  swayFreq: number; // 0.7–1.4 multiplier on idle sway frequency
}

// Camera at (0, 2.8, 6.5), fov 56.
// Placement is deliberately uneven — clusters, gaps, overlap. Not a grid.
// rotY is a full compass spin (any angle); tilt varies from flat-on-back
// (small tilt) to leaning-against-something (up to 0.35 rad). About a third
// of leaves are flipped, showing pale tan underside on top.

export const LEAVES: LeafConfig[] = [
  // ── Far horizon, sparse, small ──────────────────────────────────────────────
  { x: -2.9, z: -3.2, rotY:  1.84, tilt:  0.08, rotZ:  0.22, scale: 0.56, seed: 37,  color: "#8A7A48", pitch: 1.14, flipped: false, swayAmp: 0.7, swayFreq: 1.1 },
  { x: -0.4, z: -3.4, rotY: -0.62, tilt: -0.05, rotZ: -0.18, scale: 0.52, seed: 223, color: "#7A5030", pitch: 1.02, flipped: true,  swayAmp: 0.5, swayFreq: 0.9 },
  { x:  1.9, z: -2.7, rotY:  2.84, tilt:  0.12, rotZ:  0.31, scale: 0.58, seed: 251, color: "#C9993A", pitch: 0.90, flipped: false, swayAmp: 0.6, swayFreq: 1.2 },
  { x:  3.6, z: -3.0, rotY: -1.94, tilt: -0.09, rotZ:  0.05, scale: 0.54, seed: 127, color: "#B08258", pitch: 1.16, flipped: false, swayAmp: 0.8, swayFreq: 0.8 },

  // ── Mid distance, moderate density, some clusters ───────────────────────────
  { x: -3.8, z:  0.3, rotY:  0.42, tilt:  0.18, rotZ: -0.27, scale: 0.80, seed: 11,  color: "#B5502A", pitch: 1.00, flipped: false, swayAmp: 1.1, swayFreq: 1.0 },
  { x: -1.7, z:  0.7, rotY: -2.18, tilt: -0.22, rotZ:  0.14, scale: 0.84, seed: 103, color: "#C4682E", pitch: 0.88, flipped: true,  swayAmp: 0.9, swayFreq: 1.3 },
  { x: -1.1, z:  1.2, rotY:  0.74, tilt:  0.06, rotZ: -0.33, scale: 0.81, seed: 53,  color: "#8A7A48", pitch: 0.95, flipped: false, swayAmp: 1.3, swayFreq: 0.9 },
  { x:  0.6, z:  1.5, rotY:  2.42, tilt:  0.04, rotZ:  0.20, scale: 0.86, seed: 199, color: "#7A5030", pitch: 0.92, flipped: false, swayAmp: 0.6, swayFreq: 1.1 },
  { x:  2.4, z:  0.4, rotY: -0.88, tilt:  0.28, rotZ: -0.11, scale: 0.79, seed: 181, color: "#C9993A", pitch: 1.10, flipped: true,  swayAmp: 1.0, swayFreq: 1.2 },
  { x:  2.9, z:  1.3, rotY:  1.32, tilt: -0.07, rotZ:  0.36, scale: 0.83, seed: 89,  color: "#B08258", pitch: 1.22, flipped: false, swayAmp: 0.7, swayFreq: 0.8 },
  { x:  4.3, z:  0.9, rotY: -2.66, tilt:  0.05, rotZ:  0.08, scale: 0.78, seed: 71,  color: "#B5502A", pitch: 1.05, flipped: false, swayAmp: 1.2, swayFreq: 1.0 },

  // ── Mid-near transition, clusters of 2–3 leaves overlapping ─────────────────
  { x: -3.5, z:  2.4, rotY:  0.14, tilt:  0.10, rotZ: -0.24, scale: 0.92, seed: 23,  color: "#C4682E", pitch: 0.88, flipped: false, swayAmp: 0.9, swayFreq: 1.1 },
  { x: -2.9, z:  2.8, rotY: -1.46, tilt: -0.04, rotZ:  0.40, scale: 0.89, seed: 149, color: "#B5502A", pitch: 0.98, flipped: true,  swayAmp: 0.8, swayFreq: 0.9 },
  { x: -0.2, z:  2.6, rotY:  2.08, tilt:  0.22, rotZ: -0.16, scale: 0.96, seed: 211, color: "#C9993A", pitch: 1.05, flipped: false, swayAmp: 1.1, swayFreq: 1.3 },
  { x:  1.7, z:  2.2, rotY: -0.34, tilt: -0.31, rotZ:  0.28, scale: 0.94, seed: 37,  color: "#8A7A48", pitch: 1.18, flipped: false, swayAmp: 0.5, swayFreq: 0.8 },
  { x:  3.2, z:  2.9, rotY:  0.92, tilt:  0.16, rotZ: -0.04, scale: 0.91, seed: 127, color: "#7A5030", pitch: 0.96, flipped: true,  swayAmp: 1.0, swayFreq: 1.0 },

  // ── Near foreground, larger, dense bottom edge ──────────────────────────────
  { x: -4.4, z:  3.8, rotY: -2.42, tilt:  0.08, rotZ:  0.18, scale: 1.04, seed: 89,  color: "#C4682E", pitch: 1.12, flipped: false, swayAmp: 0.8, swayFreq: 1.1 },
  { x: -1.8, z:  3.6, rotY:  1.08, tilt:  0.34, rotZ: -0.38, scale: 1.08, seed: 251, color: "#B08258", pitch: 0.94, flipped: true,  swayAmp: 1.4, swayFreq: 1.2 },
  { x:  0.6, z:  4.0, rotY: -0.18, tilt: -0.12, rotZ:  0.07, scale: 1.10, seed: 167, color: "#C9993A", pitch: 1.06, flipped: false, swayAmp: 0.6, swayFreq: 0.9 },
  { x:  1.3, z:  3.7, rotY:  2.62, tilt:  0.20, rotZ: -0.22, scale: 1.06, seed: 19,  color: "#B5502A", pitch: 1.20, flipped: false, swayAmp: 1.0, swayFreq: 1.4 },
  { x:  3.4, z:  3.9, rotY: -1.74, tilt: -0.06, rotZ:  0.33, scale: 1.02, seed: 113, color: "#8A7A48", pitch: 0.92, flipped: true,  swayAmp: 0.7, swayFreq: 1.0 },
  { x:  4.6, z:  4.2, rotY:  0.58, tilt:  0.14, rotZ: -0.12, scale: 0.98, seed: 233, color: "#7A5030", pitch: 1.08, flipped: false, swayAmp: 1.2, swayFreq: 0.8 },
];
