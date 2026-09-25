/**
 * Toy serving simulator: requests arrive at random, a GPU runs decode steps
 * over a batch of active requests. Each step reads the weights once (a fixed
 * cost) plus a little per active request, so bigger batches share the fixed cost.
 */

export const STEP_BASE_MS = 7; // reading ~16 GB of weights on an H100-class GPU
export const STEP_PER_REQ_MS = 0.3; // each active request's KV cache and arithmetic

export interface Req {
  id: number;
  arrive: number; // ms
  tokens: number; // output tokens
  start?: number;
  first?: number;
  end?: number;
  slot?: number;
}

function rng(seed: number) {
  let s = seed;
  return () => (s = (s * 1664525 + 1013904223) % 4294967296) / 4294967296;
}

export function makeRequests(perSecond: number, count = 160, seed = 7): Req[] {
  const r = rng(seed);
  let t = 0;
  return Array.from({ length: count }, (_, id) => {
    t += (-Math.log(1 - r()) / perSecond) * 1000;
    // mostly short answers, some long ones
    const tokens = Math.round(r() < 0.8 ? 30 + r() * 170 : 300 + r() * 500);
    return { id, arrive: t, tokens };
  });
}

export interface SimResult {
  reqs: Req[];
  throughput: number; // tokens per second
  meanLatency: number; // s, arrival to last token
  p95Latency: number;
  meanWait: number; // s, arrival to first token
  utilisation: number; // share of slot-steps doing useful work
  endMs: number;
}

export function simulate(input: Req[], slots: number, mode: "static" | "continuous"): SimResult {
  const reqs = input.map((r) => ({ ...r }));
  const queue: Req[] = [];
  const active: (Req & { left: number })[] = [];
  let next = 0;
  let t = 0;
  let useful = 0;
  let slotSteps = 0;
  const freeSlots = () =>
    Array.from({ length: slots }, (_, i) => i).filter((i) => !active.some((a) => a.slot === i));
  while (next < reqs.length || queue.length || active.length) {
    while (next < reqs.length && reqs[next].arrive <= t) queue.push(reqs[next++]);
    const canAdmit = mode === "continuous" || active.length === 0;
    if (canAdmit) {
      for (const slot of freeSlots()) {
        const r = queue.shift();
        if (!r) break;
        r.start = t;
        r.slot = slot;
        active.push(Object.assign(r, { left: r.tokens }));
      }
    }
    if (!active.length) {
      t = next < reqs.length ? reqs[next].arrive : t;
      continue;
    }
    const dt = STEP_BASE_MS + STEP_PER_REQ_MS * active.length;
    t += dt;
    slotSteps += slots;
    for (const a of active) {
      if (a.first === undefined) a.first = t;
      a.left -= 1;
      useful += 1;
      if (a.left === 0) a.end = t;
    }
    for (let i = active.length - 1; i >= 0; i--) if (active[i].left === 0) active.splice(i, 1);
  }
  const lat = reqs.map((r) => (r.end! - r.arrive) / 1000).sort((a, b) => a - b);
  const total = reqs.reduce((n, r) => n + r.tokens, 0);
  return {
    reqs,
    throughput: total / (t / 1000),
    meanLatency: lat.reduce((a, b) => a + b, 0) / lat.length,
    p95Latency: lat[Math.floor(lat.length * 0.95)],
    meanWait: reqs.reduce((n, r) => n + (r.first! - r.arrive), 0) / reqs.length / 1000,
    utilisation: useful / slotSteps,
    endMs: t,
  };
}
