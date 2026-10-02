/** Latency samples and the statistics people report about them (illustrative). */

function rng(seed: number) {
  let s = seed >>> 0;
  return () => {
    s = (s * 1664525 + 1013904223) >>> 0;
    return s / 2 ** 32;
  };
}

/** 1,000 request latencies in ms: typically ~50 ms; with `tail`, 5% are about 20× slower. */
export function samples(tail: boolean): number[] {
  const r = rng(11);
  return Array.from({ length: 1000 }, (_, i) => {
    const base = 35 + r() * 30 + (r() < 0.1 ? r() * 60 : 0);
    const slow = tail && i % 20 === 7;
    return Math.round(slow ? base * 20 : base);
  });
}

export function percentile(xs: number[], p: number): number {
  const s = [...xs].sort((a, b) => a - b);
  const idx = Math.min(s.length - 1, Math.ceil((p / 100) * s.length) - 1);
  return s[Math.max(0, idx)];
}

export function mean(xs: number[]): number {
  return xs.reduce((a, b) => a + b, 0) / xs.length;
}

/** Chance a user request touching n servers hits at least one slow (1-in-100) response. */
export function fanOut(n: number, pSlow = 0.01): number {
  return 1 - (1 - pSlow) ** n;
}

/**
 * Two servers with different speeds and traffic. Averaging their p99s ignores how much traffic
 * each serves; merging their measurements gives the true p99.
 */
export function twoServers(shareA: number) {
  const r = rng(5);
  const n = 2000;
  const a: number[] = [];
  const b: number[] = [];
  for (let i = 0; i < n; i++) {
    if (r() < shareA) a.push(40 + r() * 60);
    else b.push(r() < 0.9 ? 300 + r() * 300 : 600 + r() * 600);
  }
  const p99a = a.length ? percentile(a, 99) : 0;
  const p99b = b.length ? percentile(b, 99) : 0;
  return {
    p99a,
    p99b,
    averaged: (p99a + p99b) / 2,
    trueP99: percentile([...a, ...b], 99),
  };
}
