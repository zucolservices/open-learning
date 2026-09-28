"use client";

import { motion } from "motion/react";
import { useSceneState } from "@/lib/module-sdk";
import { StepLayout } from "@/toolkit/layout/step-layout";
import { ChoiceCheckpoint } from "@/toolkit/checkpoints/choice";
import { SortCheckpoint } from "@/toolkit/checkpoints/sort";
import { Segmented } from "@/toolkit/controls/segmented";
import { FrameCaption, Stepper } from "@/toolkit/controls/stepper";
import { Term } from "@/toolkit/glossary/term";
import { cn } from "@/lib/cn";
import { CADENCES, WEEKS, simulate } from "./model";
import type { PlansState } from "./state";

function Stat({ label, value, bad }: { label: string; value: string; bad?: boolean }) {
  return (
    <div
      className={cn(
        "rounded-xl border px-3 py-2",
        bad ? "border-bad/40 bg-bad/5" : "border-line bg-surface",
      )}
    >
      <p className="text-muted text-[10px]">{label}</p>
      <motion.p
        key={value}
        initial={{ opacity: 0.4 }}
        animate={{ opacity: 1 }}
        className="font-mono text-sm"
      >
        {value}
      </motion.p>
    </div>
  );
}

/* 2 ─ Learn early or learn late ⭐ (simulation) ---------------------------------------------------- */

const END = 60; // weeks shown: the year plus the weeks after launch

export function LearnEarly() {
  const [s, set] = useSceneState<PlansState>();
  const plan = simulate(s.every, s.automated);
  const x = (w: number) => 8 + (w / END) * 304;
  const extra = plan.rework + plan.overhead;
  return (
    <StepLayout
      eyebrow="Simulation"
      title="Learn early or learn late"
      stage={
        <div className="flex flex-1 flex-col gap-3">
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-muted text-xs">Show users a working version:</span>
            <Segmented
              size="sm"
              value={String(s.every)}
              options={CADENCES.map(([w, l]) => [String(w), l] as [string, string])}
              onChange={(v) => set({ every: Number(v) })}
            />
          </div>
          <label className="flex items-center gap-2 text-xs">
            <input
              type="checkbox"
              checked={s.automated}
              onChange={(e) => set({ automated: e.target.checked })}
              className="accent-[var(--accent)]"
            />
            Automated testing and deployment (each release takes hours, not days)
          </label>
          <div className="border-line bg-surface rounded-xl border p-3">
            <svg
              viewBox="0 0 320 156"
              className="w-full"
              role="img"
              aria-label="When each feature was built and when its surprise was found"
            >
              <rect
                x={x(WEEKS)}
                y={4}
                width={x(END) - x(WEEKS)}
                height={128}
                className="fill-bad/5"
              />
              <text x={x(WEEKS) + 3} y={14} className="fill-bad text-[8px]">
                after launch
              </text>
              {plan.releases.map((r) => (
                <line
                  key={r}
                  x1={x(r)}
                  y1={8}
                  x2={x(r)}
                  y2={130}
                  className="stroke-accent"
                  strokeWidth={r === WEEKS ? 1.6 : 0.8}
                  strokeDasharray={r === WEEKS ? undefined : "2 2"}
                />
              ))}
              {plan.found.map((f, i) => {
                const y = 26 + i * 18;
                const late = f.afterLaunch;
                return (
                  <g key={f.feature.id}>
                    <text
                      x={x(f.feature.built) - 3}
                      y={y + 3}
                      textAnchor="end"
                      className="fill-muted text-[8.5px]"
                    >
                      {f.feature.label}
                    </text>
                    <motion.line
                      x1={x(f.feature.built)}
                      y1={y}
                      initial={false}
                      animate={{ x2: x(f.found) }}
                      y2={y}
                      className={late ? "stroke-bad" : "stroke-viz-compute"}
                      strokeWidth={2.5}
                      strokeLinecap="round"
                    />
                    <circle cx={x(f.feature.built)} cy={y} r={3} className="fill-viz-data" />
                    <motion.circle
                      initial={false}
                      animate={{ cx: x(f.found) }}
                      cy={y}
                      r={3.5}
                      className={late ? "fill-bad" : "fill-viz-compute"}
                    />
                  </g>
                );
              })}
              <line x1={x(0)} y1={136} x2={x(END)} y2={136} className="stroke-line-strong" />
              {[0, 13, 26, 39, 52].map((w) => (
                <text
                  key={w}
                  x={x(w)}
                  y={150}
                  textAnchor="middle"
                  className="fill-muted text-[8.5px]"
                >
                  wk {w}
                </text>
              ))}
            </svg>
            <div className="text-muted mt-1 flex flex-wrap justify-center gap-3 text-[10px]">
              <span className="flex items-center gap-1">
                <span className="bg-viz-data size-2 rounded-full" /> feature built
              </span>
              <span className="flex items-center gap-1">
                <span className="bg-viz-compute h-0.5 w-4" /> mistake sits in the product
              </span>
              <span className="flex items-center gap-1">
                <span className="bg-accent h-3 w-px" /> users get a new version
              </span>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
            <Stat
              label="Users first see it"
              value={`week ${plan.firstValue}`}
              bad={plan.firstValue > 26}
            />
            <Stat
              label="Surprises after launch"
              value={`${plan.afterLaunch} of 6`}
              bad={plan.afterLaunch > 0}
            />
            <Stat label="Rework (weeks)" value={plan.rework.toFixed(1)} bad={plan.rework > 12} />
            <Stat
              label="Release effort (weeks)"
              value={plan.overhead.toFixed(1)}
              bad={plan.overhead > 3}
            />
          </div>
          <p className="border-line bg-surface-2 rounded-xl border px-3 py-2 text-xs">
            {s.every === 52
              ? `Every surprise lands after launch, when the mistakes have sat in the product for months. ${extra.toFixed(0)} weeks of extra work, and angry users.`
              : s.every === 2 && !s.automated
                ? "Surprises are found within weeks, but releasing by hand every fortnight eats most of the saving. Short loops need cheap releases."
                : s.every === 2
                  ? "Surprises are found within weeks and releases are cheap: the least extra work of any option."
                  : `Surprises are found sooner, so they cost less to fix: ${extra.toFixed(0)} extra weeks in all.`}
          </p>
          <p className="text-subtle text-[10px]">
            Illustrative model: each surprise shows up two weeks after users can first use the
            feature; fixing it costs one week plus a little more for every week the mistake sat in
            the product. The shape (later usually costs more) is well supported; the exact numbers
            aren&apos;t.
          </p>
        </div>
      }
    >
      <p>
        The portal again: six features over a year, each hiding a surprise that only real users will
        reveal, and only once they can use it.
      </p>
      <p>
        Choose how often users get a working version. Watch when each surprise is found, and what it
        costs by then.
      </p>
      <p className="text-muted text-sm">
        Try every two weeks, then tick automated testing and deployment. Short loops pay off when
        releasing is cheap: that&apos;s why the engineering chapter matters.
      </p>
    </StepLayout>
  );
}

/* 3 ─ Real cases (step-through) --------------------------------------------------------------------- */

const CASES = [
  {
    kicker: "USA, 2000–2005",
    title: "The FBI's Virtual Case File",
    text: "Planned to replace the FBI's old case system in one go, a “flash cutover”, the project churned as requirements kept changing; reporters likened the engineers to “a construction crew working from a set of constantly changing blueprints”. It was abandoned in 2005 after about $170 million.",
    after:
      "Its successor, Sentinel, was brought in-house and switched to agile, short-cycle development in 2010, and was deployed in July 2012.",
    tone: "bad",
  },
  {
    kicker: "USA, October 2013",
    title: "HealthCare.gov",
    text: "The US health-insurance site launched to the whole country on a fixed date. The system had never been tested end to end; an official described “the launch itself” as the test. Outages began within two hours.",
    after:
      "Its main contractor nominally used an agile method, so this isn't a “waterfall” story. It's about a single, all-at-once launch with no real feedback before it.",
    tone: "bad",
  },
  {
    kicker: "India, July 2017",
    title: "The GST network",
    text: "GST went live nationwide on 1 July 2017. The planned return system, matching every buyer's and seller's invoices, proved too complex and was put on hold for a simpler stop-gap return.",
    after:
      "India's national auditor (CAG) later found failures in “not just system design but its testing… before a pan-India roll out”.",
    tone: "bad",
  },
  {
    kicker: "India, 2016",
    title: "UPI: pilot first",
    text: "The Unified Payments Interface was piloted with 21 banks in April 2016, before its public launch in August 2016.",
    after:
      "A pilot is a feedback loop at national scale: real users find the surprises while they're still cheap to fix.",
    tone: "good",
  },
] as const;

export function RealCases() {
  const [s, set] = useSceneState<PlansState>();
  const f = Math.min(s.frame, CASES.length - 1);
  const c = CASES[f];
  return (
    <StepLayout
      eyebrow="Step through"
      title="When big launches go wrong"
      stage={
        <div className="flex flex-1 flex-col gap-3">
          <motion.div
            key={f}
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            className={cn(
              "rounded-xl border p-4",
              c.tone === "good" ? "border-good/40 bg-good/5" : "border-bad/30 bg-bad/5",
            )}
          >
            <p className="text-muted font-mono text-[11px]">{c.kicker}</p>
            <p className="mt-1 text-lg font-semibold">{c.title}</p>
            <p className="mt-2 text-sm">{c.text}</p>
          </motion.div>
          <Stepper step={f} count={CASES.length} onChange={(n) => set({ frame: n })} />
          <FrameCaption frameKey={f} title="What it teaches">
            {c.after}
          </FrameCaption>
        </div>
      }
    >
      <p>
        Big public systems show the cost of learning late most clearly. Three launches that hit
        trouble, and one that tested small first.
      </p>
      <p className="text-muted text-sm">
        Be careful with blame: real failures have many causes. The common thread here is a{" "}
        <Term id="big-bang-release">big-bang release</Term>, not any one method&apos;s name.
      </p>
    </StepLayout>
  );
}

/* 4 ─ Checkpoint: plan up front, or in loops? ------------------------------------------------------- */

export function PickApproach() {
  return (
    <StepLayout
      eyebrow="Checkpoint"
      title="Plan up front, or in loops?"
      stage={
        <div className="flex flex-1 flex-col justify-center">
          <SortCheckpoint
            id="plan-or-loop"
            prompt="Which approach suits each piece of work best?"
            categories={[
              { id: "plan", label: "Plan it all first" },
              { id: "loop", label: "Short loops" },
            ]}
            items={[
              {
                id: "fibre",
                label: "Laying fibre cable along an agreed, surveyed route",
                category: "plan",
                why: "The route and method are known and won't change much: a detailed plan works.",
              },
              {
                id: "app",
                label: "A new app that farmers have never used before",
                category: "loop",
                why: "Nobody knows yet how farmers will use it. Get something real in their hands early.",
              },
              {
                id: "upgrade",
                label: "Upgrading servers using the vendor's documented steps",
                category: "plan",
                why: "Well-understood, repeatable work: follow a plan (and a checklist).",
              },
              {
                id: "chatbot",
                label: "A helpline chatbot for citizens in three languages",
                category: "loop",
                why: "What people ask, and how, only becomes clear once they start asking.",
              },
              {
                id: "form",
                label: "Redesigning a form that users keep abandoning",
                category: "loop",
                why: "You're hunting for what confuses people: try, watch, adjust.",
              },
            ]}
          />
        </div>
      }
    >
      <p>
        The question isn&apos;t &ldquo;agile or not&rdquo;. It&apos;s how well you can know the
        requirements before anyone uses the result.
      </p>
    </StepLayout>
  );
}

/* 5 ─ Checkpoint: the risky plan -------------------------------------------------------------------- */

export function RiskyPlan() {
  return (
    <StepLayout
      eyebrow="Checkpoint"
      title="A fixed 18-month plan"
      stage={
        <div className="flex flex-1 flex-col justify-center">
          <ChoiceCheckpoint
            id="risky-plan"
            prompt="A department wants a new certificates portal, specified in full now and launched statewide in 18 months. What most reduces the risk of a painful launch?"
            options={[
              {
                id: "pilot",
                label:
                  "Put a thin working version in front of real users in one district within weeks, and grow it in short cycles from what they find",
                correct: true,
                feedback:
                  "Yes. Real use is the only way to surface the needs nobody wrote down, and a pilot finds them while they're cheap.",
              },
              {
                id: "spec",
                label: "Spend longer on the specification so nothing is missed",
                feedback:
                  "More writing can't reveal needs that only appear once people use the system.",
              },
              {
                id: "test",
                label: "Add a big testing phase just before launch",
                feedback:
                  "Testing late helps, but it checks the system against the spec, not against what users actually need.",
              },
              {
                id: "people",
                label: "Add more developers so it's finished sooner",
                feedback:
                  "Finishing sooner doesn't help if what's finished is the wrong thing. It shortens the wait but not the loop.",
              },
            ]}
            explanation="You can still keep a plan, a budget and a launch date. Just stop betting everything on a single moment of truth at the end."
          />
        </div>
      }
    >
      <p>
        Many real projects start exactly like this. You don&apos;t have to throw out the plan to
        make it safer.
      </p>
    </StepLayout>
  );
}

/* 6 ─ Wrap ------------------------------------------------------------------------------------------- */

const TAKEAWAYS: [string, string][] = [
  [
    "Needs appear with use",
    "For new software, requirements aren't fully known until people use it.",
  ],
  ["Late learning costs more", "The later a mistake is found, the more it usually costs to undo."],
  [
    "Shorten the loop",
    "Put working slices in real hands early and often; adjust from what you see.",
  ],
  [
    "Plans still matter",
    "Detailed up-front plans suit stable, well-understood work. Choose by the work.",
  ],
];

export function Wrap() {
  return (
    <StepLayout
      eyebrow="Wrap-up"
      title="What to remember"
      stage={
        <div className="grid flex-1 content-center gap-3 sm:grid-cols-2">
          {TAKEAWAYS.map(([t, d], i) => (
            <motion.div
              key={t}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.06 * i }}
              className="border-line bg-surface rounded-xl border px-4 py-3"
            >
              <p className="font-semibold">{t}</p>
              <p className="text-muted mt-1 text-sm">{d}</p>
            </motion.div>
          ))}
        </div>
      }
    >
      <p>
        Iterative development is older than the word &ldquo;agile&rdquo;. In 2001, seventeen
        practitioners wrote down what they&apos;d learned from it.
      </p>
      <p>Next: the Agile Manifesto, read properly.</p>
    </StepLayout>
  );
}
