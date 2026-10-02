"use client";

import { motion } from "motion/react";
import { HeartHandshake } from "lucide-react";
import { useSceneState } from "@/lib/module-sdk";
import { StepLayout } from "@/toolkit/layout/step-layout";
import { SortCheckpoint } from "@/toolkit/checkpoints/sort";
import { FrameCaption, Stepper } from "@/toolkit/controls/stepper";
import { Term } from "@/toolkit/glossary/term";
import { cn } from "@/lib/cn";
import type { OpState } from "./state";

/* 1 ─ A specialist on staff ---------------------------------------------------------------------- */

export function Specialist() {
  return (
    <StepLayout
      eyebrow="Analogy"
      title="A specialist on staff"
      stage={
        <div className="grid flex-1 content-center gap-3 sm:grid-cols-2">
          {[
            [
              "The general ward",
              "Nurses follow the same routines for every patient: check, medicate, record. Reliable, but they don't know how to run a dialysis machine.",
              "Built-in controllers",
            ],
            [
              "A specialist",
              "A dialysis technician knows the machine's quirks, its maintenance schedule and what to do when an alarm goes off at 3 a.m.",
              "An operator",
            ],
          ].map(([t, d, k], i) => (
            <motion.div
              key={t}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.15 * i }}
              className={cn(
                "flex flex-col gap-2 rounded-xl border px-4 py-4",
                i === 1 ? "border-accent/50 bg-accent-soft" : "border-line bg-surface",
              )}
            >
              <HeartHandshake className="text-accent size-5" />
              <p className="font-semibold">{t}</p>
              <p className="text-muted text-sm">{d}</p>
              <p className="mt-auto font-mono text-xs">{k}</p>
            </motion.div>
          ))}
        </div>
      }
    >
      <p>
        A Deployment knows how to keep pods running. It doesn&apos;t know how to promote a database
        replica, take a consistent backup or upgrade a cluster without losing writes. That knowledge
        usually lives in a human operator&apos;s head.
      </p>
      <p>
        Kubernetes lets you add both a new word and a specialist that understands it: a{" "}
        <Term id="custom-resource">custom resource</Term> and an <Term id="operator">operator</Term>
        .
      </p>
    </StepLayout>
  );
}

/* 2 ─ Teach the cluster a new word ⭐ --------------------------------------------------------------- */

interface F {
  title: string;
  text: string;
  yaml: string;
  objects: { name: string; note: string; tone?: "good" | "bad" | "new" }[];
  tone?: "good" | "bad";
}

const PG = (instances: number, version: number, status: string) => `apiVersion: example.com/v1
kind: PostgresCluster
metadata: { name: orders-db }
spec:
  instances: ${instances}
  postgresVersion: ${version}
  backups: { schedule: "0 2 * * *" }
status: ${status}`;

const FRAMES: F[] = [
  {
    title: "An unknown word",
    text: "Apply a PostgresCluster to a plain cluster and the API server refuses: it has never heard of the kind.",
    yaml: PG(3, 16, "—"),
    objects: [
      {
        name: "error",
        note: 'no matches for kind "PostgresCluster" in version "example.com/v1"',
        tone: "bad",
      },
    ],
    tone: "bad",
  },
  {
    title: "Install the CRD",
    text: "A CustomResourceDefinition teaches the API server the new kind and its schema. Now it's accepted and stored, and kubectl get postgresclusters works. But nothing happens: there's no controller acting on it.",
    yaml: PG(3, 16, "(empty)"),
    objects: [{ name: "PostgresCluster/orders-db", note: "stored, nothing else" }],
  },
  {
    title: "Install the operator",
    text: "The operator is a controller, usually a Deployment in its own namespace, that watches PostgresClusters. It creates everything a production database needs, owned by the custom resource.",
    yaml: PG(3, 16, "{ ready: 3/3, primary: orders-db-1 }"),
    objects: [
      { name: "StatefulSet orders-db", note: "3 pods, one disk each", tone: "new" },
      { name: "Service orders-db-rw", note: "always points at the primary", tone: "new" },
      { name: "Service orders-db-ro", note: "the replicas, for reads", tone: "new" },
      { name: "Secret orders-db-app", note: "generated credentials", tone: "new" },
      { name: "backup schedule", note: "daily at 02:00", tone: "new" },
    ],
    tone: "good",
  },
  {
    title: "The primary dies",
    text: "Its pod is deleted. A StatefulSet would just recreate it; this operator also promotes the most up-to-date replica and moves the read-write Service to it, the job a database administrator used to be paged for.",
    yaml: PG(3, 16, "{ ready: 2/3, primary: orders-db-2 }"),
    objects: [
      { name: "orders-db-1", note: "deleted, being recreated as a replica", tone: "bad" },
      { name: "orders-db-2", note: "promoted to primary", tone: "good" },
      { name: "Service orders-db-rw", note: "now points at orders-db-2" },
    ],
  },
  {
    title: "Change one line to upgrade",
    text: "Change postgresVersion to 17. The operator upgrades the replicas first, then switches the primary over, following the database's own upgrade procedure.",
    yaml: PG(3, 17, "{ ready: 3/3, upgrading: replicas done }"),
    objects: [
      { name: "orders-db-1, orders-db-3", note: "upgraded to 17", tone: "good" },
      { name: "orders-db-2", note: "switchover, then upgraded" },
    ],
  },
  {
    title: "Delete it",
    text: "A finalizer makes Kubernetes wait while the operator cleans up (here, a last backup). Then everything the custom resource owns is garbage-collected through owner references.",
    yaml: PG(3, 17, "{ deleting: final backup }"),
    objects: [
      { name: "finalizer", note: "example.com/final-backup: waiting" },
      { name: "owned objects", note: "deleted after the finalizer clears" },
    ],
    tone: "good",
  },
];

export function NewWord() {
  const [s, set] = useSceneState<OpState>();
  const f = FRAMES[s.frame] ?? FRAMES[0];
  return (
    <StepLayout
      eyebrow="Step through"
      title="Teach the cluster a new word"
      stage={
        <div className="flex flex-1 flex-col justify-center gap-3">
          <div className="grid gap-2 sm:grid-cols-2">
            <pre className="border-line bg-surface overflow-x-auto rounded-lg border px-3 py-2 font-mono text-[10px] leading-relaxed">
              {f.yaml}
            </pre>
            <div className="flex flex-col gap-1">
              {f.objects.map((o, i) => (
                <motion.div
                  key={`${s.frame}-${o.name}`}
                  initial={{ opacity: 0, x: 6 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.06 * i }}
                  className={cn(
                    "rounded-md border px-2 py-1",
                    o.tone === "bad"
                      ? "border-bad/60 bg-bad/10"
                      : o.tone === "good"
                        ? "border-good/60 bg-good/10"
                        : o.tone === "new"
                          ? "border-accent/60 bg-accent-soft"
                          : "border-line bg-surface",
                  )}
                >
                  <p className="font-mono text-[10px] font-semibold">{o.name}</p>
                  <p className="text-muted text-[10px]">{o.note}</p>
                </motion.div>
              ))}
            </div>
          </div>
          <FrameCaption frameKey={s.frame} title={f.title} tone={f.tone}>
            {f.text}
          </FrameCaption>
          <Stepper step={s.frame} count={FRAMES.length} onChange={(n) => set({ frame: n })} />
        </div>
      }
    >
      <p>
        &ldquo;A custom resource is an extension of the Kubernetes API that is not necessarily
        available in a default Kubernetes installation.&rdquo; &ldquo;Operators are software
        extensions to Kubernetes that make use of custom resources to manage applications and their
        components. Operators follow Kubernetes principles, notably the control loop.&rdquo;
      </p>
      <p>
        Step through an imaginary PostgreSQL operator. Real ones, such as CloudNativePG, work along
        these lines. The idea came from CoreOS in 2016: put operational knowledge into software.
      </p>
    </StepLayout>
  );
}

/* 3 ─ Operators in the wild ---------------------------------------------------------------------- */

const LEVELS = [
  "Basic Install",
  "Seamless Upgrades",
  "Full Lifecycle",
  "Deep Insights",
  "Auto Pilot",
];

const WILD: [string, string][] = [
  [
    "cert-manager",
    "Certificates from Let's Encrypt and others, renewed automatically. CNCF graduated.",
  ],
  ["CloudNativePG", "PostgreSQL clusters with failover and backups. CNCF sandbox since 2025."],
  ["Strimzi", "Apache Kafka on Kubernetes. CNCF incubating."],
  ["Prometheus Operator", "Prometheus and Alertmanager configured through custom resources."],
  [
    "Crossplane",
    "Cloud resources (databases, buckets, networks) declared as Kubernetes objects. CNCF graduated in 2025.",
  ],
];

export function InTheWild() {
  return (
    <StepLayout
      eyebrow="Explore"
      title="Operators in the wild"
      stage={
        <div className="flex flex-1 flex-col justify-center gap-3">
          <div className="grid gap-1.5 sm:grid-cols-2">
            {WILD.map(([t, d], i) => (
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
          <div>
            <p className="text-muted mb-1 text-[10px]">
              Operator capability levels (Operator Framework)
            </p>
            <div className="flex items-end gap-1">
              {LEVELS.map((l, i) => (
                <motion.div
                  key={l}
                  initial={{ height: 0 }}
                  animate={{ height: 24 + i * 14 }}
                  transition={{ delay: 0.08 * i }}
                  className="border-accent/60 bg-accent-soft flex flex-1 items-end justify-center rounded-t border px-1 pb-1 text-center text-[9px]"
                >
                  {i + 1}. {l}
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      }
    >
      <p>
        Operators are usually built with Kubebuilder or the Operator SDK on top of
        controller-runtime (Go), or with frameworks for Java, Python, Rust and .NET; OperatorHub.io
        lists many.
      </p>
      <p>
        Judge an operator before trusting it with data: how far up the capability ladder it really
        goes, who maintains it, and how much access it needs, often wide. If nobody on the team can
        run the database behind it, a managed database service may be the simpler choice.
      </p>
    </StepLayout>
  );
}

/* 4 ─ Built-in, operator or managed? ------------------------------------------------------------- */

export function WhichApproach() {
  return (
    <StepLayout
      eyebrow="Checkpoint"
      title="Built-in, operator or managed?"
      stage={
        <div className="flex flex-1 flex-col justify-center">
          <SortCheckpoint
            id="which-approach"
            prompt="What's the best fit for each need?"
            categories={[
              { id: "builtin", label: "Built-in resources" },
              { id: "operator", label: "An operator" },
              { id: "managed", label: "A managed service" },
            ]}
            items={[
              {
                id: "web",
                label: "A stateless web app",
                category: "builtin",
                why: "A Deployment and a Service are all it needs.",
              },
              {
                id: "pg",
                label:
                  "Self-hosted PostgreSQL with failover and backups, run by a team that knows Postgres",
                category: "operator",
                why: "An operator such as CloudNativePG automates the day-to-day.",
              },
              {
                id: "certs",
                label: "TLS certificates renewed automatically",
                category: "operator",
                why: "cert-manager is the standard.",
              },
              {
                id: "report",
                label: "A nightly report job",
                category: "builtin",
                why: "A CronJob.",
              },
              {
                id: "kafka",
                label: "Kafka inside the cluster",
                category: "operator",
                why: "Strimzi manages brokers, topics and users.",
              },
              {
                id: "small",
                label: "A small team needs a database and nobody wants to run one",
                category: "managed",
                why: "A cloud database service takes the operations off your hands.",
              },
            ]}
            explanation="Built-in resources for ordinary apps, operators for complex software you choose to run yourself, managed services when you'd rather not run it at all."
          />
        </div>
      }
    >
      <p>Six needs. Which approach fits each?</p>
    </StepLayout>
  );
}

/* 5 ─ Wrap --------------------------------------------------------------------------------------- */

const TAKEAWAYS: [string, string][] = [
  ["CRDs add words", "New kinds in the API, validated by a schema."],
  ["Operators add know-how", "A controller that reconciles the custom resource."],
  ["Same loop as everything else", "Watch, compare, act: like Deployments, but specialised."],
  ["Choose carefully", "Maturity, maintainers and permissions vary; managed may be simpler."],
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
      <p>Next: managed Kubernetes, and what a cluster really costs.</p>
    </StepLayout>
  );
}
