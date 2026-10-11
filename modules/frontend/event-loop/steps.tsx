"use client";

import { motion } from "motion/react";
import { useSceneState } from "@/lib/module-sdk";
import { StepLayout } from "@/toolkit/layout/step-layout";
import { WrapStep } from "@/toolkit/layout/wrap-step";
import { OrderCheckpoint } from "@/toolkit/checkpoints/order";
import { Segmented } from "@/toolkit/controls/segmented";
import { Term } from "@/toolkit/glossary/term";
import { cn } from "@/lib/cn";
import { ANSWER, CODE, FRAMES, ORDERS } from "./model";
import type { LoopState } from "./state";

/* 1 ─ Story ---------------------------------------------------------------------------------------- */

export function OneCook() {
  return (
    <StepLayout
      eyebrow="Story"
      title="A kitchen with one cook"
      stage={
        <div className="flex flex-1 flex-col justify-center gap-2">
          {[
            ["The cook", "One person, doing one thing at a time. That's the main thread."],
            [
              "The order slips",
              "New orders wait on a rail until the cook is free: the task queue.",
            ],
            [
              "“While you're there…”",
              "Quick follow-ups the cook does before the next slip: microtasks.",
            ],
            [
              "Plating",
              "Every so often the cook plates up what's ready: the browser paints a frame.",
            ],
          ].map(([t, b], i) => (
            <motion.div
              key={t}
              initial={{ opacity: 0, x: -4 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1 * i }}
              className="border-line bg-surface rounded-lg border px-3 py-2 text-xs"
            >
              <span className="font-semibold">{t}</span>
              <span className="text-muted"> · {b}</span>
            </motion.div>
          ))}
        </div>
      }
    >
      <p>
        Picture a busy café kitchen with one cook. If they spend ten minutes on an elaborate cake,
        every other order waits, even a glass of water.
      </p>
      <p>
        A web page works the same way. JavaScript, clicks and drawing the screen all share one{" "}
        <Term id="main-thread">main thread</Term>, scheduled by the{" "}
        <Term id="event-loop">event loop</Term>. Long work there freezes the page.
      </p>
    </StepLayout>
  );
}

function Col({ title, items, cls }: { title: string; items: string[]; cls: string }) {
  return (
    <div className="border-line bg-surface min-h-20 rounded-lg border p-2">
      <p className="text-muted mb-1 text-[10px] font-medium">{title}</p>
      <div className="flex flex-col gap-1">
        {items.map((x) => (
          <motion.div
            layout
            key={x}
            initial={{ opacity: 0, y: -4 }}
            animate={{ opacity: 1, y: 0 }}
            className={cn("rounded border px-1.5 py-0.5 font-mono text-[10px]", cls)}
          >
            {x}
          </motion.div>
        ))}
      </div>
    </div>
  );
}

/* 2 ─ Step through ⭐ ------------------------------------------------------------------------------ */

export function StepThrough() {
  const [s, set] = useSceneState<LoopState>();
  const f = FRAMES[s.frame];
  return (
    <StepLayout
      eyebrow="Step through"
      title="Predict, then step through the loop"
      stage={
        <div className="flex flex-1 flex-col justify-center gap-3">
          <pre className="border-line bg-surface overflow-x-auto rounded-lg border p-2 font-mono text-[11px]">
            {CODE.map((l, i) => (
              <div key={i} className={cn("px-1", f.line === i && "bg-viz-compute/20")}>
                {l}
              </div>
            ))}
          </pre>
          {!s.guess ? (
            <div className="text-xs">
              <p className="mb-1 font-medium">First, predict the console output:</p>
              <div className="flex flex-wrap gap-1">
                {ORDERS.map((o) => (
                  <button
                    key={o}
                    type="button"
                    onClick={() => set({ guess: o })}
                    className="border-line-strong rounded-full border px-3 py-1 font-mono"
                  >
                    {o}
                  </button>
                ))}
              </div>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-3 gap-2">
                <Col
                  title="Call stack"
                  items={[...f.stack].reverse()}
                  cls="border-viz-compute bg-viz-compute/15"
                />
                <Col title="Microtask queue" items={f.micro} cls="border-viz-meta bg-viz-meta/15" />
                <Col title="Task queue" items={f.tasks} cls="border-viz-data bg-viz-data/15" />
              </div>
              <div className="border-line bg-surface-2 rounded-lg border px-3 py-1.5 font-mono text-xs">
                Console: {f.out.join(" ") || "…"}
              </div>
              <p className="text-muted min-h-8 text-xs">{f.note}</p>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  disabled={s.frame === 0}
                  onClick={() => set({ frame: s.frame - 1 })}
                  className="border-line-strong rounded-full border px-3 py-1 text-xs disabled:opacity-40"
                >
                  Back
                </button>
                <button
                  type="button"
                  disabled={s.frame === FRAMES.length - 1}
                  onClick={() => set({ frame: s.frame + 1 })}
                  className="border-line-strong rounded-full border px-3 py-1 text-xs disabled:opacity-40"
                >
                  Step
                </button>
                <span className="text-subtle text-[10px]">
                  {s.frame + 1} / {FRAMES.length}
                </span>
                <button
                  type="button"
                  onClick={() => set({ guess: null, frame: 0 })}
                  className="text-muted ml-auto text-[10px] underline"
                >
                  Predict again
                </button>
              </div>
              {s.frame === FRAMES.length - 1 && (
                <p className={cn("text-xs", s.guess === ANSWER ? "text-good" : "text-muted")}>
                  {s.guess === ANSWER
                    ? "Your prediction was right."
                    : `You predicted ${s.guess}. Microtasks jump ahead of the timer.`}
                </p>
              )}
            </>
          )}
        </div>
      }
    >
      <p>
        Four lines: two logs, a timer and a promise. Predict what prints, then step through and
        watch the call stack and the two queues.
      </p>
      <p>
        The rule: run the current task to the end, then <em>all</em> microtasks, then maybe paint,
        then the next task.
      </p>
    </StepLayout>
  );
}

/* 3 ─ Long tasks ----------------------------------------------------------------------------------- */

export function LongTask() {
  const [s, set] = useSceneState<LoopState>();
  const chunks = s.chunked ? 6 : 1;
  const wait = s.chunked ? 50 : 300;
  return (
    <StepLayout
      eyebrow="Explore"
      title="Why a busy page ignores your click"
      stage={
        <div className="flex flex-1 flex-col justify-center gap-3">
          <Segmented<string>
            size="sm"
            value={s.chunked ? "yes" : "no"}
            onChange={(v) => set({ chunked: v === "yes" })}
            options={[
              ["no", "One 300 ms task"],
              ["yes", "Six 50 ms chunks"],
            ]}
          />
          <div className="border-line bg-surface rounded-lg border p-3">
            <div className="relative h-6">
              {Array.from({ length: chunks }).map((_, i) => (
                <motion.div
                  key={`${s.chunked}-${i}`}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="bg-viz-compute/60 absolute top-0 h-6 rounded"
                  style={{
                    left: `${(i * 300) / chunks / 3.6}%`,
                    width: `${300 / chunks / 3.6 - (s.chunked ? 2.4 : 0)}%`,
                  }}
                />
              ))}
              <div className="bg-bad absolute -top-1 h-8 w-0.5" style={{ left: `${30 / 3.6}%` }} />
              <motion.div
                key={String(s.chunked)}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="bg-good/70 absolute top-0 h-6 w-2 rounded"
                style={{ left: `${s.chunked ? 50 / 3.6 - 2.2 : 300 / 3.6}%` }}
              />
            </div>
            <div className="text-subtle mt-2 flex justify-between text-[10px]">
              <span>0 ms</span>
              <span>click at 30 ms (red) · handled (green)</span>
              <span>360 ms</span>
            </div>
          </div>
          <p className="text-xs">
            The click is handled after{" "}
            <span className={cn("font-mono font-semibold", wait > 200 ? "text-bad" : "text-good")}>
              {wait - 30} ms
            </span>{" "}
            of waiting. {wait > 200 ? "Users feel that as lag." : "That feels instant."}
          </p>
        </div>
      }
    >
      <p>
        Any task over 50 ms is a <Term id="long-task">long task</Term>. While it runs, the browser
        can&apos;t respond to clicks or paint. Toggle between one big task and the same work split
        into chunks that hand control back in between.
      </p>
      <p>Same total work; very different feel. Illustrative timings.</p>
    </StepLayout>
  );
}

/* 4 ─ Tools ---------------------------------------------------------------------------------------- */

export function Tools() {
  return (
    <StepLayout
      eyebrow="Explore"
      title="Tools for keeping the main thread free"
      stage={
        <div className="flex flex-1 flex-col justify-center gap-1.5">
          {[
            [
              "Yield between chunks",
              "scheduler.yield() in Chrome, Edge (129+) and Firefox (142+); not Safari yet, so fall back to setTimeout.",
            ],
            ["requestAnimationFrame", "Run visual updates just before the next paint."],
            [
              "Web Workers",
              "Move heavy calculations to another thread; it can't touch the DOM but can send results back.",
            ],
            ["Do less", "Often the best fix: less JavaScript, less work per click."],
          ].map(([t, b], i) => (
            <motion.div
              key={t}
              initial={{ opacity: 0, x: -4 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.06 * i }}
              className="border-line bg-surface rounded-lg border px-3 py-2 text-xs"
            >
              <span className="font-semibold">{t}</span>
              <span className="text-muted"> · {b}</span>
            </motion.div>
          ))}
        </div>
      }
    >
      <p>
        On a 60 Hz screen the browser gets a chance to paint about every 16.7 ms; on 120 Hz screens,
        about every 8.3 ms. The spec lets browsers choose, and hidden tabs paint far less often.
      </p>
      <p>
        One trap: microtasks can block too. An endless chain of promise callbacks keeps the queue
        busy, and the page can&apos;t paint until it&apos;s empty.
      </p>
    </StepLayout>
  );
}

/* 5 ─ Checkpoint ----------------------------------------------------------------------------------- */

export function LoopCheck() {
  return (
    <StepLayout
      eyebrow="Checkpoint"
      title="What runs first?"
      stage={
        <div className="flex flex-1 flex-col justify-center">
          <OrderCheckpoint
            id="frontend-event-loop"
            prompt="One script schedules all of these. Order them by when they run, first to last."
            items={[
              { id: "sync", label: "A console.log at the end of the script" },
              { id: "then", label: "A promise .then callback" },
              { id: "qm", label: "A queueMicrotask callback scheduled after the promise" },
              { id: "t0", label: "A setTimeout callback with 0 ms" },
              { id: "t100", label: "A setTimeout callback with 100 ms" },
            ]}
            explanation="Synchronous code first, then every microtask in the order queued, then tasks: the 0 ms timer before the 100 ms one."
          />
        </div>
      }
    >
      <p>Drag into order.</p>
    </StepLayout>
  );
}

/* 6 ─ Wrap ----------------------------------------------------------------------------------------- */

export function Wrap() {
  return (
    <WrapStep
      points={[
        ["One main thread", "Scripts, input and painting share it."],
        ["Task, microtasks, paint", "Then the next task."],
        ["0 ms isn't now", "Timers wait behind microtasks."],
        ["Keep tasks under 50 ms", "Yield or split long work."],
        ["Workers for heavy lifting", "Off the main thread."],
      ]}
    >
      <p>That ends the chapter on the browser. Next: building interfaces from components.</p>
    </WrapStep>
  );
}
