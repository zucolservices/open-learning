"use client";

import { motion } from "motion/react";
import { useSceneState } from "@/lib/module-sdk";
import { StepLayout } from "@/toolkit/layout/step-layout";
import { SortCheckpoint } from "@/toolkit/checkpoints/sort";
import { Term } from "@/toolkit/glossary/term";
import { cn } from "@/lib/cn";
import { MINUTES, STRATEGIES, canaryMath, timeline, type Strategy } from "./model";
import type { ReleaseState } from "./state";

/* 1 ─ A bad release, five ways ⭐ ----------------------------------------------------------------- */

const ORDER: Strategy[] = ["recreate", "rolling", "bluegreen", "canary", "shadow"];

export function FiveWays() {
  const [s, set] = useSceneState<ReleaseState>();
  const t = timeline(s.strategy);
  const st = STRATEGIES[s.strategy];
  const all = ORDER.map((k) => ({ k, t: timeline(k) }));
  return (
    <StepLayout
      eyebrow="Simulation"
      title="A bad release, five ways"
      stage={
        <div className="flex flex-1 flex-col justify-center gap-3">
          <div className="flex flex-wrap gap-1.5">
            {ORDER.map((k) => (
              <button
                key={k}
                type="button"
                onClick={() => set({ strategy: k })}
                className={cn(
                  "rounded-full border px-3 py-1 text-xs",
                  s.strategy === k
                    ? "border-accent bg-accent-soft"
                    : "border-line hover:bg-surface-2",
                )}
              >
                {STRATEGIES[k].name}
              </button>
            ))}
          </div>
          <p className="text-muted text-xs">{st.idea}</p>
          <div className="border-line bg-surface rounded-xl border p-3">
            <p className="text-muted mb-1 font-mono text-[10px]">
              each bar = one minute · height = share of users on v2 · red = requests failing
            </p>
            <div className="flex h-28 items-end gap-[3px]">
              {Array.from({ length: MINUTES }, (_, m) => {
                const v2 = t.v2[m];
                const down = t.down[m];
                const fail = down + v2 * 0.2;
                return (
                  <div key={m} className="relative flex h-full flex-1 flex-col justify-end">
                    {down > 0 ? (
                      <motion.div
                        animate={{ height: "100%" }}
                        className="bg-bad/70 w-full rounded-t-sm"
                        title={`minute ${m}: outage`}
                      />
                    ) : (
                      <motion.div
                        animate={{ height: `${Math.max(v2 * 100, 3)}%` }}
                        className={cn(
                          "relative w-full rounded-t-sm",
                          v2 > 0 ? "bg-viz-data/40" : "bg-viz-idle/30",
                        )}
                        title={`minute ${m}: ${Math.round(v2 * 100)}% on v2`}
                      >
                        {fail > 0 && (
                          <div
                            className="bg-bad/80 absolute inset-x-0 bottom-0 rounded-t-sm"
                            style={{ height: `${(fail / Math.max(v2, 0.01)) * 100}%` }}
                          />
                        )}
                      </motion.div>
                    )}
                    {m === t.detectedAt && (
                      <span className="border-viz-compute pointer-events-none absolute inset-y-0 left-1/2 border-l-2 border-dashed" />
                    )}
                  </div>
                );
              })}
            </div>
            <div className="text-muted mt-1 flex justify-between font-mono text-[9px]">
              <span>deploy at 2 min</span>
              <span className="text-viz-compute">dashed line = problem noticed</span>
              <span>{MINUTES} min</span>
            </div>
          </div>
          <div className="border-line bg-surface overflow-hidden rounded-xl border">
            <div className="text-muted grid grid-cols-[1fr_5.5rem_6rem] gap-2 px-3 py-1.5 text-[10px] sm:grid-cols-[1fr_6rem_7rem_8rem]">
              <span>Strategy</span>
              <span className="text-right">Failed requests</span>
              <span className="text-right">Back on v1 at</span>
              <span className="hidden text-right sm:block">Extra capacity</span>
            </div>
            {all.map(({ k, t: x }) => (
              <div
                key={k}
                className={cn(
                  "border-line grid grid-cols-[1fr_5.5rem_6rem] gap-2 border-t px-3 py-1 font-mono text-[11px] sm:grid-cols-[1fr_6rem_7rem_8rem]",
                  k === s.strategy && "bg-accent-soft",
                )}
              >
                <span className="font-sans">{STRATEGIES[k].name}</span>
                <span className={cn("text-right", x.failed > 20000 && "text-bad")}>
                  {x.failed.toLocaleString("en-IN")}
                </span>
                <span className="text-right">{x.backAt === null ? "—" : `${x.backAt} min`}</span>
                <span className="text-muted hidden text-right font-sans text-[10px] sm:block">
                  {STRATEGIES[k].extra}
                </span>
              </div>
            ))}
          </div>
          <p className="text-muted text-[10px]">
            Illustrative: 10,000 requests a minute; v2 fails 20% of the requests it serves.
          </p>
        </div>
      }
    >
      <p>
        Version 2 has a bug that fails one request in five. The tests missed it. Release it each way
        and compare what users go through.
      </p>
      <p>
        <Term id="blue-green">Blue-green</Term> switches everyone at once, but switching back is as
        quick as switching over: in Fowler&apos;s words, &ldquo;if anything goes wrong you switch
        the router back to your blue environment.&rdquo; A <Term id="canary-release">canary</Term>{" "}
        exposes only a small group first, so the same bug hurts a twentieth as many people.
      </p>
      <p>
        A <Term id="shadow-traffic">shadow</Term> release hurts nobody, but only works for requests
        that are safe to repeat: mirror a payment and you might charge someone twice.
      </p>
    </StepLayout>
  );
}

/* 2 ─ How big a canary? --------------------------------------------------------------------------- */

export function HowBig() {
  const [s, set] = useSceneState<ReleaseState>();
  const m = canaryMath(s.canary, 20);
  return (
    <StepLayout
      eyebrow="Explore"
      title="How big a canary?"
      stage={
        <div className="flex flex-1 flex-col justify-center gap-4">
          <label className="grid grid-cols-[7rem_1fr_3rem] items-center gap-2 text-xs">
            <span>Canary share</span>
            <input
              type="range"
              min={1}
              max={50}
              value={s.canary}
              onChange={(e) => set({ canary: Number(e.target.value) })}
              className="accent-accent"
              aria-label="Canary share"
            />
            <span className="text-right font-mono">{s.canary}%</span>
          </label>
          <div className="mx-auto grid w-full max-w-md grid-cols-20 gap-0.5" aria-hidden>
            {Array.from({ length: 100 }, (_, i) => (
              <div
                key={i}
                className={cn(
                  "aspect-square rounded-[2px]",
                  i < s.canary ? (i % 5 === 0 ? "bg-bad/70" : "bg-viz-data/50") : "bg-viz-idle/30",
                )}
              />
            ))}
          </div>
          <div className="grid grid-cols-2 gap-2">
            <div className="border-line bg-surface rounded-lg border px-3 py-2">
              <p className="text-muted text-[10px]">Errors across all users</p>
              <p className="font-mono text-lg font-semibold">{m.overall.toFixed(1)}%</p>
            </div>
            <div className="border-line bg-surface rounded-lg border px-3 py-2">
              <p className="text-muted text-[10px]">Time to a confident verdict</p>
              <p className="font-mono text-lg font-semibold">
                {m.minutes < 2 ? "about a minute" : `about ${Math.round(m.minutes)} min`}
              </p>
            </div>
          </div>
          <p className="text-muted text-[10px]">
            Each square is 1% of users: blue on v2, red the ones hitting the bug. Illustrative:
            10,000 requests a minute; a verdict needs a few hundred failed canary requests.
          </p>
        </div>
      }
    >
      <p>
        Google&apos;s SRE Workbook defines canarying as &ldquo;a partial and time-limited deployment
        of a change in a service and its evaluation&rdquo;. Its arithmetic: if a bad release fails
        20% of requests and the canary takes 5% of traffic, users overall see 1% errors.
      </p>
      <p>
        The trade-off is speed. A tiny canary hurts fewer people but takes longer to collect enough
        evidence. And compare the canary with a control group running the old version at the same
        moment, not with yesterday: Monday morning traffic isn&apos;t Sunday night traffic.
      </p>
      <p>
        One more detail: pin each user to one version (by cookie or header), or they flip between
        old and new screens from one click to the next.
      </p>
    </StepLayout>
  );
}

/* 3 ─ When everyone got it at once ---------------------------------------------------------------- */

const STORIES = [
  {
    when: "19 July 2024",
    who: "CrowdStrike",
    text: "A content update for its Falcon sensor went to every Windows machine running it at 04:09 UTC and was pulled at 05:27. About 8.5 million devices crashed, by Microsoft's estimate. Pulling the update couldn't fix machines that had already crashed. CrowdStrike committed to canary testing and successively wider deployment rings with bake-in time.",
  },
  {
    when: "12 June 2025",
    who: "Google Cloud",
    text: 'New code had been rolled out region by region, but the faulty path never ran during that rollout, and Google says it was not "feature flag protected". Then a policy-data change replicated worldwide within seconds and triggered it everywhere. The outage lasted about three hours.',
  },
];

export function AllAtOnce() {
  return (
    <StepLayout
      eyebrow="Real incidents"
      title="When everyone got it at once"
      stage={
        <div className="flex flex-1 flex-col justify-center gap-3">
          {STORIES.map((x, i) => (
            <motion.div
              key={x.who}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.15 * i }}
              className="border-bad/40 bg-bad/5 rounded-xl border px-4 py-3"
            >
              <p className="text-accent font-mono text-xs">{x.when}</p>
              <p className="mt-0.5 font-semibold">{x.who}</p>
              <p className="text-muted mt-1 text-sm">{x.text}</p>
            </motion.div>
          ))}
        </div>
      }
    >
      <p>
        Both were changes that went everywhere at once, and both were &ldquo;just&rdquo; content or
        configuration rather than a new version of the program.
      </p>
      <p>
        The lesson is broader than code: stage every kind of change, including configuration and
        data files, and make sure the new path actually runs during the staged part.
      </p>
    </StepLayout>
  );
}

/* 4 ─ Which tool for the job? --------------------------------------------------------------------- */

export function WhichTool() {
  return (
    <StepLayout
      eyebrow="Checkpoint"
      title="Which tool for the job?"
      stage={
        <div className="flex flex-1 flex-col justify-center">
          <SortCheckpoint
            id="which-release-tool"
            prompt="Which approach fits each situation best?"
            categories={[
              { id: "bg", label: "Blue-green" },
              { id: "canary", label: "Canary" },
              { id: "flag", label: "Feature flag" },
            ]}
            items={[
              {
                id: "runtime",
                label: "Moving the whole service to a new runtime, with instant switch-back",
                category: "bg",
                why: "A complete second environment you can flip to and from in seconds.",
              },
              {
                id: "capacity",
                label: "You can afford double the servers for an hour and want one clean cut-over",
                category: "bg",
                why: "That's blue-green's price and its benefit.",
              },
              {
                id: "compare",
                label: "Send 2% of requests to v2 and compare its error rate with v1",
                category: "canary",
                why: "Canary versus control, measured side by side.",
              },
              {
                id: "abort",
                label: "Roll out a new search engine, aborting automatically if latency rises",
                category: "canary",
                why: "Automated canary analysis widens or aborts based on metrics.",
              },
              {
                id: "staff",
                label: "Show a new checkout button to staff only, then to 10% of customers",
                category: "flag",
                why: "Who sees a feature is decided in the code, by a flag, not by which servers run it.",
              },
              {
                id: "off",
                label: "Turn a misbehaving feature off in seconds, without a deploy",
                category: "flag",
                why: "A kill switch is a feature flag.",
              },
            ]}
            explanation="Blue-green and canary decide which version runs where; feature flags decide who sees a feature inside a version. Teams usually combine them."
          />
        </div>
      }
    >
      <p>
        Canary and blue-green work at the level of servers and traffic. Feature flags, next module,
        work inside the code.
      </p>
    </StepLayout>
  );
}

/* 5 ─ Wrap ---------------------------------------------------------------------------------------- */

const POINTS: [string, string][] = [
  ["Limit the blast radius", "Expose a few users first; widen only on good evidence."],
  ["Make switch-back instant", "Blue-green and canary abort in seconds; recreate takes minutes."],
  ["Compare like with like", "Canary against a control group at the same time."],
  ["Stage everything", "Configuration and data files as well as code."],
  ["Automate the verdict", "Let metrics widen or abort the rollout."],
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
        James Governor of RedMonk named this family of techniques{" "}
        <Term id="progressive-delivery">progressive delivery</Term> in 2018. The tools: Argo
        Rollouts and Flagger on Kubernetes, AWS CodeDeploy and ECS&apos;s built-in blue-green and
        canary (2025), Google Cloud Deploy, Azure Container Apps traffic splitting, and Spinnaker
        with Kayenta, the automated canary judge from Netflix and Google.
      </p>
    </StepLayout>
  );
}
