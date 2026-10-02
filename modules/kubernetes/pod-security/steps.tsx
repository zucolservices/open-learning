"use client";

import { motion } from "motion/react";
import { Factory, Building, Microscope } from "lucide-react";
import { useSceneState } from "@/lib/module-sdk";
import { StepLayout } from "@/toolkit/layout/step-layout";
import { SortCheckpoint } from "@/toolkit/checkpoints/sort";
import { Segmented } from "@/toolkit/controls/segmented";
import { Term } from "@/toolkit/glossary/term";
import { cn } from "@/lib/cn";
import { SETTINGS, conflicts, violations } from "./model";
import type { Level, PsState } from "./state";

/* 1 ─ Three building codes ----------------------------------------------------------------------- */

export function BuildingCodes() {
  const rows = [
    {
      icon: Factory,
      t: "A workshop",
      d: "Welding, open flames, heavy machinery. Allowed, because the work needs it, and only trusted staff go in.",
      k: "Privileged",
    },
    {
      icon: Building,
      t: "An ordinary office",
      d: "No welding, no knocking down walls. Most work fits comfortably.",
      k: "Baseline",
    },
    {
      icon: Microscope,
      t: "A clean room",
      d: "Gowns, gloves, airlocks: strict rules for work that must be protected.",
      k: "Restricted",
    },
  ];
  return (
    <StepLayout
      eyebrow="Analogy"
      title="Three building codes"
      stage={
        <div className="flex flex-1 flex-col justify-center gap-2">
          {rows.map(({ icon: Icon, t, d, k }, i) => (
            <motion.div
              key={k}
              initial={{ opacity: 0, x: -6 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.12 * i }}
              className="border-line bg-surface grid grid-cols-[auto_1fr_auto] items-center gap-3 rounded-lg border px-3 py-2"
            >
              <Icon className="text-accent size-5" />
              <div>
                <p className="text-sm font-semibold">{t}</p>
                <p className="text-muted text-xs">{d}</p>
              </div>
              <span className="text-accent font-mono text-[11px]">{k}</span>
            </motion.div>
          ))}
        </div>
      }
    >
      <p>
        A container that runs as root with access to its host can take over the machine. The docs
        are blunt: &ldquo;Privileged Pods disable most security mechanisms and must be
        disallowed.&rdquo;
      </p>
      <p>
        The <Term id="pod-security-standards">Pod Security Standards</Term> are three such codes.
        Label a namespace with one, and the built-in <Term id="admission-control">admission</Term>{" "}
        check refuses pods that break it.
      </p>
    </StepLayout>
  );
}

/* 2 ─ Build a pod that passes ⭐ ------------------------------------------------------------------ */

export function PassingPod() {
  const [s, set] = useSceneState<PsState>();
  const on = s.on ?? [];
  const toggle = (id: string) =>
    set({ on: on.includes(id) ? on.filter((x) => x !== id) : [...on, id] });
  const v = violations(on, s.level);
  const c = conflicts(on);
  const rejected = s.mode === "enforce" && v.length > 0;
  return (
    <StepLayout
      eyebrow="Build"
      title="Build a pod that passes"
      stage={
        <div className="flex flex-1 flex-col justify-center gap-3">
          <div className="flex flex-wrap items-center gap-2 text-xs">
            <span className="text-muted font-mono">pod-security.kubernetes.io/</span>
            <Segmented
              size="sm"
              value={s.mode}
              options={[
                ["enforce", "enforce"],
                ["warn", "warn"],
              ]}
              onChange={(m) => set({ mode: m })}
            />
            <span className="text-muted font-mono">=</span>
            <Segmented
              size="sm"
              value={s.level}
              options={
                [
                  ["privileged", "privileged"],
                  ["baseline", "baseline"],
                  ["restricted", "restricted"],
                ] as [Level, string][]
              }
              onChange={(l) => set({ level: l })}
            />
          </div>
          <div className="grid gap-2 sm:grid-cols-2">
            {(["risky", "harden"] as const).map((g) => (
              <div key={g} className="border-line bg-surface rounded-xl border p-2">
                <p className="text-muted mb-1 text-[10px]">
                  {g === "risky" ? "Risky settings" : "Hardening settings"}
                </p>
                <div className="flex flex-col gap-1">
                  {SETTINGS.filter((x) => x.group === g).map((x) => (
                    <label key={x.id} className="flex items-center gap-2 font-mono text-[11px]">
                      <input
                        type="checkbox"
                        checked={on.includes(x.id)}
                        onChange={() => toggle(x.id)}
                        className="accent-accent"
                      />
                      {x.label}
                    </label>
                  ))}
                </div>
              </div>
            ))}
          </div>
          <motion.div
            key={`${s.level}-${s.mode}-${on.join()}`}
            initial={{ opacity: 0, y: 4 }}
            animate={{ opacity: 1, y: 0 }}
            className={cn(
              "rounded-xl border px-4 py-3",
              rejected
                ? "border-bad/50 bg-bad/10"
                : v.length
                  ? "border-accent/50 bg-accent-soft"
                  : "border-good/50 bg-good/10",
            )}
          >
            <p className="text-sm font-semibold">
              {rejected
                ? `Rejected: violates PodSecurity "${s.level}"`
                : v.length
                  ? "Admitted, with warnings"
                  : `Admitted: passes "${s.level}"`}
            </p>
            {v.length > 0 && (
              <ul className="mt-1 list-disc pl-4 text-xs">
                {v.map((x) => (
                  <li key={x}>{x}</li>
                ))}
              </ul>
            )}
            {c.length > 0 && <p className="text-bad mt-1 text-xs">{c.join(" ")}</p>}
          </motion.div>
        </div>
      }
    >
      <p>
        Pick the namespace&apos;s level and mode, then switch settings on and off until the pod
        passes. <em>Enforce</em> rejects a pod that breaks the level, <em>warn</em> lets it in with
        a warning, and <em>audit</em> (not shown) just records it.
      </p>
      <p>
        Baseline blocks known escalations such as privileged mode, host namespaces and hostPath.
        Restricted also demands a non-root user, no privilege escalation, dropped capabilities and a
        seccomp profile. Note: enforcement checks the pods a Deployment creates, so a bad Deployment
        is accepted and its pods then fail.
      </p>
    </StepLayout>
  );
}

/* 3 ─ Beyond the standards ----------------------------------------------------------------------- */

const BEYOND: [string, string][] = [
  [
    "Built-in policies (CEL)",
    'ValidatingAdmissionPolicy (GA 1.30) and MutatingAdmissionPolicy (GA 1.36) let you write your own rules, like "images must come from our registry", without running a webhook.',
  ],
  [
    "Kyverno",
    "A policy engine using Kubernetes-style YAML and CEL; CNCF graduated in March 2026. Validates, mutates and generates resources, and verifies image signatures.",
  ],
  [
    "OPA Gatekeeper",
    "Runs Open Policy Agent (CNCF graduated, 2021) policies written in Rego as an admission webhook.",
  ],
  [
    "Signed images",
    "Sign images with Sigstore's cosign and verify signatures at admission (Kyverno, Sigstore policy-controller). Refer to images by digest so a tag can't be swapped underneath you.",
  ],
  [
    "User namespaces",
    "hostUsers: false maps root in the pod to an unprivileged user on the host. Stable since 1.36.",
  ],
  [
    "Read-only root filesystem",
    "Not required by any level, but recommended: an attacker can't drop tools into the container.",
  ],
];

export function Beyond() {
  return (
    <StepLayout
      eyebrow="Explore"
      title="Beyond the standards"
      stage={
        <div className="grid flex-1 content-center gap-1.5 sm:grid-cols-2">
          {BEYOND.map(([t, d], i) => (
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
        The standards cover the pod itself. Organisations usually add rules of their own (approved
        registries, required labels, resource limits) through a{" "}
        <Term id="policy-engine">policy engine</Term>.
      </p>
      <p>
        A common starting point: label application namespaces <code>enforce: baseline</code> and{" "}
        <code>warn: restricted</code>, then tighten as teams fix their warnings. Keep privileged for
        system namespaces only.
      </p>
    </StepLayout>
  );
}

/* 4 ─ Which level allows it? -------------------------------------------------------------------- */

export function WhichLevel() {
  return (
    <StepLayout
      eyebrow="Checkpoint"
      title="Which level allows it?"
      stage={
        <div className="flex flex-1 flex-col justify-center">
          <SortCheckpoint
            id="which-pss-level"
            prompt="What is the strictest level each setting still passes?"
            categories={[
              { id: "restricted", label: "Restricted" },
              { id: "baseline", label: "Baseline" },
              { id: "privileged", label: "Privileged only" },
            ]}
            items={[
              {
                id: "priv",
                label: "privileged: true",
                category: "privileged",
                why: "Disables most security mechanisms.",
              },
              {
                id: "hostnet",
                label: "hostNetwork: true",
                category: "privileged",
                why: "Host namespaces are blocked by Baseline.",
              },
              {
                id: "noseccomp",
                label: "No seccomp profile set",
                category: "baseline",
                why: "Baseline allows it; Restricted requires RuntimeDefault or Localhost.",
              },
              {
                id: "root",
                label: "Runs as user 0 (root)",
                category: "baseline",
                why: "Restricted requires a non-root user.",
              },
              {
                id: "hardened",
                label: "runAsNonRoot, drop ALL, no escalation, RuntimeDefault seccomp",
                category: "restricted",
                why: "Exactly what Restricted asks for.",
              },
              {
                id: "bind",
                label: "Drop ALL, then add back NET_BIND_SERVICE",
                category: "restricted",
                why: "The one capability Restricted lets you add back.",
              },
            ]}
            explanation="Privileged allows anything; Baseline blocks known escalations; Restricted also requires the hardening settings."
          />
        </div>
      }
    >
      <p>Six settings. What is the strictest level each one passes?</p>
    </StepLayout>
  );
}

/* 5 ─ Wrap --------------------------------------------------------------------------------------- */

const TAKEAWAYS: [string, string][] = [
  ["Three levels", "Privileged, Baseline, Restricted: label namespaces with them."],
  ["Enforce, warn, audit", "Reject, warn or record pods that break the level."],
  ["Restricted = hardened", "Non-root, no escalation, drop ALL, seccomp."],
  ["Add your own rules", "CEL policies, Kyverno or Gatekeeper; verify signed images."],
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
      <p>Next: packaging and GitOps, getting all this YAML into clusters reliably.</p>
    </StepLayout>
  );
}
