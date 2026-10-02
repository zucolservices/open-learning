"use client";

import { motion } from "motion/react";
import { Check, DoorClosed, X } from "lucide-react";
import { useSceneState } from "@/lib/module-sdk";
import { StepLayout } from "@/toolkit/layout/step-layout";
import { SortCheckpoint } from "@/toolkit/checkpoints/sort";
import { Term } from "@/toolkit/glossary/term";
import { cn } from "@/lib/cn";
import { CONNS, POLICIES, check } from "./model";
import type { NpState } from "./state";

/* 1 ─ An office with no locks ------------------------------------------------------------------- */

export function NoLocks() {
  return (
    <StepLayout
      eyebrow="Analogy"
      title="An office with no locks"
      stage={
        <div className="grid flex-1 content-center gap-3 sm:grid-cols-2">
          {[
            [
              "Every door open",
              "Anyone who gets past reception can walk into the server room, the finance office and the CEO's desk. One stolen badge reaches everything.",
              false,
            ],
            [
              "Keycards per room",
              "Each room lists who may enter. Lose one badge and the damage stops at the rooms that badge was allowed into.",
              true,
            ],
          ].map(([t, d, ok], i) => (
            <motion.div
              key={t as string}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.15 * i }}
              className={cn(
                "flex flex-col gap-2 rounded-xl border px-4 py-4",
                ok ? "border-good/50 bg-good/10" : "border-bad/40 bg-bad/5",
              )}
            >
              <DoorClosed className={cn("size-5", ok ? "text-good" : "text-bad")} />
              <p className="font-semibold">{t as string}</p>
              <p className="text-muted text-sm">{d as string}</p>
            </motion.div>
          ))}
        </div>
      }
    >
      <p>
        Inside a cluster, every door starts open: &ldquo;By default, a pod is non-isolated for
        ingress; all inbound connections are allowed.&rdquo; The same goes for outgoing traffic. If
        an attacker gets into one pod, they can reach your database.
      </p>
      <p>
        <Term id="network-policy">Network policies</Term> are the keycards: firewall rules for pods,
        written with labels.
      </p>
    </StepLayout>
  );
}

/* 2 ─ Lock it down ⭐ ------------------------------------------------------------------------------ */

export function LockDown() {
  const [s, set] = useSceneState<NpState>();
  const on = s.on ?? [];
  const results = CONNS.map((c) => ({ c, r: check(on, c) }));
  const right = results.filter(({ c, r }) => r.ok === c.want).length;
  const done = right === CONNS.length && !on.includes("db-ns");
  const toggle = (id: string) =>
    set({ on: on.includes(id) ? on.filter((x) => x !== id) : [...on, id] });
  const broken = results.filter(({ c, r }) => c.want && !r.ok);
  const leaks = results.filter(({ c, r }) => !c.want && r.ok);
  return (
    <StepLayout
      eyebrow="Fix the problem"
      title="Lock it down"
      stage={
        <div className="flex flex-1 flex-col justify-center gap-3">
          <div className="grid gap-1.5 sm:grid-cols-2">
            {POLICIES.map((p) => (
              <label
                key={p.id}
                className={cn(
                  "flex cursor-pointer items-start gap-2 rounded-lg border px-2.5 py-1.5",
                  on.includes(p.id)
                    ? "border-accent bg-accent-soft"
                    : "border-line hover:bg-surface-2",
                )}
              >
                <input
                  type="checkbox"
                  checked={on.includes(p.id)}
                  onChange={() => toggle(p.id)}
                  className="accent-accent mt-0.5"
                />
                <span>
                  <span className="block font-mono text-[11px] font-semibold">{p.name}</span>
                  <span className="text-muted block text-[10px]">{p.summary}</span>
                </span>
              </label>
            ))}
          </div>
          <div className="border-line bg-surface rounded-xl border">
            {results.map(({ c, r }) => (
              <div
                key={c.label}
                className="border-line flex items-center justify-between gap-2 border-b px-3 py-1.5 text-xs last:border-b-0"
              >
                <span className="font-mono text-[11px]">{c.label}</span>
                <span className="flex items-center gap-2">
                  <span className="text-muted text-[10px]">want {c.want ? "open" : "blocked"}</span>
                  <motion.span
                    key={`${c.label}-${r.ok}`}
                    initial={{ scale: 0.6 }}
                    animate={{ scale: 1 }}
                    className={cn(
                      "flex size-6 items-center justify-center rounded-full",
                      r.ok === c.want ? "bg-good/20 text-good" : "bg-bad/20 text-bad",
                    )}
                    title={
                      !r.ok
                        ? r.out
                          ? "blocked at the destination (ingress)"
                          : "blocked at the source (egress)"
                        : "allowed"
                    }
                  >
                    {r.ok ? <Check className="size-3.5" /> : <X className="size-3.5" />}
                  </motion.span>
                </span>
              </div>
            ))}
          </div>
          <p
            className={cn(
              "rounded-xl border px-4 py-3 text-sm",
              done ? "border-good/50 bg-good/10" : "border-line bg-surface",
            )}
          >
            {done
              ? "Locked down: only the traffic the app needs gets through, and the compromised debug pod can't reach anything."
              : on.includes("db-ns") && leaks.length
                ? "db-from-namespace lets every pod in shop reach the database, including the compromised one. Allow-lists should name the caller."
                : broken.some((b) => b.c.to === "dns")
                  ? "The api can't look up names any more: denying all egress also blocks DNS. Allow port 53 to kube-dns."
                  : broken.length && on.includes("deny-in")
                    ? `Default deny blocked traffic the app needs: ${broken.map((b) => b.c.label).join(", ")}. Add allow policies for them.`
                    : broken.length
                      ? `Egress is denied for: ${broken.map((b) => b.c.label).join(", ")}. Both sides must allow a connection.`
                      : leaks.length
                        ? `Still open: ${leaks.map((l) => l.c.label).join(", ")}. With no policy selecting a pod, everything is allowed.`
                        : "Nearly there."}
          </p>
        </div>
      }
    >
      <p>
        A shop app has a frontend, an api and a database, plus a debug pod that an attacker has just
        got into. Turn policies on until the four connections the app needs work and the three it
        doesn&apos;t are blocked.
      </p>
      <p>
        Policies only add permissions, &ldquo;they are additive&rdquo;, so the pattern is: deny
        everything, then allow what&apos;s needed. A connection works only if &ldquo;both the egress
        policy on the source pod and the ingress policy on the destination pod&rdquo; allow it.
      </p>
    </StepLayout>
  );
}

/* 3 ─ Writing a policy --------------------------------------------------------------------------- */

export function WritingPolicy() {
  return (
    <StepLayout
      eyebrow="Explore"
      title="Writing a policy"
      stage={
        <div className="flex flex-1 flex-col justify-center gap-3">
          <pre className="border-line bg-surface overflow-x-auto rounded-lg border px-3 py-2 font-mono text-[11px] leading-relaxed">
            {`apiVersion: networking.k8s.io/v1
kind: NetworkPolicy
metadata: { name: db-from-api, namespace: shop }
spec:
  podSelector: { matchLabels: { app: db } }     # who this protects
  policyTypes: [Ingress]
  ingress:
  - from:
    - podSelector: { matchLabels: { app: api } } # who may call
    ports:
    - { protocol: TCP, port: 5432 }`}
          </pre>
          <div className="grid gap-2 sm:grid-cols-2">
            <div className="border-line bg-surface rounded-lg border px-3 py-2 text-xs">
              <p className="mb-1 font-semibold">One element: AND</p>
              <pre className="font-mono text-[10px]">{`- namespaceSelector: {team: x}
  podSelector: {app: api}`}</pre>
              <p className="text-muted mt-1">api pods in team x&apos;s namespaces only.</p>
            </div>
            <div className="border-line bg-surface rounded-lg border px-3 py-2 text-xs">
              <p className="mb-1 font-semibold">Two elements: OR</p>
              <pre className="font-mono text-[10px]">{`- namespaceSelector: {team: x}
- podSelector: {app: api}`}</pre>
              <p className="text-muted mt-1">
                Anything in team x&apos;s namespaces, or api pods here.
              </p>
            </div>
          </div>
        </div>
      }
    >
      <p>
        A policy picks the pods it protects with a podSelector, then lists who may connect (pods,
        namespaces or IP ranges) and on which ports. One dash too many turns an AND into an OR, a
        classic mistake.
      </p>
      <p>
        The catch: &ldquo;Creating a NetworkPolicy resource without a controller that implements it
        will have no effect.&rdquo; Your network plugin must enforce them, as Calico, Cilium, GKE
        Dataplane V2 and the EKS VPC CNI do. Policies can&apos;t log, encrypt or explicitly deny;
        cluster-wide rules are coming as the alpha ClusterNetworkPolicy.
      </p>
    </StepLayout>
  );
}

/* 4 ─ Will it connect? --------------------------------------------------------------------------- */

export function WillConnect() {
  return (
    <StepLayout
      eyebrow="Checkpoint"
      title="Will it connect?"
      stage={
        <div className="flex flex-1 flex-col justify-center">
          <SortCheckpoint
            id="will-connect"
            prompt="Does the connection go through?"
            categories={[
              { id: "yes", label: "Connects" },
              { id: "no", label: "Blocked" },
            ]}
            items={[
              {
                id: "none",
                label: "No policies exist in the namespace; pod A calls pod B",
                category: "yes",
                why: "Pods are non-isolated by default.",
              },
              {
                id: "deny",
                label: "A default-deny ingress policy selects B, and nothing else allows A",
                category: "no",
                why: "B is isolated and no rule lets A in.",
              },
              {
                id: "egress",
                label: "B allows A on port 80, but A has default-deny egress with no exceptions",
                category: "no",
                why: "Both sides must allow it; A's egress doesn't.",
              },
              {
                id: "two",
                label: "One policy denies everything to B; another allows A to B on port 80",
                category: "yes",
                why: "Policies are additive: any allow wins.",
              },
              {
                id: "noplugin",
                label: "Default-deny is applied, but the network plugin doesn't support policies",
                category: "yes",
                why: "Without an enforcing plugin, policies have no effect.",
              },
              {
                id: "dns",
                label: "A has default-deny egress and tries to look up B's name",
                category: "no",
                why: "DNS is egress too; allow port 53 to the cluster DNS.",
              },
            ]}
            explanation="No policy means open; a selecting policy means closed except what's allowed; both ends must agree; and nothing happens without an enforcing plugin."
          />
        </div>
      }
    >
      <p>Six situations. Does the traffic get through?</p>
    </StepLayout>
  );
}

/* 5 ─ Wrap --------------------------------------------------------------------------------------- */

const TAKEAWAYS: [string, string][] = [
  ["Open by default", "Any pod can reach any pod until a policy selects it."],
  ["Deny, then allow", "Policies are additive allow-lists; start from default deny."],
  ["Both ends count", "Source egress and destination ingress must both allow."],
  ["Remember DNS and the plugin", "Allow port 53; make sure your CNI enforces policies."],
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
      <p>Next chapter: configuration and storage, starting with ConfigMaps and Secrets.</p>
    </StepLayout>
  );
}
