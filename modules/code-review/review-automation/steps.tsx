"use client";

import { motion } from "motion/react";
import { useSceneState } from "@/lib/module-sdk";
import { StepLayout } from "@/toolkit/layout/step-layout";
import { WrapStep } from "@/toolkit/layout/wrap-step";
import { OrderCheckpoint } from "@/toolkit/checkpoints/order";
import { Term } from "@/toolkit/glossary/term";
import { cn } from "@/lib/cn";
import { COMMENTS, TOOLS, type Tool } from "./model";
import type { AutoState } from "./state";

/* 1 ─ Story ---------------------------------------------------------------------------------------- */

export function Spellcheck() {
  return (
    <StepLayout
      eyebrow="Story"
      title="The editor who fixes commas"
      stage={
        <div className="grid flex-1 content-center gap-3 sm:grid-cols-2">
          {[
            [
              "Before spellcheck",
              "The editor's margin is full of typos and commas. Twenty minutes in, they haven't reached the plot.",
            ],
            [
              "After spellcheck",
              "Typos are gone before the draft arrives. The editor spends the hour on whether the story works.",
            ],
          ].map(([t, b], i) => (
            <motion.div
              key={t}
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.15 * i }}
              className={cn(
                "rounded-xl border p-3 text-xs",
                i ? "border-good/50 bg-good/10" : "border-line bg-surface",
              )}
            >
              <p className="font-semibold">{t}</p>
              <p className="text-muted">{b}</p>
            </motion.div>
          ))}
        </div>
      }
    >
      <p>
        A good editor&apos;s time is precious. Spending it on typos a spellchecker could catch is a
        waste, and it crowds out the feedback only a person can give.
      </p>
      <p>
        Code review is the same. Anything a machine can check reliably should be checked before a
        human looks: required <Term id="status-check">status checks</Term> in continuous
        integration,
        <Term id="formatter">formatters</Term>, <Term id="linter">linters</Term> and bots.
      </p>
    </StepLayout>
  );
}

/* 2 ─ Assign ⭐ ------------------------------------------------------------------------------------ */

export function Assign() {
  const [s, set] = useSceneState<AutoState>();
  const right = (id: string) => s.assigned[id] === COMMENTS.find((c) => c.id === id)!.answer;
  const human = COMMENTS.filter(
    (c) => !s.assigned[c.id] || s.assigned[c.id] === "human" || !right(c.id),
  ).length;
  const done = COMMENTS.every((c) => right(c.id));
  return (
    <StepLayout
      eyebrow="Build and connect"
      title="Hand the robot comments to robots"
      stage={
        <div className="flex flex-1 flex-col justify-center gap-2">
          <div className="border-line bg-surface-2 flex items-center gap-2 rounded-lg border px-3 py-1.5 text-xs">
            <span>Comments a human still has to write:</span>
            <span className="font-mono font-semibold">{human}</span>
            <div className="bg-line ml-auto h-1.5 w-24 overflow-hidden rounded-full">
              <motion.div
                className="bg-good h-full"
                animate={{ width: `${((8 - human) / 6) * 100}%` }}
              />
            </div>
          </div>
          {COMMENTS.map((c) => {
            const a = s.assigned[c.id];
            return (
              <div
                key={c.id}
                className="border-line bg-surface rounded-lg border px-3 py-1.5 text-xs"
              >
                <p>&ldquo;{c.text}&rdquo;</p>
                <div className="mt-1 flex flex-wrap gap-1">
                  {TOOLS.map((t) => (
                    <button
                      key={t.id}
                      type="button"
                      title={t.desc}
                      aria-pressed={a === t.id}
                      onClick={() => set({ assigned: { ...s.assigned, [c.id]: t.id as Tool } })}
                      className={cn(
                        "rounded-full border px-2 py-0.5 text-[10px]",
                        a === t.id
                          ? right(c.id)
                            ? "border-good bg-good/20"
                            : "border-bad bg-bad/15"
                          : "border-line text-muted",
                      )}
                    >
                      {t.label}
                    </button>
                  ))}
                </div>
                {a && (
                  <p className={cn("mt-0.5 text-[10px]", right(c.id) ? "text-good" : "text-muted")}>
                    {right(c.id) ? c.why : "Which check could catch this before a person reads it?"}
                  </p>
                )}
              </div>
            );
          })}
          {done && (
            <p className="text-good text-xs">
              Six of eight comments now arrive automatically, before review. The human reviewer
              writes two, both about design and meaning.
            </p>
          )}
        </div>
      }
    >
      <p>
        Here are eight comments a reviewer typed on one pull request. For each, choose the automated
        check that could have raised it first, or mark it as needing a human.
      </p>
      <p>Hover a tool to see what it does. Watch how much is left for the person.</p>
    </StepLayout>
  );
}

/* 3 ─ Make them mandatory -------------------------------------------------------------------------- */

export function Mandatory() {
  return (
    <StepLayout
      eyebrow="Explore"
      title="Make the robots mandatory"
      stage={
        <div className="flex flex-1 flex-col justify-center gap-1.5">
          {[
            ["Required status checks", "The merge button stays disabled until named CI jobs pass."],
            ["Required approvals", "At least N approvals, optionally from code owners."],
            ["Dismiss stale approvals", "A new push after approval needs a fresh look."],
            [
              "Merge queue",
              "Tests run again against the latest main before each merge, so two green changes can't combine into a red main.",
            ],
          ].map(([t, b], i) => (
            <motion.div
              key={t}
              initial={{ opacity: 0, x: -4 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.06 * i }}
              className="border-line bg-surface rounded-lg border px-3 py-2 text-xs"
            >
              <span className="font-semibold">{t}</span>
              <span className="text-muted"> · {b}</span>
            </motion.div>
          ))}
        </div>
      }
    >
      <p>
        A check nobody has to pass is a suggestion. Platforms let you require them: branch
        protection and rulesets on GitHub, &ldquo;pipelines must succeed&rdquo; and approval rules
        on GitLab, branch policies on Azure Repos and Bitbucket.
      </p>
      <p>
        A <Term id="merge-queue">merge queue</Term> adds a final safety net when many changes land
        each day.
      </p>
    </StepLayout>
  );
}

/* 4 ─ The bot toolbox ------------------------------------------------------------------------------ */

export function Toolbox() {
  return (
    <StepLayout
      eyebrow="Explore"
      title="A small toolbox of review bots"
      stage={
        <div className="grid flex-1 content-center gap-1.5 sm:grid-cols-2">
          {[
            ["Danger", "Team rules in code, run in CI, posted as a pull request comment."],
            ["reviewdog", "Turns any linter's output into inline comments, only on changed lines."],
            ["Dependabot", "GitHub's dependency updater, acquired in 2019."],
            ["Renovate", "Open-source dependency updater, now maintained by Mend; many platforms."],
            [
              "Templates",
              "Description prompts for GitHub pull requests and GitLab merge requests.",
            ],
            [
              "Analysers inline",
              "Google's review tool shows analyser findings as comments next to human ones.",
            ],
          ].map(([t, b], i) => (
            <motion.div
              key={t}
              initial={{ opacity: 0, y: 4 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.05 * i }}
              className="border-line bg-surface rounded-lg border px-3 py-2 text-xs"
            >
              <p className="font-semibold">{t}</p>
              <p className="text-muted">{b}</p>
            </motion.div>
          ))}
        </div>
      }
    >
      <p>
        One tip matters more than any tool: report only on lines the change touched. A bot that
        buries an author under hundreds of old warnings gets ignored.
      </p>
      <p>Next comes the newest kind of reviewer: AI tools that comment like a person.</p>
    </StepLayout>
  );
}

/* 5 ─ Checkpoint ----------------------------------------------------------------------------------- */

export function AutoCheck() {
  return (
    <StepLayout
      eyebrow="Checkpoint"
      title="Order the safety nets"
      stage={
        <div className="flex flex-1 flex-col justify-center">
          <OrderCheckpoint
            id="review-automation"
            prompt="Put these in the order a change meets them, earliest first."
            items={[
              { id: "fmt", label: "Formatter runs on save or before commit" },
              { id: "ci", label: "CI runs the linter and tests on the pushed branch" },
              { id: "bots", label: "Bots comment on the pull request" },
              { id: "human", label: "A human reviews design and meaning" },
              { id: "queue", label: "The merge queue re-tests against latest main" },
            ]}
            explanation="Cheapest checks first, closest to the author. By the time a person looks, only the questions that need judgement are left."
          />
        </div>
      }
    >
      <p>Drag into order.</p>
    </StepLayout>
  );
}

/* 6 ─ Wrap ----------------------------------------------------------------------------------------- */

export function Wrap() {
  return (
    <WrapStep
      points={[
        ["Robots before people", "Formatting, lint, tests, rules."],
        ["Make checks required", "Otherwise they're suggestions."],
        ["Bots for chores", "Dependencies, changelogs, templates."],
        ["Only changed lines", "Don't bury authors in old warnings."],
        ["Humans for judgement", "Design, meaning, trade-offs."],
      ]}
    >
      <p>Next: AI reviewers, and how far to trust them.</p>
    </WrapStep>
  );
}
