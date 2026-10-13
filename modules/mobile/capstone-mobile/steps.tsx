"use client";

import { motion } from "motion/react";
import { useSceneState } from "@/lib/module-sdk";
import { StepLayout } from "@/toolkit/layout/step-layout";
import { WrapStep } from "@/toolkit/layout/wrap-step";
import { OrderCheckpoint } from "@/toolkit/checkpoints/order";
import { Term } from "@/toolkit/glossary/term";
import { cn } from "@/lib/cn";
import { BETA, DESIGN, LAUNCH, type Choice } from "./model";
import type { CapState } from "./state";

/* 1 ─ Story ---------------------------------------------------------------------------------------- */

export function Truck() {
  return (
    <StepLayout
      eyebrow="Story"
      title="The café goes mobile"
      stage={
        <div className="flex flex-1 flex-col justify-center gap-2">
          {[
            ["Design", "Decide how to build it and where data lives."],
            ["Beta", "Real testers on real phones find what the team missed."],
            ["Launch", "Store review, a careful rollout, and the first surprises."],
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
        A food truck is a café that goes where its customers are, works with whatever power and
        space it has, and can&apos;t send everyone home when something breaks.
      </p>
      <p>
        Tiffin Tales, a made-up chain of twelve cafés, wants an ordering app with exactly those
        qualities. You&apos;ll make its key decisions, fix what beta testing finds, and steer launch
        week, using everything from this track, from the{" "}
        <Term id="app-lifecycle">app lifecycle</Term> to{" "}
        <Term id="staged-rollout">staged rollouts</Term>.
      </p>
    </StepLayout>
  );
}

/* 2 ─ Design (branching) --------------------------------------------------------------------------- */

function Choices({
  items,
  picks,
  onPick,
}: {
  items: Choice[];
  picks: Record<string, string>;
  onPick(id: string, opt: string): void;
}) {
  return (
    <div className="flex flex-1 flex-col justify-center gap-2 text-xs">
      {items.map((c) => {
        const pick = c.options.find((o) => o.id === picks[c.id]);
        return (
          <div key={c.id} className="border-line bg-surface rounded-lg border px-3 py-2">
            <p className="font-semibold">{c.title}</p>
            <div className="mt-1 grid gap-1 sm:grid-cols-2">
              {c.options.map((o) => (
                <button
                  key={o.id}
                  type="button"
                  aria-pressed={pick?.id === o.id}
                  onClick={() => onPick(c.id, o.id)}
                  className={cn(
                    "rounded-md border px-2 py-1 text-left text-[11px]",
                    pick?.id === o.id
                      ? o.ok
                        ? "border-good bg-good/10"
                        : "border-bad bg-bad/5"
                      : "border-line hover:border-accent",
                  )}
                >
                  {o.label}
                </button>
              ))}
            </div>
            {pick && (
              <p className={cn("mt-1 text-[11px]", pick.ok ? "text-good" : "text-bad")}>
                {pick.outcome}
              </p>
            )}
          </div>
        );
      })}
    </div>
  );
}

export function Design() {
  const [s, set] = useSceneState<CapState>();
  return (
    <StepLayout
      eyebrow="Branching scenario"
      title="Design decisions"
      stage={
        <Choices
          items={DESIGN}
          picks={s.design}
          onPick={(id, o) => set({ design: { ...s.design, [id]: o } })}
        />
      }
    >
      <p>
        Five early decisions shape everything after. Choose for each, read the consequence, and
        change your mind as often as you like.
      </p>
      <p>Modules 2, 8, 10, 11 and 12 cover these in depth.</p>
    </StepLayout>
  );
}

/* 3 ─ Beta (fix the problem) ----------------------------------------------------------------------- */

export function Beta() {
  const [s, set] = useSceneState<CapState>();
  return (
    <StepLayout
      eyebrow="Fix the problem"
      title="Beta testing: six problems"
      stage={
        <div className="flex flex-1 flex-col justify-center gap-1.5 text-xs">
          {BETA.map((b) => {
            const on = s.fixed.includes(b.id);
            return (
              <div
                key={b.id}
                className={cn(
                  "rounded-lg border px-3 py-1.5",
                  on ? "border-good/50 bg-good/10" : "border-bad/40 bg-bad/5",
                )}
              >
                <p>{on ? b.fixed : b.problem}</p>
                <button
                  type="button"
                  aria-pressed={on}
                  onClick={() =>
                    set({ fixed: on ? s.fixed.filter((x) => x !== b.id) : [...s.fixed, b.id] })
                  }
                  className={cn(
                    "mt-1 rounded-full border px-2.5 py-0.5 text-[11px]",
                    on ? "border-good text-good" : "border-line-strong",
                  )}
                >
                  {on ? "Fixed · undo" : b.fix}
                </button>
              </div>
            );
          })}
          <p className="text-muted">
            {s.fixed.length} of {BETA.length} fixed.
          </p>
        </div>
      }
    >
      <p>
        A hundred testers used the beta through TestFlight and a Google Play testing track for two
        weeks. Here&apos;s what they found. Apply each fix.
      </p>
      <p>
        Each problem comes from a different chapter: lifecycle, touch, accessibility, adaptive
        layout, networking and battery.
      </p>
    </StepLayout>
  );
}

/* 4 ─ Launch (branching) --------------------------------------------------------------------------- */

export function Launch() {
  const [s, set] = useSceneState<CapState>();
  return (
    <StepLayout
      eyebrow="Branching scenario"
      title="Launch week"
      stage={
        <Choices
          items={LAUNCH}
          picks={s.launch}
          onPick={(id, o) => set({ launch: { ...s.launch, [id]: o } })}
        />
      }
    >
      <p>
        Four moments from launch week. Decide each one; the consequences draw on the chapter on
        shipping.
      </p>
      <p>
        No release goes perfectly. What matters is how small the damage stays and how fast you
        recover.
      </p>
    </StepLayout>
  );
}

/* 5 ─ Journey -------------------------------------------------------------------------------------- */

export function Journey() {
  const hops: [string, string][] = [
    ["Tap Add to order", "A thumb-sized, labelled button (touch, accessibility)"],
    ["Basket saved", "Into the local database and the screen's saved state (lifecycle, storage)"],
    ["No signal in the lift", "The order queues locally (offline first)"],
    ["Signal returns", "Synced with timeouts and safe retries (networking)"],
    ["Paid", "Server-side, with an idempotency key; no secrets in the app (security)"],
    ["Food ready", "A push notification and a Live Activity (background)"],
    ["Something breaks", "Crash report, flag switched off, staged rollout paused (shipping)"],
  ];
  return (
    <StepLayout
      eyebrow="Explore"
      title="One order, end to end"
      stage={
        <div className="flex flex-1 flex-col justify-center gap-1">
          {hops.map(([t, b], i) => (
            <motion.div
              key={t}
              initial={{ opacity: 0, x: -6 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.08 * i }}
              className="flex items-stretch gap-2 text-xs"
            >
              <span className="flex w-5 shrink-0 flex-col items-center">
                <span className="bg-accent text-accent-fg grid size-5 place-items-center rounded-full text-[10px]">
                  {i + 1}
                </span>
                {i < hops.length - 1 && <span className="bg-line-strong w-px flex-1" />}
              </span>
              <span className="border-line bg-surface mb-1 flex-1 rounded-lg border px-3 py-1.5">
                <span className="font-semibold">{t}</span>
                <span className="text-muted"> · {b}</span>
              </span>
            </motion.div>
          ))}
        </div>
      }
    >
      <p>
        Follow one masala dosa order through the app. Almost every module in the track touches it
        somewhere.
      </p>
      <p>
        None of these is exotic. Together they&apos;re the difference between an app people delete
        and one they reach for every morning.
      </p>
    </StepLayout>
  );
}

/* 6 ─ Checkpoint ----------------------------------------------------------------------------------- */

export function CapCheck() {
  return (
    <StepLayout
      eyebrow="Checkpoint"
      title="From code to customers"
      stage={
        <div className="flex flex-1 flex-col justify-center">
          <OrderCheckpoint
            id="mobile-capstone"
            prompt="Put the steps for shipping a new version in order."
            items={[
              { id: "ci", label: "Run unit and UI tests in CI" },
              { id: "beta", label: "Beta test with real users on real devices" },
              { id: "review", label: "Submit for store review" },
              { id: "staged", label: "Phased or staged rollout, watching crash-free users" },
              { id: "all", label: "Release to everyone" },
            ]}
            explanation="Automated tests catch regressions; beta testers catch what tests can't; review gates the store; a gradual rollout limits the damage of anything that slipped through."
          />
        </div>
      }
    >
      <p>Order the steps.</p>
    </StepLayout>
  );
}

/* 7 ─ Wrap ----------------------------------------------------------------------------------------- */

export function Wrap() {
  return (
    <WrapStep
      points={[
        ["Design for the pocket", "Interruptions, thumbs, every screen size."],
        ["Assume a bad network", "Local first, sync later."],
        ["Respect the phone", "Battery, memory, permissions."],
        ["Trust the server, not the app", "Secrets and decisions stay server-side."],
        ["Ship gradually, watch closely", "Flags, staged rollouts, crash reports."],
      ]}
    >
      <p>
        That completes the Mobile track. From here, the Frontend and Backend tracks cover the web
        app and the server that the café app talks to.
      </p>
    </WrapStep>
  );
}
