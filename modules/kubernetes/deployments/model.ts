/**
 * A Deployment rolling 10 replicas from one version to another, one tick = 10 simulated seconds.
 * Follows the RollingUpdate rules: total pods ≤ replicas + maxSurge, available ≥ replicas − maxUnavailable.
 */
export const REPLICAS = 10;
export const TICK_S = 10;
export const START_TICKS = 3; // a new pod takes ~30 s to become Ready
export const DEADLINE_S = 600; // progressDeadlineSeconds default

export type Version = "v1" | "v2";

export interface RPod {
  id: number;
  v: Version;
  age: number; // ticks since created
  ready: boolean;
}

export interface Roll {
  clock: number;
  target: Version;
  pods: RPod[];
  seq: number;
  history: number[]; // available pods per tick
  lastProgress: number;
  stalled: boolean;
  done: boolean;
}

export function initial(): Roll {
  const pods = Array.from({ length: REPLICAS }, (_, i) => ({
    id: i,
    v: "v1" as Version,
    age: 99,
    ready: true,
  }));
  return {
    clock: 0,
    target: "v1",
    pods,
    seq: REPLICAS,
    history: [REPLICAS],
    lastProgress: 0,
    stalled: false,
    done: true,
  };
}

export function retarget(r: Roll, target: Version): Roll {
  return { ...r, target, done: false, stalled: false, lastProgress: r.clock };
}

export function step(
  prev: Roll,
  o: {
    strategy: "RollingUpdate" | "Recreate";
    surge: number;
    unavailable: number;
    broken: boolean;
  },
): Roll {
  if (prev.done) return prev;
  const r: Roll = { ...prev, pods: prev.pods.map((p) => ({ ...p })), history: [...prev.history] };
  r.clock += TICK_S;
  let progressed = false;
  // 1. pods age; healthy versions become Ready after START_TICKS
  for (const p of r.pods) {
    p.age += 1;
    const healthy = !(p.v === "v2" && o.broken);
    if (!p.ready && healthy && p.age >= START_TICKS) {
      p.ready = true;
      progressed = true;
    }
  }
  const isNew = (p: RPod) => p.v === r.target;
  if (o.strategy === "Recreate") {
    const old = r.pods.filter((p) => !isNew(p));
    if (old.length) {
      r.pods = r.pods.filter(isNew);
      progressed = true;
    } else {
      const need = REPLICAS - r.pods.length;
      for (let k = 0; k < need; k++)
        r.pods.push({ id: r.seq++, v: r.target, age: 0, ready: false });
      if (need) progressed = true;
    }
  } else {
    // 2. scale down unhealthy old pods (they don't count as available)
    const before = r.pods.length;
    r.pods = r.pods.filter((p) => isNew(p) || p.ready);
    if (r.pods.length < before) progressed = true;
    // 3. scale up the new ReplicaSet within maxSurge
    const nNew = r.pods.filter(isNew).length;
    const room = REPLICAS + o.surge - r.pods.length;
    const add = Math.max(0, Math.min(room, REPLICAS - nNew));
    for (let k = 0; k < add; k++) r.pods.push({ id: r.seq++, v: r.target, age: 0, ready: false });
    if (add) progressed = true;
    // 4. scale down old ready pods while staying above replicas − maxUnavailable
    const minAvail = REPLICAS - o.unavailable;
    let avail = r.pods.filter((p) => p.ready).length;
    const oldReady = r.pods.filter((p) => !isNew(p) && p.ready).length;
    const removable = Math.max(0, Math.min(oldReady, avail - minAvail));
    for (let k = 0; k < removable; k++) {
      const idx = r.pods.findIndex((p) => !isNew(p) && p.ready);
      if (idx < 0) break;
      r.pods.splice(idx, 1);
      avail -= 1;
      progressed = true;
    }
  }
  const allNew = r.pods.length === REPLICAS && r.pods.every((p) => isNew(p) && p.ready);
  r.done = allNew;
  if (progressed) r.lastProgress = r.clock;
  if (!r.done && r.clock - r.lastProgress >= DEADLINE_S) r.stalled = true;
  r.history.push(r.pods.filter((p) => p.ready).length);
  return r;
}
