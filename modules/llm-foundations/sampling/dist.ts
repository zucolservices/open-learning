/**
 * Next-token distributions from GPT-2 small (real logits for the top 1,000 tokens; the other
 * ~49,000 as a histogram of their logits in 0.25 steps) and the sampling transforms applied to them.
 */
import data from "./logits.json";

export interface Prompt {
  prompt: string;
  lse: number;
  tail: { n: number; bins: [number, number][] };
  top: { t: string; l: number }[];
}
export const MODEL_NAME = data.model;
export const PROMPTS = data.prompts as Prompt[];

export interface Settings {
  temperature: number; // 0 = always the top token
  topK: number; // 0 = off
  topP: number; // 1 = off
}

export interface Dist {
  probs: { t: string; p: number }[]; // top tokens, after the transforms
  tail: number; // probability left for all other tokens
  inPlay: number; // how many tokens can still be picked
}

export function distribution(pr: Prompt, s: Settings): Dist {
  const n = pr.top.length;
  if (s.temperature <= 0.001) {
    return { probs: pr.top.map((x, i) => ({ t: x.t, p: i === 0 ? 1 : 0 })), tail: 0, inPlay: 1 };
  }
  const T = s.temperature;
  const scaled = pr.top.map((x) => x.l / T);
  // Tail: log of Σ count·e^(logit/T) over the histogram bins (within ±0.125 of the true logits).
  const binTerms = pr.tail.bins.map(([l, c]) => l / T + Math.log(c));
  const bm = Math.max(...binTerms);
  const tailScaled = bm + Math.log(binTerms.reduce((a, x) => a + Math.exp(x - bm), 0));
  const m = Math.max(...scaled, tailScaled);
  let w = scaled.map((x) => Math.exp(x - m));
  let tailW = Math.exp(tailScaled - m);
  let inPlay = n + pr.tail.n;
  if (s.topK > 0) {
    w = w.map((x, i) => (i < s.topK ? x : 0));
    tailW = 0;
    inPlay = Math.min(s.topK, n);
  }
  let total = w.reduce((a, b) => a + b, 0) + tailW;
  if (s.topP < 1) {
    let acc = 0;
    let keep = 0;
    for (let i = 0; i < n; i++) {
      if (w[i] === 0) break;
      acc += w[i] / total;
      keep = i + 1;
      if (acc >= s.topP) break;
    }
    if (acc >= s.topP || tailW === 0) {
      w = w.map((x, i) => (i < keep ? x : 0));
      tailW = 0;
      inPlay = Math.min(inPlay, keep);
    }
    total = w.reduce((a, b) => a + b, 0) + tailW;
  }
  return {
    probs: pr.top.map((x, i) => ({ t: x.t, p: w[i] / total })),
    tail: tailW / total,
    inPlay,
  };
}

/** Draw `k` samples (seeded) from a distribution; tail draws are reported as "(other)". */
export function draw(d: Dist, k: number, seed: number): string[] {
  let a = seed >>> 0;
  const r = () => {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
  const out: string[] = [];
  for (let j = 0; j < k; j++) {
    let x = r();
    let hit = "(other)";
    for (const p of d.probs) {
      x -= p.p;
      if (x <= 0) {
        hit = p.t;
        break;
      }
    }
    out.push(hit);
  }
  return out;
}
