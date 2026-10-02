/** An hour of 10,000 traces (illustrative): a few errors, a few slow ones, mostly normal. */

export type Kind = "ok" | "slow" | "error";

export const N = 10_000;

function hash(i: number) {
  const x = Math.sin(i * 12.9898) * 43758.5453;
  return x - Math.floor(x);
}

export const TRACES: { id: number; kind: Kind; r: number }[] = Array.from({ length: N }, (_, i) => {
  const r = hash(i + 1);
  const k = hash(i + 7777);
  const kind: Kind = k < 0.005 ? "error" : k < 0.015 ? "slow" : "ok";
  return { id: i, kind, r };
});

/** The trace behind tomorrow's customer complaint: a failed refund. */
export const COMPLAINT = TRACES.find((t) => t.kind === "error" && t.r > 0.4)!.id;

export type Mode = "head" | "tail";

export interface Policy {
  errors: boolean;
  slow: boolean;
  /** Percentage of other traces kept. */
  rest: number;
}

export function keep(mode: Mode, headPct: number, p: Policy) {
  const kept = TRACES.filter((t) => {
    if (mode === "head") return t.r < headPct / 100;
    if (p.errors && t.kind === "error") return true;
    if (p.slow && t.kind === "slow") return true;
    return t.r < p.rest / 100;
  });
  const set = new Set(kept.map((t) => t.id));
  const count = (k: Kind) => kept.filter((t) => t.kind === k).length;
  const total = (k: Kind) => TRACES.filter((t) => t.kind === k).length;
  return {
    kept: kept.length,
    errors: [count("error"), total("error")] as const,
    slow: [count("slow"), total("slow")] as const,
    complaint: set.has(COMPLAINT),
    set,
  };
}
