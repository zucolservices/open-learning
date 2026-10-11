/**
 * A suite-mix simulator. All per-test timings, flake rates and catch rates are illustrative,
 * chosen to show the trade-off (small tests: fast and precise; big tests: realistic but slow and
 * flaky), not measured from any real project.
 */

export interface Mix {
  unit: number;
  integration: number;
  e2e: number;
}

export const MAX: Mix = { unit: 300, integration: 100, e2e: 40 };

export const PRESETS: { id: string; label: string; mix: Mix }[] = [
  { id: "cone", label: "Ice-cream cone", mix: { unit: 20, integration: 10, e2e: 40 } },
  { id: "pyramid", label: "Pyramid", mix: { unit: 240, integration: 50, e2e: 8 } },
  { id: "trophy", label: "Trophy", mix: { unit: 80, integration: 90, e2e: 8 } },
];

/** Seconds per test (illustrative). */
const SECS = { unit: 0.005, integration: 0.3, e2e: 8 };
/** Chance a single run of one test fails for no real reason (illustrative). */
const FLAKE = { unit: 0, integration: 0.001, e2e: 0.01 };

export const BUG_KINDS = [
  { id: "logic", label: "Logic bugs inside one function", count: 10 },
  { id: "wiring", label: "Pieces that don't fit together", count: 6 },
  { id: "journey", label: "Broken user journeys", count: 4 },
] as const;

export interface Result {
  seconds: number;
  flakyRun: number;
  caught: Record<(typeof BUG_KINDS)[number]["id"], number>;
  shape: string;
}

export function simulate(m: Mix): Result {
  const u = Math.min(1, m.unit / 150);
  const i = Math.min(1, m.integration / 50);
  const e = Math.min(1, m.e2e / 20);
  const p = {
    logic: 1 - (1 - 0.95 * u) * (1 - 0.6 * i) * (1 - 0.15 * e),
    wiring: 1 - (1 - 0.05 * u) * (1 - 0.9 * i) * (1 - 0.4 * e),
    journey: 1 - (1 - 0.25 * i) * (1 - 0.9 * e),
  };
  const seconds = m.unit * SECS.unit + m.integration * SECS.integration + m.e2e * SECS.e2e;
  const flakyRun = 1 - (1 - FLAKE.integration) ** m.integration * (1 - FLAKE.e2e) ** m.e2e;
  const caught = {
    logic: Math.round(p.logic * 10),
    wiring: Math.round(p.wiring * 6),
    journey: Math.round(p.journey * 4),
  };
  return { seconds, flakyRun, caught, shape: shapeOf(m) };
}

function shapeOf(m: Mix): string {
  const t = m.unit + m.integration + m.e2e;
  if (t === 0) return "No tests";
  if (m.e2e >= m.unit && m.e2e >= m.integration) return "Ice-cream cone: top-heavy, slow and flaky";
  if (m.integration > m.unit) return "Trophy-like: mostly integration";
  if (m.unit >= m.integration && m.integration >= m.e2e)
    return "Pyramid: many small tests, few big ones";
  return "Hourglass: many unit and end-to-end, few integration";
}

export const fmtTime = (s: number) =>
  s < 60 ? `${Math.round(s)} s` : `${Math.round(s / 6) / 10} min`;
