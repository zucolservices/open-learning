export interface SPod {
  id: string;
  ip: string;
  app: "payments" | "orders";
  version: "v1" | "v2";
  ready: boolean;
}

export function newPod(n: number, app: SPod["app"], version: SPod["version"], ready = true): SPod {
  return {
    id: `${app}-${((n * 7919 + 104729) % 60466176).toString(36).padStart(5, "x").slice(-5)}`,
    ip: `10.1.${Math.floor(n / 7)}.${(n * 37) % 250}`,
    app,
    version,
    ready,
  };
}

export function initialPods(): SPod[] {
  return [
    newPod(21, "payments", "v1"),
    newPod(22, "payments", "v1"),
    newPod(23, "payments", "v2"),
    newPod(24, "orders", "v1"),
  ];
}

export function selected(pods: SPod[], version: "any" | "v1" | "v2") {
  return pods.filter((p) => p.app === "payments" && (version === "any" || p.version === version));
}

/** Resolve a DNS name from a pod in namespace `ns` (cluster domain cluster.local). */
export function resolve(name: string, ns: string): { ok: boolean; answer: string } {
  const svcNs = "shop";
  const parts = name.split(".");
  if (name.startsWith("db-0.")) {
    const full = name.endsWith(".svc.cluster.local") ? name : `${name}.svc.cluster.local`;
    const ok = full === "db-0.db.shop.svc.cluster.local" || (ns === svcNs && name === "db-0.db");
    return ok
      ? { ok, answer: "A 10.1.3.44 (that one pod, via the headless Service)" }
      : { ok, answer: "NXDOMAIN" };
  }
  if (parts[0] !== "payments") return { ok: false, answer: "NXDOMAIN" };
  if (parts.length === 1)
    return ns === svcNs
      ? { ok: true, answer: "A 10.96.0.15 (the ClusterIP)" }
      : { ok: false, answer: `NXDOMAIN: searched payments.${ns}.svc.cluster.local` };
  if (parts[1] === svcNs) return { ok: true, answer: "A 10.96.0.15 (the ClusterIP)" };
  return { ok: false, answer: "NXDOMAIN" };
}
