/** Tracking a delivery rider: accuracy and update interval versus usefulness and battery (illustrative). */

export type Accuracy = "high" | "balanced" | "low";
export type Interval = "1" | "10" | "60";

export const ACCURACY: Record<
  Accuracy,
  { label: string; metres: number; source: string; cost: number }
> = {
  high: { label: "Precise", metres: 10, source: "Mostly GPS", cost: 10 },
  balanced: { label: "Balanced", metres: 100, source: "Mostly Wi-Fi and mobile masts", cost: 4 },
  low: { label: "Low power", metres: 10000, source: "Mobile masts, city level", cost: 1 },
};

export const INTERVAL: Record<Interval, { label: string; factor: number }> = {
  "1": { label: "Every second", factor: 3 },
  "10": { label: "Every 10 s", factor: 1 },
  "60": { label: "Every minute", factor: 0.4 },
};

export interface Choice {
  acc: Accuracy;
  every: Interval;
  batch: boolean;
  adaptive: boolean;
}

/** Relative battery drain per hour of tracking, 1–30 (illustrative). */
export function drain(c: Choice) {
  const base = c.adaptive
    ? ACCURACY.balanced.cost * 0.8 + ACCURACY.high.cost * 0.2
    : ACCURACY[c.acc].cost;
  return Math.max(1, Math.round(base * INTERVAL[c.every].factor * (c.batch ? 0.7 : 1)));
}

export function verdict(c: Choice): { text: string; useful: boolean } {
  if (c.adaptive && c.every !== "60")
    return {
      text: "Balanced on the road, precise for the last 500 m: the customer sees the rider arrive at the right gate, at a fraction of the cost.",
      useful: true,
    };
  if (c.acc === "low" && !c.adaptive)
    return {
      text: "The dot jumps around the whole city. Useless for tracking a rider.",
      useful: false,
    };
  if (c.every === "60")
    return {
      text: "The rider moves several hundred metres between updates, so the dot lurches and the arrival time is stale.",
      useful: false,
    };
  if (c.acc === "balanced")
    return {
      text: "Fine along the road, but at the end the customer can't tell which side of the building the rider is on.",
      useful: false,
    };
  if (c.every === "1")
    return {
      text: "Silky smooth, but the rider's battery drains fast for no real benefit over every 10 s.",
      useful: false,
    };
  return {
    text: "Accurate and smooth, at a steady battery cost for the whole ride.",
    useful: true,
  };
}

/** A deterministic wobble so reported dots scatter around the true position. */
export function jitter(i: number, radius: number) {
  return { dx: Math.sin(i * 12.9898) * radius, dy: Math.cos(i * 78.233) * radius };
}
