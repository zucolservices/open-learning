/**
 * A 50-minute window in 15-second ticks. Load: 1,000 req/s, a 4× spike from minute 5 to 25.
 * Each pod serves 200 req/s at 100% of its CPU request; nodes fit 4 pods; we start with 2 nodes, 6 pods.
 * HPA (15 s sync, 10% tolerance, 300 s scale-down stabilisation); pods are ready 30 s after scheduling;
 * a new node takes 4 minutes (Cluster Autoscaler FAQ: 3–4 min on GCE); empty extra nodes go after 10 min.
 */
export const TICK = 15;
export const TICKS = (50 * 60) / TICK;
const PER_POD = 200;
const SLOTS = 4;
const BASE_NODES = 2;
const POD_START = 2; // ticks
const NODE_START = 16; // ticks (4 min)
const STABILISE = 300 / TICK;
const UNNEEDED = 600 / TICK;

export function load(t: number) {
  const min = (t * TICK) / 60;
  return min >= 5 && min < 25 ? 4000 : 1000;
}

export interface Tick {
  t: number;
  load: number;
  ready: number;
  pending: number;
  nodes: number;
  dropped: number;
  util: number;
}

export function simulate(hpa: boolean, autoscaleNodes: boolean, target: number): Tick[] {
  const out: Tick[] = [];
  let desired = 6;
  const pods: { age: number }[] = Array.from({ length: 6 }, () => ({ age: 99 }));
  let nodes = BASE_NODES;
  const provisioning: number[] = []; // ticks remaining
  const recentDesired: number[] = [];
  let underusedFor = 0;
  for (let t = 0; t < TICKS; t++) {
    const l = load(t);
    // nodes finishing
    for (let i = provisioning.length - 1; i >= 0; i--) {
      provisioning[i] -= 1;
      if (provisioning[i] <= 0) {
        provisioning.splice(i, 1);
        nodes += 1;
      }
    }
    // pods age (only scheduled ones age)
    const slots = nodes * SLOTS;
    pods.forEach((p, i) => {
      if (i < slots) p.age += 1;
    });
    const ready = pods.filter((p, i) => i < slots && p.age >= POD_START).length;
    const util = ready ? l / (ready * PER_POD) : 9;
    // HPA
    if (hpa) {
      const ratio = (util * 100) / target;
      let want = desired;
      if (Math.abs(ratio - 1) > 0.1) want = Math.max(1, Math.ceil(ready * ratio));
      recentDesired.push(want);
      if (recentDesired.length > STABILISE) recentDesired.shift();
      const next = want > desired ? want : Math.max(...recentDesired);
      desired = Math.min(40, Math.max(2, next));
    }
    while (pods.length < desired) pods.push({ age: 0 });
    while (pods.length > desired) pods.pop();
    const pending = Math.max(0, pods.length - nodes * SLOTS);
    // node autoscaler
    if (autoscaleNodes) {
      const coming = provisioning.length * SLOTS;
      if (pending > coming) {
        const add = Math.ceil((pending - coming) / SLOTS);
        for (let k = 0; k < add; k++) provisioning.push(NODE_START);
      }
      const usedNodes = Math.ceil(pods.length / SLOTS);
      if (nodes > Math.max(BASE_NODES, usedNodes)) {
        underusedFor += 1;
        if (underusedFor >= UNNEEDED) {
          nodes = Math.max(BASE_NODES, usedNodes);
          underusedFor = 0;
        }
      } else underusedFor = 0;
    }
    const capacity = ready * PER_POD;
    out.push({ t, load: l, ready, pending, nodes, dropped: Math.max(0, l - capacity), util });
  }
  return out;
}

export function summary(ts: Tick[]) {
  const errTicks = ts.filter((x) => x.dropped > 0).length;
  return {
    errorMinutes: (errTicks * TICK) / 60,
    peakNodes: Math.max(...ts.map((x) => x.nodes)),
    peakPods: Math.max(...ts.map((x) => x.ready + x.pending)),
    endNodes: ts[ts.length - 1].nodes,
  };
}
