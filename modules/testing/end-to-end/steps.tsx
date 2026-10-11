"use client";

import { motion } from "motion/react";
import { Play } from "lucide-react";
import { useSceneState } from "@/lib/module-sdk";
import { StepLayout } from "@/toolkit/layout/step-layout";
import { WrapStep } from "@/toolkit/layout/wrap-step";
import { SortCheckpoint } from "@/toolkit/checkpoints/sort";
import { Term } from "@/toolkit/glossary/term";
import { cn } from "@/lib/cn";
import { STEPS, WAITS, simulate, type Wait } from "./model";
import type { E2eState } from "./state";

/* 1 ─ Story ---------------------------------------------------------------------------------------- */

export function Shopper() {
  return (
    <StepLayout
      eyebrow="Story"
      title="The mystery shopper"
      stage={
        <div className="flex flex-1 items-center justify-center">
          <div className="flex flex-wrap items-center justify-center gap-1.5">
            {STEPS.map((s, i) => (
              <motion.span
                key={s}
                initial={{ opacity: 0, y: 4 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.12 * i }}
                className="border-line bg-surface rounded-full border px-3 py-1 text-xs"
              >
                {s}
              </motion.span>
            ))}
          </div>
        </div>
      }
    >
      <p>
        A shop can check every shelf and till separately, but only a mystery shopper finds out
        whether a real customer can walk in, find what they want and pay. They&apos;re thorough, but
        slow and expensive, so they visit rarely.
      </p>
      <p>
        An <Term id="end-to-end-test">end-to-end test</Term> is that shopper: it drives a real
        browser through the real app, from menu to confirmation. It catches what nothing else can,
        and it&apos;s also the easiest kind of test to make <Term id="flaky-test">flaky</Term>.
      </p>
    </StepLayout>
  );
}

/* 2 ─ Waits ⭐ ------------------------------------------------------------------------------------- */

export function Waits() {
  const [s, set] = useSceneState<E2eState>();
  const runs = simulate(s.wait, s.fresh);
  const passed = runs.filter((r) => r.ok).length;
  const avg = runs.reduce((t, r) => t + r.ms, 0) / runs.length / 1000;
  const firstFail = runs.find((r) => !r.ok);
  return (
    <StepLayout
      eyebrow="Simulation"
      title="Fix a flaky checkout test"
      stage={
        <div className="flex flex-1 flex-col justify-center gap-3">
          <div className="grid gap-1">
            {WAITS.map((w) => (
              <button
                key={w.id}
                type="button"
                aria-pressed={s.wait === w.id}
                onClick={() => set({ wait: w.id as Wait, ran: false })}
                className={cn(
                  "rounded-lg border px-3 py-1.5 text-left text-xs",
                  s.wait === w.id ? "border-accent bg-accent-soft" : "border-line bg-surface",
                )}
              >
                {w.label}
                <code className="text-muted block font-mono text-[10px]">{w.code}</code>
              </button>
            ))}
          </div>
          <label className="flex items-center gap-1.5 text-xs">
            <input
              type="checkbox"
              checked={s.fresh}
              onChange={(e) => set({ fresh: e.target.checked, ran: false })}
              className="accent-accent"
            />
            Create a fresh test account for each run (instead of one shared account)
          </label>
          <button
            type="button"
            onClick={() => set({ ran: true })}
            className="bg-accent text-accent-fg flex w-fit items-center gap-1.5 rounded-full px-4 py-1 text-xs font-medium"
          >
            <Play className="size-3" /> Run it 20 times
          </button>
          {s.ran && (
            <motion.div
              key={`${s.wait}-${s.fresh}`}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="grid gap-2"
            >
              <div className="flex flex-wrap gap-1">
                {runs.map((r, i) => (
                  <motion.span
                    key={i}
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: 0.03 * i }}
                    title={r.reason}
                    className={cn("size-4 rounded", r.ok ? "bg-good" : "bg-bad")}
                  />
                ))}
              </div>
              <div className="grid grid-cols-2 gap-2 text-xs">
                <div className="border-line bg-surface rounded-lg border px-3 py-2">
                  <p className="text-muted text-[10px]">Passed (nothing was broken)</p>
                  <p className={cn("font-mono text-base", passed < 20 && "text-bad")}>
                    {passed} / 20
                  </p>
                </div>
                <div className="border-line bg-surface rounded-lg border px-3 py-2">
                  <p className="text-muted text-[10px]">Average time per run</p>
                  <p className="font-mono text-base">{avg.toFixed(1)} s</p>
                </div>
              </div>
              {firstFail && (
                <p className="text-bad font-mono text-[10.5px]">
                  First failure: {firstFail.reason}
                </p>
              )}
            </motion.div>
          )}
          <p className="text-subtle text-[10px]">
            Network delays and clash rates are illustrative.
          </p>
        </div>
      }
    >
      <p>
        The app works perfectly in every run. Only the test changes. Try each waiting strategy, run
        it 20 times, and look at how many runs fail and how long they take.
      </p>
      <p>
        Fixed sleeps are either too short (random failures) or too long (slow). Waiting for what the
        user would see is both reliable and fast. Then a second, rarer failure appears: two runs
        sharing one test account. Isolated data fixes that.
      </p>
    </StepLayout>
  );
}

/* 3 ─ Which journeys ------------------------------------------------------------------------------- */

export function Journeys() {
  return (
    <StepLayout
      eyebrow="Explore"
      title="Which journeys deserve one?"
      stage={
        <div className="grid flex-1 content-center gap-2 sm:grid-cols-2">
          <div className="border-good/40 bg-good/10 rounded-lg border px-3 py-2 text-xs">
            <p className="font-semibold">Worth an end-to-end test</p>
            <ul className="text-muted mt-1 grid gap-0.5">
              <li>· Sign up and log in</li>
              <li>· Search, add to basket, pay</li>
              <li>· Reset a forgotten password</li>
              <li>· The one feature the business lives on</li>
            </ul>
          </div>
          <div className="border-line bg-surface rounded-lg border px-3 py-2 text-xs">
            <p className="font-semibold">Better tested lower down</p>
            <ul className="text-muted mt-1 grid gap-0.5">
              <li>· Every validation message on a form</li>
              <li>· Each way to sort a list</li>
              <li>· Price and tax rules</li>
              <li>· How each API error is displayed</li>
            </ul>
          </div>
        </div>
      }
    >
      <p>
        Keep end-to-end tests for the handful of journeys where a failure would really hurt, and
        test the details with unit, component and integration tests.
      </p>
      <p>
        Habits that keep them reliable: wait for visible results, give each test its own data, log
        in through a shortcut rather than the login form every time, and stub third-party services
        you don&apos;t control.
      </p>
    </StepLayout>
  );
}

/* 4 ─ Tools ---------------------------------------------------------------------------------------- */

export function Tools() {
  return (
    <StepLayout
      eyebrow="Explore"
      title="Browser automation tools"
      stage={
        <div className="flex flex-1 flex-col justify-center gap-2">
          {[
            [
              "Playwright",
              "Microsoft, 2020. Chromium, Firefox and WebKit; built-in auto-waiting, recording, and a trace viewer for failed CI runs.",
            ],
            [
              "Cypress",
              "Open-sourced in 2017. Runs inside the browser alongside your app, with a strong interactive runner.",
            ],
            [
              "Selenium",
              "The veteran. Its WebDriver protocol became a W3C standard in 2018; drives every major browser, often across a grid.",
            ],
            [
              "Mobile",
              "Appium across platforms; Espresso (Android) and XCUITest (iOS) natively; Maestro and Detox for React Native.",
            ],
          ].map(([t, b], i) => (
            <motion.div
              key={t}
              initial={{ opacity: 0, y: 4 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.07 * i }}
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
        By 2024 Playwright had caught up with Cypress in developer surveys and overtaken it in
        downloads; by 2026 it is the more widely used of the two. All three are free and open
        source.
      </p>
      <p>
        Newer tools add AI helpers that draft or repair tests from a description. They speed up
        writing, but someone still has to decide which journeys matter and check what the test
        asserts.
      </p>
    </StepLayout>
  );
}

/* 5 ─ Checkpoint ----------------------------------------------------------------------------------- */

export function E2eCheck() {
  return (
    <StepLayout
      eyebrow="Checkpoint"
      title="End-to-end or lower down?"
      stage={
        <div className="flex flex-1 flex-col justify-center">
          <SortCheckpoint
            id="testing-e2e"
            prompt="Where should each check live?"
            categories={[
              { id: "e2e", label: "End-to-end" },
              { id: "lower", label: "Lower level" },
            ]}
            items={[
              {
                id: "pay",
                label: "A customer can order and pay",
                category: "e2e",
                why: "The journey the business lives on.",
              },
              {
                id: "msg",
                label: "“Email is invalid” shows for a missing @",
                category: "lower",
                why: "A component test checks this in milliseconds.",
              },
              {
                id: "reset",
                label: "Password reset email arrives and works",
                category: "e2e",
                why: "Crosses many systems; critical when broken.",
              },
              {
                id: "sort",
                label: "Sorting the menu by price",
                category: "lower",
                why: "Logic or component level.",
              },
              {
                id: "gst",
                label: "GST on a ₹1,000 order",
                category: "lower",
                why: "Pure logic: a unit test.",
              },
            ]}
            explanation="End-to-end tests are expensive and fragile, so keep them for the few critical journeys. Test details lower down."
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
        ["A real user's path", "Real browser, real app, start to finish."],
        ["Few and critical", "Journeys that would really hurt."],
        ["Never fixed sleeps", "Wait for what the user would see."],
        ["Own data per test", "Shared accounts cause random failures."],
        ["Details lower down", "Unit, component and integration tests."],
      ]}
    >
      <p>
        That&apos;s the chapter on tests beyond units. Next: how do you know your tests are any
        good?
      </p>
    </WrapStep>
  );
}
