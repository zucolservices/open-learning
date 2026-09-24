/** Queue models: backlog under a spike, and message ordering across consumers. */

export const MINUTES = 60;
export const PER_CONSUMER = 60; // messages/s one consumer handles

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

/** Orders per second, minute by minute: 150/s, with a ticket-sale spike to ~800/s from 10:10 to 10:25. */
export function arrivals(seed = 7): number[] {
  const r = rng(seed);
  return Array.from({ length: MINUTES }, (_, m) => {
    const base = m >= 10 && m < 25 ? 800 : 150;
    return Math.round(base * (0.92 + 0.16 * r()));
  });
}

export interface BacklogOptions {
  consumers: number;
  mode: "queue" | "log";
  partitions: number;
}

export interface BacklogResult {
  arrivals: number[];
  backlog: number[]; // messages waiting at the end of each minute
  active: number; // consumers actually doing work
  idle: number;
  peak: number;
  worstWaitMin: number; // Little's law: backlog / service rate
  drainedAt: number | null; // minute the backlog is back to zero after the spike
  wouldDrop: number; // without a queue: messages beyond capacity, turned away
}

export function backlogSim(o: BacklogOptions): BacklogResult {
  const arr = arrivals();
  const active = o.mode === "log" ? Math.min(o.consumers, o.partitions) : o.consumers;
  const capPerMin = active * PER_CONSUMER * 60;
  const backlog: number[] = [];
  let b = 0;
  let peak = 0;
  let worst = 0;
  let wouldDrop = 0;
  let drainedAt: number | null = null;
  arr.forEach((perSec, m) => {
    const inMin = perSec * 60;
    wouldDrop += Math.max(0, inMin - capPerMin);
    b = Math.max(0, b + inMin - capPerMin);
    backlog.push(b);
    peak = Math.max(peak, b);
    worst = Math.max(worst, b / capPerMin);
    if (m >= 10 && b === 0 && drainedAt === null && peak > 0) drainedAt = m;
  });
  return {
    arrivals: arr,
    backlog,
    active,
    idle: o.consumers - active,
    peak,
    worstWaitMin: worst,
    drainedAt: peak === 0 ? 10 : drainedAt,
    wouldDrop,
  };
}

/* Ordering ---------------------------------------------------------------------------------------- */

export type Routing = "competing" | "random" | "key";
export interface Msg {
  account: "A" | "B" | "C";
  kind: "open" | "deposit" | "withdraw";
  amount: number;
}

/** Arrival order: interleaved events for three accounts. */
export const MESSAGES: Msg[] = [
  { account: "A", kind: "open", amount: 0 },
  { account: "B", kind: "open", amount: 0 },
  { account: "A", kind: "deposit", amount: 500 },
  { account: "C", kind: "open", amount: 0 },
  { account: "B", kind: "deposit", amount: 800 },
  { account: "A", kind: "withdraw", amount: 300 },
  { account: "C", kind: "deposit", amount: 200 },
  { account: "B", kind: "withdraw", amount: 100 },
  { account: "C", kind: "withdraw", amount: 150 },
];
export const WORKERS = 3;

export interface Placed {
  i: number; // arrival index
  msg: Msg;
  worker: number;
  start: number;
  end: number;
}

export interface AccountResult {
  account: Msg["account"];
  applied: string[];
  error: string | null;
  balance: number;
}

const KEY_WORKER: Record<Msg["account"], number> = { A: 0, B: 1, C: 2 };

export function orderingSim(routing: Routing, run: number) {
  const r = rng(101 + run * 17);
  const free = Array(WORKERS).fill(0);
  const placed: Placed[] = MESSAGES.map((msg, i) => {
    const arrive = i * 0.6;
    const worker =
      routing === "key"
        ? KEY_WORKER[msg.account]
        : routing === "random"
          ? Math.floor(r() * WORKERS)
          : // competing consumers: whichever worker is free first takes the next message
            free.indexOf(Math.min(...free));
    const start = Math.max(arrive, free[worker]);
    const end = start + 0.5 + r() * 4;
    free[worker] = end;
    return { i, msg, worker, start, end };
  });
  const done = [...placed].sort((a, b) => a.end - b.end);
  const results: AccountResult[] = (["A", "B", "C"] as const).map((account) => {
    let open = false;
    let balance = 0;
    let error: string | null = null;
    const applied: string[] = [];
    for (const p of done.filter((d) => d.msg.account === account)) {
      const { kind, amount } = p.msg;
      if (error) break;
      if (kind === "open") open = true;
      else if (!open) error = `${kind} arrived before the account was opened`;
      else if (kind === "deposit") balance += amount;
      else if (amount > balance) error = `withdraw ₹${amount} rejected: balance only ₹${balance}`;
      else balance -= amount;
      applied.push(kind === "open" ? "open" : `${kind} ₹${amount}`);
    }
    return { account, applied, error, balance };
  });
  const span = Math.max(...placed.map((p) => p.end));
  return { placed, results, span };
}
