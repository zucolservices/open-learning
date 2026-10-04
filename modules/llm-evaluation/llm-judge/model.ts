/** A pairwise LLM judge with built-in biases, compared with expert verdicts. Pairs are illustrative. */

function h(i: number, k: number) {
  const x = Math.sin(i * 127.1 + k * 311.7) * 43758.5453;
  return x - Math.floor(x);
}

export const N = 40;

interface Pair {
  betterFirst: boolean;
  betterLonger: boolean;
  worseIsOwn: boolean;
  factual: boolean;
  noise: number;
  guess: boolean;
}

export const PAIRS: Pair[] = Array.from({ length: N }, (_, i) => ({
  betterFirst: h(i, 1) < 0.5,
  betterLonger: h(i, 2) < 0.35,
  worseIsOwn: h(i, 3) < 0.35,
  factual: h(i, 4) < 0.3,
  noise: (h(i, 5) - 0.5) * 1.8,
  guess: h(i, 6) < 0.5,
}));

export interface Fixes {
  swap: boolean;
  rubric: boolean;
  otherFamily: boolean;
  reference: boolean;
  reason: boolean;
}

/** Positive: the judge prefers the answer experts preferred. */
function margin(p: Pair, f: Fixes, betterShownFirst: boolean) {
  let q = 1;
  if (p.factual) q = f.reference ? 1.6 : p.guess ? 0.9 : -0.9;
  if (f.reason) q += 0.3;
  let m = q + p.noise;
  m += betterShownFirst ? 0.6 : -0.6; // position bias
  const len = f.rubric ? 0.15 : 0.8; // verbosity bias
  m += p.betterLonger ? len : -len;
  if (p.worseIsOwn && !f.otherFamily) m -= 0.8; // self-preference
  return m;
}

export type Verdict = "agree" | "disagree" | "tie";

export function judge(f: Fixes): Verdict[] {
  return PAIRS.map((p) => {
    const a = margin(p, f, p.betterFirst) > 0;
    if (!f.swap) return a ? "agree" : "disagree";
    const b = margin(p, f, !p.betterFirst) > 0;
    return a === b ? (a ? "agree" : "disagree") : "tie";
  });
}

/** Why the judge got a pair wrong, for the most likely cause. */
export function cause(i: number, f: Fixes): string {
  const p = PAIRS[i];
  if (p.factual && !f.reference) return "fact question, no reference answer";
  if (!p.betterLonger && !f.rubric) return "the wrong answer was longer";
  if (p.worseIsOwn && !f.otherFamily) return "the wrong answer was the judge's own model's";
  if (!p.betterFirst && !f.swap) return "the wrong answer was shown first";
  return "a genuinely close call";
}
