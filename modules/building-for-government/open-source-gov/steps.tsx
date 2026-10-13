"use client";

import { motion } from "motion/react";
import { useSceneState } from "@/lib/module-sdk";
import { StepLayout } from "@/toolkit/layout/step-layout";
import { WrapStep } from "@/toolkit/layout/wrap-step";
import { SortCheckpoint } from "@/toolkit/checkpoints/sort";
import { Term } from "@/toolkit/glossary/term";
import { cn } from "@/lib/cn";
import { ROUTES, YEARS, type Route } from "./model";
import type { OssState } from "./state";

/* 1 ─ Story ---------------------------------------------------------------------------------------- */

export function Recipes() {
  return (
    <StepLayout
      eyebrow="Story"
      title="The shared recipe book"
      stage={
        <div className="grid flex-1 content-center gap-3 sm:grid-cols-2">
          <motion.div
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            className="border-line bg-surface rounded-xl border p-3 text-xs"
          >
            <p className="font-semibold">A secret recipe</p>
            <p className="text-muted">
              Only the chef knows it. When the chef leaves, so does the dish.
            </p>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15 }}
            className="border-accent bg-accent-soft rounded-xl border p-3 text-xs"
          >
            <p className="font-semibold">A community recipe book</p>
            <p className="text-muted">
              Every kitchen can cook from it, improve it and pass the improvements on.
            </p>
          </motion.div>
        </div>
      }
    >
      <p>
        A dish that only one chef can make disappears when the chef leaves. A recipe shared in a
        community book survives, and gets better as every kitchen adds to it.
      </p>
      <p>
        Governments increasingly prefer <Term id="open-source">open source</Term> and open standards
        to avoid <Term id="vendor-lock-in">vendor lock-in</Term>, and to reuse what others built.{" "}
        <Term id="digital-public-good">Digital public goods</Term> let one country&apos;s solution
        serve many.
      </p>
    </StepLayout>
  );
}

/* 2 ─ Branching scenario ⭐ ------------------------------------------------------------------------ */

export function FiveYears() {
  const [s, set] = useSceneState<OssState>();
  const route = s.route as Route | "";
  return (
    <StepLayout
      eyebrow="Branching scenario"
      title="Build, buy or reuse: five years on"
      stage={
        <div className="flex flex-1 flex-col justify-center gap-3 text-xs">
          <div className="grid gap-1.5 sm:grid-cols-3">
            {ROUTES.map(([id, t, b]) => (
              <button
                key={id}
                type="button"
                aria-pressed={route === id}
                onClick={() => set({ route: id, year: 1 })}
                className={cn(
                  "rounded-lg border px-3 py-2 text-left",
                  route === id
                    ? "border-accent bg-accent-soft"
                    : "border-line bg-surface hover:border-accent",
                )}
              >
                <span className="font-semibold">{t}</span>
                <span className="text-muted block text-[11px]">{b}</span>
              </button>
            ))}
          </div>
          {route && (
            <>
              <div className="grid gap-1">
                {YEARS.slice(0, s.year).map((y) => {
                  const [text, ok] = y.outcome[route];
                  return (
                    <motion.div
                      key={y.title}
                      initial={{ opacity: 0, y: 4 }}
                      animate={{ opacity: 1, y: 0 }}
                      className={cn(
                        "rounded-lg border px-3 py-1.5",
                        ok ? "border-good/50 bg-good/10" : "border-bad/40 bg-bad/5",
                      )}
                    >
                      <span className="font-semibold">{y.title}</span>
                      <span className="text-muted"> · {text}</span>
                    </motion.div>
                  );
                })}
              </div>
              <div className="flex gap-2">
                <button
                  type="button"
                  disabled={s.year >= YEARS.length}
                  onClick={() => set({ year: s.year + 1 })}
                  className="border-line-strong rounded-full border px-3 py-1 disabled:opacity-40"
                >
                  Next year
                </button>
                <button
                  type="button"
                  onClick={() => set({ route: "", year: 0 })}
                  className="text-muted px-2"
                >
                  Choose again
                </button>
              </div>
            </>
          )}
        </div>
      }
    >
      <p>
        Kalpanagar wants one platform for property tax, trade licences and complaints across its
        cities. Pick a route, then step through five years. Then try the others.
      </p>
      <p>
        Each route can work. The outcomes are illustrative, but they show where the long-term costs
        hide: in ownership of the code and the freedom to change supplier.
      </p>
    </StepLayout>
  );
}

/* 3 ─ Policy --------------------------------------------------------------------------------------- */

export function Policy() {
  return (
    <StepLayout
      eyebrow="Explore"
      title="India's open source policies"
      stage={
        <div className="flex flex-1 flex-col justify-center gap-1.5">
          {[
            [
              "Open standards, 2010",
              "e-Governance systems should use royalty-free open standards.",
            ],
            [
              "Open source, March 2015",
              "Central government bodies should prefer open source for new e-governance systems, and record a reason when they don't.",
            ],
            [
              "Open APIs, 2015",
              "Government systems should expose open, documented APIs; API Setu puts this into practice.",
            ],
            [
              "Opening the source code, 2015",
              "Government applications should be developed and shared openly; the OpenForge platform followed in 2017.",
            ],
            [
              "Elsewhere",
              "The UK's Service Standard says “make new source code open”; the EU's Interoperable Europe Act (2024) encourages public bodies to share solutions.",
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
        The stated aims of India&apos;s 2015 policy are strategic control of government systems and
        lower total cost of ownership.
      </p>
      <p>
        Open source isn&apos;t free to run: hosting, support, security updates and skilled people
        still cost money. Budget for them.
      </p>
    </StepLayout>
  );
}

/* 4 ─ Goods ---------------------------------------------------------------------------------------- */

export function Goods() {
  return (
    <StepLayout
      eyebrow="Explore"
      title="Digital public goods"
      stage={
        <div className="grid flex-1 content-center gap-1.5 sm:grid-cols-2">
          {[
            [
              "What qualifies",
              "Open software, data, AI models, standards or content that meet the Digital Public Goods standard's nine indicators, including an open licence and do-no-harm.",
            ],
            [
              "How many",
              "About 256 in the registry (October 2026). Status is reviewed and can lapse.",
            ],
            [
              "DIGIT (India)",
              "eGov Foundation's platform for urban services such as property tax and complaints. MIT licence.",
            ],
            [
              "MOSIP (India)",
              "Open-source identity platform from IIIT Bangalore, used for national IDs abroad. MPL-2.0 licence.",
            ],
            ["Sunbird (India)", "Learning platform behind DIKSHA. MIT licence."],
            [
              "DHIS2 (Norway)",
              "Health information software from the University of Oslo, used in many countries. BSD licence.",
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
        Licences decide what reuse is allowed. MIT and BSD are permissive; MPL-2.0 asks that changes
        to its files stay open.
      </p>
      <p>
        Civic-tech groups such as Code for America (founded 2009) also build in the open with
        governments.
      </p>
    </StepLayout>
  );
}

/* 5 ─ Checkpoint ----------------------------------------------------------------------------------- */

export function OssCheck() {
  return (
    <StepLayout
      eyebrow="Checkpoint"
      title="Myth or fact?"
      stage={
        <div className="flex flex-1 flex-col justify-center">
          <SortCheckpoint
            id="gov-open-source"
            prompt="Is each statement about open source in government a myth or a fact?"
            categories={[
              { id: "fact", label: "Fact" },
              { id: "myth", label: "Myth" },
            ]}
            items={[
              {
                id: "free",
                label: "Open source costs nothing to run",
                category: "myth",
                why: "Hosting, support and people still cost money.",
              },
              {
                id: "read",
                label: "Anyone can read and check the code",
                category: "fact",
                why: "That's what open source means.",
              },
              {
                id: "justify",
                label:
                  "Central bodies must justify not choosing open source for new e-governance systems",
                category: "fact",
                why: "India's 2015 policy.",
              },
              {
                id: "insecure",
                label: "Open source can't be secure",
                category: "myth",
                why: "Security depends on practice, not on whether code is visible.",
              },
              {
                id: "reuse",
                label: "An MIT-licensed platform can be reused by another state",
                category: "fact",
                why: "Permissive licences allow it.",
              },
            ]}
            explanation="Open source lets anyone read, reuse and improve code, and India's policy prefers it for new government systems. It still needs a budget for running it, and good security practice."
          />
        </div>
      }
    >
      <p>Sort each statement.</p>
    </StepLayout>
  );
}

/* 6 ─ Wrap ----------------------------------------------------------------------------------------- */

export function Wrap() {
  return (
    <WrapStep
      points={[
        ["Prefer open", "India's policy since 2015."],
        ["Own your future", "Code and data you can take elsewhere."],
        ["Reuse before building", "Digital public goods."],
        ["Budget for running it", "Open isn't free to operate."],
        ["Give back", "Improvements help the next state."],
      ]}
    >
      <p>Next: vendors, contracts and handover.</p>
    </WrapStep>
  );
}
