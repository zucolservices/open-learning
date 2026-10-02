"use client";

import { motion } from "motion/react";
import { Check, Clock, Loader2, Minus, X } from "lucide-react";
import { useSceneState } from "@/lib/module-sdk";
import { StepLayout } from "@/toolkit/layout/step-layout";
import { OrderCheckpoint } from "@/toolkit/checkpoints/order";
import { FrameCaption, Stepper } from "@/toolkit/controls/stepper";
import { Segmented } from "@/toolkit/controls/segmented";
import { Term } from "@/toolkit/glossary/term";
import { cn } from "@/lib/cn";
import {
  PARTS,
  PLATFORMS,
  ROWS,
  YAML,
  frames,
  type Actor,
  type JobState,
  type Platform,
} from "./model";
import type { AnatomyState } from "./state";

/* 1 ─ A recipe kept with the code ----------------------------------------------------------------- */

export function Recipe() {
  const [s, set] = useSceneState<AnatomyState>();
  const part = PARTS[s.part];
  return (
    <StepLayout
      eyebrow="Explore"
      title="A recipe kept with the code"
      stage={
        <div className="flex flex-1 flex-col justify-center gap-3 lg:flex-row lg:items-center">
          <pre className="bg-surface-2 rounded-xl px-2 py-2 font-mono text-[10.5px] leading-[1.55] lg:w-1/2">
            {YAML.map((l, i) => (
              <button
                key={i}
                type="button"
                disabled={!l.part}
                onClick={() => l.part && set({ part: l.part })}
                className={cn(
                  "block w-full rounded px-1.5 text-left whitespace-pre",
                  l.part === s.part
                    ? "bg-accent-soft text-fg"
                    : l.part
                      ? "text-muted hover:bg-surface hover:text-fg"
                      : "text-subtle",
                )}
              >
                {l.text}
              </button>
            ))}
          </pre>
          <motion.div
            key={s.part}
            initial={{ opacity: 0, x: 6 }}
            animate={{ opacity: 1, x: 0 }}
            className="border-accent/50 bg-accent-soft rounded-xl border px-4 py-3 lg:w-1/2"
          >
            <p className="text-accent text-xs font-medium tracking-wide uppercase">{s.part}</p>
            <p className="mt-1 font-semibold">{part.name}</p>
            <p className="text-muted mt-1 text-sm">{part.text}</p>
          </motion.div>
        </div>
      }
    >
      <p>
        A kitchen runs on recipe cards: what to cook when an order comes in, step by step, and which
        cook does what. A <Term id="pipeline">pipeline</Term> is the same idea for code: a file,
        kept in the repository, that says what to do whenever the code changes.
      </p>
      <p>
        This one is a GitHub Actions <Term id="workflow">workflow</Term>. Click any line to see
        which part of the recipe it is: the <Term id="trigger">trigger</Term>, the{" "}
        <Term id="ci-job">jobs</Term>, the <Term id="runner">runner</Term>, the steps and the{" "}
        <Term id="artifact">artifact</Term> it keeps.
      </p>
    </StepLayout>
  );
}

/* 2 ─ One push, start to finish ⭐ ---------------------------------------------------------------- */

const NODES: { id: Actor; label: string; x: number; y: number; w: number }[] = [
  { id: "dev", label: "Priya", x: 4, y: 40, w: 48 },
  { id: "host", label: "Git host", x: 64, y: 40, w: 58 },
  { id: "pr", label: "Pull request", x: 60, y: 96, w: 66 },
  { id: "ci", label: "CI service", x: 136, y: 40, w: 62 },
  { id: "queue", label: "Queue", x: 136, y: 96, w: 62 },
  { id: "lint", label: "lint", x: 214, y: 14, w: 52 },
  { id: "test", label: "test", x: 214, y: 66, w: 52 },
  { id: "build", label: "build", x: 280, y: 40, w: 52 },
  { id: "store", label: "Artifacts", x: 280, y: 96, w: 52 },
];

const EDGES: [Actor, Actor][] = [
  ["dev", "host"],
  ["host", "ci"],
  ["ci", "queue"],
  ["queue", "lint"],
  ["queue", "test"],
  ["lint", "build"],
  ["test", "build"],
  ["build", "store"],
  ["ci", "pr"],
];

const JOB_ICON: Record<JobState, typeof Check> = {
  idle: Minus,
  queued: Clock,
  running: Loader2,
  pass: Check,
  fail: X,
  skipped: Minus,
};

function centre(id: Actor) {
  const n = NODES.find((x) => x.id === id)!;
  return { x: n.x + n.w / 2, y: n.y + 11 };
}

function Flow({ active, jobs }: { active: Actor[]; jobs: Record<string, JobState> }) {
  return (
    <svg viewBox="0 0 340 124" className="mx-auto w-full max-w-xl" fill="none">
      {EDGES.map(([a, b]) => {
        const p = centre(a);
        const q = centre(b);
        const on = active.includes(a) && active.includes(b);
        return (
          <line
            key={`${a}-${b}`}
            x1={p.x}
            y1={p.y}
            x2={q.x}
            y2={q.y}
            className={on ? "stroke-accent" : "stroke-line-strong"}
            strokeWidth={on ? 1.6 : 1}
            strokeDasharray={on ? undefined : "2 2"}
          />
        );
      })}
      {NODES.map((n) => {
        const on = active.includes(n.id);
        const job = (jobs as Record<string, JobState | undefined>)[n.id];
        return (
          <g key={n.id}>
            <rect x={n.x} y={n.y} width={n.w} height={22} rx={5} className="fill-surface" />
            <rect
              x={n.x}
              y={n.y}
              width={n.w}
              height={22}
              rx={5}
              className={cn(
                job === "fail"
                  ? "fill-bad/20 stroke-bad"
                  : job === "pass"
                    ? "fill-good/15 stroke-good"
                    : on
                      ? "fill-accent/20 stroke-accent"
                      : "fill-surface stroke-line-strong",
              )}
              strokeWidth={on ? 1.6 : 1}
            />
            <text
              x={n.x + n.w / 2}
              y={n.y + 14}
              textAnchor="middle"
              className={cn("font-mono text-[8px]", job === "skipped" ? "fill-subtle" : "fill-fg")}
            >
              {n.label}
            </text>
          </g>
        );
      })}
    </svg>
  );
}

export function OnePush() {
  const [s, set] = useSceneState<AnatomyState>();
  const fs = frames(s.fail);
  const frame = Math.min(s.frame, fs.length - 1);
  const f = fs[frame];
  const tone = f.jobs.test === "fail" ? "bad" : frame === fs.length - 1 ? "good" : undefined;
  return (
    <StepLayout
      eyebrow="Step-through"
      title="One push, start to finish"
      stage={
        <div className="flex flex-1 flex-col justify-center gap-3">
          <div>
            <Segmented<"pass" | "fail">
              size="sm"
              value={s.fail ? "fail" : "pass"}
              onChange={(v) => set({ fail: v === "fail" })}
              options={[
                ["pass", "All tests pass"],
                ["fail", "A test fails"],
              ]}
            />
          </div>
          <Flow active={f.active} jobs={f.jobs} />
          <div className="flex flex-wrap gap-2">
            {(["lint", "test", "build"] as const).map((j) => {
              const st = f.jobs[j];
              const Icon = JOB_ICON[st];
              return (
                <span
                  key={j}
                  className={cn(
                    "flex items-center gap-1 rounded-full border px-2 py-0.5 font-mono text-[10px]",
                    st === "pass"
                      ? "border-good/50 text-good"
                      : st === "fail"
                        ? "border-bad/60 text-bad"
                        : "border-line text-muted",
                  )}
                >
                  <Icon className={cn("size-3", st === "running" && "animate-spin")} />
                  {j}
                </span>
              );
            })}
          </div>
          <Stepper step={frame} count={fs.length} onChange={(n) => set({ frame: n })} />
          <FrameCaption frameKey={`${s.fail}-${frame}`} title={f.title} tone={tone}>
            {f.text}
          </FrameCaption>
        </div>
      }
    >
      <p>
        Follow one push from the moment it leaves a laptop to the tick on the pull request. Then
        switch to &ldquo;A test fails&rdquo; and step through again.
      </p>
      <p>
        Two ideas carry everything else. Every job starts on a fresh machine, so it behaves the same
        for everyone, every time. And every step either exits with code 0 or fails the job, so the
        result is never a matter of opinion.
      </p>
      <p>
        The tick it leaves is a <Term id="status-check">status check</Term>. Branch rules can
        require it before anyone may merge.
      </p>
    </StepLayout>
  );
}

/* 3 ─ Same ideas, different words ----------------------------------------------------------------- */

export function SameIdeas() {
  const [s, set] = useSceneState<AnatomyState>();
  return (
    <StepLayout
      eyebrow="Compare"
      title="Same ideas, different words"
      stage={
        <div className="flex flex-1 flex-col justify-center gap-3">
          <div className="flex flex-wrap gap-1.5">
            {PLATFORMS.map((p) => (
              <button
                key={p}
                type="button"
                onClick={() => set({ platform: p })}
                className={cn(
                  "rounded-full border px-3 py-1 text-xs",
                  s.platform === p
                    ? "border-accent bg-accent-soft"
                    : "border-line hover:bg-surface-2",
                )}
              >
                {p}
              </button>
            ))}
          </div>
          <div className="border-line bg-surface overflow-hidden rounded-xl border">
            {ROWS.map(([idea, names], i) => (
              <div
                key={idea}
                className={cn(
                  "grid grid-cols-[8.5rem_1fr] gap-2 px-3 py-2 text-sm",
                  i > 0 && "border-line border-t",
                )}
              >
                <span className="text-muted text-xs">{idea}</span>
                <motion.span
                  key={`${s.platform}-${idea}`}
                  initial={{ opacity: 0, x: 4 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.03 * i }}
                  className="font-mono text-xs"
                >
                  {names[s.platform as Platform]}
                </motion.span>
              </div>
            ))}
          </div>
        </div>
      }
    >
      <p>
        Every CI product has the same skeleton: a file in the repository, triggers, units of work on
        machines, steps inside them, and results reported back. Only the words change.
      </p>
      <p>
        Jenkins, the veteran, began in 2004–05 as Hudson at Sun Microsystems and took its new name
        in 2011. Tekton runs each step as a container in a Kubernetes cluster. Learn the skeleton
        once and any of them reads easily.
      </p>
    </StepLayout>
  );
}

/* 4 ─ Put it in order ----------------------------------------------------------------------------- */

export function InOrder() {
  return (
    <StepLayout
      eyebrow="Checkpoint"
      title="Put it in order"
      stage={
        <div className="flex flex-1 flex-col justify-center">
          <OrderCheckpoint
            id="push-order"
            prompt="Drag these into the order they happen after a push."
            items={[
              { id: "push", label: "The developer pushes a commit" },
              { id: "event", label: "The Git host fires an event" },
              { id: "read", label: "The CI service reads the pipeline file from that commit" },
              { id: "queue", label: "Jobs wait in a queue for a runner" },
              { id: "run", label: "A fresh runner checks out the code and runs the steps" },
              { id: "report", label: "The result is reported back as a check on the commit" },
            ]}
            explanation="Event, recipe, queue, machine, result. The file is read from the pushed commit itself, which is why a branch can change its own pipeline."
          />
        </div>
      }
    >
      <p>Six moments, one push. Drag them into order.</p>
    </StepLayout>
  );
}

/* 5 ─ Wrap ---------------------------------------------------------------------------------------- */

const POINTS: [string, string][] = [
  ["Pipeline as code", "The recipe lives in the repository, reviewed like any change."],
  ["Triggers", "Push, pull request, schedule or a button."],
  ["Jobs on fresh machines", "Each job starts clean; artifacts carry files between them."],
  ["Exit codes decide", "Zero passes; anything else fails the job and stops what depends on it."],
  ["Checks gate merges", "The result returns to the commit, where branch rules can require it."],
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
        That&apos;s the whole machine. The next chapter fills it in: builds that come out the same
        every time, tests worth trusting, pipelines fast enough to wait for, and rules for what may
        reach main.
      </p>
    </StepLayout>
  );
}
