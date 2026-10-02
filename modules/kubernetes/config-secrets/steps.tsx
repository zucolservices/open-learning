"use client";

import { useEffect, useState } from "react";
import { motion } from "motion/react";
import { Lock, LockOpen, RotateCcw } from "lucide-react";
import { useSceneState } from "@/lib/module-sdk";
import { StepLayout } from "@/toolkit/layout/step-layout";
import { SortCheckpoint } from "@/toolkit/checkpoints/sort";
import { Term } from "@/toolkit/glossary/term";
import { cn } from "@/lib/cn";
import type { CfgState } from "./state";

/* 1 ─ Same image, every environment -------------------------------------------------------------- */

export function SameImage() {
  return (
    <StepLayout
      eyebrow="Analogy"
      title="Same image, every environment"
      stage={
        <div className="flex flex-1 flex-col items-center justify-center gap-3">
          <div className="border-viz-compute bg-viz-compute/10 rounded-xl border px-4 py-2 font-mono text-xs">
            image: payments-api:v2 (identical everywhere)
          </div>
          <div className="text-subtle text-xs">+ settings handed in at start</div>
          <div className="grid w-full gap-2 sm:grid-cols-3">
            {[
              ["test", "LOG_LEVEL=debug", "DB_HOST=test-db"],
              ["staging", "LOG_LEVEL=info", "DB_HOST=stage-db"],
              ["production", "LOG_LEVEL=warn", "DB_HOST=prod-db"],
            ].map(([env, a, b], i) => (
              <motion.div
                key={env}
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 * i }}
                className="border-line bg-surface rounded-lg border px-3 py-2 font-mono text-[11px]"
              >
                <p className="font-sans text-xs font-semibold">{env}</p>
                <p>{a}</p>
                <p>{b}</p>
                <p className="text-muted">DB_PASSWORD=••••••</p>
              </motion.div>
            ))}
          </div>
        </div>
      }
    >
      <p>
        A container image should be built once and run unchanged in test, staging and production.
        What differs, such as log levels, hostnames and passwords, is handed to the pod when it
        starts.
      </p>
      <p>
        Kubernetes stores ordinary settings in <Term id="configmap">ConfigMaps</Term> and sensitive
        ones in <Term id="secret">Secrets</Term>. The names suggest a big difference. As you&apos;ll
        see, by default the difference is smaller than you&apos;d think.
      </p>
    </StepLayout>
  );
}

/* 2 ─ Change a setting ---------------------------------------------------------------------------- */

export function ChangeSetting() {
  const [value, setValue] = useState("info");
  const [env, setEnv] = useState("info");
  const [file, setFile] = useState("info");
  useEffect(() => {
    if (file === value) return;
    const id = setTimeout(() => setFile(value), 2500);
    return () => clearTimeout(id);
  }, [value, file]);
  return (
    <StepLayout
      eyebrow="Simulation"
      title="Change a setting"
      stage={
        <div className="flex flex-1 flex-col justify-center gap-3">
          <div className="border-accent bg-accent-soft rounded-xl border px-3 py-2">
            <p className="font-mono text-xs font-semibold">ConfigMap app-config</p>
            <div className="mt-1 flex flex-wrap items-center gap-2 font-mono text-xs">
              LOG_LEVEL:
              {["debug", "info", "warn"].map((v) => (
                <button
                  key={v}
                  type="button"
                  onClick={() => setValue(v)}
                  className={cn(
                    "rounded-full border px-2.5 py-0.5",
                    value === v ? "border-accent bg-surface" : "border-line hover:bg-surface-2",
                  )}
                >
                  {v}
                </button>
              ))}
            </div>
          </div>
          <div className="grid gap-2 sm:grid-cols-2">
            <div
              className={cn(
                "rounded-lg border px-3 py-2",
                env === value ? "border-good/50" : "border-bad/50",
              )}
            >
              <p className="text-muted text-[10px]">Pod using it as an environment variable</p>
              <p className="font-mono text-sm">$LOG_LEVEL = {env}</p>
              <p className="text-muted mt-1 text-[10px]">
                {env === value ? "Up to date" : "Stale until the pod restarts"}
              </p>
              <button
                type="button"
                onClick={() => setEnv(value)}
                className="border-line hover:bg-surface-2 mt-2 flex items-center gap-1 rounded-full border px-2.5 py-0.5 text-xs"
              >
                <RotateCcw className="size-3" /> Restart the pod
              </button>
            </div>
            <div
              className={cn(
                "rounded-lg border px-3 py-2",
                file === value ? "border-good/50" : "border-accent/50",
              )}
            >
              <p className="text-muted text-[10px]">Pod using it as a mounted file</p>
              <p className="font-mono text-sm">/etc/config/LOG_LEVEL: {file}</p>
              <p className="text-muted mt-1 text-[10px]">
                {file === value ? "Up to date" : "Updating on the kubelet's next sync…"}
              </p>
            </div>
          </div>
        </div>
      }
    >
      <p>
        A pod can read a ConfigMap as environment variables, command arguments or files in a volume.
        Change the log level and compare. Environment variables are read once, at start; mounted
        files are updated on the kubelet&apos;s periodic sync (not for subPath mounts), and the app
        must notice.
      </p>
      <p>
        ConfigMaps hold up to 1 MiB, &ldquo;non-confidential data in key-value pairs&rdquo;. Marking
        one immutable stops accidental changes and saves the API server work watching it.
      </p>
    </StepLayout>
  );
}

/* 3 ─ What a Secret really protects ⭐ ------------------------------------------------------------ */

const PROTECTIONS: [string, string][] = [
  ["encrypt", "Encryption at rest (KMS)"],
  ["rbac", "Least-privilege RBAC on Secrets"],
  ["pods", "Limit who can create pods in the namespace"],
  ["git", "Keep secrets out of Git (external store or sealed)"],
  ["files", "Mount as files, not environment variables"],
];

const THREATS: { who: string; how: string; stop: string }[] = [
  {
    who: "Someone who copies an etcd backup",
    how: "Secrets sit in etcd unencrypted by default.",
    stop: "encrypt",
  },
  {
    who: 'A developer granted "get secrets" across the namespace',
    how: "Anyone with API access to a Secret can read it.",
    stop: "rbac",
  },
  {
    who: "Anyone allowed to create a Deployment in the namespace",
    how: "A pod they create can mount any Secret in that namespace.",
    stop: "pods",
  },
  {
    who: "Anyone who can read the Git repo",
    how: "The Secret's YAML was committed; base64 decodes in one command.",
    stop: "git",
  },
  {
    who: "Anyone reading the app's crash logs",
    how: "The app dumped its environment, password included.",
    stop: "files",
  },
];

export function WhatProtects() {
  const [s, set] = useSceneState<CfgState>();
  const prot = s.protections ?? [];
  const toggle = (id: string) =>
    set({ protections: prot.includes(id) ? prot.filter((x) => x !== id) : [...prot, id] });
  const exposed = THREATS.filter((t) => !prot.includes(t.stop)).length;
  return (
    <StepLayout
      eyebrow="Fix the problem"
      title="What a Secret really protects"
      stage={
        <div className="flex flex-1 flex-col justify-center gap-3">
          <div className="grid gap-2 sm:grid-cols-[1fr_auto] sm:items-center">
            <pre className="border-line bg-surface overflow-x-auto rounded-lg border px-3 py-2 font-mono text-[11px] leading-relaxed">
              {`kind: Secret
metadata: { name: db-credentials }
type: Opaque
data:
  password: `}
              <span className={cn(s.decoded && "text-bad font-semibold")}>
                {s.decoded ? "R4ngoli#2026   ← decoded" : "UjRuZ29saSMyMDI2"}
              </span>
            </pre>
            <button
              type="button"
              onClick={() => set({ decoded: !s.decoded })}
              className="border-line hover:bg-surface-2 rounded-full border px-3 py-1 font-mono text-xs"
            >
              {s.decoded ? "hide" : "base64 -d"}
            </button>
          </div>
          <div className="flex flex-wrap gap-1.5">
            {PROTECTIONS.map(([id, label]) => (
              <button
                key={id}
                type="button"
                onClick={() => toggle(id)}
                className={cn(
                  "rounded-full border px-3 py-1 text-xs",
                  prot.includes(id)
                    ? "border-accent bg-accent-soft"
                    : "border-line hover:bg-surface-2",
                )}
              >
                {label}
              </button>
            ))}
          </div>
          <div className="flex flex-col gap-1.5">
            {THREATS.map((t) => {
              const safe = prot.includes(t.stop);
              return (
                <motion.div
                  key={t.who}
                  layout
                  className={cn(
                    "flex items-start gap-2 rounded-lg border px-3 py-1.5",
                    safe ? "border-good/50 bg-good/10" : "border-bad/50 bg-bad/10",
                  )}
                >
                  {safe ? (
                    <Lock className="text-good mt-0.5 size-3.5 shrink-0" />
                  ) : (
                    <LockOpen className="text-bad mt-0.5 size-3.5 shrink-0" />
                  )}
                  <div className="text-xs">
                    <p className="font-semibold">{t.who}</p>
                    <p className="text-muted">
                      {safe
                        ? `Blocked by: ${PROTECTIONS.find(([id]) => id === t.stop)![1]}`
                        : t.how}
                    </p>
                  </div>
                </motion.div>
              );
            })}
          </div>
          <p className="text-sm">
            {exposed === 0
              ? "Every path to the password is closed."
              : `${exposed} of ${THREATS.length} people can read the password.`}
          </p>
        </div>
      }
    >
      <p>
        Decode the password: base64 &ldquo;is not an encryption method, it provides no additional
        confidentiality over plain text.&rdquo; The docs warn that Secrets are &ldquo;by default,
        stored unencrypted&rdquo; in etcd, and that anyone who can create a pod in a namespace can
        read its Secrets, &ldquo;this includes indirect access such as the ability to create a
        Deployment.&rdquo;
      </p>
      <p>
        Add protections until nobody else can read it. Managed services help: EKS has encrypted all
        API data by default since March 2025, and GKE encrypts data at rest by default, with an
        optional extra KMS layer.
      </p>
    </StepLayout>
  );
}

/* 4 ─ Where does it go? -------------------------------------------------------------------------- */

export function WhereGoes() {
  return (
    <StepLayout
      eyebrow="Checkpoint"
      title="Where does it go?"
      stage={
        <div className="flex flex-1 flex-col justify-center">
          <SortCheckpoint
            id="where-config"
            prompt="Where should each piece of configuration live?"
            categories={[
              { id: "cm", label: "ConfigMap" },
              { id: "secret", label: "Secret" },
              { id: "neither", label: "Neither" },
            ]}
            items={[
              {
                id: "flag",
                label: "A feature flag that turns on the new checkout",
                category: "cm",
                why: "Not sensitive; a ConfigMap.",
              },
              {
                id: "dbpass",
                label: "The database password",
                category: "secret",
                why: "A Secret, with encryption at rest and tight RBAC (or synced from an external store).",
              },
              {
                id: "tls",
                label: "A TLS certificate's private key",
                category: "secret",
                why: "There's a built-in Secret type for it: kubernetes.io/tls.",
              },
              {
                id: "model",
                label: "A 50 MB machine-learning model file",
                category: "neither",
                why: "Both are limited to 1 MiB. Use a volume or bake it into the image.",
              },
              {
                id: "url",
                label: "The public URL of a partner's API",
                category: "cm",
                why: "Ordinary configuration.",
              },
              {
                id: "cloudkey",
                label: "A long-lived cloud admin access key",
                category: "neither",
                why: "Don't store one at all: give the pod a workload identity (module 17).",
              },
            ]}
            explanation="ConfigMaps for ordinary settings, Secrets for sensitive values you protect properly, and neither for large files or credentials you can avoid altogether."
          />
        </div>
      }
    >
      <p>Six pieces of configuration. Where should each live?</p>
    </StepLayout>
  );
}

/* 5 ─ Wrap --------------------------------------------------------------------------------------- */

const TAKEAWAYS: [string, string][] = [
  ["Build once, configure at start", "ConfigMaps and Secrets keep settings out of images."],
  ["Env vars don't update", "Mounted files do, eventually; env vars need a restart."],
  ["base64 is not encryption", "Secrets need encryption at rest and tight RBAC."],
  ["Pod creators can read Secrets", "Limit who can create workloads; consider external stores."],
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
      <p>Next: persistent storage, for data that outlives a pod.</p>
    </StepLayout>
  );
}
