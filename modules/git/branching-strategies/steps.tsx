"use client";

import { motion } from "motion/react";
import { Route, ToggleLeft, ToggleRight } from "lucide-react";
import { useSceneState } from "@/lib/module-sdk";
import { StepLayout } from "@/toolkit/layout/step-layout";
import { WrapStep } from "@/toolkit/layout/wrap-step";
import { SortCheckpoint } from "@/toolkit/checkpoints/sort";
import { Segmented } from "@/toolkit/controls/segmented";
import { Term } from "@/toolkit/glossary/term";
import { CommitGraph } from "../_shared/graph";
import { INFO, REPOS } from "./model";
import type { StratState } from "./state";

/* 1 ─ Story ---------------------------------------------------------------------------------------- */

const ROADS = [
  {
    t: "Ring road and slip roads",
    s: "A few long-lived routes that traffic joins now and then.",
    ring: true,
  },
  { t: "One main street", s: "Short side lanes that rejoin the main street quickly.", ring: false },
];

export function Traffic() {
  return (
    <StepLayout
      eyebrow="Story"
      title="Agreeing on the roads"
      stage={
        <div className="grid flex-1 content-center gap-3 sm:grid-cols-2">
          {ROADS.map((c, i) => (
            <motion.div
              key={c.t}
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.15 * i }}
              className="border-line bg-surface rounded-xl border p-3 text-xs"
            >
              <Route className="text-accent size-4" />
              <svg viewBox="0 0 120 92" className="my-2 h-20 w-full" fill="none">
                {c.ring ? (
                  <>
                    <circle cx={60} cy={45} r={30} className="stroke-accent" strokeWidth={3} />
                    <path
                      d="M60 15 L60 0 M90 45 L118 45 M60 75 L60 92 M30 45 L4 45"
                      className="stroke-line-strong"
                      strokeWidth={2}
                    />
                  </>
                ) : (
                  <>
                    <path d="M4 45 L116 45" className="stroke-accent" strokeWidth={4} />
                    {[20, 40, 60, 80, 100].map((x) => (
                      <path
                        key={x}
                        d={`M${x} 45 L${x - 8} 20`}
                        className="stroke-line-strong"
                        strokeWidth={2}
                      />
                    ))}
                  </>
                )}
              </svg>
              <p className="font-semibold">{c.t}</p>
              <p className="text-muted">{c.s}</p>
            </motion.div>
          ))}
        </div>
      }
    >
      <p>
        A town can be planned around a few big ring roads with slip roads, or one main street that
        every lane joins quickly. Both work; they suit different towns, and everyone has to know
        which one they&apos;re driving in.
      </p>
      <p>
        A <Term id="branching-strategy">branching strategy</Term> is a team&apos;s agreement about
        how branches are used: which ones live long, how work gets back to main, and how releases
        are made. Git doesn&apos;t enforce any of them.
      </p>
    </StepLayout>
  );
}

/* 2 ─ One month, three ways ⭐ --------------------------------------------------------------------- */

export function ThreeWays() {
  const [s, set] = useSceneState<StratState>();
  const info = INFO[s.strategy];
  return (
    <StepLayout
      eyebrow="Simulation"
      title="The same month, three ways"
      stage={
        <div className="flex flex-1 flex-col justify-center gap-3">
          <Segmented
            value={s.strategy}
            onChange={(v) => set({ strategy: v })}
            options={[
              ["gitflow", "GitFlow"],
              ["github", "GitHub flow"],
              ["trunk", "Trunk-based"],
            ]}
            size="sm"
          />
          <CommitGraph
            repo={REPOS[s.strategy]()}
            className="border-line bg-surface rounded-xl border p-2"
          />
          <motion.div
            key={s.strategy}
            initial={{ opacity: 0, y: 4 }}
            animate={{ opacity: 1, y: 0 }}
            className="grid gap-2"
          >
            <p className="text-sm">{info.body}</p>
            <div className="grid grid-cols-3 gap-1.5">
              {info.stats.map(([k, v]) => (
                <div
                  key={k}
                  className="border-line bg-surface rounded-lg border px-2 py-1.5 text-[11px]"
                >
                  <p className="text-muted">{k}</p>
                  <p className="font-semibold">{v}</p>
                </div>
              ))}
            </div>
            <p className="text-xs">
              <span className="text-accent font-semibold">Fits: </span>
              {info.fits}
            </p>
          </motion.div>
        </div>
      }
    >
      <p>
        The café ships a chai feature and a few small changes. See how each strategy shapes the
        history.
      </p>
      <p>
        The big difference is how long work stays apart from main. The longer branches live, the
        bigger and riskier the eventual merge. DORA&apos;s research associates three or fewer active
        branches, merged to trunk at least daily, with higher delivery performance.
      </p>
    </StepLayout>
  );
}

/* 3 ─ Feature flags --------------------------------------------------------------------------------- */

export function Flags() {
  const [s, set] = useSceneState<StratState>();
  return (
    <StepLayout
      eyebrow="Explore"
      title="Merge now, switch on later"
      stage={
        <div className="flex flex-1 flex-col justify-center gap-3">
          <div className="border-line bg-surface rounded-xl border p-3 font-mono text-[11px]">
            <p>
              <span className="text-accent">if</span> (flags.enabled(&quot;chai-menu&quot;, user)){" "}
              {"{"}
            </p>
            <p className="pl-4">showChaiMenu();</p>
            <p>{"}"}</p>
          </div>
          <label className="flex items-center gap-2 text-sm">
            <button
              type="button"
              aria-pressed={s.deployed}
              onClick={() => set({ deployed: !s.deployed })}
              className="text-accent"
            >
              {s.deployed ? <ToggleRight className="size-6" /> : <ToggleLeft className="size-6" />}
            </button>
            Code merged to main and deployed
          </label>
          <label className="grid gap-1 text-sm">
            <span>
              Chai menu visible to <strong>{s.deployed ? s.percent : 0}%</strong> of customers
            </span>
            <input
              type="range"
              min={0}
              max={100}
              step={10}
              value={s.percent}
              disabled={!s.deployed}
              onChange={(e) => set({ percent: Number(e.target.value) })}
              className="accent-accent"
              aria-label="Rollout percentage"
            />
          </label>
          <p className="text-muted text-xs">
            {!s.deployed
              ? "Not deployed yet."
              : s.percent === 0
                ? "Deployed but switched off: the code is on main, customers see nothing. That's 'dark launching'."
                : s.percent < 100
                  ? "A gradual rollout: some customers see it. If something breaks, switch it off without a new deploy."
                  : "Fully released. Later, remove the flag and the old code path."}
          </p>
        </div>
      }
    >
      <p>
        <Term id="feature-flag">Feature flags</Term> are what make short-lived branches practical:
        unfinished work can be merged and deployed, hidden behind a switch.
      </p>
      <p>
        Deploying (putting code on servers) and releasing (letting users see it) become separate
        decisions. The price is flags you must remember to clean up.
      </p>
    </StepLayout>
  );
}

/* 4 ─ Choosing ------------------------------------------------------------------------------------- */

export function Choosing() {
  return (
    <StepLayout
      eyebrow="Explore"
      title="Choosing for your team"
      stage={
        <div className="flex flex-1 flex-col justify-center gap-2">
          {[
            [
              "Even GitFlow's author agrees",
              "In a 2020 note, Vincent Driessen suggested teams doing continuous delivery adopt a simpler workflow like GitHub flow.",
            ],
            [
              "Release branches still exist",
              "Teams that support old versions cut release branches and cherry-pick fixes to them, whatever their main strategy.",
            ],
            [
              "Environment branches",
              "Some teams keep branches per environment (test, production). GitLab has described this as part of 'GitLab flow'.",
            ],
            [
              "The tests decide",
              "The less you trust your automated tests, the more you'll want branches to hide behind. Investing in tests unlocks simpler flows.",
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
        There&apos;s no universally best strategy, but there is a trend: towards fewer long-lived
        branches and more frequent integration, wherever the product allows.
      </p>
      <p>Whatever you choose, write it down so everyone drives on the same side of the road.</p>
    </StepLayout>
  );
}

/* 5 ─ Checkpoint ----------------------------------------------------------------------------------- */

export function StratCheck() {
  return (
    <StepLayout
      eyebrow="Checkpoint"
      title="Which strategy fits?"
      stage={
        <div className="flex flex-1 flex-col justify-center">
          <SortCheckpoint
            id="git-strategies"
            prompt="Which branching strategy best fits each team?"
            categories={[
              { id: "gitflow", label: "GitFlow" },
              { id: "github", label: "GitHub flow" },
              { id: "trunk", label: "Trunk-based" },
            ]}
            items={[
              {
                id: "desktop",
                label: "A desktop app with versions 3.x and 4.x both supported",
                category: "gitflow",
                why: "Parallel versioned releases.",
              },
              {
                id: "web",
                label: "A web shop that deploys after every reviewed pull request",
                category: "github",
                why: "One live version, deployed often.",
              },
              {
                id: "daily",
                label: "A team merging tiny changes to main many times a day, with feature flags",
                category: "trunk",
                why: "That's trunk-based development.",
              },
              {
                id: "lib",
                label: "A library with scheduled, numbered releases and hotfixes to old versions",
                category: "gitflow",
                why: "Release and hotfix branches.",
              },
              {
                id: "startup",
                label: "A small team with one service, short branches and reviews",
                category: "github",
                why: "Lightweight and continuous.",
              },
            ]}
            explanation="Versioned software with parallel support fits GitFlow; continuously deployed apps fit GitHub flow; teams with strong tests and flags can go trunk-based."
          />
        </div>
      }
    >
      <p>Sort each team.</p>
    </StepLayout>
  );
}

/* 6 ─ Wrap ----------------------------------------------------------------------------------------- */

export function Wrap() {
  return (
    <WrapStep
      points={[
        ["A strategy is an agreement", "Git doesn't enforce one."],
        ["GitFlow", "develop, release and hotfix branches, for versioned software."],
        ["GitHub flow", "Short branches, pull requests, always-deployable main."],
        ["Trunk-based", "Merge to main at least daily; hide work behind flags."],
        ["Shorter is safer", "Long-lived branches mean big, risky merges."],
      ]}
    >
      <p>Next: making each commit, and its message, worth reading.</p>
    </WrapStep>
  );
}
