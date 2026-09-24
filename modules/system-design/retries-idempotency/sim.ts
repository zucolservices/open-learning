/**
 * Retry-storm model: new user actions arrive at a steady rate (they don't wait for each other).
 * Each sends a request and waits up to a timeout; failed attempts may be retried. The server works
 * through a FIFO queue at a fixed rate and can't tell when a client has given up, so during
 * overload it can spend its time on requests nobody is waiting for any more.
 */

export const TICK = 0.05; // seconds
export const SECONDS = 60;
export const TICKS = SECONDS / TICK;
export const ARRIVALS = 800; // new actions/s
export const CAPACITY = 1000; // requests/s
export const TIMEOUT = 1; // s
export const HANG: [number, number] = [10, 14]; // server stalls (s)
export const MAX_ATTEMPTS = 3;
const TOKEN_CAP = 100;
export const BLIP = 0.03; // share of requests that fail transiently

export type Policy = "none" | "immediate" | "backoff" | "jitter";

export interface StormOptions {
  policy: Policy;
  budget: boolean; // retries limited to about 10% of requests (token bucket)
  baseDelay?: number; // s
}

export interface StormResult {
  offered: number[]; // requests/s per half-second bucket
  goodput: number[]; // useful responses/s
  wasted: number[]; // responses nobody was waiting for, /s
  successRate: number; // of user actions after the stall began
  calmSuccess: number; // before the stall
  recoveredAt: number | null; // s
  peakLoad: number; // peak offered ÷ normal offered
}

function rng(seed: number) {
  let a = seed >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

interface Action {
  next: number; // tick of next send
  attempt: number; // 1-based
  waiting: number; // id of in-flight request, or -1
  deadline: number; // tick the client times out
  done: boolean;
}

export const BUCKET = 10; // ticks per chart bucket (0.5 s)

export function storm(o: StormOptions): StormResult {
  const r = rng(42);
  const base = o.baseDelay ?? 0.5;
  const lam = ARRIVALS * TICK;
  const poisson = () => {
    let k = 0;
    let p = Math.exp(-lam);
    let f = p;
    const u = r();
    while (u > f) {
      k += 1;
      p *= lam / k;
      f += p;
    }
    return k;
  };
  let live: Action[] = [];
  const queue: { id: number; action: Action }[] = [];
  let head = 0;
  let nextId = 0;
  const cap = CAPACITY * TICK;
  const nb = TICKS / BUCKET;
  const offered = Array(nb).fill(0);
  const goodput = Array(nb).fill(0);
  const wasted = Array(nb).fill(0);
  const sends: number[] = []; // per tick
  const retries: number[] = [];
  let actions = 0;
  let calmActions = 0;
  let calmOk = 0;
  let succeeded = 0;
  const hang0 = HANG[0] / TICK;
  const hang1 = HANG[1] / TICK;
  let credit = 0;
  let tokens = TOKEN_CAP;

  const finish = (c: Action, t: number, ok: boolean) => {
    c.done = true;
    c.waiting = -1;
    if (t >= hang0) {
      actions += 1;
      if (ok) succeeded += 1;
    } else {
      calmActions += 1;
      if (ok) calmOk += 1;
    }
  };

  const fail = (c: Action, t: number) => {
    c.waiting = -1;
    if (o.policy !== "none" && c.attempt < MAX_ATTEMPTS) {
      // Retry budget: every new request earns 0.1 token, every retry spends 1.
      const allowed = !o.budget || tokens >= 1;
      if (o.budget && allowed) tokens -= 1;
      if (allowed) {
        const v = base * 2 ** (c.attempt - 1);
        const d = o.policy === "immediate" ? 0 : o.policy === "backoff" ? v : r() * v; // full jitter
        c.attempt += 1;
        c.next = t + 1 + Math.round(d / TICK);
        return;
      }
    }
    finish(c, t, false);
  };

  for (let t = 0; t < TICKS; t++) {
    const b = Math.floor(t / BUCKET);
    let sent = 0;
    let retried = 0;
    const born = poisson();
    for (let k = 0; k < born; k++)
      live.push({ next: t, attempt: 1, waiting: -1, deadline: 0, done: false });
    for (const c of live) {
      if (c.waiting >= 0 && t >= c.deadline) fail(c, t);
      if (!c.done && c.waiting < 0 && t >= c.next) {
        c.waiting = nextId;
        c.deadline = t + TIMEOUT / TICK;
        queue.push({ id: nextId, action: c });
        nextId += 1;
        sent += 1;
        if (c.attempt > 1) retried += 1;
        else tokens = Math.min(TOKEN_CAP, tokens + 0.1);
      }
    }
    sends[t] = sent;
    retries[t] = retried;
    offered[b] += sent;
    // server works
    if (t < hang0 || t >= hang1) {
      credit += cap;
      while (credit >= 1 && head < queue.length) {
        credit -= 1;
        const q = queue[head++];
        const c = q.action;
        if (c.waiting !== q.id) wasted[b] += 1;
        else if (r() < BLIP)
          fail(c, t); // a transient error: worth retrying
        else {
          goodput[b] += 1;
          finish(c, t, true);
        }
      }
      if (head >= queue.length) credit = Math.min(credit, cap);
    }
    if (t % 20 === 0) live = live.filter((c) => !c.done);
  }
  const per = 1 / (BUCKET * TICK);
  const normal = offered.slice(4, 18).reduce((a, x) => a + x, 0) / 14;
  let recoveredAt: number | null = null;
  for (let k = HANG[1] / (BUCKET * TICK); k < nb - 4; k++) {
    const ok = [0, 1, 2, 3].every((j) => wasted[k + j] < 0.02 * (goodput[k + j] + 1));
    if (ok) {
      recoveredAt = k * BUCKET * TICK;
      break;
    }
  }
  return {
    offered: offered.map((x) => x * per),
    goodput: goodput.map((x) => x * per),
    wasted: wasted.map((x) => x * per),
    successRate: actions ? succeeded / actions : 1,
    calmSuccess: calmActions ? calmOk / calmActions : 1,
    recoveredAt,
    peakLoad: Math.max(...offered) / normal,
  };
}
