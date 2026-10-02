"use client";

import { motion } from "motion/react";
import { Power } from "lucide-react";
import { useSceneState } from "@/lib/module-sdk";
import { StepLayout } from "@/toolkit/layout/step-layout";
import { SortCheckpoint } from "@/toolkit/checkpoints/sort";
import { Code } from "@/toolkit/controls/stepper";
import { Term } from "@/toolkit/glossary/term";
import { cn } from "@/lib/cn";
import { STEPS, USERS, buggy, enabled, paths } from "./model";
import type { FlagState } from "./state";

/* 1 ─ Roll it out, then switch it off ⭐ ---------------------------------------------------------- */

export function RollOut() {
  const [s, set] = useSceneState<FlagState>();
  const pct = s.killed ? 0 : s.pct;
  const flag = s.flag;
  const users = Array.from({ length: USERS }, (_, u) => ({
    u,
    on: enabled(flag, u, pct),
    bug: buggy(u),
  }));
  const on = users.filter((x) => x.on);
  const errors = on.filter((x) => x.bug).length;
  const log = s.log ?? [];
  const push = (line: string) => [...log, line].slice(-5);
  return (
    <StepLayout
      eyebrow="Simulation"
      title="Roll it out, then switch it off"
      stage={
        <div className="flex flex-1 flex-col justify-center gap-3">
          <div className="flex flex-wrap items-center gap-1.5">
            <span className="text-muted text-xs">new-checkout on for</span>
            {STEPS.map((p) => (
              <button
                key={p}
                type="button"
                onClick={() =>
                  set({ pct: p, killed: false, log: push(`rollout set to ${p}% (no deploy)`) })
                }
                className={cn(
                  "rounded-full border px-3 py-1 font-mono text-xs",
                  !s.killed && s.pct === p
                    ? "border-accent bg-accent-soft"
                    : "border-line hover:bg-surface-2",
                )}
              >
                {p}%
              </button>
            ))}
            <button
              type="button"
              onClick={() => set({ killed: true, log: push("kill switch: flag off for everyone") })}
              className={cn(
                "ml-auto flex items-center gap-1 rounded-full border px-3 py-1 text-xs",
                s.killed
                  ? "border-bad bg-bad/15 text-bad"
                  : "border-bad/50 text-bad hover:bg-bad/10",
              )}
            >
              <Power className="size-3" /> Kill switch
            </button>
          </div>
          <div
            className="mx-auto grid w-full max-w-lg grid-cols-20 gap-1"
            aria-label={`${on.length} of ${USERS} users see the new checkout`}
          >
            {users.map((x) => (
              <motion.div
                key={x.u}
                animate={{ scale: x.on ? 1 : 0.7 }}
                className={cn(
                  "aspect-square rounded-full",
                  x.on ? (x.bug ? "bg-bad" : "bg-accent") : "bg-viz-idle/40",
                )}
              />
            ))}
          </div>
          <div className="grid grid-cols-3 gap-2">
            <div className="border-line bg-surface rounded-lg border px-2 py-1.5">
              <p className="text-muted text-[10px]">See new checkout</p>
              <p className="font-mono text-sm font-semibold">
                {on.length} of {USERS}
              </p>
            </div>
            <div className="border-line bg-surface rounded-lg border px-2 py-1.5">
              <p className="text-muted text-[10px]">Hitting the bug</p>
              <p className={cn("font-mono text-sm font-semibold", errors > 2 && "text-bad")}>
                {errors}
              </p>
            </div>
            <div className="border-line bg-surface rounded-lg border px-2 py-1.5">
              <p className="text-muted text-[10px]">Deploys needed</p>
              <p className="font-mono text-sm font-semibold">0</p>
            </div>
          </div>
          <div className="flex items-center gap-2 text-xs">
            <label className="flex items-center gap-1.5">
              <input
                type="checkbox"
                checked={flag !== "new-checkout"}
                onChange={(e) => set({ flag: e.target.checked ? "new-search" : "new-checkout" })}
                className="accent-accent"
              />
              Show a different flag (new-search) at the same percentage
            </label>
          </div>
          <div className="bg-surface-2 min-h-16 rounded-lg px-3 py-2 font-mono text-[10px]">
            <p className="text-muted">09:00 v5.2 deployed with new-checkout off</p>
            {log.map((l, i) => (
              <p key={i}>{l}</p>
            ))}
          </div>
        </div>
      }
    >
      <p>
        The new checkout went out with this morning&apos;s deploy, switched off. A{" "}
        <Term id="feature-flag">feature flag</Term> decides, user by user, who sees it. Turn it on
        for 1%, then 10%, then 50%. Red dots are people whose phones hit a bug in the new code.
      </p>
      <p>
        Notice that raising the percentage keeps everyone who already had it, because each
        user&apos;s place is fixed by hashing the flag&apos;s name with their ID. Tick the box and a
        different flag picks a different set of people at the same percentage.
      </p>
      <p>
        When the bug shows up, hit the <Term id="kill-switch">kill switch</Term>. Flag tools stream
        the change to running apps, which check flags in memory, so it takes effect in seconds, with
        no build and no deploy.
      </p>
    </StepLayout>
  );
}

/* 2 ─ Four kinds of flag -------------------------------------------------------------------------- */

const KINDS = [
  {
    t: "Release toggles",
    life: "days to weeks",
    q: "allow incomplete and un-tested codepaths to be shipped to production as latent code which may never be turned on.",
  },
  {
    t: "Experiment toggles",
    life: "as long as the experiment",
    q: "are used to perform multivariate or A/B testing.",
  },
  {
    t: "Ops toggles",
    life: "short, or permanent kill switches",
    q: "These flags are used to control operational aspects of our system's behavior.",
  },
  {
    t: "Permissioning toggles",
    life: "long-lived",
    q: "These flags are used to change the features or product experience that certain users receive.",
  },
];

export function FourKinds() {
  return (
    <StepLayout
      eyebrow="Explore"
      title="Four kinds of flag"
      stage={
        <div className="grid flex-1 content-center gap-3 sm:grid-cols-2">
          {KINDS.map((k, i) => (
            <motion.div
              key={k.t}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 * i }}
              className="border-line bg-surface flex flex-col gap-1.5 rounded-xl border px-4 py-3"
            >
              <p className="font-semibold">{k.t}</p>
              <p className="text-muted text-sm">&ldquo;{k.q}&rdquo;</p>
              <p className="text-accent mt-auto font-mono text-[10px]">lives: {k.life}</p>
            </motion.div>
          ))}
        </div>
      }
    >
      <p>
        Pete Hodgson&apos;s article on feature toggles, hosted on Martin Fowler&apos;s site, sorts
        flags into four kinds by how long they live and how often they change.
      </p>
      <p>
        Release toggles are the CI/CD workhorse. Hodgson calls them the commonest way to separate
        &ldquo;[feature] release from [code] deployment&rdquo;, and says they &ldquo;should
        generally not stick around much longer than a week or two&rdquo;.
      </p>
      <p>
        A percentage rollout isn&apos;t automatically an experiment: a fair A/B test needs a fixed
        sample size decided in advance, not &ldquo;run it until it looks good&rdquo;.
      </p>
    </StepLayout>
  );
}

/* 3 ─ Flag debt ----------------------------------------------------------------------------------- */

export function FlagDebt() {
  const [s, set] = useSceneState<FlagState>();
  return (
    <StepLayout
      eyebrow="Explore"
      title="Flag debt"
      stage={
        <div className="flex flex-1 flex-col justify-center gap-3">
          <label className="grid grid-cols-[10rem_1fr_2rem] items-center gap-2 text-xs">
            <span>Old flags never removed</span>
            <input
              type="range"
              min={1}
              max={12}
              value={s.stale}
              onChange={(e) => set({ stale: Number(e.target.value) })}
              className="accent-accent"
              aria-label="Old flags never removed"
            />
            <span className="text-right font-mono">{s.stale}</span>
          </label>
          <div className="border-line bg-surface rounded-xl border px-4 py-3">
            <p className="text-muted text-[10px]">Possible on/off combinations to reason about</p>
            <p
              className={cn("font-mono text-3xl font-semibold", paths(s.stale) > 100 && "text-bad")}
            >
              {paths(s.stale).toLocaleString("en-IN")}
            </p>
          </div>
          <Code>{`if (flags.newCheckout) {           // shipped 14 months ago
  if (flags.legacyTax && !flags.gst2) {   // owner left the company
    ...
  }
}`}</Code>
          <div className="border-bad/40 bg-bad/5 rounded-xl border px-4 py-3 text-xs">
            <p className="font-semibold">Knight Capital, 2012</p>
            <p className="text-muted mt-1">
              New code &ldquo;repurposed a flag that was formerly used to activate the Power Peg
              code&rdquo;, a feature unused since 2003 but never deleted. On the one server that
              missed the update, switching the flag on woke the old code. The firm lost more than
              $460 million in about 45 minutes, the US SEC found.
            </p>
          </div>
        </div>
      }
    >
      <p>
        Hodgson again: &ldquo;Savvy teams view their Feature Toggles as inventory which comes with a
        carrying cost, and work to keep that inventory as low as possible.&rdquo; Each forgotten
        flag doubles the combinations the code can be in.
      </p>
      <p>
        Habits that keep <Term id="flag-debt">flag debt</Term> down: give every release toggle an
        owner and an expiry date, add a removal task when you create it, cap how many a team may
        have, and never reuse an old flag&apos;s name. Uber built a tool, Piranha, that deleted
        1,381 stale flags from its code between 2017 and 2019.
      </p>
    </StepLayout>
  );
}

/* 4 ─ Which kind is it? --------------------------------------------------------------------------- */

export function WhichKind() {
  return (
    <StepLayout
      eyebrow="Checkpoint"
      title="Which kind is it?"
      stage={
        <div className="flex flex-1 flex-col justify-center">
          <SortCheckpoint
            id="which-flag-kind"
            prompt="Which kind of flag is each one?"
            categories={[
              { id: "release", label: "Release" },
              { id: "experiment", label: "Experiment" },
              { id: "ops", label: "Ops" },
              { id: "permission", label: "Permission" },
            ]}
            items={[
              {
                id: "refunds",
                label: "Hide the half-built refunds screen until it's finished",
                category: "release",
                why: "Unfinished work merged daily but switched off: a release toggle, removed once launched.",
              },
              {
                id: "colours",
                label: "Show half the users a green Pay button and half a blue one",
                category: "experiment",
                why: "Consistent cohorts compared on a metric: an experiment toggle.",
              },
              {
                id: "recs",
                label: "Turn off recommendations when the database is overloaded",
                category: "ops",
                why: "Controls how the system behaves under stress: an ops toggle, maybe a permanent kill switch.",
              },
              {
                id: "premium",
                label: "Show the analytics dashboard only to premium customers",
                category: "permission",
                why: "Decides who gets which product experience, for as long as the plans exist.",
              },
            ]}
            explanation="The kind tells you how long a flag should live: release toggles days or weeks, experiments as long as the test, ops toggles briefly or as permanent kill switches, permission toggles as long as the product needs them."
          />
        </div>
      }
    >
      <p>Name the kind before you create a flag; it tells you when to delete it.</p>
    </StepLayout>
  );
}

/* 5 ─ Wrap ---------------------------------------------------------------------------------------- */

const POINTS: [string, string][] = [
  ["Deploy is not release", "Ship code switched off; release by changing a flag."],
  ["Roll out by percentage", "Consistent hashing keeps users in as you widen."],
  ["Keep a kill switch", "Turn a feature off in seconds without a deploy."],
  ["Delete release toggles", "Owners, expiry dates and a cap on how many."],
  ["Never reuse a flag", "Old names can wake old code."],
];

export function Wrap() {
  return (
    <StepLayout
      eyebrow="Wrap-up"
      title="What to remember"
      stage={
        <div className="flex flex-1 flex-col justify-center gap-1.5">
          {POINTS.map(([t, d], i) => (
            <motion.div
              key={t}
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.07 * i }}
              className="border-line bg-surface rounded-lg border px-3 py-2"
            >
              <p className="text-sm font-semibold">{t}</p>
              <p className="text-muted text-xs">{d}</p>
            </motion.div>
          ))}
        </div>
      }
    >
      <p>
        Tools range from hosted services (LaunchDarkly, ConfigCat, Optimizely) to open-source ones
        (Unleash, Flagsmith, GrowthBook) and cloud features (AWS AppConfig, Azure App Configuration,
        Firebase Remote Config). OpenFeature, a CNCF project, gives code one vendor-neutral way to
        ask for a flag, whichever tool answers.
      </p>
      <p>
        Google Cloud&apos;s June 2025 outage report said the faulty change &ldquo;did not have
        appropriate error handling nor was it feature flag protected.&rdquo; Its commitment: changes
        to critical binaries will be &ldquo;feature flag protected and disabled by default.&rdquo;
      </p>
    </StepLayout>
  );
}
