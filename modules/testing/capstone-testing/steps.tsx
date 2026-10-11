"use client";

import { motion } from "motion/react";
import { Check, Rocket, X } from "lucide-react";
import { useSceneState } from "@/lib/module-sdk";
import { StepLayout } from "@/toolkit/layout/step-layout";
import { WrapStep } from "@/toolkit/layout/wrap-step";
import { OrderCheckpoint } from "@/toolkit/checkpoints/order";
import { Term } from "@/toolkit/glossary/term";
import { cn } from "@/lib/cn";
import { AREAS, BUDGET, CHANGES, CHECKLIST, DEPTHS, TECHNIQUES, caught } from "./model";
import type { CapState } from "./state";

/* 1 ─ Story ---------------------------------------------------------------------------------------- */

export function NewJob() {
  return (
    <StepLayout
      eyebrow="Story"
      title="The service nobody dares to touch"
      stage={
        <div className="flex flex-1 flex-col justify-center gap-2">
          {[
            ["checkout-service", "8 years old, 14,000 lines, 0 tests"],
            ["Last outage", "A one-line change to discounts, three hours down"],
            ["Next release", "Friday: a GST change, a payment SDK upgrade, an allergens field"],
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
        You&apos;ve joined the team behind a made-up café chain&apos;s checkout. It works, mostly,
        but nobody wants to change it: the last &ldquo;small fix&rdquo; took the tills down at
        lunchtime.
      </p>
      <p>
        You have a week before Friday&apos;s release. You can&apos;t test everything, so you&apos;ll
        build a <Term id="test-strategy">test strategy</Term>: decide what matters most, choose the
        right kind of test for each part, and see whether it catches what&apos;s coming.
      </p>
    </StepLayout>
  );
}

/* 2 ─ Risk ⭐ -------------------------------------------------------------------------------------- */

export function Risk() {
  const [s, set] = useSceneState<CapState>();
  const spent = Object.values(s.depths).reduce((a, b) => a + b, 0);
  const setDepth = (id: string, d: number) => {
    const others = spent - (s.depths[id] ?? 0);
    if (others + d > BUDGET) return;
    set({ depths: { ...s.depths, [id]: d }, released: false });
  };
  return (
    <StepLayout
      eyebrow="Branching scenario"
      title="Spend a week's testing where the risk is"
      stage={
        <div className="flex flex-1 flex-col justify-center gap-3">
          <div className="grid gap-1">
            {AREAS.map((a) => {
              const risk = a.likelihood * a.impact;
              const d = s.depths[a.id] ?? 0;
              return (
                <div
                  key={a.id}
                  className="border-line bg-surface grid gap-1 rounded-lg border px-3 py-1.5 text-xs sm:grid-cols-[1fr_auto]"
                >
                  <div>
                    <p className="font-medium">{a.label}</p>
                    <p className="text-muted text-[10px]">
                      Likely to break: {["", "low", "medium", "high"][a.likelihood]} · Cost if it
                      does: {["", "low", "medium", "high"][a.impact]}
                      <span
                        className={cn(
                          "ml-1.5 rounded px-1",
                          risk >= 6 ? "bg-bad/20" : risk >= 4 ? "bg-surface-2" : "",
                        )}
                      >
                        risk {risk}
                      </span>
                    </p>
                  </div>
                  <div className="flex gap-0.5">
                    {DEPTHS.map((label, k) => (
                      <button
                        key={label}
                        type="button"
                        aria-pressed={d === k}
                        aria-label={`${a.label}: ${label}`}
                        onClick={() => setDepth(a.id, k)}
                        className={cn(
                          "rounded border px-1.5 py-0.5 text-[10px]",
                          d === k
                            ? "border-accent bg-accent text-accent-fg"
                            : "border-line text-muted",
                        )}
                      >
                        {label}
                      </button>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
          <div className="flex items-center gap-2 text-xs">
            <span>Effort used</span>
            <span className="flex gap-0.5">
              {Array.from({ length: BUDGET }, (_, k) => (
                <span
                  key={k}
                  className={cn("size-3 rounded-sm", k < spent ? "bg-accent" : "bg-surface-2")}
                />
              ))}
            </span>
            <span className="font-mono">
              {spent} / {BUDGET}
            </span>
          </div>
        </div>
      }
    >
      <p>
        You have ten units of effort for the week. Smoke costs 1, solid 2, deep 3. Spend them by{" "}
        <strong>risk</strong>: how likely each part is to break, times how much it costs when it
        does.
      </p>
      <p>
        You can&apos;t give everything &ldquo;deep&rdquo;. That&apos;s the point of a strategy:
        choosing what <em>not</em> to test heavily, on purpose.
      </p>
    </StepLayout>
  );
}

/* 3 ─ Techniques ----------------------------------------------------------------------------------- */

export function Techniques() {
  const [s, set] = useSceneState<CapState>();
  return (
    <StepLayout
      eyebrow="Branching scenario"
      title="Pick the right kind of test for each part"
      stage={
        <div className="flex flex-1 flex-col justify-center gap-3">
          {TECHNIQUES.map((t) => (
            <div key={t.area} className="grid gap-1">
              <p className="text-xs font-semibold">{t.question}</p>
              {t.options.map((o) => {
                const on = s.techs[t.area] === o.id;
                return (
                  <button
                    key={o.id}
                    type="button"
                    aria-pressed={on}
                    onClick={() => set({ techs: { ...s.techs, [t.area]: o.id }, released: false })}
                    className={cn(
                      "rounded-lg border px-3 py-1 text-left text-xs",
                      on
                        ? o.good
                          ? "border-good/60 bg-good/10"
                          : "border-bad/60 bg-bad/10"
                        : "border-line bg-surface",
                    )}
                  >
                    {o.label}
                    {on && <span className="text-muted block text-[10px]">{o.why}</span>}
                  </button>
                );
              })}
            </div>
          ))}
        </div>
      }
    >
      <p>
        Depth is only half the plan. For the three riskiest parts, choose the kind of test that fits
        where the bugs would actually live.
      </p>
      <p>
        One more thing before writing new tests: this code has none. Start with characterisation
        tests around anything you&apos;re about to change, so the refactoring itself is safe.
      </p>
    </StepLayout>
  );
}

/* 4 ─ Release day ---------------------------------------------------------------------------------- */

export function ReleaseDay() {
  const [s, set] = useSceneState<CapState>();
  return (
    <StepLayout
      eyebrow="Fix the problem"
      title="Friday: run your plan against the release"
      stage={
        <div className="flex flex-1 flex-col justify-center gap-3">
          <button
            type="button"
            onClick={() => set({ released: true })}
            className="bg-accent text-accent-fg flex w-fit items-center gap-1.5 rounded-full px-4 py-1 text-xs font-medium"
          >
            <Rocket className="size-3" /> Run the release through your tests
          </button>
          {s.released && (
            <div className="grid gap-1.5">
              {CHANGES.map((c, i) => {
                const ok = c.area === null || caught(c.area, s.depths, s.techs);
                return (
                  <motion.div
                    key={c.id}
                    initial={{ opacity: 0, y: 4 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.15 * i }}
                    className={cn(
                      "rounded-lg border px-3 py-2 text-xs",
                      c.bug === null
                        ? "border-line bg-surface"
                        : ok
                          ? "border-good/50 bg-good/10"
                          : "border-bad/50 bg-bad/10",
                    )}
                  >
                    <p className="flex items-center gap-1.5 font-medium">
                      {c.bug === null ? (
                        <Check className="text-muted size-3.5" />
                      ) : ok ? (
                        <Check className="text-good size-3.5" />
                      ) : (
                        <X className="text-bad size-3.5" />
                      )}
                      {c.label}
                    </p>
                    <p className="text-muted pl-5 text-[10px]">
                      {c.bug === null
                        ? "No bug here. Your plan rightly spent little on it."
                        : ok
                          ? "Caught by your tests before release. Fixed on Thursday."
                          : `Escaped: ${c.bug}`}
                    </p>
                  </motion.div>
                );
              })}
            </div>
          )}
          <p className="text-muted text-[10px]">
            To catch a change, an area needs at least “solid” depth and a fitting technique. Go back
            and adjust as often as you like.
          </p>
        </div>
      }
    >
      <p>
        Friday&apos;s release holds four changes. Three hide bugs. Run your plan and see which ones
        your tests catch, and which reach the tills.
      </p>
      <p>
        Whatever escaped, the fix is the same habit: write the test that would have caught it, then
        fix the code.
      </p>
    </StepLayout>
  );
}

/* 5 ─ Checklist ------------------------------------------------------------------------------------- */

export function Checklist() {
  return (
    <StepLayout
      eyebrow="Explore"
      title="The whole track as a checklist"
      stage={
        <div className="grid flex-1 content-center gap-2 sm:grid-cols-2">
          {CHECKLIST.map(([ch, items], i) => (
            <motion.div
              key={ch}
              initial={{ opacity: 0, y: 4 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.06 * i }}
              className="border-line bg-surface rounded-lg border px-3 py-2 text-xs"
            >
              <p className="text-accent font-semibold">{ch}</p>
              <ul className="mt-1 grid gap-0.5">
                {items.map((it) => (
                  <li key={it} className="flex items-start gap-1.5">
                    <Check className="text-good mt-0.5 size-3 shrink-0" />
                    {it}
                  </li>
                ))}
              </ul>
            </motion.div>
          ))}
        </div>
      }
    >
      <p>Here&apos;s the track on one page. Each line maps back to a chapter you can revisit.</p>
      <p>
        Research from DORA links test automation with better delivery, especially when developers
        own the tests. Google&apos;s engineers sum up the attitude as the &ldquo;Beyoncé
        Rule&rdquo;: if you liked it, you should have put a test on it.
      </p>
    </StepLayout>
  );
}

/* 6 ─ Checkpoint ----------------------------------------------------------------------------------- */

export function CapCheck() {
  return (
    <StepLayout
      eyebrow="Checkpoint"
      title="Plan your first week"
      stage={
        <div className="flex flex-1 flex-col justify-center">
          <OrderCheckpoint
            id="testing-capstone"
            prompt="Drag the first week on an untested service into a sensible order."
            items={[
              { id: "risk", label: "Map the risky areas with the team" },
              {
                id: "char",
                label: "Write characterisation tests around the riskiest code you'll change",
              },
              { id: "ci", label: "Run those tests in CI on every change" },
              { id: "unit", label: "Add unit tests for price and GST rules" },
              {
                id: "integ",
                label: "Add integration and contract tests for payment and the kitchen queue",
              },
              { id: "e2e", label: "Add one end-to-end test for order-and-pay" },
            ]}
            explanation="Decide where the risk is, put a safety net around what you'll touch, automate it, then build the right mix of tests from the bottom up."
          />
        </div>
      }
    >
      <p>Drag the steps into order.</p>
    </StepLayout>
  );
}

/* 7 ─ Wrap ----------------------------------------------------------------------------------------- */

export function Wrap() {
  return (
    <WrapStep
      points={[
        ["Test by risk", "Likelihood times impact decides depth."],
        ["Right test, right place", "Logic in units, joins in integration, journeys end to end."],
        ["Safety net first", "Characterise before you change."],
        ["Automate and run always", "Every change, in CI."],
        ["Every escape teaches", "Write the test that would have caught it."],
      ]}
    >
      <p>
        That&apos;s the Testing track. Next in Software development: Clean Code, writing code that
        other people can read and change.
      </p>
    </WrapStep>
  );
}
