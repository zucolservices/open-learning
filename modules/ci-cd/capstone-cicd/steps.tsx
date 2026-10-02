"use client";

import { motion } from "motion/react";
import { AlertTriangle, Check, CreditCard, X } from "lucide-react";
import { useSceneState } from "@/lib/module-sdk";
import { StepLayout } from "@/toolkit/layout/step-layout";
import { SortCheckpoint } from "@/toolkit/checkpoints/sort";
import { Term } from "@/toolkit/glossary/term";
import { cn } from "@/lib/cn";
import { DECISIONS, INCIDENTS, outcome, type Level, type Verdict } from "./model";
import type { CapState } from "./state";

/* 1 ─ The brief ---------------------------------------------------------------------------------- */

const NEEDS: [string, string][] = [
  ["Ship often", "Several releases a day, each small enough to understand."],
  ["Never lose a payment", "A bad change must reach as few users as possible, and be undone fast."],
  ["Stay locked down", "The pipeline can deploy to production, so it must not be anyone's way in."],
  ["Prove it", "Auditors and the regulator want evidence of who approved what."],
  ["Change the database", "The schema evolves while the app keeps running."],
];

export function Brief() {
  return (
    <StepLayout
      eyebrow="The brief"
      title="A pipeline for a payments app"
      stage={
        <div className="flex flex-1 flex-col justify-center gap-2">
          <div className="border-accent/40 bg-accent-soft flex items-center gap-3 rounded-xl border px-4 py-3">
            <CreditCard className="text-accent size-6 shrink-0" />
            <p className="text-sm">
              An illustrative Indian payments company runs a UPI payments app. India&apos;s UPI
              handled about 24 billion transactions in September 2026; this team wants its share to
              flow without a hitch. You design how code gets from a laptop to production.
            </p>
          </div>
          {NEEDS.map(([t, d], i) => (
            <motion.div
              key={t}
              initial={{ opacity: 0, x: -6 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.08 * i }}
              className="border-line bg-surface grid grid-cols-[7.5rem_1fr] gap-2 rounded-lg border px-3 py-2 text-sm"
            >
              <span className="font-semibold">{t}</span>
              <span className="text-muted">{d}</span>
            </motion.div>
          ))}
        </div>
      }
    >
      <p>
        You&apos;re the engineer who owns the delivery pipeline. Each decision in the next step
        draws on a module in this track, from branching and tests to release strategies and{" "}
        <Term id="pipeline-secret">pipeline secrets</Term>.
      </p>
      <p>
        Then eight things that really happen to pipelines. There are no marks, and you can change
        your mind as often as you like.
      </p>
    </StepLayout>
  );
}

/* 2 ─ Make the choices ⭐ ------------------------------------------------------------------------- */

const VERDICT_CLS: Record<Verdict, string> = {
  good: "text-good",
  warn: "text-accent",
  bad: "text-bad",
};

export function Choose() {
  const [s, set] = useSceneState<CapState>();
  const choices = s.choices ?? {};
  const made = DECISIONS.filter((d) => choices[d.id]).length;
  return (
    <StepLayout
      eyebrow="Design"
      title="Make the choices"
      stage={
        <div className="flex flex-1 flex-col justify-center gap-2">
          {DECISIONS.map((d) => {
            const o = d.options.find((x) => x.id === choices[d.id]);
            return (
              <div key={d.id} className="border-line bg-surface rounded-xl border px-3 py-2">
                <p className="text-xs font-semibold">
                  {d.area} <span className="text-muted font-normal">· module {d.module}</span>
                </p>
                <div className="mt-1 flex flex-wrap gap-1">
                  {d.options.map((opt) => (
                    <button
                      key={opt.id}
                      type="button"
                      onClick={() => set({ choices: { ...choices, [d.id]: opt.id } })}
                      className={cn(
                        "rounded-lg border px-2 py-1 text-left text-[11px]",
                        choices[d.id] === opt.id
                          ? "border-accent bg-accent-soft"
                          : "border-line hover:bg-surface-2",
                      )}
                    >
                      {opt.label}
                    </button>
                  ))}
                </div>
                {o && <p className={cn("mt-1 text-[10px]", VERDICT_CLS[o.verdict])}>{o.note}</p>}
              </div>
            );
          })}
          <p className="text-muted text-xs">
            {made < DECISIONS.length
              ? `${DECISIONS.length - made} decisions still open.`
              : "Every decision made. Continue to the bad day."}
          </p>
        </div>
      }
    >
      <p>
        Nine decisions, from how branches work to where the deploy credentials come from. Choose
        what you would actually ship. Some options are traps people really fall into.
      </p>
      <p>A note under each choice says what it buys you. The real test comes next.</p>
    </StepLayout>
  );
}

/* 3 ─ The bad day ⭐ ------------------------------------------------------------------------------- */

const LEVEL: Record<Level, { cls: string; icon: typeof Check; label: string }> = {
  holds: { cls: "border-good/50 bg-good/10", icon: Check, label: "Holds" },
  degrades: { cls: "border-accent/50 bg-accent-soft", icon: AlertTriangle, label: "Degrades" },
  breaks: { cls: "border-bad/60 bg-bad/10", icon: X, label: "Breaks" },
};

export function BadDay() {
  const [s, set] = useSceneState<CapState>();
  const choices = s.choices ?? {};
  const inc = INCIDENTS.find((x) => x.id === s.incident) ?? INCIDENTS[0];
  const o = outcome(inc.id, choices);
  const all = INCIDENTS.map((x) => ({ x, o: outcome(x.id, choices) }));
  return (
    <StepLayout
      eyebrow="Branching scenario"
      title="The bad day"
      stage={
        <div className="flex flex-1 flex-col justify-center gap-3">
          <div className="flex flex-wrap gap-1.5">
            {all.map(({ x, o: r }) => {
              const Icon = r ? LEVEL[r.level].icon : null;
              return (
                <button
                  key={x.id}
                  type="button"
                  onClick={() => set({ incident: x.id })}
                  className={cn(
                    "flex items-center gap-1 rounded-full border px-3 py-1 text-xs",
                    s.incident === x.id
                      ? "border-accent bg-accent-soft"
                      : "border-line hover:bg-surface-2",
                  )}
                >
                  {Icon && r && (
                    <Icon
                      className={cn(
                        "size-3",
                        r.level === "holds"
                          ? "text-good"
                          : r.level === "breaks"
                            ? "text-bad"
                            : "text-accent",
                      )}
                    />
                  )}
                  {x.name}
                </button>
              );
            })}
          </div>
          <p className="text-sm">{inc.text}</p>
          <motion.div
            key={`${inc.id}-${JSON.stringify(choices)}`}
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            className={cn(
              "rounded-xl border px-4 py-3",
              o ? LEVEL[o.level].cls : "border-line bg-surface",
            )}
          >
            {o ? (
              <>
                <p className="font-semibold">
                  {LEVEL[o.level].label}{" "}
                  <span className="text-muted text-xs font-normal">· see module {o.module}</span>
                </p>
                <p className="text-sm">{o.text}</p>
              </>
            ) : (
              <p className="text-muted text-sm">
                The decision this depends on isn&apos;t made yet. Go back a step to choose.
              </p>
            )}
          </motion.div>
        </div>
      }
    >
      <p>
        Eight things that really happen to pipelines. Pick one to see how your design copes; the
        icons show every result at a glance.
      </p>
      <p>
        Go back, change a choice, and come here again. Several incidents depend on two decisions
        together, as real ones do: in July 2024 a CrowdStrike content update went to about 8.5
        million Windows devices at once (Microsoft&apos;s estimate), and in June 2025 a policy
        change at Google Cloud replicated worldwide within seconds.
      </p>
    </StepLayout>
  );
}

/* 4 ─ What to fix first -------------------------------------------------------------------------- */

export function FixFirst() {
  return (
    <StepLayout
      eyebrow="Checkpoint"
      title="What to fix first"
      stage={
        <div className="flex flex-1 flex-col justify-center">
          <SortCheckpoint
            id="cicd-fix-first"
            prompt="A colleague's payments pipeline has these findings. Which must be fixed before launch?"
            categories={[
              { id: "now", label: "Before launch" },
              { id: "later", label: "Improve later" },
            ]}
            items={[
              {
                id: "keys",
                label: "A cloud admin key is stored as a repository secret",
                category: "now",
                why: "One leak gives months of full access. Switch to OIDC with a narrow role.",
              },
              {
                id: "push",
                label: "Anyone can push straight to main",
                category: "now",
                why: "No review, no checks, no record of approval.",
              },
              {
                id: "allatonce",
                label: "Releases go to every server at once",
                category: "now",
                why: "Every bug hits every customer; add a canary and automatic rollback.",
              },
              {
                id: "slow",
                label: "The pipeline takes 18 minutes",
                category: "later",
                why: "Worth shortening, but it isn't a safety risk.",
              },
              {
                id: "platform",
                label: "Builds run on a pricier platform than they need",
                category: "later",
                why: "A saving, not a risk.",
              },
              {
                id: "dora",
                label: "Nobody tracks the DORA measures yet",
                category: "later",
                why: "Start measuring soon, to see whether changes help.",
              },
            ]}
            explanation="Anything that lets a bad change or an attacker reach production blocks launch; speed, cost and measurement go on the improvement list."
          />
        </div>
      }
    >
      <p>Reviewing someone else&apos;s pipeline is half the job.</p>
    </StepLayout>
  );
}

/* 5 ─ The whole track ---------------------------------------------------------------------------- */

const CHAPTERS: [string, string][] = [
  ["The big picture", "Why CI/CD, version control and branching, a pipeline taken apart."],
  ["Continuous integration", "Repeatable builds and caching, tests, fast feedback, merge rules."],
  ["Artifacts and environments", "Build once, container images, environments, infrastructure."],
  ["Releasing safely", "Delivery vs deployment, release strategies, flags, migrations, rollbacks."],
  ["Securing the pipeline", "Secrets and identity, the software supply chain."],
  ["In practice", "Measuring delivery, choosing a platform, and this capstone."],
];

export function Wrap() {
  return (
    <StepLayout
      eyebrow="Wrap-up"
      title="The whole track"
      stage={
        <div className="flex flex-1 flex-col justify-center gap-1.5">
          {CHAPTERS.map(([t, d], i) => (
            <motion.div
              key={t}
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.06 * i }}
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
        That&apos;s CI/CD: twenty-one modules from a scary release weekend to a payments pipeline
        that ships several times a day and survives a bad one.
      </p>
      <p>
        The habits carry over to any platform: integrate small changes daily, let machines check
        everything mechanical, build once and promote, release to a few users first, keep a way
        back, and give the pipeline no long-lived keys worth stealing.
      </p>
    </StepLayout>
  );
}
