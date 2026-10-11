"use client";

import { useMemo } from "react";
import { motion } from "motion/react";
import { Check, CircleAlert, ShieldCheck, X } from "lucide-react";
import { useSceneState } from "@/lib/module-sdk";
import { StepLayout } from "@/toolkit/layout/step-layout";
import { WrapStep } from "@/toolkit/layout/wrap-step";
import { OrderCheckpoint } from "@/toolkit/checkpoints/order";
import { Term } from "@/toolkit/glossary/term";
import { cn } from "@/lib/cn";
import { CommitGraph } from "../_shared/graph";
import {
  CHECKLIST,
  FINDS,
  FIXES,
  GUARDS,
  INCIDENTS,
  SITUATIONS,
  applyFix,
  incidentStatus,
  monday,
  type Guard,
  type Kind,
} from "./model";
import type { CapState } from "./state";

const MONDAY = monday();

/* 1 ─ Story ---------------------------------------------------------------------------------------- */

export function MondayStory() {
  const m = MONDAY;
  return (
    <StepLayout
      eyebrow="Story"
      title="Monday morning"
      stage={
        <div className="flex flex-1 flex-col justify-center gap-3">
          <CommitGraph repo={m.repo} highlight={m.lost} />
          <div className="border-bad/40 bg-bad/10 rounded-lg border px-3 py-2 text-xs">
            <p className="font-semibold">#team-cafe · 09:12</p>
            <p className="text-muted">
              “Where did the order form go? And the price fix? main only has dark mode on it now.”
            </p>
          </div>
        </div>
      }
    >
      <p>
        A small team builds the website for a café. On Friday, three teammates merged an order form,
        a price fix and opening hours into main. Over the weekend Sam, working from a clone last
        updated on Thursday, hit a rejected push and ran <code>git push --force</code>.
      </p>
      <p>
        The three commits (faded) are no longer reachable from main. You&apos;ll use everything from
        this track to get them back, tidy up, and set rules so it can&apos;t happen again.
      </p>
    </StepLayout>
  );
}

/* 2 ─ Rescue ⭐ -------------------------------------------------------------------------------------- */

export function Rescue() {
  const [s, set] = useSceneState<CapState>();
  const m = MONDAY;
  const found = FINDS.find((f) => f.id === s.find);
  const fix = FIXES.find((f) => f.id === s.fix);
  const repo = useMemo(() => applyFix(m, found?.good ? s.fix : null), [m, found, s.fix]);
  return (
    <StepLayout
      eyebrow="Build"
      title="Rescue the lost work"
      stage={
        <div className="flex flex-1 flex-col justify-center gap-3">
          <CommitGraph repo={repo} highlight={s.fix === "force" ? [m.samTip] : m.lost} />
          <div className="grid gap-1.5">
            <p className="text-muted text-[11px] font-medium">1 · Where is the old tip?</p>
            {FINDS.map((f) => (
              <button
                key={f.id}
                type="button"
                aria-pressed={s.find === f.id}
                onClick={() => set({ find: f.id, fix: null })}
                className={cn(
                  "rounded-lg border px-3 py-1.5 text-left text-xs",
                  s.find === f.id
                    ? f.good
                      ? "border-good/60 bg-good/10"
                      : "border-bad/60 bg-bad/10"
                    : "border-line bg-surface",
                )}
              >
                {f.label}
                {s.find === f.id && (
                  <span className="text-muted mt-0.5 block text-[10px]">{f.why}</span>
                )}
              </button>
            ))}
          </div>
          {found?.good && (
            <motion.div
              initial={{ opacity: 0, y: 4 }}
              animate={{ opacity: 1, y: 0 }}
              className="grid gap-1.5"
            >
              <p className="text-muted text-[11px] font-medium">
                2 · Found it: <code>{m.oldTip}</code>. How do you put it back?
              </p>
              {FIXES.map((f) => (
                <button
                  key={f.id}
                  type="button"
                  aria-pressed={s.fix === f.id}
                  onClick={() => set({ fix: f.id })}
                  className={cn(
                    "rounded-lg border px-3 py-1.5 text-left text-xs",
                    s.fix === f.id
                      ? {
                          good: "border-good/60 bg-good/10",
                          ok: "border-accent/60 bg-accent-soft",
                          bad: "border-bad/60 bg-bad/10",
                        }[f.verdict]
                      : "border-line bg-surface",
                  )}
                >
                  {f.label}
                  {s.fix === f.id && (
                    <span className="text-muted mt-0.5 block text-[10px]">{f.why}</span>
                  )}
                </button>
              ))}
            </motion.div>
          )}
        </div>
      }
    >
      <p>
        First find the commit main pointed to before the force-push, then decide how to restore it.
        Watch the graph: the goal is that every commit, including Sam&apos;s, is reachable from main
        again.
      </p>
      {fix?.verdict === "good" ? (
        <p className="text-good">
          Rescued. main moved forward with a merge commit, so everyone else just pulls as normal.
        </p>
      ) : (
        <p>
          Before you touch anything, tell the team to stop pushing to main, so nobody else builds on
          the broken state.
        </p>
      )}
    </StepLayout>
  );
}

/* 3 ─ Undo or rewrite ------------------------------------------------------------------------------- */

export function UndoOrRewrite() {
  const [s, set] = useSceneState<CapState>();
  return (
    <StepLayout
      eyebrow="Explore"
      title="Undo or rewrite?"
      stage={
        <div className="flex flex-1 flex-col justify-center gap-1.5">
          {SITUATIONS.map((x) => {
            const pick = s.kinds[x.id];
            return (
              <div
                key={x.id}
                className="border-line bg-surface rounded-lg border px-3 py-1.5 text-xs"
              >
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <span>{x.label}</span>
                  <span className="flex gap-1">
                    {(["undo", "rewrite"] as Kind[]).map((k) => (
                      <button
                        key={k}
                        type="button"
                        aria-pressed={pick === k}
                        aria-label={`${k === "undo" ? "Revert" : "Rewrite"}: ${x.label}`}
                        onClick={() => set({ kinds: { ...s.kinds, [x.id]: k } })}
                        className={cn(
                          "rounded-full border px-2.5 py-0.5 text-[11px]",
                          pick === k
                            ? "border-accent bg-accent text-accent-fg"
                            : "border-line text-muted",
                        )}
                      >
                        {k === "undo" ? "Revert" : "Rewrite"}
                      </button>
                    ))}
                  </span>
                </div>
                {pick && (
                  <p
                    className={cn(
                      "mt-0.5 flex items-start gap-1 text-[10px]",
                      pick === x.answer ? "text-good" : "text-bad",
                    )}
                  >
                    {pick === x.answer ? (
                      <Check className="mt-px size-3 shrink-0" />
                    ) : (
                      <X className="mt-px size-3 shrink-0" />
                    )}
                    {x.why}
                  </p>
                )}
              </div>
            );
          })}
        </div>
      }
    >
      <p>
        The team also needs to tidy up. The rule from the undo chapter: <strong>revert</strong> what
        others already have; <strong>rewrite</strong> (amend, interactive rebase, reset) only what
        is yours alone.
      </p>
      <p>
        Rewriting shared history is exactly what caused Monday. A <Term id="revert">revert</Term> is
        boring and safe.
      </p>
    </StepLayout>
  );
}

/* 4 ─ Guardrails ------------------------------------------------------------------------------------ */

export function Guardrails() {
  const [s, set] = useSceneState<CapState>();
  const toggle = (g: Guard) =>
    set({ guards: s.guards.includes(g) ? s.guards.filter((x) => x !== g) : [...s.guards, g] });
  return (
    <StepLayout
      eyebrow="Explore"
      title="Set the rules"
      stage={
        <div className="grid flex-1 content-center gap-3 sm:grid-cols-2">
          <div className="grid content-start gap-1.5">
            <p className="text-muted text-[11px] font-medium">Guardrails</p>
            {GUARDS.map((g) => (
              <label
                key={g.id}
                className="border-line bg-surface flex items-center gap-2 rounded-lg border px-3 py-1.5 text-xs"
              >
                <input
                  type="checkbox"
                  checked={s.guards.includes(g.id)}
                  onChange={() => toggle(g.id)}
                  className="accent-accent"
                />
                {g.label}
              </label>
            ))}
          </div>
          <div className="grid content-start gap-1.5">
            <p className="text-muted text-[11px] font-medium">Replay the team&apos;s month</p>
            {INCIDENTS.map((i) => {
              const st = incidentStatus(i, s.guards);
              return (
                <div
                  key={i.id}
                  className={cn(
                    "flex items-start gap-2 rounded-lg border px-3 py-1.5 text-xs",
                    {
                      stopped: "border-good/50 bg-good/10",
                      partly: "border-line-strong bg-surface-2",
                      open: "border-line bg-surface",
                    }[st],
                  )}
                >
                  {st === "stopped" ? (
                    <ShieldCheck className="text-good mt-px size-3.5 shrink-0" />
                  ) : (
                    <CircleAlert
                      className={cn(
                        "mt-px size-3.5 shrink-0",
                        st === "partly" ? "text-accent" : "text-muted",
                      )}
                    />
                  )}
                  <span>
                    {i.label}
                    <span className="text-muted block text-[10px]">
                      {st === "stopped"
                        ? "Prevented."
                        : st === "partly"
                          ? "Usually caught, but hooks can be skipped."
                          : "Would still happen."}
                    </span>
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      }
    >
      <p>
        Tick guardrails and replay the month. On GitHub, protected branches and new rulesets block
        force pushes by default; GitLab protects the default branch. The team simply hadn&apos;t set
        up <Term id="branch-protection">branch protection</Term> on main.
      </p>
      <p>
        Prefer rules the server enforces. Habits and client hooks help, but they depend on everyone
        remembering.
      </p>
    </StepLayout>
  );
}

/* 5 ─ Checklist ------------------------------------------------------------------------------------- */

export function Checklist() {
  return (
    <StepLayout
      eyebrow="Explore"
      title="The whole track as a checklist"
      stage={
        <div className="grid flex-1 content-center gap-2 sm:grid-cols-2">
          {CHECKLIST.map(([ch, items], i) => (
            <motion.div
              key={ch}
              initial={{ opacity: 0, y: 4 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.07 * i }}
              className="border-line bg-surface rounded-lg border px-3 py-2 text-xs"
            >
              <p className="text-accent font-semibold">{ch}</p>
              <ul className="mt-1 grid gap-0.5">
                {items.map((it) => (
                  <li key={it} className="flex items-start gap-1.5">
                    <Check className="text-good mt-0.5 size-3 shrink-0" />
                    {it}
                  </li>
                ))}
              </ul>
            </motion.div>
          ))}
        </div>
      }
    >
      <p>Here is the track on one page. Each line maps back to a chapter you can revisit.</p>
      <p>
        Most Git trouble comes from one of two things: rewriting shared history, or not knowing
        where to look.
      </p>
    </StepLayout>
  );
}

/* 6 ─ Checkpoint ----------------------------------------------------------------------------------- */

export function CapCheck() {
  return (
    <StepLayout
      eyebrow="Checkpoint"
      title="Put the rescue in order"
      stage={
        <div className="flex flex-1 flex-col justify-center">
          <OrderCheckpoint
            id="git-capstone"
            prompt="Drag the steps of recovering from a bad force-push into order."
            items={[
              { id: "stop", label: "Tell the team to stop pushing to main" },
              { id: "find", label: "Find the old tip (a teammate's clone, or the push log)" },
              { id: "branch", label: "Create a rescue branch at the old tip" },
              { id: "merge", label: "Merge today's main into it" },
              { id: "push", label: "Move main forward with a normal push" },
              { id: "protect", label: "Protect main so force pushes are blocked" },
            ]}
            explanation="Stop the damage spreading, find the lost commit, bring both histories together without another force-push, then add the rule that prevents a repeat."
          />
        </div>
      }
    >
      <p>Drag the steps into order.</p>
    </StepLayout>
  );
}

/* 7 ─ Wrap ----------------------------------------------------------------------------------------- */

export function Wrap() {
  return (
    <WrapStep
      points={[
        ["Commits are hard to lose", "Clones, the reflog and push logs remember."],
        ["Restore by moving forward", "Merge the lost work back; don't force-push again."],
        ["Revert shared, rewrite private", "The one rule behind most Git trouble."],
        ["Let the server enforce", "Protected branches, required reviews and checks."],
        ["Keep feedback fast", "Hooks and good habits catch problems early."],
      ]}
    >
      <p>
        That&apos;s the Git track. The Testing track is next: once your history is safe, make sure
        what&apos;s in it works.
      </p>
    </WrapStep>
  );
}
