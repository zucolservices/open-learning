/**
 * A café service calling a payment provider that has become very slow. 20 payment requests a second;
 * 50 worker slots. Simplified model; numbers are illustrative.
 */

export type Retry = "none" | "immediate" | "backoff";

export function run(timeout: boolean, retry: Retry, breaker: boolean, fallback: boolean) {
  let busy: number;
  let load: string;
  if (breaker && timeout) {
    busy = 2;
    load = "≈ 0.05×: an occasional trial call";
  } else if (!timeout) {
    busy = 50;
    load = "1×, but nobody gets an answer";
  } else if (retry === "immediate") {
    busy = 50;
    load = "4×: every failure triggers three more calls (a retry storm)";
  } else if (retry === "backoff") {
    busy = 44;
    load = "≈ 1.1×: retries spread out and capped";
  } else {
    busy = 40;
    load = "1×";
  }
  const down = busy >= 50;
  const customer = down
    ? "Every page hangs: menu, history, everything."
    : breaker && timeout
      ? fallback
        ? "Instantly: “Payment queued, we'll confirm by email.”"
        : "Instantly: “Payments are unavailable, try again soon.”"
      : "After a 2-second wait: “Payment failed.”";
  return { busy, down, load, customer };
}
