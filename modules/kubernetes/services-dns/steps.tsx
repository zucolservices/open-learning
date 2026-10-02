"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { Phone, Plus, Trash2 } from "lucide-react";
import { useSceneState } from "@/lib/module-sdk";
import { StepLayout } from "@/toolkit/layout/step-layout";
import { SortCheckpoint } from "@/toolkit/checkpoints/sort";
import { Segmented } from "@/toolkit/controls/segmented";
import { Term } from "@/toolkit/glossary/term";
import { cn } from "@/lib/cn";
import { initialPods, newPod, resolve, selected, type SPod } from "./model";
import type { SvcState } from "./state";

/* 1 ─ One phone number ---------------------------------------------------------------------------- */

export function PhoneNumber() {
  return (
    <StepLayout
      eyebrow="Analogy"
      title="One phone number"
      stage={
        <div className="flex flex-1 flex-col items-center justify-center gap-4">
          <div className="border-accent bg-accent-soft flex items-center gap-2 rounded-full border px-5 py-2 font-mono text-sm">
            <Phone className="size-4" /> 1800-PAYMENTS
          </div>
          <div className="text-subtle text-xs">rings whichever agent is free</div>
          <div className="flex flex-wrap justify-center gap-2">
            {["Ravi", "Meera", "Arjun (on break)", "Sana"].map((a, i) => (
              <motion.span
                key={a}
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 * i }}
                className={cn(
                  "rounded-lg border px-3 py-1.5 text-xs",
                  a.includes("break")
                    ? "border-line text-muted border-dashed"
                    : "border-line bg-surface",
                )}
              >
                {a}
              </motion.span>
            ))}
          </div>
        </div>
      }
    >
      <p>
        Customers don&apos;t phone agents directly. They ring one number, and it reaches whoever is
        working and free. Agents join, leave and take breaks; the number never changes.
      </p>
      <p>
        Pods are like the agents: they come and go, and each new pod gets a new IP address. A{" "}
        <Term id="service">Service</Term> is the phone number: &ldquo;a method for exposing a
        network application that is running as one or more Pods in your cluster&rdquo;, with one
        stable name and address.
      </p>
    </StepLayout>
  );
}

/* 2 ─ Follow the labels ⭐ ------------------------------------------------------------------------- */

export function FollowLabels() {
  const [s, set] = useSceneState<SvcState>();
  const [pods, setPods] = useState<SPod[]>(initialPods);
  const [seq, setSeq] = useState(30);
  const [tick, setTick] = useState(0);
  useEffect(() => {
    const id = setInterval(() => setTick((t) => t + 1), 900);
    return () => clearInterval(id);
  }, []);
  const matched = selected(pods, s.selectorVersion);
  const endpoints = matched.filter((p) => p.ready);
  const target = endpoints.length ? endpoints[tick % endpoints.length] : null;
  const update = (id: string, f: (p: SPod) => SPod) =>
    setPods((ps) => ps.map((p) => (p.id === id ? f(p) : p)));
  return (
    <StepLayout
      eyebrow="Simulation"
      title="Follow the labels"
      stage={
        <div className="flex flex-1 flex-col justify-center gap-3">
          <div className="border-accent bg-accent-soft rounded-xl border px-3 py-2">
            <div className="flex flex-wrap items-baseline justify-between gap-2">
              <span className="font-mono text-xs font-semibold">
                Service payments · ClusterIP 10.96.0.15:80 → targetPort 8080
              </span>
            </div>
            <div className="mt-1 flex flex-wrap items-center gap-2 text-xs">
              <span className="text-muted font-mono">selector: app=payments</span>
              <Segmented
                size="sm"
                value={s.selectorVersion}
                options={[
                  ["any", "any version"],
                  ["v1", "version=v1"],
                  ["v2", "version=v2"],
                ]}
                onChange={(v) => set({ selectorVersion: v })}
              />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
            <AnimatePresence>
              {pods.map((p) => {
                const isSel = matched.includes(p);
                const isEp = isSel && p.ready;
                return (
                  <motion.div
                    key={p.id}
                    layout
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    exit={{ scale: 0.8, opacity: 0 }}
                    className={cn(
                      "relative flex flex-col gap-1 rounded-lg border px-2 py-1.5",
                      isEp
                        ? "border-accent bg-surface"
                        : isSel
                          ? "border-accent/50 bg-surface border-dashed"
                          : "border-line bg-surface-2/40",
                    )}
                  >
                    {target?.id === p.id && (
                      <motion.span
                        layoutId="hit"
                        className="bg-accent absolute -top-1 -right-1 size-3 rounded-full"
                      />
                    )}
                    <span className="truncate font-mono text-[10px] font-semibold">{p.id}</span>
                    <span className="text-muted font-mono text-[9px]">{p.ip}</span>
                    <div className="flex flex-wrap gap-1">
                      <span className="bg-surface-2 rounded px-1 font-mono text-[9px]">
                        app={p.app}
                      </span>
                      <button
                        type="button"
                        onClick={() =>
                          update(p.id, (x) => ({ ...x, version: x.version === "v1" ? "v2" : "v1" }))
                        }
                        className="bg-surface-2 hover:bg-line rounded px-1 font-mono text-[9px]"
                        aria-label={`Toggle version label on ${p.id}`}
                      >
                        version={p.version}
                      </button>
                    </div>
                    <div className="flex items-center justify-between gap-1">
                      <button
                        type="button"
                        onClick={() => update(p.id, (x) => ({ ...x, ready: !x.ready }))}
                        className={cn(
                          "rounded px-1 text-[9px]",
                          p.ready ? "text-good" : "text-bad",
                        )}
                        aria-label={`Toggle readiness of ${p.id}`}
                      >
                        {p.ready ? "Ready" : "Not ready"}
                      </button>
                      <button
                        type="button"
                        aria-label={`Delete ${p.id}`}
                        onClick={() => {
                          setPods((ps) => [
                            ...ps.filter((x) => x.id !== p.id),
                            newPod(seq, p.app, p.version),
                          ]);
                          setSeq(seq + 1);
                        }}
                        className="text-muted hover:text-bad"
                      >
                        <Trash2 className="size-3" />
                      </button>
                    </div>
                  </motion.div>
                );
              })}
            </AnimatePresence>
          </div>
          <button
            type="button"
            onClick={() => {
              setPods((ps) => [...ps, newPod(seq, "payments", "v2")]);
              setSeq(seq + 1);
            }}
            className="border-line hover:bg-surface-2 flex items-center gap-1 self-start rounded-full border px-3 py-1 text-xs"
          >
            <Plus className="size-3" /> Add a payments v2 pod
          </button>
          <div className="border-line bg-surface rounded-lg border px-3 py-2 font-mono text-[10px]">
            <p className="text-muted">EndpointSlice payments-abc12</p>
            <p>
              {endpoints.length ? endpoints.map((p) => p.ip).join(", ") : "(empty: requests fail)"}
            </p>
          </div>
        </div>
      }
    >
      <p>
        The Service doesn&apos;t list pods by name. It has a{" "}
        <Term id="label-selector">selector</Term>, and any pod whose <Term id="label">labels</Term>{" "}
        match is in. Only Ready pods become <Term id="endpointslice">endpoints</Term>; the dot shows
        where the next request goes.
      </p>
      <p>
        Delete a pod (its replacement has a new IP, and the Service follows), mark one not ready,
        flip a version label, or narrow the selector to version=v2. Nothing that calls the Service
        has to change.
      </p>
    </StepLayout>
  );
}

/* 3 ─ Find it by name ---------------------------------------------------------------------------- */

const NAMES = [
  "payments",
  "payments.shop",
  "payments.shop.svc.cluster.local",
  "db-0.db.shop.svc.cluster.local",
];

export function FindByName() {
  const [s, set] = useSceneState<SvcState>();
  const r = resolve(s.lookup, s.fromNs);
  return (
    <StepLayout
      eyebrow="Explore"
      title="Find it by name"
      stage={
        <div className="flex flex-1 flex-col justify-center gap-3">
          <div className="flex flex-wrap items-center gap-2 text-xs">
            <span className="text-muted">Ask from a pod in namespace</span>
            <Segmented
              size="sm"
              value={s.fromNs}
              options={[
                ["shop", "shop"],
                ["admin", "admin"],
              ]}
              onChange={(v) => set({ fromNs: v })}
            />
          </div>
          <div className="flex flex-col gap-1.5">
            {NAMES.map((n) => (
              <button
                key={n}
                type="button"
                onClick={() => set({ lookup: n })}
                className={cn(
                  "rounded-lg border px-3 py-1.5 text-left font-mono text-xs",
                  s.lookup === n
                    ? "border-accent bg-accent-soft"
                    : "border-line hover:bg-surface-2",
                )}
              >
                $ nslookup {n}
              </button>
            ))}
          </div>
          <motion.div
            key={`${s.lookup}-${s.fromNs}`}
            initial={{ opacity: 0, y: 4 }}
            animate={{ opacity: 1, y: 0 }}
            className={cn(
              "rounded-xl border px-4 py-3 font-mono text-xs",
              r.ok ? "border-good/50 bg-good/10" : "border-bad/50 bg-bad/10",
            )}
          >
            {r.answer}
          </motion.div>
        </div>
      }
    >
      <p>
        Every Service gets a DNS name from CoreDNS, the cluster&apos;s DNS server:{" "}
        <code>service.namespace.svc.cluster.local</code> (the domain is usually cluster.local).
        Inside the same namespace the short name works; from another namespace, add the namespace.
      </p>
      <p>
        A headless Service (no cluster IP) returns the pods&apos; own addresses instead, and gives
        each StatefulSet pod its own name, like <code>db-0.db.shop</code>, which is how clients
        reach a specific database replica.
      </p>
    </StepLayout>
  );
}

/* 4 ─ Five kinds of Service ---------------------------------------------------------------------- */

const TYPES: [string, string, string][] = [
  [
    "ClusterIP",
    "The default. A virtual IP reachable only inside the cluster; kube-proxy's rules pick a ready pod at random.",
    "Other pods → 10.96.0.15 → a pod",
  ],
  [
    "NodePort",
    "Also opens the same port (30000–32767 by default) on every node, so something outside can reach it.",
    "Outside → any node:31234 → a pod",
  ],
  [
    "LoadBalancer",
    "Asks the cloud provider for an external load balancer pointing at the nodes. Kubernetes has no load balancer of its own.",
    "Internet → cloud LB → node → a pod",
  ],
  [
    "ExternalName",
    "Just a DNS alias (CNAME) to a name outside the cluster, such as a managed database. No proxying.",
    "payments-db → mydb.example.com",
  ],
  [
    "Headless",
    "clusterIP: None. No virtual IP; DNS returns the ready pods' IPs. Used by StatefulSets.",
    "db → 10.1.3.44, 10.1.3.45…",
  ],
];

export function ServiceTypes() {
  const [s, set] = useSceneState<SvcState>();
  const t = TYPES.find(([n]) => n === s.svcType) ?? TYPES[0];
  return (
    <StepLayout
      eyebrow="Explore"
      title="Five kinds of Service"
      stage={
        <div className="flex flex-1 flex-col justify-center gap-3">
          <div className="flex flex-wrap gap-1.5">
            {TYPES.map(([n]) => (
              <button
                key={n}
                type="button"
                onClick={() => set({ svcType: n })}
                className={cn(
                  "rounded-full border px-3 py-1 font-mono text-xs",
                  s.svcType === n
                    ? "border-accent bg-accent-soft"
                    : "border-line hover:bg-surface-2",
                )}
              >
                {n}
              </button>
            ))}
          </div>
          <motion.div
            key={t[0]}
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            className="border-line bg-surface flex flex-col gap-3 rounded-xl border px-4 py-4"
          >
            <p className="font-mono text-lg font-semibold">{t[0]}</p>
            <p className="text-sm">{t[1]}</p>
            <p className="border-accent/40 bg-accent-soft rounded-lg border px-3 py-2 font-mono text-xs">
              {t[2]}
            </p>
          </motion.div>
        </div>
      }
    >
      <p>
        The type decides who can reach the Service. Most Services are plain ClusterIPs used by other
        pods; only a few face the outside world.
      </p>
      <p>
        For websites and APIs, one LoadBalancer per service gets expensive. The next module puts a
        single smart entry point in front of many Services instead.
      </p>
    </StepLayout>
  );
}

/* 5 ─ Which type? -------------------------------------------------------------------------------- */

export function WhichType() {
  return (
    <StepLayout
      eyebrow="Checkpoint"
      title="Which type?"
      stage={
        <div className="flex flex-1 flex-col justify-center">
          <SortCheckpoint
            id="which-service-type"
            prompt="Which kind of Service fits each need?"
            categories={[
              { id: "clusterip", label: "ClusterIP" },
              { id: "lb", label: "LoadBalancer" },
              { id: "externalname", label: "ExternalName" },
              { id: "headless", label: "Headless" },
            ]}
            items={[
              {
                id: "internal",
                label: "An internal API that only other pods call",
                category: "clusterip",
                why: "The default: reachable inside the cluster only.",
              },
              {
                id: "public",
                label: "A public website on a cloud provider",
                category: "lb",
                why: "The cloud provisions an external load balancer (or use Ingress/Gateway, module 9).",
              },
              {
                id: "alias",
                label: "Give a managed database's hostname a short in-cluster name",
                category: "externalname",
                why: "A DNS alias, no proxying.",
              },
              {
                id: "kafka",
                label: "Kafka clients need each broker's own address",
                category: "headless",
                why: "DNS returns every pod's IP and per-pod names.",
              },
              {
                id: "cache",
                label: "A cache only the backend uses",
                category: "clusterip",
                why: "Nothing outside needs it.",
              },
              {
                id: "mobile",
                label: "The mobile app's API, exposed through the cloud's load balancer",
                category: "lb",
                why: "External traffic through a cloud load balancer.",
              },
            ]}
            explanation="ClusterIP inside, LoadBalancer outside, ExternalName for an alias, headless when clients need individual pods."
          />
        </div>
      }
    >
      <p>Six needs. Which kind of Service does each call for?</p>
    </StepLayout>
  );
}

/* 6 ─ Wrap --------------------------------------------------------------------------------------- */

const TAKEAWAYS: [string, string][] = [
  ["A stable front", "One name and IP for a changing set of pods."],
  ["Labels, not names", "The selector picks pods; only Ready ones get traffic."],
  ["DNS for free", "service.namespace.svc.cluster.local via CoreDNS."],
  ["Type sets reach", "ClusterIP inside, NodePort/LoadBalancer outside, headless for pods."],
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
      <p>Next: Ingress and Gateway API, one entry point for traffic from outside.</p>
    </StepLayout>
  );
}
