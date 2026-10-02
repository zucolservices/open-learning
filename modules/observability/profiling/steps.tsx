"use client";

import { motion } from "motion/react";
import { useSceneState } from "@/lib/module-sdk";
import { StepLayout } from "@/toolkit/layout/step-layout";
import { ChoiceCheckpoint } from "@/toolkit/checkpoints/choice";
import { Code } from "@/toolkit/controls/stepper";
import { Term } from "@/toolkit/glossary/term";
import { cn } from "@/lib/cn";
import { CULPRITS, ROOT, layout } from "./model";
import type { ProfState } from "./state";

/* 1 ─ Read the flame graph ⭐ --------------------------------------------------------------------- */

const ROWS = layout(ROOT);
const MAX_DEPTH = Math.max(...ROWS.map((r) => r.depth));
const ROW_H = 22;

const TONES = ["bg-viz-compute/70", "bg-viz-compute/55", "bg-viz-remove/45", "bg-viz-compute/40"];

export function ReadFlame() {
  const [s, set] = useSceneState<ProfState>();
  const sel = ROWS.find((r) => r.f.id === s.pick)?.f;
  const childSum = (sel?.children ?? []).reduce((a, c) => a + c.w, 0);
  const self = sel ? sel.w - childSum : 0;
  return (
    <StepLayout
      eyebrow="Fix the problem"
      title="Read the flame graph"
      stage={
        <div className="flex flex-1 flex-col justify-center gap-3">
          <p className="text-muted font-mono text-[10px]">
            receipt-service · CPU profile · 60 s · width = share of samples
          </p>
          <div className="relative w-full" style={{ height: (MAX_DEPTH + 1) * ROW_H }}>
            {ROWS.map(({ f, x, depth }) => (
              <button
                key={f.id}
                type="button"
                onClick={() => set({ pick: f.id })}
                title={`${f.name}: ${f.w}% of samples`}
                className={cn(
                  "absolute overflow-hidden rounded-sm border px-1 text-left font-mono text-[9px] leading-[20px] whitespace-nowrap",
                  s.pick === f.id ? "border-fg" : "border-bg",
                  TONES[(f.name.length + depth) % TONES.length],
                )}
                style={{
                  left: `${x}%`,
                  width: `${f.w}%`,
                  bottom: depth * ROW_H,
                  height: ROW_H - 2,
                }}
              >
                {f.name}
              </button>
            ))}
          </div>
          {sel ? (
            <motion.div
              key={sel.id}
              initial={{ opacity: 0, y: 4 }}
              animate={{ opacity: 1, y: 0 }}
              className={cn(
                "rounded-xl border px-4 py-3 text-sm",
                CULPRITS.has(sel.id) ? "border-good/50 bg-good/10" : "border-line bg-surface",
              )}
            >
              <p className="font-mono text-xs font-semibold">{sel.name}</p>
              <p className="text-muted font-mono text-[11px]">
                on the stack in {sel.w}% of samples · running its own code in {self}%
              </p>
              <p className="mt-1">
                {CULPRITS.has(sel.id)
                  ? "Found it: the email pattern is compiled from scratch on every request, nearly half the CPU. Compile it once at start-up and reuse it."
                  : sel.id === "validate" || sel.id === "handler" || sel.id === "http"
                    ? "Wide, but mostly because of what it calls. Look at what sits on top of it."
                    : "A small slice. Look for the widest block near the top of a tall tower."}
              </p>
            </motion.div>
          ) : (
            <p className="text-muted text-xs">Click a block. Which function is wasting the CPU?</p>
          )}
        </div>
      }
    >
      <p>
        Traces say <em>which service</em> is slow. A <Term id="profile">profile</Term> says{" "}
        <em>which lines of code</em> are using the CPU or memory, by sampling the call stack many
        times a second.
      </p>
      <p>
        Brendan Gregg invented the <Term id="flame-graph">flame graph</Term> in 2011 to read them.
        Each block is a function, stacked on the one that called it. The x-axis is &ldquo;not the
        passage of time&rdquo;: blocks are sorted alphabetically, and a wider block was on the stack
        in more samples.
      </p>
      <p>
        The receipt service is burning CPU. Find the function to fix: look for wide blocks with
        little on top of them.
      </p>
    </StepLayout>
  );
}

/* 2 ─ Kinds of profile ---------------------------------------------------------------------------- */

const KINDS: [string, string][] = [
  ["CPU", "Where the processor time goes, sampled about 100 times a second (Go's fixed rate)."],
  ["Wall clock", "Where real time goes, including waiting on locks, disks and the network."],
  ["Heap and allocations", "What memory is held now, and what code allocates the most."],
  ["Locks (mutex, block)", "Where threads wait for each other."],
  ["Goroutines or threads", "What every concurrent task is doing right now."],
];

export function Kinds() {
  return (
    <StepLayout
      eyebrow="Explore"
      title="Kinds of profile"
      stage={
        <div className="flex flex-1 flex-col justify-center gap-2">
          {KINDS.map(([t, d], i) => (
            <motion.div
              key={t}
              initial={{ opacity: 0, x: -6 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.06 * i }}
              className="border-line bg-surface rounded-lg border px-3 py-2"
            >
              <p className="text-sm font-semibold">{t}</p>
              <p className="text-muted text-xs">{d}</p>
            </motion.div>
          ))}
          <Code>{`$ go tool pprof -http=:8080 http://receipts:6060/debug/pprof/profile?seconds=30`}</Code>
        </div>
      }
    >
      <p>
        Different questions need different profiles. A CPU profile won&apos;t show a request stuck
        waiting on a lock; a wall-clock or lock profile will.
      </p>
      <p>
        Most tools speak pprof, Go&apos;s profile format, and Chrome&apos;s developer tools show a
        cousin, the flame <em>chart</em>, whose x-axis really is time.
      </p>
    </StepLayout>
  );
}

/* 3 ─ Always on ----------------------------------------------------------------------------------- */

export function AlwaysOn() {
  return (
    <StepLayout
      eyebrow="Explore"
      title="Always on, in production"
      stage={
        <div className="flex flex-1 flex-col justify-center gap-3">
          <div className="border-line bg-surface rounded-xl border px-4 py-3">
            <p className="text-sm font-semibold">Google-Wide Profiling (2010)</p>
            <p className="text-muted mt-1 text-xs">
              Google sampled a small share of machines, and a small share of events on each, with an
              overhead of &ldquo;less than 0.01 percent&rdquo;. Across the fleet it found zlib
              compression alone used &ldquo;nearly 5 percent of all CPU cycles&rdquo;.
            </p>
          </div>
          <div className="border-line bg-surface rounded-xl border px-4 py-3">
            <p className="text-sm font-semibold">Tools today</p>
            <p className="text-muted mt-1 text-xs">
              Grafana Pyroscope, Parca (eBPF-based, from Polar Signals), Google Cloud Profiler,
              Datadog Continuous Profiler, Amazon CodeGuru Profiler and Elastic, whose eBPF profiler
              was donated to OpenTelemetry in 2024.
            </p>
          </div>
          <div className="border-line bg-surface rounded-xl border px-4 py-3">
            <p className="text-sm font-semibold">Overhead</p>
            <p className="text-muted mt-1 text-xs">
              Typically a few percent at most: around 1% for OpenTelemetry&apos;s eBPF agent in its
              own tests, 2–5% by Pyroscope&apos;s estimate, depending on language and settings.
            </p>
          </div>
        </div>
      }
    >
      <p>
        <Term id="continuous-profiling">Continuous profiling</Term> keeps a low-rate profiler
        running in production all the time, so when something gets slow at 3 a.m. you can open the
        profile for that minute instead of trying to reproduce it.
      </p>
      <p>
        eBPF, a Linux feature for running small safe programs in the kernel, lets some profilers
        watch every process on a machine without changing any code.
      </p>
    </StepLayout>
  );
}

/* 4 ─ Which signal next? -------------------------------------------------------------------------- */

export function WhichNext() {
  return (
    <StepLayout
      eyebrow="Checkpoint"
      title="Which signal next?"
      stage={
        <div className="flex flex-1 flex-col justify-center">
          <ChoiceCheckpoint
            id="profile-next"
            prompt="Since this morning's release, the search service's CPU sits at 90%. Its traces show the time is spent inside search itself, with no slow child spans. What do you look at next?"
            options={[
              {
                id: "logs",
                label: "Search the logs for the word 'slow'",
                feedback: "Logs record events, not where CPU time goes.",
              },
              {
                id: "profile",
                label: "Compare the CPU flame graph for search before and after the release",
                correct: true,
                feedback:
                  "A profile shows exactly which functions grew; comparing two of them points at the change.",
              },
              {
                id: "scale",
                label: "Add more servers and move on",
                feedback: "That pays for the waste instead of finding it.",
              },
              {
                id: "dashboard",
                label: "Build a new dashboard of CPU per server",
                feedback: "You already know CPU is high; the question is which code.",
              },
            ]}
            explanation="Metrics tell you the CPU is high, traces tell you which service, and profiles tell you which code."
          />
        </div>
      }
    >
      <p>Each signal narrows the question a little further.</p>
    </StepLayout>
  );
}

/* 5 ─ Wrap ---------------------------------------------------------------------------------------- */

const POINTS: [string, string][] = [
  ["Profiles find the code", "Which functions use the CPU, memory or locks."],
  ["Read flame graphs", "Width is samples, not time; look for wide plateaus on top."],
  ["Pick the right kind", "CPU, wall clock, heap, locks."],
  ["Keep it running", "Continuous profiling costs little and pays off at 3 a.m."],
  ["Compare", "Before and after a release shows what changed."],
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
        Profiles are becoming OpenTelemetry&apos;s fourth signal: they reached public alpha in March
        2026, with an eBPF profiler as the reference agent. Not production-ready yet, but on its way
        to the same Collector pipelines as everything else.
      </p>
      <p>Next chapter: deciding how reliable is reliable enough.</p>
    </StepLayout>
  );
}
