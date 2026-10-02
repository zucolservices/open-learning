"use client";

import { motion } from "motion/react";
import { useSceneState } from "@/lib/module-sdk";
import { StepLayout } from "@/toolkit/layout/step-layout";
import { ChoiceCheckpoint } from "@/toolkit/checkpoints/choice";
import { FrameCaption, Stepper } from "@/toolkit/controls/stepper";
import { Segmented } from "@/toolkit/controls/segmented";
import { Term } from "@/toolkit/glossary/term";
import { cn } from "@/lib/cn";
import { DAYS, DEVS, FILES, LIVES, simulate, type Life } from "./model";
import type { BranchState, Flow } from "./state";

/* 1 ─ Save points and copies --------------------------------------------------------------------- */

type Dot = { x: number; lane: 0 | 1; bad?: boolean };

/** A tiny commit graph, revealed frame by frame. */
const GRAPH: { dots: Dot[]; branch: boolean; merge?: "clean" | "conflict" }[] = [
  { dots: [{ x: 30, lane: 0 }], branch: false },
  {
    dots: [
      { x: 30, lane: 0 },
      { x: 80, lane: 0 },
      { x: 130, lane: 0 },
    ],
    branch: false,
  },
  {
    dots: [
      { x: 30, lane: 0 },
      { x: 80, lane: 0 },
      { x: 130, lane: 0 },
      { x: 180, lane: 1 },
      { x: 230, lane: 1 },
      { x: 200, lane: 0 },
    ],
    branch: true,
  },
  {
    dots: [
      { x: 30, lane: 0 },
      { x: 80, lane: 0 },
      { x: 130, lane: 0 },
      { x: 180, lane: 1 },
      { x: 230, lane: 1 },
      { x: 200, lane: 0 },
      { x: 280, lane: 0 },
    ],
    branch: true,
    merge: "clean",
  },
  {
    dots: [
      { x: 30, lane: 0 },
      { x: 80, lane: 0 },
      { x: 130, lane: 0 },
      { x: 180, lane: 1 },
      { x: 230, lane: 1 },
      { x: 200, lane: 0 },
      { x: 280, lane: 0, bad: true },
    ],
    branch: true,
    merge: "conflict",
  },
];

const FRAMES: { title: string; text: string; code: string }[] = [
  {
    title: "A commit is a save point",
    text: "Version control records every change as a commit: what changed, who changed it, when and why. You can always go back to any save point.",
    code: 'git commit -m "Add delivery charge"',
  },
  {
    title: "Main is the shared line",
    text: "Commits pile up one after another on the main branch, the version everyone shares and the one that gets released.",
    code: "main: A → B → C",
  },
  {
    title: "A branch is a parallel copy",
    text: "To work without disturbing others, you branch: your commits go on a separate line while main moves on with other people's work.",
    code: "git switch -c delivery-charge",
  },
  {
    title: "A merge joins them back",
    text: "When you're done, you merge your branch into main. If you and others touched different lines, Git combines the work by itself.",
    code: "git merge delivery-charge  ✓",
  },
  {
    title: "A conflict needs a person",
    text: "If you changed the same part of the same file differently on both sides, Git can't choose. Someone has to read both versions and decide.",
    code: "CONFLICT (content): Merge conflict in checkout.ts",
  },
];

function Graph({ frame }: { frame: number }) {
  const g = GRAPH[frame];
  const y = (lane: number) => (lane === 0 ? 70 : 30);
  return (
    <svg viewBox="0 0 320 100" className="w-full" fill="none" strokeLinecap="round">
      <path
        d={`M30 70H${Math.max(...g.dots.filter((d) => d.lane === 0).map((d) => d.x))}`}
        className="stroke-fg"
        strokeWidth={2}
      />
      {g.branch && (
        <motion.path
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
          d={`M130 70C150 30 160 30 180 30H230${g.merge ? "C250 30 260 70 280 70" : ""}`}
          className={g.merge === "conflict" ? "stroke-bad" : "stroke-accent"}
          strokeWidth={2}
        />
      )}
      {g.dots.map((d, i) => (
        <motion.circle
          key={`${d.x}-${d.lane}`}
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.05 * i }}
          cx={d.x}
          cy={y(d.lane)}
          r={d.x === 280 ? 8 : 6}
          className={
            d.bad
              ? "fill-bad/30 stroke-bad"
              : d.lane === 1
                ? "fill-accent/30 stroke-accent"
                : "fill-surface stroke-fg"
          }
          strokeWidth={1.6}
        />
      ))}
      <text x={20} y={92} className="fill-muted font-mono text-[8px]">
        main
      </text>
      {g.branch && (
        <text x={176} y={16} className="fill-accent font-mono text-[8px]">
          your branch
        </text>
      )}
    </svg>
  );
}

export function SavePoints() {
  const [s, set] = useSceneState<BranchState>();
  const f = FRAMES[s.frame];
  return (
    <StepLayout
      eyebrow="Analogy"
      title="Save points and parallel copies"
      stage={
        <div className="flex flex-1 flex-col justify-center gap-3">
          <Graph frame={s.frame} />
          <code className="bg-surface-2 self-start rounded px-2 py-1 font-mono text-[11px]">
            {f.code}
          </code>
          <Stepper step={s.frame} count={FRAMES.length} onChange={(frame) => set({ frame })} />
          <FrameCaption frameKey={s.frame} title={f.title} tone={s.frame === 4 ? "bad" : undefined}>
            {f.text}
          </FrameCaption>
        </div>
      }
    >
      <p>
        Think of a shared document with unlimited undo, where everyone can work on their own copy
        and fold it back in. That is <Term id="version-control">version control</Term>, and{" "}
        <Term id="git">Git</Term> is the one nearly everyone uses: 94% of respondents to Stack
        Overflow&apos;s 2022 survey, the last that asked.
      </p>
      <p>
        Linus Torvalds made the first commit to Git on 7 April 2005, to manage the Linux kernel.
        Step through the four ideas that matter: <Term id="commit">commits</Term>,{" "}
        <Term id="branch">branches</Term>, merges and <Term id="merge-conflict">conflicts</Term>.
      </p>
    </StepLayout>
  );
}

/* 2 ─ How long should a branch live? ⭐ ---------------------------------------------------------- */

const LIFE_LABEL: Record<Life, string> = {
  10: "2 weeks",
  5: "1 week",
  2: "2 days",
  1: "1 day",
};

export function BranchLife() {
  const [s, set] = useSceneState<BranchState>();
  const r = simulate(s.life);
  const worst = Math.max(...r.merges.map((m) => m.tangles));
  const clean = r.merges.filter((m) => m.conflicts.length === 0).length;
  const maxT = 156; // largest single merge across all settings, for a fixed scale
  return (
    <StepLayout
      eyebrow="Simulation"
      title="How long should a branch live?"
      stage={
        <div className="flex flex-1 flex-col justify-center gap-3">
          <div className="flex flex-col items-start gap-1 sm:flex-row sm:items-center sm:gap-2">
            <span className="text-muted text-xs">Merge every</span>
            <Segmented<`${Life}`>
              size="sm"
              value={`${s.life}` as `${Life}`}
              onChange={(v) => set({ life: Number(v) as Life })}
              options={LIVES.map((l) => [`${l}` as `${Life}`, LIFE_LABEL[l]])}
            />
          </div>
          <div className="border-line bg-surface rounded-xl border p-2">
            <div className="text-muted mb-1 grid grid-cols-[3rem_1fr] font-mono text-[9px]">
              <span />
              <div className="flex justify-between">
                <span>day 1</span>
                <span>day {DAYS}</span>
              </div>
            </div>
            {DEVS.map((d, di) => (
              <div key={d} className="grid grid-cols-[3rem_1fr] items-center py-0.5">
                <span className="text-[10px]">{d}</span>
                <div className="relative h-6">
                  {r.merges
                    .filter((m) => m.dev === di)
                    .map((m) => {
                      const left = (m.start / DAYS) * 100;
                      const width = ((m.end - m.start + 1) / DAYS) * 100;
                      const size = 6 + (m.tangles / maxT) * 16;
                      return (
                        <div
                          key={m.start}
                          className="absolute inset-y-1"
                          style={{ left: `${left}%`, width: `${width}%` }}
                        >
                          <div className="bg-accent/20 border-accent/50 absolute inset-y-1 right-2 left-0 rounded-sm border" />
                          <motion.span
                            key={`${s.life}-${m.start}`}
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            title={
                              m.conflicts.length
                                ? `Conflicts in ${m.conflicts.map((f) => FILES[f]).join(", ")}`
                                : "Clean merge"
                            }
                            className={cn(
                              "absolute top-1/2 right-0 translate-x-1/2 -translate-y-1/2 rounded-full border",
                              m.conflicts.length
                                ? "border-bad bg-bad/40"
                                : "border-good bg-good/40",
                            )}
                            style={{ width: size, height: size }}
                          />
                        </div>
                      );
                    })}
                </div>
              </div>
            ))}
            <p className="text-muted mt-1 font-mono text-[9px]">
              bar = a branch · dot = its merge, sized by the edits to untangle · green = clean
            </p>
          </div>
          <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
            {[
              ["Merges", `${r.merges.length}`, false],
              ["Clean merges", `${clean}`, false],
              ["Edits to untangle", `${r.tangles}`, r.tangles > 500],
              ["Worst single merge", `${worst}`, worst > 40],
            ].map(([l, v, bad]) => (
              <div
                key={l as string}
                className="border-line bg-surface rounded-lg border px-2 py-1.5"
              >
                <p className="text-muted text-[10px]">{l}</p>
                <p className={cn("font-mono text-sm font-semibold", bad && "text-bad")}>{v}</p>
              </div>
            ))}
          </div>
          <p className="text-muted text-[10px]">
            Illustrative model: 5 people, 20 days, 12 files, two edits each per day (the same edits
            every time). &ldquo;Edits to untangle&rdquo; counts your edits × others&apos; edits to
            each file you both changed since your branch began.
          </p>
        </div>
      }
    >
      <p>
        Five developers do exactly the same work in every run. Only one thing changes: how long each
        branch lives before it is merged.
      </p>
      <p>
        With two-week branches, each merge drags in everything everyone else did in that time, and
        there are{" "}
        <span className="text-fg font-semibold">{simulate(10).tangles} overlapping edits</span> to
        untangle. Merge daily and the same work leaves {simulate(1).tangles}, and half the merges
        are clean.
      </p>
      <p>
        Google&apos;s code review guide says the same about big changes (a CL is Google&apos;s word
        for one): &ldquo;Working on a large CL takes a long time, so you will have lots of conflicts
        when you merge.&rdquo;
      </p>
    </StepLayout>
  );
}

/* 3 ─ Three ways to branch ------------------------------------------------------------------------ */

const FLOWS: Record<
  Flow,
  { name: string; lanes: string[]; how: string; fits: string; quote: string; who: string }
> = {
  gitflow: {
    name: "GitFlow",
    lanes: ["main (releases)", "release/1.4", "develop", "feature/…  (weeks)"],
    how: "Long-lived develop and main branches, plus feature, release and hotfix branches. Published by Vincent Driessen in 2010.",
    fits: "Software shipped as numbered versions, with several versions supported at once: libraries, installed apps, firmware.",
    quote:
      "If your team is doing continuous delivery of software, I would suggest to adopt a much simpler workflow (like GitHub flow) instead.",
    who: "Vincent Driessen, note added in 2020",
  },
  github: {
    name: "GitHub flow",
    lanes: ["main (always deployable)", "short branch + pull request"],
    how: "One main branch that is always deployable. Each change is a short branch with a pull request, reviewed, merged and deployed.",
    fits: "Web apps and services deployed continuously, with a review on every change. With branches that last hours, it is trunk-based in practice.",
    quote: "GitHub flow is a lightweight, branch-based workflow.",
    who: "GitHub docs",
  },
  trunk: {
    name: "Trunk-based",
    lanes: ["trunk (main)", "tiny branch, hours"],
    how: "Everyone merges into one trunk at least daily, through tiny branches or straight commits. Unfinished work hides behind feature flags.",
    fits: "Teams aiming for continuous integration and delivery; it scales, too: Google keeps one trunk for 25,000+ developers.",
    quote:
      "Have three or fewer active branches … Merge branches to trunk at least once a day. Don't have code freezes and don't have integration phases.",
    who: "DORA",
  },
};

export function ThreeFlows() {
  const [s, set] = useSceneState<BranchState>();
  const f = FLOWS[s.flow];
  return (
    <StepLayout
      eyebrow="Compare"
      title="Three ways to branch"
      stage={
        <div className="flex flex-1 flex-col justify-center gap-3">
          <Segmented<Flow>
            size="sm"
            value={s.flow}
            onChange={(flow) => set({ flow })}
            options={[
              ["gitflow", "GitFlow"],
              ["github", "GitHub flow"],
              ["trunk", "Trunk-based"],
            ]}
          />
          <motion.div
            key={s.flow}
            initial={{ opacity: 0, y: 4 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-col gap-1.5"
          >
            {f.lanes.map((l, i) => (
              <div key={l} className="grid grid-cols-[9.5rem_1fr] items-center gap-2">
                <span className="truncate font-mono text-[10px]">{l}</span>
                <div className="relative h-3">
                  <div
                    className={cn(
                      "absolute inset-y-1 rounded-full",
                      i === 0 ? "bg-fg" : "bg-accent/60",
                    )}
                    style={{
                      left: i === 0 ? "0%" : `${8 + i * 6}%`,
                      right: i === 0 ? "0%" : s.flow === "gitflow" ? "6%" : "70%",
                    }}
                  />
                  {i > 0 &&
                    s.flow !== "gitflow" &&
                    [0, 1, 2, 3].map((k) => (
                      <div
                        key={k}
                        className="bg-accent/60 absolute inset-y-1 rounded-full"
                        style={{ left: `${30 + k * 18}%`, width: "6%" }}
                      />
                    ))}
                </div>
              </div>
            ))}
            <div className="mt-2 grid gap-2 sm:grid-cols-2">
              <div className="border-line bg-surface rounded-lg border px-3 py-2">
                <p className="text-xs font-semibold">How it works</p>
                <p className="text-muted text-xs">{f.how}</p>
              </div>
              <div className="border-line bg-surface rounded-lg border px-3 py-2">
                <p className="text-xs font-semibold">Fits best</p>
                <p className="text-muted text-xs">{f.fits}</p>
              </div>
            </div>
            <blockquote className="border-accent rounded-r-lg border-l-2 px-3 py-1">
              <p className="text-muted text-sm">&ldquo;{f.quote}&rdquo;</p>
              <p className="text-muted text-xs">— {f.who}</p>
            </blockquote>
          </motion.div>
        </div>
      }
    >
      <p>
        Teams settle on a branching strategy: a shared agreement on which branches exist, how long
        they live and how work reaches main.
      </p>
      <p>
        <Term id="trunk-based-development">Trunk-based development</Term> doesn&apos;t mean no
        branches or no review. Short branches with a <Term id="pull-request">pull request</Term> are
        normal; what matters is that they live hours, not weeks. Release branches are fine too: fix
        on trunk, then copy the fix across.
      </p>
      <p>
        GitFlow isn&apos;t wrong, its author says; it just suits versioned software better than a
        web app deployed every day.
      </p>
    </StepLayout>
  );
}

/* 4 ─ A three-week feature ------------------------------------------------------------------------ */

export function ThreeWeekFeature() {
  return (
    <StepLayout
      eyebrow="Checkpoint"
      title="A three-week feature"
      stage={
        <div className="flex flex-1 flex-col justify-center">
          <ChoiceCheckpoint
            id="three-week-feature"
            prompt="A new payment method will take three weeks. How should it reach main?"
            options={[
              {
                id: "end",
                label: "On its own branch, merged once when it's finished",
                feedback:
                  "Three weeks of everyone else's changes arrive in one merge: the two-week row in the simulation, only worse.",
              },
              {
                id: "pull",
                label: "On its own branch, merging main into it every day",
                feedback:
                  "You see others' work, but they never see yours until week three. Integration has to go both ways.",
              },
              {
                id: "flag",
                label:
                  "In small pieces merged daily, hidden behind a feature flag until it's ready",
                correct: true,
                feedback:
                  "Everyone's work stays joined every day, and users see nothing until the flag is turned on.",
              },
              {
                id: "freeze",
                label: "Pause other work on checkout for three weeks to avoid conflicts",
                feedback:
                  "That trades conflicts for a stalled team, and the merge still comes at the end.",
              },
            ]}
            explanation="Pete Hodgson calls these release toggles: feature flags that let unfinished work ship as latent code that isn't switched on yet. You'll build one in the Feature flags module."
          />
        </div>
      }
    >
      <p>
        Some work really does take weeks. The trick is to integrate it daily without showing it to
        users. A <Term id="feature-flag">feature flag</Term> is one way.
      </p>
    </StepLayout>
  );
}

/* 5 ─ Wrap ---------------------------------------------------------------------------------------- */

const POINTS: [string, string][] = [
  ["Commits and branches", "Save points, and parallel copies you merge back."],
  ["Conflicts grow with time apart", "The longer a branch lives, the more there is to untangle."],
  ["Merge at least daily", "Short branches and pull requests, measured in hours."],
  ["Pick the flow for the product", "GitFlow for versioned releases; trunk-based for services."],
  ["Hide, don't hold back", "Unfinished work goes in behind a flag, not on a long branch."],
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
        A clean merge only means Git found no overlapping lines. It doesn&apos;t prove the joined
        code works, which is why every merge needs a build and tests.
      </p>
      <p>Next: the machine that runs those checks on every change, the pipeline.</p>
    </StepLayout>
  );
}
