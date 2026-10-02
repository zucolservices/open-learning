"use client";

import { motion } from "motion/react";
import { BadgeCheck, DoorOpen, Skull, Wrench } from "lucide-react";
import { useSceneState } from "@/lib/module-sdk";
import { StepLayout } from "@/toolkit/layout/step-layout";
import { SortCheckpoint } from "@/toolkit/checkpoints/sort";
import { Term } from "@/toolkit/glossary/term";
import { cn } from "@/lib/cn";
import { ACTIONS, GRANTS, allowed } from "./model";
import type { RbacState } from "./state";

/* 1 ─ Badge and doors ---------------------------------------------------------------------------- */

export function BadgeDoors() {
  return (
    <StepLayout
      eyebrow="Analogy"
      title="A badge, and the doors it opens"
      stage={
        <div className="grid flex-1 content-center gap-3 sm:grid-cols-2">
          {[
            {
              icon: BadgeCheck,
              t: "Who are you?",
              d: "The guard checks your badge photo. For people: a certificate or a sign-in from your company's identity provider. For pods: a service account token.",
              k: "authentication",
            },
            {
              icon: DoorOpen,
              t: "Which doors?",
              d: "Your badge opens the rooms your job needs. A contractor's badge that opens every door, including the vault, is a disaster waiting to happen.",
              k: "authorisation (RBAC)",
            },
          ].map(({ icon: Icon, t, d, k }, i) => (
            <motion.div
              key={t}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.15 * i }}
              className="border-line bg-surface flex flex-col gap-2 rounded-xl border px-4 py-4"
            >
              <Icon className="text-accent size-5" />
              <p className="font-semibold">{t}</p>
              <p className="text-muted text-sm">{d}</p>
              <p className="mt-auto font-mono text-xs">{k}</p>
            </motion.div>
          ))}
        </div>
      }
    >
      <p>
        Every request to the API server is checked twice: who is asking, then whether they may.
        &ldquo;Kubernetes does not have objects which represent normal user accounts&rdquo;: people
        come from outside, while workloads get <Term id="service-account">service accounts</Term>.
      </p>
      <p>
        Permissions come from <Term id="rbac">role-based access control</Term>, and access &ldquo;is
        denied by default&rdquo;. Giving too much is one of the commonest ways clusters are
        breached.
      </p>
    </StepLayout>
  );
}

/* 2 ─ The breach ⭐ ------------------------------------------------------------------------------- */

export function Breach() {
  const [s, set] = useSceneState<RbacState>();
  const results = ACTIONS.map((a) => ({ a, ok: allowed(s.grant, a.id) }));
  const appWorks = results.find((r) => r.a.who === "app")!.ok;
  const leaks = results.filter((r) => r.a.who === "attacker" && r.ok).length;
  const fixed = appWorks && leaks === 0;
  const grant = GRANTS.find((g) => g.id === s.grant)!;
  return (
    <StepLayout
      eyebrow="Fix the problem"
      title="The breach"
      stage={
        <div className="flex flex-1 flex-col justify-center gap-3">
          <div className="border-bad/50 bg-bad/10 flex items-start gap-2 rounded-xl border px-3 py-2 text-xs">
            <Skull className="text-bad mt-0.5 size-4 shrink-0" />
            <p>
              An attacker exploited a bug in the <span className="font-mono">image-resizer</span>{" "}
              pod and now runs commands inside it, using the token of its service account{" "}
              <span className="font-mono">media/resizer</span>.
            </p>
          </div>
          <div className="flex flex-col gap-1">
            {GRANTS.map((g) => (
              <button
                key={g.id}
                type="button"
                onClick={() => set({ grant: g.id })}
                className={cn(
                  "rounded-lg border px-3 py-1.5 text-left font-mono text-[11px]",
                  s.grant === g.id
                    ? "border-accent bg-accent-soft"
                    : "border-line hover:bg-surface-2",
                )}
              >
                {g.label}
              </button>
            ))}
          </div>
          <pre className="border-line bg-surface overflow-x-auto rounded-lg border px-3 py-2 font-mono text-[10px] leading-relaxed">
            {grant.yaml}
          </pre>
          <div className="border-line bg-surface rounded-xl border">
            {results.map(({ a, ok }) => {
              const good = a.who === "app" ? ok : !ok;
              return (
                <div
                  key={a.id}
                  className="border-line flex items-center justify-between gap-2 border-b px-3 py-1.5 last:border-b-0"
                >
                  <span className="flex items-center gap-1.5 font-mono text-[10px]">
                    {a.who === "app" ? (
                      <Wrench className="text-muted size-3 shrink-0" />
                    ) : (
                      <Skull className="text-bad size-3 shrink-0" />
                    )}
                    kubectl auth can-i {a.label}
                  </span>
                  <span
                    className={cn(
                      "rounded px-1.5 py-0.5 font-mono text-[10px] font-semibold",
                      good ? "bg-good/20 text-good" : "bg-bad/20 text-bad",
                    )}
                  >
                    {ok ? "yes" : "no"}
                  </span>
                </div>
              );
            })}
          </div>
          <p
            className={cn(
              "rounded-xl border px-4 py-3 text-sm",
              fixed ? "border-good/50 bg-good/10" : "border-bad/50 bg-bad/10",
            )}
          >
            {fixed
              ? "Least privilege: the app reads the one ConfigMap it needs, and the stolen token is good for nothing else."
              : !appWorks
                ? "Safe, but the app can't read its configuration any more. Grant exactly what it needs, or mount the ConfigMap as a file so it needs no API access at all."
                : s.grant === "admin"
                  ? "cluster-admin: the attacker owns every namespace, every secret, every workload."
                  : s.grant === "edit"
                    ? 'Still bad: edit lets the attacker read secrets and create pods, and a pod "can run as any ServiceAccount" in its namespace.'
                    : "The payments database password in this namespace is readable. Listing secrets reveals their contents."}
          </p>
        </div>
      }
    >
      <p>
        The resizer only needs to read one ConfigMap. Someone gave its service account cluster-admin
        &ldquo;to make it work&rdquo;. Choose a better grant and test it with{" "}
        <code>kubectl auth can-i</code>.
      </p>
      <p>
        This story is made up, but the pattern is real: in 2018 researchers found Tesla&apos;s
        Kubernetes console open without a password, with cloud credentials inside a pod, used for
        cryptomining.
      </p>
    </StepLayout>
  );
}

/* 3 ─ The building blocks ------------------------------------------------------------------------- */

const BLOCKS: [string, string][] = [
  [
    "Role / ClusterRole",
    "A list of allowed actions: apiGroups, resources (optionally by name) and verbs. A Role lives in one namespace; a ClusterRole is cluster-wide or reusable.",
  ],
  [
    "RoleBinding / ClusterRoleBinding",
    "Gives a role to users, groups or service accounts. A RoleBinding can grant a ClusterRole within just its own namespace.",
  ],
  [
    "Purely additive",
    '"Permissions are purely additive (there are no deny rules)." Remove access by removing a binding.',
  ],
  [
    "Service account tokens",
    "Each pod gets its namespace's default account unless told otherwise. Tokens are mounted automatically, expire after about an hour and are refreshed by the kubelet. Turn mounting off when the app doesn't call the API.",
  ],
  [
    "Dangerous verbs",
    "list or watch on secrets, creating workloads, escalate, bind, impersonate, nodes/proxy, and cluster-admin. Avoid wildcards and the system:masters group.",
  ],
  [
    "Cloud access without keys",
    "EKS Pod Identity or IRSA, Workload Identity Federation for GKE, Microsoft Entra Workload ID: a service account maps to a cloud identity (Cloud Architecture, module 10).",
  ],
];

export function BuildingBlocks() {
  return (
    <StepLayout
      eyebrow="Explore"
      title="The building blocks"
      stage={
        <div className="grid flex-1 content-center gap-1.5 sm:grid-cols-2">
          {BLOCKS.map(([t, d], i) => (
            <motion.div
              key={t}
              initial={{ opacity: 0, y: 4 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.05 * i }}
              className="border-line bg-surface rounded-lg border px-3 py-2"
            >
              <p className="text-sm font-semibold">{t}</p>
              <p className="text-muted text-xs">{d}</p>
            </motion.div>
          ))}
        </div>
      }
    >
      <p>
        RBAC has only four object types. The skill is in granting the smallest set of verbs on the
        smallest set of resources, in the smallest scope.
      </p>
      <p>
        <code>kubectl auth can-i --list --as system:serviceaccount:media:resizer</code> shows
        exactly what an account can do. Run it before an attacker does.
      </p>
    </StepLayout>
  );
}

/* 4 ─ Safe or dangerous? ------------------------------------------------------------------------- */

export function SafeOrDangerous() {
  return (
    <StepLayout
      eyebrow="Checkpoint"
      title="Safe or dangerous?"
      stage={
        <div className="flex flex-1 flex-col justify-center">
          <SortCheckpoint
            id="safe-or-dangerous"
            prompt="Would you grant this to an application's service account?"
            categories={[
              { id: "safe", label: "Reasonable" },
              { id: "danger", label: "Dangerous" },
            ]}
            items={[
              {
                id: "cm",
                label: "get on one named ConfigMap in its namespace",
                category: "safe",
                why: "Exactly what it needs, nothing more.",
              },
              {
                id: "secrets",
                label: "list secrets in every namespace",
                category: "danger",
                why: "Listing secrets returns their contents, cluster-wide.",
              },
              {
                id: "pods",
                label: "create pods in its namespace",
                category: "danger",
                why: "A new pod can run as any service account in that namespace.",
              },
              {
                id: "watch",
                label: "watch Deployments in its own namespace, for a status page",
                category: "safe",
                why: "Read-only and scoped.",
              },
              {
                id: "bind",
                label: "bind and escalate on roles",
                category: "danger",
                why: "Lets it grant itself more power.",
              },
              {
                id: "proxy",
                label: "get on nodes/proxy",
                category: "danger",
                why: '"Not a read-only permission": it reaches the kubelet API on nodes.',
              },
            ]}
            explanation="Scoped, read-only access to exactly what's needed is fine. Secrets, workload creation, escalation and node access are where breaches start."
          />
        </div>
      }
    >
      <p>Six permissions. Which would you grant an application?</p>
    </StepLayout>
  );
}

/* 5 ─ Wrap --------------------------------------------------------------------------------------- */

const TAKEAWAYS: [string, string][] = [
  ["Two checks", "Who you are (authentication), then what you may do (RBAC)."],
  ["Least privilege", "Smallest verbs, resources and scope; never cluster-admin for an app."],
  ["Pod creation is power", "It can borrow any service account in the namespace."],
  ["Test it", "kubectl auth can-i --as the service account."],
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
      <p>Next: pod security and admission, stopping risky pods before they start.</p>
    </StepLayout>
  );
}
