/**
 * A single-queue model of an API (M/M/1): requests arrive at a fixed rate (an open workload) and
 * one server handles them. Mean time in system W = S / (1 − ρ); for this model the time is
 * exponentially distributed, so p50 ≈ 0.69 W and p95 ≈ 3 W. Numbers are illustrative.
 */

export const TIMEOUT = 5000;

export interface Point {
  rps: number;
  mean: number;
  p50: number;
  p95: number;
  errors: number;
}

export function at(rps: number, serviceMs: number): Point {
  const capacity = 1000 / serviceMs;
  const rho = rps / capacity;
  if (rho >= 0.98) {
    return {
      rps,
      mean: TIMEOUT,
      p50: TIMEOUT,
      p95: TIMEOUT,
      errors: Math.max(0.02, (rps - capacity) / rps),
    };
  }
  const w = serviceMs / (1 - rho);
  return {
    rps,
    mean: w,
    p50: Math.min(TIMEOUT, 0.69 * w),
    p95: Math.min(TIMEOUT, 3 * w),
    errors: 0,
  };
}

export const OLD_MS = 10;
export const NEW_MS = 12.5;
export const PEAK = 70;
