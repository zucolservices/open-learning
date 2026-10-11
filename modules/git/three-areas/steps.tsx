"use client";

import { motion } from "motion/react";
import { Package, ClipboardList, Truck } from "lucide-react";
import { useSceneState } from "@/lib/module-sdk";
import { StepLayout } from "@/toolkit/layout/step-layout";
import { WrapStep } from "@/toolkit/layout/wrap-step";
import { SortCheckpoint } from "@/toolkit/checkpoints/sort";
import { Term } from "@/toolkit/glossary/term";
import { cn } from "@/lib/cn";
import { apply, code, commitAll, meaning, type Action } from "./model";
import type { AreasState } from "./state";

/* 1 ─ Story: packing a parcel --------------------------------------------------------------------- */

export function Parcel() {
  const stages = [
    { Icon: Package, t: "Your desk", s: "things you're working on" },
    { Icon: ClipboardList, t: "The packing list", s: "what goes in this parcel" },
    { Icon: Truck, t: "Posted", s: "sealed, recorded, sent" },
  ];
  return (
    <StepLayout
      eyebrow="Story"
      title="Desk, packing list, post"
      stage={
        <div className="flex flex-1 flex-col items-center justify-center gap-2 sm:flex-row">
          {stages.map(({ Icon, t, s }, i) => (
            <motion.div
              key={t}
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.15 * i }}
              className={cn(
                "flex w-40 flex-col items-center rounded-xl border p-3 text-center",
                i === 1 ? "border-accent bg-accent-soft" : "border-line bg-surface",
              )}
            >
              <Icon className="text-accent size-6" />
              <p className="mt-1 text-sm font-semibold">{t}</p>
              <p className="text-muted text-[11px]">{s}</p>
            </motion.div>
          ))}
        </div>
      }
    >
      <p>
        Posting a parcel happens in three places. Things lie around on your desk. You decide what
        goes in this parcel and write it on a packing list. Then you seal it and post it, and the
        post office records it.
      </p>
      <p>
        Git works the same way. You change files in the <Term id="working-tree">working tree</Term>,
        choose what goes into the next commit by <Term id="staging">staging</Term> it in the{" "}
        <Term id="index">index</Term>, and commit to record a snapshot in the repository.
      </p>
    </StepLayout>
  );
}

/* 2 ─ Move the changes ⭐ -------------------------------------------------------------------------- */

const ACTIONS: { a: Action; label: string; cmd: string }[] = [
  { a: "edit", label: "Edit", cmd: "(edit the file)" },
  { a: "addP", label: "Stage one hunk", cmd: "git add -p" },
  { a: "add", label: "Stage all", cmd: "git add" },
  { a: "unstage", label: "Unstage", cmd: "git restore --staged" },
  { a: "discard", label: "Discard", cmd: "git restore" },
];

function Dots({ n, cls }: { n: number; cls: string }) {
  return (
    <span className="inline-flex gap-0.5">
      {Array.from({ length: n }, (_, i) => (
        <span key={i} className={cn("size-2.5 rounded-sm", cls)} />
      ))}
    </span>
  );
}

export function MoveChanges() {
  const [s, set] = useSceneState<AreasState>();
  const act = (i: number, a: Action) => {
    const files = s.files.map((f, j) => (j === i ? apply(f, a) : f));
    const cmd = ACTIONS.find((x) => x.a === a)!.cmd;
    set({
      files,
      log: [...s.log, a === "edit" ? `edit ${s.files[i].name}` : `${cmd} ${s.files[i].name}`].slice(
        -4,
      ),
    });
  };
  const anyStaged = s.files.some((f) => f.staged > 0);
  return (
    <StepLayout
      eyebrow="Simulation"
      title="Move changes between the three areas"
      stage={
        <div className="flex flex-1 flex-col justify-center gap-3">
          <div className="grid grid-cols-[7rem_1fr_1fr_1fr] gap-1 text-[10px] uppercase">
            <span />
            <span className="text-muted">Working tree</span>
            <span className="text-muted">Index (staged)</span>
            <span className="text-muted">Repository</span>
          </div>
          {s.files.map((f, i) => (
            <div key={f.name} className="border-line bg-surface rounded-lg border p-2">
              <div className="grid grid-cols-[7rem_1fr_1fr_1fr] items-center gap-1 text-xs">
                <span className="font-mono">{f.name}</span>
                <Dots n={f.edits - f.staged} cls="bg-viz-add" />
                <Dots n={f.staged} cls="bg-accent" />
                <span className="text-subtle text-[10px]">
                  {f.isNew ? "not yet" : `in ${s.commits} commit${s.commits > 1 ? "s" : ""}`}
                </span>
              </div>
              <div className="mt-1.5 flex flex-wrap gap-1">
                {ACTIONS.map((x) => (
                  <button
                    key={x.a}
                    type="button"
                    aria-label={`${x.label} ${f.name}`}
                    onClick={() => act(i, x.a)}
                    className="border-line-strong text-muted hover:text-fg rounded-full border px-2 py-0.5 text-[10px]"
                  >
                    {x.label}
                  </button>
                ))}
              </div>
            </div>
          ))}
          <div className="flex flex-wrap items-center gap-2">
            <button
              type="button"
              disabled={!anyStaged}
              onClick={() =>
                set({
                  files: commitAll(s.files),
                  commits: s.commits + 1,
                  log: [...s.log, "git commit"].slice(-4),
                })
              }
              className="bg-accent text-accent-fg rounded-full px-4 py-1.5 text-xs font-medium disabled:opacity-40"
            >
              git commit
            </button>
            <code className="text-subtle font-mono text-[10px]">{s.log.join("  ·  ")}</code>
          </div>
          <div className="bg-surface-2/60 border-line rounded-lg border px-3 py-2 font-mono text-[11px]">
            <p className="text-muted">$ git status --short</p>
            {s.files
              .filter((f) => code(f) !== "  ")
              .map((f) => (
                <p key={f.name}>
                  <span className="text-accent whitespace-pre">{code(f)}</span> {f.name}{" "}
                  <span className="text-subtle font-sans">· {meaning(code(f))}</span>
                </p>
              ))}
            {s.files.every((f) => code(f) === "  ") && (
              <p className="text-subtle">(nothing to commit)</p>
            )}
          </div>
        </div>
      }
    >
      <p>
        Each square is one change, or <Term id="hunk">hunk</Term>. Edit files, stage some or all of
        their changes, and commit. Only what&apos;s in the index goes into the commit; everything
        else stays in the working tree for later.
      </p>
      <p>
        Watch the status codes. The first column compares the index with the last commit; the second
        compares the working tree with the index. <code>MM</code> means you staged a change, then
        changed the file again.
      </p>
    </StepLayout>
  );
}

/* 3 ─ Why stage at all? ----------------------------------------------------------------------------- */

export function WhyStage() {
  const [s, set] = useSceneState<AreasState>();
  const commits = [
    ["Fix typo in menu", "1 hunk: “Caffe” → “Café”"],
    ["Add monsoon specials", "3 hunks: new items and prices"],
  ];
  return (
    <StepLayout
      eyebrow="Explore"
      title="Two commits from one messy afternoon"
      stage={
        <div className="flex flex-1 flex-col justify-center gap-3">
          <p className="text-sm">
            You fixed a typo <em>and</em> added a new section in the same file. Using{" "}
            <code>git add -p</code>, stage them separately:
          </p>
          <div className="grid gap-1.5">
            {commits.map(([t, b], i) => (
              <motion.button
                key={t}
                type="button"
                onClick={() => set({ split: i + 1 })}
                animate={{ opacity: s.split > i ? 1 : 0.45 }}
                className={cn(
                  "rounded-lg border px-3 py-2 text-left text-xs",
                  s.split > i ? "border-accent bg-accent-soft" : "border-line",
                )}
              >
                <p className="font-semibold">
                  Commit {i + 1}: {t}
                </p>
                <p className="text-muted">{b}</p>
              </motion.button>
            ))}
          </div>
          <p className="text-muted text-xs">
            {s.split >= 2
              ? "Two focused commits: easy to review, and the typo fix could be reverted or cherry-picked on its own."
              : "Click each commit to stage and make it in turn."}
          </p>
        </div>
      }
    >
      <p>
        The index exists so a commit can say one thing clearly, even when your working tree is a
        mixture. Reviewers see a typo fix and a feature as separate, focused changes.
      </p>
      <p>
        You&apos;ll meet two newer commands here: <code>git restore</code> and{" "}
        <code>git switch</code>, added in 2019 to split up the overloaded <code>git checkout</code>.
        Since Git 2.51 they&apos;re no longer marked experimental, and <code>checkout</code>{" "}
        isn&apos;t going away.
      </p>
    </StepLayout>
  );
}

/* 4 ─ Where it lives -------------------------------------------------------------------------------- */

export function WhereItLives() {
  return (
    <StepLayout
      eyebrow="Explore"
      title="Where each area lives on disk"
      stage={
        <div className="flex flex-1 flex-col justify-center gap-2">
          {[
            ["Working tree", "my-project/", "The ordinary files you open in your editor."],
            [
              "Index",
              "my-project/.git/index",
              "One binary file listing the exact blob for every path in the next commit.",
            ],
            [
              "Repository",
              "my-project/.git/objects/",
              "Every blob, tree and commit ever committed, compressed.",
            ],
          ].map(([t, p, b], i) => (
            <motion.div
              key={t}
              initial={{ opacity: 0, x: -6 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1 * i }}
              className="border-line bg-surface grid grid-cols-[6.5rem_1fr] gap-2 rounded-lg border px-3 py-2 text-xs"
            >
              <span className="font-semibold">{t}</span>
              <span>
                <code className="text-accent font-mono">{p}</code>
                <span className="text-muted block">{b}</span>
              </span>
            </motion.div>
          ))}
        </div>
      }
    >
      <p>
        Staging a file writes its content as a blob straight away and records it in the index. So
        even before you commit, staged work is safely stored inside <code>.git</code>.
      </p>
      <p>
        Delete the <code>.git</code> folder and you&apos;re left with just the working tree: the
        files, with no history at all.
      </p>
    </StepLayout>
  );
}

/* 5 ─ Checkpoint ----------------------------------------------------------------------------------- */

export function AreasCheck() {
  return (
    <StepLayout
      eyebrow="Checkpoint"
      title="Where is the change now?"
      stage={
        <div className="flex flex-1 flex-col justify-center">
          <SortCheckpoint
            id="git-areas"
            prompt="After each step, where does the change sit?"
            categories={[
              { id: "wt", label: "Working tree" },
              { id: "ix", label: "Index" },
              { id: "repo", label: "Repository" },
            ]}
            items={[
              {
                id: "edit",
                label: "You just saved a file in your editor",
                category: "wt",
                why: "Not staged yet.",
              },
              {
                id: "add",
                label: "You ran git add on it",
                category: "ix",
                why: "Staged for the next commit.",
              },
              {
                id: "commit",
                label: "You ran git commit",
                category: "repo",
                why: "Recorded in a snapshot.",
              },
              {
                id: "unstage",
                label: "You staged it, then ran git restore --staged",
                category: "wt",
                why: "Back to unstaged.",
              },
              {
                id: "new",
                label: "A brand-new file nobody has added",
                category: "wt",
                why: "Untracked (??).",
              },
              {
                id: "half",
                label: "The hunk you skipped during git add -p",
                category: "wt",
                why: "Only the chosen hunks were staged.",
              },
            ]}
            explanation="Edits start in the working tree, git add moves them to the index, and git commit records the index as a snapshot."
          />
        </div>
      }
    >
      <p>Sort each change.</p>
    </StepLayout>
  );
}

/* 6 ─ Wrap ----------------------------------------------------------------------------------------- */

export function Wrap() {
  return (
    <WrapStep
      points={[
        ["Working tree", "The files you edit."],
        ["Index", "What the next commit will contain."],
        ["Repository", "Every committed snapshot, in .git."],
        ["Stage part of a change", "git add -p makes focused commits."],
        ["Read the status codes", "Left: staged. Right: not staged. ??: untracked."],
      ]}
    >
      <p>Next: commits chain together into history, and HEAD marks where you are in it.</p>
    </WrapStep>
  );
}
