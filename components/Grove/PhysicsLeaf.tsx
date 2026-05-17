"use client";

import { useRef, useMemo, useCallback, useState, useEffect } from "react";
import { useFrame } from "@react-three/fiber";
import { animated, useSpring } from "@react-spring/three";
import type { ThreeEvent } from "@react-three/fiber";
import * as THREE from "three";
import {
  buildPieceGeometry,
  buildPieceVeins,
  buildPetioleGeometry,
  hexToRgb,
} from "./leafGeometry";
import type { PieceName } from "./leafGeometry";
import { playCrack, warmAudio } from "@/lib/leafAudio";
import type { LeafConfig } from "./shapes";

// ── Constants ─────────────────────────────────────────────────────────────────

const CURL = 0.18;
const CUP  = 0.10;

const CRACK_OUT_CFG = { tension: 420, friction: 7,  mass: 0.55 };
const RETURN_CFG    = { tension: 58,  friction: 24, mass: 3.6  };

const PIECES: PieceName[] = ["ul", "ur", "ll", "lr"];

// Where each quadrant travels on crack (local units — scaled by leaf scale)
const CRACK_TARGETS: Record<PieceName, { pos: [number,number,number]; rot: [number,number,number] }> = {
  ul: { pos: [-0.56,  0.54,  0.36], rot: [-0.42,  0.32, -1.12] },
  ur: { pos: [ 0.56,  0.54,  0.33], rot: [-0.42, -0.32,  1.05] },
  ll: { pos: [-0.53, -0.47,  0.29], rot: [ 0.36,  0.26, -0.97] },
  lr: { pos: [ 0.53, -0.47,  0.24], rot: [ 0.36, -0.26,  0.97] },
};

// ── Shared materials (created once for all leaves) ────────────────────────────

const frontMat = new THREE.MeshStandardMaterial({
  vertexColors: true,
  roughness: 0.92,
  metalness: 0.0,
  side: THREE.FrontSide,
});

// Underside: warm pale tan — the dry straw look of a dead leaf's belly
const backMat = new THREE.MeshStandardMaterial({
  color: new THREE.Color(0.77, 0.67, 0.49),
  roughness: 0.95,
  metalness: 0.0,
  side: THREE.BackSide,
});

// Petiole (stem) — dark woody brown, double-sided so it reads from any angle
const petioleMat = new THREE.MeshStandardMaterial({
  color: new THREE.Color(0.30, 0.21, 0.12),
  roughness: 0.94,
  metalness: 0.0,
  side: THREE.DoubleSide,
});

const petioleGeo = buildPetioleGeometry();

// ── Deterministic PRNG ────────────────────────────────────────────────────────

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

// ── Single leaf quadrant with its own spring ──────────────────────────────────

interface PieceProps {
  name: PieceName;
  cracked: boolean;
  geo: THREE.BufferGeometry;
  veinGeo: THREE.BufferGeometry;
  veinColor: THREE.Color;
  jitter: { px: number; py: number; pz: number; rx: number; ry: number; rz: number };
  onPointerOver: (e: ThreeEvent<PointerEvent>) => void;
  onPointerOut: (e: ThreeEvent<PointerEvent>) => void;
  onClick: (e: ThreeEvent<MouseEvent>) => void;
}

function LeafPiece({
  name, cracked, geo, veinGeo, veinColor, jitter,
  onPointerOver, onPointerOut, onClick,
}: PieceProps) {
  const target = CRACK_TARGETS[name];

  const [{ position, rotation }, api] = useSpring(() => ({
    position: [0, 0, 0] as [number, number, number],
    rotation: [0, 0, 0] as [number, number, number],
    config: CRACK_OUT_CFG,
  }));

  useEffect(() => {
    if (cracked) {
      api.start({
        position: [
          target.pos[0] + jitter.px,
          target.pos[1] + jitter.py,
          target.pos[2] + jitter.pz,
        ],
        rotation: [
          target.rot[0] + jitter.rx,
          target.rot[1] + jitter.ry,
          target.rot[2] + jitter.rz,
        ],
        config: CRACK_OUT_CFG,
      });
    } else {
      api.start({
        position: [0, 0, 0],
        rotation: [0, 0, 0],
        config: RETURN_CFG,
      });
    }
  }, [cracked, api, target, jitter]);

  return (
    <animated.group position={position} rotation={rotation}>
      <mesh
        castShadow
        receiveShadow
        geometry={geo}
        material={frontMat}
        onClick={onClick}
        onPointerOver={onPointerOver}
        onPointerOut={onPointerOut}
      />
      <mesh geometry={geo} material={backMat} />
      <lineSegments geometry={veinGeo}>
        <lineBasicMaterial color={veinColor} transparent opacity={0.65} />
      </lineSegments>
    </animated.group>
  );
}

// ── Full leaf ─────────────────────────────────────────────────────────────────
//
// Group nesting (outer → inner):
//   placement   — world position
//   yaw         — rotation around world up (Y). this is the compass direction.
//   pitch       — rotation around the (yawed) X. lays the leaf flat, with tilt.
//                 sway modulates this each frame.
//   roll        — rotation around the leaf's normal (Z after pitch).
//                 sway also nudges this.
//   body        — petiole + four blade pieces.
//
// The previous version used a single Euler XYZ rotation which applies yaw
// AFTER pitch in the intrinsic frame — so leaves weren't actually pointing
// in their config compass directions. Nesting fixes that.

export default function PhysicsLeaf({ config }: { config: LeafConfig }) {
  const pitchRef = useRef<THREE.Group>(null);
  const rollRef  = useRef<THREE.Group>(null);
  const [cracked, setCracked] = useState(false);
  const cooldown = useRef(false);

  // Per-leaf sway parameters derived from seed — no two leaves move alike
  const swayParams = useMemo(() => {
    const rng = mulberry32(config.seed * 1019 + 7);
    return {
      ampX:   (0.010 + rng() * 0.018) * config.swayAmp,
      ampZ:   (0.006 + rng() * 0.012) * config.swayAmp,
      freqX:  (0.42 + rng() * 0.34)  * config.swayFreq,
      freqZ:  (0.28 + rng() * 0.24)  * config.swayFreq,
      phaseX: rng() * Math.PI * 2,
      phaseZ: rng() * Math.PI * 2,
    };
  }, [config.seed, config.swayAmp, config.swayFreq]);

  // Flipped leaves lie belly-up — +π/2 on the pitch axis instead of -π/2
  const baseFlat = config.flipped ? Math.PI / 2 : -Math.PI / 2;
  const restPitch = baseFlat + config.tilt;
  const restRoll  = config.rotZ;

  // ── geometry ────────────────────────────────────────────────────────────────
  const geos = useMemo(
    () =>
      PIECES.map((p, i) =>
        buildPieceGeometry(p, {
          seed: config.seed + i * 97,
          color: config.color,
          curl: CURL,
          cup: CUP,
        }),
      ),
    [config.seed, config.color],
  );

  const veinGeos = useMemo(
    () => PIECES.map(p => buildPieceVeins(p, { curl: CURL, cup: CUP })),
    [],
  );

  const veinColor = useMemo(() => {
    const [r, g, b] = hexToRgb(config.color);
    return new THREE.Color(r * 0.43, g * 0.40, b * 0.37);
  }, [config.color]);

  // Fixed per-piece jitter — stable across crack/return cycles for one leaf
  const jitters = useMemo(
    () =>
      PIECES.map((_, i) => {
        const rng = mulberry32(config.seed * 17 + i * 31);
        return {
          px: (rng() - 0.5) * 0.20,
          py: (rng() - 0.5) * 0.14,
          pz: rng() * 0.14,
          rx: (rng() - 0.5) * 0.38,
          ry: (rng() - 0.5) * 0.28,
          rz: (rng() - 0.5) * 0.32,
        };
      }),
    [config.seed],
  );

  // ── idle sway ───────────────────────────────────────────────────────────────
  useFrame(({ clock }) => {
    const now = clock.getElapsedTime();
    if (pitchRef.current) {
      pitchRef.current.rotation.x =
        restPitch +
        Math.sin(now * swayParams.freqX + swayParams.phaseX) * swayParams.ampX;
    }
    if (rollRef.current) {
      rollRef.current.rotation.z =
        restRoll +
        Math.sin(now * swayParams.freqZ + swayParams.phaseZ) * swayParams.ampZ;
    }
  });

  // ── hover lift — small spring on the outer group's y position ────────────────
  const [hovered, setHovered] = useState(false);
  const hoverSpring = useSpring({
    y: hovered ? 0.08 : 0,
    config: { tension: 260, friction: 22 },
  });

  // ── interaction ──────────────────────────────────────────────────────────────
  const handlePointerOver = useCallback((e: ThreeEvent<PointerEvent>) => {
    e.stopPropagation();
    setHovered(true);
    warmAudio();
    document.body.style.cursor = "pointer";
  }, []);

  const handlePointerOut = useCallback((e: ThreeEvent<PointerEvent>) => {
    e.stopPropagation();
    setHovered(false);
    document.body.style.cursor = "";
  }, []);

  const handleClick = useCallback(
    (e: ThreeEvent<MouseEvent>) => {
      e.stopPropagation();
      if (cooldown.current) return;
      cooldown.current = true;

      // sound fires at the moment of click — visual follows fractionally after
      playCrack(config.pitch);
      warmAudio();

      // brief hit-stop, then crack, then settle
      setTimeout(() => {
        setCracked(true);
        setTimeout(() => {
          setCracked(false);
          setTimeout(() => {
            cooldown.current = false;
          }, 1900);
        }, 650);
      }, 24);
    },
    [config.pitch],
  );

  // ── nested groups: yaw → pitch → roll → body ────────────────────────────────
  return (
    <animated.group
      position-x={config.x}
      position-z={config.z}
      position-y={hoverSpring.y as unknown as number}
    >
      <group rotation-y={config.rotY}>
        <group ref={pitchRef} rotation-x={restPitch}>
          <group ref={rollRef} rotation-z={restRoll} scale={config.scale}>
            {/* petiole stays anchored — doesn't crack with the blade */}
            <mesh geometry={petioleGeo} material={petioleMat} />

            {PIECES.map((name, i) => (
              <LeafPiece
                key={name}
                name={name}
                cracked={cracked}
                geo={geos[i]}
                veinGeo={veinGeos[i]}
                veinColor={veinColor}
                jitter={jitters[i]}
                onPointerOver={handlePointerOver}
                onPointerOut={handlePointerOut}
                onClick={handleClick}
              />
            ))}
          </group>
        </group>
      </group>
    </animated.group>
  );
}
