"use client";

import { motion } from "motion/react";
import { Check, Minus, Plus, Trash2 } from "lucide-react";
import { useSceneState } from "@/lib/module-sdk";
import { StepLayout } from "@/toolkit/layout/step-layout";
import { WrapStep } from "@/toolkit/layout/wrap-step";
import { SortCheckpoint } from "@/toolkit/checkpoints/sort";
import { Term } from "@/toolkit/glossary/term";
import { cn } from "@/lib/cn";
import { ISSUES } from "./model";
import type { TouchState } from "./state";

/* 1 ─ Story ---------------------------------------------------------------------------------------- */

export function Thumbs() {
  return (
    <StepLayout
      eyebrow="Story"
      title="Buttons for thumbs"
      stage={
        <div className="flex flex-1 items-center justify-center gap-8">
          <div className="flex flex-col items-center gap-2 text-xs">
            <div className="flex gap-1">
              {[0, 1, 2, 3].map((i) => (
                <span key={i} className="border-line-strong size-3 rounded-sm border" />
              ))}
            </div>
            <span className="text-muted">A lift with tiny buttons</span>
          </div>
          <div className="flex flex-col items-center gap-2 text-xs">
            <div className="flex gap-2">
              {[0, 1, 2, 3].map((i) => (
                <motion.span
                  key={i}
                  initial={{ scale: 0.6 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.08 * i }}
                  className="border-accent bg-accent-soft size-9 rounded-full border"
                />
              ))}
            </div>
            <span className="text-muted">A lift designed for gloves</span>
          </div>
        </div>
      }
    >
      <p>
        Picture pressing a lift button while holding a coffee: tiny buttons packed together mean you
        hit the wrong floor. A good lift has big buttons, spaced apart, that light up the moment you
        press them.
      </p>
      <p>
        Phones are the same. A fingertip is far less precise than a mouse pointer, so each button
        needs a generous <Term id="touch-target">touch target</Term>, gestures need visible
        alternatives, and every tap needs instant feedback.
      </p>
    </StepLayout>
  );
}

/* 2 ─ Fix the problem ⭐ --------------------------------------------------------------------------- */

export function Basket() {
  const [s, set] = useSceneState<TouchState>();
  const on = (id: string) => s.fixed.includes(id);
  const toggle = (id: string) =>
    set({ fixed: on(id) ? s.fixed.filter((x) => x !== id) : [...s.fixed, id] });
  return (
    <StepLayout
      eyebrow="Fix the problem"
      title="Fix the basket screen"
      stage={
        <div className="flex flex-1 flex-col justify-center gap-3">
          <div className="grid gap-3 sm:grid-cols-[minmax(0,14rem)_minmax(0,1fr)]">
            <div className="border-line-strong bg-surface relative flex flex-col gap-2 overflow-hidden rounded-2xl border p-2 text-xs">
              <p className="font-semibold">Your basket</p>
              <div className={cn("flex gap-1.5 overflow-hidden", on("edge") ? "px-4" : "-ml-2")}>
                {["2 for 1 chai", "Free dosa", "10% off"].map((o) => (
                  <span
                    key={o}
                    className="bg-viz-meta/15 border-viz-meta/40 shrink-0 rounded-md border px-2 py-2 text-[10px]"
                  >
                    {o}
                  </span>
                ))}
              </div>
              {["Masala dosa", "Masala chai"].map((d) => (
                <div
                  key={d}
                  className="border-line flex items-center gap-1 rounded-md border px-2 py-1.5"
                >
                  <span className="min-w-0 flex-1 truncate">{d}</span>
                  {[Minus, Plus].map((I, i) => (
                    <span
                      key={i}
                      className={cn(
                        "relative grid place-items-center",
                        on("targets") ? "mx-[11px]" : "",
                      )}
                    >
                      <span
                        className={cn(
                          "absolute rounded-md border border-dashed",
                          on("targets") ? "border-good size-9" : "border-bad size-4",
                        )}
                      />
                      <I className="size-3" />
                    </span>
                  ))}
                  {on("hidden") && (
                    <Trash2 className="text-muted ml-1 size-3.5" aria-label="Remove" />
                  )}
                </div>
              ))}
              <div
                className={cn(
                  "mt-1 flex items-center justify-center gap-1 rounded-full py-2 font-medium",
                  on("feedback") ? "bg-good text-accent-fg" : "bg-accent text-accent-fg",
                )}
              >
                {on("feedback") && <Check className="size-3.5" />}
                {on("feedback") ? "Ordered" : "Place order"}
              </div>
              <p className="text-subtle text-[10px]">
                Dashed outlines show where each button responds to touch.
              </p>
            </div>
            <div className="grid min-w-0 content-start gap-1.5">
              {ISSUES.map((i) => (
                <div
                  key={i.id}
                  className={cn(
                    "rounded-lg border px-3 py-2 text-xs",
                    on(i.id) ? "border-good/50 bg-good/10" : "border-bad/40 bg-bad/5",
                  )}
                >
                  <p className="font-semibold">{i.title}</p>
                  <p className="text-muted">{on(i.id) ? i.fixed : i.problem}</p>
                  <button
                    type="button"
                    aria-pressed={on(i.id)}
                    onClick={() => toggle(i.id)}
                    className={cn(
                      "mt-1 rounded-full border px-2.5 py-0.5 text-[11px]",
                      on(i.id) ? "border-good text-good" : "border-line-strong",
                    )}
                  >
                    {on(i.id) ? "Fixed · undo" : i.fix}
                  </button>
                </div>
              ))}
            </div>
          </div>
          <p className="text-muted text-xs">
            {s.fixed.length} of {ISSUES.length} problems fixed.
          </p>
        </div>
      }
    >
      <p>
        The café&apos;s basket screen works fine with a mouse in the office, but customers use it
        one-handed while queueing. Read each problem and apply its fix.
      </p>
      <p>
        Notice the first fix: the icons don&apos;t get bigger, only the area that responds to touch
        does.
      </p>
    </StepLayout>
  );
}

/* 3 ─ Sizes ---------------------------------------------------------------------------------------- */

export function Sizes() {
  const rows: [string, string, number][] = [
    ["WCAG 2.2 minimum (AA)", "24 × 24 CSS px", 24],
    ["Apple's smallest allowed iOS control", "28 × 28 pt", 28],
    ["Apple's default iOS control", "44 × 44 pt", 44],
    ["WCAG enhanced (AAA)", "44 × 44 CSS px", 44],
    ["Android and Material", "48 × 48 dp", 48],
  ];
  return (
    <StepLayout
      eyebrow="Explore"
      title="How big is big enough?"
      stage={
        <div className="flex flex-1 flex-col justify-center gap-2">
          {rows.map(([t, v, n], i) => (
            <motion.div
              key={t}
              initial={{ opacity: 0, x: -4 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.06 * i }}
              className="flex items-center gap-3 text-xs"
            >
              <span className="grid w-14 shrink-0 place-items-center">
                <span
                  className="border-accent bg-accent-soft rounded-md border"
                  style={{ width: n * 0.9, height: n * 0.9 }}
                />
              </span>
              <span className="min-w-0 flex-1">
                <span className="font-semibold">{v}</span>
                <span className="text-muted"> · {t}</span>
              </span>
            </motion.div>
          ))}
        </div>
      }
    >
      <p>
        Points (iOS) and dp (Android) are sizes that stay physically about the same on every screen.
        44 pt or 48 dp is roughly 7 to 8 mm: about the pad of a fingertip.
      </p>
      <p>
        Apple&apos;s guidelines (updated March 2025) give 44 × 44 pt as the default and 28 × 28 pt
        as the smallest allowed. Material&apos;s buttons enforce 48 dp automatically. Aim for the
        default; spacing between targets matters as much as size.
      </p>
    </StepLayout>
  );
}

/* 4 ─ Gestures and feedback ------------------------------------------------------------------------ */

export function Gestures() {
  return (
    <StepLayout
      eyebrow="Explore"
      title="Gestures and feedback"
      stage={
        <div className="grid flex-1 content-center gap-1.5 sm:grid-cols-2">
          {[
            [
              "Gestures are invisible",
              "Always offer a button too: swipe-to-delete plus a Remove button.",
            ],
            [
              "The edges belong to the system",
              "Swipes from the edges mean Back and Home. Android lets apps opt out of Back for small areas only, never Home.",
            ],
            [
              "React on touch",
              "Show a pressed state immediately, even if the work takes a moment.",
            ],
            [
              "Haptics with meaning",
              "Use the system's success, warning and selection patterns, sparingly, and respect the user's settings.",
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
        <Term id="haptics">Haptics</Term> are small vibrations that confirm an action. On iOS they
        come from feedback generators (or <code>.sensoryFeedback</code> in SwiftUI); on Android from{" "}
        <code>performHapticFeedback</code>, which needs no special permission.
      </p>
      <p>
        Since iOS 26, a sideways swipe anywhere inside a pushed screen can mean Back, so sideways
        gestures in your own content now compete with it too.
      </p>
    </StepLayout>
  );
}

/* 5 ─ Checkpoint ----------------------------------------------------------------------------------- */

export function TouchCheck() {
  return (
    <StepLayout
      eyebrow="Checkpoint"
      title="Fine, or needs a fix?"
      stage={
        <div className="flex flex-1 flex-col justify-center">
          <SortCheckpoint
            id="mobile-touch"
            prompt="Is each design fine as it is, or does it need a fix?"
            categories={[
              { id: "fine", label: "Fine" },
              { id: "fix", label: "Needs a fix" },
            ]}
            items={[
              {
                id: "icon",
                label: "A 20 pt icon with a 44 pt invisible touch area",
                category: "fine",
                why: "Touch area matters, not icon size.",
              },
              {
                id: "archive",
                label: "Archive only by long-pressing, with no hint",
                category: "fix",
                why: "Hidden gesture with no alternative.",
              },
              {
                id: "pay",
                label: "Pay button that shows nothing until the server replies",
                category: "fix",
                why: "No immediate feedback invites double taps.",
              },
              {
                id: "haptic",
                label: "A success haptic when an order is confirmed",
                category: "fine",
                why: "A system pattern used for its meaning.",
              },
              {
                id: "drawer",
                label: "A menu that opens by swiping from the very bottom edge",
                category: "fix",
                why: "Collides with the Home gesture.",
              },
            ]}
            explanation="Generous touch areas, visible alternatives to gestures, instant feedback and staying clear of system edge gestures make an app easy to use one-handed."
          />
        </div>
      }
    >
      <p>Sort each design.</p>
    </StepLayout>
  );
}

/* 6 ─ Wrap ----------------------------------------------------------------------------------------- */

export function Wrap() {
  return (
    <WrapStep
      points={[
        ["Thumb-sized targets", "44 pt on iOS, 48 dp on Android."],
        ["Touch area ≠ icon size", "Pad invisible hit areas."],
        ["Gestures need a button too", "Not everyone can find or make them."],
        ["Respond instantly", "Pressed states, progress, haptics."],
        ["Leave the edges alone", "They belong to Back and Home."],
      ]}
    >
      <p>Next: one app on phones, tablets and foldables.</p>
    </WrapStep>
  );
}
