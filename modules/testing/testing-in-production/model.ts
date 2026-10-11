/**
 * A staged rollout behind a feature flag for a made-up café app with 200,000 daily users. Release
 * "A" is healthy; release "B" has a bug that adds errors for a slice of users. Rates are
 * illustrative; small groups get seeded noise so early stages look realistically uncertain.
 */

export const STAGES = [0, 1, 5, 25, 50, 100];
export const USERS = 200_000;
export const BASE = 0.5;

export type Release = "A" | "B";

const NOISE = [0.12, -0.08, 0.05, -0.03, 0.02, 0.01];

export function canaryRate(release: Release, stage: number): number {
  const extra = release === "B" ? 2.4 : 0;
  const i = STAGES.indexOf(stage);
  return Math.max(0, BASE + extra + (NOISE[i] ?? 0) * (stage <= 5 ? 3 : 1));
}

export function affected(release: Release, stage: number): number {
  return release === "B" ? Math.round(((USERS * stage) / 100) * 0.024) : 0;
}
