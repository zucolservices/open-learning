import data from "./next-token.json";

/**
 * Real next-token scores from Qwen2.5-0.5B (base) for "My favourite South Indian breakfast is",
 * five greedy steps. Each step keeps the top 6 logits plus the rest of the vocabulary binned, so
 * probabilities at any temperature are exact.
 */
export const NT = data;
export type Step = (typeof data.steps)[number];

/** Probabilities of the top candidates at temperature `t`, plus the share left for everything else. */
export function probs(step: Step, t: number) {
  const all = [...step.top.map(([, l]) => [l as number, 1]), ...step.tail] as [number, number][];
  const m = Math.max(...all.map(([l]) => l)) / t;
  const z = all.reduce((a, [l, n]) => a + n * Math.exp(l / t - m), 0);
  const top = step.top.map(([w, l]) => ({
    word: w as string,
    p: Math.exp((l as number) / t - m) / z,
  }));
  return { top, rest: Math.max(0, 1 - top.reduce((a, x) => a + x.p, 0)) };
}

/** Show leading spaces as they matter to tokens, but readably. */
export const show = (w: string) => (w.startsWith(" ") ? w.slice(1) : w);
