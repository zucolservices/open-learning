"use client";

import { motion } from "motion/react";
import { Eraser, Mail, MailCheck, Check, X } from "lucide-react";
import { useSceneState } from "@/lib/module-sdk";
import { StepLayout } from "@/toolkit/layout/step-layout";
import { WrapStep } from "@/toolkit/layout/wrap-step";
import { SortCheckpoint } from "@/toolkit/checkpoints/sort";
import { Segmented } from "@/toolkit/controls/segmented";
import { Term } from "@/toolkit/glossary/term";
import { cn } from "@/lib/cn";
import { CMDS, MISTAKES, MODES } from "./model";
import type { UndoState } from "./state";

/* 1 ─ Story ---------------------------------------------------------------------------------------- */

export function ThreeUndos() {
  const items = [
    { Icon: Eraser, t: "Rub out the pencil", s: "Nobody has seen the draft." },
    { Icon: Mail, t: "Take it out of the envelope", s: "Written, but not posted yet." },
    { Icon: MailCheck, t: "Post a correction", s: "Already delivered: you can't unsend it." },
  ];
  return (
    <StepLayout
      eyebrow="Story"
      title="Three kinds of undo"
      stage={
        <div className="grid flex-1 content-center gap-2 sm:grid-cols-3">
          {items.map(({ Icon, t, s }, i) => (
            <motion.div
              key={t}
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.12 * i }}
              className="border-line bg-surface rounded-xl border p-3 text-xs"
            >
              <Icon className="text-accent size-5" />
              <p className="mt-1 font-semibold">{t}</p>
              <p className="text-muted">{s}</p>
            </motion.div>
          ))}
        </div>
      }
    >
      <p>
        Undoing a letter depends on how far it&apos;s gone. A pencil draft you rub out. A sealed
        envelope you can still open. A letter that&apos;s been delivered you can only follow with a
        correction.
      </p>
      <p>
        Git is the same. Changes only in your files or index can simply be restored. Local commits
        can be rewritten with <Term id="reset">reset</Term> or amend. Commits others already have
        should be undone with revert, which adds a correction instead of rewriting.
      </p>
    </StepLayout>
  );
}

/* 2 ─ Pick the undo ⭐ ------------------------------------------------------------------------------ */

export function PickUndo() {
  const [s, set] = useSceneState<UndoState>();
  return (
    <StepLayout
      eyebrow="Simulation"
      title="Pick the right undo"
      stage={
        <div className="flex flex-1 flex-col justify-center gap-1.5">
          {MISTAKES.map((m, i) => {
            const pick = s.picks[m.id];
            const ok = pick === m.answer;
            return (
              <div
                key={m.id}
                className={cn(
                  "rounded-lg border p-2",
                  pick
                    ? ok
                      ? "border-good/50 bg-good/10"
                      : "border-bad/50 bg-bad/10"
                    : "border-line bg-surface",
                )}
              >
                <p className="text-xs">
                  <span className="text-accent mr-1 font-mono">{i + 1}</span>
                  {m.text}
                </p>
                <select
                  aria-label={`Undo for mistake ${i + 1}`}
                  value={pick ?? ""}
                  onChange={(e) =>
                    set({
                      picks: { ...s.picks, [m.id]: e.target.value as (typeof CMDS)[number]["id"] },
                    })
                  }
                  className="border-line-strong bg-surface mt-1 rounded border px-1 py-0.5 font-mono text-[11px]"
                >
                  <option value="" disabled>
                    choose a command…
                  </option>
                  {CMDS.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.label}
                    </option>
                  ))}
                </select>
                {pick && (
                  <p className="mt-1 flex items-start gap-1 text-[11px]">
                    {ok ? (
                      <Check className="text-good mt-0.5 size-3 shrink-0" />
                    ) : (
                      <X className="text-bad mt-0.5 size-3 shrink-0" />
                    )}
                    {ok
                      ? m.why
                      : `Not the best fit. Hint: ${CMDS.find((c) => c.id === m.answer)!.label}.`}
                  </p>
                )}
              </div>
            );
          })}
        </div>
      }
    >
      <p>
        Six everyday mistakes. Choose the command that undoes each one with the least collateral
        damage.
      </p>
      <p>
        Two questions decide it: where is the mistake (files, index, or a commit)? And has anyone
        else got it yet? If yes, don&apos;t rewrite: revert.
      </p>
    </StepLayout>
  );
}

/* 3 ─ Reset's three modes --------------------------------------------------------------------------- */

export function ResetModes() {
  const [s, set] = useSceneState<UndoState>();
  const m = MODES[s.mode];
  const cols: [string, boolean][] = [
    ["Branch (HEAD)", m.branch],
    ["Index", m.index],
    ["Working tree", m.tree],
  ];
  return (
    <StepLayout
      eyebrow="Explore"
      title="What git reset touches"
      stage={
        <div className="flex flex-1 flex-col justify-center gap-3">
          <Segmented
            value={s.mode}
            onChange={(v) => set({ mode: v })}
            options={[
              ["soft", "--soft"],
              ["mixed", "--mixed (default)"],
              ["hard", "--hard"],
            ]}
            size="sm"
          />
          <code className="text-muted font-mono text-xs">git reset --{s.mode} HEAD~1</code>
          <div className="grid grid-cols-3 gap-2">
            {cols.map(([t, moved]) => (
              <motion.div
                key={t + s.mode}
                initial={{ opacity: 0.4 }}
                animate={{ opacity: 1 }}
                className={cn(
                  "rounded-xl border p-3 text-center text-xs",
                  moved ? "border-accent bg-accent-soft" : "border-line bg-surface",
                )}
              >
                <p className="font-semibold">{t}</p>
                <p className={cn("mt-1", moved ? "text-accent" : "text-muted")}>
                  {moved ? "moved back" : "unchanged"}
                </p>
              </motion.div>
            ))}
          </div>
          <p className="text-sm">{m.note}</p>
        </div>
      }
    >
      <p>
        <code>git reset</code> moves the current branch to another commit. Its three modes decide
        how far the undo reaches: just the branch, the branch and the index, or everything including
        your files.
      </p>
      <p>
        <code>--hard</code> is the one to respect. Committed work survives in the reflog (next
        module), but edits you never committed or staged are gone.
      </p>
    </StepLayout>
  );
}

/* 4 ─ Before or after pushing ----------------------------------------------------------------------- */

export function BeforeAfter() {
  return (
    <StepLayout
      eyebrow="Explore"
      title="Before pushing, or after?"
      stage={
        <div className="flex flex-1 flex-col justify-center gap-2">
          <div className="border-line overflow-hidden rounded-xl border text-xs">
            <div className="bg-surface-2 text-muted grid grid-cols-[1fr_6rem_7rem] gap-2 px-3 py-1.5 font-medium">
              <span>Command</span>
              <span>Rewrites history?</span>
              <span>OK after pushing?</span>
            </div>
            {CMDS.map((c) => (
              <div
                key={c.id}
                className="border-line grid grid-cols-[1fr_6rem_7rem] gap-2 border-t px-3 py-1.5"
              >
                <code className="font-mono text-[11px]">{c.label}</code>
                <span>{c.rewrites ? "Yes" : "No"}</span>
                <span className={c.rewrites ? "text-bad" : "text-good"}>
                  {c.rewrites ? "Avoid" : "Yes"}
                </span>
              </div>
            ))}
          </div>
        </div>
      }
    >
      <p>
        Anything that rewrites history (amend, reset, rebase) makes new commits. On your own
        unpushed work that&apos;s fine. On shared work it forces everyone else to untangle their
        copies.
      </p>
      <p>
        <code>git restore</code> doesn&apos;t touch history at all; it only changes your files or
        index, so it&apos;s fine any time, as long as you really mean to discard those edits.
      </p>
    </StepLayout>
  );
}

/* 5 ─ Checkpoint ----------------------------------------------------------------------------------- */

export function UndoCheck() {
  return (
    <StepLayout
      eyebrow="Checkpoint"
      title="Safe after pushing?"
      stage={
        <div className="flex flex-1 flex-col justify-center">
          <SortCheckpoint
            id="git-undoing"
            prompt="The commit in question is already on the shared main branch. Is each undo appropriate?"
            categories={[
              { id: "ok", label: "Appropriate" },
              { id: "no", label: "Avoid" },
            ]}
            items={[
              {
                id: "revert",
                label: "git revert the bad commit and push",
                category: "ok",
                why: "Adds history, doesn't rewrite it.",
              },
              {
                id: "amend",
                label: "git commit --amend it and force-push",
                category: "no",
                why: "Rewrites a shared commit.",
              },
              {
                id: "hard",
                label: "git reset --hard before it and force-push",
                category: "no",
                why: "Rewrites shared history.",
              },
              {
                id: "fix",
                label: "Commit a follow-up fix",
                category: "ok",
                why: "Adding commits is always safe.",
              },
              {
                id: "rebase",
                label: "Interactive-rebase main to drop it, then force-push",
                category: "no",
                why: "Rewrites shared history.",
              },
            ]}
            explanation="Once a commit is shared, undo it by adding commits (revert or a fix), never by rewriting."
          />
        </div>
      }
    >
      <p>Sort each option.</p>
    </StepLayout>
  );
}

/* 6 ─ Wrap ----------------------------------------------------------------------------------------- */

export function Wrap() {
  return (
    <WrapStep
      points={[
        ["Files and index: restore", "git restore, git restore --staged."],
        ["Last commit, unpushed: amend", "Or reset --soft to redo it."],
        ["Local commits: reset", "--soft, --mixed or --hard."],
        ["Shared commits: revert", "Add a correction, don't rewrite."],
        ["--hard loses uncommitted edits", "Committed work survives in the reflog."],
      ]}
    >
      <p>Next: the reflog, Git&apos;s safety net for when an undo goes wrong.</p>
    </WrapStep>
  );
}
