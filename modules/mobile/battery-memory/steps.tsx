"use client";

import { motion } from "motion/react";
import { useSceneState } from "@/lib/module-sdk";
import { StepLayout } from "@/toolkit/layout/step-layout";
import { WrapStep } from "@/toolkit/layout/wrap-step";
import { OrderCheckpoint } from "@/toolkit/checkpoints/order";
import { Term } from "@/toolkit/glossary/term";
import { cn } from "@/lib/cn";
import { CAMERA, HABITS, LOCK_LIMIT, RAM, SYSTEM, day, memory } from "./model";
import type { BattState } from "./state";

/* 1 ─ Story ---------------------------------------------------------------------------------------- */

export function Flat() {
  return (
    <StepLayout
      eyebrow="Story"
      title="The shared flat"
      stage={
        <div className="flex flex-1 flex-col justify-center gap-2">
          {[
            [
              "The hot water",
              "One flatmate leaves the shower running all day. Everyone else gets cold showers.",
            ],
            [
              "The fridge",
              "Another fills every shelf. When space runs out, the landlord clears the biggest, oldest stash first.",
            ],
          ].map(([t, b], i) => (
            <motion.div
              key={t}
              initial={{ opacity: 0, x: -4 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.15 * i }}
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
        In a shared flat, the hot water and fridge belong to everyone. Hog them and the others
        suffer, and eventually someone acts.
      </p>
      <p>
        Every app on a phone shares one battery and one pool of memory. The system watches for apps
        that keep the phone awake with <Term id="wake-lock">wake locks</Term> or hoard memory, and
        ends them in a <Term id="low-memory-kill">low-memory kill</Term> when space runs short.
      </p>
    </StepLayout>
  );
}

/* 2 ─ Simulation ⭐ -------------------------------------------------------------------------------- */

export function Drain() {
  const [s, set] = useSceneState<BattState>();
  const d = day(s.good);
  const m = memory(s.small, s.release);
  const seg = (mb: number) => `${(mb / RAM) * 100}%`;
  return (
    <StepLayout
      eyebrow="Simulation"
      title="What drains, what gets killed"
      stage={
        <div className="flex flex-1 flex-col justify-center gap-3 text-xs">
          <div className="border-line bg-surface rounded-lg border px-3 py-2">
            <p className="font-semibold">A day in the background</p>
            <div className="mt-1.5 grid gap-1">
              {HABITS.map((h) => {
                const good = !!s.good[h.id];
                return (
                  <div
                    key={h.id}
                    className="grid gap-1 sm:grid-cols-[6rem_minmax(0,1fr)] sm:items-center"
                  >
                    <span className="text-muted text-[11px]">{h.title}</span>
                    <div className="flex flex-wrap gap-1">
                      {[false, true].map((g) => (
                        <button
                          key={String(g)}
                          type="button"
                          aria-pressed={good === g}
                          onClick={() => set({ good: { ...s.good, [h.id]: g } })}
                          className={cn(
                            "rounded-full border px-2 py-0.5 text-left text-[10px]",
                            good === g
                              ? g
                                ? "border-good bg-good/15"
                                : "border-bad bg-bad/10"
                              : "border-line-strong text-muted",
                          )}
                        >
                          {g ? h.good : h.bad}
                        </button>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
            <div className="mt-2 grid gap-1 sm:grid-cols-2">
              <p>
                Background battery: <span className="font-mono">{d.drain}%</span> a day
              </p>
              <p className={d.lock >= LOCK_LIMIT ? "text-bad" : ""}>
                Wake locks: <span className="font-mono">{d.lock} h</span> a day
                {d.lock >= LOCK_LIMIT ? " (excessive)" : ""}
              </p>
            </div>
            {d.lock >= LOCK_LIMIT && (
              <p className="border-bad/40 bg-bad/5 mt-1 rounded-md border px-2 py-1 text-[11px]">
                Two hours or more a day counts as excessive in Google Play&apos;s vitals. If it
                happens in over 5% of sessions, the store listing can warn that the app may drain
                the battery.
              </p>
            )}
          </div>
          <div className="border-line bg-surface rounded-lg border px-3 py-2">
            <p className="font-semibold">The customer opens the camera (4 GB phone)</p>
            <div className="mt-1.5 flex h-5 overflow-hidden rounded-md text-[9px]">
              <span
                className="bg-viz-idle/60 grid place-items-center"
                style={{ width: seg(SYSTEM) }}
              >
                system and other apps
              </span>
              <span
                className="bg-viz-compute/70 grid place-items-center"
                style={{ width: seg(CAMERA) }}
              >
                camera
              </span>
              <motion.span
                animate={{ width: seg(m.app) }}
                className={cn("grid place-items-center", m.killed ? "bg-bad" : "bg-viz-data")}
              >
                café
              </motion.span>
            </div>
            <p className={cn("mt-1.5", m.killed ? "text-bad" : "text-good")}>
              {m.killed
                ? `The café app needs ${m.app} MB but only ${m.room} MB is free. The system kills it; the customer returns to a cold start.`
                : `The café app fits in ${m.app} MB and stays in memory, ready to resume instantly.`}
            </p>
            <div className="mt-1 grid gap-1">
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={s.small}
                  onChange={() => set({ small: !s.small })}
                />
                Cache thumbnail-sized images, not full photos
              </label>
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={s.release}
                  onChange={() => set({ release: !s.release })}
                />
                Empty the image cache when the system warns memory is low
              </label>
            </div>
          </div>
          <p className="text-subtle text-[10px]">Illustrative numbers.</p>
        </div>
      }
    >
      <p>
        Choose how the café app behaves in the background, then see what happens when the customer
        switches to the camera to photograph their food.
      </p>
      <p>
        A wake lock keeps the processor running with the screen off. It&apos;s the most common
        avoidable battery drain; scheduled work and pushes do the same jobs without one.
      </p>
    </StepLayout>
  );
}

/* 3 ─ Battery -------------------------------------------------------------------------------------- */

export function Battery() {
  return (
    <StepLayout
      eyebrow="Explore"
      title="Battery rules with teeth"
      stage={
        <div className="flex flex-1 flex-col justify-center gap-1.5">
          {[
            [
              "Wake locks are measured",
              "Since November 2025, excessive wake locks are one of Google Play's core vitals; enforcement began on 1 March 2026.",
            ],
            [
              "The consequences",
              "A warning on the store listing, and the app left out of recommendations.",
            ],
            [
              "Doze and standby",
              "Idle phones and rarely used apps get their work deferred and batched.",
            ],
            [
              "iOS",
              "A backgrounded app has seconds to finish up before it's suspended; longer work goes through background tasks the system schedules.",
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
        People notice when an app tops the battery list in Settings, and many uninstall it. The
        stores now act on it too.
      </p>
      <p>
        The biggest drains are radios (GPS, cellular), the screen, and keeping the processor awake.
      </p>
    </StepLayout>
  );
}

/* 4 ─ Memory --------------------------------------------------------------------------------------- */

export function Memory() {
  return (
    <StepLayout
      eyebrow="Explore"
      title="When memory runs out"
      stage={
        <div className="grid flex-1 content-center gap-1.5 sm:grid-cols-2">
          {[
            [
              "Android",
              "The low-memory killer ends processes by importance: cached background apps first, the app on screen last. Apps get a warning callback first.",
            ],
            [
              "iOS",
              "Memory warnings, then a “jetsam” kill. Suspended apps go first, and extensions have much lower limits. Apple doesn't publish per-device limits.",
            ],
            [
              "New Play rules",
              "Memory use becomes a core vital, with limits by device RAM, from February 2027.",
            ],
            ["Android 17", "Apps get memory limits based on the device's RAM."],
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
        A kill while the app is on screen looks exactly like a crash to the user. A kill in the
        background is normal, which is why module 3 saved state.
      </p>
      <p>
        Images are the usual culprit: a 12-megapixel photo decoded at full size takes tens of
        megabytes. Decode at the size you display.
      </p>
    </StepLayout>
  );
}

/* 5 ─ Checkpoint ----------------------------------------------------------------------------------- */

export function BattCheck() {
  return (
    <StepLayout
      eyebrow="Checkpoint"
      title="Who goes first?"
      stage={
        <div className="flex flex-1 flex-col justify-center">
          <OrderCheckpoint
            id="mobile-memory"
            prompt="Android runs short of memory. Order these from killed first to killed last."
            items={[
              { id: "cached", label: "An app last used yesterday, cached in the background" },
              { id: "previous", label: "The app you were using just before this one" },
              { id: "music", label: "A music app playing in the background" },
              { id: "screen", label: "The app on screen" },
            ]}
            explanation="Cached background apps go first, then the previous app; something the user can perceive, like music, is protected; the app on screen goes last."
          />
        </div>
      }
    >
      <p>Put them in order.</p>
    </StepLayout>
  );
}

/* 6 ─ Wrap ----------------------------------------------------------------------------------------- */

export function Wrap() {
  return (
    <WrapStep
      points={[
        ["Don't keep the phone awake", "Push and scheduled work instead of wake locks."],
        ["Switch radios off", "Stop GPS when the job's done."],
        ["Be small in the background", "Release caches on warnings."],
        ["Decode images small", "At display size."],
        ["Stores are watching", "Wake locks now, memory from 2027."],
      ]}
    >
      <p>Next: testing across many devices.</p>
    </WrapStep>
  );
}
