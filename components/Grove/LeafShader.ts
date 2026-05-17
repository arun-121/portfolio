import * as THREE from "three";

// MeshStandardMaterial with two modifications injected via onBeforeCompile:
//   1. Back face: blend toward pale straw (dried leaf underside)
//   2. SSS approximation: warm amber light bleeds through the thin surface
//
// Using onBeforeCompile keeps tone-mapping, shadows, and color-space handling
// inside Three.js — no need to reimplement PBR from scratch.

export function createLeafMaterial(): THREE.MeshStandardMaterial {
  const mat = new THREE.MeshStandardMaterial({
    vertexColors: true,
    roughness: 0.92,
    metalness: 0.01,
    side: THREE.DoubleSide,
  });

  mat.onBeforeCompile = (shader) => {
    // Uniform declarations go at the very top of the fragment source
    shader.fragmentShader =
      `uniform vec3 uPaleStraw;\n` + shader.fragmentShader;

    shader.uniforms.uPaleStraw = {
      value: new THREE.Color(0.78, 0.70, 0.52), // underside of a dried leaf
    };

    // ── 1. Two-sided color ────────────────────────────────────────────────
    // After Three.js blends diffuseColor × vertex color, tint the back face.
    shader.fragmentShader = shader.fragmentShader.replace(
      `#include <color_fragment>`,
      `#include <color_fragment>
      if (!gl_FrontFacing) {
        // Blend 55 % toward pale straw, keep 45 % of the front vertex color
        diffuseColor.rgb = mix(uPaleStraw, diffuseColor.rgb * 0.82, 0.45);
      }`
    );

    // ── 2. Subsurface scattering approximation ────────────────────────────
    // Inject just before output_fragment — at that point outgoingLight IS
    // declared (it's computed right after lights_fragment_end, before output).
    shader.fragmentShader = shader.fragmentShader.replace(
      `#include <output_fragment>`,
      `{
        vec3 sssLight = normalize(vec3(0.38, 0.75, 0.50));
        float sss = max(0.0, dot(-normalize(vNormal), sssLight));
        sss = pow(sss, 4.0) * 0.32;
        outgoingLight += sss * vec3(0.94, 0.78, 0.44) * diffuseColor.rgb;
      }
      #include <output_fragment>`
    );
  };

  // All leaf materials share the same compiled program
  mat.customProgramCacheKey = () => "leaf-v1";

  return mat;
}
