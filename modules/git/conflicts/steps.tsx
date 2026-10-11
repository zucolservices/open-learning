"use client";

import { motion } from "motion/react";
import { PaintRoller, Check, X } from "lucide-react";
import { useSceneState } from "@/lib/module-sdk";
import { StepLayout } from "@/toolkit/layout/step-layout";
import { WrapStep } from "@/toolkit/layout/wrap-step";
import { OrderCheckpoint } from "@/toolkit/checkpoints/order";
import { Segmented } from "@/toolkit/controls/segmented";
import { Term } from "@/toolkit/glossary/term";
import { cn } from "@/lib/cn";
import { AFTER, BEFORE, PICKS, conflictLines } from "./model";
import type { ConflictState } from "./state";

const KIND = {
  plain: "",
  marker: "text-bad font-semibold",
  ours: "bg-viz-data/15",
  base: "bg-viz-idle/20 text-muted",
  theirs: "bg-viz-meta/15",
} as const;

/* 1 ─ Story: one wall, two colours ----------------------------------------------------------------- */

export function OneWall() {
  return (
    <StepLayout
      eyebrow="Story"
      title="One wall, two colours"
      stage={
        <div className="flex flex-1 items-center justify-center gap-4">
          {[
            ["Kavya", "bg-viz-data/40"],
            ["Tom", "bg-viz-meta/40"],
          ].map(([n, c], i) => (
            <motion.div
              key={n}
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.15 * i }}
              className="flex flex-col items-center gap-1"
            >
              <div className={cn("h-20 w-24 rounded-lg", c)} />
              <p className="flex items-center gap-1 text-xs">
                <PaintRoller className="size-3.5" /> {n}&apos;s plan
              </p>
            </motion.div>
          ))}
        </div>
      }
    >
      <p>
        Two decorators are told to repaint the café. One plans to paint the back wall green; the
        other, working from the same brief, plans yellow. Every other wall is easy. That one wall
        needs someone to decide.
      </p>
      <p>
        A <Term id="merge-conflict">merge conflict</Term> is that wall. Both branches changed the
        same lines differently, so Git stops, marks the spot in the file, and waits for you. It
        isn&apos;t an error; it&apos;s Git refusing to guess.
      </p>
    </StepLayout>
  );
}

/* 2 ─ Resolve it ⭐ -------------------------------------------------------------------------------- */

export function Resolve() {
  const [s, set] = useSceneState<ConflictState>();
  const pick = PICKS.find((p) => p.id === s.pick);
  const result = pick
    ? pick.id === "markers"
      ? conflictLines("merge").map((l) => l.text)
      : [...BEFORE, ...pick.result, ...AFTER]
    : null;
  const canAdd = pick && pick.id !== "markers";
  return (
    <StepLayout
      eyebrow="Fix the problem"
      title="Resolve the conflict"
      stage={
        <div className="flex flex-1 flex-col justify-center gap-3">
          <div className="bg-surface-2/60 border-line rounded-lg border px-3 py-2 font-mono text-[11px]">
            <p>$ git merge late-hours</p>
            <p>Auto-merging menu.html</p>
            <p className="text-bad">CONFLICT (content): Merge conflict in menu.html</p>
            <p>Automatic merge failed; fix conflicts and then commit the result.</p>
          </div>
          <div className="border-line bg-surface rounded-lg border p-2 font-mono text-[11px]">
            <p className="text-muted mb-1 font-sans text-[10px] uppercase">menu.html</p>
            {conflictLines("merge").map((l, i) => (
              <p key={i} className={cn("px-1", KIND[l.kind])}>
                {l.text}
              </p>
            ))}
          </div>
          <div className="flex flex-wrap gap-1">
            {PICKS.map((p) => (
              <button
                key={p.id}
                type="button"
                aria-pressed={s.pick === p.id}
                onClick={() => set({ pick: p.id, added: false, committed: false })}
                className={cn(
                  "rounded-full border px-2.5 py-0.5 text-[11px]",
                  s.pick === p.id
                    ? "border-accent bg-accent text-accent-fg"
                    : "border-line-strong text-muted",
                )}
              >
                {p.label}
              </button>
            ))}
          </div>
          {pick && result && (
            <motion.div
              key={pick.id}
              initial={{ opacity: 0, y: 4 }}
              animate={{ opacity: 1, y: 0 }}
              className="grid gap-2"
            >
              <div
                className={cn(
                  "rounded-lg border p-2 font-mono text-[11px]",
                  pick.ok ? "border-good/50 bg-good/10" : "border-bad/50 bg-bad/10",
                )}
              >
                {result.map((t, i) => (
                  <p key={i}>{t}</p>
                ))}
              </div>
              <p className="flex items-start gap-1.5 text-xs">
                {pick.ok ? (
                  <Check className="text-good mt-0.5 size-3.5 shrink-0" />
                ) : (
                  <X className="text-bad mt-0.5 size-3.5 shrink-0" />
                )}
                {pick.why}
              </p>
              <div className="flex flex-wrap gap-2">
                <button
                  type="button"
                  disabled={!canAdd || s.added}
                  onClick={() => set({ added: true })}
                  className="border-line-strong rounded-full border px-3 py-1 text-xs disabled:opacity-40"
                >
                  git add menu.html
                </button>
                <button
                  type="button"
                  disabled={!s.added || s.committed}
                  onClick={() => set({ committed: true })}
                  className="bg-accent text-accent-fg rounded-full px-3 py-1 text-xs font-medium disabled:opacity-40"
                >
                  git commit
                </button>
                {s.committed && <span className="text-good text-xs">Merge complete.</span>}
              </div>
            </motion.div>
          )}
        </div>
      }
    >
      <p>
        Main changed the opening time; the late-hours branch changed the closing time, on the same
        line. Between <code>&lt;&lt;&lt;&lt;&lt;&lt;&lt;</code> and <code>=======</code> is your
        side (HEAD); between <code>=======</code> and <code>&gt;&gt;&gt;&gt;&gt;&gt;&gt;</code> is
        theirs.
      </p>
      <p>
        Pick a resolution. The right one depends on what each change meant, which Git can&apos;t
        know. Remove every marker, mark the file resolved with <code>git add</code>, then commit to
        finish the merge.
      </p>
    </StepLayout>
  );
}

/* 3 ─ Show me the original -------------------------------------------------------------------------- */

export function Styles() {
  const [s, set] = useSceneState<ConflictState>();
  return (
    <StepLayout
      eyebrow="Explore"
      title="Show me the original too"
      stage={
        <div className="flex flex-1 flex-col justify-center gap-3">
          <Segmented
            value={s.style}
            onChange={(v) => set({ style: v })}
            options={[
              ["merge", "merge (default)"],
              ["diff3", "diff3"],
              ["zdiff3", "zdiff3"],
            ]}
            size="sm"
          />
          <div className="border-line bg-surface rounded-lg border p-2 font-mono text-[11px]">
            {conflictLines(s.style).map((l, i) => (
              <p key={i} className={cn("px-1", KIND[l.kind])}>
                {l.text}
              </p>
            ))}
          </div>
          <code className="text-muted font-mono text-[11px]">
            git config --global merge.conflictStyle {s.style}
          </code>
        </div>
      }
    >
      <p>
        The default markers show only the two sides. Setting <code>merge.conflictStyle</code> to
        <code> diff3</code> adds a third section, after <code>|||||||</code>, showing what the base
        looked like. Seeing the original makes it much easier to tell what each side actually
        changed.
      </p>
      <p>
        <code>zdiff3</code> (Git 2.35, 2022) goes further and moves lines both sides share out of
        the conflict, so the conflict is smaller.
      </p>
    </StepLayout>
  );
}

/* 4 ─ Escape hatches and helpers -------------------------------------------------------------------- */

export function Helpers() {
  return (
    <StepLayout
      eyebrow="Explore"
      title="Escape hatches and helpers"
      stage={
        <div className="flex flex-1 flex-col justify-center gap-2">
          {[
            ["git status", "Lists every file 'both modified', so you know what's left."],
            [
              "git merge --abort",
              "Gives up and goes back to before the merge. Commit or stash your own changes first; uncommitted work can be hard to restore.",
            ],
            [
              "git mergetool",
              "Opens a side-by-side tool (your editor or a configured one) for each conflicted file.",
            ],
            [
              "git rerere",
              '"Reuse recorded resolution": once switched on with rerere.enabled, Git remembers how you solved a conflict and replays it next time.',
            ],
            [
              "Run the tests",
              "A merge with no conflicts can still be wrong: two changes that each work can break together.",
            ],
          ].map(([t, b], i) => (
            <motion.div
              key={t}
              initial={{ opacity: 0, y: 4 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.07 * i }}
              className="border-line bg-surface grid grid-cols-[8rem_1fr] gap-2 rounded-lg border px-3 py-2 text-xs"
            >
              <code className="text-accent font-mono">{t}</code>
              <span>{b}</span>
            </motion.div>
          ))}
        </div>
      }
    >
      <p>
        The best way to handle conflicts is to have small ones: merge or rebase often so branches
        don&apos;t drift apart for weeks.
      </p>
      <p>
        And when you&apos;re lost, <code>git merge --abort</code> gets you back to where you
        started.
      </p>
    </StepLayout>
  );
}

/* 5 ─ Checkpoint ----------------------------------------------------------------------------------- */

export function OrderCheck() {
  return (
    <StepLayout
      eyebrow="Checkpoint"
      title="Put the steps in order"
      stage={
        <div className="flex flex-1 flex-col justify-center">
          <OrderCheckpoint
            id="git-conflicts"
            prompt="Drag the steps of resolving a merge conflict into order."
            items={[
              { id: "status", label: "Run git status to see which files conflict" },
              { id: "edit", label: "Edit each file and remove the conflict markers" },
              { id: "test", label: "Build and run the tests" },
              { id: "add", label: "git add each resolved file" },
              { id: "commit", label: "git commit to finish the merge" },
            ]}
            explanation="Find the conflicts, resolve them by hand, check the result works, mark the files resolved, then commit."
          />
        </div>
      }
    >
      <p>Order the steps.</p>
    </StepLayout>
  );
}

/* 6 ─ Wrap ----------------------------------------------------------------------------------------- */

export function Wrap() {
  return (
    <WrapStep
      points={[
        ["Conflicts mean Git won't guess", "Both sides changed the same lines."],
        ["Read the markers", "Yours, then theirs; diff3 adds the original."],
        ["Resolve by meaning", "Often a combination of both intentions."],
        ["Remove every marker", "Then git add and commit."],
        ["Stay small", "Merge often; --abort if you're lost."],
      ]}
    >
      <p>Next: rebase, the other way to bring work together.</p>
    </WrapStep>
  );
}
