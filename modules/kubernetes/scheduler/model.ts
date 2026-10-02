export interface SNode {
  name: string;
  zone: "a" | "b";
  disk: "ssd" | "hdd";
  free: number; // CPUs free
  cap: number;
  gpuTaint: boolean;
  hasApi: boolean;
}

export const NODES: SNode[] = [
  { name: "node-1", zone: "a", disk: "ssd", free: 6, cap: 8, gpuTaint: false, hasApi: true },
  { name: "node-2", zone: "a", disk: "hdd", free: 1, cap: 8, gpuTaint: false, hasApi: false },
  { name: "node-3", zone: "b", disk: "ssd", free: 3, cap: 8, gpuTaint: false, hasApi: false },
  { name: "node-4", zone: "b", disk: "ssd", free: 8, cap: 8, gpuTaint: true, hasApi: false },
  { name: "node-5", zone: "b", disk: "hdd", free: 4, cap: 8, gpuTaint: false, hasApi: true },
];

export const REQUEST = 2;

export interface Verdict {
  node: SNode;
  fail: string | null;
  score: number;
}

/** Filter, then score (NodeResourcesFit LeastAllocated + preferred node affinity). */
export function schedule(o: {
  ssd: boolean;
  tolerate: boolean;
  anti: boolean;
  preferA: boolean;
  big?: boolean;
}): { verdicts: Verdict[]; winner: string | null } {
  const req = o.big ? 4 : REQUEST;
  const verdicts = NODES.map((n) => {
    let fail: string | null = null;
    if (n.free < req) fail = "NodeResourcesFit: not enough free CPU";
    else if (o.ssd && n.disk !== "ssd") fail = "NodeAffinity: disk is not ssd";
    else if (n.gpuTaint && !o.tolerate) fail = "TaintToleration: gpu=true:NoSchedule";
    else if (o.anti && n.hasApi) fail = "InterPodAffinity: already runs an api pod";
    const left = (n.free - req) / n.cap;
    const score = fail ? 0 : Math.round(left * 100) + (o.preferA && n.zone === "a" ? 30 : 0);
    return { node: n, fail, score };
  });
  const feasible = verdicts.filter((v) => !v.fail).sort((a, b) => b.score - a.score);
  return { verdicts, winner: feasible[0]?.node.name ?? null };
}
