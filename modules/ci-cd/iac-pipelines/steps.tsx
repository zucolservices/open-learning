"use client";

import Link from "next/link";
import { motion } from "motion/react";
import { GitPullRequest, Moon, Rocket } from "lucide-react";
import { useSceneState } from "@/lib/module-sdk";
import { StepLayout } from "@/toolkit/layout/step-layout";
import { SortCheckpoint } from "@/toolkit/checkpoints/sort";
import { FrameCaption, Stepper } from "@/toolkit/controls/stepper";
import { Term } from "@/toolkit/glossary/term";
import { cn } from "@/lib/cn";
import { FIXES, PICK_FEEDBACK, PLAN, STAGES } from "./model";
import type { IacState } from "./state";

/* 1 ─ Review the plan ⭐ -------------------------------------------------------------------------- */

const TONE: Record<string, string> = {
  add: "text-viz-add",
  change: "text-viz-compute",
  destroy: "text-viz-remove",
  replace: "text-viz-remove",
};

export function ReviewPlan() {
  const [s, set] = useSceneState<IacState>();
  const pick = s.pick ? PICK_FEEDBACK[s.pick] : undefined;
  const found = pick?.ok;
  const fix = FIXES.find((f) => f.id === s.fix);
  return (
    <StepLayout
      eyebrow="Fix the problem"
      title="Review the plan"
      stage={
        <div className="flex flex-1 flex-col justify-center gap-3">
          <div className="border-line bg-surface flex items-center gap-2 rounded-lg border px-3 py-1.5 text-xs">
            <GitPullRequest className="text-accent size-4" />
            <span>
              <span className="font-semibold">#412 Add a CPU alarm for the payments database</span>
              <span className="text-muted"> · plan posted by the pipeline</span>
            </span>
          </div>
          <pre className="bg-surface-2 overflow-x-auto rounded-xl px-1 py-2 font-mono text-[10px] leading-[1.6]">
            {PLAN.map((l, i) =>
              l.id ? (
                <button
                  key={i}
                  type="button"
                  onClick={() => set({ pick: l.id!, fix: "" })}
                  className={cn(
                    "block w-full rounded px-2 text-left whitespace-pre",
                    l.tone ? TONE[l.tone] : "text-fg",
                    s.pick === l.id ? "bg-accent-soft ring-accent/50 ring-1" : "hover:bg-surface",
                  )}
                >
                  {l.text}
                </button>
              ) : (
                <span
                  key={i}
                  className={cn("block px-2 whitespace-pre", l.tone ? TONE[l.tone] : "text-muted")}
                >
                  {l.text || " "}
                </span>
              ),
            )}
          </pre>
          {pick && (
            <motion.div
              key={s.pick}
              initial={{ opacity: 0, y: 4 }}
              animate={{ opacity: 1, y: 0 }}
              className={cn(
                "rounded-xl border px-4 py-2 text-sm",
                pick.ok ? "border-bad/50 bg-bad/10" : "border-line bg-surface",
              )}
            >
              {pick.text}
            </motion.div>
          )}
          {found && (
            <div className="flex flex-col gap-1.5">
              <p className="text-muted text-[10px]">What do you ask the author to do?</p>
              {FIXES.map((f) => (
                <button
                  key={f.id}
                  type="button"
                  onClick={() => set({ fix: f.id })}
                  className={cn(
                    "rounded-lg border px-3 py-1.5 text-left text-xs",
                    s.fix === f.id
                      ? f.ok
                        ? "border-good bg-good/10"
                        : "border-bad/60 bg-bad/10"
                      : "border-line bg-surface hover:bg-surface-2",
                  )}
                >
                  {f.label}
                </button>
              ))}
              {fix && (
                <p className={cn("text-xs", fix.ok ? "text-good" : "text-bad")}>{fix.text}</p>
              )}
            </div>
          )}
        </div>
      }
    >
      <p>
        Servers, networks and databases can be written as code, as the Cloud Architecture
        track&apos;s{" "}
        <Link
          href="/tracks/cloud-architecture/infrastructure-as-code/"
          className="text-accent underline"
        >
          infrastructure as code
        </Link>{" "}
        module shows. Changing that code goes through a pull request and a pipeline, like any other.
      </p>
      <p>
        The key step is the <Term id="iac-plan">plan</Term>: before anything changes, Terraform (or
        OpenTofu) lists exactly what it will create, change and destroy. This pull request only
        meant to add an alarm. Read the plan and click the line that worries you.
      </p>
      <p>
        Hint: <span className="font-mono">-/+</span> means &ldquo;destroy and then create
        replacement&rdquo;, and the attribute that forces it is marked{" "}
        <span className="font-mono"># forces replacement</span>.
      </p>
    </StepLayout>
  );
}

/* 2 ─ The infrastructure pipeline ------------------------------------------------------------------ */

const WHEN = {
  pr: { icon: GitPullRequest, label: "on every pull request" },
  merge: { icon: Rocket, label: "after merge" },
  nightly: { icon: Moon, label: "every night" },
};

export function InfraPipeline() {
  const [s, set] = useSceneState<IacState>();
  const st = STAGES[s.frame];
  const W = WHEN[st.when];
  return (
    <StepLayout
      eyebrow="Step-through"
      title="The infrastructure pipeline"
      stage={
        <div className="flex flex-1 flex-col justify-center gap-3">
          <div className="flex flex-wrap gap-1.5">
            {STAGES.map((x, i) => (
              <button
                key={x.t}
                type="button"
                onClick={() => set({ frame: i })}
                className={cn(
                  "rounded-full border px-2.5 py-1 text-[11px]",
                  i === s.frame
                    ? "border-accent bg-accent-soft"
                    : i < s.frame
                      ? "border-good/50 text-good"
                      : "border-line text-muted",
                )}
              >
                {i + 1}. {x.t}
              </button>
            ))}
          </div>
          <code className="bg-surface-2 rounded-lg px-3 py-2 font-mono text-[11px]">
            $ {st.cmd}
          </code>
          <p className="text-muted flex items-center gap-1.5 text-xs">
            <W.icon className="size-3.5" /> {W.label}
          </p>
          <Stepper step={s.frame} count={STAGES.length} onChange={(frame) => set({ frame })} />
          <FrameCaption frameKey={s.frame} title={st.t}>
            {st.d}
          </FrameCaption>
        </div>
      }
    >
      <p>
        Plans are produced in the pull request and applied only after review. Policy checks, a{" "}
        <Term id="policy-as-code">policy as code</Term> step, can refuse dangerous plans
        automatically, before a person has to notice.
      </p>
      <p>
        Terraform keeps a <Term id="iac-state">state</Term> file recording what it manages. Keep it
        in a remote backend with locking, so two pipelines can&apos;t apply at once, and treat it
        and saved plan files as secret: both can hold passwords in plain text.
      </p>
      <p>
        <Term id="drift">Drift</Term> is when reality stops matching the code, usually because
        someone changed something by hand in a console. A nightly plan finds it.
      </p>
    </StepLayout>
  );
}

/* 3 ─ Every tool has a preview -------------------------------------------------------------------- */

const TOOLS: [string, string][] = [
  ["Terraform / OpenTofu", "terraform plan / tofu plan"],
  ["Pulumi (TypeScript, Python, Go…)", "pulumi preview"],
  ["AWS CloudFormation", "change sets (marks Replacement: True)"],
  ["AWS CDK", "cdk diff"],
  ["Azure Bicep / ARM", "what-if"],
  ["Google Infrastructure Manager", "preview"],
];

export function EveryTool() {
  return (
    <StepLayout
      eyebrow="Compare"
      title="Every tool has a preview"
      stage={
        <div className="flex flex-1 flex-col justify-center gap-2">
          {TOOLS.map(([t, c], i) => (
            <motion.div
              key={t}
              initial={{ opacity: 0, x: -6 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.05 * i }}
              className="border-line bg-surface grid gap-1 rounded-lg border px-3 py-2 sm:grid-cols-[15rem_1fr]"
            >
              <span className="text-sm font-semibold">{t}</span>
              <span className="text-muted font-mono text-xs">{c}</span>
            </motion.div>
          ))}
          <div className="border-line bg-surface mt-1 rounded-lg border px-3 py-2 text-xs">
            <p className="font-semibold">Pull request helpers</p>
            <p className="text-muted">
              Atlantis (open source, CNCF Sandbox), HCP Terraform, Spacelift, env0 and Terrateam run
              plans on pull requests and post them as comments. Policy engines: Open Policy Agent
              with Conftest, Sentinel, Checkov, Trivy.
            </p>
          </div>
        </div>
      }
    >
      <p>
        Whatever the tool, the habit is the same: show the change before making it, and make the
        person approving read the preview, not just the code.
      </p>
      <p>
        Some background worth knowing: Terraform moved to the Business Source License in August
        2023, which led to OpenTofu, an open-source fork now under the Linux Foundation and the
        CNCF. IBM completed its purchase of HashiCorp in February 2025.
      </p>
    </StepLayout>
  );
}

/* 4 ─ Auto-apply or careful review? --------------------------------------------------------------- */

export function AutoOrCareful() {
  return (
    <StepLayout
      eyebrow="Checkpoint"
      title="Routine or risky?"
      stage={
        <div className="flex flex-1 flex-col justify-center">
          <SortCheckpoint
            id="routine-or-risky"
            prompt="Which planned changes are routine, and which need a careful look (or a policy that blocks them)?"
            categories={[
              { id: "routine", label: "Routine" },
              { id: "risky", label: "Careful look" },
            ]}
            items={[
              {
                id: "tag",
                label: "+ add a cost-centre tag to six servers",
                category: "routine",
                why: "In-place metadata change; nothing is destroyed.",
              },
              {
                id: "count",
                label: "~ worker group size 3 → 4",
                category: "routine",
                why: "Adds capacity in place.",
              },
              {
                id: "queue",
                label: "+ create a new queue for staging",
                category: "routine",
                why: "Only creates something new.",
              },
              {
                id: "db",
                label: "-/+ production database (engine change forces replacement)",
                category: "risky",
                why: "Destroy and create replacement means losing the data unless migrated.",
              },
              {
                id: "bucket",
                label: "- destroy the backups bucket",
                category: "risky",
                why: "Deleting backups removes your safety net; a policy should demand an explicit exception.",
              },
              {
                id: "open",
                label: "~ storage access: private → public",
                category: "risky",
                why: "Exposing data to the internet is a classic breach; policy as code should block it.",
              },
            ]}
            explanation="Look for -, -/+ and anything that widens access. Adding and resizing are routine; destroying and exposing deserve a person, and often a policy that blocks them outright."
          />
        </div>
      }
    >
      <p>Train your eye on the symbols.</p>
    </StepLayout>
  );
}

/* 5 ─ Wrap ---------------------------------------------------------------------------------------- */

const POINTS: [string, string][] = [
  ["Infrastructure gets reviewed", "Same pull requests, same pipeline, same rules as code."],
  ["Read the plan", "-/+ and 'to destroy' are the lines that matter."],
  ["Apply what was reviewed", "Save the plan; apply exactly that file."],
  ["Guard the dangerous", "Policies, prevent_destroy and the provider's deletion protection."],
  ["Watch for drift", "A nightly plan catches hand-made changes."],
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
        A cautionary tale, though not a Terraform one: in May 2024 Google explained that an
        Australian pension fund&apos;s private cloud had been deleted after its operators set it up
        with an internal tool, &ldquo;leaving a parameter blank&rdquo;. The blank quietly meant
        &ldquo;delete after one year&rdquo;. Backups kept elsewhere saved the day.
      </p>
      <p>
        The lessons carry straight over: visible previews of destructive changes, no silent
        defaults, and backups outside the blast radius.
      </p>
    </StepLayout>
  );
}
