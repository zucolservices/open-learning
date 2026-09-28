"use client";

import { useEffect, useMemo, useState } from "react";
import { motion } from "motion/react";
import { Pause, Play } from "lucide-react";
import { useSceneState } from "@/lib/module-sdk";
import { StepLayout } from "@/toolkit/layout/step-layout";
import { PredictCheckpoint } from "@/toolkit/checkpoints/predict";
import { SortCheckpoint } from "@/toolkit/checkpoints/sort";
import { Segmented } from "@/toolkit/controls/segmented";
import { FrameCaption, Stepper } from "@/toolkit/controls/stepper";
import { Term } from "@/toolkit/glossary/term";
import { cn } from "@/lib/cn";
import { DAYS, WARMUP, simulate } from "./model";
import type { KanbanState } from "./state";

/* 1 ─ Rush hour ------------------------------------------------------------------------------------ */

export function Highway() {
  const [s, set] = useSceneState<KanbanState>();
  const jam = s.road === "jam";
  const cars = jam ? 26 : 7;
  return (
    <StepLayout
      eyebrow="Analogy"
      title="Rush hour"
      stage={
        <div className="flex flex-1 flex-col gap-3">
          <Segmented
            size="sm"
            value={s.road}
            options={[
              ["jam", "Let every car on"],
              ["metered", "Signal at the on-ramp"],
            ]}
            onChange={(v) => set({ road: v })}
          />
          <div className="border-line bg-surface overflow-hidden rounded-xl border">
            <svg viewBox="0 0 340 110" className="w-full" role="img" aria-label="Cars on a road">
              <rect x={0} y={34} width={340} height={46} className="fill-viz-idle/15" />
              <line
                x1={0}
                y1={57}
                x2={340}
                y2={57}
                className="stroke-line-strong"
                strokeDasharray="8 8"
              />
              {!jam && (
                <g>
                  <rect
                    x={18}
                    y={6}
                    width={10}
                    height={24}
                    rx={3}
                    className="fill-surface-2 stroke-line-strong"
                  />
                  <circle cx={23} cy={13} r={3} className="fill-bad/40" />
                  <circle cx={23} cy={23} r={3} className="fill-good" />
                </g>
              )}
              {Array.from({ length: cars }, (_, i) => {
                const lane = i % 2;
                const dur = jam ? 34 : 5;
                return (
                  <g key={`${s.road}-${i}`}>
                    <animateTransform
                      attributeName="transform"
                      type="translate"
                      from="-30 0"
                      to="350 0"
                      dur={`${dur}s`}
                      begin={`${-(i * dur) / cars}s`}
                      repeatCount="indefinite"
                    />
                    <rect
                      x={0}
                      y={lane ? 62 : 40}
                      width={20}
                      height={12}
                      rx={3}
                      className={jam ? "fill-bad/60" : "fill-good/70"}
                    />
                  </g>
                );
              })}
            </svg>
          </div>
          <div className="grid grid-cols-2 gap-2 text-center">
            <div className="border-line bg-surface rounded-xl border px-3 py-2">
              <p className="text-muted text-[10px]">Cars on the road</p>
              <p className="font-mono text-lg">{cars}</p>
            </div>
            <div className="border-line bg-surface rounded-xl border px-3 py-2">
              <p className="text-muted text-[10px]">Cars getting through</p>
              <p className={cn("font-mono text-lg", jam ? "text-bad" : "text-good")}>
                {jam ? "crawling" : "flowing"}
              </p>
            </div>
          </div>
        </div>
      }
    >
      <p>
        At rush hour the road is packed: fully used, and almost nothing moves. Some cities put a
        signal on the on-ramp that lets cars on one at a time. Fewer cars on the road, and more get
        through.
      </p>
      <p>
        Teams are the same. Starting more work than the team can finish fills the road. Kanban
        University uses exactly this picture: when the motorway is jammed it&apos;s &ldquo;fully
        utilized&rdquo;, but &ldquo;very little is moving&rdquo;.
      </p>
    </StepLayout>
  );
}

/* 2 ─ Kanban in three practices -------------------------------------------------------------------- */

const FRAMES = [
  {
    title: "Define and visualise the workflow",
    text: "Agree what a work item is, where work starts and finishes, the states in between, how you'll control work in progress, your policies, and how long items should usually take (a service level expectation). Then make it visible, usually on a board.",
  },
  {
    title: "Actively manage items in the workflow",
    text: "Control work in progress, keep items from ageing and getting stuck, and pull new work only when there's room. The guide: “Kanban system members must explicitly control the number of work items in a workflow from started to finished.”",
  },
  {
    title: "Improve the workflow",
    text: "Use the data to change the workflow itself: policies, states, limits. Small experiments, measured.",
  },
  {
    title: "Four flow metrics",
    text: "WIP: “The number of work items started but not finished.” Throughput: “The number of work items finished per unit of time.” Work Item Age: “The elapsed time between when a work item started and the current date.” Cycle Time: “The elapsed time between when a work item started and when a work item finished.”",
  },
];

export function KanbanGuide() {
  const [s, set] = useSceneState<KanbanState>();
  const f = Math.min(s.frame, FRAMES.length - 1);
  return (
    <StepLayout
      eyebrow="Step through"
      title="Kanban in three practices"
      stage={
        <div className="flex flex-1 flex-col gap-3">
          <div className="grid grid-cols-4 gap-1.5">
            {["To do", "Develop", "Test", "Done"].map((c, i) => (
              <div key={c} className="border-line bg-surface rounded-lg border p-2">
                <p className="text-muted flex items-center justify-between text-[10px]">
                  {c}
                  {(i === 1 || i === 2) && f >= 1 && (
                    <span className="bg-accent-soft text-accent rounded px-1 font-mono">
                      max {i === 1 ? 4 : 2}
                    </span>
                  )}
                </p>
                <div className="mt-1 grid gap-1">
                  {Array.from({ length: [4, 3, 2, 3][i] }, (_, k) => (
                    <div
                      key={k}
                      className={cn(
                        "h-3 rounded",
                        i === 3 ? "bg-good/40" : i === 0 ? "bg-viz-idle/30" : "bg-viz-data/40",
                      )}
                    />
                  ))}
                </div>
              </div>
            ))}
          </div>
          <Stepper step={f} count={FRAMES.length} onChange={(n) => set({ frame: n })} />
          <FrameCaption frameKey={f} title={FRAMES[f].title}>
            {FRAMES[f].text}
          </FrameCaption>
          <p className="text-subtle text-[10px]">
            Quotations: The Kanban Guide (kanbanguides.org, May 2025).
          </p>
        </div>
      }
    >
      <p>
        The Kanban Guide: &ldquo;Kanban is a strategy for optimizing the flow of value through a
        process.&rdquo; It has three practices working together.
      </p>
      <p className="text-muted text-sm">
        A <Term id="kanban">Kanban</Term> board is only the visible part. What makes it Kanban is
        controlling <Term id="wip">work in progress</Term> and managing the flow.
      </p>
    </StepLayout>
  );
}

/* 3 ─ Run the board ⭐ (simulation) ------------------------------------------------------------------ */

const DEV_LIMITS: [string, string][] = [
  ["1", "1"],
  ["2", "2"],
  ["3", "3"],
  ["4", "4"],
  ["5", "5"],
  ["8", "8"],
  ["99", "none"],
];
const TEST_LIMITS: [string, string][] = [
  ["1", "1"],
  ["2", "2"],
  ["4", "4"],
  ["99", "none"],
];

function Column({
  title,
  ids,
  limit,
  day,
  start,
}: {
  title: string;
  ids: number[];
  limit?: number;
  day: number;
  start?: (id: number) => number | undefined;
}) {
  return (
    <div className="border-line bg-surface flex min-h-40 flex-col rounded-lg border p-1.5">
      <p className="text-muted mb-1 flex items-center justify-between text-[10px]">
        <span>
          {title} <span className="font-mono">({ids.length})</span>
        </span>
        {limit !== undefined && limit < 99 && (
          <span
            className={cn(
              "rounded px-1 font-mono",
              ids.length >= limit ? "bg-bad/15 text-bad" : "bg-accent-soft text-accent",
            )}
          >
            max {limit}
          </span>
        )}
      </p>
      <div className="flex flex-wrap content-start gap-0.5">
        {ids.slice(0, 40).map((id) => {
          const age = start ? day - (start(id) ?? day) + 1 : 0;
          return (
            <span
              key={id}
              title={start ? `age ${age} days` : undefined}
              className={cn(
                "h-2.5 w-4 rounded-sm",
                title === "Done"
                  ? "bg-good/50"
                  : title === "To do"
                    ? "bg-viz-idle/40"
                    : age > 10
                      ? "bg-bad/70"
                      : age > 5
                        ? "bg-viz-compute/70"
                        : "bg-viz-data/60",
              )}
            />
          );
        })}
        {ids.length > 40 && <span className="text-muted text-[9px]">+{ids.length - 40}</span>}
      </div>
    </div>
  );
}

export function Board() {
  const [s, set] = useSceneState<KanbanState>();
  const r = useMemo(() => simulate(s.dev, s.test), [s.dev, s.test]);
  const [day, setDay] = useState(DAYS - 1);
  const [playing, setPlaying] = useState(false);
  useEffect(() => {
    if (!playing) return;
    const id = setInterval(() => {
      setDay((d) => {
        if (d >= DAYS - 1) {
          setPlaying(false);
          return d;
        }
        return d + 1;
      });
    }, 110);
    return () => clearInterval(id);
  }, [playing]);
  const st = r.days[day];
  const startOf = (id: number) => r.items[id]?.start;
  const stable = r.littles < r.avgCycle * 1.5;
  return (
    <StepLayout
      eyebrow="Simulation"
      title="Run the board"
      stage={
        <div className="flex flex-1 flex-col gap-3">
          <div className="grid gap-2 text-xs sm:flex sm:flex-wrap sm:items-center sm:gap-3">
            <span className="text-muted">Develop limit</span>
            <Segmented
              size="sm"
              value={String(s.dev)}
              options={DEV_LIMITS}
              onChange={(v) => set({ dev: Number(v) })}
            />
            <span className="text-muted">Test limit</span>
            <Segmented
              size="sm"
              value={String(s.test)}
              options={TEST_LIMITS}
              onChange={(v) => set({ test: Number(v) })}
            />
          </div>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => {
                if (!playing && day >= DAYS - 1) setDay(0);
                setPlaying(!playing);
              }}
              className="bg-accent text-accent-fg flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-medium"
            >
              {playing ? <Pause className="size-3.5" /> : <Play className="size-3.5" />}
              {playing ? "Pause" : "Play 60 days"}
            </button>
            <input
              type="range"
              min={0}
              max={DAYS - 1}
              value={day}
              onChange={(e) => {
                setPlaying(false);
                setDay(Number(e.target.value));
              }}
              className="flex-1 accent-[var(--accent)]"
              aria-label="Day"
            />
            <span className="text-muted w-14 text-right font-mono text-[11px]">day {day + 1}</span>
          </div>
          <div className="grid grid-cols-4 gap-1.5">
            <Column title="To do" ids={st.todo} day={day} />
            <Column title="Develop" ids={st.dev} limit={s.dev} day={day} start={startOf} />
            <Column title="Test" ids={st.test} limit={s.test} day={day} start={startOf} />
            <Column title="Done" ids={st.done} day={day} />
          </div>
          <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
            {[
              ["Throughput", `${r.throughput.toFixed(2)} / day`, r.throughput < 0.5],
              ["Average WIP", r.avgWip.toFixed(1), r.avgWip > 8],
              ["Average cycle time", `${r.avgCycle.toFixed(1)} days`, r.avgCycle > 12],
              ["Oldest item in progress", `${r.oldestAge} days`, r.oldestAge > 12],
            ].map(([l, v, bad]) => (
              <div
                key={l as string}
                className={cn(
                  "rounded-xl border px-3 py-2",
                  bad ? "border-bad/40 bg-bad/5" : "border-line bg-surface",
                )}
              >
                <p className="text-muted text-[10px]">{l}</p>
                <p className="font-mono text-sm">{v}</p>
              </div>
            ))}
          </div>
          <p className="border-line bg-surface-2 rounded-xl border px-3 py-2 text-xs">
            {s.dev >= 99 && s.test >= 99
              ? "No limits: everything starts at once, three developers and one tester split their days across dozens of items, and almost nothing finishes. Work piles up in progress, ageing."
              : s.dev <= 1
                ? "Too tight: people wait for work and the tester sits idle. Throughput drops. Limits should sit just above what the team can actually work on."
                : r.throughput >= 0.7
                  ? "Limits just above capacity: about the most the team can finish, with items done in a week or so. New work waits in To do, not half-started."
                  : "Try lower limits, especially on Test, the bottleneck. Watch cycle time fall while throughput holds."}
          </p>
          <p className="text-subtle text-[10px]">
            Illustrative model: about 1.1 new items a day; three developers, one tester (the
            bottleneck); spreading a person across more items costs switching time. Metrics use days{" "}
            {WARMUP + 1}–{DAYS}. Card colour: blue new, amber over 5 days old, red over 10.{" "}
            {!stable && "Here work in progress keeps growing, so the system isn't stable."}
          </p>
        </div>
      }
    >
      <p>
        A team&apos;s board with To do, Develop, Test and Done. Items count as started when pulled
        into Develop. Set limits on how many items may be in Develop and Test, then play the 60
        days.
      </p>
      <p className="text-muted text-sm">
        Start with no limits, then try Develop 5 and Test 2, then 1 and 1. The slogan &ldquo;stop
        starting, start finishing&rdquo; (author unknown) sums it up.
      </p>
    </StepLayout>
  );
}

/* 4 ─ Little's Law --------------------------------------------------------------------------------- */

export function Littles() {
  return (
    <StepLayout
      eyebrow="Checkpoint"
      title="Little's Law"
      stage={
        <div className="flex flex-1 flex-col justify-center gap-4">
          <div className="border-line bg-surface rounded-xl border px-4 py-3 text-center">
            <p className="font-mono text-sm">
              Average cycle time = Average WIP ÷ Average throughput
            </p>
          </div>
          <PredictCheckpoint
            id="littles"
            prompt="Over the last month a team averaged 6 items in progress and finished 2 items a day. On average, how long did an item take from start to finish?"
            min={0}
            max={10}
            step={0.5}
            unit=" days"
            answer={3}
            tolerance={0.25}
            explanation="6 ÷ 2 = 3 days on average. That's a fact about the past month. It can't tell you when one particular item will finish: John Little himself wrote “we are in the measurement business, not the forecasting business.”"
          />
        </div>
      }
    >
      <p>
        <Term id="littles-law">Little&apos;s Law</Term> (John Little, 1961) links the three
        averages. Lower the work in progress at the same throughput, and items get through faster.
      </p>
      <p className="text-muted text-sm">
        It holds for averages over a finished period, and for predicting the future only when the
        system is stable. Daniel Vacanti warns it &ldquo;was never designed for&rdquo; making
        deterministic forecasts. For a single item, watch its age instead.
      </p>
    </StepLayout>
  );
}

/* 5 ─ Kanban or myth? ------------------------------------------------------------------------------ */

export function KanbanMyths() {
  return (
    <StepLayout
      eyebrow="Checkpoint"
      title="Kanban or myth?"
      stage={
        <div className="flex flex-1 flex-col justify-center">
          <SortCheckpoint
            id="kanban-myths"
            prompt="Sort each statement."
            categories={[
              { id: "true", label: "True" },
              { id: "myth", label: "Myth" },
            ]}
            items={[
              {
                id: "board",
                label: "Kanban is just a board with columns",
                category: "myth",
                why: "The guide requires explicitly controlling WIP and managing flow; the board is only the visible part.",
              },
              {
                id: "busy",
                label: "Starting more work keeps everyone busy, so more gets done",
                category: "myth",
                why: "Near full utilisation, queues grow and work slows. Fewer items in progress usually finish faster.",
              },
              {
                id: "age",
                label: "Work Item Age helps spot an item that's getting stuck",
                category: "true",
                why: "It's one of the four flow metrics, for items still in progress.",
              },
              {
                id: "predict",
                label: "Little's Law tells you when your item will be finished",
                category: "myth",
                why: "It relates averages over a completed period; it doesn't forecast single items.",
              },
              {
                id: "toyota",
                label: "Kanban grew out of Toyota's production system",
                category: "true",
                why: "Toyota introduced its “supermarket method” in 1954; it evolved into kanban cards.",
              },
            ]}
          />
        </div>
      }
    >
      <p>
        David J. Anderson adapted these ideas for software teams from 2004 onward, first at
        Microsoft, and described them in his 2010 book on the Kanban Method.
      </p>
    </StepLayout>
  );
}

/* 6 ─ Wrap ----------------------------------------------------------------------------------------- */

const TAKEAWAYS: [string, string][] = [
  ["Limit work in progress", "Fewer items started means each finishes sooner."],
  ["Four flow metrics", "WIP, throughput, work item age, cycle time."],
  ["Watch the bottleneck", "Limits above it just make queues; limits too tight starve the team."],
  ["Little's Law measures", "It explains past averages; it doesn't forecast a single item."],
];

export function Wrap() {
  return (
    <StepLayout
      eyebrow="Wrap-up"
      title="What to remember"
      stage={
        <div className="grid flex-1 content-center gap-3 sm:grid-cols-2">
          {TAKEAWAYS.map(([t, d], i) => (
            <motion.div
              key={t}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.06 * i }}
              className="border-line bg-surface rounded-xl border px-4 py-3"
            >
              <p className="font-semibold">{t}</p>
              <p className="text-muted mt-1 text-sm">{d}</p>
            </motion.div>
          ))}
        </div>
      }
    >
      <p>
        Kanban works on its own or inside Scrum: Scrum.org&apos;s Kanban Guide for Scrum Teams keeps
        the Sprint and adds flow practices.
      </p>
      <p>Next: reading the charts that show how work is flowing.</p>
    </StepLayout>
  );
}
