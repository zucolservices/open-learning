"use client";

import { motion } from "motion/react";
import { useSceneState } from "@/lib/module-sdk";
import { StepLayout } from "@/toolkit/layout/step-layout";
import { WrapStep } from "@/toolkit/layout/wrap-step";
import { ChoiceCheckpoint } from "@/toolkit/checkpoints/choice";
import { Term } from "@/toolkit/glossary/term";
import { cn } from "@/lib/cn";
import { NUMBERS, SITUATIONS } from "./model";
import type { DiffState } from "./state";

/* 2 ─ Situations ----------------------------------------------------------------------------------- */

export function Situations() {
  const [s, set] = useSceneState<DiffState>();
  const done = SITUATIONS.every((x) => x.options.find((o) => o.id === s.picks[x.id])?.ok);
  return (
    <StepLayout
      eyebrow="Branching scenario"
      title="What should the app do?"
      stage={
        <div className="flex flex-1 flex-col justify-center gap-2">
          {SITUATIONS.map((x) => {
            const pick = x.options.find((o) => o.id === s.picks[x.id]);
            return (
              <div
                key={x.id}
                className="border-line bg-surface rounded-lg border px-3 py-2 text-xs"
              >
                <p className="font-medium">{x.text}</p>
                <div className="mt-1 grid gap-1">
                  {x.options.map((o) => (
                    <button
                      key={o.id}
                      type="button"
                      aria-pressed={pick?.id === o.id}
                      onClick={() => set({ picks: { ...s.picks, [x.id]: o.id } })}
                      className={cn(
                        "rounded-md border px-2 py-1 text-left text-[11px]",
                        pick?.id === o.id
                          ? o.ok
                            ? "border-good bg-good/15"
                            : "border-bad bg-bad/10"
                          : "border-line hover:border-line-strong",
                      )}
                    >
                      {o.label}
                    </button>
                  ))}
                </div>
                {pick && (
                  <p className={cn("mt-1 text-[11px]", pick.ok ? "text-good" : "text-muted")}>
                    {pick.outcome}
                  </p>
                )}
              </div>
            );
          })}
          {done && (
            <p className="text-good text-xs">
              Each choice respects a real constraint: thumbs, signal, interruptions and battery.
            </p>
          )}
        </div>
      }
    >
      <p>
        Four everyday moments from Asha&apos;s commute. For each, choose how the app should behave.
      </p>
      <p>
        None of these happen on a desktop computer plugged into the wall. On a phone they happen
        every day.
      </p>
    </StepLayout>
  );
}

/* 3 ─ Numbers -------------------------------------------------------------------------------------- */

export function Numbers() {
  return (
    <StepLayout
      eyebrow="Explore"
      title="Who's on what"
      stage={
        <div className="flex flex-1 flex-col justify-center gap-1.5">
          {NUMBERS.map(([t, v], i) => (
            <motion.div
              key={t}
              initial={{ opacity: 0, x: -4 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.06 * i }}
              className="border-line bg-surface rounded-lg border px-3 py-2 text-xs"
            >
              <p className="text-muted text-[10px]">{t}</p>
              <p className="font-medium">{v}</p>
            </motion.div>
          ))}
        </div>
      }
    >
      <p>
        Most people now reach the web on a phone, through a{" "}
        <Term id="mobile-os">mobile operating system</Term>. Android dominates worldwide and
        overwhelmingly so in India; iOS is strong in some richer markets, so most products need
        both.
      </p>
      <p>
        Steven Hoober&apos;s 2013 study watched people use phones in public: in about half the
        observed touches, they used one hand.
      </p>
    </StepLayout>
  );
}

/* 4 ─ Platforms ------------------------------------------------------------------------------------ */

export function Platforms() {
  return (
    <StepLayout
      eyebrow="Explore"
      title="The platforms in October 2026"
      stage={
        <div className="grid flex-1 content-center gap-1.5 sm:grid-cols-2">
          {[
            ["iOS 27", "Swift 6.4 and SwiftUI; new apps must be built with recent Xcode versions."],
            ["Android 17 (API 37)", "Kotlin 2.4 and Jetpack Compose."],
            ["Flutter 3.47", "One Dart codebase, its own rendering engine."],
            ["React Native 0.87", "JavaScript/TypeScript; the New Architecture is now mandatory."],
            ["Kotlin Multiplatform", "Share Kotlin logic, and UI with Compose Multiplatform."],
            [".NET MAUI", "C# across platforms; Xamarin support ended in May 2024."],
          ].map(([t, b], i) => (
            <motion.div
              key={t}
              initial={{ opacity: 0, y: 4 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.05 * i }}
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
        This track uses all of them. The ideas are the same everywhere; only the names of the tools
        change.
      </p>
      <p>Next you&apos;ll weigh up which approach suits which app.</p>
    </StepLayout>
  );
}

/* 5 ─ Checkpoint ----------------------------------------------------------------------------------- */

export function DiffCheck() {
  return (
    <StepLayout
      eyebrow="Checkpoint"
      title="Coming back after a call"
      stage={
        <div className="flex flex-1 flex-col justify-center">
          <ChoiceCheckpoint
            id="mobile-differs"
            prompt="Asha is halfway through an order when a long call comes in. Twenty minutes later they reopen the app; the system had closed it meanwhile. What should they see?"
            options={[
              {
                id: "home",
                label: "The home screen, starting fresh",
                feedback: "Their work is lost through no fault of their own.",
              },
              {
                id: "restored",
                label: "Their half-finished order, exactly as they left it",
                correct: true,
                feedback:
                  "Right: the app saved its state and restored it, so being closed didn't matter.",
              },
              {
                id: "error",
                label: "A message saying the app crashed",
                feedback:
                  "Nothing crashed; the system closed it normally. Apps should expect this.",
              },
            ]}
            explanation="Phones close background apps whenever they need memory. Good apps save what matters and restore it, so users never notice."
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
        ["Designed for thumbs", "Big targets within reach."],
        ["Expect no signal", "Save now, send later."],
        ["Expect interruptions", "Save and restore state."],
        ["Respect the battery", "Do less in the background."],
        ["Two big platforms", "Android and iOS, plus cross-platform options."],
      ]}
    >
      <p>Next: native, cross-platform or web?</p>
    </WrapStep>
  );
}
