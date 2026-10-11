"use client";

import { motion } from "motion/react";
import { ArrowRight, RotateCcw, ToggleLeft } from "lucide-react";
import { useSceneState } from "@/lib/module-sdk";
import { StepLayout } from "@/toolkit/layout/step-layout";
import { WrapStep } from "@/toolkit/layout/wrap-step";
import { ChoiceCheckpoint } from "@/toolkit/checkpoints/choice";
import { Term } from "@/toolkit/glossary/term";
import { cn } from "@/lib/cn";
import { BASE, STAGES, USERS, affected, canaryRate, type Release } from "./model";
import type { ProdState } from "./state";

/* 1 ─ Story ---------------------------------------------------------------------------------------- */

export function SoftOpening() {
  return (
    <StepLayout
      eyebrow="Story"
      title="The soft opening"
      stage={
        <div className="flex flex-1 items-center justify-center gap-2">
          {[1, 5, 25, 100].map((p, i) => (
            <motion.div
              key={p}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.15 * i }}
              className="border-line bg-surface flex flex-col items-center rounded-lg border px-3 py-2 text-xs"
            >
              <span className="text-accent font-mono text-base">{p}%</span>
              <span className="text-muted text-[10px]">
                {["friends", "one street", "the area", "grand opening"][i]}
              </span>
            </motion.div>
          ))}
        </div>
      }
    >
      <p>
        A new restaurant rarely opens to the whole city on day one. It invites friends, then the
        neighbourhood, fixing what goes wrong while the stakes are small, and only then holds the
        grand opening.
      </p>
      <p>
        No test environment matches production exactly: real traffic, real data, real devices. So
        teams also test <em>in</em> production, safely: release to a few users first behind a{" "}
        <Term id="feature-flag">feature flag</Term>, watch closely, and switch off instantly if
        something looks wrong.
      </p>
    </StepLayout>
  );
}

/* 2 ─ Roll out ⭐ ---------------------------------------------------------------------------------- */

export function Rollout() {
  const [s, set] = useSceneState<ProdState>();
  const i = STAGES.indexOf(s.stage);
  const live = !s.rolledBack;
  const rate = s.stage ? canaryRate(s.release, s.stage) : null;
  const users = Math.round((USERS * s.stage) / 100);
  const hurt = s.rolledBack
    ? affected(s.release, Number(s.log.at(-1)?.match(/at (\d+)%/)?.[1] ?? 0))
    : affected(s.release, s.stage);
  const advance = () => {
    const next = STAGES[i + 1];
    set({ stage: next, log: [...s.log, `Advanced to ${next}%`] });
  };
  const rollBack = () =>
    set({ rolledBack: true, log: [...s.log, `Switched the flag off at ${s.stage}%`] });
  const reset = (r: Release) => set({ release: r, stage: 0, rolledBack: false, log: [] });
  return (
    <StepLayout
      eyebrow="Simulation"
      title="Roll out a change, one step at a time"
      stage={
        <div className="flex flex-1 flex-col justify-center gap-3">
          <div className="flex flex-wrap items-center gap-2 text-xs">
            <span className="text-muted">Release:</span>
            {(["A", "B"] as Release[]).map((r) => (
              <button
                key={r}
                type="button"
                aria-pressed={s.release === r}
                onClick={() => reset(r)}
                className={cn(
                  "rounded-full border px-3 py-0.5",
                  s.release === r ? "border-accent bg-accent text-accent-fg" : "border-line-strong",
                )}
              >
                New menu screen, build {r}
              </button>
            ))}
          </div>
          <div className="flex gap-1">
            {STAGES.slice(1).map((p) => (
              <div
                key={p}
                className={cn(
                  "flex-1 rounded py-1 text-center font-mono text-[10px]",
                  s.stage >= p && live
                    ? "bg-accent text-accent-fg"
                    : s.stage >= p
                      ? "bg-bad/30"
                      : "bg-surface-2 text-muted",
                )}
              >
                {p}%
              </div>
            ))}
          </div>
          <div className="grid grid-cols-3 gap-2 text-xs">
            <div className="border-line bg-surface rounded-lg border px-2 py-1.5">
              <p className="text-muted text-[10px]">Users on the new build</p>
              <p className="font-mono text-base">{live ? users.toLocaleString("en-IN") : 0}</p>
            </div>
            <div className="border-line bg-surface rounded-lg border px-2 py-1.5">
              <p className="text-muted text-[10px]">Error rate: old build</p>
              <p className="font-mono text-base">{BASE.toFixed(1)}%</p>
            </div>
            <div
              className={cn(
                "rounded-lg border px-2 py-1.5",
                rate !== null && rate > 1.2 ? "border-bad/50 bg-bad/10" : "border-line bg-surface",
              )}
            >
              <p className="text-muted text-[10px]">Error rate: new build</p>
              <p className="font-mono text-base">{rate === null ? "–" : `${rate.toFixed(1)}%`}</p>
            </div>
          </div>
          {s.stage > 0 && s.stage <= 5 && rate !== null && (
            <p className="text-muted text-[10px]">
              Small group: the number is noisy. Compare with the old build, not with zero.
            </p>
          )}
          <div className="flex flex-wrap gap-2">
            {live && i < STAGES.length - 1 && (
              <button
                type="button"
                onClick={advance}
                className="bg-accent text-accent-fg flex items-center gap-1 rounded-full px-3 py-1 text-xs font-medium"
              >
                {s.stage === 0 ? "Start at 1%" : "Advance"} <ArrowRight className="size-3" />
              </button>
            )}
            {live && s.stage > 0 && (
              <button
                type="button"
                onClick={rollBack}
                className="border-bad text-bad flex items-center gap-1 rounded-full border px-3 py-1 text-xs font-medium"
              >
                <ToggleLeft className="size-3.5" /> Switch the flag off
              </button>
            )}
            {(s.rolledBack || s.stage === 100) && (
              <button
                type="button"
                onClick={() => reset(s.release)}
                className="border-line-strong flex items-center gap-1 rounded-full border px-3 py-1 text-xs"
              >
                <RotateCcw className="size-3" /> Try again
              </button>
            )}
          </div>
          {(s.rolledBack || s.stage === 100) && (
            <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-sm">
              {s.release === "B"
                ? `${hurt.toLocaleString("en-IN")} customers hit the bug${s.rolledBack ? ` before you switched it off. ${hurt < 2000 ? "Caught early: the flag limited the damage." : "Caught, but later than the numbers allowed."}` : ", and it's live for everyone."}`
                : s.rolledBack
                  ? "Build A was healthy: its error rate matched the old build. Rolling back cost a day, not customers."
                  : "Build A is out to everyone. Its error rate matched the old build all the way."}
            </motion.p>
          )}
        </div>
      }
    >
      <p>
        A café app is releasing a new menu screen. Start at 1% of users and decide at each step:
        advance, or switch the flag off. Compare the new build&apos;s error rate with the old
        build&apos;s, not with zero.
      </p>
      <p>
        Try both builds. One has a bug that hurts about 2.4% of sessions; the other is fine but has
        a noisy start. Switching a flag off takes seconds, with no redeploy.
      </p>
      <p className="text-subtle text-xs">Rates are illustrative.</p>
    </StepLayout>
  );
}

/* 3 ─ Techniques ----------------------------------------------------------------------------------- */

export function Techniques() {
  return (
    <StepLayout
      eyebrow="Explore"
      title="Ways to test safely in production"
      stage={
        <div className="flex flex-1 flex-col justify-center gap-1.5">
          {[
            [
              "Feature flags",
              "Ship code switched off; turn it on for chosen users; turn it off without a deploy.",
            ],
            [
              "Canary release",
              "Send a small share of traffic to the new version and compare its health with the old.",
            ],
            [
              "Dark launch",
              "Run the new code on real traffic but don't show users the result; compare outputs.",
            ],
            [
              "Synthetic monitoring",
              "Robots run key journeys (log in, order, pay) every few minutes from several places, and alert when one fails.",
            ],
          ].map(([t, b], i) => (
            <motion.div
              key={t}
              initial={{ opacity: 0, x: -4 }}
              animate={{ opacity: 1, x: 0 }}
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
        Danilo Sato described <Term id="canary-release">canary releases</Term> in 2014; Pete
        Hodgson&apos;s article on feature toggles (2016) is the standard guide to flags.
        OpenFeature, a vendor-neutral standard for flags, is a CNCF incubating project. Flag
        services include LaunchDarkly, Unleash, Flagsmith and GrowthBook; Argo Rollouts and Flagger
        automate canaries on Kubernetes.
      </p>
      <p>
        All of this depends on seeing what&apos;s happening: the Observability track covers the
        metrics, logs and traces behind those error rates.
      </p>
    </StepLayout>
  );
}

/* 4 ─ All at once ---------------------------------------------------------------------------------- */

export function AllAtOnce() {
  return (
    <StepLayout
      eyebrow="Explore"
      title="When everything ships at once"
      stage={
        <div className="flex flex-1 flex-col justify-center gap-2">
          <div className="border-bad/40 bg-bad/10 rounded-lg border px-3 py-2 text-xs">
            <p className="font-semibold">19 July 2024</p>
            <p className="text-muted">
              A security vendor&apos;s faulty content update reached its whole fleet within minutes
              and crashed about 8.5 million Windows computers (Microsoft&apos;s estimate).
            </p>
          </div>
          <div className="border-good/40 bg-good/10 rounded-lg border px-3 py-2 text-xs">
            <p className="font-semibold">Afterwards</p>
            <p className="text-muted">
              The vendor committed to staggered deployment of such updates, starting with a small
              group, with customers able to choose when they receive them.
            </p>
          </div>
        </div>
      }
    >
      <p>
        You met this incident in module 1. Its second lesson belongs here: even good tests miss
        things, so how a change reaches production decides how much damage a miss can do.
      </p>
      <p>
        Staged rollouts, flags and fast rollback don&apos;t replace testing beforehand. They&apos;re
        the last safety net.
      </p>
    </StepLayout>
  );
}

/* 5 ─ Checkpoint ----------------------------------------------------------------------------------- */

export function ProdCheck() {
  return (
    <StepLayout
      eyebrow="Checkpoint"
      title="What would you do?"
      stage={
        <div className="flex flex-1 flex-col justify-center">
          <ChoiceCheckpoint
            id="testing-production"
            prompt="At 5% of users, the new checkout's error rate is 2.9% against 0.5% on the old one, for the second hour running. What's the best next step?"
            options={[
              {
                id: "off",
                label: "Switch the flag off, then investigate",
                correct: true,
                feedback:
                  "Consistently worse than the old build: stop the damage first; switching off is cheap.",
              },
              {
                id: "advance",
                label: "Advance to 25% to get more data",
                feedback: "That multiplies the people affected.",
              },
              {
                id: "wait",
                label: "Leave it at 5% for a week",
                feedback: "Customers keep hitting errors meanwhile.",
              },
              {
                id: "ignore",
                label: "Ignore it: 2.9% is still low",
                feedback: "Compared with 0.5%, it's nearly six times worse.",
              },
            ]}
            explanation="Compare the new version with the old one. When it's clearly worse, switch it off first and investigate after; that's what flags are for."
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
        ["Production is the real environment", "Test there too, safely."],
        ["Start small", "1%, then 5%, then more."],
        ["Compare with the old version", "Not with zero, and mind the noise."],
        ["Switch off first, investigate after", "Flags make rollback instant."],
        ["A last net, not the only one", "Test before you ship as well."],
      ]}
    >
      <p>Next, the capstone: rescue a codebase nobody dares to change.</p>
    </WrapStep>
  );
}
