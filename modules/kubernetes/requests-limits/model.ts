/** Two nodes with the allocatable numbers from the kubernetes.io worked example: 14.5 CPU, 28.5 GiB. */
export const NODE = { cpu: 14500, mem: 28.5 * 1024 };

export const KINDS: Record<string, { label: string; cpu: number; mem: number; use: number }> = {
  web: { label: "web", cpu: 500, mem: 1024, use: 0.3 },
  worker: { label: "worker", cpu: 2000, mem: 4096, use: 0.4 },
  ml: { label: "ml-train", cpu: 8000, mem: 16384, use: 0.5 },
  tiny: { label: "sidecar", cpu: 100, mem: 128, use: 0.2 },
};

export interface Placed {
  kind: string;
  node: number | null; // null = Pending
}

/** First-fit by requests, the way the scheduler's filter works (scoring ignored). */
export function place(kinds: string[]): Placed[] {
  const used = [
    { cpu: 0, mem: 0 },
    { cpu: 0, mem: 0 },
  ];
  return kinds.map((k) => {
    const r = KINDS[k];
    const n = used.findIndex((u) => u.cpu + r.cpu <= NODE.cpu && u.mem + r.mem <= NODE.mem);
    if (n >= 0) {
      used[n].cpu += r.cpu;
      used[n].mem += r.mem;
    }
    return { kind: k, node: n >= 0 ? n : null };
  });
}

export function totals(placed: Placed[], node: number) {
  return placed
    .filter((p) => p.node === node)
    .reduce(
      (a, p) => ({
        cpu: a.cpu + KINDS[p.kind].cpu,
        mem: a.mem + KINDS[p.kind].mem,
        useCpu: a.useCpu + KINDS[p.kind].cpu * KINDS[p.kind].use,
      }),
      { cpu: 0, mem: 0, useCpu: 0 },
    );
}
