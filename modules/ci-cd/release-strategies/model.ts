/**
 * Release-strategy model (illustrative). Version 2 has a bug: 20% of the requests it serves fail.
 * Traffic is 10,000 requests a minute. Each strategy controls how much traffic v2 gets, minute by
 * minute, how quickly the problem is noticed and how fast traffic goes back to v1.
 */

export type Strategy = "recreate" | "rolling" | "bluegreen" | "canary" | "shadow";

export const STRATEGIES: Record<
  Strategy,
  { name: string; idea: string; extra: string; extraPct: number }
> = {
  recreate: {
    name: "Recreate",
    idea: "Stop every old copy, then start the new ones. Simple, with a gap in between.",
    extra: "none",
    extraPct: 0,
  },
  rolling: {
    name: "Rolling",
    idea: "Replace copies a few at a time (Kubernetes' default: up to 25% extra and 25% missing).",
    extra: "+25% briefly",
    extraPct: 25,
  },
  bluegreen: {
    name: "Blue-green",
    idea: "Start a full second set (green) beside the live one (blue), then switch all traffic at once.",
    extra: "double, during the switch",
    extraPct: 100,
  },
  canary: {
    name: "Canary",
    idea: "Send 5% of traffic to v2, compare it with the rest, and only then widen.",
    extra: "+5%",
    extraPct: 5,
  },
  shadow: {
    name: "Shadow",
    idea: "Copy live requests to v2 and throw its answers away; users only ever see v1.",
    extra: "a full copy of the mirrored traffic",
    extraPct: 100,
  },
};

export const MINUTES = 30;
const RPM = 10_000;
const BUG = 0.2;

export interface Timeline {
  /** Share of user traffic served by v2 each minute (0–1). */
  v2: number[];
  /** Share of users getting no answer at all (outage) each minute. */
  down: number[];
  failedPerMin: number[];
  failed: number;
  detectedAt: number | null;
  backAt: number | null;
}

export function timeline(s: Strategy): Timeline {
  const v2 = Array<number>(MINUTES).fill(0);
  const down = Array<number>(MINUTES).fill(0);
  let detectedAt: number | null = null;
  let backAt: number | null = null;
  if (s === "recreate") {
    // Deploy at minute 2: 2 minutes down, then all on v2; noticed at 8; redeploy v1 (2 min down).
    down[2] = down[3] = 1;
    for (let m = 4; m < 10; m++) v2[m] = 1;
    detectedAt = 8;
    down[10] = down[11] = 1;
    backAt = 12;
  } else if (s === "rolling") {
    const steps = [0.25, 0.25, 0.5, 0.5, 0.75, 0.75];
    steps.forEach((x, i) => (v2[2 + i] = x));
    detectedAt = 7;
    // Rolling back also goes a step at a time.
    [0.75, 0.5, 0.5, 0.25, 0.25].forEach((x, i) => (v2[8 + i] = x));
    backAt = 13;
  } else if (s === "bluegreen") {
    for (let m = 2; m < 6; m++) v2[m] = 1;
    detectedAt = 5;
    backAt = 6; // flip the router back: seconds
  } else if (s === "canary") {
    for (let m = 2; m < 8; m++) v2[m] = 0.05;
    detectedAt = 7; // automated comparison against the control group
    backAt = 8;
  } else {
    // Shadow: users never see v2; the comparison spots the errors.
    detectedAt = 6;
    backAt = 6;
  }
  const failedPerMin = v2.map((x, m) => Math.round(RPM * (down[m] + x * BUG)));
  return {
    v2,
    down,
    failedPerMin,
    failed: failedPerMin.reduce((a, b) => a + b, 0),
    detectedAt,
    backAt,
  };
}

/** Step 2: canary size vs the error rate users see overall, and how long a comparison takes. */
export function canaryMath(pct: number, bugPct: number) {
  const overall = (pct / 100) * bugPct;
  // Illustrative: a comparison needs roughly 300 failed canary requests to be confident.
  const canaryFailsPerMin = RPM * (pct / 100) * (bugPct / 100);
  const minutes = canaryFailsPerMin > 0 ? Math.max(1, 300 / canaryFailsPerMin) : Infinity;
  return { overall, minutes };
}
