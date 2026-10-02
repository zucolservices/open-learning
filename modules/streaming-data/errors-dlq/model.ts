import type { ErrorKind, Strategy } from "./state";

export type Status = "done" | "stuck" | "waiting" | "skipped" | "dlq" | "late";

export interface Outcome {
  statuses: Status[];
  dlq: number[];
  verdict: "good" | "caveat" | "bad";
  text: string;
}

export const COUNT = 12;
export const BAD = 3; // index of the troublesome event (#4)

/** What happens to a 12-event partition when event #4 fails, under each strategy. */
export function outcome(s: Strategy, e: ErrorKind): Outcome {
  const all = (st: Status) => Array.from({ length: COUNT }, () => st);
  const with4 = (st: Status) => all("done").map((x, i) => (i === BAD ? st : x));
  if (s === "forever") {
    if (e === "transient")
      return {
        statuses: all("done"),
        dlq: [],
        verdict: "caveat",
        text: "The database came back and the third attempt worked. But it retried instantly, hammering a struggling system, and would have looped for ever on a permanent error.",
      };
    return {
      statuses: all("done").map((_, i) => (i < BAD ? "done" : i === BAD ? "stuck" : "waiting")),
      dlq: [],
      verdict: "bad",
      text: "The consumer fails on #4, doesn't commit, reads #4 again, fails again… The partition is blocked and lag grows for ever. This is a poison pill.",
    };
  }
  if (s === "skip")
    return {
      statuses: with4("skipped"),
      dlq: [],
      verdict: "bad",
      text:
        e === "transient"
          ? "#4 only needed a retry, but it was skipped: a real payment silently lost."
          : "The stream keeps moving, but #4 is gone except for a log line nobody reads. Fine for metrics, not for payments.",
    };
  if (s === "retryDlq") {
    if (e === "transient")
      return {
        statuses: all("done"),
        dlq: [],
        verdict: "good",
        text: "Retries after ~1 s and ~2 s; the third attempt succeeds. The partition paused for a few seconds and order was kept.",
      };
    return {
      statuses: with4("dlq"),
      dlq: [BAD],
      verdict: "good",
      text: "Three attempts with growing waits, then #4 goes to a dead-letter topic with the error in its headers. Everything after it is processed, in order.",
    };
  }
  if (e === "transient")
    return {
      statuses: with4("late"),
      dlq: [],
      verdict: "caveat",
      text: "#4 moved to a retry topic and succeeded there, after #5–#12 were already processed. Nothing lost, but order was.",
    };
  return {
    statuses: with4("dlq"),
    dlq: [BAD],
    verdict: "caveat",
    text: "#4 went through retry topics with delays, then to the dead-letter topic. The main partition never paused, at the cost of ordering for that event.",
  };
}

/** Retry times (seconds) for `clients` callers over five attempts, with or without full jitter. */
export function retryTimes(clients: number, jitter: boolean): number[][] {
  let seed = 7;
  const rnd = () => {
    seed = (Math.imul(seed, 1103515245) + 12345) >>> 0;
    return (seed >>> 8) / 2 ** 24;
  };
  return Array.from({ length: clients }, () => {
    let t = 0;
    return Array.from({ length: 5 }, (_, k) => {
      const cap = Math.min(32, 2 ** k);
      t += jitter ? rnd() * cap : cap;
      return Math.round(t * 10) / 10;
    });
  });
}
