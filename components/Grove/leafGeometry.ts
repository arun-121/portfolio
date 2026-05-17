import * as THREE from "three";

export type PieceName = "ul" | "ur" | "ll" | "lr";

const SHAPE_SEGMENTS = 24;

export function hexToRgb(hex: string): [number, number, number] {
  const h = hex.replace("#", "");
  return [
    parseInt(h.slice(0, 2), 16) / 255,
    parseInt(h.slice(2, 4), 16) / 255,
    parseInt(h.slice(4, 6), 16) / 255,
  ];
}

// Compute leaf surface Z at any (x, y) given curl/cup params
function leafZAt(x: number, y: number, curl: number, cup: number): number {
  const t = (y + 1) / 2;
  const longitudinal = Math.sin(t * Math.PI) * curl;
  const lat = Math.abs(x) / 0.5;
  const lateral = -(lat * lat * cup + lat * lat * lat * 0.05);
  return longitudinal + lateral;
}

// Leaf silhouette: pointed tip at y=+1, widest around y=0.42 (x≈±0.58),
// narrower at the equator (x=±0.42), tapering to a stem point at y=-1.
// A petiole extends below the body — built separately by buildPetioleGeometry.
function quadrantShape(piece: PieceName): THREE.Shape {
  const s = new THREE.Shape();
  switch (piece) {
    case "ul":
      s.moveTo(0, 1);
      // Sharp pinch at the tip, swelling out to widest x at y≈0.4, then
      // gently in to the equator (-0.42, 0).
      s.bezierCurveTo(-0.20, 0.86, -0.60, 0.55, -0.42, 0);
      s.lineTo(0, 0);
      s.lineTo(0, 1);
      break;
    case "ur":
      s.moveTo(0, 1);
      s.bezierCurveTo(0.20, 0.86, 0.60, 0.55, 0.42, 0);
      s.lineTo(0, 0);
      s.lineTo(0, 1);
      break;
    case "ll":
      // Equator (-0.42, 0), staying close to the edge briefly then drawing
      // inward to the base point (0, -1) — gives the stem-side taper.
      s.moveTo(0, 0);
      s.lineTo(-0.42, 0);
      s.bezierCurveTo(-0.42, -0.30, -0.28, -0.85, 0, -1);
      s.lineTo(0, 0);
      break;
    case "lr":
      s.moveTo(0, 0);
      s.lineTo(0.42, 0);
      s.bezierCurveTo(0.42, -0.30, 0.28, -0.85, 0, -1);
      s.lineTo(0, 0);
      break;
  }
  return s;
}

// Petiole — the short stem extending below the leaf body. Drawn as a thin
// tapered strip from y=-1.0 to y=-1.22. Lives at the leaf group level
// (doesn't crack with the four blade pieces — stays put when the leaf bursts).
export function buildPetioleGeometry(): THREE.BufferGeometry {
  const s = new THREE.Shape();
  s.moveTo(-0.024, -1.00);
  s.lineTo( 0.024, -1.00);
  s.lineTo( 0.010, -1.23);
  s.lineTo(-0.010, -1.23);
  s.closePath();
  return new THREE.ShapeGeometry(s);
}

// ── merged whole-leaf geometry (one mesh per leaf, not 4) ────────────────────

export function buildFullLeafGeometry(options: {
  curl?: number; cup?: number; wrinkle?: number; seed?: number; color?: string;
} = {}): THREE.BufferGeometry {
  const pieces: PieceName[] = ["ul", "ur", "ll", "lr"];
  const geos = pieces.map((p, i) =>
    buildPieceGeometry(p, { ...options, seed: (options.seed ?? 0) + i })
  );

  let totalVerts = 0;
  for (const g of geos) totalVerts += g.attributes.position.count;

  const positions = new Float32Array(totalVerts * 3);
  const normals   = new Float32Array(totalVerts * 3);
  const colors    = new Float32Array(totalVerts * 3);
  const indices: number[] = [];

  let vOff = 0;
  for (const g of geos) {
    const vc = g.attributes.position.count;
    positions.set(g.attributes.position.array as Float32Array, vOff * 3);
    normals.set(g.attributes.normal.array as Float32Array, vOff * 3);
    colors.set(g.attributes.color.array as Float32Array, vOff * 3);
    if (g.index) {
      for (let i = 0; i < g.index.count; i++) indices.push(g.index.array[i] + vOff);
    } else {
      for (let i = 0; i < vc; i++) indices.push(vOff + i);
    }
    vOff += vc;
    g.dispose();
  }

  const merged = new THREE.BufferGeometry();
  merged.setAttribute("position", new THREE.Float32BufferAttribute(positions, 3));
  merged.setAttribute("normal",   new THREE.Float32BufferAttribute(normals, 3));
  merged.setAttribute("color",    new THREE.Float32BufferAttribute(colors, 3));
  merged.setIndex(indices);
  return merged;
}

export function buildFullLeafVeins(options: { curl?: number; cup?: number } = {}): THREE.BufferGeometry {
  const pieces: PieceName[] = ["ul", "ur", "ll", "lr"];
  const geos = pieces.map(p => buildPieceVeins(p, options));

  let totalVerts = 0;
  for (const g of geos) totalVerts += g.attributes.position.count;

  const positions = new Float32Array(totalVerts * 3);
  let off = 0;
  for (const g of geos) {
    positions.set(g.attributes.position.array as Float32Array, off * 3);
    off += g.attributes.position.count;
    g.dispose();
  }

  const merged = new THREE.BufferGeometry();
  merged.setAttribute("position", new THREE.Float32BufferAttribute(positions, 3));
  return merged;
}

// ─────────────────────────────────────────────────────────────────────────────
function mulberry32(seed: number) {
  let a = seed >>> 0;
  return function () {
    a |= 0;
    a = (a + 0x6d2b79f5) | 0;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

export function buildPieceGeometry(
  piece: PieceName,
  options: {
    curl?: number;
    cup?: number;
    wrinkle?: number;
    seed?: number;
    color?: string;
  } = {},
): THREE.BufferGeometry {
  const curl = options.curl ?? 0.18;
  const cup = options.cup ?? 0.10;
  const wrinkle = options.wrinkle ?? 0.014;
  const seed = options.seed ?? 0;
  const baseColor: [number, number, number] = options.color
    ? hexToRgb(options.color)
    : [0.65, 0.50, 0.35];

  const shape = quadrantShape(piece);
  const geo = new THREE.ShapeGeometry(shape, SHAPE_SEGMENTS);

  // Separate PRNGs so geometry wrinkle and color spots are independent
  const randGeom = mulberry32(seed * 9301 + 49297);
  const randColor = mulberry32(seed * 2741 + 11317);

  const pos = geo.attributes.position;
  const colorArr = new Float32Array(pos.count * 3);

  for (let i = 0; i < pos.count; i++) {
    const x = pos.getX(i);
    const y = pos.getY(i);

    // Z displacement: dome + cupping + edge curl + wrinkle
    const t = (y + 1) / 2;
    const longitudinal = Math.sin(t * Math.PI) * curl;
    const lat = Math.abs(x) / 0.5;
    const lateral = -(lat * lat * cup + lat * lat * lat * 0.05);
    const w = (randGeom() - 0.5) * wrinkle;
    pos.setZ(i, longitudinal + lateral + w);

    // Vertex color ---------------------------------------------------
    const distFromSpine = Math.abs(x) / 0.5; // 0=spine, 1=edge
    const tipT = (y + 1) / 2;                 // 0=base, 1=tip

    // Spine is darker (simulates the midrib vascular bundle)
    const spineFactor = 0.63 + distFromSpine * 0.40;
    // Base of leaf slightly darker than tip
    const tipFactor = 0.88 + tipT * 0.16;
    // Organic undulation: multi-frequency sine breaks up uniformity
    const organic =
      Math.sin(x * 10.3 + seed * 0.7) * Math.sin(y * 8.1 + seed * 0.5) * 0.038 +
      Math.sin(x * 4.7 + seed * 1.4) * Math.cos(y * 6.2 + seed * 1.1) * 0.025;
    // Age spots: ~9 % of vertices darken into a soft patch
    const spotNoise = randColor();
    const spot = spotNoise < 0.09 ? 0.70 + spotNoise * 3.3 : 1.0;
    // Warm golden shift toward edges (r+, b-)
    const goldenR = distFromSpine * 0.055;
    const goldenG = distFromSpine * 0.008;
    const goldenB = distFromSpine * -0.048;

    const factor = spineFactor * tipFactor * spot + organic;
    colorArr[i * 3 + 0] = Math.min(1, Math.max(0, baseColor[0] * factor + goldenR));
    colorArr[i * 3 + 1] = Math.min(1, Math.max(0, baseColor[1] * factor + goldenG));
    colorArr[i * 3 + 2] = Math.min(1, Math.max(0, baseColor[2] * factor + goldenB));
  }

  pos.needsUpdate = true;
  geo.setAttribute("color", new THREE.Float32BufferAttribute(colorArr, 3));
  geo.computeVertexNormals();
  return geo;
}

export function buildPieceVeins(
  piece: PieceName,
  options: { curl?: number; cup?: number } = {},
): THREE.BufferGeometry {
  const curl = options.curl ?? 0.18;
  const cup = options.cup ?? 0.10;
  const ABOVE = 0.013; // sit just above the leaf surface

  function z(x: number, y: number): number {
    return leafZAt(x, y, curl, cup) + ABOVE;
  }

  const verts: number[] = [];

  // Midrib — the central spine from tip to base, split across piece pairs
  const SEG = 14;
  if (piece === "ul" || piece === "ur") {
    // Upper half: tip (y=1) down to equator (y=0)
    for (let i = 0; i < SEG; i++) {
      const y1 = 1.0 - i / SEG;
      const y2 = 1.0 - (i + 1) / SEG;
      verts.push(0, y1, z(0, y1), 0, y2, z(0, y2));
    }
  } else {
    // Lower half: equator (y=0) down to base (y=-1)
    for (let i = 0; i < SEG; i++) {
      const y1 = -(i / SEG);
      const y2 = -((i + 1) / SEG);
      verts.push(0, y1, z(0, y1), 0, y2, z(0, y2));
    }
  }

  // Lateral secondary veins — branch from midrib outward.
  // Endpoints stay just inside the new silhouette (tighter waist below y=0).
  const veinTable: Record<PieceName, Array<[number, number, number, number]>> = {
    ul: [
      [0, 0.82, -0.18, 0.72],
      [0, 0.62, -0.40, 0.48],
      [0, 0.40, -0.42, 0.24],
      [0, 0.18, -0.34, 0.06],
    ],
    ur: [
      [0, 0.82,  0.18, 0.72],
      [0, 0.62,  0.40, 0.48],
      [0, 0.40,  0.42, 0.24],
      [0, 0.18,  0.34, 0.06],
    ],
    ll: [
      [0, -0.15, -0.32, -0.32],
      [0, -0.42, -0.20, -0.62],
    ],
    lr: [
      [0, -0.15,  0.32, -0.32],
      [0, -0.42,  0.20, -0.62],
    ],
  };

  for (const [x1, y1, x2, y2] of veinTable[piece]) {
    verts.push(x1, y1, z(x1, y1), x2, y2, z(x2, y2));
  }

  const geo = new THREE.BufferGeometry();
  geo.setAttribute("position", new THREE.Float32BufferAttribute(verts, 3));
  return geo;
}
