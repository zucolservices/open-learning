"use client";

import { motion } from "motion/react";
import { Building2 } from "lucide-react";
import { useSceneState } from "@/lib/module-sdk";
import { StepLayout } from "@/toolkit/layout/step-layout";
import { SortCheckpoint } from "@/toolkit/checkpoints/sort";
import { Segmented } from "@/toolkit/controls/segmented";
import { Term } from "@/toolkit/glossary/term";
import { cn } from "@/lib/cn";
import { REQUESTS, match } from "./routes";
import type { GwState } from "./state";

/* 1 ─ One reception desk ------------------------------------------------------------------------- */

export function Reception() {
  return (
    <StepLayout
      eyebrow="Analogy"
      title="One reception desk"
      stage={
        <div className="grid flex-1 content-center gap-3 sm:grid-cols-2">
          {[
            [
              "A street door for every company",
              "Each office in the building has its own entrance, guard and address. Expensive, and nobody knows which door is which.",
              "A LoadBalancer per Service",
            ],
            [
              "One reception desk",
              "Visitors come in one entrance and say who they're visiting. Reception sends them to the right floor.",
              "Ingress or a Gateway",
            ],
          ].map(([t, d, k], i) => (
            <motion.div
              key={t}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.15 * i }}
              className={cn(
                "flex flex-col gap-2 rounded-xl border px-4 py-4",
                i === 1 ? "border-good/50 bg-good/10" : "border-line bg-surface",
              )}
            >
              <Building2 className={cn("size-5", i === 1 ? "text-good" : "text-muted")} />
              <p className="font-semibold">{t}</p>
              <p className="text-muted text-sm">{d}</p>
              <p className="mt-auto font-mono text-xs">{k}</p>
            </motion.div>
          ))}
        </div>
      }
    >
      <p>
        A LoadBalancer Service (module 8) gives one app its own cloud load balancer. With a dozen
        websites and APIs, that&apos;s a dozen load balancers, a dozen bills and a dozen
        certificates.
      </p>
      <p>
        Instead, put one smart router at the edge that reads each HTTP request&apos;s hostname and
        path and sends it to the right Service. Kubernetes has two ways to describe it:{" "}
        <Term id="ingress">Ingress</Term> and the newer <Term id="gateway-api">Gateway API</Term>.
      </p>
    </StepLayout>
  );
}

/* 2 ─ Route the requests ⭐ ------------------------------------------------------------------------ */

const INGRESS_YAML = `# abbreviated: "→" stands for the backend Service
kind: Ingress
spec:
  ingressClassName: example
  tls: [{ hosts: [shop.example.com], secretName: shop-tls }]
  rules:
  - host: shop.example.com
    http:
      paths:
      - path: /api   pathType: Prefix  → api
      - path: /      pathType: Prefix  → storefront
  - host: blog.example.com
    http:
      paths:
      - path: /      pathType: Prefix  → blog`;

function gatewayYaml(canary: number) {
  return `# abbreviated
kind: Gateway            # owned by the platform team
spec:
  gatewayClassName: example
  listeners: [{ port: 443, protocol: HTTPS, hostname: "*.example.com" }]
---
kind: HTTPRoute          # owned by the shop team
spec:
  parentRefs: [{ name: public }]
  hostnames: [shop.example.com]
  rules:
  - matches: [{ path: { type: PathPrefix, value: /api } }]
    backendRefs:
    - { name: api,    weight: ${100 - canary} }
    - { name: api-v2, weight: ${canary} }
  - backendRefs: [{ name: storefront }]
---
kind: HTTPRoute          # owned by the blog team
spec:
  hostnames: [blog.example.com]
  rules: [{ backendRefs: [{ name: blog }] }]`;
}

const BACKENDS = ["storefront", "api", "blog"];

export function RouteRequests() {
  const [s, set] = useSceneState<GwState>();
  const req = REQUESTS[s.request] ?? REQUESTS[0];
  const hit = match(req.host, req.path);
  const split = s.mode === "gateway" && hit?.backend === "api";
  return (
    <StepLayout
      eyebrow="Step through"
      title="Route the requests"
      stage={
        <div className="flex flex-1 flex-col justify-center gap-3">
          <Segmented
            size="sm"
            value={s.mode}
            options={[
              ["ingress", "Ingress"],
              ["gateway", "Gateway API"],
            ]}
            onChange={(v) => set({ mode: v })}
          />
          <div className="flex flex-col gap-1">
            {REQUESTS.map((r, i) => (
              <button
                key={i}
                type="button"
                onClick={() => set({ request: i })}
                className={cn(
                  "rounded-lg border px-3 py-1 text-left font-mono text-[11px]",
                  s.request === i
                    ? "border-accent bg-accent-soft"
                    : "border-line hover:bg-surface-2",
                )}
              >
                GET https://{r.host}
                {r.path}
              </button>
            ))}
          </div>
          <div className="grid items-center gap-2 sm:grid-cols-[1fr_auto_1fr]">
            <div
              className={cn(
                "rounded-lg border px-3 py-2 text-center font-mono text-xs",
                hit ? "border-accent bg-accent-soft" : "border-bad bg-bad/10",
              )}
            >
              {s.mode === "ingress" ? "ingress controller" : "gateway"}
              <p className="text-muted text-[10px]">
                {hit
                  ? `matched ${hit.host}${hit.path === "/" ? "" : " " + hit.path}`
                  : "no rule matches → 404"}
              </p>
            </div>
            <span className="text-subtle hidden text-center sm:block">→</span>
            <div className="flex flex-col gap-1">
              {[...BACKENDS, ...(s.mode === "gateway" ? ["api-v2"] : [])].map((b) => {
                const on = hit && (hit.backend === b || (split && b === "api-v2"));
                return (
                  <motion.div
                    key={b}
                    animate={{ opacity: on ? 1 : 0.4 }}
                    className={cn(
                      "flex items-center justify-between rounded-md border px-2 py-1 font-mono text-[11px]",
                      on ? "border-accent" : "border-line",
                    )}
                  >
                    <span>Service {b}</span>
                    {split && (b === "api" || b === "api-v2") && (
                      <span className="text-accent">
                        {b === "api" ? 100 - s.canary : s.canary}%
                      </span>
                    )}
                  </motion.div>
                );
              })}
            </div>
          </div>
          {s.mode === "gateway" && (
            <label className="flex flex-col gap-1 text-xs">
              <span className="text-muted">
                Canary: send <span className="text-fg font-mono">{s.canary}%</span> of /api traffic
                to api-v2
              </span>
              <input
                type="range"
                min={0}
                max={50}
                step={5}
                value={s.canary}
                onChange={(e) => set({ canary: Number(e.target.value) })}
                className="accent-accent"
              />
            </label>
          )}
          <pre className="border-line bg-surface max-h-56 overflow-auto rounded-lg border px-3 py-2 font-mono text-[10px] leading-relaxed">
            {s.mode === "ingress" ? INGRESS_YAML : gatewayYaml(s.canary)}
          </pre>
          <p className="text-sm">
            {req.path === "/apiary" && hit?.backend === "storefront"
              ? "Prefix matching works on whole path segments: /apiary is not under /api, so it goes to the storefront."
              : !hit
                ? "No host matches docs.example.com, so the router answers 404 (or a default backend)."
                : s.mode === "ingress"
                  ? "Ingress can route by host and path. Anything more, like weighted canaries or header matching, needs controller-specific annotations that don't move between products."
                  : split
                    ? "HTTPRoute splits traffic by weight in the standard API, the same on any conformant implementation."
                    : "Same routing, but each team owns its own HTTPRoute while the platform team owns the Gateway."}
          </p>
        </div>
      }
    >
      <p>
        Pick a request and see where it goes. The longest matching path wins; a request for a host
        nobody configured gets a 404. Then switch to Gateway API and try the canary slider.
      </p>
      <p>
        Either way, something must actually run the router: an{" "}
        <Term id="ingress-controller">ingress controller</Term> or a Gateway implementation.
        &ldquo;Only creating an Ingress resource has no effect.&rdquo; TLS is usually ended at this
        edge, with certificates from cert-manager and Let&apos;s Encrypt.
      </p>
    </StepLayout>
  );
}

/* 3 ─ From Ingress to Gateway -------------------------------------------------------------------- */

const ROLES: [string, string, string][] = [
  [
    "GatewayClass",
    "Infrastructure provider",
    "Which product runs gateways: Envoy Gateway, Istio, Cilium, NGINX Gateway Fabric, a cloud's controller.",
  ],
  [
    "Gateway",
    "Cluster operator",
    "One entry point: ports, hostnames, certificates, which namespaces may attach routes.",
  ],
  [
    "HTTPRoute (and GRPC, TLS, TCP, UDP routes)",
    "Application developer",
    "Where my app's traffic goes: matches on host, path and headers; weights; mirroring.",
  ],
];

const TIMELINE: [string, string][] = [
  ["Oct 2023", "Gateway API 1.0: generally available"],
  ["Nov 2025", "Ingress NGINX retirement announced: best-effort fixes until March 2026"],
  ["Mar 2026", "ingress-nginx repository archived; ingress2gateway 1.0 for migration"],
  ["Jun 2026", "Gateway API 1.6: TCP and UDP routes generally available"],
];

export function ToGateway() {
  return (
    <StepLayout
      eyebrow="Explore"
      title="From Ingress to Gateway"
      stage={
        <div className="flex flex-1 flex-col justify-center gap-3">
          <div className="flex flex-col gap-1.5">
            {ROLES.map(([r, who, d], i) => (
              <motion.div
                key={r}
                initial={{ opacity: 0, x: -6 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.08 * i }}
                className="border-line bg-surface grid gap-1 rounded-lg border px-3 py-2 sm:grid-cols-[11rem_1fr]"
              >
                <div>
                  <p className="font-mono text-xs font-semibold">{r}</p>
                  <p className="text-accent text-[10px]">{who}</p>
                </div>
                <p className="text-muted text-xs">{d}</p>
              </motion.div>
            ))}
          </div>
          <div className="flex flex-col gap-1">
            {TIMELINE.map(([y, t]) => (
              <div key={y} className="grid grid-cols-[4.5rem_1fr] items-center gap-2 text-xs">
                <span className="text-accent font-mono">{y}</span>
                <span className="border-line bg-surface rounded border px-2 py-1">{t}</span>
              </div>
            ))}
          </div>
        </div>
      }
    >
      <p>
        Kubernetes&apos; own docs now say: &ldquo;The Kubernetes project recommends using Gateway
        instead of Ingress. The Ingress API has been frozen.&rdquo; Gateway API splits the router
        into resources owned by different people, so app teams can change their routes without
        touching the shared entry point.
      </p>
      <p>
        The push became urgent when the community&apos;s Ingress NGINX controller, used by about
        half of cloud native environments, was retired: after March 2026 there are no more fixes,
        including for security holes. (NGINX Inc&apos;s separate NGINX Ingress Controller
        continues.)
      </p>
    </StepLayout>
  );
}

/* 4 ─ Who owns it? ------------------------------------------------------------------------------- */

export function WhoOwns() {
  return (
    <StepLayout
      eyebrow="Checkpoint"
      title="Who owns it?"
      stage={
        <div className="flex flex-1 flex-col justify-center">
          <SortCheckpoint
            id="who-owns-gateway"
            prompt="Which Gateway API resource holds each setting?"
            categories={[
              { id: "class", label: "GatewayClass" },
              { id: "gateway", label: "Gateway" },
              { id: "route", label: "HTTPRoute" },
            ]}
            items={[
              {
                id: "product",
                label: "Use Envoy Gateway to run our gateways",
                category: "class",
                why: "The GatewayClass names the controller that implements gateways.",
              },
              {
                id: "listen",
                label: "Listen on port 443 for *.example.com with this certificate",
                category: "gateway",
                why: "Listeners, hostnames and TLS live on the Gateway.",
              },
              {
                id: "orders",
                label: "Send /api/orders to the orders Service",
                category: "route",
                why: "Matching and backends are the app team's HTTPRoute.",
              },
              {
                id: "canary",
                label: "Send 10% of API traffic to v2",
                category: "route",
                why: "Weighted backendRefs in an HTTPRoute.",
              },
              {
                id: "allowed",
                label: "Only the shop and blog namespaces may attach routes",
                category: "gateway",
                why: "The Gateway's allowedRoutes setting.",
              },
              {
                id: "vendor",
                label: "Provided by the cloud or platform vendor when the cluster is set up",
                category: "class",
                why: "Infrastructure providers define GatewayClasses.",
              },
            ]}
            explanation="GatewayClass: which product. Gateway: the shared entry point. HTTPRoute: each team's routing rules."
          />
        </div>
      }
    >
      <p>Six settings. Which resource, owned by whom, holds each one?</p>
    </StepLayout>
  );
}

/* 5 ─ Wrap --------------------------------------------------------------------------------------- */

const TAKEAWAYS: [string, string][] = [
  ["One entry point", "Route many Services by host and path instead of a load balancer each."],
  ["A controller does the work", "Ingress and Gateway objects alone do nothing."],
  ["Gateway API is the future", "Ingress is frozen; Ingress NGINX was retired in 2026."],
  ["Roles split ownership", "GatewayClass, Gateway, HTTPRoute: provider, platform, app team."],
];

export function Wrap() {
  return (
    <StepLayout
      eyebrow="Wrap-up"
      title="What to remember"
      stage={
        <div className="grid flex-1 content-center gap-3 sm:grid-cols-2">
          {TAKEAWAYS.map(([t, d], i) => (
            <motion.div
              key={t}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.06 * i }}
              className="border-line bg-surface rounded-xl border px-4 py-3"
            >
              <p className="font-semibold">{t}</p>
              <p className="text-muted mt-1 text-sm">{d}</p>
            </motion.div>
          ))}
        </div>
      }
    >
      <p>Next: network policies, because by default every pod can reach every other pod.</p>
    </StepLayout>
  );
}
