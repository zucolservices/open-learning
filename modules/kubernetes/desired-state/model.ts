/**
 * A tiny cluster: three nodes, pods, and a ReplicaSet-style controller.
 * One tick = 10 simulated seconds. Defaults follow upstream Kubernetes:
 * node-monitor-grace-period 50 s, then the 300 s not-ready/unreachable toleration.
 */
export const TICK_S = 10;
export const GRACE_S = 50;
export const TOLERATION_S = 300;

export interface Pod {
  id: string;
  node: number;
  phase: "Running" | "Unknown";
}

export interface Sim {
  clock: number;
  nodes: { up: boolean; downAt: number | null }[];
  pods: Pod[];
  seq: number;
  log: string[];
}

const SUFFIX = [
  "x7k2p",
  "m4q9z",
  "b8r1t",
  "f3w6n",
  "k9d2s",
  "p5h8v",
  "t2j7c",
  "w6l3g",
  "c1y5m",
  "h8e4r",
  "r3u9a",
  "z7o2b",
];

function newPod(sim: Sim, node: number): Pod {
  const id = `api-${SUFFIX[sim.seq % SUFFIX.length]}`;
  sim.seq += 1;
  return { id, node, phase: "Running" };
}

export function start(replicas: number, managed: boolean): Sim {
  const sim: Sim = {
    clock: 0,
    nodes: [0, 1, 2].map(() => ({ up: true, downAt: null })),
    pods: [],
    seq: 0,
    log: [],
  };
  for (let i = 0; i < replicas; i++) sim.pods.push(newPod(sim, i % 3));
  sim.log.push(
    managed
      ? `Deployment applied: replicas ${replicas}`
      : `${replicas} pods created directly, no controller`,
  );
  return sim;
}

function leastLoaded(sim: Sim) {
  let best = -1;
  sim.nodes.forEach((n, i) => {
    if (!n.up) return;
    const c = sim.pods.filter((p) => p.node === i).length;
    if (best === -1 || c < sim.pods.filter((p) => p.node === best).length) best = i;
  });
  return best;
}

const fmt = (s: number) => `${Math.floor(s / 60)}:${String(s % 60).padStart(2, "0")}`;

/** Advance 10 simulated seconds. */
export function tick(prev: Sim, replicas: number, managed: boolean): Sim {
  const sim: Sim = {
    ...prev,
    nodes: prev.nodes.map((n) => ({ ...n })),
    pods: prev.pods.map((p) => ({ ...p })),
    log: [...prev.log],
  };
  sim.clock += TICK_S;
  const t = fmt(sim.clock);
  sim.nodes.forEach((n, i) => {
    if (n.up || n.downAt === null) return;
    const gone = sim.clock - n.downAt;
    if (gone === GRACE_S) {
      sim.pods.forEach((p) => p.node === i && (p.phase = "Unknown"));
      sim.log.push(`${t} node-${i + 1} NotReady: no heartbeat for 50 s; its pods are tainted`);
    }
    if (gone === GRACE_S + TOLERATION_S) {
      const n0 = sim.pods.filter((p) => p.node === i).length;
      sim.pods = sim.pods.filter((p) => p.node !== i);
      if (n0) sim.log.push(`${t} ${n0} pods on node-${i + 1} evicted after the 300 s toleration`);
    }
  });
  if (managed) {
    const have = sim.pods.length;
    if (have < replicas) {
      const add = replicas - have;
      for (let k = 0; k < add; k++) {
        const node = leastLoaded(sim);
        if (node < 0) break;
        const p = newPod(sim, node);
        sim.pods.push(p);
      }
      sim.log.push(`${t} controller: want ${replicas}, have ${have} → created ${add}`);
    } else if (have > replicas) {
      const drop = sim.pods.slice(replicas).map((p) => p.id);
      sim.pods = sim.pods.slice(0, replicas);
      sim.log.push(`${t} controller: want ${replicas}, have ${have} → deleted ${drop.length}`);
    }
  }
  sim.log = sim.log.slice(-8);
  return sim;
}

export function deletePod(prev: Sim, id: string): Sim {
  return {
    ...prev,
    pods: prev.pods.filter((p) => p.id !== id),
    log: [...prev.log, `${fmt(prev.clock)} you deleted ${id}`].slice(-8),
  };
}

export function setNode(prev: Sim, i: number, up: boolean): Sim {
  const nodes = prev.nodes.map((n, k) => (k === i ? { up, downAt: up ? null : prev.clock } : n));
  const pods = up
    ? prev.pods.map((p) => (p.node === i ? { ...p, phase: "Running" as const } : p))
    : prev.pods;
  return {
    ...prev,
    nodes,
    pods,
    log: [
      ...prev.log,
      `${fmt(prev.clock)} node-${i + 1} ${up ? "back online" : "lost power"}`,
    ].slice(-8),
  };
}

export { fmt };
