"use client";

import { motion } from "motion/react";
import { useSceneState } from "@/lib/module-sdk";
import { StepLayout } from "@/toolkit/layout/step-layout";
import { WrapStep } from "@/toolkit/layout/wrap-step";
import { SortCheckpoint } from "@/toolkit/checkpoints/sort";
import { Term } from "@/toolkit/glossary/term";
import { cn } from "@/lib/cn";
import { BUDGET, FIXES, frames, launch, type Fix } from "./model";
import type { PerfState } from "./state";

/* 1 ─ Story ---------------------------------------------------------------------------------------- */

export function Shutters() {
  return (
    <StepLayout
      eyebrow="Story"
      title="Opening the shutters"
      stage={
        <div className="grid flex-1 content-center gap-3 sm:grid-cols-2">
          <motion.div
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            className="border-bad/40 bg-bad/5 rounded-xl border p-3 text-xs"
          >
            <p className="font-semibold">Everything before opening</p>
            <p className="text-muted">
              Mop, restock, do the accounts, train the new hire… customers wait outside for an hour.
            </p>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15 }}
            className="border-good/50 bg-good/10 rounded-xl border p-3 text-xs"
          >
            <p className="font-semibold">Only what serving needs</p>
            <p className="text-muted">
              Lights on, coffee machine warm, doors open. The accounts happen during the quiet hour.
            </p>
          </motion.div>
        </div>
      }
    >
      <p>
        A café that insists on finishing every chore before unlocking the door loses its morning
        customers. Open with what serving needs; do the rest later.
      </p>
      <p>
        Apps are judged in the same first moments. A <Term id="app-cold-start">cold start</Term>{" "}
        should show something useful fast, and scrolling must keep up with the screen, or people see{" "}
        <Term id="jank">jank</Term>.
      </p>
    </StepLayout>
  );
}

/* 2 ─ Fix the problem ⭐ --------------------------------------------------------------------------- */

export function Profile() {
  const [s, set] = useSceneState<PerfState>();
  const f = new Set(s.fixes as Fix[]);
  const l = launch(f);
  const fr = frames(f);
  const late = fr.filter((x) => x > BUDGET).length;
  const toggle = (k: Fix) =>
    set({ fixes: f.has(k) ? s.fixes.filter((x) => x !== k) : [...s.fixes, k] });
  return (
    <StepLayout
      eyebrow="Fix the problem"
      title="Profile and fix the app"
      stage={
        <div className="flex flex-1 flex-col justify-center gap-3 text-xs">
          <div className="border-line bg-surface rounded-lg border px-3 py-2">
            <p className="flex justify-between">
              <span className="font-semibold">Cold start, main thread</span>
              <span
                className={cn(
                  "font-mono",
                  l.total >= 5000 ? "text-bad" : l.total < 1500 ? "text-good" : "",
                )}
              >
                first frame at {(l.total / 1000).toFixed(1)} s
              </span>
            </p>
            <div className="mt-1.5 grid gap-0.5">
              {l.tasks.map((t) => (
                <div key={t.label} className="flex items-center gap-2">
                  <span
                    className={cn(
                      "w-40 shrink-0 truncate text-[10px]",
                      t.deferred && "text-subtle line-through",
                    )}
                  >
                    {t.label}
                  </span>
                  <motion.span
                    animate={{ width: `${(t.ms / 2200) * 60}%` }}
                    className={cn(
                      "h-2 rounded-sm",
                      t.deferred ? "bg-viz-idle" : t.code ? "bg-viz-compute" : "bg-viz-data",
                    )}
                  />
                  <span className="text-subtle font-mono text-[10px]">
                    {t.deferred ? "later" : `${t.ms} ms`}
                  </span>
                </div>
              ))}
            </div>
            <p className="text-subtle mt-1 text-[10px]">
              Android vitals counts a cold start of 5 s or more as excessive.
            </p>
          </div>
          <div className="border-line bg-surface rounded-lg border px-3 py-2">
            <p className="flex justify-between">
              <span className="font-semibold">Scrolling the menu at 120 Hz</span>
              <span className={cn("font-mono", late ? "text-bad" : "text-good")}>
                {late} of {fr.length} frames late
              </span>
            </p>
            <div className="relative mt-1.5 flex h-16 items-end gap-px">
              <span
                className="border-fg/70 absolute inset-x-0 z-10 border-t border-dashed"
                style={{ bottom: `${(BUDGET / 45) * 100}%` }}
              />
              {fr.map((ms, i) => (
                <motion.span
                  key={i}
                  animate={{ height: `${(Math.min(ms, 45) / 45) * 100}%` }}
                  className={cn("flex-1 rounded-t-sm", ms > BUDGET ? "bg-bad" : "bg-good")}
                />
              ))}
            </div>
            <p className="text-subtle mt-1 text-[10px]">
              Dashed line: 8.3 ms, the time per frame at 120 Hz.
            </p>
          </div>
          <div className="grid gap-1 sm:grid-cols-2">
            {FIXES.map(([k, t, b]) => (
              <label
                key={k}
                className={cn(
                  "flex cursor-pointer gap-2 rounded-lg border px-2.5 py-1.5",
                  f.has(k) ? "border-good/50 bg-good/10" : "border-line bg-surface",
                )}
              >
                <input
                  type="checkbox"
                  checked={f.has(k)}
                  onChange={() => toggle(k)}
                  className="mt-0.5"
                />
                <span>
                  <span className="font-semibold">{t}</span>
                  <span className="text-muted block text-[11px]">{b}</span>
                </span>
              </label>
            ))}
          </div>
          <p className="text-subtle text-[10px]">Illustrative timings from an imaginary profile.</p>
        </div>
      }
    >
      <p>
        A profiler shows what the café app does on its main thread at launch, and how long each
        frame takes while scrolling. Apply the fixes and watch both.
      </p>
      <p>
        The main thread draws the screen and handles touches. Anything slow on it delays the first
        frame or makes scrolling stutter, so move work off it, do it later, or do less.
      </p>
    </StepLayout>
  );
}

/* 3 ─ Starts --------------------------------------------------------------------------------------- */

export function Starts() {
  return (
    <StepLayout
      eyebrow="Explore"
      title="Cold, warm and hot starts"
      stage={
        <div className="flex flex-1 flex-col justify-center gap-1.5">
          {[
            [
              "Cold",
              "The app's process isn't running: after a reboot, or after the system reclaimed it. Everything starts from scratch. Android vitals flags 5 s or more.",
            ],
            ["Warm", "The process exists but the screen must be rebuilt. Flagged at 2 s or more."],
            [
              "Hot",
              "The app was just in the background and comes straight back. Flagged at 1.5 s or more.",
            ],
            [
              "Two milestones",
              "Time to initial display (first frame) is measured automatically; time to full display needs the app to report when it's really usable.",
            ],
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
        iOS uses similar ideas: a cold launch, a warm launch, and resuming a suspended app. If an
        app takes too long to launch, iOS&apos;s watchdog ends it.
      </p>
      <p>
        Android&apos;s Baseline Profiles let the app ship a list of its start-up code to compile in
        advance; Google reports about 30% faster code from the first launch.
      </p>
    </StepLayout>
  );
}

/* 4 ─ Frames --------------------------------------------------------------------------------------- */

export function Frames() {
  return (
    <StepLayout
      eyebrow="Explore"
      title="Frames, budgets and tools"
      stage={
        <div className="grid flex-1 content-center gap-1.5 sm:grid-cols-2">
          {[
            [
              "Frame budgets",
              "16.7 ms per frame at 60 Hz, 8.3 ms at 120 Hz. Every iPhone 17 model, and many Android phones, refresh at up to 120 Hz.",
            ],
            [
              "Late frames",
              "Android counts frames over 16 ms as slow and over 700 ms as frozen. Apple reports a hang when the main thread is blocked over 250 ms.",
            ],
            [
              "Tools",
              "Xcode Instruments and MetricKit; Android Studio's profiler, Macrobenchmark and Perfetto.",
            ],
            [
              "Google Play vitals",
              "Bad behaviour above a 1.09% crash rate or 0.47% “app not responding” rate can reduce visibility. From February 2027, code must be shrunk and optimised too.",
            ],
          ].map(([t, b], i) => (
            <motion.div
              key={t}
              initial={{ opacity: 0, y: 4 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.06 * i }}
              className="border-line bg-surface rounded-lg border px-3 py-2 text-xs"
            >
              <p className="font-semibold">{t}</p>
              <p className="text-muted">{b}</p>
            </motion.div>
          ))}
        </div>
      }
    >
      <p>
        Measure on a release build, on a cheap phone, not on a debug build on the newest flagship.
        Your users&apos; phones are slower than yours.
      </p>
      <p>
        Field data from real users (MetricKit, Play vitals, Xcode Organizer) shows what the profiler
        on your desk can&apos;t.
      </p>
    </StepLayout>
  );
}

/* 5 ─ Checkpoint ----------------------------------------------------------------------------------- */

export function PerfCheck() {
  return (
    <StepLayout
      eyebrow="Checkpoint"
      title="Before or after the first frame?"
      stage={
        <div className="flex flex-1 flex-col justify-center">
          <SortCheckpoint
            id="mobile-startup"
            prompt="Must each task finish before the first screen appears, or can it wait?"
            categories={[
              { id: "before", label: "Before the first frame" },
              { id: "after", label: "After, or in the background" },
            ]}
            items={[
              {
                id: "signin",
                label: "Check whether someone is signed in, to choose the first screen",
                category: "before",
                why: "It decides what to draw.",
              },
              {
                id: "ads",
                label: "Initialise the ads SDK",
                category: "after",
                why: "Nothing on the first screen needs it.",
              },
              {
                id: "draw",
                label: "Draw the menu from the local database",
                category: "before",
                why: "That's the first useful screen.",
              },
              {
                id: "event",
                label: "Send a “launched” analytics event",
                category: "after",
                why: "Can be queued.",
              },
              {
                id: "prefetch",
                label: "Prefetch tomorrow's specials",
                category: "after",
                why: "Background work.",
              },
            ]}
            explanation="Only work that decides or draws the first screen belongs before it. Everything else waits until the app is visible, or moves to the background."
          />
        </div>
      }
    >
      <p>Sort each task.</p>
    </StepLayout>
  );
}

/* 6 ─ Wrap ----------------------------------------------------------------------------------------- */

export function Wrap() {
  return (
    <WrapStep
      points={[
        ["Open with the essentials", "Defer everything else."],
        ["Keep the main thread free", "Network, decoding, disk elsewhere."],
        ["Respect the frame budget", "8.3 ms at 120 Hz."],
        ["Lists and images", "Lazy rows, small decoded images."],
        ["Measure for real", "Release builds, cheap phones, field data."],
      ]}
    >
      <p>Next: battery and memory.</p>
    </WrapStep>
  );
}
