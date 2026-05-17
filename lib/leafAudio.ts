// A dry-leaf crack, synthesized on demand.
//
// Three layers:
//   1. body thump  — a low filtered-noise hit (the "snap" you feel)
//   2. mid crack   — a punchy band-passed click (the snap's definition)
//   3. high crackle — staggered micro-bursts (smaller fragments separating)
//
// All three pass through a short convolver reverb so the sound has a tiny
// amount of room around it instead of feeling like a dry test tone.
// Reverb is created with a synthesized exponentially-decaying noise IR.

let ctx: AudioContext | null = null;
let reverb: ConvolverNode | null = null;
let reverbWet: GainNode | null = null;
let dryBus: GainNode | null = null;

function makeReverbBuffer(c: AudioContext, duration = 0.42): AudioBuffer {
  const len = Math.floor(c.sampleRate * duration);
  const buf = c.createBuffer(2, len, c.sampleRate);
  for (let ch = 0; ch < 2; ch++) {
    const data = buf.getChannelData(ch);
    for (let i = 0; i < len; i++) {
      // exponential decay × white noise — a quick, soft tail
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
      // dry bus → destination
      dryBus = ctx.createGain();
      dryBus.gain.value = 1.0;
      dryBus.connect(ctx.destination);
      // wet bus → convolver → destination
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

/**
 * Route a node to both the dry destination and the reverb wet bus.
 */
function routeToBuses(node: AudioNode) {
  if (dryBus) node.connect(dryBus);
  if (reverb) node.connect(reverb);
}

/**
 * Generate filtered noise burst at a specific time, with given filters.
 */
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

export function playCrack(pitch = 1.0): void {
  const c = ensureAudio();
  if (!c) return;
  const now = c.currentTime;

  // 1. low body thump — the felt snap
  noiseBurst(c, {
    start: now,
    duration: 0.09 + Math.random() * 0.02,
    envExp: 3.0 + Math.random() * 0.6,
    filters: [{ type: "lowpass", freq: 280 * pitch + Math.random() * 80, q: 1.4 }],
    gain: 0.36,
  });

  // 2. mid crack — definition
  noiseBurst(c, {
    start: now + 0.003,
    duration: 0.05 + Math.random() * 0.02,
    envExp: 1.5 + Math.random() * 0.5,
    filters: [
      { type: "bandpass", freq: (850 + Math.random() * 200) * pitch, q: 3.5 },
    ],
    gain: 0.3,
  });

  // 3. high crackle — staggered micro-bursts
  const bursts = 5 + Math.floor(Math.random() * 4);
  for (let i = 0; i < bursts; i++) {
    const start = now + 0.012 + i * (0.013 + Math.random() * 0.022);
    const fade = 1 - (i / bursts) * 0.5;
    noiseBurst(c, {
      start,
      duration: 0.035 + Math.random() * 0.045,
      envExp: 2.2 + Math.random() * 0.8,
      filters: [
        { type: "highpass", freq: (1500 + Math.random() * 1800) * pitch },
        {
          type: "bandpass",
          freq: (2800 + Math.random() * 2200) * pitch,
          q: 0.9,
        },
      ],
      gain: (0.18 + Math.random() * 0.08) * fade,
    });
  }
}

/**
 * Warm up the audio context on first user interaction so the first crack
 * doesn't have any startup latency.
 */
export function warmAudio(): void {
  ensureAudio();
}
