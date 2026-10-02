"use client";

import { motion } from "motion/react";
import { useSceneState } from "@/lib/module-sdk";
import { StepLayout } from "@/toolkit/layout/step-layout";
import { SortCheckpoint } from "@/toolkit/checkpoints/sort";
import { Term } from "@/toolkit/glossary/term";
import { cn } from "@/lib/cn";
import { EC2, PLATFORMS, monthlyCost, selfHosted } from "./prices";
import type { PlatformState } from "./state";

/* 1 ─ The landscape ------------------------------------------------------------------------------- */

const GROUPS: { t: string; d: string; items: [string, string][] }[] = [
  {
    t: "Built into where the code lives",
    d: "Pipelines next to pull requests, issues and permissions. The default choice for most teams.",
    items: [
      ["GitHub Actions", "workflows in .github/workflows; a huge marketplace of actions"],
      ["GitLab CI/CD", "one product from repository to deployment; self-managed option"],
      ["Azure Pipelines", "part of Azure DevOps; also builds code hosted on GitHub"],
      ["Bitbucket Pipelines", "for teams on Atlassian's Jira and Bitbucket"],
    ],
  },
  {
    t: "Specialist CI services",
    d: "Focus on speed, scale and flexibility, whatever the code host.",
    items: [
      ["CircleCI", "hosted, credit-priced, strong macOS and test insights"],
      ["Buildkite", "hosted control plane; agents on your machines or theirs"],
      ["Jenkins", "the open-source veteran: you run it, plugins for everything"],
    ],
  },
  {
    t: "Cloud and Kubernetes native",
    d: "Close to where you deploy, billed with the rest of the cloud.",
    items: [
      ["AWS CodeBuild + CodePipeline", "buildspec.yml; IAM roles instead of keys"],
      ["Google Cloud Build", "cloudbuild.yaml; every step is a container"],
      ["Tekton · Argo Workflows", "pipelines as Kubernetes resources"],
    ],
  },
];

export function Landscape() {
  return (
    <StepLayout
      eyebrow="Infographic"
      title="The landscape"
      stage={
        <div className="flex flex-1 flex-col justify-center gap-3">
          {GROUPS.map((g, i) => (
            <motion.div
              key={g.t}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.12 * i }}
              className="border-line bg-surface rounded-xl border px-4 py-3"
            >
              <p className="text-sm font-semibold">{g.t}</p>
              <p className="text-muted text-xs">{g.d}</p>
              <div className="mt-2 grid gap-1 sm:grid-cols-2">
                {g.items.map(([n, d]) => (
                  <p key={n} className="text-xs">
                    <span className="font-medium">{n}</span>
                    <span className="text-muted"> · {d}</span>
                  </p>
                ))}
              </div>
            </motion.div>
          ))}
        </div>
      }
    >
      <p>
        Every platform has the skeleton from module 3: a pipeline file, triggers, jobs, steps and
        runners. They differ in where your code lives, who runs the machines, and how you pay.
      </p>
      <p>
        In JetBrains&apos; 2025 developer survey, the most used in organisations were GitHub Actions
        (33%), Jenkins (28%) and GitLab CI (19%). The usual rule of thumb: start with the CI built
        into your code host, and move only for a clear reason.
      </p>
    </StepLayout>
  );
}

/* 2 ─ Price a month of builds ⭐ ------------------------------------------------------------------ */

export function PriceMonth() {
  const [s, set] = useSceneState<PlatformState>();
  const rows = PLATFORMS.map((p) => ({ p, cost: monthlyCost(p, s.linux, s.mac) }));
  const sh = selfHosted(s.linux);
  const max = Math.max(sh.cost, ...rows.map((r) => r.cost ?? 0), 1);
  return (
    <StepLayout
      eyebrow="Simulation"
      title="Price a month of builds"
      stage={
        <div className="flex flex-1 flex-col justify-center gap-3">
          <label className="grid grid-cols-[8rem_1fr_4.5rem] items-center gap-2 text-xs">
            <span>Linux minutes</span>
            <input
              type="range"
              min={0}
              max={60000}
              step={1000}
              value={s.linux}
              onChange={(e) => set({ linux: Number(e.target.value) })}
              className="accent-accent"
              aria-label="Linux minutes"
            />
            <span className="text-right font-mono">{s.linux.toLocaleString("en-IN")}</span>
          </label>
          <label className="grid grid-cols-[8rem_1fr_4.5rem] items-center gap-2 text-xs">
            <span>macOS minutes</span>
            <input
              type="range"
              min={0}
              max={5000}
              step={250}
              value={s.mac}
              onChange={(e) => set({ mac: Number(e.target.value) })}
              className="accent-accent"
              aria-label="macOS minutes"
            />
            <span className="text-right font-mono">{s.mac.toLocaleString("en-IN")}</span>
          </label>
          <div className="flex flex-col gap-1.5">
            {rows.map(({ p, cost }) => (
              <div key={p.id} className="grid grid-cols-[8rem_1fr_4.5rem] items-center gap-2">
                <span className="text-xs">
                  {p.name}
                  <span className="text-muted block text-[9px]">{p.plan}</span>
                </span>
                <div className="bg-surface-2 h-4 overflow-hidden rounded">
                  {cost !== null && (
                    <motion.div
                      animate={{ width: `${(cost / max) * 100}%` }}
                      className="bg-accent/60 h-full rounded"
                    />
                  )}
                </div>
                <span className={cn("text-right font-mono text-xs", cost === null && "text-muted")}>
                  {cost === null ? "no macOS" : `$${Math.round(cost).toLocaleString("en-IN")}`}
                </span>
              </div>
            ))}
            <div className="grid grid-cols-[8rem_1fr_4.5rem] items-center gap-2">
              <span className="text-xs">
                Self-hosted on EC2
                <span className="text-muted block text-[9px]">
                  {sh.machines} × {EC2.instance}, always on
                </span>
              </span>
              <div className="bg-surface-2 h-4 overflow-hidden rounded">
                <motion.div
                  animate={{ width: `${(sh.cost / max) * 100}%` }}
                  className="bg-viz-compute/60 h-full rounded"
                />
              </div>
              <span className="text-right font-mono text-xs">${Math.round(sh.cost)}+</span>
            </div>
          </div>
          <p className="text-muted text-[10px]">
            US list prices, 3 October 2026, compute only (seat prices excluded). Self-hosted assumes
            Linux only, machines busy half the time, and leaves out the people who run them. Azure
            Pipelines is priced per parallel job instead ($40 a month each, hosted).
          </p>
        </div>
      }
    >
      <p>
        <Term id="hosted-runner">Hosted runners</Term> are billed by the minute; the platform owns
        the machines. With <Term id="self-hosted-runner">self-hosted runners</Term> you pay for your
        own servers, all the time, plus the people who patch, secure and scale them.
      </p>
      <p>
        Slide the minutes. For ordinary Linux builds the big hosted platforms land close together;
        macOS changes everything, because Mac machines cost ten to twenty times as much per minute.
        Self-hosting looks cheap on the bill, which is exactly what makes its hidden costs easy to
        forget.
      </p>
    </StepLayout>
  );
}

/* 3 ─ Pick for the team --------------------------------------------------------------------------- */

export function PickForTeam() {
  return (
    <StepLayout
      eyebrow="Checkpoint"
      title="Pick for the team"
      stage={
        <div className="flex flex-1 flex-col justify-center">
          <SortCheckpoint
            id="pick-for-team"
            prompt="What fits each team best?"
            categories={[
              { id: "host", label: "CI of the code host, hosted runners" },
              { id: "self", label: "Self-hosted runners" },
            ]}
            items={[
              {
                id: "startup",
                label: "Eight developers, code on GitHub, deploying to a cloud",
                category: "host",
                why: "GitHub Actions on hosted runners: nothing to run, pipelines beside the pull requests.",
              },
              {
                id: "ios",
                label: "A mobile team needing macOS builds a few times a day",
                category: "host",
                why: "Hosted macOS runners avoid buying and maintaining Mac hardware for occasional use.",
              },
              {
                id: "gitlab",
                label: "A team already on GitLab for issues and code review",
                category: "host",
                why: "GitLab CI/CD keeps everything in one place.",
              },
              {
                id: "bank",
                label: "A bank whose builds must run inside its own network",
                category: "self",
                why: "Self-hosted runners (or a self-managed CI server) keep code and secrets inside.",
              },
              {
                id: "gpu",
                label: "Builds that need special hardware, such as GPUs",
                category: "self",
                why: "Your own machines with the hardware attached, ideally single-use and autoscaled.",
              },
              {
                id: "huge",
                label:
                  "Hundreds of thousands of build minutes a month, with a platform team to run them",
                category: "self",
                why: "At that scale, autoscaled self-hosted runners (for example on Kubernetes) can pay off.",
              },
            ]}
            explanation="Hosted runners are the sensible default. Self-host for network rules, special hardware or very large scale, and then make the runners single-use and autoscaled."
          />
        </div>
      }
    >
      <p>
        Choose by constraints first (where the code lives, network rules, hardware), then by cost.
      </p>
    </StepLayout>
  );
}

/* 4 ─ Wrap ---------------------------------------------------------------------------------------- */

const POINTS: [string, string][] = [
  ["Same skeleton everywhere", "File, triggers, jobs, steps, runners."],
  ["Default to your code host", "GitHub, GitLab, Azure or Bitbucket's own CI."],
  ["Hosted first", "Self-host for network, hardware or scale, and make runners single-use."],
  ["Mind macOS", "Many times the price of Linux per minute."],
  ["Prices move", "Check the vendor page; these were read on 3 October 2026."],
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
      <p>
        Two signs of a moving market: GitHub cut its hosted-runner prices at the start of 2026 and
        then postponed a planned charge for self-hosted runners; Earthly, a popular build tool,
        stopped maintaining its open-source project in 2025. Tools such as Dagger let you write a
        pipeline once in a normal programming language and run it on any CI.
      </p>
      <p>Last: the capstone, where every module in this track meets one payments app.</p>
    </StepLayout>
  );
}
