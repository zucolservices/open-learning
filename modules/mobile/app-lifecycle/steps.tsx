"use client";

import { motion } from "motion/react";
import { useSceneState } from "@/lib/module-sdk";
import { StepLayout } from "@/toolkit/layout/step-layout";
import { WrapStep } from "@/toolkit/layout/wrap-step";
import { SortCheckpoint } from "@/toolkit/checkpoints/sort";
import { Term } from "@/toolkit/glossary/term";
import { cn } from "@/lib/cn";
import { EVENTS } from "./model";
import type { LifeState } from "./state";

/* 1 ─ Story ---------------------------------------------------------------------------------------- */

export function Desk() {
  return (
    <StepLayout
      eyebrow="Story"
      title="The hot desk"
      stage={
        <div className="flex flex-1 flex-col justify-center gap-2">
          {[
            ["At your desk", "Working; everything is laid out."],
            ["Stepping away", "Papers still out; you're coming back soon."],
            ["Desk reassigned", "The office needed space. Anything not filed away is cleared."],
          ].map(([t, b], i) => (
            <motion.div
              key={t}
              initial={{ opacity: 0, x: -4 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.12 * i }}
              className={cn(
                "rounded-lg border px-3 py-2 text-xs",
                i === 2 ? "border-bad/40 bg-bad/10" : "border-line bg-surface",
              )}
            >
              <span className="font-semibold">{t}</span>
              <span className="text-muted"> · {b}</span>
            </motion.div>
          ))}
        </div>
      }
    >
      <p>
        In an office with hot desks, if you step away too long your desk may be given to someone
        else and cleared. The sensible habit: file things away whenever you step out.
      </p>
      <p>
        Apps live the same way. The system moves them through the{" "}
        <Term id="app-lifecycle">app lifecycle</Term> and may end them to reclaim memory, a{" "}
        <Term id="process-death">process death</Term>, without warning. Apps that save their state
        as they go never lose anything.
      </p>
    </StepLayout>
  );
}

/* 2 ─ Step through ⭐ ------------------------------------------------------------------------------ */

export function Lifecycle() {
  const [s, set] = useSceneState<LifeState>();
  const e = EVENTS[s.step];
  const last = s.step === EVENTS.length - 1;
  return (
    <StepLayout
      eyebrow="Step through"
      title="A phone call, then a process death"
      stage={
        <div className="flex flex-1 flex-col justify-center gap-3">
          <label className="flex items-center gap-2 text-xs">
            <input type="checkbox" checked={s.saved} onChange={() => set({ saved: !s.saved })} />
            Save the screen&apos;s state when the app leaves the foreground
          </label>
          <p className="text-sm font-medium">
            {s.step + 1}. {e.title}
          </p>
          <div className="grid gap-2 sm:grid-cols-2">
            {[
              ["iOS (scene states)", e.ios],
              ["Android (activity callbacks)", e.android],
            ].map(([t, v]) => (
              <motion.div
                key={`${t}-${s.step}`}
                initial={{ opacity: 0, y: 4 }}
                animate={{ opacity: 1, y: 0 }}
                className="border-line bg-surface rounded-lg border px-3 py-2 text-xs"
              >
                <p className="text-muted text-[10px]">{t}</p>
                <p className="font-mono text-[11px]">{v}</p>
              </motion.div>
            ))}
          </div>
          <div
            className={cn(
              "rounded-lg border px-3 py-2 text-xs",
              last
                ? s.saved
                  ? "border-good/50 bg-good/10"
                  : "border-bad/40 bg-bad/10"
                : "border-line bg-surface-2",
            )}
          >
            {last
              ? s.saved
                ? "The order screen comes back with “extra ginger” still typed in. The user never knew the app had been closed."
                : "A fresh, empty order screen. The note is gone, and the user has to start again."
              : e.note}
          </div>
          <div className="flex items-center gap-2 text-xs">
            <button
              type="button"
              disabled={s.step === 0}
              onClick={() => set({ step: s.step - 1 })}
              className="border-line-strong rounded-full border px-3 py-1 disabled:opacity-40"
            >
              Step back
            </button>
            <button
              type="button"
              disabled={last}
              onClick={() => set({ step: s.step + 1 })}
              className="border-line-strong rounded-full border px-3 py-1 disabled:opacity-40"
            >
              Next event
            </button>
            <span className="text-subtle">
              {s.step + 1} / {EVENTS.length}
            </span>
          </div>
        </div>
      }
    >
      <p>
        Step through an everyday sequence on both platforms. Try it once without saving state, then
        switch saving on and run it again.
      </p>
      <p>
        Notice step 5: the app gets no callback at all when its process is killed. Saving has to
        happen earlier, when it leaves the foreground.
      </p>
    </StepLayout>
  );
}

/* 3 ─ Saving --------------------------------------------------------------------------------------- */

export function Saving() {
  return (
    <StepLayout
      eyebrow="Explore"
      title="Where to save, on each platform"
      stage={
        <div className="flex flex-1 flex-col justify-center gap-1.5">
          {[
            [
              "Android: rotation",
              "A rotation, dark-mode switch or resize recreates the screen. A ViewModel survives it; a plain remembered value doesn't.",
            ],
            [
              "Android: process death",
              "rememberSaveable and SavedStateHandle survive the system killing the process (not a force stop).",
            ],
            ["Android: when", "Save persistent data in onStop, not onPause."],
            [
              "iOS: scenes",
              "Apps built with the iOS 27 SDK must use the scene lifecycle or they won't launch (Apple TN3187).",
            ],
            [
              "iOS: when",
              "Save when the scene leaves the foreground; a suspended app can be ended without notice.",
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
        Android&apos;s docs put it plainly: the system never kills an activity on its own to free
        memory; it kills the whole process. Background (&ldquo;cached&rdquo;) apps are killed
        routinely.
      </p>
      <p>
        Small UI state goes in the saved-state mechanisms; real data belongs in storage (module 10).
      </p>
    </StepLayout>
  );
}

/* 4 ─ Recent changes ------------------------------------------------------------------------------- */

export function Changes() {
  return (
    <StepLayout
      eyebrow="Explore"
      title="Recent platform changes"
      stage={
        <div className="flex flex-1 flex-col justify-center gap-1.5">
          {[
            [
              "Android 15",
              "Apps targeting it draw edge to edge, behind the status and navigation bars, by default.",
            ],
            [
              "Android 16",
              "That opt-out is disabled; predictive back animations are on by default and the old onBackPressed() isn't called.",
            ],
            [
              "Android 16 and 17, large screens",
              "Orientation and resizing limits are ignored on tablets and foldables; Android 17 removes the opt-out.",
            ],
            ["iOS 27", "The scene-based lifecycle becomes mandatory for newly built apps."],
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
        Many changes apply only once an app targets the newer platform version, but the app stores
        require recent targets, so every app gets there eventually.
      </p>
      <p>
        The theme across all of them: apps must cope with being resized, backgrounded and recreated
        at any moment.
      </p>
    </StepLayout>
  );
}

/* 5 ─ Checkpoint ----------------------------------------------------------------------------------- */

export function LifeCheck() {
  return (
    <StepLayout
      eyebrow="Checkpoint"
      title="What survives what?"
      stage={
        <div className="flex flex-1 flex-col justify-center">
          <SortCheckpoint
            id="mobile-lifecycle"
            prompt="On Android, how long does each kind of state last?"
            categories={[
              { id: "rotate", label: "Lost on rotation" },
              { id: "death", label: "Survives rotation, lost on process death" },
              { id: "keeps", label: "Survives process death" },
            ]}
            items={[
              {
                id: "remember",
                label: "A value held with plain remember",
                category: "rotate",
                why: "Recreated with the screen.",
              },
              {
                id: "vm",
                label: "A field in a ViewModel",
                category: "death",
                why: "Outlives the screen, not the process.",
              },
              {
                id: "saveable",
                label: "A value held with rememberSaveable",
                category: "keeps",
                why: "Saved into the instance state.",
              },
              {
                id: "handle",
                label: "A value in a SavedStateHandle",
                category: "keeps",
                why: "Restored after the process is recreated.",
              },
              {
                id: "global",
                label: "A value in a global singleton",
                category: "death",
                why: "Lives as long as the process.",
              },
            ]}
            explanation="Screen state is lost on rotation; ViewModels and singletons last as long as the process; saved state survives process death. Persistent data belongs in storage."
          />
        </div>
      }
    >
      <p>Sort each kind of state.</p>
    </StepLayout>
  );
}

/* 6 ─ Wrap ----------------------------------------------------------------------------------------- */

export function Wrap() {
  return (
    <WrapStep
      points={[
        ["Apps don't just run", "Foreground, background, suspended, gone."],
        ["Death without warning", "No callback when the process is killed."],
        ["Save as you leave", "onStop, or leaving the foreground."],
        ["Restore on return", "Saved state brings the screen back."],
        ["Expect recreation", "Rotation, resizing, dark mode."],
      ]}
    >
      <p>That ends the first chapter. Next: building screens.</p>
    </WrapStep>
  );
}
