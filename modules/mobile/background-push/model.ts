/**
 * The order goes in at 12:00, the customer pockets the phone, and the order is ready at 12:22.
 * When does the customer find out? Times are illustrative; real schedules are up to the system.
 */

export type Approach = "poll" | "periodic" | "push" | "live";

export const APPROACHES: [Approach, string][] = [
  ["poll", "Polling"],
  ["periodic", "Scheduled"],
  ["push", "Push"],
  ["live", "Live"],
];

export const READY = 22;
export const REOPEN = 35;

export interface Outcome {
  learned: number;
  wakes: number[];
  story: string;
}

export function simulate(a: Approach, idle: boolean, allowed: boolean): Outcome {
  if (a === "poll")
    return {
      learned: REOPEN,
      wakes: [],
      story:
        "The timer stops when the app leaves the screen: iOS suspends it, Android may kill it. The customer finds out only on reopening the app.",
    };
  if (a === "periodic") {
    const wakes = idle ? [9, 33] : [15, 30];
    const learned = wakes.find((w) => w >= READY)!;
    return {
      learned: allowed ? learned : REOPEN,
      wakes,
      story: idle
        ? "The phone is idle, so Android's Doze and iOS hold the work until a maintenance window. Fifteen minutes is already Android's shortest repeat; here the check comes long after the food."
        : "The work runs about every 15 minutes, Android's minimum, whenever the system chooses. The check after the food is ready is the one that finds it.",
    };
  }
  if (a === "push")
    return {
      learned: allowed ? READY : REOPEN,
      wakes: [READY],
      story: allowed
        ? "The café's server sends a push through Apple's or Google's push service the moment the order is ready. A high-priority message gets through even when the phone is idle."
        : "The push arrives, but without permission to show notifications nothing appears. Since Android 13, as on iOS, apps must ask.",
    };
  return {
    learned: allowed ? READY : REOPEN,
    wakes: [5, 14, READY],
    story: allowed
      ? "A Live Activity (iOS) or Live Update (Android 16) shows the order's progress on the lock screen, updated by push: Preparing, Cooking, Ready."
      : "Without permission, the progress card can't be shown.",
  };
}
