/** A tiny buffer pool of 8 frames under a hot workload and one big scan (illustrative). */

export type Policy = "lru" | "clock" | "ring";

export const POLICIES: Record<Policy, { name: string; idea: string }> = {
  lru: { name: "Plain LRU", idea: "Evict the page used least recently." },
  clock: {
    name: "Clock sweep",
    idea: "Each page has a usage count (up to 5); a hand sweeps round, lowering counts, and evicts the first page at zero.",
  },
  ring: {
    name: "Clock + scan ring",
    idea: "Clock sweep, but a big scan reuses its own tiny ring of frames instead of the main pool.",
  },
};

export const FRAMES = 8;
const HOT = ["A", "B", "C", "D", "E", "F"];

function rnd(i: number) {
  const x = Math.sin(i * 91.7) * 10000;
  return x - Math.floor(x);
}

export function workload(): { page: string; phase: 0 | 1 | 2 }[] {
  const out: { page: string; phase: 0 | 1 | 2 }[] = [];
  for (let i = 0; i < 120; i++) out.push({ page: HOT[Math.floor(rnd(i) * HOT.length)], phase: 0 });
  for (let i = 0; i < 24; i++) out.push({ page: `s${i}`, phase: 1 });
  for (let i = 0; i < 60; i++)
    out.push({ page: HOT[Math.floor(rnd(i + 500) * HOT.length)], phase: 2 });
  return out;
}

export interface Result {
  hits: [number, number, number];
  totals: [number, number, number];
  frames: string[];
  firstAfter: number; // hit rate over the first 15 accesses after the scan
  lostHot: number; // hot pages pushed out by the end of the scan
}

export function simulate(policy: Policy): Result {
  const w = workload();
  const hits: [number, number, number] = [0, 0, 0];
  const totals: [number, number, number] = [0, 0, 0];
  let frames: string[] = [];
  const usage: Record<string, number> = {};
  let hand = 0;
  let ringSlot = 0;
  const ring: string[] = [];
  let after = 0;
  let afterSeen = 0;
  let lostHot = -1;
  w.forEach(({ page, phase }) => {
    if (phase === 2 && lostHot < 0) lostHot = HOT.filter((h) => !frames.includes(h)).length;
    totals[phase]++;
    const inPool = frames.includes(page) || ring.includes(page);
    if (phase === 2 && afterSeen < 15) {
      afterSeen++;
      if (inPool) after++;
    }
    if (inPool) {
      hits[phase]++;
      if (policy === "lru") frames = [...frames.filter((p) => p !== page), page];
      else usage[page] = Math.min(5, (usage[page] ?? 0) + 1);
      return;
    }
    if (policy === "ring" && phase === 1) {
      if (ring.length < 2) ring.push(page);
      else ring[ringSlot++ % 2] = page;
      return;
    }
    if (frames.length < FRAMES) {
      frames = [...frames, page];
      usage[page] = 1;
      return;
    }
    if (policy === "lru") {
      frames = [...frames.slice(1), page];
      return;
    }
    // clock sweep
    for (;;) {
      const victim = frames[hand];
      if ((usage[victim] ?? 0) === 0) {
        delete usage[victim];
        frames = frames.map((p, k) => (k === hand ? page : p));
        usage[page] = 1;
        hand = (hand + 1) % FRAMES;
        break;
      }
      usage[victim]--;
      hand = (hand + 1) % FRAMES;
    }
  });
  return { hits, totals, frames, firstAfter: after / 15, lostHot };
}
