"use client";

import { motion } from "motion/react";
import { useSceneState } from "@/lib/module-sdk";
import { StepLayout } from "@/toolkit/layout/step-layout";
import { WrapStep } from "@/toolkit/layout/wrap-step";
import { SortCheckpoint } from "@/toolkit/checkpoints/sort";
import { Term } from "@/toolkit/glossary/term";
import { cn } from "@/lib/cn";
import { LAYOUT, PRESETS, sizeClass, type SizeClass } from "./model";
import type { AdaptState } from "./state";

/* 1 ─ Story ---------------------------------------------------------------------------------------- */

export function Water() {
  return (
    <StepLayout
      eyebrow="Story"
      title="Water takes the shape of the glass"
      stage={
        <div className="flex flex-1 items-end justify-center gap-4 pb-6">
          {[
            ["w-8 h-24", "Tall glass"],
            ["w-16 h-14", "Tumbler"],
            ["w-28 h-8", "Tray"],
          ].map(([c, t], i) => (
            <div key={t} className="flex flex-col items-center gap-1 text-[10px]">
              <div
                className={cn(
                  "border-line-strong relative overflow-hidden rounded-b-lg border border-t-0",
                  c,
                )}
              >
                <motion.div
                  initial={{ height: 0 }}
                  animate={{ height: "70%" }}
                  transition={{ delay: 0.15 * i, duration: 0.6 }}
                  className="bg-viz-data/40 absolute inset-x-0 bottom-0"
                />
              </div>
              <span className="text-muted">{t}</span>
            </div>
          ))}
        </div>
      }
    >
      <p>
        Pour the same water into a tall glass, a tumbler and a tray, and it fills each one. It
        doesn&apos;t insist on being glass-shaped.
      </p>
      <p>
        An app should behave the same way. The same app runs on small phones, tablets, unfolding
        foldables and in resizable windows. An <Term id="adaptive-layout">adaptive layout</Term>{" "}
        rearranges itself for the space it&apos;s given, and keeps clear of notches and system bars.
      </p>
    </StepLayout>
  );
}

/* 2 ─ Sandbox ⭐ ----------------------------------------------------------------------------------- */

function Pane({ title, rows, className }: { title: string; rows: string[]; className?: string }) {
  return (
    <div className={cn("border-line bg-surface-2 min-w-0 rounded-md border p-1.5", className)}>
      <p className="truncate text-[10px] font-semibold">{title}</p>
      {rows.map((r) => (
        <p key={r} className="border-line text-muted truncate border-t py-1 text-[10px]">
          {r}
        </p>
      ))}
    </div>
  );
}

const ORDERS = ["#482 · Masala dosa", "#481 · Chai × 2", "#480 · Idli"];
const DETAIL = ["Masala dosa × 1", "Extra chutney", "Ready at 12:40"];

export function Resize() {
  const [s, set] = useSceneState<AdaptState>();
  const real = sizeClass(s.dp);
  const cls: SizeClass = s.adapt ? real : "compact";
  const lay = LAYOUT[cls];
  const nav = ["Menu", "Orders", "Account"];
  return (
    <StepLayout
      eyebrow="Sandbox"
      title="Resize the café app"
      stage={
        <div className="flex flex-1 flex-col justify-center gap-3 text-xs">
          <div className="flex flex-wrap gap-1">
            {PRESETS.map(([t, dp]) => (
              <button
                key={t}
                type="button"
                aria-pressed={s.dp === dp}
                onClick={() => set({ dp })}
                className={cn(
                  "rounded-full border px-2.5 py-0.5 text-[11px]",
                  s.dp === dp
                    ? "border-accent bg-accent text-accent-fg"
                    : "border-line-strong text-muted",
                )}
              >
                {t}
              </button>
            ))}
          </div>
          <label className="flex flex-col gap-1">
            <span>
              Window width: <span className="font-mono">{s.dp} dp</span> ·{" "}
              <span className="text-accent font-medium">{real}</span> ({LAYOUT[real].range})
            </span>
            <input
              type="range"
              min={320}
              max={1400}
              step={10}
              value={s.dp}
              onChange={(e) => set({ dp: Number(e.target.value) })}
            />
          </label>
          <motion.div
            animate={{ width: `${Math.max(30, (s.dp / 1400) * 100)}%` }}
            transition={{ type: "spring", stiffness: 200, damping: 26 }}
            className="border-line-strong bg-surface relative flex h-56 flex-col overflow-hidden rounded-xl border"
          >
            <div
              className="bg-fg absolute top-1 left-1/2 h-2.5 w-12 -translate-x-1/2 rounded-full"
              aria-hidden
            />
            <div className={cn("flex min-h-0 flex-1 gap-1.5 p-1.5", s.safe && "pt-5")}>
              {cls !== "compact" && (
                <div
                  className={cn(
                    "border-line flex shrink-0 flex-col gap-1 border-r pr-1.5",
                    cls === "large" ? "w-20" : "w-8",
                  )}
                >
                  {nav.map((n) => (
                    <span
                      key={n}
                      className="bg-surface-2 truncate rounded px-1 py-1 text-center text-[9px]"
                    >
                      {cls === "large" ? n : n[0]}
                    </span>
                  ))}
                </div>
              )}
              <Pane title="Orders" rows={ORDERS} className="flex-1" />
              {(cls === "expanded" || cls === "large") && (
                <Pane title="Order #482" rows={DETAIL} className="flex-1" />
              )}
              {cls === "large" && (
                <Pane
                  title="Offers"
                  rows={["2 for 1 chai", "Free dosa"]}
                  className="w-28 shrink-0"
                />
              )}
            </div>
            {cls === "compact" && (
              <div
                className={cn(
                  "border-line grid grid-cols-3 border-t",
                  s.safe ? "pt-1 pb-3" : "py-1",
                )}
              >
                {nav.map((n) => (
                  <span key={n} className="text-muted truncate text-center text-[9px]">
                    {n}
                  </span>
                ))}
              </div>
            )}
            <div
              className="bg-line-strong absolute bottom-1 left-1/2 h-1 w-16 -translate-x-1/2 rounded-full"
              aria-hidden
            />
          </motion.div>
          <p className="text-muted">
            {s.adapt
              ? `${lay.nav}. ${lay.panes}.`
              : real === "compact"
                ? "A phone layout on a phone-sized window: fine."
                : "The phone layout, stretched. Rows grow absurdly wide and the extra space is wasted."}
            {!s.safe && " The camera cutout and the home indicator overlap the content."}
          </p>
          <div className="grid gap-1">
            <label className="flex items-center gap-2">
              <input type="checkbox" checked={s.adapt} onChange={() => set({ adapt: !s.adapt })} />
              Choose the layout by width class
            </label>
            <label className="flex items-center gap-2">
              <input type="checkbox" checked={s.safe} onChange={() => set({ safe: !s.safe })} />
              Keep content inside the safe area
            </label>
          </div>
        </div>
      }
    >
      <p>
        Drag the width or pick a device. The app starts with a phone layout everywhere. Turn on
        adapting to the <Term id="window-size-class">window size class</Term>, then keep content
        inside the <Term id="safe-area">safe area</Term>.
      </p>
      <p>
        Note &ldquo;Tablet, split screen&rdquo;: a tablet&apos;s window can be phone-sized. Lay out
        for the window you&apos;re given, never for the device you think you&apos;re on.
      </p>
    </StepLayout>
  );
}

/* 3 ─ Size classes --------------------------------------------------------------------------------- */

export function Classes() {
  return (
    <StepLayout
      eyebrow="Explore"
      title="Size classes on each platform"
      stage={
        <div className="grid flex-1 content-center gap-2 sm:grid-cols-2">
          <div className="border-line bg-surface rounded-lg border px-3 py-2 text-xs">
            <p className="font-semibold">Android: window size classes</p>
            <ul className="text-muted mt-1 space-y-0.5">
              <li>Compact: under 600 dp</li>
              <li>Medium: 600–839 dp</li>
              <li>Expanded: 840–1199 dp</li>
              <li>Large and extra-large: 1200 dp and up (added 2025)</li>
            </ul>
            <p className="text-subtle mt-1 text-[10px]">
              Heights have classes too: compact under 480 dp.
            </p>
          </div>
          <div className="border-line bg-surface rounded-lg border px-3 py-2 text-xs">
            <p className="font-semibold">iOS and iPadOS: size classes</p>
            <ul className="text-muted mt-1 space-y-0.5">
              <li>Each axis is compact or regular</li>
              <li>iPhone portrait: compact width, regular height</li>
              <li>Full-screen iPad: regular both ways</li>
              <li>A narrow iPad window: compact width</li>
            </ul>
            <p className="text-subtle mt-1 text-[10px]">
              Apple: lay out by size class, not device or orientation.
            </p>
          </div>
        </div>
      }
    >
      <p>
        Both platforms give the app a coarse label for the space it has, so you design a few layouts
        instead of one per device. Flutter and React Native apps read the window size and apply the
        same breakpoints.
      </p>
      <p>
        Foldables add a twist: a half-folded phone has a hinge across the screen. Android&apos;s
        WindowManager reports it, so a video can sit above the fold and controls below.
      </p>
    </StepLayout>
  );
}

/* 4 ─ Rules ---------------------------------------------------------------------------------------- */

export function Rules() {
  return (
    <StepLayout
      eyebrow="Explore"
      title="The rules are tightening"
      stage={
        <div className="flex flex-1 flex-col justify-center gap-1.5">
          {[
            [
              "Android 15",
              "Apps targeting it draw edge to edge, behind the status and navigation bars. Insets tell the app where the bars are.",
            ],
            [
              "Android 16",
              "On screens 600 dp and wider, portrait locks and resizing limits are ignored for apps targeting it (games are exempt).",
            ],
            [
              "Android 17",
              "The temporary opt-out from that is removed. Google Play will require targeting Android 17 from August 2027.",
            ],
            [
              "iPadOS 26",
              "Freely resizable windows. Opting out with full-screen-only is deprecated; such apps are scaled instead of resized.",
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
        For years, many apps simply locked themselves to portrait on a phone-sized canvas. Both
        platforms are ending that: on big screens, your app will be resized whether it&apos;s ready
        or not.
      </p>
      <p>
        The safe area on iOS and window insets on Android describe where it&apos;s safe to draw,
        clear of the Dynamic Island, camera cutouts, rounded corners and the keyboard.
      </p>
    </StepLayout>
  );
}

/* 5 ─ Checkpoint ----------------------------------------------------------------------------------- */

export function AdaptCheck() {
  return (
    <StepLayout
      eyebrow="Checkpoint"
      title="Which width class?"
      stage={
        <div className="flex flex-1 flex-col justify-center">
          <SortCheckpoint
            id="mobile-size-class"
            prompt="Which Android width class is each app window in?"
            categories={[
              { id: "compact", label: "Compact" },
              { id: "medium", label: "Medium" },
              { id: "expanded", label: "Expanded or wider" },
            ]}
            items={[
              {
                id: "phone",
                label: "A phone in portrait, 412 dp wide",
                category: "compact",
                why: "Under 600 dp.",
              },
              {
                id: "split",
                label: "Half of a tablet in split screen, 520 dp",
                category: "compact",
                why: "The window is what counts, not the device.",
              },
              {
                id: "fold",
                label: "An unfolded foldable, 690 dp",
                category: "medium",
                why: "Between 600 and 839 dp.",
              },
              {
                id: "tablet",
                label: "A tablet in landscape, 960 dp",
                category: "expanded",
                why: "840 dp or more.",
              },
              {
                id: "desk",
                label: "A desktop-style window, 1280 dp",
                category: "expanded",
                why: "Large, which is wider than expanded.",
              },
            ]}
            explanation="Width classes depend on the app's window, not the device: a tablet in split screen can be compact. Under 600 dp is compact, 600–839 medium, 840 and up expanded or wider."
          />
        </div>
      }
    >
      <p>Sort each window.</p>
    </StepLayout>
  );
}

/* 6 ─ Wrap ----------------------------------------------------------------------------------------- */

export function Wrap() {
  return (
    <WrapStep
      points={[
        ["Lay out for the window", "Not the device or orientation."],
        ["A few layouts, by class", "Compact, medium, expanded and up."],
        ["Navigation changes too", "Bottom bar, rail, drawer."],
        ["Respect the safe area", "Notches, bars, corners, keyboard."],
        ["Locks are going away", "Big screens will resize your app."],
      ]}
    >
      <p>That ends the chapter on screens. Next: data and the network.</p>
    </WrapStep>
  );
}
