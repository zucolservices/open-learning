"use client";

import { motion } from "motion/react";
import { useSceneState } from "@/lib/module-sdk";
import { StepLayout } from "@/toolkit/layout/step-layout";
import { SortCheckpoint } from "@/toolkit/checkpoints/sort";
import { Code } from "@/toolkit/controls/stepper";
import { Term } from "@/toolkit/glossary/term";
import { cn } from "@/lib/cn";
import { ECOS, STAGES } from "./model";
import type { ToolsState } from "./state";

/* 1 ─ A workshop, not a single tool --------------------------------------------------------------- */

export function Workshop() {
  return (
    <StepLayout
      eyebrow="Story"
      title="A workshop, not a single tool"
      stage={
        <div className="flex flex-1 flex-wrap content-center items-center justify-center gap-2">
          {["🪚 cut", "🔩 join", "📏 measure", "🎨 finish", "🧰 store"].map((t, i) => (
            <motion.span
              key={t}
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 * i }}
              className="border-line bg-surface rounded-xl border px-4 py-3 text-sm"
            >
              {t}
            </motion.span>
          ))}
        </div>
      }
    >
      <p>
        A carpenter doesn&apos;t own one magic tool. There&apos;s something to cut, something to
        join, something to measure, and a place to keep it all, and plenty of brands for each.
      </p>
      <p>
        ML work is the same. Each stage of a model&apos;s life has its own tools: open-source
        libraries you combine yourself, or a cloud platform that bundles them. This module is a map,
        not a ranking.
      </p>
    </StepLayout>
  );
}

/* 2 ─ Tools along the lifecycle ⭐ ---------------------------------------------------------------- */

export function Lifecycle() {
  const [s, set] = useSceneState<ToolsState>();
  const st = STAGES[s.stage];
  return (
    <StepLayout
      eyebrow="Explore"
      title="Tools along the lifecycle"
      stage={
        <div className="flex flex-1 flex-col justify-center gap-3">
          <div className="flex flex-wrap gap-1.5">
            {ECOS.map((e) => (
              <button
                key={e.id}
                type="button"
                aria-pressed={s.eco === e.id}
                onClick={() => set({ eco: e.id })}
                className={cn(
                  "rounded-full border px-3 py-1 text-xs",
                  s.eco === e.id ? "border-accent bg-accent-soft" : "border-line",
                )}
              >
                {e.name}
              </button>
            ))}
          </div>
          <div className="grid grid-cols-2 gap-1.5 sm:grid-cols-4">
            {STAGES.map((x, i) => (
              <button
                key={x.id}
                type="button"
                onClick={() => set({ stage: i })}
                className={cn(
                  "rounded-lg border px-2 py-2 text-left text-[11px]",
                  s.stage === i ? "border-accent bg-accent-soft" : "border-line bg-surface",
                )}
              >
                <span className="text-muted font-mono">{i + 1}</span> {x.name}
                <span className="text-muted mt-1 block truncate text-[10px]">{x.tools[s.eco]}</span>
              </button>
            ))}
          </div>
          <motion.div
            key={`${s.stage}-${s.eco}`}
            initial={{ opacity: 0, y: 4 }}
            animate={{ opacity: 1, y: 0 }}
            className="border-line bg-surface rounded-lg border px-3 py-2 text-xs"
          >
            <p className="text-sm font-semibold">{st.name}</p>
            <p className="text-muted">{st.job}</p>
            <p className="mt-1">
              <span className="text-muted">{ECOS.find((e) => e.id === s.eco)?.name}:</span>{" "}
              {st.tools[s.eco]}
            </p>
          </motion.div>
          <p className="text-subtle text-[10px]">
            Examples, not a complete list or a ranking. Product names as of 2026.
          </p>
        </div>
      }
    >
      <p>
        Pick a stage, then switch ecosystems. The jobs stay the same; only the names change. The
        open-source core is scikit-learn for classic ML and three gradient-boosting libraries for
        tables: XGBoost, LightGBM (started at Microsoft, community-run since 2026) and CatBoost
        (from Yandex).
      </p>
      <p>
        <Term id="experiment-tracking">Experiment tracking</Term> with MLflow (Linux Foundation)
        shows up everywhere, even inside the clouds. Google&apos;s platform was called Vertex AI
        until April 2026; it still covers classic ML. Microsoft Foundry is the separate
        generative-AI side of Azure.
      </p>
    </StepLayout>
  );
}

/* 3 ─ Three starter stacks ------------------------------------------------------------------------ */

const TEAMS: { name: string; who: string; stack: string[]; why: string }[] = [
  {
    name: "Solo analyst",
    who: "One person, one laptop, a CSV a week.",
    stack: [
      "Jupyter + pandas",
      "scikit-learn, LightGBM",
      "MLflow on the laptop",
      "A scheduled script",
    ],
    why: "Nothing to run or pay for. Upgrade only when a real pain appears.",
  },
  {
    name: "Small product team",
    who: "Five people, one model behind an app.",
    stack: [
      "Git + DVC for data",
      "XGBoost",
      "Hosted MLflow or Weights & Biases",
      "FastAPI in a container",
      "Evidently reports",
    ],
    why: "Shared tracking and versioning stop “which model is live?” arguments.",
  },
  {
    name: "Regulated bank",
    who: "Many models, auditors, already on one cloud.",
    stack: [
      "The cloud's managed ML platform",
      "Registry with approvals",
      "Pipelines for every retrain",
      "Built-in monitoring and access control",
    ],
    why: "Audit trails, permissions and support matter more than flexibility.",
  },
];

export function Stacks() {
  const [s, set] = useSceneState<ToolsState>();
  const t = TEAMS[s.team];
  return (
    <StepLayout
      eyebrow="Explore"
      title="Three starter stacks"
      stage={
        <div className="flex flex-1 flex-col justify-center gap-3">
          <div className="flex flex-wrap gap-1.5">
            {TEAMS.map((x, i) => (
              <button
                key={x.name}
                type="button"
                aria-pressed={s.team === i}
                onClick={() => set({ team: i })}
                className={cn(
                  "rounded-full border px-3 py-1 text-xs",
                  s.team === i ? "border-accent bg-accent-soft" : "border-line",
                )}
              >
                {x.name}
              </button>
            ))}
          </div>
          <p className="text-muted text-xs">{t.who}</p>
          <div className="flex flex-col gap-1">
            {t.stack.map((x, i) => (
              <motion.div
                key={`${s.team}-${x}`}
                initial={{ opacity: 0, x: -6 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.06 * i }}
                className="border-line bg-surface rounded-md border px-3 py-1.5 text-xs"
              >
                {x}
              </motion.div>
            ))}
          </div>
          <p className="text-xs">{t.why}</p>
          <Code>{`import mlflow
mlflow.autolog()                       # record settings, metrics, model
with mlflow.start_run():
    model = LGBMClassifier(learning_rate=0.05).fit(X_train, y_train)`}</Code>
        </div>
      }
    >
      <p>
        Start small and add tools when a real problem appears: you can&apos;t reproduce last
        month&apos;s result, two people overwrite each other&apos;s model, or retraining by hand
        takes all Friday. Illustrative stacks, not recommendations.
      </p>
      <p>
        <Term id="automl">AutoML</Term> tools such as AutoGluon (open source, from AWS), H2O AutoML
        and the clouds&apos; AutoML try many models for you. They make a strong baseline, but they
        don&apos;t frame the problem or spot leakage.
      </p>
    </StepLayout>
  );
}

/* 4 ─ Tools come and go --------------------------------------------------------------------------- */

export function ComeAndGo() {
  const items: [string, string][] = [
    ["May 2025", "Cloud company CoreWeave buys Weights & Biases."],
    ["Nov 2025", "lakeFS takes over DVC, the Git-style data versioning tool."],
    ["Mar 2026", "Neptune.ai's hosted tracker shuts down after OpenAI buys the company."],
    ["Mar 2026", "LightGBM moves from Microsoft to a community organisation."],
    ["Apr 2026", "Google renames Vertex AI as Gemini Enterprise Agent Platform."],
    ["Jul 2026", "Kubeflow becomes a CNCF graduated project."],
  ];
  return (
    <StepLayout
      eyebrow="Explore"
      title="Tools come and go"
      stage={
        <div className="flex flex-1 flex-col justify-center gap-1.5">
          {items.map(([d, t], i) => (
            <motion.div
              key={t}
              initial={{ opacity: 0, x: -6 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.07 * i }}
              className="border-line bg-surface grid grid-cols-[4.5rem_1fr] gap-2 rounded-lg border px-3 py-2 text-xs"
            >
              <span className="text-accent font-mono">{d}</span>
              <span className="text-muted">{t}</span>
            </motion.div>
          ))}
        </div>
      }
    >
      <p>
        In about a year, a tracker shut down, two tools changed owners, a library changed hands and
        a cloud platform was renamed. Teams using Neptune had to move their experiment history
        elsewhere.
      </p>
      <p>
        So choose tools that keep your work portable: open formats for models (such as ONNX),
        experiment records you can export, data and code in version control. Learn the jobs, not the
        brand names; the names will change again.
      </p>
    </StepLayout>
  );
}

/* 5 ─ Which job does it do? ----------------------------------------------------------------------- */

export function ToolJob() {
  return (
    <StepLayout
      eyebrow="Checkpoint"
      title="Which job does it do?"
      stage={
        <div className="flex flex-1 flex-col justify-center">
          <SortCheckpoint
            id="tool-job"
            prompt="What is each tool mainly for?"
            categories={[
              { id: "train", label: "Training models" },
              { id: "track", label: "Tracking and versioning" },
              { id: "run", label: "Pipelines and monitoring" },
            ]}
            items={[
              {
                id: "xgb",
                label: "XGBoost",
                category: "train",
                why: "A gradient-boosting library.",
              },
              {
                id: "mlflow",
                label: "MLflow Tracking",
                category: "track",
                why: "Records runs, settings and scores.",
              },
              {
                id: "kubeflow",
                label: "Kubeflow Pipelines",
                category: "run",
                why: "Runs ML pipelines on Kubernetes.",
              },
              {
                id: "dvc",
                label: "DVC",
                category: "track",
                why: "Versions data and models with Git.",
              },
              {
                id: "sklearn",
                label: "scikit-learn",
                category: "train",
                why: "The classic ML toolbox.",
              },
              {
                id: "evidently",
                label: "Evidently",
                category: "run",
                why: "Drift and data-quality reports.",
              },
            ]}
            explanation="Learn the jobs (train, track, version, automate, serve, monitor); each ecosystem has its own names for the same tools."
          />
        </div>
      }
    >
      <p>Sort the tools.</p>
    </StepLayout>
  );
}

/* 6 ─ Wrap ---------------------------------------------------------------------------------------- */

const POINTS: [string, string][] = [
  ["Jobs, not brands", "Explore, train, track, version, automate, serve, monitor."],
  ["Open-source core", "scikit-learn, boosting libraries, MLflow."],
  ["Clouds bundle it", "SageMaker AI, Agent Platform, Azure ML, Databricks."],
  ["Start small", "Add tools when a real pain appears."],
  ["Stay portable", "Vendors change; keep exportable records."],
];

export function Wrap() {
  return (
    <StepLayout
      eyebrow="Wrap-up"
      title="What to remember"
      stage={
        <div className="flex flex-1 flex-col justify-center gap-1.5">
          {POINTS.map(([t, d], i) => (
            <motion.div
              key={t}
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.07 * i }}
              className="border-line bg-surface rounded-lg border px-3 py-2"
            >
              <p className="text-sm font-semibold">{t}</p>
              <p className="text-muted text-xs">{d}</p>
            </motion.div>
          ))}
        </div>
      }
    >
      <p>Next: the capstone, where you put the whole track to work on customer churn.</p>
    </StepLayout>
  );
}
