"use client";

import { motion } from "motion/react";
import { ScrollStory, type StorySection } from "@/toolkit/layout/scroll-story";
import { Term } from "@/toolkit/glossary/term";
import { cn } from "@/lib/cn";
import { FEATURES } from "./model";

/* 1 ─ Two buildings, two plans ⭐ ------------------------------------------------------------------ */

const SECTIONS: StorySection[] = [
  {
    id: "hall",
    kicker: "The hall",
    title: "A wedding hall, built to a drawing",
    body: (
      <>
        <p>
          A family wants a wedding hall. An architect draws it, the family signs off, and a builder
          follows the drawing: foundations, walls, roof, paint.
        </p>
        <p>
          It works because everyone already knows what a hall is, and the drawing hardly changes
          once the foundations are poured. Planning everything first is the right call.
        </p>
      </>
    ),
  },
  {
    id: "portal",
    kicker: "The portal",
    title: "A citizen portal, built the same way",
    body: (
      <>
        <p>
          Now the state wants a portal where citizens apply for certificates online. The team plans
          it like the hall: six months writing down every requirement, twelve months building, then
          launch.
        </p>
        <p>
          This is a <Term id="plan-driven">plan-driven</Term> approach, often called
          &ldquo;waterfall&rdquo;: each phase finishes before the next begins, and users see the
          result only at the end.
        </p>
      </>
    ),
  },
  {
    id: "launch",
    kicker: "Launch",
    title: "Month 18: people finally use it",
    body: (
      <>
        <p>
          On launch day, real people arrive, and needs nobody wrote down appear at once. The OTP
          goes to a family&apos;s one shared phone. Most people apply on a phone, not a desktop.
          Many want Kannada.
        </p>
        <p>
          None of this was carelessness. As Watts Humphrey put it: &ldquo;For a new software system,
          the requirements will not be completely known until after the users have used it.&rdquo;
        </p>
      </>
    ),
  },
  {
    id: "cost",
    kicker: "Cost",
    title: "Learning late is expensive",
    body: (
      <>
        <p>
          Each surprise now means undoing work that other work was built on. The later you find out,
          the more it usually costs to fix.
        </p>
        <p>
          How much more depends on the project. Barry Boehm, who measured it, found fixes after
          delivery could be around 100 times dearer on large systems, but &ldquo;more like
          5:1&rdquo; on small ones. The direction is reliable; the multiplier isn&apos;t a law.
        </p>
      </>
    ),
  },
  {
    id: "loops",
    kicker: "Loops",
    title: "Show something real, early and often",
    body: (
      <>
        <p>
          The alternative: build a thin, working slice, put it in front of real users within weeks,
          learn, adjust, repeat. Surprises still come, but while they&apos;re cheap.
        </p>
        <p>
          That&apos;s <Term id="iterative-development">iterative development</Term>, run in short{" "}
          <Term id="feedback-loop">feedback loops</Term>. The Agile Manifesto asks teams to
          &ldquo;deliver working software frequently, from a couple of weeks to a couple of months,
          with a preference to the shorter timescale.&rdquo;
        </p>
      </>
    ),
  },
  {
    id: "old",
    kicker: "History",
    title: "Not a new idea",
    body: (
      <>
        <p>
          NASA&apos;s Project Mercury used half-day, time-boxed iterations in the early 1960s. In
          1970 Winston Royce sketched the one-pass sequence and warned that, done that way, it
          &ldquo;is risky and invites failure&rdquo;. He never called it &ldquo;waterfall&rdquo;;
          others named it later.
        </p>
        <p>
          In 2001 the Agile Manifesto gave these older ideas a shared name. That&apos;s the next
          module.
        </p>
      </>
    ),
  },
  {
    id: "fit",
    kicker: "Fit",
    title: "Plans aren't the enemy",
    body: (
      <>
        <p>
          Plan-driven work is right when requirements &ldquo;can be defined, collected, and analyzed
          at the start&rdquo;, as project-management guidance from PMI puts it. The hall qualifies.
        </p>
        <p>
          New software for thousands of people usually doesn&apos;t. So you still plan, but in short
          loops, so that what you learn changes the plan.
        </p>
      </>
    ),
  },
];

/** A labelled bar on the portal timeline (months 0–18). */
function Phase({ from, to, label, cls }: { from: number; to: number; label: string; cls: string }) {
  const x = 20 + (from / 18) * 280;
  const w = ((to - from) / 18) * 280;
  return (
    <g>
      <rect x={x} y={60} width={w} height={26} rx={5} className={cls} />
      <text x={x + w / 2} y={77} textAnchor="middle" className="fill-fg text-[9px] font-medium">
        {label}
      </text>
    </g>
  );
}

function Timeline({ loops }: { loops?: boolean }) {
  return (
    <svg viewBox="0 0 320 200" className="h-full w-full" role="img" aria-label="Project timeline">
      <line x1={20} y1={100} x2={300} y2={100} className="stroke-line-strong" />
      {[0, 6, 12, 18].map((m) => (
        <text
          key={m}
          x={20 + (m / 18) * 280}
          y={114}
          textAnchor="middle"
          className="fill-muted text-[8px]"
        >
          month {m}
        </text>
      ))}
      {loops ? (
        Array.from({ length: 9 }, (_, i) => {
          const x = 20 + ((i * 2 + 1) / 18) * 280;
          return (
            <motion.g
              key={i}
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.15 * i }}
            >
              <circle
                cx={x}
                cy={73}
                r={11}
                className="stroke-accent"
                fill="none"
                strokeWidth={1.5}
              />
              <path
                d={`M${x + 8} ${66}l3 -3 1 5`}
                className="stroke-accent"
                fill="none"
                strokeWidth={1.2}
              />
              <rect x={x - 5} y={128} width={10} height={10} rx={2} className="fill-good/70" />
              {i < 6 && (
                <rect
                  x={x - 5}
                  y={144}
                  width={10}
                  height={10}
                  rx={2}
                  className="fill-viz-compute/60"
                />
              )}
            </motion.g>
          );
        })
      ) : (
        <>
          <Phase
            from={0}
            to={6}
            label="Write requirements"
            cls="fill-viz-meta/30 stroke-viz-meta"
          />
          <Phase from={6} to={18} label="Build" cls="fill-viz-compute/30 stroke-viz-compute" />
          <path d="M300 60v-24l14 6-14 6" className="fill-accent stroke-accent" />
          <text x={296} y={32} textAnchor="end" className="fill-fg text-[9px] font-semibold">
            Launch
          </text>
        </>
      )}
    </svg>
  );
}

function Scene({ stage }: { stage: number }) {
  if (stage === 0)
    return (
      <svg viewBox="0 0 320 200" className="h-full w-full" role="img" aria-label="A hall drawing">
        <g className="stroke-viz-meta" strokeWidth={1}>
          {Array.from({ length: 9 }, (_, i) => (
            <line key={`v${i}`} x1={40 + i * 30} y1={40} x2={40 + i * 30} y2={170} opacity={0.25} />
          ))}
          {Array.from({ length: 5 }, (_, i) => (
            <line key={`h${i}`} x1={40} y1={40 + i * 32} x2={280} y2={40 + i * 32} opacity={0.25} />
          ))}
        </g>
        <motion.path
          d="M70 160V95l90-45 90 45v65z M140 160v-38h40v38"
          fill="none"
          className="stroke-accent"
          strokeWidth={2.5}
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ duration: 1.6 }}
        />
        <text x={160} y={188} textAnchor="middle" className="fill-muted text-[9px]">
          The drawing is known and stable
        </text>
      </svg>
    );
  if (stage === 1) return <Timeline />;
  if (stage === 2)
    return (
      <div className="flex h-full flex-col">
        <div className="h-1/2">
          <Timeline />
        </div>
        <div className="grid flex-1 grid-cols-2 content-start gap-1.5">
          {FEATURES.slice(0, 4).map((f, i) => (
            <motion.div
              key={f.id}
              initial={{ opacity: 0, scale: 0.8, rotate: -3 }}
              animate={{ opacity: 1, scale: 1, rotate: i % 2 ? 2 : -2 }}
              transition={{ delay: 0.3 + i * 0.25 }}
              className="border-bad/40 bg-bad/10 rounded-lg border px-2 py-1.5 text-[11px] leading-snug"
            >
              {f.surprise}
            </motion.div>
          ))}
        </div>
      </div>
    );
  if (stage === 3)
    return (
      <svg viewBox="0 0 320 200" className="h-full w-full" role="img" aria-label="Cost of change">
        <line x1={40} y1={170} x2={300} y2={170} className="stroke-line-strong" />
        <line x1={40} y1={170} x2={40} y2={30} className="stroke-line-strong" />
        <motion.path
          d="M40 160 C140 155 220 120 300 40"
          fill="none"
          className="stroke-bad"
          strokeWidth={2.5}
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ duration: 1.2 }}
        />
        <text x={40} y={186} className="fill-muted text-[9px]">
          found early
        </text>
        <text x={300} y={186} textAnchor="end" className="fill-muted text-[9px]">
          found late
        </text>
        <text
          x={30}
          y={100}
          textAnchor="middle"
          transform="rotate(-90 30 100)"
          className="fill-muted text-[9px]"
        >
          cost to fix
        </text>
        <text x={292} y={62} textAnchor="end" className="fill-muted text-[8px]">
          how steep depends on the project
        </text>
      </svg>
    );
  if (stage === 4)
    return (
      <div className="flex h-full flex-col">
        <div className="min-h-0 flex-1">
          <Timeline loops />
        </div>
        <div className="text-muted flex flex-wrap justify-center gap-4 text-xs">
          <span className="flex items-center gap-1.5">
            <span className="bg-good/70 size-3 rounded-sm" /> a working slice in users&apos; hands
          </span>
          <span className="flex items-center gap-1.5">
            <span className="bg-viz-compute/60 size-3 rounded-sm" /> a surprise, found early
          </span>
        </div>
      </div>
    );
  if (stage === 5)
    return (
      <svg viewBox="0 0 320 200" className="h-full w-full" role="img" aria-label="History">
        <line x1={30} y1={100} x2={290} y2={100} className="stroke-line-strong" />
        {(
          [
            [72, "early 1960s", "Mercury: half-day iterations"],
            [132, "1970", "Royce: one pass is risky"],
            [200, "by 1976", "“waterfall” in print"],
            [268, "2001", "Agile Manifesto"],
          ] as const
        ).map(([x, y, t], i) => (
          <motion.g
            key={y}
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 * i }}
          >
            <circle cx={x} cy={100} r={5} className={i === 3 ? "fill-accent" : "fill-viz-meta"} />
            <text
              x={x}
              y={i % 2 ? 128 : 80}
              textAnchor="middle"
              className="fill-fg font-mono text-[9px]"
            >
              {y}
            </text>
            <text x={x} y={i % 2 ? 142 : 66} textAnchor="middle" className="fill-muted text-[8px]">
              {t}
            </text>
          </motion.g>
        ))}
      </svg>
    );
  return (
    <div className="grid h-full grid-cols-2 content-center gap-3">
      {[
        ["Wedding hall", "Known, stable requirements", "Plan it all first", "good"],
        ["Citizen portal", "Needs emerge as people use it", "Plan in short loops", "accent"],
      ].map(([t, k, a, c]) => (
        <div key={t} className="border-line bg-surface rounded-xl border p-3 text-center">
          <p className="text-sm font-semibold">{t}</p>
          <p className="text-muted mt-1 text-xs">{k}</p>
          <p className={cn("mt-2 text-xs font-medium", c === "good" ? "text-good" : "text-accent")}>
            → {a}
          </p>
        </div>
      ))}
    </div>
  );
}

export function TwoBuilds() {
  return (
    <ScrollStory
      sections={SECTIONS}
      renderScene={(i) => <Scene stage={i} />}
      intro={
        <div>
          <p className="text-accent text-xs font-medium tracking-wide uppercase">Scroll story</p>
          <h2 className="mt-2 text-2xl font-semibold tracking-tight sm:text-3xl">
            Two buildings, two plans
          </h2>
          <p className="text-muted mt-3 text-[15px]">
            Why the way you&apos;d build a hall doesn&apos;t work for most software, and what works
            instead.
          </p>
        </div>
      }
    />
  );
}
