"use client";

import { motion } from "motion/react";
import { useSceneState } from "@/lib/module-sdk";
import { StepLayout } from "@/toolkit/layout/step-layout";
import { WrapStep } from "@/toolkit/layout/wrap-step";
import { ChoiceCheckpoint } from "@/toolkit/checkpoints/choice";
import { Segmented } from "@/toolkit/controls/segmented";
import { Term } from "@/toolkit/glossary/term";
import { cn } from "@/lib/cn";
import { MODELS, run, type Work } from "./model";
import type { ConcState } from "./state";

/* 1 ─ Story ---------------------------------------------------------------------------------------- */

export function Restaurant() {
  return (
    <StepLayout
      eyebrow="Story"
      title="Three ways to staff a restaurant"
      stage={
        <div className="flex flex-1 flex-col justify-center gap-2">
          {[
            [
              "A waiter per table",
              "Each waiter stands by their table until the meal is over. Eight waiters, eight tables, a queue outside.",
            ],
            [
              "One very fast waiter",
              "Takes an order, hands it to the kitchen, moves on while it cooks. Brilliant, unless they stop to carve a roast.",
            ],
            [
              "Hundreds of tiny helpers",
              "Cheap to have around; a few real staff switch between them whenever one is waiting.",
            ],
          ].map(([t, b], i) => (
            <motion.div
              key={t}
              initial={{ opacity: 0, x: -4 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.12 * i }}
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
        Most of a restaurant&apos;s time is waiting: for the kitchen, for the bill. How you staff it
        decides how many tables you can serve.
      </p>
      <p>
        Servers face the same question. Most requests spend their time waiting on databases and
        other services. <Term id="concurrency">Concurrency</Term> models decide what a server does
        while it waits: block a <Term id="thread">thread</Term>, hand off to an{" "}
        <Term id="event-loop-server">event loop</Term>, or park a lightweight thread.
      </p>
    </StepLayout>
  );
}

/* 2 ─ Burst ⭐ ------------------------------------------------------------------------------------- */

export function Burst() {
  const [s, set] = useSceneState<ConcState>();
  const results = MODELS.map((m) => ({ ...m, ...run(m.id, s.work, s.blocking) }));
  const max = Math.max(...results.map((r) => r.total));
  return (
    <StepLayout
      eyebrow="Simulation"
      title="Forty requests arrive at once"
      stage={
        <div className="flex flex-1 flex-col justify-center gap-3">
          <Segmented<Work>
            size="sm"
            value={s.work}
            onChange={(work) => set({ work })}
            options={[
              ["io", "Mostly waiting on the database"],
              ["cpu", "Mostly calculating"],
            ]}
          />
          <label className="flex items-center gap-2 text-xs">
            <input
              type="checkbox"
              checked={s.blocking}
              onChange={() => set({ blocking: !s.blocking })}
            />
            Bug: the event-loop code makes a blocking database call
          </label>
          <div className="grid gap-2">
            {results.map((r) => (
              <div
                key={r.id}
                className="border-line bg-surface rounded-lg border px-3 py-2 text-xs"
              >
                <div className="flex items-center justify-between">
                  <span className="font-semibold">{r.label}</span>
                  <span
                    className={cn(
                      "font-mono",
                      r.total > 1500 ? "text-bad" : r.total < 400 ? "text-good" : "",
                    )}
                  >
                    {r.total} ms
                  </span>
                </div>
                <div className="bg-surface-2 mt-1 h-2.5 rounded">
                  <motion.div
                    animate={{ width: `${(r.total / max) * 100}%` }}
                    className={cn("h-2.5 rounded", r.total > 1500 ? "bg-bad/70" : "bg-viz-data/70")}
                  />
                </div>
                <p className="text-muted mt-1 text-[10px]">{r.who}</p>
                <p className="text-subtle text-[10px]">Memory: {r.memory}</p>
              </div>
            ))}
          </div>
          <p className="text-muted text-[11px]">
            Time until all 40 are answered on a 4-core server. Simplified and illustrative.
          </p>
        </div>
      }
    >
      <p>
        Forty requests hit the server at the same moment. Switch between work that mostly waits and
        work that mostly calculates, then switch on the bug and watch the event loop.
      </p>
      <p>
        No model wins everywhere. Waiting is cheap with an event loop or lightweight threads; heavy
        calculation needs real cores, whatever the model.
      </p>
    </StepLayout>
  );
}

/* 3 ─ By language ---------------------------------------------------------------------------------- */

export function Languages() {
  return (
    <StepLayout
      eyebrow="Explore"
      title="How each platform does it"
      stage={
        <div className="flex flex-1 flex-col justify-center gap-1.5">
          {[
            [
              "Node.js",
              "One event loop runs your JavaScript; a pool of 4 threads (by default) handles files, DNS lookups and some crypto. worker_threads for heavy calculation.",
            ],
            [
              "Python",
              "asyncio is an event loop. The free-threaded build without the GIL is officially supported but optional since 3.14.",
            ],
            [
              "Go",
              "Goroutines start with tiny stacks (a few KB) and grow as needed; the runtime spreads them over all cores.",
            ],
            [
              "Java",
              "Virtual threads since Java 21; Java 24 fixed most pinning inside synchronized, so Java 25 is the first LTS with the fix. Spring Boot: one switch to turn them on.",
            ],
            [
              ".NET",
              "async/await frees the thread while waiting; blocking on .Result starves the thread pool.",
            ],
          ].map(([t, b], i) => (
            <motion.div
              key={t}
              initial={{ opacity: 0, x: -4 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.05 * i }}
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
        Every major platform now has a cheap way to wait: event loops, async/await, or lightweight
        threads. The classic thread pool still works well for modest traffic; Spring Boot&apos;s
        embedded Tomcat allows 200 threads by default.
      </p>
      <p>The model affects how you write code, and which mistakes hurt.</p>
    </StepLayout>
  );
}

/* 4 ─ Pitfalls ------------------------------------------------------------------------------------- */

export function Pitfalls() {
  return (
    <StepLayout
      eyebrow="Explore"
      title="Concurrency is not parallelism"
      stage={
        <div className="grid flex-1 content-center gap-2 sm:grid-cols-2">
          <div className="border-line bg-surface rounded-lg border px-3 py-2 text-xs">
            <p className="font-semibold">Concurrency</p>
            <p className="text-muted">
              Juggling many tasks, switching while each waits. One core can do it.
            </p>
          </div>
          <div className="border-line bg-surface rounded-lg border px-3 py-2 text-xs">
            <p className="font-semibold">Parallelism</p>
            <p className="text-muted">
              Doing several things at the same instant. Needs several cores.
            </p>
          </div>
          <div className="border-bad/40 bg-bad/10 rounded-lg border px-3 py-2 text-xs sm:col-span-2">
            <p className="font-semibold">The classic event-loop bug</p>
            <p className="text-muted">
              One synchronous file read, password hash or big loop stops every other request on that
              loop until it finishes.
            </p>
          </div>
        </div>
      }
    >
      <p>
        An event loop gives excellent concurrency on one core, but no parallelism. Move heavy
        calculation to worker threads or a job queue.
      </p>
      <p>
        Containers add a twist: a service should use the CPUs it&apos;s allowed, not every CPU on
        the host. Go has respected container CPU limits by default since 1.25 (2025).
      </p>
    </StepLayout>
  );
}

/* 5 ─ Checkpoint ----------------------------------------------------------------------------------- */

export function ConcCheck() {
  return (
    <StepLayout
      eyebrow="Checkpoint"
      title="Everyone freezes"
      stage={
        <div className="flex flex-1 flex-col justify-center">
          <ChoiceCheckpoint
            id="backend-concurrency"
            prompt="A Node.js API freezes for every user for a few seconds whenever someone exports a large report. What's the most likely cause?"
            options={[
              {
                id: "db",
                label: "The database is overloaded",
                feedback:
                  "Possible, but database waits don't freeze an event loop; other requests would keep running.",
              },
              {
                id: "cpu",
                label:
                  "Building the report is heavy calculation on the event loop, blocking every other request",
                correct: true,
                feedback:
                  "Right: one long synchronous task blocks the whole loop. Move it to a worker thread or a background job.",
              },
              {
                id: "threads",
                label: "Node.js has too few threads",
                feedback:
                  "Your JavaScript runs on one thread by design; adding threads to the pool won't unblock it.",
              },
            ]}
            explanation="Event loops shine while waiting, but any long synchronous work blocks everyone. Offload calculation to workers or a queue."
          />
        </div>
      }
    >
      <p>Choose one.</p>
    </StepLayout>
  );
}

/* 6 ─ Wrap ----------------------------------------------------------------------------------------- */

export function Wrap() {
  return (
    <WrapStep
      points={[
        ["Requests mostly wait", "On databases and services."],
        ["Three models", "Thread pools, event loops, lightweight threads."],
        ["Don't block the loop", "Offload heavy work."],
        ["Calculation needs cores", "Whatever the model."],
        ["Respect container limits", "Use the CPUs you're given."],
      ]}
    >
      <p>That ends the foundations. Next: structuring a service so it stays easy to change.</p>
    </WrapStep>
  );
}
