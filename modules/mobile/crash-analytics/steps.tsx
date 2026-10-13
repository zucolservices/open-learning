"use client";

import { motion } from "motion/react";
import { useSceneState } from "@/lib/module-sdk";
import { StepLayout } from "@/toolkit/layout/step-layout";
import { WrapStep } from "@/toolkit/layout/wrap-step";
import { ChoiceCheckpoint } from "@/toolkit/checkpoints/choice";
import { Term } from "@/toolkit/glossary/term";
import { cn } from "@/lib/cn";
import { ATTACH, ISSUES } from "./model";
import type { CrashState } from "./state";

/* 1 ─ Story ---------------------------------------------------------------------------------------- */

export function Kitchen() {
  return (
    <StepLayout
      eyebrow="Story"
      title="The comment cards"
      stage={
        <div className="flex flex-1 flex-col justify-center gap-2">
          {[
            ["A customer chokes on a bone", "Drop everything."],
            ["Ten people say the soup is cold", "Fix it today."],
            ["One person dislikes the font on the menu", "Note it."],
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
        A café manager reads the comment cards and decides what matters most: how bad, how many
        people, and whether it&apos;s new. Nobody needs the customer&apos;s home address to fix cold
        soup.
      </p>
      <p>
        Once an app ships, <Term id="crash-reporting">crash reports</Term>, freeze reports and the
        stores&apos; <Term id="app-vitals">vitals</Term> are those comment cards, arriving by the
        thousand.
      </p>
    </StepLayout>
  );
}

/* 2 ─ Branching scenario ⭐ ------------------------------------------------------------------------ */

export function Triage() {
  const [s, set] = useSceneState<CrashState>();
  const remaining = ISSUES.filter((i) => !s.order.includes(i.id));
  const done = remaining.length === 0;
  return (
    <StepLayout
      eyebrow="Branching scenario"
      title="Triage the new release"
      stage={
        <div className="flex flex-1 flex-col justify-center gap-3 text-xs">
          <div className="grid gap-1.5">
            {s.order.map((id, n) => {
              const i = ISSUES.find((x) => x.id === id)!;
              return (
                <motion.div
                  key={id}
                  initial={{ opacity: 0, y: 4 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={cn(
                    "rounded-lg border px-3 py-1.5",
                    done
                      ? i.rank === n + 1
                        ? "border-good/50 bg-good/10"
                        : "border-viz-meta/50 bg-viz-meta/10"
                      : "border-line bg-surface-2",
                  )}
                >
                  <p>
                    <span className="font-mono">{n + 1}.</span> {i.title}
                  </p>
                  {done && (
                    <p className="text-muted">
                      Suggested: #{i.rank}. {i.why}
                    </p>
                  )}
                </motion.div>
              );
            })}
            {remaining.map((i) => (
              <div
                key={i.id}
                className="border-line bg-surface flex items-center gap-2 rounded-lg border px-3 py-1.5"
              >
                <span className="min-w-0 flex-1">
                  <span className="text-accent mr-1.5 text-[10px] font-medium">{i.tag}</span>
                  {i.title}
                  <span className="text-subtle block text-[10px]">{i.stats}</span>
                </span>
                <button
                  type="button"
                  onClick={() => set({ order: [...s.order, i.id] })}
                  className="border-line-strong shrink-0 rounded-full border px-2.5 py-0.5 text-[11px]"
                >
                  Fix next
                </button>
              </div>
            ))}
            {s.order.length > 0 && (
              <button
                type="button"
                onClick={() => set({ order: [] })}
                className="text-muted self-start"
              >
                Start again
              </button>
            )}
          </div>
          <div className="border-line bg-surface rounded-lg border px-3 py-2">
            <p className="font-semibold">What should each crash report carry?</p>
            <div className="mt-1 grid gap-1">
              {ATTACH.map((a) => {
                const on = s.attach.includes(a.id);
                return (
                  <label key={a.id} className="flex items-start gap-2">
                    <input
                      type="checkbox"
                      checked={on}
                      onChange={() =>
                        set({
                          attach: on ? s.attach.filter((x) => x !== a.id) : [...s.attach, a.id],
                        })
                      }
                      className="mt-0.5"
                    />
                    <span>
                      {a.label}
                      {on && (
                        <span className={cn("block text-[11px]", a.ok ? "text-good" : "text-bad")}>
                          {a.why}
                        </span>
                      )}
                    </span>
                  </label>
                );
              })}
            </div>
          </div>
        </div>
      }
    >
      <p>
        Version 2.5 is out to 5% of customers. Five issues are in the crash dashboard. Pick what to
        fix first, then next, and so on; when you&apos;ve ordered them all, compare with a suggested
        order.
      </p>
      <p>
        Then decide what extra information each crash report should carry. Crash data is personal
        data under privacy laws: collect what helps you fix things, nothing more.
      </p>
    </StepLayout>
  );
}

/* 3 ─ Health --------------------------------------------------------------------------------------- */

export function Health() {
  return (
    <StepLayout
      eyebrow="Explore"
      title="Measuring app health"
      stage={
        <div className="grid flex-1 content-center gap-1.5 sm:grid-cols-2">
          {[
            [
              "Crash-free users",
              "The share of users who had no crash. Track it per release and per device model, and watch it before widening a rollout.",
            ],
            [
              "Google Play vitals",
              "Bad behaviour above a 1.09% user-perceived crash rate or 0.47% “not responding” rate overall, or 8% on any one phone model, over 28 days.",
            ],
            [
              "Symbols",
              "Upload dSYMs (iOS) and mapping files (Android) for every release, or stack traces are unreadable.",
            ],
            [
              "Reports arrive late",
              "A crashed app sends its report on the next launch; people who never reopen it may never report.",
            ],
            [
              "Tools",
              "Firebase Crashlytics, Sentry and others; Xcode Organizer and MetricKit (a new Swift API in iOS 27); Play Console vitals.",
            ],
            [
              "Freezes count too",
              "Android's “app not responding” and Apple's hangs frustrate people as much as crashes.",
            ],
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
        Exceeding Play&apos;s thresholds can reduce the app&apos;s visibility and add a warning to
        its listing. Crash reporting connects directly to the staged rollouts of the last module.
      </p>
      <p>The Observability track goes deeper into metrics, logs and traces on the server side.</p>
    </StepLayout>
  );
}

/* 4 ─ Ratings -------------------------------------------------------------------------------------- */

export function Ratings() {
  return (
    <StepLayout
      eyebrow="Explore"
      title="Ratings and respectful analytics"
      stage={
        <div className="flex flex-1 flex-col justify-center gap-1.5">
          {[
            [
              "Apple's rating prompt",
              "Shown at most three times a year per device; the system may decide not to show it. (The old SKStoreReviewController API is deprecated; use requestReview.)",
            ],
            [
              "Google's in-app review",
              "A hidden quota limits how often it appears, and the app never learns whether someone reviewed.",
            ],
            [
              "Don't game it",
              "Never trigger it from a button, and never ask “Would you give us 5 stars?” first.",
            ],
            [
              "Analytics without tracking",
              "Measuring use of your own app needs no tracking prompt. Linking it with other companies' data for ads does, and fingerprinting is banned.",
            ],
            [
              "Declare it",
              "Analytics and crash SDKs belong in the privacy labels and Data safety form.",
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
        Ratings shape whether people install the app, and reviews are a direct line to users. Reply
        to reviews; people notice.
      </p>
      <p>Measure what you&apos;ll act on: a few well-chosen events beat thousands nobody reads.</p>
    </StepLayout>
  );
}

/* 5 ─ Checkpoint ----------------------------------------------------------------------------------- */

export function CrashCheck() {
  return (
    <StepLayout
      eyebrow="Checkpoint"
      title="When to ask for a rating"
      stage={
        <div className="flex flex-1 flex-col justify-center">
          <ChoiceCheckpoint
            id="mobile-rating"
            prompt="When is the best moment for the café app to request a rating?"
            options={[
              {
                id: "after",
                label: "After an order has been delivered and the customer comes back to the app",
                correct: true,
                feedback: "Right. A natural pause after a success.",
              },
              {
                id: "launch",
                label: "The first time the app opens",
                feedback: "They haven't experienced anything yet.",
              },
              {
                id: "checkout",
                label: "In the middle of checkout",
                feedback: "It interrupts the most important task.",
              },
              {
                id: "button",
                label: "Whenever they tap a “Rate us” button",
                feedback:
                  "The system may show nothing; use a link to the store's review page for a button.",
              },
            ]}
            explanation="Ask at a natural pause after something went well. Prompts are rationed, so don't waste them, and never attach them to a button."
          />
        </div>
      }
    >
      <p>Pick the best moment.</p>
    </StepLayout>
  );
}

/* 6 ─ Wrap ----------------------------------------------------------------------------------------- */

export function Wrap() {
  return (
    <WrapStep
      points={[
        ["Triage by impact", "How bad, how many, how new."],
        ["Symbols first", "Unreadable crashes can't be fixed."],
        ["Watch the vitals", "Crash and not-responding thresholds."],
        ["Collect only what helps", "No personal data in reports."],
        ["Ask for ratings kindly", "After success, never from a button."],
      ]}
    >
      <p>Next: the capstone, shipping the café app from start to finish.</p>
    </WrapStep>
  );
}
