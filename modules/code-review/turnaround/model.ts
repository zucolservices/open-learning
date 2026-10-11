/**
 * A deterministic week (5 days × 8 working hours) for a team of four. Each author keeps coding
 * while their pull requests wait; each round of feedback costs them a context switch. All numbers
 * are illustrative.
 */

export type Mode = "daily" | "breaks" | "immediate";
export type Size = "small" | "large";

export const MODES: { id: Mode; label: string; note: string }[] = [
  { id: "daily", label: "Once a day", note: "Reviewers clear the queue each morning." },
  {
    id: "breaks",
    label: "At natural breaks",
    note: "Reviewers check between tasks, every couple of hours.",
  },
  {
    id: "immediate",
    label: "Drop everything",
    note: "Reviewers stop whatever they're doing the moment a request arrives.",
  },
];

const WEEK = 40;
const DAY = 8;
const SPEC: Record<Size, { code: number; review: number; rounds: number }> = {
  small: { code: 3, review: 0.5, rounds: 1 },
  large: { code: 12, review: 2, rounds: 2 },
};

function wait(t: number, mode: Mode): number {
  if (mode === "immediate") return 0.25;
  const step = mode === "breaks" ? 2 : DAY;
  return Math.ceil((t + 0.001) / step) * step - t;
}

export interface Week {
  merged: number;
  opened: number;
  medianHours: number;
  maxOpen: number;
  switches: number;
  interruptions: number;
  timeline: { author: number; open: number; merge: number }[];
}

export function simulate(mode: Mode, size: Size): Week {
  const s = SPEC[size];
  const timeline: Week["timeline"] = [];
  let switches = 0;
  let interruptions = 0;
  for (let a = 0; a < 4; a++) {
    let t = a;
    while (t + s.code <= WEEK) {
      t += s.code;
      const open = t;
      let r = open;
      for (let k = 0; k < s.rounds; k++) {
        r += wait(r, mode) + s.review;
        if (mode === "immediate") interruptions++;
        if (k < s.rounds - 1) {
          r += 0.5;
          switches++;
          t += 0.5;
        }
      }
      switches++;
      t += 0.5;
      timeline.push({ author: a, open, merge: r });
    }
  }
  const done = timeline.filter((p) => p.merge <= WEEK);
  const waits = done.map((p) => p.merge - p.open).sort((x, y) => x - y);
  let maxOpen = 0;
  for (let a = 0; a < 4; a++)
    for (const p of timeline.filter((q) => q.author === a)) {
      const open = timeline.filter(
        (q) => q.author === a && q.open <= p.open && q.merge > p.open,
      ).length;
      maxOpen = Math.max(maxOpen, open);
    }
  return {
    merged: done.length,
    opened: timeline.length,
    medianHours: waits.length ? waits[Math.floor(waits.length / 2)] : 0,
    maxOpen,
    switches,
    interruptions,
    timeline,
  };
}

export const WEEK_HOURS = WEEK;
