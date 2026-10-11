"use client";

import { motion } from "motion/react";
import { DoorClosed, Check as CheckIcon, X } from "lucide-react";
import { useSceneState } from "@/lib/module-sdk";
import { StepLayout } from "@/toolkit/layout/step-layout";
import { WrapStep } from "@/toolkit/layout/wrap-step";
import { SortCheckpoint } from "@/toolkit/checkpoints/sort";
import { Term } from "@/toolkit/glossary/term";
import { cn } from "@/lib/cn";
import { CHECKS, POINTS, outcome, placement, type Check, type Point } from "./model";
import type { HookState } from "./state";

/* 1 ─ Story ---------------------------------------------------------------------------------------- */

export function Checklist() {
  return (
    <StepLayout
      eyebrow="Story"
      title="Checks at the kitchen door"
      stage={
        <div className="grid flex-1 content-center gap-2 sm:grid-cols-2">
          <motion.div
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            className="border-line bg-surface rounded-xl border p-3 text-xs"
          >
            <p className="font-semibold">At your station</p>
            <p className="text-muted">
              You taste the dish before it leaves. Quick, but you could skip it on a busy night.
            </p>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15 }}
            className="border-accent bg-accent-soft rounded-xl border p-3 text-xs"
          >
            <DoorClosed className="text-accent size-5" />
            <p className="mt-1 font-semibold">At the pass</p>
            <p className="text-muted">
              The head chef checks every plate before it goes out. Nobody skips that.
            </p>
          </motion.div>
        </div>
      }
    >
      <p>
        A good kitchen checks food twice: the cook tastes at their station, and the head chef checks
        at the pass before anything reaches a customer. The first is fast and personal; the second
        can&apos;t be skipped.
      </p>
      <p>
        Git <Term id="git-hook">hooks</Term> are scripts that run at moments like committing and
        pushing. Client-side hooks are the station check: quick, local, skippable. Server-side hooks
        and CI are the pass.
      </p>
    </StepLayout>
  );
}

/* 2 ─ Wire the hooks ⭐ ----------------------------------------------------------------------------- */

export function WireHooks() {
  const [s, set] = useSceneState<HookState>();
  const o = outcome(s.att.secrets, s.noVerify);
  const toggle = (c: Check, p: Point) => {
    const at = s.att[c].includes(p) ? s.att[c].filter((x) => x !== p) : [...s.att[c], p];
    set({ att: { ...s.att, [c]: at }, tried: false });
  };
  return (
    <StepLayout
      eyebrow="Build"
      title="Attach checks, then commit a secret"
      stage={
        <div className="flex flex-1 flex-col justify-center gap-3">
          <div className="grid gap-1.5">
            {CHECKS.map((c) => {
              const f = placement(c.id, s.att[c.id]);
              return (
                <div
                  key={c.id}
                  className="border-line bg-surface rounded-lg border px-3 py-1.5 text-xs"
                >
                  <div className="flex flex-wrap items-center justify-between gap-1.5">
                    <span>{c.label}</span>
                    <span className="flex flex-wrap gap-1">
                      {POINTS.map((p) => {
                        const on = s.att[c.id].includes(p.id);
                        return (
                          <button
                            key={p.id}
                            type="button"
                            aria-pressed={on}
                            aria-label={`${c.label}: ${p.label}`}
                            onClick={() => toggle(c.id, p.id)}
                            className={cn(
                              "rounded-full border px-2 py-0.5 font-mono text-[10px]",
                              on
                                ? "border-accent bg-accent-soft text-fg"
                                : "border-line text-muted",
                            )}
                          >
                            {p.label}
                          </button>
                        );
                      })}
                    </span>
                  </div>
                  {f && (
                    <p className={cn("mt-0.5 text-[10px]", f.good ? "text-good" : "text-muted")}>
                      {f.text}
                    </p>
                  )}
                </div>
              );
            })}
          </div>
          <div className="flex flex-wrap items-center gap-3">
            <button
              type="button"
              onClick={() => set({ tried: true })}
              className="bg-accent text-accent-fg rounded-full px-4 py-1 text-xs font-medium"
            >
              Commit and push config.env (with a key in it)
            </button>
            <label className="flex items-center gap-1.5 text-xs">
              <input
                type="checkbox"
                checked={s.noVerify}
                onChange={(e) => set({ noVerify: e.target.checked, tried: false })}
                className="accent-accent"
              />
              --no-verify (in a hurry)
            </label>
          </div>
          {s.tried && (
            <motion.div
              initial={{ opacity: 0, y: 4 }}
              animate={{ opacity: 1, y: 0 }}
              className={cn(
                "rounded-lg border px-3 py-2 font-mono text-[11px]",
                o.stopped ? "border-good/50 bg-good/10" : "border-bad/50 bg-bad/10",
              )}
            >
              {o.lines.map((l) => (
                <p key={l} className="flex items-start gap-1.5">
                  {l.includes("refused") || l.includes("rejected") ? (
                    <CheckIcon className="text-good mt-0.5 size-3 shrink-0" />
                  ) : l.includes("server") || l.includes("secret and all") ? (
                    <X className="text-bad mt-0.5 size-3 shrink-0" />
                  ) : (
                    <span className="w-3" />
                  )}
                  {l}
                </p>
              ))}
            </motion.div>
          )}
        </div>
      }
    >
      <p>
        Attach each check to one or more places, then try to commit and push a file with a secret in
        it. Try again with <code>--no-verify</code>, which skips the pre-commit and commit-msg
        hooks.
      </p>
      <p>
        You&apos;ll see why important checks go in two places: a client hook for fast feedback, and
        the server or CI for enforcement.
      </p>
    </StepLayout>
  );
}

/* 3 ─ Sharing hooks --------------------------------------------------------------------------------- */

export function Sharing() {
  return (
    <StepLayout
      eyebrow="Explore"
      title="Sharing hooks with a team"
      stage={
        <div className="flex flex-1 flex-col justify-center gap-2">
          {[
            [
              "Hooks aren't cloned",
              "They live in .git/hooks, which isn't part of the repository's history. Each clone starts with only samples.",
            ],
            [
              "core.hooksPath (Git 2.9)",
              "Point Git at a hooks folder tracked in the repository, so everyone shares the same scripts.",
            ],
            [
              "Tools",
              "pre-commit (a framework of reusable hooks), Husky (common in JavaScript projects) and lefthook install and run hooks for you.",
            ],
            [
              "Hooks in config (Git 2.54)",
              "Newer Git can define hooks in configuration (hook.<name>.command), run several per event, and since 2.55 in parallel.",
            ],
          ].map(([t, b], i) => (
            <motion.div
              key={t}
              initial={{ opacity: 0, y: 4 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.07 * i }}
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
        Because hooks are scripts that run on your machine, Git deliberately doesn&apos;t install
        them from a clone: that would let any repository run code on your computer. Teams opt in,
        usually with one setup command.
      </p>
      <p>Keep client hooks fast. A pre-commit hook that takes a minute will be skipped.</p>
    </StepLayout>
  );
}

/* 4 ─ Hooks vs CI ---------------------------------------------------------------------------------- */

export function HooksVsCi() {
  return (
    <StepLayout
      eyebrow="Explore"
      title="Hooks or CI?"
      stage={
        <div className="flex flex-1 flex-col justify-center gap-2">
          <div className="border-line overflow-hidden rounded-xl border text-xs">
            <div className="bg-surface-2 text-muted grid grid-cols-[7rem_1fr_1fr] gap-2 px-3 py-1.5 font-medium">
              <span />
              <span>Client hook</span>
              <span>CI / server</span>
            </div>
            {[
              ["Speed", "Instant feedback", "Minutes later"],
              ["Can be skipped?", "Yes (--no-verify, or not installed)", "No"],
              ["Good for", "Formatting, quick lint, secret scan", "Full tests, builds, policy"],
              ["Runs where", "Each developer's machine", "A shared, consistent machine"],
            ].map(([k, a, b]) => (
              <div
                key={k}
                className="border-line grid grid-cols-[7rem_1fr_1fr] gap-2 border-t px-3 py-1.5"
              >
                <span className="text-muted">{k}</span>
                <span>{a}</span>
                <span>{b}</span>
              </div>
            ))}
          </div>
        </div>
      }
    >
      <p>
        Hooks and CI aren&apos;t rivals. Hooks give fast, personal feedback; CI is the shared,
        enforced gate. Most teams use both, with the same checks where it makes sense.
      </p>
      <p>The CI/CD track covers pipelines in depth.</p>
    </StepLayout>
  );
}

/* 5 ─ Checkpoint ----------------------------------------------------------------------------------- */

export function HookCheck() {
  return (
    <StepLayout
      eyebrow="Checkpoint"
      title="Where should it run?"
      stage={
        <div className="flex flex-1 flex-col justify-center">
          <SortCheckpoint
            id="git-hooks"
            prompt="Where does each check belong first?"
            categories={[
              { id: "client", label: "Client hook" },
              { id: "server", label: "CI / server" },
            ]}
            items={[
              {
                id: "fmt",
                label: "Run the formatter on staged files",
                category: "client",
                why: "Fast, local fix.",
              },
              {
                id: "msg",
                label: "Reject a message without a ticket number",
                category: "client",
                why: "commit-msg hook (and optionally CI).",
              },
              {
                id: "suite",
                label: "Run the full 20-minute test suite",
                category: "server",
                why: "Too slow for every commit.",
              },
              {
                id: "policy",
                label: "Make sure nobody can push straight to main",
                category: "server",
                why: "Must be enforced; client hooks can be skipped.",
              },
              {
                id: "secret",
                label: "Give instant feedback if a key is staged",
                category: "client",
                why: "Catch it before the commit exists.",
              },
            ]}
            explanation="Client hooks give fast feedback but can be skipped; anything that must be enforced belongs on the server or in CI."
          />
        </div>
      }
    >
      <p>Sort each check.</p>
    </StepLayout>
  );
}

/* 6 ─ Wrap ----------------------------------------------------------------------------------------- */

export function Wrap() {
  return (
    <WrapStep
      points={[
        ["Hooks run at Git moments", "pre-commit, commit-msg, pre-push, pre-receive…"],
        ["Client hooks can be skipped", "--no-verify skips pre-commit and commit-msg."],
        ["Enforce on the server", "Server hooks, branch rules and CI."],
        ["Share them deliberately", "core.hooksPath or a hook manager."],
        ["Keep them fast", "Slow hooks get skipped."],
      ]}
    >
      <p>
        Next, the capstone: rescue a team&apos;s repository and set the rules that keep it healthy.
      </p>
    </WrapStep>
  );
}
