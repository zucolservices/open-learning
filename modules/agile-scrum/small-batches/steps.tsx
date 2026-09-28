"use client";

import { motion } from "motion/react";
import { useSceneState } from "@/lib/module-sdk";
import { StepLayout } from "@/toolkit/layout/step-layout";
import { ChoiceCheckpoint } from "@/toolkit/checkpoints/choice";
import { SortCheckpoint } from "@/toolkit/checkpoints/sort";
import { Segmented } from "@/toolkit/controls/segmented";
import { Code, FrameCaption, Stepper } from "@/toolkit/controls/stepper";
import { Term } from "@/toolkit/glossary/term";
import { cn } from "@/lib/cn";
import { INTERVALS, outcome, type Interval } from "./model";
import type { BatchState } from "./state";

/* 1 ─ The group project ------------------------------------------------------------------------ */

const FRIENDS = ["Asha", "Ben", "Chitra", "Dev"];

function Timeline({ daily }: { daily: boolean }) {
  const W = 360;
  const X0 = 50;
  const X1 = 340;
  const merges = daily ? Array.from({ length: 10 }, (_, i) => i + 1) : [10];
  const x = (d: number) => X0 + (d / 10) * (X1 - X0);
  return (
    <svg
      viewBox={`0 0 ${W} 170`}
      className="w-full"
      role="img"
      aria-label="Four copies of a report and when they are merged"
    >
      <line x1={X0} x2={X1} y1={20} y2={20} className="stroke-accent" strokeWidth={3} />
      <text x={X0 - 6} y={23} textAnchor="end" className="fill-fg text-[8px] font-semibold">
        Shared
      </text>
      {FRIENDS.map((f, i) => {
        const y = 50 + i * 28;
        return (
          <g key={f}>
            <text x={X0 - 6} y={y + 3} textAnchor="end" className="fill-muted text-[8px]">
              {f}
            </text>
            <line
              x1={X0}
              x2={X1}
              y1={y}
              y2={y}
              className="stroke-line-strong"
              strokeDasharray="3 3"
            />
            {merges.map((d) => (
              <motion.line
                key={d}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.04 * d + 0.03 * i }}
                x1={x(d)}
                x2={x(d)}
                y1={y}
                y2={22}
                className="stroke-accent/50"
              />
            ))}
          </g>
        );
      })}
      {merges.map((d) => {
        const r = daily ? 3 : 14;
        return (
          <motion.circle
            key={d}
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.05 * d + 0.2 }}
            cx={x(d)}
            cy={20}
            r={r}
            className="fill-bad/70"
          />
        );
      })}
      {[0, 5, 10].map((d) => (
        <text key={d} x={x(d)} y={165} textAnchor="middle" className="fill-muted text-[8px]">
          day {d}
        </text>
      ))}
    </svg>
  );
}

export function GroupProject() {
  const [s, set] = useSceneState<BatchState>();
  const daily = s.merge === "daily";
  return (
    <StepLayout
      eyebrow="Analogy"
      title="The group project"
      stage={
        <div className="flex flex-1 flex-col justify-center gap-3">
          <Segmented
            value={s.merge}
            options={[
              ["end", "Merge the night before"],
              ["daily", "Merge every day"],
            ]}
            onChange={(v) => set({ merge: v })}
          />
          <Timeline key={s.merge} daily={daily} />
          <FrameCaption
            frameKey={s.merge}
            title={daily ? "Ten small merges" : "One big merge"}
            tone={daily ? "good" : "bad"}
          >
            {daily
              ? "Each evening, a clash or two: two people edited the same paragraph, fixed in a minute while it's fresh. The report always reads as one document."
              : "Day 10, midnight: four versions with different headings, clashing numbers and two conclusions. Every clash has to be untangled at once, from memory, under deadline."}
          </FrameCaption>
          <p className="text-muted text-xs">Red circles: clashes to sort out. Illustrative.</p>
        </div>
      }
    >
      <p>
        Four friends write a 10-day group report. They can each keep a private copy and stitch the
        copies together the night before it&apos;s due, or copy their changes into the shared
        document every evening.
      </p>
      <p>
        Merging daily feels like extra work. Try both. Software teams face exactly this choice: how
        long each person&apos;s changes stay apart before joining everyone else&apos;s.
      </p>
    </StepLayout>
  );
}

/* 2 ─ Batch-size lab ⭐ (simulation) ----------------------------------------------------------- */

const OPTS = INTERVALS.map((d) => [String(d), d === 1 ? "daily" : `${d} days`] as [string, string]);
const SEGMENTS: [keyof ReturnType<typeof outcome>, string, string][] = [
  ["merge", "Merging", "bg-viz-meta"],
  ["release", "Release overhead", "bg-viz-compute"],
  ["cleanup", "Broken-release clean-up", "bg-bad/70"],
];
const MAXH = 225;

export function BatchLab() {
  const [s, set] = useSceneState<BatchState>();
  const o = outcome(s.integrate, s.release, s.auto);
  const bars = INTERVALS.map((r) => ({ r, o: outcome(s.integrate, r, s.auto) }));
  const setIntegrate = (v: Interval) =>
    set({ integrate: v, release: Math.max(v, s.release) as Interval });
  return (
    <StepLayout
      eyebrow="Simulation"
      title="Batch-size lab"
      stage={
        <div className="flex flex-1 flex-col gap-3">
          <div className="grid gap-2 sm:grid-cols-2">
            <div>
              <p className="text-muted mb-1 text-xs">Merge into the shared code every</p>
              <Segmented
                size="sm"
                value={String(s.integrate)}
                options={OPTS}
                onChange={(v) => setIntegrate(Number(v) as Interval)}
              />
            </div>
            <div>
              <p className="text-muted mb-1 text-xs">Release to users every</p>
              <Segmented
                size="sm"
                value={String(s.release)}
                options={OPTS.filter(([v]) => Number(v) >= s.integrate)}
                onChange={(v) => set({ release: Number(v) as Interval })}
              />
            </div>
          </div>
          <Segmented
            size="sm"
            value={s.auto ? "auto" : "manual"}
            options={[
              ["manual", "Manual testing & deploy (2 days)"],
              ["auto", "Automated tests & pipeline"],
            ]}
            onChange={(v) => set({ auto: v === "auto" })}
          />
          <div className="grid grid-cols-3 gap-2 text-center">
            {[
              ["Lead time", `${o.lead.toFixed(1)} days`, "code finished → users"],
              ["Team hours lost", `${Math.round(o.total)} h`, "per Sprint, of ~300"],
              ["Changes per release", `${o.perRelease}`, "to untangle if it breaks"],
            ].map(([k, v, d]) => (
              <div key={k} className="border-line bg-surface rounded-lg border px-2 py-1.5">
                <p className="text-muted text-[10px]">{k}</p>
                <p className="text-sm font-semibold tabular-nums">{v}</p>
                <p className="text-muted text-[9px] leading-tight">{d}</p>
              </div>
            ))}
          </div>
          <div>
            <p className="text-muted mb-1.5 text-xs">
              Hours lost per Sprint, by release interval (merging every{" "}
              {s.integrate === 1 ? "day" : `${s.integrate} days`})
            </p>
            <div className="flex flex-col gap-1.5">
              {bars.map(({ r, o: b }) => {
                const possible = r >= s.integrate;
                return (
                  <div key={r} className={cn("flex items-center gap-2", !possible && "opacity-30")}>
                    <span
                      className={cn(
                        "w-14 shrink-0 text-right text-[11px]",
                        r === s.release ? "text-accent font-semibold" : "text-muted",
                      )}
                    >
                      {r === 1 ? "daily" : `${r} days`}
                    </span>
                    <div className="bg-surface-2 flex h-4 flex-1 overflow-hidden rounded">
                      {possible &&
                        SEGMENTS.map(([k, , c]) => (
                          <motion.div
                            key={k}
                            initial={false}
                            animate={{ width: `${((b[k] as number) / MAXH) * 100}%` }}
                            className={cn("h-full", c)}
                          />
                        ))}
                    </div>
                    <span className="w-10 shrink-0 text-[11px] tabular-nums">
                      {possible ? `${Math.round(b.total)} h` : "—"}
                    </span>
                  </div>
                );
              })}
            </div>
            <div className="text-muted mt-2 flex flex-wrap gap-x-3 gap-y-1 text-[10px]">
              {SEGMENTS.map(([k, label, c]) => (
                <span key={k} className="flex items-center gap-1">
                  <span className={cn("size-2 rounded-sm", c)} /> {label}
                </span>
              ))}
            </div>
          </div>
        </div>
      }
    >
      <p>
        A team of five, 10-day Sprints. Choose how often they{" "}
        <Term id="continuous-integration">integrate</Term> (merge their work into the shared code)
        and how often they release. The size of each release is the{" "}
        <Term id="batch-size">batch size</Term>.
      </p>
      <p>
        Start with manual testing. Big, rare releases look <em>cheapest</em>, but users wait longer
        and every release bundles more changes. Now switch on automation and look again: the
        cheapest batch gets small.
      </p>
      <p className="text-muted text-xs">
        Made-up rates. The shape follows Don Reinertsen: smaller batches cut cycle time, speed up
        feedback and reduce risk, but each batch has an overhead, so the best size is a U-curve.
        Automation shrinks the overhead.
      </p>
    </StepLayout>
  );
}

/* 3 ─ What to fix first? ------------------------------------------------------------------------- */

export function ReleaseFirst() {
  return (
    <StepLayout
      eyebrow="Checkpoint"
      title="What to fix first?"
      stage={
        <div className="flex flex-1 flex-col justify-center">
          <ChoiceCheckpoint
            id="release-first"
            prompt="A team releases once a month. Every release needs two days of manual regression testing. The Product Owner wants features in users' hands sooner. What should the team do first?"
            options={[
              {
                id: "daily",
                label: "Start releasing every day",
                feedback:
                  "Two days of manual testing per release would swallow the whole Sprint. Lower the overhead first.",
              },
              {
                id: "automate",
                label: "Automate the regression tests and deployment steps",
                correct: true,
                feedback:
                  "Yes. Cutting the cost of each release is what makes smaller, more frequent releases affordable.",
              },
              {
                id: "bigger",
                label: "Release less often, so testing costs less per feature",
                feedback:
                  "That lowers overhead but makes users wait longer and each release riskier: the opposite of what's wanted.",
              },
              {
                id: "skip",
                label: "Skip regression testing for small changes",
                feedback: "That's undone work: technical debt that surfaces as broken releases.",
              },
            ]}
          />
        </div>
      }
    >
      <p>You saw in the lab why the answer isn&apos;t just &ldquo;release more often&rdquo;.</p>
    </StepLayout>
  );
}

/* 4 ─ Practices from XP -------------------------------------------------------------------------- */

const FRAMES: { title: string; code?: string; text: React.ReactNode; tone?: "good" | "bad" }[] = [
  {
    title: "Test first: red",
    code: `test("adds 18% GST", () => {
  expect(withGst(100)).toBe(118);
});

✗ withGst is not defined`,
    text: "Test-driven development: write a small test for the next bit of behaviour before the code. Run it and watch it fail. That proves the test can catch a problem.",
    tone: "bad",
  },
  {
    title: "Just enough code: green",
    code: `function withGst(price) {
  return price * 1.18;
}

✓ 1 test passing`,
    text: "Write the simplest code that makes the test pass. No more.",
    tone: "good",
  },
  {
    title: "Tidy up: refactor",
    code: `const GST_RATE = 0.18;

function withGst(price) {
  return price * (1 + GST_RATE);
}

✓ 1 test passing`,
    text: "Refactoring: improve the code's structure without changing what it does. The passing test is the safety net. Then repeat the red–green–refactor cycle for the next behaviour.",
  },
  {
    title: "Two people, one problem",
    text: "Pair programming: two developers at one screen, one typing, one reviewing and thinking ahead, swapping often. Review happens as the code is written, and knowledge spreads across the team.",
  },
  {
    title: "Integrate continuously",
    text: "Everyone merges small changes into the shared code at least daily, and an automated build with the tests checks every merge. XP also asks for a build that runs in about ten minutes, so feedback stays fast.",
  },
];

export function XpPractices() {
  const [s, set] = useSceneState<BatchState>();
  const f = Math.min(s.frame, FRAMES.length - 1);
  const fr = FRAMES[f];
  return (
    <StepLayout
      eyebrow="Step through"
      title="Practices from XP"
      stage={
        <div className="flex flex-1 flex-col justify-center gap-3">
          <Stepper step={f} count={FRAMES.length} onChange={(n) => set({ frame: n })} />
          {fr.code && (
            <motion.div key={f} initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <Code
                className={cn(
                  "text-xs",
                  fr.tone === "bad" && "ring-bad/40 ring-1",
                  fr.tone === "good" && "ring-good/40 ring-1",
                )}
              >
                {fr.code}
              </Code>
            </motion.div>
          )}
          <FrameCaption frameKey={f} title={fr.title} tone={fr.tone}>
            {fr.text}
          </FrameCaption>
        </div>
      }
    >
      <p>
        Small batches only work if every change is safe to merge.{" "}
        <Term id="xp">Extreme Programming</Term> (XP), created by Kent Beck in the late 1990s,
        bundled the engineering habits that make that possible. Beck&apos;s idea was to take
        practices that work and &ldquo;turn all the knobs up to 10&rdquo;.
      </p>
      <p>
        Many Scrum teams use them: <Term id="tdd">test-driven development</Term>,{" "}
        <Term id="refactoring">refactoring</Term>,{" "}
        <Term id="pair-programming">pair programming</Term> and continuous integration. Step
        through.
      </p>
    </StepLayout>
  );
}

/* 5 ─ What the evidence says ----------------------------------------------------------------------- */

export function Evidence() {
  return (
    <StepLayout
      eyebrow="Checkpoint"
      title="What the evidence says"
      stage={
        <div className="flex flex-1 flex-col justify-center">
          <SortCheckpoint
            id="xp-evidence"
            prompt="Is each claim backed by the research, or an overclaim?"
            categories={[
              { id: "backed", label: "Backed" },
              { id: "over", label: "Overclaim" },
            ]}
            items={[
              {
                id: "dora",
                label: "Teams that deploy often also tend to have fewer failures",
                category: "backed",
                why: "DORA's research: “speed and stability are not tradeoffs”. Top performers do well on both.",
              },
              {
                id: "tiny",
                label: "The smaller the batch the better, whatever each release costs",
                category: "over",
                why: "Each batch carries overhead, so the best size is a U-curve (Reinertsen). Automation moves it smaller.",
              },
              {
                id: "tdd",
                label:
                  "In a Microsoft and IBM study, TDD teams had 40–90% fewer pre-release defects",
                category: "backed",
                why: "Nagappan et al., 2008, four industrial teams. Managers estimated 15–35% more initial development time.",
              },
              {
                id: "pair",
                label: "Pair programming is proven to double productivity",
                category: "over",
                why: "A 2009 meta-analysis found small quality gains and faster completion, but more total effort, depending on task complexity.",
              },
            ]}
          />
        </div>
      }
    >
      <p>
        These practices have real evidence behind them, and also plenty of hype. Sort each claim.
      </p>
    </StepLayout>
  );
}

/* 6 ─ Wrap --------------------------------------------------------------------------------------- */

const DORA: [string, string][] = [
  ["Change lead time", "Commit to running in production"],
  ["Deployment frequency", "How often you deploy"],
  ["Failed deployment recovery time", "How fast you recover when a deployment fails"],
  ["Change fail rate", "Share of deployments that need immediate fixing"],
  ["Deployment rework rate", "Unplanned deployments caused by incidents (added 2024)"],
];

export function Wrap() {
  return (
    <StepLayout
      eyebrow="Wrap-up"
      title="What to remember"
      stage={
        <div className="flex flex-1 flex-col justify-center gap-3">
          <div className="border-line bg-surface rounded-xl border px-4 py-3">
            <p className="text-sm font-semibold">
              DORA&apos;s <Term id="dora-metrics">software delivery metrics</Term>
            </p>
            <ul className="mt-2 grid gap-1.5">
              {DORA.map(([k, d]) => (
                <li key={k} className="text-xs">
                  <span className="font-medium">{k}</span>
                  <span className="text-muted"> · {d}</span>
                </li>
              ))}
            </ul>
          </div>
          <div className="border-line bg-surface rounded-xl border px-4 py-3 text-xs">
            <p className="text-sm font-semibold">
              <Term id="feature-flag">Feature flags</Term>: merge unfinished work safely
            </p>
            <p className="text-muted mt-1">
              New code ships switched off, so it can be merged daily and turned on when ready.
              Remove old flags promptly: in 2012 Knight Capital repurposed an old flag, one server
              still ran the dead code it once controlled, and the firm lost about $460 million in
              roughly 45 minutes (SEC, 2013).
            </p>
          </div>
        </div>
      }
    >
      <p>
        Integration hurts, so teams put it off, which makes it hurt more. Martin Fowler&apos;s
        advice: &ldquo;If it hurts, do it more often.&rdquo;
      </p>
      <p>
        <Term id="trunk-based">Trunk-based development</Term>, as DORA describes it: three or fewer
        active branches, merged into the main line at least once a day, and no code freezes.
      </p>
      <p>
        Continuous delivery keeps every change releasable at the push of a button; continuous
        deployment goes further and releases every change that passes the pipeline automatically.
      </p>
    </StepLayout>
  );
}
