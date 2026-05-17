# Arun S R — Portfolio

A small Next.js site. The grove at the bottom is a real 3D scene
(React Three Fiber) with proper lighting, soft shadows, and
spring-physics cracking.

## Run

```bash
npm install
npm run dev
```

Then open [http://localhost:3000](http://localhost:3000).

> `.npmrc` sets `legacy-peer-deps=true` so the R3F + react-spring + drei
> install resolves cleanly across React 19. If you switch to pnpm or
> yarn, set the equivalent flag.

> If the sandbox left a partial `node_modules/` and `npm install` errors
> with `ENOTEMPTY`, run `rm -rf node_modules package-lock.json` first.

## Structure

```
app/
  layout.tsx            — root layout, Fraunces + Inter
  page.tsx              — greeting, prose, writing, find, grove, footer
  globals.css           — palette and type
components/
  LocalClock.tsx        — small live time in the footer
  Grove/
    Grove.tsx           — section wrapper, dynamic-imports Scene (no SSR)
    Scene.tsx           — Canvas, lighting, ground, ContactShadows
    Leaf3D.tsx          — one leaf, 4 spring-animated piece meshes
    leafGeometry.ts     — leaf-piece geometry with vertex displacement
                          for curl, cup, and per-leaf wrinkle noise
    shapes.ts           — per-leaf placement (x, z, rotation, color, …)
    grove.module.css    — section spacing and canvas frame
lib/
  leafAudio.ts          — synthesized crack sound with convolver reverb
public/
  Arun-S-R-Resume.docx
```

## What's where, conceptually

- **Geometry**: each leaf piece is a `ShapeGeometry` from a quadrant
  of a bezier leaf outline, then every vertex is pushed in Z based on
  its position — a longitudinal sine for the dome, a lateral square
  for the cupping, plus a tiny per-vertex noise so the surface has dry
  wrinkle. `computeVertexNormals` runs after, so lighting reads right.

- **Lighting**: a warm `hemisphereLight` (cream sky → amber ground),
  a strong directional key from upper-right that casts shadows, and a
  cool fill from the back-left so shadowed areas don't go to black.
  Tone mapping is ACES filmic with exposure ≈ 1.05.

- **Shadows**: shadow map on the key directional plus a `ContactShadows`
  pass for soft ground contact under each leaf.

- **Crack**: each piece is driven by a `@react-spring/three` spring with
  randomized target position and rotation per click. Snap config is
  stiff (tension 320, friction 16), return config is soft (tension 90,
  friction 18), so the snap feels sharp and the recovery feels heavy.

- **Sound**: synthesized in `lib/leafAudio.ts` — a low body thump
  (filtered noise, lowpass ~280Hz), a mid crack (bandpass at ~850Hz),
  and 5-8 staggered high crackle bursts (highpass + bandpass). All
  routed through a synthesized impulse-response reverb at ~18% wet.

## Writing

The writing list in `app/page.tsx` is placeholder entries with a
`Technical · 2026` / `Reflection · 2026` tag system. When you want a
real blog, the natural next step is `app/writing/[slug]/page.tsx` with
MDX. That's not wired up yet on purpose — when you have a first post,
we'll set it up.
