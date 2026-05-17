// Dry-leaf cracks, synthesized on demand — four distinct recipes so leaves
// don't all sound identical. Each variant still gets per-click pitch jitter.

let ctx: AudioContext | null = null;
let reverb: ConvolverNode | null = null;
let reverbWet: GainNode | null = null;
let dryBus: GainNode | null = null;

/** Four crack characters — assign per leaf (0–3). */
export type CrackVariant = 0 | 1 | 2 | 3;
export const CRACK_VARIANT_COUNT = 4;

function makeReverbBuffer(c: AudioContext, duration = 0.42): AudioBuffer {
  const len = Math.floor(c.sampleRate * duration);
  const buf = c.createBuffer(2, len, c.sampleRate);
  for (let ch = 0; ch < 2; ch++) {
    const data = buf.getChannelData(ch);
    for (let i = 0; i < len; i++) {
      const env = Math.pow(1 - i / len, 2.8);
      data[i] = (Math.random() * 2 - 1) * env * 0.6;
    }
  }
  return buf;
}

function ensureAudio(): AudioContext | null {
  if (typeof window === "undefined") return null;
  if (!ctx) {
    try {
      // @ts-expect-error — webkit fallback for Safari
      const Ctx: typeof AudioContext = window.AudioContext || window.webkitAudioContext;
      ctx = new Ctx();
      dryBus = ctx.createGain();
      dryBus.gain.value = 1.0;
      dryBus.connect(ctx.destination);
      reverb = ctx.createConvolver();
      reverb.buffer = makeReverbBuffer(ctx);
      reverbWet = ctx.createGain();
      reverbWet.gain.value = 0.18;
      reverb.connect(reverbWet);
      reverbWet.connect(ctx.destination);
    } catch {
      return null;
    }
  }
  if (ctx && ctx.state === "suspended") ctx.resume();
  return ctx;
}

function routeToBuses(node: AudioNode) {
  if (dryBus) node.connect(dryBus);
  if (reverb) node.connect(reverb);
}

function noiseBurst(
  c: AudioContext,
  options: {
    start: number;
    duration: number;
    envExp: number;
    filters: Array<{ type: BiquadFilterType; freq: number; q?: number }>;
    gain: number;
  },
) {
  const { start, duration, envExp, filters, gain } = options;
  const len = Math.max(1, Math.floor(c.sampleRate * duration));
  const buf = c.createBuffer(1, len, c.sampleRate);
  const data = buf.getChannelData(0);
  for (let j = 0; j < len; j++) {
    const env = Math.pow(1 - j / len, envExp);
    data[j] = (Math.random() * 2 - 1) * env;
  }
  const src = c.createBufferSource();
  src.buffer = buf;
  let chain: AudioNode = src;
  for (const f of filters) {
    const node = c.createBiquadFilter();
    node.type = f.type;
    node.frequency.value = f.freq;
    if (f.q != null) node.Q.value = f.q;
    chain.connect(node);
    chain = node;
  }
  const g = c.createGain();
  g.gain.value = gain;
  chain.connect(g);
  routeToBuses(g);
  src.start(start);
  src.stop(start + duration);
}

function pickVariant(pitch: number): CrackVariant {
  const v = Math.floor(Math.abs(pitch) * 3.17) % CRACK_VARIANT_COUNT;
  return v as CrackVariant;
}

/**
 * Play a leaf crack. Pass `variant` (0–3) for distinct timbres; `pitch` adds
 * subtle per-leaf tuning within that recipe.
 */
export function playCrack(
  pitch = 1.0,
  variant: CrackVariant = pickVariant(pitch),
): void {
  const c = ensureAudio();
  if (!c) return;
  const now = c.currentTime;
  const v = ((variant % CRACK_VARIANT_COUNT) + CRACK_VARIANT_COUNT) % CRACK_VARIANT_COUNT;

  switch (v) {
    case 0:
      // Classic snap — balanced thump + mid + crackle
      noiseBurst(c, {
        start: now,
        duration: 0.09 + Math.random() * 0.02,
        envExp: 3.0 + Math.random() * 0.6,
        filters: [{ type: "lowpass", freq: 280 * pitch + Math.random() * 80, q: 1.4 }],
        gain: 0.36,
      });
      noiseBurst(c, {
        start: now + 0.003,
        duration: 0.05 + Math.random() * 0.02,
        envExp: 1.5 + Math.random() * 0.5,
        filters: [
          { type: "bandpass", freq: (850 + Math.random() * 200) * pitch, q: 3.5 },
        ],
        gain: 0.3,
      });
      for (let i = 0; i < 5 + Math.floor(Math.random() * 4); i++) {
        const fade = 1 - (i / 9) * 0.5;
        noiseBurst(c, {
          start: now + 0.012 + i * (0.013 + Math.random() * 0.022),
          duration: 0.035 + Math.random() * 0.045,
          envExp: 2.2 + Math.random() * 0.8,
          filters: [
            { type: "highpass", freq: (1500 + Math.random() * 1800) * pitch },
            { type: "bandpass", freq: (2800 + Math.random() * 2200) * pitch, q: 0.9 },
          ],
          gain: (0.18 + Math.random() * 0.08) * fade,
        });
      }
      break;

    case 1:
      // Brittle / papery — thin mid, lots of high crackle
      noiseBurst(c, {
        start: now,
        duration: 0.06 + Math.random() * 0.015,
        envExp: 2.4 + Math.random() * 0.4,
        filters: [{ type: "lowpass", freq: 220 * pitch + Math.random() * 50, q: 1.1 }],
        gain: 0.26,
      });
      noiseBurst(c, {
        start: now + 0.002,
        duration: 0.04 + Math.random() * 0.015,
        envExp: 1.2 + Math.random() * 0.3,
        filters: [
          { type: "bandpass", freq: (1200 + Math.random() * 350) * pitch, q: 4.2 },
        ],
        gain: 0.34,
      });
      for (let i = 0; i < 7 + Math.floor(Math.random() * 5); i++) {
        const fade = 1 - (i / 12) * 0.45;
        noiseBurst(c, {
          start: now + 0.008 + i * (0.009 + Math.random() * 0.016),
          duration: 0.028 + Math.random() * 0.035,
          envExp: 1.8 + Math.random() * 0.6,
          filters: [
            { type: "highpass", freq: (2200 + Math.random() * 2400) * pitch },
            { type: "bandpass", freq: (3400 + Math.random() * 2800) * pitch, q: 1.2 },
          ],
          gain: (0.2 + Math.random() * 0.1) * fade,
        });
      }
      break;

    case 2:
      // Soft / muffled — heavy body, gentle tail, sparse crackle
      noiseBurst(c, {
        start: now,
        duration: 0.12 + Math.random() * 0.03,
        envExp: 2.2 + Math.random() * 0.5,
        filters: [{ type: "lowpass", freq: 180 * pitch + Math.random() * 60, q: 0.9 }],
        gain: 0.42,
      });
      noiseBurst(c, {
        start: now + 0.006,
        duration: 0.07 + Math.random() * 0.025,
        envExp: 2.8 + Math.random() * 0.6,
        filters: [
          { type: "bandpass", freq: (520 + Math.random() * 180) * pitch, q: 2.2 },
        ],
        gain: 0.22,
      });
      for (let i = 0; i < 3 + Math.floor(Math.random() * 3); i++) {
        const fade = 1 - (i / 6) * 0.55;
        noiseBurst(c, {
          start: now + 0.02 + i * (0.02 + Math.random() * 0.028),
          duration: 0.05 + Math.random() * 0.05,
          envExp: 3.0 + Math.random() * 0.7,
          filters: [
            { type: "highpass", freq: (900 + Math.random() * 900) * pitch },
            { type: "bandpass", freq: (1600 + Math.random() * 1200) * pitch, q: 0.7 },
          ],
          gain: (0.12 + Math.random() * 0.06) * fade,
        });
      }
      break;

    case 3:
      // Sharp / snappy — quick punch, tight crack, few bright ticks
      noiseBurst(c, {
        start: now,
        duration: 0.055 + Math.random() * 0.012,
        envExp: 4.2 + Math.random() * 0.8,
        filters: [{ type: "lowpass", freq: 340 * pitch + Math.random() * 100, q: 2.0 }],
        gain: 0.32,
      });
      noiseBurst(c, {
        start: now + 0.001,
        duration: 0.032 + Math.random() * 0.012,
        envExp: 1.0 + Math.random() * 0.35,
        filters: [
          { type: "bandpass", freq: (1100 + Math.random() * 280) * pitch, q: 5.5 },
        ],
        gain: 0.38,
      });
      for (let i = 0; i < 4 + Math.floor(Math.random() * 3); i++) {
        const fade = 1 - (i / 7) * 0.6;
        noiseBurst(c, {
          start: now + 0.006 + i * (0.011 + Math.random() * 0.014),
          duration: 0.022 + Math.random() * 0.028,
          envExp: 1.6 + Math.random() * 0.5,
          filters: [
            { type: "highpass", freq: (2000 + Math.random() * 1500) * pitch },
            { type: "bandpass", freq: (3200 + Math.random() * 1800) * pitch, q: 1.4 },
          ],
          gain: (0.16 + Math.random() * 0.07) * fade,
        });
      }
      break;
  }
}

export function warmAudio(): void {
  ensureAudio();
}
