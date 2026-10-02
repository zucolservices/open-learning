import type { Scenario } from "./state";

/**
 * The kubernetes.io PDB example: three nodes, a "web" Deployment with pod-a/b/c (one per node) and an
 * unrelated batch pod. One tick = 10 s; a replacement pod is Ready two ticks after it is scheduled.
 */
export const TICKS = 24;
const READY = 2;
const MIN_AVAILABLE = 2;

export interface DPod {
  id: string;
  app: "web" | "batch";
  node: number | null;
  age: number;
}

export interface Frame {
  pods: DPod[];
  cordoned: boolean[];
  readyWeb: number;
  blocked: number; // evictions refused this tick (429)
  log: string | null;
}

export function run(scenario: Scenario, pdb: boolean): Frame[] {
  let pods: DPod[] = [
    { id: "web-a", app: "web", node: 0, age: 9 },
    { id: "web-b", app: "web", node: 1, age: 9 },
    { id: "web-c", app: "web", node: 2, age: 9 },
    { id: "batch-x", app: "batch", node: 0, age: 9 },
  ];
  let cordoned = [false, false, false];
  let seq = 0;
  let current = 0; // one-at-a-time: which node is being drained
  let maintenance = 0;
  const frames: Frame[] = [];
  const startCordon =
    scenario === "one"
      ? [true, false, false]
      : scenario === "two"
        ? [true, true, false]
        : [true, true, true];
  for (let t = 0; t < TICKS; t++) {
    let log: string | null = null;
    if (t === 1) {
      cordoned = [...startCordon];
      log = `kubectl drain ${startCordon
        .map((c, i) => (c ? `node-${i + 1}` : ""))
        .filter(Boolean)
        .join(" and ")}`;
    }
    pods = pods.map((p) => (p.node !== null ? { ...p, age: p.age + 1 } : p));
    // schedule pending pods
    pods = pods.map((p) => {
      if (p.node !== null) return p;
      const free = [0, 1, 2]
        .filter((n) => !cordoned[n])
        .sort(
          (a, b) =>
            pods.filter((q) => q.node === a).length - pods.filter((q) => q.node === b).length,
        );
      return free.length ? { ...p, node: free[0], age: 0 } : p;
    });
    let blocked = 0;
    if (t >= 1) {
      for (const p of [...pods]) {
        if (p.node === null || !cordoned[p.node]) continue;
        const readyWeb = pods.filter(
          (q) => q.app === "web" && q.node !== null && q.age >= READY,
        ).length;
        const ok = p.app !== "web" || !pdb || readyWeb - 1 >= MIN_AVAILABLE;
        if (ok) {
          pods = pods.filter((q) => q.id !== p.id);
          seq += 1;
          pods.push({
            id: `${p.app}-${["k2", "p9", "z4", "m7", "r3", "t8"][seq % 6]}`,
            app: p.app,
            node: null,
            age: 0,
          });
          log = log ?? `evicted ${p.id}`;
        } else {
          blocked += 1;
          log = log ?? `eviction of ${p.id} refused: would break the PodDisruptionBudget (429)`;
        }
      }
    }
    // one-at-a-time maintenance flow
    if (scenario === "one" && t > 1 && current < 3) {
      const empty = !pods.some((p) => p.node === current);
      if (empty) {
        maintenance += 1;
        if (maintenance >= 2) {
          cordoned[current] = false;
          log = `node-${current + 1} patched and uncordoned`;
          current += 1;
          maintenance = 0;
          if (current < 3) cordoned[current] = true;
        }
      }
    }
    const readyWeb = pods.filter(
      (q) => q.app === "web" && q.node !== null && q.age >= READY,
    ).length;
    frames.push({
      pods: pods.map((p) => ({ ...p })),
      cordoned: [...cordoned],
      readyWeb,
      blocked,
      log,
    });
  }
  return frames;
}
