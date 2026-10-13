"use client";

import { motion } from "motion/react";
import { useSceneState } from "@/lib/module-sdk";
import { StepLayout } from "@/toolkit/layout/step-layout";
import { WrapStep } from "@/toolkit/layout/wrap-step";
import { SortCheckpoint } from "@/toolkit/checkpoints/sort";
import { Segmented } from "@/toolkit/controls/segmented";
import { Term } from "@/toolkit/glossary/term";
import { cn } from "@/lib/cn";
import { cumulative, dayState, type Mode, type Plan } from "./model";
import type { RelState } from "./state";

/* 1 ─ Story ---------------------------------------------------------------------------------------- */

export function Recall() {
  return (
    <StepLayout
      eyebrow="Story"
      title="Printed menus"
      stage={
        <div className="grid flex-1 content-center gap-3 sm:grid-cols-2">
          <motion.div
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            className="border-line bg-surface rounded-xl border p-3 text-xs"
          >
            <p className="font-semibold">The board on the wall</p>
            <p className="text-muted">
              Wipe it and rewrite it: every customer sees the change at once. That&apos;s a website.
            </p>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15 }}
            className="border-accent bg-accent-soft rounded-xl border p-3 text-xs"
          >
            <p className="font-semibold">Take-away menus in drawers</p>
            <p className="text-muted">
              Thousands of old copies sit in people&apos;s homes for years. That&apos;s an app.
            </p>
          </motion.div>
        </div>
      }
    >
      <p>
        A café can change the board on its wall in a minute, but the take-away menus already in
        people&apos;s drawers stay as printed, typos and old prices included.
      </p>
      <p>
        Apps are like those printed menus. Each update goes through review and then reaches people
        gradually; some never update. So releases go out in a{" "}
        <Term id="staged-rollout">staged rollout</Term>, and risky features hide behind a{" "}
        <Term id="feature-flag">feature flag</Term> that can switch them off remotely.
      </p>
    </StepLayout>
  );
}

/* 2 ─ Simulation ⭐ -------------------------------------------------------------------------------- */

export function Rollout() {
  const [s, set] = useSceneState<RelState>();
  const plan: Plan = {
    mode: s.mode as Mode,
    haltDay: s.haltDay,
    flagDay: s.flagDay,
    fixDay: s.fixDay,
  };
  const now = dayState(plan, s.day);
  const days = [1, 2, 3, 4, 5, 6, 7].map((d) => ({ d, ...dayState(plan, d) }));
  const reset = { day: 0, haltDay: null, flagDay: null, fixDay: null };
  const btn = "rounded-full border px-2.5 py-0.5 text-[11px] disabled:opacity-40";
  return (
    <StepLayout
      eyebrow="Simulation"
      title="A bad release, day by day"
      stage={
        <div className="flex flex-1 flex-col justify-center gap-3 text-xs">
          <Segmented<Mode>
            size="sm"
            value={plan.mode}
            onChange={(v) => set({ mode: v, ...reset })}
            options={[
              ["all", "Everyone at once"],
              ["phased", "Phased over 7 days"],
            ]}
          />
          <div className="border-line bg-surface rounded-lg border px-3 py-2">
            <div className="flex h-24 items-end gap-1.5">
              {days.map((x) => (
                <div
                  key={x.d}
                  className={cn(
                    "flex h-full flex-1 flex-col justify-end",
                    x.d > s.day && "opacity-25",
                  )}
                >
                  <motion.div
                    animate={{ height: `${x.on24}%` }}
                    className="bg-viz-data/40 relative rounded-t-sm"
                  >
                    <motion.div
                      animate={{ height: x.on24 ? `${(x.crashing / x.on24) * 100}%` : 0 }}
                      className="bg-bad absolute inset-x-0 bottom-0 rounded-t-sm"
                    />
                  </motion.div>
                  <span className="text-subtle mt-0.5 text-center text-[9px]">Day {x.d}</span>
                </div>
              ))}
            </div>
            <p className="text-subtle mt-1 text-[10px]">
              Blue: customers on the new version (2.4, later 2.4.1). Red: customers hitting the
              crash.
            </p>
          </div>
          <p className="border-line bg-surface-2 rounded-lg border px-3 py-2">
            {s.day === 0
              ? "Version 2.4 has passed review. Release it and play the days forward."
              : `Day ${s.day}: ${now.on24}% of customers on the new version, ${now.crashing}% hitting the crash today. Total so far: ${cumulative(plan, s.day)} customer-days of crashes.`}
            {s.day >= 1 &&
              plan.flagDay === null &&
              plan.fixDay === null &&
              " Crash reports are coming in from group orders."}
            {now.flagged &&
              " Group ordering is switched off remotely: no more crashes, but no group orders either."}
            {plan.fixDay !== null &&
              (now.fixLive !== null && s.day >= now.fixLive
                ? " Version 2.4.1 is live and customers are updating."
                : ` Version 2.4.1 is in review; expected on day ${plan.fixDay + 2}.`)}
          </p>
          <div className="flex flex-wrap gap-1.5">
            <button
              type="button"
              disabled={s.day >= 7}
              onClick={() => set({ day: s.day + 1 })}
              className={cn(btn, "bg-accent text-accent-fg border-accent")}
            >
              {s.day === 0 ? "Release 2.4" : "Next day"}
            </button>
            <button
              type="button"
              disabled={s.day === 0 || s.haltDay !== null}
              onClick={() => set({ haltDay: s.day })}
              className={cn(btn, "border-line-strong")}
            >
              Halt the rollout
            </button>
            <button
              type="button"
              disabled={s.day === 0 || s.flagDay !== null}
              onClick={() => set({ flagDay: s.day })}
              className={cn(btn, "border-line-strong")}
            >
              Turn off group ordering (flag)
            </button>
            <button
              type="button"
              disabled={s.day === 0 || s.fixDay !== null}
              onClick={() => set({ fixDay: s.day })}
              className={cn(btn, "border-line-strong")}
            >
              Submit fix 2.4.1
            </button>
            <button type="button" onClick={() => set(reset)} className="text-muted px-2">
              Start again
            </button>
          </div>
          <p className="text-subtle text-[10px]">
            Illustrative shares. Halting stops new updates; people who already have 2.4 keep it.
          </p>
        </div>
      }
    >
      <p>
        Version 2.4 crashes when customers start a group order, which nobody caught in testing.
        Release it, step through the week, and respond however you like.
      </p>
      <p>
        Try everyone-at-once and phased, and compare halting, the flag and the fix. Which one helps
        people who already have 2.4?
      </p>
    </StepLayout>
  );
}

/* 3 ─ Stages --------------------------------------------------------------------------------------- */

export function Stages() {
  return (
    <StepLayout
      eyebrow="Explore"
      title="How each store rolls out"
      stage={
        <div className="grid flex-1 content-center gap-2 sm:grid-cols-2">
          <div className="border-line bg-surface rounded-lg border px-3 py-2 text-xs">
            <p className="font-semibold">App Store: phased release</p>
            <ul className="text-muted mt-1 list-disc space-y-1 pl-4">
              <li>A fixed 7 days: 1%, 2%, 5%, 10%, 20%, 50%, 100%.</li>
              <li>Only for people with automatic updates; anyone can update by hand.</li>
              <li>Pause for up to 30 days in total, or release to all at once.</li>
            </ul>
          </div>
          <div className="border-line bg-surface rounded-lg border px-3 py-2 text-xs">
            <p className="font-semibold">Google Play: staged rollout</p>
            <ul className="text-muted mt-1 list-disc space-y-1 pl-4">
              <li>You choose the percentage, and raise it yourself.</li>
              <li>Halting stops new installs of the version; there&apos;s no rollback.</li>
              <li>
                Since 2025, halting a 100% release brings back the previous one for new users.
              </li>
            </ul>
          </div>
          <div className="border-line bg-surface rounded-lg border px-3 py-2 text-xs sm:col-span-2">
            <p className="font-semibold">Neither store can un-ship a version</p>
            <p className="text-muted">
              Recovery is always: stop the spread, switch off the feature, ship a higher version.
              Android&apos;s in-app updates API can prompt people to update, gently or by blocking
              the app until they do.
            </p>
          </div>
        </div>
      }
    >
      <p>
        Watch crash rates in the first days of a rollout (next module), and keep going only when
        they look healthy.
      </p>
      <p>
        Phased releases lower risk, but don&apos;t isolate it: people who update by hand get the new
        version at once.
      </p>
    </StepLayout>
  );
}

/* 4 ─ Old versions --------------------------------------------------------------------------------- */

export function OldVersions() {
  const [s, set] = useSceneState<RelState>();
  return (
    <StepLayout
      eyebrow="Explore"
      title="Old versions and remote switches"
      stage={
        <div className="flex flex-1 flex-col justify-center gap-2 text-xs">
          <div className="border-line bg-surface rounded-lg border px-3 py-2">
            <p className="font-semibold">8% of customers still run version 2.1 from last year</p>
            <div className="mt-1 grid gap-1">
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={s.retire}
                  onChange={() => set({ retire: !s.retire })}
                />
                Switch off the old ordering API on the server
              </label>
              <label className="flex items-center gap-2">
                <input type="checkbox" checked={s.gate} onChange={() => set({ gate: !s.gate })} />
                Version 2.1 already checks a minimum version and can show “Please update”
              </label>
            </div>
            <p
              className={cn(
                "mt-1.5 rounded-md border px-2 py-1",
                !s.retire
                  ? "border-line bg-surface-2"
                  : s.gate
                    ? "border-good/50 bg-good/10"
                    : "border-bad/40 bg-bad/5",
              )}
            >
              {!s.retire
                ? "Old and new apps both work. The server keeps supporting the old API."
                : s.gate
                  ? "Version 2.1 users see a clear update screen and a link to the store."
                  : "Version 2.1 users tap Order and get a cryptic error. They can't know they need to update."}
            </p>
          </div>
          {[
            [
              "Over-the-air updates",
              "React Native and Expo apps can update their JavaScript and images without the store (EAS Update). Native code still needs a release.",
            ],
            [
              "Apple's rule",
              "Downloaded code may fix and adjust, but not add features or change what the app is for. Microsoft's hosted CodePush service closed in March 2025.",
            ],
            [
              "Remote config",
              "Feature flags and settings fetched at runtime (for example Firebase Remote Config). Anyone can read them: never put secrets there.",
            ],
          ].map(([t, b]) => (
            <div key={t} className="border-line bg-surface rounded-lg border px-3 py-2">
              <span className="font-semibold">{t}</span>
              <span className="text-muted"> · {b}</span>
            </div>
          ))}
        </div>
      }
    >
      <p>
        Many app versions run at once, for years. Servers must keep old APIs working, or old apps
        must already know how to ask people to update. Build the minimum-version check in from
        version 1.
      </p>
      <p>Try switching off the old API with and without that check.</p>
    </StepLayout>
  );
}

/* 5 ─ Checkpoint ----------------------------------------------------------------------------------- */

export function RelCheck() {
  return (
    <StepLayout
      eyebrow="Checkpoint"
      title="Does it need a release?"
      stage={
        <div className="flex flex-1 flex-col justify-center">
          <SortCheckpoint
            id="mobile-release"
            prompt="Can each change reach users without a new store release?"
            categories={[
              { id: "no", label: "No new release needed" },
              { id: "yes", label: "Needs a store release" },
            ]}
            items={[
              {
                id: "flag",
                label: "Switch off group ordering with its feature flag",
                category: "no",
                why: "Flags are fetched at runtime.",
              },
              {
                id: "native",
                label: "Fix a crash in the app's native Swift or Kotlin code",
                category: "yes",
                why: "Native code ships in the binary.",
              },
              {
                id: "banner",
                label: "Change the offer banner's text from remote config",
                category: "no",
                why: "It's data, not code.",
              },
              {
                id: "pay",
                label: "Add a brand-new payment screen",
                category: "yes",
                why: "New features need review.",
              },
              {
                id: "typo",
                label: "Fix a typo in a React Native app's JavaScript via an over-the-air update",
                category: "no",
                why: "Small JS fixes are allowed.",
              },
            ]}
            explanation="Flags, remote config and small JavaScript fixes can change a shipped app. Native code and new features need a store release and review."
          />
        </div>
      }
    >
      <p>Sort each change.</p>
    </StepLayout>
  );
}

/* 6 ─ Wrap ----------------------------------------------------------------------------------------- */

export function Wrap() {
  return (
    <WrapStep
      points={[
        ["Roll out in stages", "Phased on iOS, staged on Play."],
        ["Halting isn't undoing", "Ship a higher version to fix."],
        ["Flags act instantly", "For everyone, including old installs."],
        ["Old versions live on", "Keep APIs compatible; build an update check in."],
        ["OTA has limits", "Fixes yes, new features no."],
      ]}
    >
      <p>Next: keeping the app and its users safe.</p>
    </WrapStep>
  );
}
