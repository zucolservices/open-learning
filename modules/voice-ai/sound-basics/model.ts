/** A synthetic spoken "sun" (hiss, vowel, hum), sampled and quantised. Simplified acoustics for teaching. */

export const RATES = [44100, 16000, 8000] as const;
export const BITS = [16, 8, 4] as const;
export type Rate = (typeof RATES)[number];
export type Bits = (typeof BITS)[number];

const F0 = 150;
const FORMANTS = [
  [600, 120],
  [1000, 160],
  [2400, 300],
];

function formantGain(f: number) {
  return FORMANTS.reduce((a, [c, bw]) => a + Math.exp(-((f - c) ** 2) / (2 * bw * bw)), 0.05);
}

/** Energy (0–1) in a spectrogram cell: t in 0..1 across the word, f in Hz. */
export function energy(t: number, f: number) {
  if (t < 0.3)
    return f > 3500 && f < 8500
      ? 0.55 + 0.35 * Math.sin(f / 377 + t * 40) ** 2
      : f > 2500
        ? 0.12
        : 0.02;
  // Bins are wider than the 150 Hz harmonic spacing, so show the formant envelope (vowel) and a low hum (n).
  if (t < 0.78) return Math.min(1, formantGain(f) * 0.95 + (f < 3500 ? 0.06 : 0.02));
  return Math.min(1, Math.exp(-((f - 250) ** 2) / (2 * 220 * 220)) * 0.9 + 0.02);
}

/** 20 ms of the vowel, as the sampled and quantised values. */
export function samples(rate: Rate, bits: Bits) {
  const n = Math.round(rate * 0.012);
  const levels = 2 ** (bits - 1);
  return Array.from({ length: n }, (_, i) => {
    const t = i / rate;
    let v = 0;
    for (let h = 1; h * F0 < rate / 2; h++)
      v += (formantGain(h * F0) * Math.sin(2 * Math.PI * h * F0 * t)) / 3;
    v = Math.max(-1, Math.min(1, v * 0.7));
    return Math.round(v * levels) / levels;
  });
}

/** Build a short audio clip of the synthetic word at a given rate and depth. */
export function clip(rate: Rate, bits: Bits) {
  const n = Math.round(rate * 0.9);
  const levels = 2 ** (bits - 1);
  const out = new Float32Array(n);
  let seed = 7;
  const noise = () => ((seed = (seed * 16807) % 2147483647) / 2147483647) * 2 - 1;
  let hiPrev = 0;
  for (let i = 0; i < n; i++) {
    const t = i / rate;
    const pos = t / 0.9;
    let v = 0;
    if (pos < 0.3) {
      const w = noise();
      const hi = w - hiPrev; // crude high-pass for hiss
      hiPrev = w;
      v = rate > 9000 ? hi * 0.25 : hi * 0.03;
    } else {
      const amp = pos < 0.78 ? 1 : 0.5;
      for (let h = 1; h * F0 < rate / 2 && h < 40; h++) {
        const g = pos < 0.78 ? formantGain(h * F0) : Math.exp(-((h * F0 - 250) ** 2) / 80000);
        v += (g * Math.sin(2 * Math.PI * h * F0 * t)) / 4;
      }
      v *= amp * Math.min(1, (pos - 0.3) * 20, (1 - pos) * 20);
    }
    out[i] = Math.round(Math.max(-1, Math.min(1, v * 0.6)) * levels) / levels;
  }
  return out;
}
