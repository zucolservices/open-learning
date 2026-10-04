"use client";

import { motion } from "motion/react";
import { useSceneState } from "@/lib/module-sdk";
import { StepLayout } from "@/toolkit/layout/step-layout";
import { SortCheckpoint } from "@/toolkit/checkpoints/sort";
import { Code } from "@/toolkit/controls/stepper";
import { Term } from "@/toolkit/glossary/term";
import { cn } from "@/lib/cn";
import { LAYERS, MANAGERS, MODELS, SERVICES, YOU_FROM, type Cloud, type Model } from "./model";
import type { PlatState } from "./state";

/* 1 ─ Own, lease or taxi -------------------------------------------------------------------------- */

export function CarTaxi() {
  const rows: [string, string][] = [
    ["Own a car", "Choose everything; also insure it, service it and park it."],
    ["Lease one", "Pick the model; the leasing company handles servicing."],
    ["Take a taxi", "Say where you're going. Pay for the trip, not the car."],
  ];
  return (
    <StepLayout
      eyebrow="Story"
      title="Own, lease or taxi"
      stage={
        <div className="flex flex-1 flex-col justify-center gap-2">
          {rows.map(([t, d], i) => (
            <motion.div
              key={t}
              initial={{ opacity: 0, x: -6 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.15 * i }}
              className="border-line bg-surface rounded-xl border px-4 py-3"
            >
              <p className="text-sm font-semibold">{t}</p>
              <p className="text-muted text-xs">{d}</p>
            </motion.div>
          ))}
        </div>
      }
    >
      <p>
        You can own a car, lease one or take a taxi. All three get you there; what differs is how
        much you look after yourself, and how you pay.
      </p>
      <p>
        Spark is the same. You can run your own cluster, use a{" "}
        <Term id="managed-spark">managed Spark service</Term> that runs clusters for you, or go{" "}
        <Term id="serverless-spark">serverless</Term> and just submit jobs. The Spark code barely
        changes.
      </p>
    </StepLayout>
  );
}

/* 2 ─ Who manages what ⭐ ------------------------------------------------------------------------- */

export function WhereToRun() {
  const [s, set] = useSceneState<PlatState>();
  const from = YOU_FROM[s.model];
  const clouds: [Cloud, string][] = [
    ["aws", "AWS"],
    ["gcp", "Google Cloud"],
    ["azure", "Azure"],
    ["any", "anywhere"],
  ];
  return (
    <StepLayout
      eyebrow="Simulation"
      title="Who manages what"
      stage={
        <div className="flex flex-1 flex-col justify-center gap-3">
          <div className="flex flex-wrap gap-1.5">
            {(Object.keys(MODELS) as Model[]).map((m) => (
              <button
                key={m}
                type="button"
                aria-pressed={s.model === m}
                onClick={() => set({ model: m })}
                className={cn(
                  "rounded-full border px-3 py-1 text-xs",
                  s.model === m ? "border-accent bg-accent-soft" : "border-line",
                )}
              >
                {MODELS[m].name}
              </button>
            ))}
          </div>
          <div className="grid gap-3 sm:grid-cols-[1fr_1.2fr]">
            <div className="flex flex-col-reverse gap-1">
              {LAYERS.map((l, i) => {
                const you = i >= from;
                return (
                  <motion.div
                    key={l}
                    layout
                    animate={{ opacity: 1 }}
                    className={cn(
                      "flex items-center justify-between rounded-md border px-3 py-1.5 text-xs",
                      you ? "border-accent bg-accent-soft" : "border-line bg-surface-2",
                    )}
                  >
                    <span>{l}</span>
                    <span
                      className={cn(
                        "text-[10px]",
                        you ? "text-accent font-semibold" : "text-muted",
                      )}
                    >
                      {you ? "you" : "provider"}
                    </span>
                  </motion.div>
                );
              })}
            </div>
            <div className="flex flex-col gap-2">
              <p className="text-muted text-xs">{MODELS[s.model].blurb}</p>
              <div className="flex flex-wrap gap-1">
                {clouds.map(([c, l]) => (
                  <button
                    key={c}
                    type="button"
                    aria-pressed={s.cloud === c}
                    onClick={() => set({ cloud: c })}
                    className={cn(
                      "rounded-md border px-2 py-0.5 text-[11px]",
                      s.cloud === c ? "border-accent bg-accent-soft" : "border-line",
                    )}
                  >
                    {l}
                  </button>
                ))}
              </div>
              <motion.ul
                key={`${s.model}-${s.cloud}`}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="flex flex-col gap-1"
              >
                {SERVICES[s.cloud][s.model].map((x) => (
                  <li
                    key={x}
                    className="border-line bg-surface rounded-md border px-2.5 py-1.5 text-xs"
                  >
                    {x}
                  </li>
                ))}
              </motion.ul>
            </div>
          </div>
          <p className="text-subtle text-[10px]">
            Product names and versions as of October 2026. In the self-managed case the hardware may
            still be a cloud&apos;s.
          </p>
        </div>
      }
    >
      <p>
        Choose a model and see which layers you look after. Then pick a cloud for the services that
        fit. Moving from left to right trades control for convenience.
      </p>
      <p>
        Names change often. In April 2026 Google brought Dataproc and its serverless Spark together
        as Managed Service for Apache Spark (the API and <code>gcloud dataproc</code> commands are
        unchanged). On Azure, Microsoft points new work to Fabric.
      </p>
    </StepLayout>
  );
}

/* 3 ─ Cluster managers ---------------------------------------------------------------------------- */

export function ClusterManagers() {
  const [s, set] = useSceneState<PlatState>();
  const m = MANAGERS[s.mgr] ?? MANAGERS[0];
  return (
    <StepLayout
      eyebrow="Explore"
      title="Cluster managers"
      stage={
        <div className="flex flex-1 flex-col justify-center gap-3">
          <div className="flex flex-wrap gap-1.5">
            {MANAGERS.map((x, i) => (
              <button
                key={x.name}
                type="button"
                aria-pressed={s.mgr === i}
                onClick={() => set({ mgr: i })}
                className={cn(
                  "rounded-full border px-3 py-1 text-xs",
                  s.mgr === i ? "border-accent bg-accent-soft" : "border-line",
                )}
              >
                {x.name}
              </button>
            ))}
          </div>
          <motion.div
            key={m.name}
            initial={{ opacity: 0, y: 4 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-col gap-2"
          >
            <Code>{`spark-submit ${m.master} \\
  --deploy-mode cluster \\
  --conf spark.executor.instances=10 \\
  jobs/daily_revenue.py`}</Code>
            <p className="text-muted text-xs">{m.note}</p>
          </motion.div>
          <p className="text-subtle text-[11px]">Apache Mesos support was removed in Spark 4.0.</p>
        </div>
      }
    >
      <p>
        Underneath every option is a cluster manager (module 2) that hands out machines. The same
        application runs on any of them; only <code>--master</code> and a few settings change.
      </p>
      <p>
        On Kubernetes, the driver and each executor are pods. Managed services hide this choice from
        you; self-managed platforms make it a key decision.
      </p>
    </StepLayout>
  );
}

/* 4 ─ Spark Connect ------------------------------------------------------------------------------- */

export function Connect() {
  return (
    <StepLayout
      eyebrow="Explore"
      title="Spark Connect"
      stage={
        <div className="flex flex-1 flex-col justify-center gap-3">
          <svg
            viewBox="0 0 320 120"
            className="w-full max-w-md self-center"
            role="img"
            aria-label="A thin client sends plans over gRPC to a Spark server and gets Arrow batches back"
          >
            <rect
              x={6}
              y={34}
              width={90}
              height={52}
              rx={8}
              className="fill-surface-2/60 stroke-line-strong"
            />
            <text x={51} y={56} textAnchor="middle" className="fill-fg text-[10px]">
              thin client
            </text>
            <text x={51} y={70} textAnchor="middle" className="fill-muted text-[8px]">
              laptop, notebook, app
            </text>
            <rect
              x={210}
              y={20}
              width={104}
              height={80}
              rx={8}
              className="fill-viz-data/10 stroke-viz-data"
            />
            <text x={262} y={44} textAnchor="middle" className="fill-fg text-[10px]">
              Spark Connect server
            </text>
            <text x={262} y={60} textAnchor="middle" className="fill-muted text-[8px]">
              driver + executors
            </text>
            <path d="M96 50 L210 50" className="stroke-accent" strokeWidth={1.2} />
            <path d="M210 72 L96 72" className="stroke-viz-add" strokeWidth={1.2} />
            <text x={153} y={44} textAnchor="middle" className="fill-accent text-[8px]">
              unresolved plan (gRPC)
            </text>
            <text x={153} y={86} textAnchor="middle" className="fill-viz-add text-[8px]">
              results (Arrow batches)
            </text>
            <rect width={10} height={6} rx={1} className="fill-accent">
              <animateMotion dur="2s" repeatCount="indefinite" path="M98 47 L200 47" />
            </rect>
            <rect width={14} height={6} rx={1} className="fill-viz-add">
              <animateMotion dur="2s" repeatCount="indefinite" begin="-1s" path="M200 69 L98 69" />
            </rect>
          </svg>
          <Code>{`from pyspark.sql import SparkSession
spark = SparkSession.builder.remote("sc://spark.example.com:15002").getOrCreate()
spark.read.table("sales").groupBy("city").count().show()`}</Code>
        </div>
      }
    >
      <p>
        <Term id="spark-connect">Spark Connect</Term> (Spark 3.4) splits the client from the
        cluster. Your program builds a DataFrame plan, sends it over gRPC, and gets results back as
        Arrow batches. No JVM runs on your side.
      </p>
      <p>
        That means a small client library (Spark 4.0 added a 1.5 MB <code>pyspark-client</code>),
        clients in more languages, and upgrading the server without touching every application.
      </p>
    </StepLayout>
  );
}

/* 5 ─ Which model? -------------------------------------------------------------------------------- */

export function WhichModel() {
  return (
    <StepLayout
      eyebrow="Checkpoint"
      title="Which model?"
      stage={
        <div className="flex flex-1 flex-col justify-center">
          <SortCheckpoint
            id="which-model"
            prompt="Which deployment model is each of these?"
            categories={[
              { id: "self", label: "Self-managed" },
              { id: "managed", label: "Managed cluster" },
              { id: "serverless", label: "Serverless" },
            ]}
            items={[
              {
                id: "k8s",
                label: "A platform team runs spark-submit against its own Kubernetes cluster",
                category: "self",
                why: "They run the cluster and Spark themselves.",
              },
              {
                id: "emr",
                label: "Amazon EMR on EC2, with instance types you choose",
                category: "managed",
                why: "AWS installs Spark; you size the cluster.",
              },
              {
                id: "glue",
                label: "An AWS Glue job",
                category: "serverless",
                why: "No cluster to size.",
              },
              {
                id: "msas",
                label: "Managed Service for Apache Spark serverless batch",
                category: "serverless",
                why: "Google's serverless option (formerly Dataproc Serverless).",
              },
              {
                id: "standalone",
                label: "Spark standalone on three servers in the office",
                category: "self",
                why: "Everything is yours.",
              },
              {
                id: "dbx",
                label: "An Azure Databricks cluster you configure",
                category: "managed",
                why: "Databricks runs Spark; you pick the cluster.",
              },
            ]}
            explanation="The more layers the provider takes on, the less you configure, and the less you can tune."
          />
        </div>
      }
    >
      <p>Sort the setups.</p>
    </StepLayout>
  );
}

/* 6 ─ Wrap ---------------------------------------------------------------------------------------- */

const POINTS: [string, string][] = [
  ["Three models", "Self-managed, managed clusters, serverless."],
  ["Same code everywhere", "Only the submission and settings change."],
  ["Kubernetes is mainstream", "GA since 3.1; Mesos removed in 4.0."],
  ["Spark Connect", "A thin client sends plans over gRPC."],
  ["Names change", "Managed Service for Apache Spark was Dataproc."],
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
      <p>Next: what all this costs, and how to spend less.</p>
    </StepLayout>
  );
}
