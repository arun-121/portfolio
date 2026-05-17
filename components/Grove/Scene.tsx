"use client";

import { Canvas } from "@react-three/fiber";
import { ContactShadows } from "@react-three/drei";
import * as THREE from "three";
import PhysicsLeaf from "./PhysicsLeaf";
import { LEAVES } from "./shapes";

export default function Scene() {
  return (
    <Canvas
      shadows
      dpr={[1, 2]}
      camera={{ position: [0, 2.8, 6.5], fov: 56, near: 0.1, far: 40 }}
      gl={{
        antialias: true,
        toneMapping: THREE.ACESFilmicToneMapping,
        toneMappingExposure: 1.08,
      }}
      style={{ background: "transparent" }}
    >
      <hemisphereLight args={["#F5E6C8", "#C9A878", 0.55]} />

      <directionalLight
        position={[3, 6, 4]}
        intensity={2.1}
        color="#FFE3B0"
        castShadow
        shadow-mapSize-width={2048}
        shadow-mapSize-height={2048}
        shadow-camera-left={-12}
        shadow-camera-right={12}
        shadow-camera-top={10}
        shadow-camera-bottom={-10}
        shadow-camera-near={0.5}
        shadow-camera-far={32}
        shadow-bias={-0.0002}
      />
      <directionalLight position={[-4, 3, -3]} intensity={0.30} color="#E0CFA8" />

      {LEAVES.map((cfg, i) => (
        <PhysicsLeaf key={i} config={cfg} />
      ))}

      {/* Shadow-only ground plane */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.001, 0]} receiveShadow>
        <planeGeometry args={[60, 60]} />
        <shadowMaterial transparent opacity={0.18} />
      </mesh>

      <ContactShadows
        position={[0, 0.004, 0]}
        opacity={0.34}
        scale={26}
        blur={3.0}
        far={2.5}
        resolution={1024}
        color="#3D2A14"
      />
    </Canvas>
  );
}
