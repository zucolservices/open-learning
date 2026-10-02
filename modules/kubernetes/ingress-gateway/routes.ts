export interface Rule {
  host: string;
  path: string;
  backend: string;
}

export const RULES: Rule[] = [
  { host: "shop.example.com", path: "/api", backend: "api" },
  { host: "shop.example.com", path: "/", backend: "storefront" },
  { host: "blog.example.com", path: "/", backend: "blog" },
];

export const REQUESTS: { host: string; path: string }[] = [
  { host: "shop.example.com", path: "/" },
  { host: "shop.example.com", path: "/api/orders" },
  { host: "blog.example.com", path: "/2026/k8s" },
  { host: "shop.example.com", path: "/apiary" },
  { host: "docs.example.com", path: "/" },
];

/** Prefix matching by whole path segments, longest path wins (as Ingress pathType Prefix and HTTPRoute PathPrefix). */
export function match(host: string, path: string): Rule | null {
  const segs = (p: string) => p.split("/").filter(Boolean);
  const hits = RULES.filter((r) => {
    if (r.host !== host) return false;
    const a = segs(r.path);
    const b = segs(path);
    return a.every((s, i) => b[i] === s);
  });
  hits.sort((x, y) => segs(y.path).length - segs(x.path).length);
  return hits[0] ?? null;
}
