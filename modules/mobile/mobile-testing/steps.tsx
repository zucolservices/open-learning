"use client";

import { motion } from "motion/react";
import { Check, X } from "lucide-react";
import { useSceneState } from "@/lib/module-sdk";
import { StepLayout } from "@/toolkit/layout/step-layout";
import { WrapStep } from "@/toolkit/layout/wrap-step";
import { SortCheckpoint } from "@/toolkit/checkpoints/sort";
import { Term } from "@/toolkit/glossary/term";
import { cn } from "@/lib/cn";
import { BUDGET, DEVICES, coverage } from "./model";
import type { TestState } from "./state";

/* 1 ─ Story ---------------------------------------------------------------------------------------- */

export function Tasting() {
  return (
    <StepLayout
      eyebrow="Story"
      title="The test kitchen"
      stage={
        <div className="flex flex-1 flex-col justify-center gap-2">
          {[
            ["Taste every sauce", "Quick, constant checks while cooking."],
            ["Plate a full dish", "Does it all come together?"],
            ["Serve a few real guests", "In the real dining room, with the real ovens."],
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
        A new menu is tested in layers: lots of quick tastes, some full plates, and a few real
        services. You can&apos;t serve every possible guest, so you pick ones who represent the
        rest.
      </p>
      <p>
        Mobile testing works the same way, with an extra twist: thousands of phone models and OS
        versions. You test on a well-chosen handful of real devices and on{" "}
        <Term id="emulator">emulators and simulators</Term>, often through a{" "}
        <Term id="device-farm">device farm</Term>.
      </p>
    </StepLayout>
  );
}

/* 2 ─ Build and connect ⭐ ------------------------------------------------------------------------- */

export function Lab() {
  const [s, set] = useSceneState<TestState>();
  const c = coverage(s.picked);
  const full = s.picked.length >= BUDGET;
  const toggle = (id: string) =>
    set({
      picked: s.picked.includes(id)
        ? s.picked.filter((x) => x !== id)
        : full
          ? s.picked
          : [...s.picked, id],
    });
  return (
    <StepLayout
      eyebrow="Build and connect"
      title="Build a device lab"
      stage={
        <div className="flex flex-1 flex-col justify-center gap-3 text-xs">
          <div className="grid gap-1 sm:grid-cols-2">
            {DEVICES.map((d) => {
              const on = s.picked.includes(d.id);
              return (
                <button
                  key={d.id}
                  type="button"
                  aria-pressed={on}
                  disabled={!on && full}
                  onClick={() => toggle(d.id)}
                  className={cn(
                    "rounded-lg border px-2.5 py-1.5 text-left disabled:opacity-40",
                    on
                      ? "border-accent bg-accent-soft"
                      : "border-line bg-surface hover:border-accent",
                  )}
                >
                  <span className="font-semibold">{d.label}</span>
                  <span className="text-muted block text-[10px]">{d.os}</span>
                </button>
              );
            })}
          </div>
          <p className="text-muted">
            {s.picked.length} of {BUDGET} devices chosen.{full ? " Remove one to swap it." : ""}
          </p>
          <div className="border-line bg-surface grid gap-1 rounded-lg border px-3 py-2">
            {c.checks.map(([t, ok]) => (
              <p key={t} className="flex items-center gap-1.5">
                {ok ? (
                  <Check className="text-good size-3.5" />
                ) : (
                  <X className="text-bad size-3.5" />
                )}
                {t}
              </p>
            ))}
            <p className="text-muted mt-1">
              Android versions on your devices cover about {c.share}% of Android users (December
              2025 figures).
            </p>
          </div>
        </div>
      }
    >
      <p>
        The café&apos;s team can afford five real devices. Pick them to cover the risks: oldest and
        newest systems, small memory, and large screens on both platforms.
      </p>
      <p>
        Everything else runs on emulators and simulators in CI, and on a cloud device farm before
        each release.
      </p>
    </StepLayout>
  );
}

/* 3 ─ Layers --------------------------------------------------------------------------------------- */

export function Layers() {
  const rows: [string, string, string, string][] = [
    [
      "Unit tests",
      "Thousands, milliseconds each",
      "Swift Testing or XCTest · JUnit, Robolectric",
      "w-full",
    ],
    [
      "UI tests",
      "Hundreds, seconds each",
      "XCUITest · Espresso, Compose UI tests · snapshot tests",
      "w-2/3",
    ],
    ["End-to-end on devices", "A handful, minutes each", "Maestro, Appium 3, Detox", "w-1/3"],
  ];
  return (
    <StepLayout
      eyebrow="Explore"
      title="Layers of tests"
      stage={
        <div className="flex flex-1 flex-col-reverse items-center justify-center gap-1.5">
          {rows.map(([t, n, tools, w], i) => (
            <motion.div
              key={t}
              initial={{ opacity: 0, scaleX: 0.8 }}
              animate={{ opacity: 1, scaleX: 1 }}
              transition={{ delay: 0.1 * i }}
              className={cn(
                "border-line bg-surface rounded-lg border px-3 py-2 text-center text-xs",
                w,
              )}
            >
              <p className="font-semibold">{t}</p>
              <p className="text-muted text-[10px]">{n}</p>
              <p className="text-subtle text-[10px]">{tools}</p>
            </motion.div>
          ))}
        </div>
      }
    >
      <p>
        The <Term id="test-pyramid">test pyramid</Term> from the Testing track applies on phones
        too. Unit tests check logic without a device; UI tests drive screens; end-to-end tests run
        whole journeys on real devices.
      </p>
      <p>
        Swift Testing (Xcode 16, 2024) is the default for new iOS test targets. Snapshot tests
        compare screens with saved images to catch visual changes.
      </p>
    </StepLayout>
  );
}

/* 4 ─ Devices -------------------------------------------------------------------------------------- */

export function Devices() {
  return (
    <StepLayout
      eyebrow="Explore"
      title="Simulators, emulators and farms"
      stage={
        <div className="grid flex-1 content-center gap-1.5 sm:grid-cols-2">
          {[
            [
              "iOS Simulator",
              "Runs the app on your Mac. Fast, but it isn't the phone's real hardware, so camera, performance and some sensors differ.",
            ],
            [
              "Android Emulator",
              "Emulates a whole phone, any version or screen size. Gradle can manage a set of them for CI.",
            ],
            [
              "Real devices",
              "The only place to trust performance, battery, camera, push notifications and vendor quirks.",
            ],
            [
              "Device farms",
              "Firebase Test Lab, AWS Device Farm, BrowserStack and others rent real devices in the cloud.",
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
        UI tests are prone to flakiness. Grey-box tools (Espresso, XCUITest, Detox) wait for the app
        to be idle; black-box tools (Appium, Maestro) drive it from outside and need careful waits.
      </p>
      <p>
        Android&apos;s spread is wide: in December 2025 no single version ran on more than about a
        fifth of devices.
      </p>
    </StepLayout>
  );
}

/* 5 ─ Checkpoint ----------------------------------------------------------------------------------- */

export function TestCheck() {
  return (
    <StepLayout
      eyebrow="Checkpoint"
      title="Which kind of test?"
      stage={
        <div className="flex flex-1 flex-col justify-center">
          <SortCheckpoint
            id="mobile-testing"
            prompt="Where is each check best done?"
            categories={[
              { id: "unit", label: "Unit test" },
              { id: "ui", label: "UI test" },
              { id: "device", label: "Real device" },
            ]}
            items={[
              {
                id: "total",
                label: "The order total adds 5% GST correctly",
                category: "unit",
                why: "Pure logic.",
              },
              {
                id: "button",
                label: "Tapping Add to order updates the basket badge",
                category: "ui",
                why: "A screen interaction.",
              },
              {
                id: "push",
                label: "The order-ready push arrives on a locked phone",
                category: "device",
                why: "Needs the real push service.",
              },
              {
                id: "sync",
                label: "Queued changes merge correctly after reconnecting",
                category: "unit",
                why: "Sync logic, testable without a screen.",
              },
              {
                id: "camera",
                label: "The QR scanner reads a code in dim light",
                category: "device",
                why: "Real camera, real light.",
              },
            ]}
            explanation="Logic belongs in fast unit tests; screen behaviour in UI tests; hardware, push and performance on real devices."
          />
        </div>
      }
    >
      <p>Sort each check.</p>
    </StepLayout>
  );
}

/* 6 ─ Wrap ----------------------------------------------------------------------------------------- */

export function Wrap() {
  return (
    <WrapStep
      points={[
        ["Mostly unit tests", "Fast, no device needed."],
        ["Some UI tests", "On emulators and simulators in CI."],
        ["A few real-device runs", "Hardware, push, performance."],
        ["Choose devices by risk", "Oldest, newest, low memory, large screens."],
        ["Rent the long tail", "Device farms before release."],
      ]}
    >
      <p>That ends the chapter on quality. Next: shipping to the stores.</p>
    </WrapStep>
  );
}
