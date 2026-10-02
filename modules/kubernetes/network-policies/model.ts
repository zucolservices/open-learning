export type PodId = "internet" | "frontend" | "api" | "db" | "debug" | "dns";
const SHOP: PodId[] = ["frontend", "api", "db", "debug"];

interface Rule {
  peers: PodId[] | "any";
  port: number;
}

export interface Policy {
  id: string;
  name: string;
  summary: string;
  selects: PodId[];
  ingress?: Rule[]; // present ⇒ policyType Ingress
  egress?: Rule[]; // present ⇒ policyType Egress
  trap?: boolean;
}

export const POLICIES: Policy[] = [
  {
    id: "deny-in",
    name: "default-deny-ingress",
    summary: "All pods in shop: no incoming traffic unless another policy allows it",
    selects: SHOP,
    ingress: [],
  },
  {
    id: "deny-out",
    name: "default-deny-egress",
    summary: "All pods in shop: no outgoing traffic unless another policy allows it",
    selects: SHOP,
    egress: [],
  },
  {
    id: "web",
    name: "frontend-from-anywhere",
    summary: "frontend accepts port 80 from any address",
    selects: ["frontend"],
    ingress: [{ peers: "any", port: 80 }],
  },
  {
    id: "api",
    name: "api-from-frontend",
    summary: "api accepts port 8080 from pods labelled app=frontend",
    selects: ["api"],
    ingress: [{ peers: ["frontend"], port: 8080 }],
  },
  {
    id: "db",
    name: "db-from-api",
    summary: "db accepts port 5432 from pods labelled app=api",
    selects: ["db"],
    ingress: [{ peers: ["api"], port: 5432 }],
  },
  {
    id: "db-ns",
    name: "db-from-namespace",
    summary: "db accepts port 5432 from any pod in shop",
    selects: ["db"],
    ingress: [{ peers: SHOP, port: 5432 }],
    trap: true,
  },
  {
    id: "dns",
    name: "allow-dns-egress",
    summary: "All pods in shop may reach kube-dns on port 53",
    selects: SHOP,
    egress: [{ peers: ["dns"], port: 53 }],
  },
  {
    id: "app-out",
    name: "app-egress",
    summary: "frontend may reach api:8080; api may reach db:5432",
    selects: ["frontend", "api"],
    egress: [
      { peers: ["api"], port: 8080 },
      { peers: ["db"], port: 5432 },
    ],
  },
];

export interface Conn {
  from: PodId;
  to: PodId;
  port: number;
  want: boolean;
  label: string;
}

export const CONNS: Conn[] = [
  { from: "internet", to: "frontend", port: 80, want: true, label: "Users → frontend:80" },
  { from: "frontend", to: "api", port: 8080, want: true, label: "frontend → api:8080" },
  { from: "api", to: "db", port: 5432, want: true, label: "api → db:5432" },
  { from: "api", to: "dns", port: 53, want: true, label: "api → kube-dns:53 (name lookups)" },
  { from: "frontend", to: "db", port: 5432, want: false, label: "frontend → db:5432" },
  { from: "debug", to: "db", port: 5432, want: false, label: "debug (compromised) → db:5432" },
  { from: "debug", to: "api", port: 8080, want: false, label: "debug (compromised) → api:8080" },
];

function allowedBy(
  policies: Policy[],
  pod: PodId,
  peer: PodId,
  port: number,
  dir: "ingress" | "egress",
) {
  if (pod === "internet" || pod === "dns") return true; // outside the shop namespace's policies
  const selecting = policies.filter((p) => p.selects.includes(pod) && p[dir] !== undefined);
  if (selecting.length === 0) return true; // not isolated
  return selecting.some((p) =>
    p[dir]!.some((r) => r.port === port && (r.peers === "any" || r.peers.includes(peer))),
  );
}

/** A connection happens only if the source's egress and the destination's ingress both allow it. */
export function check(on: string[], c: Conn) {
  const ps = POLICIES.filter((p) => on.includes(p.id));
  const out = allowedBy(ps, c.from, c.to, c.port, "egress");
  const inn = allowedBy(ps, c.to, c.from, c.port, "ingress");
  return { out, inn, ok: out && inn };
}
