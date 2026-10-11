"use client";

import { motion } from "motion/react";
import { Bot, User } from "lucide-react";
import { useSceneState } from "@/lib/module-sdk";
import { StepLayout } from "@/toolkit/layout/step-layout";
import { WrapStep } from "@/toolkit/layout/wrap-step";
import { SortCheckpoint } from "@/toolkit/checkpoints/sort";
import { Term } from "@/toolkit/glossary/term";
import { cn } from "@/lib/cn";
import { Diff, parseDiff } from "../_shared/diff";
import { AI, DIFF, HUMAN, type Choice } from "./model";
import type { AiState } from "./state";

/* 1 ─ Story ---------------------------------------------------------------------------------------- */

export function Intern() {
  return (
    <StepLayout
      eyebrow="Story"
      title="The brilliant new intern"
      stage={
        <div className="flex flex-1 flex-col justify-center gap-2">
          {[
            [
              "Reads everything in seconds",
              "Never tired, never too busy.",
              "border-good/40 bg-good/10",
            ],
            [
              "Spots real slips",
              "A missing check, a typo, an off-by-one.",
              "border-good/40 bg-good/10",
            ],
            [
              "Doesn't know the history",
              "Why the odd rule exists, what the customer asked for.",
              "border-line bg-surface",
            ],
            [
              "Sounds equally sure when wrong",
              "Confidence isn't evidence.",
              "border-bad/40 bg-bad/10",
            ],
          ].map(([t, b, c], i) => (
            <motion.div
              key={t}
              initial={{ opacity: 0, x: -4 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1 * i }}
              className={cn("rounded-lg border px-3 py-2 text-xs", c)}
            >
              <span className="font-semibold">{t}</span>
              <span className="text-muted"> · {b}</span>
            </motion.div>
          ))}
        </div>
      }
    >
      <p>
        Imagine an intern who has read every programming book but joined the company this morning.
        They&apos;ll catch slips quickly, and they&apos;ll also suggest &ldquo;fixes&rdquo; that
        break rules nobody told them about.
      </p>
      <p>
        <Term id="ai-code-review">AI code review</Term> tools are a lot like that: a tireless,
        fallible first pass. Useful, as long as a person who knows the context still owns the
        decision.
      </p>
    </StepLayout>
  );
}

/* 2 ─ Triage ⭐ ------------------------------------------------------------------------------------ */

export function Triage() {
  const [s, set] = useSceneState<AiState>();
  const pick = (id: string, c: Choice) => set({ choices: { ...s.choices, [id]: c } });
  const good = (id: string) => {
    const c = AI.find((x) => x.id === id)!;
    return c.best === "either" || s.choices[id] === c.best;
  };
  const all = AI.every((c) => s.choices[c.id]);
  const comments: Record<number, React.ReactNode> = {};
  for (const c of AI)
    comments[c.line] = (
      <span className="flex items-start gap-1">
        <Bot className="text-viz-meta mt-px size-3 shrink-0" />
        <span>{c.text}</span>
      </span>
    );
  return (
    <StepLayout
      eyebrow="Branching scenario"
      title="Triage an AI review"
      stage={
        <div className="flex flex-1 flex-col justify-center gap-2">
          <Diff path="src/loyalty/points.ts" lines={parseDiff(DIFF)} comments={comments} />
          <div className="grid min-w-0 grid-cols-1 gap-1">
            {AI.map((c, i) => {
              const ch = s.choices[c.id];
              return (
                <div
                  key={c.id}
                  className="border-line bg-surface rounded-lg border px-3 py-1.5 text-xs"
                >
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="text-muted">AI comment {i + 1}</span>
                    <span className="min-w-0">{c.short}</span>
                    <div className="ml-auto flex gap-1">
                      {(["apply", "dismiss"] as const).map((o) => (
                        <button
                          key={o}
                          type="button"
                          aria-pressed={ch === o}
                          onClick={() => pick(c.id, o)}
                          className={cn(
                            "rounded-full border px-2 py-0.5 text-[10px] capitalize",
                            ch === o
                              ? good(c.id)
                                ? "border-good bg-good/20"
                                : "border-bad bg-bad/15"
                              : "border-line-strong text-muted",
                          )}
                        >
                          {o}
                        </button>
                      ))}
                    </div>
                  </div>
                  {ch && (
                    <p
                      className={cn("mt-0.5 text-[10px]", good(c.id) ? "text-good" : "text-muted")}
                    >
                      {ch === "apply" ? c.apply : c.dismiss}
                    </p>
                  )}
                </div>
              );
            })}
          </div>
          {all && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="grid gap-2">
              <div className="border-line-strong bg-surface-2 flex items-start gap-1.5 rounded-lg border px-3 py-2 text-xs">
                <User className="mt-px size-3.5 shrink-0" />
                <span>
                  <span className="font-semibold">Then a teammate reviews: </span>
                  {HUMAN} <span className="text-muted">The AI never mentioned it.</span>
                </span>
              </div>
              <div className="flex flex-wrap items-center gap-1 text-xs">
                <span className="text-muted mr-1">Who should approve the merge?</span>
                {(["ai", "human"] as const).map((a) => (
                  <button
                    key={a}
                    type="button"
                    aria-pressed={s.approver === a}
                    onClick={() => set({ approver: a })}
                    className={cn(
                      "rounded-full border px-3 py-1",
                      s.approver === a
                        ? a === "human"
                          ? "border-good bg-good/20"
                          : "border-bad bg-bad/15"
                        : "border-line-strong",
                    )}
                  >
                    {a === "ai" ? "The AI's approval is enough" : "A person approves"}
                  </button>
                ))}
              </div>
              {s.approver && (
                <p className={cn("text-xs", s.approver === "human" ? "text-good" : "text-muted")}>
                  {s.approver === "human"
                    ? "Right: the AI found two real bugs fast, proposed two changes that would have caused new ones, and missed the business rule entirely. A person stays accountable."
                    : "The AI would have approved code that gives gift cards points. Use it as a first pass; a person who knows the rules owns the decision."}
                </p>
              )}
            </motion.div>
          )}
        </div>
      }
    >
      <p>
        An AI reviewer left five comments on this loyalty-points change. For each, decide: apply it
        or dismiss it.
      </p>
      <p>
        You know two things the AI doesn&apos;t: the scheme gives one point per <em>full</em> ₹100
        spent, and checkout finds this function by name through a registry.
      </p>
    </StepLayout>
  );
}

/* 3 ─ The landscape -------------------------------------------------------------------------------- */

export function Landscape() {
  return (
    <StepLayout
      eyebrow="Explore"
      title="AI reviewers in 2026"
      stage={
        <div className="flex flex-1 flex-col justify-center gap-1.5">
          {[
            ["Apr 2025", "GitHub Copilot code review generally available."],
            [
              "Jun 2025",
              "GitLab Duo Code Review generally available (GitLab 18.1); its agentic Code Review Flow followed.",
            ],
            [
              "Nov 2025",
              "Amazon CodeGuru Reviewer closed to new repositories; AWS points to Amazon Q Developer.",
            ],
            [
              "Dec 2025",
              "Cursor agreed to acquire Graphite, maker of the Graphite Agent reviewer.",
            ],
            ["Sep 2026", "Copilot can approve pull requests, in preview, off by default."],
          ].map(([d, b], i) => (
            <motion.div
              key={d}
              initial={{ opacity: 0, x: -4 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.06 * i }}
              className="border-line bg-surface flex gap-3 rounded-lg border px-3 py-2 text-xs"
            >
              <span className="text-muted w-16 shrink-0 font-mono">{d}</span>
              <span>{b}</span>
            </motion.div>
          ))}
        </div>
      }
    >
      <p>
        Many options exist: GitHub Copilot, GitLab Duo, CodeRabbit, Graphite Agent, Qodo&apos;s
        open-source PR-Agent, Amazon Q Developer, Gemini Code Assist, and general coding agents run
        in CI. Most read team instructions from a file in the repository, so you can tell them your
        conventions.
      </p>
      <p>The field changes monthly; the habits in this module don&apos;t.</p>
    </StepLayout>
  );
}

/* 4 ─ Evidence ------------------------------------------------------------------------------------- */

export function Evidence() {
  return (
    <StepLayout
      eyebrow="Explore"
      title="What the studies say so far"
      stage={
        <div className="grid flex-1 content-center gap-2 sm:grid-cols-2">
          {[
            [
              "7.5%",
              "of all reviewer comments at Google were addressed by applying a machine-suggested edit (Frömmgen et al., 2024).",
            ],
            [
              "73.8%",
              "of AI review comments were marked resolved in one company's trial (Cihan et al., 2025)…",
            ],
            [
              "5h52m → 8h20m",
              "…yet average time to close a pull request went up, with complaints of irrelevant or wrong comments.",
            ],
            [
              "“Resolved” ≠ right",
              "People sometimes accept a suggestion just to make a bot go quiet.",
            ],
          ].map(([n, b], i) => (
            <motion.div
              key={n}
              initial={{ opacity: 0, y: 4 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.07 * i }}
              className="border-line bg-surface rounded-lg border px-3 py-2 text-xs"
            >
              <p className="font-mono text-sm font-semibold">{n}</p>
              <p className="text-muted">{b}</p>
            </motion.div>
          ))}
        </div>
      }
    >
      <p>
        The evidence is young and mixed. AI review clearly helps with some comments, and noisy tools
        clearly cost time. Google tuned its system to be right about half the time before showing
        suggestions, because a reviewer that cries wolf gets ignored.
      </p>
      <p>
        Measure for your own team: are real bugs caught earlier, and is review faster, or just
        busier?
      </p>
    </StepLayout>
  );
}

/* 5 ─ Checkpoint ----------------------------------------------------------------------------------- */

export function AiCheck() {
  return (
    <StepLayout
      eyebrow="Checkpoint"
      title="Good use or risky use?"
      stage={
        <div className="flex flex-1 flex-col justify-center">
          <SortCheckpoint
            id="review-ai"
            prompt="Is each way of using AI review sensible or risky?"
            categories={[
              { id: "good", label: "Sensible" },
              { id: "risky", label: "Risky" },
            ]}
            items={[
              {
                id: "first",
                label: "Let AI catch slips before a human reviews",
                category: "good",
                why: "A cheap first pass.",
              },
              {
                id: "merge",
                label: "Merge payment code on an AI approval alone",
                category: "risky",
                why: "Nobody with context is accountable.",
              },
              {
                id: "instr",
                label: "Write team conventions into the tool's instructions file",
                category: "good",
                why: "Gives it some missing context.",
              },
              {
                id: "quiet",
                label: "Apply every AI suggestion so the bot stops commenting",
                category: "risky",
                why: "Wrong suggestions become bugs.",
              },
              {
                id: "dismiss",
                label: "Dismiss a wrong AI comment with a short reason",
                category: "good",
                why: "Suggestions, not orders.",
              },
            ]}
            explanation="Treat AI comments as suggestions from a fast colleague who lacks context: act on the good ones, dismiss the wrong ones, and keep a person accountable for the merge."
          />
        </div>
      }
    >
      <p>Sort each practice.</p>
    </StepLayout>
  );
}

/* 6 ─ Wrap ----------------------------------------------------------------------------------------- */

export function Wrap() {
  return (
    <WrapStep
      points={[
        ["A fast first pass", "Catches slips in seconds."],
        ["Lacks context", "Product rules, history, hidden callers."],
        ["Confident isn't correct", "Verify before applying."],
        ["People stay accountable", "A human owns the merge."],
        ["Measure the effect", "Faster, or just busier?"],
      ]}
    >
      <p>That ends the process chapter. Next: why feeling safe matters in review.</p>
    </WrapStep>
  );
}
