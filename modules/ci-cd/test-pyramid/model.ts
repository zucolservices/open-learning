/**
 * Test-suite model (illustrative). A checkout service has 20 bugs waiting to be written over a
 * month: 12 in logic, 5 in wiring between parts, 3 only visible in a full user journey. Each kind
 * of test is good at finding some kinds of bug, costs some time and sometimes fails for no reason.
 */

export type Layer = "unit" | "integration" | "e2e";

export const LAYERS: Record<
  Layer,
  { name: string; seconds: number; flake: number; max: number; step: number }
> = {
  unit: { name: "Unit", seconds: 0.05, flake: 0.000005, max: 2000, step: 100 },
  integration: { name: "Integration", seconds: 1.5, flake: 0.0002, max: 400, step: 20 },
  e2e: { name: "End-to-end", seconds: 30, flake: 0.004, max: 120, step: 5 },
};

export type BugKind = "logic" | "wiring" | "journey";

export const BUGS: Record<BugKind, { count: number; label: string }> = {
  logic: { count: 12, label: "logic (a wrong total, a missed edge case)" },
  wiring: { count: 5, label: "wiring (two parts disagree)" },
  journey: { count: 3, label: "journey (only shows end to end)" },
};

/**
 * How many tests of a layer it takes to catch about 63% of the bugs of a kind it can see
 * (catch chance = 1 − e^(−n / scale)). Infinity means that layer can't see that kind of bug.
 */
const SCALE: Record<Layer, Record<BugKind, number>> = {
  unit: { logic: 400, wiring: Infinity, journey: Infinity },
  integration: { logic: 300, wiring: 80, journey: Infinity },
  e2e: { logic: 150, wiring: 30, journey: 15 },
};

export type Suite = Record<Layer, number>;

export const PRESETS: { id: string; name: string; suite: Suite }[] = [
  { id: "pyramid", name: "Pyramid", suite: { unit: 1600, integration: 300, e2e: 20 } },
  { id: "cone", name: "Ice-cream cone", suite: { unit: 100, integration: 40, e2e: 120 } },
  { id: "unit", name: "Unit only", suite: { unit: 2000, integration: 0, e2e: 0 } },
  { id: "none", name: "Nothing", suite: { unit: 0, integration: 0, e2e: 0 } },
];

export interface SuiteResult {
  caught: Record<BugKind, number>;
  totalCaught: number;
  /** Minutes for one run, split across 4 parallel runners. */
  minutes: number;
  /** Chance that a run with no real bug still goes red. */
  falseRed: number;
}

export const RUNNERS = 4;

export function evaluate(s: Suite): SuiteResult {
  const caught = {} as Record<BugKind, number>;
  for (const kind of Object.keys(BUGS) as BugKind[]) {
    let miss = 1;
    for (const layer of Object.keys(LAYERS) as Layer[]) {
      const scale = SCALE[layer][kind];
      if (Number.isFinite(scale)) miss *= Math.exp(-s[layer] / scale);
    }
    caught[kind] = BUGS[kind].count * (1 - miss);
  }
  const seconds = (Object.keys(LAYERS) as Layer[]).reduce(
    (t, l) => t + s[l] * LAYERS[l].seconds,
    0,
  );
  let pass = 1;
  for (const l of Object.keys(LAYERS) as Layer[]) pass *= (1 - LAYERS[l].flake) ** s[l];
  return {
    caught,
    totalCaught: Object.values(caught).reduce((a, b) => a + b, 0),
    minutes: seconds / 60 / RUNNERS,
    falseRed: 1 - pass,
  };
}

/** Flaky-test arithmetic for step 3. */
export function falseReds(
  flakyTests: number,
  failRate: number,
  runsPerDay: number,
  retry: boolean,
) {
  // With one automatic retry, a flaky test only turns the build red if it fails twice in a row.
  const p = retry ? failRate * failRate : failRate;
  const pRed = 1 - (1 - p) ** flakyTests;
  return { pRed, perDay: pRed * runsPerDay };
}
