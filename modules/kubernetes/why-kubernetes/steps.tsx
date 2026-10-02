"use client";

import { motion } from "motion/react";
import { Check, Moon, RotateCcw, User, X } from "lucide-react";
import { useSceneState } from "@/lib/module-sdk";
import { StepLayout } from "@/toolkit/layout/step-layout";
import { SortCheckpoint } from "@/toolkit/checkpoints/sort";
import { Term } from "@/toolkit/glossary/term";
import { cn } from "@/lib/cn";
import { HAPPENINGS } from "./model";
import type { WhyState } from "./state";

/* 2 ─ Who does the work? ⭐ ------------------------------------------------------------------------ */

export function WhoWorks() {
  const [s, set] = useSceneState<WhyState>();
  const happened = s.happened ?? [];
  const list = happened
    .map((id) => HAPPENINGS.find((h) => h.id === id)!)
    .filter(Boolean)
    .reverse();
  const manualSteps = list.reduce((n, h) => n + h.manual.length, 0);
  const yourSteps = list.reduce((n, h) => n + h.cluster.you.filter((x) => x !== "Sleep").length, 0);
  return (
    <StepLayout
      eyebrow="Simulation"
      title="Who does the work?"
      stage={
        <div className="flex flex-1 flex-col justify-center gap-3">
          <div className="flex flex-wrap gap-1.5">
            {HAPPENINGS.map((h) => (
              <button
                key={h.id}
                type="button"
                onClick={() => set({ happened: [...happened, h.id] })}
                className="border-line hover:bg-surface-2 rounded-full border px-3 py-1 text-xs"
              >
                {h.name}
              </button>
            ))}
            {happened.length > 0 && (
              <button
                type="button"
                onClick={() => set({ happened: [] })}
                className="text-muted flex items-center gap-1 rounded-full px-2 py-1 text-xs"
              >
                <RotateCcw className="size-3" /> Reset
              </button>
            )}
          </div>
          <div className="grid gap-3 sm:grid-cols-2">
            {(["manual", "cluster"] as const).map((side) => (
              <div
                key={side}
                className={cn(
                  "rounded-xl border px-3 py-2",
                  side === "manual" ? "border-line bg-surface" : "border-accent/50 bg-accent-soft",
                )}
              >
                <div className="mb-1 flex items-baseline justify-between">
                  <p className="text-sm font-semibold">
                    {side === "manual" ? "By hand" : "With Kubernetes"}
                  </p>
                  <p className="text-muted font-mono text-[10px]">
                    {side === "manual" ? `${manualSteps} steps for you` : `${yourSteps} for you`}
                  </p>
                </div>
                <div className="flex max-h-72 flex-col gap-1.5 overflow-y-auto">
                  {list.length === 0 && (
                    <p className="text-muted text-xs">Pick something that happens to the app.</p>
                  )}
                  {list.map((h, i) => (
                    <motion.div
                      key={`${h.id}-${i}`}
                      initial={{ opacity: 0, y: 4 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="text-xs"
                    >
                      <p className="font-semibold">{h.name}</p>
                      {side === "manual" ? (
                        <ul className="mt-0.5 flex flex-col gap-0.5">
                          {h.manual.map((m) => (
                            <li key={m} className="flex items-start gap-1.5">
                              <User className="text-muted mt-0.5 size-3 shrink-0" />
                              {m}
                            </li>
                          ))}
                        </ul>
                      ) : (
                        <ul className="mt-0.5 flex flex-col gap-0.5">
                          {h.cluster.you.map((m) => (
                            <li key={m} className="flex items-start gap-1.5">
                              {m === "Sleep" ? (
                                <Moon className="text-accent mt-0.5 size-3 shrink-0" />
                              ) : (
                                <User className="text-accent mt-0.5 size-3 shrink-0" />
                              )}
                              {m}
                            </li>
                          ))}
                          {h.cluster.it.map((m) => (
                            <li key={m} className="text-muted flex items-start gap-1.5">
                              <Check className="text-good mt-0.5 size-3 shrink-0" />
                              {m}
                            </li>
                          ))}
                        </ul>
                      )}
                    </motion.div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      }
    >
      <p>
        Throw a normal week at the app: a release, a dead server, a traffic spike, a bad version.
        Compare what you do by hand with what you do when a cluster keeps the{" "}
        <Term id="desired-state">desired state</Term> for you.
      </p>
      <p>
        Kubernetes doesn&apos;t make the work disappear: someone still writes the configuration and
        runs the cluster. But the repetitive, middle-of-the-night work moves from people to software
        that never sleeps. (The steps are illustrative.)
      </p>
    </StepLayout>
  );
}

/* 3 ─ What it is, and isn't --------------------------------------------------------------------- */

const IS: string[] = [
  "Restarts and replaces failed containers",
  "Rolls out new versions gradually, and rolls back",
  "Places containers on machines with room (bin packing)",
  "Gives groups of containers stable names and load balancing",
  "Scales copies up and down",
];

const ISNT: string[] = [
  "A complete platform that builds and deploys your code: CI/CD is up to you",
  "A database, message queue or cache: you run those on it, or beside it",
  "Your logging, monitoring and alerting: you choose those tools",
  "A way to manage the machines underneath: someone patches the nodes",
];

export function IsIsnt() {
  return (
    <StepLayout
      eyebrow="Explore"
      title="What it is, and isn't"
      stage={
        <div className="flex flex-1 flex-col justify-center gap-3">
          <blockquote className="border-accent bg-accent-soft rounded-xl border-l-4 px-4 py-3 text-sm">
            &ldquo;Kubernetes is a portable, extensible, open source platform for managing
            containerized workloads and services that facilitate both declarative configuration and
            automation.&rdquo;
            <span className="text-muted mt-1 block text-xs">kubernetes.io</span>
          </blockquote>
          <div className="grid gap-3 sm:grid-cols-2">
            {[
              ["It does", IS, true],
              ["It doesn't", ISNT, false],
            ].map(([t, items, ok]) => (
              <div key={t as string} className="border-line bg-surface rounded-xl border px-3 py-2">
                <p className="mb-1 text-sm font-semibold">{t as string}</p>
                <ul className="flex flex-col gap-1 text-xs">
                  {(items as string[]).map((x, i) => (
                    <motion.li
                      key={x}
                      initial={{ opacity: 0, x: -4 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.05 * i }}
                      className="flex items-start gap-1.5"
                    >
                      {ok ? (
                        <Check className="text-good mt-0.5 size-3 shrink-0" />
                      ) : (
                        <X className="text-muted mt-0.5 size-3 shrink-0" />
                      )}
                      {x}
                    </motion.li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      }
    >
      <p>
        Kubernetes&apos; own documentation is careful to say what it leaves to you. It is &ldquo;not
        a traditional, all-inclusive PaaS&rdquo; (platform as a service): it gives you building
        blocks, and you, or your cloud provider, assemble the rest.
      </p>
      <p>
        That&apos;s why teams often build an internal platform on top of it, and why managed
        services (module 22) exist to run the hard parts for you.
      </p>
    </StepLayout>
  );
}

/* 4 ─ Worth it? ---------------------------------------------------------------------------------- */

export function WorthIt() {
  return (
    <StepLayout
      eyebrow="Checkpoint"
      title="Worth it?"
      stage={
        <div className="flex flex-1 flex-col justify-center">
          <SortCheckpoint
            id="worth-it"
            prompt="Kubernetes, or a simpler container service?"
            categories={[
              { id: "k8s", label: "Kubernetes earns its keep" },
              { id: "simple", label: "Something simpler is enough" },
            ]}
            items={[
              {
                id: "site",
                label: "One small web app with steady traffic and a two-person team",
                category: "simple",
                why: "A serverless container service (Cloud Run, Azure Container Apps, Amazon ECS with Fargate) runs it with far less to manage.",
              },
              {
                id: "many",
                label: "Forty services from twelve teams, on two clouds and in a data centre",
                category: "k8s",
                why: "One consistent platform and API everywhere is exactly what Kubernetes offers.",
              },
              {
                id: "nightly",
                label: "A script that runs once a night",
                category: "simple",
                why: "A scheduled job on a managed service, or a small VM, is plenty.",
              },
              {
                id: "razorpay",
                label: "A payments platform on thousands of nodes with strict compliance rules",
                category: "k8s",
                why: "Razorpay runs 7,000+ Kubernetes nodes and enforces rules as code across them (CNCF case study, 2026).",
              },
              {
                id: "gpu",
                label: "Many teams sharing a pool of GPUs for training and serving models",
                category: "k8s",
                why: "Scheduling, quotas and isolation across shared hardware are Kubernetes' strengths.",
              },
              {
                id: "mvp",
                label: "A startup's first version, built by two engineers in a month",
                category: "simple",
                why: "Ship first. Move to Kubernetes when the scale or the number of services justifies it.",
              },
            ]}
            explanation="Kubernetes pays off with many services, many teams, many machines or many environments. For one small app, its power is mostly cost and complexity."
          />
        </div>
      }
    >
      <p>
        Kubernetes is powerful and has a real cost: people who understand it, and a cluster to run.
        Which of these needs it?
      </p>
    </StepLayout>
  );
}

/* 5 ─ Wrap --------------------------------------------------------------------------------------- */

const TAKEAWAYS: [string, string][] = [
  ["Containers package", "The same image runs the same way everywhere."],
  ["Kubernetes runs them", "Placing, restarting, scaling, rolling out and connecting containers."],
  ["You declare, it reconciles", "Write what you want; the cluster keeps making it true."],
  ["Not always worth it", "For a small app, a serverless container service is simpler."],
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
      <p>Next: desired state and the control loops that keep it.</p>
    </StepLayout>
  );
}
