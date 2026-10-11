"use client";

import { motion } from "motion/react";
import { FileText } from "lucide-react";
import { useSceneState } from "@/lib/module-sdk";
import { StepLayout } from "@/toolkit/layout/step-layout";
import { WrapStep } from "@/toolkit/layout/wrap-step";
import { SortCheckpoint } from "@/toolkit/checkpoints/sort";
import { Term } from "@/toolkit/glossary/term";
import { cn } from "@/lib/cn";
import { CommitGraph } from "../_shared/graph";
import { TODO, afterFf, afterRebase, diverged, preview, viaMerge, type Action } from "./model";
import type { RebaseState } from "./state";

/* 1 ─ Story: redo your notes on the new draft ------------------------------------------------------ */

export function NewDraft() {
  return (
    <StepLayout
      eyebrow="Story"
      title="Redo your notes on the new draft"
      stage={
        <div className="flex flex-1 items-center justify-center gap-3">
          {[
            ["Monday's draft", "+ your 2 notes"],
            ["Wednesday's draft", "+ your 2 notes, rewritten"],
          ].map(([t, s], i) => (
            <motion.div
              key={t}
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.15 * i }}
              className={cn(
                "w-36 rounded-xl border p-3 text-xs",
                i ? "border-accent bg-accent-soft" : "border-line bg-surface",
              )}
            >
              <FileText className="text-accent size-5" />
              <p className="mt-1 font-semibold">{t}</p>
              <p className="text-muted">{s}</p>
            </motion.div>
          ))}
        </div>
      }
    >
      <p>
        You wrote two notes in the margin of Monday&apos;s draft. By Wednesday the draft has
        changed. Instead of stapling the two versions together, you copy your notes onto
        Wednesday&apos;s draft, adjusting them as you go. Your notes now look as if you wrote them
        on the latest version.
      </p>
      <p>
        <Term id="rebase">Rebase</Term> does that with commits. It takes the commits on your branch
        and replays them, one by one, on top of another branch. The result is a straight line of
        history, but the replayed commits are <em>new</em> commits with new IDs.
      </p>
    </StepLayout>
  );
}

/* 2 ─ Rebase, then fast-forward ⭐ ----------------------------------------------------------------- */

export function RebaseIt() {
  const [s, set] = useSceneState<RebaseState>();
  const repo = s.stage === 0 ? diverged() : s.stage === 1 ? afterRebase().repo : afterFf();
  const copied = afterRebase().copied;
  return (
    <StepLayout
      eyebrow="Simulation"
      title="Rebase specials onto main"
      stage={
        <div className="flex flex-1 flex-col justify-center gap-3">
          <CommitGraph
            repo={repo}
            highlight={s.stage > 0 ? copied.map(([, n]) => n) : []}
            className="border-line bg-surface rounded-xl border p-2"
          />
          <div className="flex flex-wrap gap-2">
            <button
              type="button"
              disabled={s.stage !== 0}
              onClick={() => set({ stage: 1 })}
              className="bg-accent text-accent-fg rounded-full px-3 py-1 text-xs font-medium disabled:opacity-40"
            >
              git rebase main
            </button>
            <button
              type="button"
              disabled={s.stage !== 1}
              onClick={() => set({ stage: 2 })}
              className="border-line-strong rounded-full border px-3 py-1 text-xs disabled:opacity-40"
            >
              git switch main · git merge specials
            </button>
            <button
              type="button"
              onClick={() => set({ stage: 0 })}
              className="text-muted text-xs underline"
            >
              start over
            </button>
          </div>
          {s.stage > 0 && (
            <div className="bg-surface-2/60 border-line rounded-lg border px-3 py-2 font-mono text-[11px]">
              {copied.map(([o, n]) => (
                <p key={o}>
                  {o.slice(0, 5)} <span className="text-subtle">(old, now faded)</span> →{" "}
                  <span className="text-accent">{n.slice(0, 5)}</span> (new copy)
                </p>
              ))}
              {s.stage === 2 && (
                <p className="text-good mt-1 font-sans">
                  Fast-forward: main is now a straight line.
                </p>
              )}
            </div>
          )}
          <label className="flex items-center gap-2 text-xs">
            <input
              type="checkbox"
              checked={s.compare}
              onChange={(e) => set({ compare: e.target.checked })}
              className="accent-accent"
            />
            Compare with merging instead
          </label>
          {s.compare && (
            <CommitGraph
              repo={viaMerge()}
              className="border-line bg-surface rounded-xl border p-2"
            />
          )}
        </div>
      }
    >
      <p>
        Specials and main have both moved on. Rebase specials onto main and watch Git copy its two
        commits onto main&apos;s tip, with new IDs. The originals are left behind, unreachable.
      </p>
      <p>
        Then merging into main is a fast-forward and history is a straight line. Compare that with a
        merge, which keeps the true shape: work that happened in parallel, joined by a merge commit.
        Both are valid; teams choose.
      </p>
    </StepLayout>
  );
}

/* 3 ─ Interactive rebase -------------------------------------------------------------------------- */

const ACTS: Action[] = ["pick", "reword", "squash", "fixup", "drop"];

export function Interactive() {
  const [s, set] = useSceneState<RebaseState>();
  const out = preview(s.actions);
  return (
    <StepLayout
      eyebrow="Explore"
      title="Tidy up with interactive rebase"
      stage={
        <div className="grid flex-1 content-center gap-3 lg:grid-cols-2">
          <div className="border-line bg-surface rounded-lg border p-2 font-mono text-[11px]">
            <p className="text-muted mb-1 font-sans text-[10px] uppercase">
              git rebase -i main · the to-do list
            </p>
            {TODO.map((t) => (
              <div key={t.id} className="flex flex-wrap items-center gap-1 py-0.5">
                <select
                  aria-label={`Action for ${t.msg}`}
                  value={s.actions[t.id] ?? "pick"}
                  onChange={(e) =>
                    set({ actions: { ...s.actions, [t.id]: e.target.value as Action } })
                  }
                  className="border-line-strong bg-surface rounded border px-1 py-0.5 text-[11px]"
                >
                  {ACTS.map((a) => (
                    <option key={a}>{a}</option>
                  ))}
                </select>
                <span className="text-subtle">{t.id}</span>
                <span>{t.msg}</span>
              </div>
            ))}
            <button
              type="button"
              onClick={() =>
                set({ actions: Object.fromEntries(TODO.map((t) => [t.id, t.suggest])) })
              }
              className="text-accent mt-1 font-sans text-[11px] underline"
            >
              Suggest a tidy-up
            </button>
          </div>
          <div className="grid content-start gap-1">
            <p className="text-muted text-[10px] uppercase">Resulting commits</p>
            {out.map((c, i) => (
              <motion.div
                key={c.msg + i}
                initial={{ opacity: 0, x: -4 }}
                animate={{ opacity: 1, x: 0 }}
                className="border-accent/50 bg-accent-soft rounded-md border px-2 py-1 text-xs"
              >
                <p className="font-medium">{c.msg}</p>
                {c.note && <p className="text-muted text-[10px]">{c.note}</p>}
              </motion.div>
            ))}
          </div>
        </div>
      }
    >
      <p>
        <code>git rebase -i</code> opens a to-do list of your commits. Change each line&apos;s
        action:
        <code> squash</code> and <code>fixup</code> fold a commit into the one above,{" "}
        <code>reword</code> changes a message, <code>drop</code> removes a commit. Save, and Git
        replays the list.
      </p>
      <p>
        There are more actions, like <code>edit</code>, <code>exec</code> and <code>break</code>.
        Pair it with <code>git commit --fixup</code> and <code>--autosquash</code> to tidy as you
        go.
      </p>
    </StepLayout>
  );
}

/* 4 ─ The one rule -------------------------------------------------------------------------------- */

const SHARED = [
  "You rebase specials and force-push it.",
  "Imran had already built on your old specials commits.",
  "Imran's branch now points at commits that no longer exist on the server.",
  "Imran must untangle duplicate commits by hand. Nobody is happy.",
];

export function OneRule() {
  const [s, set] = useSceneState<RebaseState>();
  return (
    <StepLayout
      eyebrow="Explore"
      title="The one rule"
      stage={
        <div className="flex flex-1 flex-col justify-center gap-2">
          {SHARED.map((t, i) => (
            <motion.button
              key={t}
              type="button"
              onClick={() => set({ shared: i })}
              animate={{ opacity: i <= s.shared ? 1 : 0.3 }}
              className={cn(
                "rounded-lg border px-3 py-2 text-left text-xs",
                i <= s.shared
                  ? i === 3
                    ? "border-bad/50 bg-bad/10"
                    : "border-line-strong bg-surface"
                  : "border-line",
              )}
            >
              {i + 1}. {t}
            </motion.button>
          ))}
          <div className="border-line bg-surface-2/60 mt-1 rounded-lg border px-3 py-2 text-xs">
            On your own branch, use <code>git push --force-with-lease</code> (and{" "}
            <code>--force-if-includes</code>), which refuse to overwrite commits you haven&apos;t
            seen, instead of a plain <code>--force</code>.
          </div>
        </div>
      }
    >
      <p>
        Pro Git sums it up in one line: don&apos;t rebase commits that exist outside your repository
        and that people may have based work on. Rebasing your own unpushed work, or your own feature
        branch, is fine.
      </p>
      <p>Click through what happens when the rule is broken.</p>
    </StepLayout>
  );
}

/* 5 ─ Checkpoint ----------------------------------------------------------------------------------- */

export function RebaseCheck() {
  return (
    <StepLayout
      eyebrow="Checkpoint"
      title="Rebase here?"
      stage={
        <div className="flex flex-1 flex-col justify-center">
          <SortCheckpoint
            id="git-rebase"
            prompt="Is rebasing a good idea in each situation?"
            categories={[
              { id: "ok", label: "Fine" },
              { id: "no", label: "Avoid" },
            ]}
            items={[
              {
                id: "local",
                label: "Tidy three local commits you haven't pushed",
                category: "ok",
                why: "Nobody else has them.",
              },
              {
                id: "update",
                label: "Bring your own feature branch up to date with main",
                category: "ok",
                why: "Your branch, your history.",
              },
              {
                id: "main",
                label: "Rebase main, which the whole team pulls from",
                category: "no",
                why: "Everyone's history would break.",
              },
              {
                id: "other",
                label: "Rebase a branch a teammate is also committing to",
                category: "no",
                why: "Their commits would be orphaned.",
              },
              {
                id: "squash",
                label: "Squash your 'wip' commits before opening a pull request",
                category: "ok",
                why: "Interactive rebase on your own work.",
              },
              {
                id: "force",
                label: "Force-push with plain --force to a shared branch",
                category: "no",
                why: "It can wipe others' commits; use --force-with-lease on your own branches only.",
              },
            ]}
            explanation="Rebase your own, unshared work freely; never rewrite commits other people have built on."
          />
        </div>
      }
    >
      <p>Sort each situation.</p>
    </StepLayout>
  );
}

/* 6 ─ Wrap ----------------------------------------------------------------------------------------- */

export function Wrap() {
  return (
    <WrapStep
      points={[
        ["Rebase replays commits", "On a new base, as new commits with new IDs."],
        ["Straight history", "Then merging is a fast-forward."],
        ["Interactive rebase", "Squash, reword, reorder and drop before sharing."],
        ["The one rule", "Don't rewrite commits others have."],
        ["Force safely", "--force-with-lease on your own branches only."],
      ]}
    >
      <p>Next: copying one commit with cherry-pick, and undoing one safely with revert.</p>
    </WrapStep>
  );
}
