"use client";

import { useEffect, useState } from "react";
import { motion } from "motion/react";
import { BookOpen, GitCommitHorizontal, RotateCcw, Terminal } from "lucide-react";
import { useSceneState } from "@/lib/module-sdk";
import { StepLayout } from "@/toolkit/layout/step-layout";
import { SortCheckpoint } from "@/toolkit/checkpoints/sort";
import { Segmented } from "@/toolkit/controls/segmented";
import { Term } from "@/toolkit/glossary/term";
import { cn } from "@/lib/cn";
import type { GitOpsState } from "./state";

/* 1 ─ One recipe, many kitchens ------------------------------------------------------------------- */

export function OneRecipe() {
  return (
    <StepLayout
      eyebrow="Analogy"
      title="One recipe, many kitchens"
      stage={
        <div className="flex flex-1 flex-col justify-center gap-2">
          {[
            [
              "A recipe with blanks",
              '"Serves ___; add ___ chillies." Fill in the numbers for each kitchen.',
              "Helm: templates + values",
            ],
            [
              "A recipe plus margin notes",
              'The base recipe stays untouched; each kitchen keeps a note: "double the chillies".',
              "Kustomize: base + overlays",
            ],
            [
              "The master recipe book",
              "Every kitchen cooks only from the book, and a supervisor keeps checking the plates match it.",
              "GitOps: Git + an agent",
            ],
          ].map(([t, d, k], i) => (
            <motion.div
              key={k}
              initial={{ opacity: 0, x: -6 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.12 * i }}
              className="border-line bg-surface grid grid-cols-[auto_1fr_auto] items-center gap-3 rounded-lg border px-3 py-2"
            >
              <BookOpen className="text-accent size-5" />
              <div>
                <p className="text-sm font-semibold">{t}</p>
                <p className="text-muted text-xs">{d}</p>
              </div>
              <span className="text-accent text-right font-mono text-[10px]">{k}</span>
            </motion.div>
          ))}
        </div>
      }
    >
      <p>
        A real app is a dozen YAML files (Deployment, Service, ConfigMap, HTTPRoute…) that differ
        slightly between dev and production. Copying them by hand drifts apart within weeks.
      </p>
      <p>
        <Term id="helm">Helm</Term> and <Term id="kustomize">Kustomize</Term> package those files;{" "}
        <Term id="gitops">GitOps</Term> makes Git the one place changes happen.
      </p>
    </StepLayout>
  );
}

/* 2 ─ Package it ⭐ ------------------------------------------------------------------------------- */

const VALUES = {
  dev: { replicas: 1, tag: "v2.4.0-rc1", cpu: "100m", host: "dev.shop.example.com" },
  prod: { replicas: 6, tag: "v2.3.2", cpu: "500m", host: "shop.example.com" },
};

export function PackageIt() {
  const [s, set] = useSceneState<GitOpsState>();
  const v = VALUES[s.env];
  const source =
    s.tool === "helm"
      ? `# templates/deployment.yaml
spec:
  replicas: {{ .Values.replicas }}
  template:
    spec:
      containers:
      - image: shop/api:{{ .Values.tag }}
        resources:
          requests: { cpu: {{ .Values.cpu }} }

# values-${s.env}.yaml
replicas: ${v.replicas}
tag: ${v.tag}
cpu: ${v.cpu}
host: ${v.host}`
      : `# base/deployment.yaml (plain YAML, no blanks)
spec:
  replicas: 1
  template:
    spec:
      containers:
      - image: shop/api:latest

# overlays/${s.env}/kustomization.yaml
resources: [../../base]
images: [{ name: shop/api, newTag: ${v.tag} }]
${s.env === "prod" ? "replicas: [{ name: api, count: 6 }]\npatches: [{ path: cpu-500m.yaml }]" : "# dev keeps 1 replica"}`;
  const command =
    s.tool === "helm"
      ? `helm upgrade --install api ./chart -f values-${s.env}.yaml`
      : `kubectl apply -k overlays/${s.env}`;
  return (
    <StepLayout
      eyebrow="Build"
      title="Package it"
      stage={
        <div className="flex flex-1 flex-col justify-center gap-3">
          <div className="flex flex-wrap gap-2">
            <Segmented
              size="sm"
              value={s.tool}
              options={[
                ["helm", "Helm"],
                ["kustomize", "Kustomize"],
              ]}
              onChange={(t) => set({ tool: t })}
            />
            <Segmented
              size="sm"
              value={s.env}
              options={[
                ["dev", "dev"],
                ["prod", "prod"],
              ]}
              onChange={(e) => set({ env: e })}
            />
          </div>
          <div className="grid gap-2 sm:grid-cols-2">
            <pre className="border-line bg-surface overflow-x-auto rounded-lg border px-3 py-2 font-mono text-[10px] leading-relaxed">
              {source}
            </pre>
            <div className="flex flex-col gap-2">
              <p className="bg-surface-2 rounded px-2 py-1 font-mono text-[10px]">$ {command}</p>
              <motion.pre
                key={`${s.tool}-${s.env}`}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="border-accent/50 bg-accent-soft overflow-x-auto rounded-lg border px-3 py-2 font-mono text-[10px] leading-relaxed"
              >
                {`# what reaches the cluster
kind: Deployment
spec:
  replicas: ${v.replicas}
  template:
    spec:
      containers:
      - image: shop/api:${v.tag}
        resources:
          requests: { cpu: ${v.cpu} }`}
              </motion.pre>
            </div>
          </div>
        </div>
      }
    >
      <p>
        Switch tool and environment and compare. Helm fills blanks in templates from a values file,
        and tracks each install as a release you can upgrade or roll back; charts are shared through
        OCI registries. Kustomize, built into kubectl, keeps plain YAML and layers patches on top:
        &ldquo;a template-free way&rdquo;.
      </p>
      <p>
        Helm suits apps you install from someone else (databases, monitoring); Kustomize suits your
        own manifests with small per-environment differences. Many teams use both. Helm 4 arrived in
        November 2025; Helm 3 gets security fixes until February 2027.
      </p>
    </StepLayout>
  );
}

/* 3 ─ The GitOps loop ⭐ -------------------------------------------------------------------------- */

interface World {
  git: { replicas: number; tag: string };
  live: { replicas: number; tag: string };
  log: string[];
  driftAt: number | null;
}

const START: World = {
  git: { replicas: 6, tag: "v2.3.2" },
  live: { replicas: 6, tag: "v2.3.2" },
  log: ["Synced: cluster matches Git (commit a1f3)"],
  driftAt: null,
};

export function GitOpsLoop() {
  const [s, set] = useSceneState<GitOpsState>();
  const [w, setW] = useState<World>(START);
  const outOfSync = w.git.replicas !== w.live.replicas || w.git.tag !== w.live.tag;
  // Reconcile: Git changes always sync (automated); live drift only if self-heal / Flux interval.
  useEffect(() => {
    if (!outOfSync) return;
    const gitChanged = w.driftAt === null;
    const delay = gitChanged ? 2 : s.agent === "flux" ? 6 : s.selfHeal ? 2 : null;
    if (delay === null) return;
    const id = setTimeout(() => {
      setW((x) => ({
        ...x,
        live: { ...x.git },
        driftAt: null,
        log: [
          ...x.log,
          gitChanged
            ? "Synced: applied the new commit"
            : s.agent === "flux"
              ? "Flux interval: drift detected and corrected"
              : "Self-heal: reverted the manual change",
        ].slice(-5),
      }));
    }, delay * 1000);
    return () => clearTimeout(id);
  }, [outOfSync, w.driftAt, s.agent, s.selfHeal, w.git]);
  const act = (kind: "commit" | "manual" | "revert") =>
    setW((x) => {
      if (kind === "commit")
        return {
          ...x,
          git: { ...x.git, tag: "v2.4.0" },
          driftAt: null,
          log: [...x.log, "git push: image v2.4.0 (commit b7c2)"].slice(-5),
        };
      if (kind === "revert")
        return {
          ...x,
          git: { ...x.git, tag: "v2.3.2" },
          driftAt: null,
          log: [...x.log, "git revert b7c2: back to v2.3.2"].slice(-5),
        };
      return {
        ...x,
        live: { ...x.live, replicas: 10 },
        driftAt: 1,
        log: [...x.log, "kubectl scale --replicas=10 (by hand, at 2 a.m.)"].slice(-5),
      };
    });
  return (
    <StepLayout
      eyebrow="Simulation"
      title="The GitOps loop"
      stage={
        <div className="flex flex-1 flex-col justify-center gap-3">
          <div className="flex flex-wrap items-center gap-2">
            <Segmented
              size="sm"
              value={s.agent}
              options={[
                ["argo", "Argo CD"],
                ["flux", "Flux"],
              ]}
              onChange={(a) => set({ agent: a })}
            />
            {s.agent === "argo" && (
              <label className="flex items-center gap-1.5 text-xs">
                <input
                  type="checkbox"
                  checked={s.selfHeal}
                  onChange={(e) => set({ selfHeal: e.target.checked })}
                  className="accent-accent"
                />
                selfHeal: true
              </label>
            )}
          </div>
          <div className="grid grid-cols-[1fr_auto_1fr] items-center gap-2">
            <div className="border-viz-meta bg-viz-meta/10 rounded-xl border px-3 py-2">
              <p className="text-muted text-[10px]">Git (desired)</p>
              <p className="font-mono text-xs">replicas: {w.git.replicas}</p>
              <p className="font-mono text-xs">image: {w.git.tag}</p>
            </div>
            <motion.span
              animate={{ rotate: outOfSync ? 0 : 360 }}
              transition={{ duration: 1 }}
              className={cn(
                "rounded-full border px-2 py-1 font-mono text-[10px]",
                outOfSync ? "border-bad text-bad" : "border-good text-good",
              )}
            >
              {outOfSync ? "OutOfSync" : "Synced"}
            </motion.span>
            <div
              className={cn(
                "rounded-xl border px-3 py-2",
                outOfSync ? "border-bad/60 bg-bad/10" : "border-line bg-surface",
              )}
            >
              <p className="text-muted text-[10px]">Cluster (live)</p>
              <p className="font-mono text-xs">replicas: {w.live.replicas}</p>
              <p className="font-mono text-xs">image: {w.live.tag}</p>
            </div>
          </div>
          <div className="flex flex-wrap gap-1.5">
            <button
              type="button"
              onClick={() => act("commit")}
              className="border-line hover:bg-surface-2 flex items-center gap-1 rounded-full border px-3 py-1 text-xs"
            >
              <GitCommitHorizontal className="size-3" /> Commit image v2.4.0
            </button>
            <button
              type="button"
              onClick={() => act("manual")}
              className="border-line hover:bg-surface-2 flex items-center gap-1 rounded-full border px-3 py-1 text-xs"
            >
              <Terminal className="size-3" /> kubectl scale by hand
            </button>
            <button
              type="button"
              onClick={() => act("revert")}
              className="border-line hover:bg-surface-2 flex items-center gap-1 rounded-full border px-3 py-1 text-xs"
            >
              <RotateCcw className="size-3" /> git revert
            </button>
          </div>
          <div className="border-line bg-surface rounded-lg border px-3 py-2 font-mono text-[10px]">
            {w.log.map((l, i) => (
              <p key={`${l}-${i}`} className={i === w.log.length - 1 ? "text-fg" : "text-muted"}>
                {l}
              </p>
            ))}
          </div>
          <p className="text-sm">
            {outOfSync && w.driftAt !== null && s.agent === "argo" && !s.selfHeal
              ? 'The manual change stays: with automated sync, Argo CD applies new commits, but "changes that are made to the live cluster will not trigger automated sync" unless selfHeal is on. It does show OutOfSync.'
              : s.agent === "flux"
                ? "Flux re-applies the desired state on every interval (ten minutes in the docs' example, shortened here), correcting drift as it goes."
                : "Changes arrive by commit; reverting a commit is the rollback."}
          </p>
        </div>
      }
    >
      <p>
        An agent in the cluster watches Git and keeps the cluster matching it. The OpenGitOps
        principles: desired state is declarative, versioned and immutable, &ldquo;Software agents
        automatically pull the desired state declarations from the source&rdquo;, and they
        continuously reconcile.
      </p>
      <p>
        Commit a new image, change something by hand, revert. With pull-based delivery, CI never
        needs credentials for the cluster (though one Argo CD instance managing many clusters holds
        theirs). Secrets stay out of plain Git with Sealed Secrets, SOPS or External Secrets (module
        11).
      </p>
    </StepLayout>
  );
}

/* 4 ─ Which tool? -------------------------------------------------------------------------------- */

export function WhichTool() {
  return (
    <StepLayout
      eyebrow="Checkpoint"
      title="Which tool?"
      stage={
        <div className="flex flex-1 flex-col justify-center">
          <SortCheckpoint
            id="which-delivery-tool"
            prompt="Which tool fits each job best?"
            categories={[
              { id: "helm", label: "Helm" },
              { id: "kustomize", label: "Kustomize" },
              { id: "gitops", label: "GitOps agent" },
            ]}
            items={[
              {
                id: "vendor",
                label: "Install a database packaged by its vendor, with versioned releases",
                category: "helm",
                why: "A chart from the vendor's registry; upgrade and roll back as releases.",
              },
              {
                id: "overlays",
                label: "Same manifests for dev and prod, with a few patches and no templating",
                category: "kustomize",
                why: "Base plus overlays.",
              },
              {
                id: "drift",
                label: "Make sure nobody's manual kubectl change survives",
                category: "gitops",
                why: "Self-heal or interval reconciliation reverts drift.",
              },
              {
                id: "rollback",
                label: "Roll production back to last week by reverting a commit",
                category: "gitops",
                why: "Git history is the deployment history.",
              },
              {
                id: "values",
                label: "One package, different values per environment",
                category: "helm",
                why: "values-dev.yaml, values-prod.yaml.",
              },
              {
                id: "sidecar",
                label: "Add a sidecar to the base Deployment only in production",
                category: "kustomize",
                why: "A patch in the prod overlay.",
              },
            ]}
            explanation="Helm packages and versions apps; Kustomize layers patches on plain YAML; a GitOps agent keeps the cluster equal to Git."
          />
        </div>
      }
    >
      <p>Six delivery jobs. Which tool fits each?</p>
    </StepLayout>
  );
}

/* 5 ─ Wrap --------------------------------------------------------------------------------------- */

const TAKEAWAYS: [string, string][] = [
  ["Helm", "Templates + values; releases you can upgrade and roll back."],
  ["Kustomize", "Plain YAML + overlays; built into kubectl."],
  ["GitOps", "Git is the truth; an agent pulls and reconciles."],
  ["Mind the defaults", "Argo CD self-heal and prune are off until you turn them on."],
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
      <p>Next: debugging a cluster, when pods won&apos;t start or keep dying.</p>
    </StepLayout>
  );
}
