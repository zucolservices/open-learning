/** A day of the café app's background habits, and a moment of memory pressure (illustrative numbers). */

export interface Habit {
  id: string;
  title: string;
  bad: string;
  good: string;
  /** Hours of wake lock per day, and battery % per day, for the bad and good ways. */
  badLock: number;
  goodLock: number;
  badDrain: number;
  goodDrain: number;
}

export const HABITS: Habit[] = [
  {
    id: "updates",
    title: "Order updates",
    bad: "Hold a wake lock and poll every 5 minutes",
    good: "Receive a push when something changes",
    badLock: 1.6,
    goodLock: 0,
    badDrain: 6,
    goodDrain: 0.5,
  },
  {
    id: "gps",
    title: "Rider location",
    bad: "Leave GPS running after the delivery",
    good: "Stop tracking when it's delivered",
    badLock: 0,
    goodLock: 0,
    badDrain: 9,
    goodDrain: 1,
  },
  {
    id: "sync",
    title: "Menu sync",
    bad: "Sync every 15 minutes on any network",
    good: "Scheduled work on Wi-Fi while charging",
    badLock: 0.5,
    goodLock: 0,
    badDrain: 3,
    goodDrain: 0.3,
  },
  {
    id: "upload",
    title: "Photo uploads",
    bad: "Keep a wake lock while uploading",
    good: "A system-managed transfer job",
    badLock: 0.6,
    goodLock: 0,
    badDrain: 2,
    goodDrain: 1,
  },
];

export const LOCK_LIMIT = 2;

export function day(good: Record<string, boolean>) {
  let lock = 0;
  let drain = 0;
  for (const h of HABITS) {
    lock += good[h.id] ? h.goodLock : h.badLock;
    drain += good[h.id] ? h.goodDrain : h.badDrain;
  }
  return { lock: Math.round(lock * 10) / 10, drain: Math.round(drain * 10) / 10 };
}

/** Memory on a 4 GB phone while the customer opens the camera (MB). */
export const RAM = 4000;
export const SYSTEM = 2600;
export const CAMERA = 1200;
export const BASE = 120;

export function memory(small: boolean, release: boolean) {
  const cache = release ? 20 : small ? 80 : 600;
  const app = BASE + cache;
  const room = RAM - SYSTEM - CAMERA;
  return { cache, app, room, killed: app > room };
}
