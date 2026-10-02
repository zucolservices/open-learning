"use client";

import { motion } from "motion/react";
import { ScrollStory, type StorySection } from "@/toolkit/layout/scroll-story";
import { Term } from "@/toolkit/glossary/term";
import { cn } from "@/lib/cn";

/* Scene ------------------------------------------------------------------------------------------ */

const DEVS = ["Asha", "Ben", "Chen", "Divya", "Eli", "Farah"];
/** Changes on each branch by March: 260 in all. */
const COUNTS = [38, 41, 44, 45, 46, 46];

/** Six long branches drifting away from main, then a tangle at merge time. */
function Branches({ merged }: { merged: boolean }) {
  return (
    <svg viewBox="0 0 320 200" className="w-full" fill="none" strokeLinecap="round">
      <path d="M10 100h300" className="stroke-fg" strokeWidth={2} />
      <text x={286} y={112} className="fill-muted font-mono text-[8px]">
        main
      </text>
      {DEVS.map((d, i) => {
        const up = i % 2 === 0;
        const off = (Math.floor(i / 2) + 1) * 24 * (up ? -1 : 1);
        const y = 100 + off;
        const path = merged
          ? `M24 100C44 ${y} 60 ${y} 80 ${y}H230C256 ${y} 262 100 280 100`
          : `M24 100C44 ${y} 60 ${y} 80 ${y}H${200 + i * 6}`;
        return (
          <g key={d}>
            <motion.path
              d={path}
              className={merged ? "stroke-bad" : "stroke-viz-data"}
              strokeWidth={1.4}
              initial={{ pathLength: 0 }}
              animate={{ pathLength: 1 }}
              transition={{ duration: 1, delay: 0.1 * i }}
            />
            <text x={84} y={y - 3} className="fill-muted font-mono text-[7px]">
              {d} · {COUNTS[i]} changes
            </text>
          </g>
        );
      })}
      {merged && (
        <motion.g initial={{ opacity: 0, scale: 0.6 }} animate={{ opacity: 1, scale: 1 }}>
          <circle cx={280} cy={100} r={14} className="fill-bad/20 stroke-bad" />
          <text
            x={280}
            y={103}
            textAnchor="middle"
            className="fill-bad font-mono text-[9px] font-semibold"
          >
            ✕
          </text>
          <text x={250} y={180} textAnchor="middle" className="fill-bad font-mono text-[8px]">
            40 conflicts · 312 tests failing
          </text>
        </motion.g>
      )}
    </svg>
  );
}

const CHECKLIST = [
  "Freeze code Friday 6 p.m.",
  "Build on Priya's laptop",
  "Copy files to 8 servers",
  "Run database script by hand",
  "Restart services in order",
  "Smoke-test by clicking around",
];

function Checklist() {
  return (
    <div className="flex h-full flex-col justify-center gap-1.5">
      {CHECKLIST.map((c, i) => (
        <motion.div
          key={c}
          initial={{ opacity: 0, x: -8 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.12 * i }}
          className={cn(
            "flex items-center gap-2 rounded-lg border px-3 py-1.5 text-xs",
            i === 2 ? "border-bad/60 bg-bad/10" : "border-line bg-surface",
          )}
        >
          <span className="font-mono text-[10px]">{i === 2 ? "7/8" : "✓"}</span>
          {c}
        </motion.div>
      ))}
      <p className="text-muted mt-1 text-center font-mono text-[10px]">
        one server missed, nobody notices until Monday
      </p>
    </div>
  );
}

/** Many small changes flowing into main, each checked. */
function Flow({ deploy }: { deploy: boolean }) {
  return (
    <div className="flex h-full flex-col justify-center gap-3">
      <div className="grid grid-cols-12 gap-1">
        {Array.from({ length: 36 }, (_, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: -6 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.03 * i }}
            className={cn(
              "flex h-6 items-center justify-center rounded border font-mono text-[8px]",
              i === 22 ? "border-bad/60 bg-bad/10 text-bad" : "border-good/50 bg-good/10 text-good",
            )}
          >
            {i === 22 ? "✕" : "✓"}
          </motion.div>
        ))}
      </div>
      <p className="text-muted text-center font-mono text-[10px]">
        {deploy
          ? "each green change goes on to users · the red one never leaves"
          : "every change built and tested within minutes · one fails, its author fixes it"}
      </p>
      {deploy && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="flex flex-wrap items-center justify-center gap-1 font-mono text-[9px] sm:text-[10px]"
        >
          {["commit", "build", "test", "staging", "production"].map((s, i) => (
            <span key={s} className="flex items-center gap-1">
              {i > 0 && <span className="text-muted">→</span>}
              <span className="border-accent/60 bg-accent-soft rounded border px-1.5 py-0.5">
                {s}
              </span>
            </span>
          ))}
        </motion.div>
      )}
    </div>
  );
}

function Scene({ index }: { index: number }) {
  if (index === 0) return <Branches merged={false} />;
  if (index === 1) return <Branches merged />;
  if (index === 2) return <Checklist />;
  return <Flow deploy={index === 4} />;
}

/* Story ------------------------------------------------------------------------------------------ */

const SECTIONS: StorySection[] = [
  {
    id: "quarter",
    kicker: "January",
    title: "Everyone in their own corner",
    body: (
      <>
        <p>
          Six developers start the quarter on a shop&apos;s checkout. Each takes a feature and works
          on a private copy of the code, a <Term id="branch">branch</Term>, so nobody gets in anyone
          else&apos;s way.
        </p>
        <p>
          It feels productive. Every branch builds on its owner&apos;s laptop. The plan is to join
          everything up at the end of March and release it in one go.
        </p>
      </>
    ),
  },
  {
    id: "merge",
    kicker: "Late March",
    title: "Merge week",
    body: (
      <>
        <p>
          Joining six branches that drifted apart for three months is miserable. Two people renamed
          the same function. Three changed the checkout total in different ways. Hundreds of tests
          fail, and nobody knows which of 260 changes broke what.
        </p>
        <p>
          Teams call this integration hell. The longer work stays apart, the more it costs to put it
          back together, and the cost grows faster than the time.
        </p>
      </>
    ),
  },
  {
    id: "release",
    kicker: "Release night",
    title: "A checklist and crossed fingers",
    body: (
      <>
        <p>
          Then a release by hand: freeze the code, build on someone&apos;s laptop, copy files to
          eight servers, run a database script, click around to check. Step three misses one server.
        </p>
        <p>
          Something like it happened at Knight Capital in 2012. New trading code was copied to eight
          servers over several days, with nobody checking the work. One server was missed, and on 1
          August its old code sprang back to life. In about 45 minutes the firm lost &ldquo;more
          than $460 million&rdquo;, the US SEC found.
        </p>
      </>
    ),
  },
  {
    id: "ci",
    kicker: "Small and often",
    title: "Integrate every day",
    body: (
      <>
        <p>
          <Term id="continuous-integration">Continuous integration</Term> turns this around. In
          Martin Fowler&apos;s words, each developer &ldquo;merges their changes into a codebase
          together with their colleagues changes at least daily&rdquo;, and an automated build and
          test checks every one.
        </p>
        <p>
          When something breaks, it&apos;s one small change from one person, made an hour ago. They
          still remember what they did, so the fix takes minutes, not a week.
        </p>
      </>
    ),
  },
  {
    id: "cd",
    kicker: "To users",
    title: "Release whenever you like",
    body: (
      <>
        <p>
          <Term id="continuous-delivery">Continuous delivery</Term> carries the same idea all the
          way: every change that passes is ready to release at the press of a button.{" "}
          <Term id="continuous-deployment">Continuous deployment</Term> presses the button for you.
          The machinery that does it is a <Term id="pipeline">pipeline</Term>.
        </p>
        <p>
          It isn&apos;t only for giants. In 2009 Flickr told a conference it deployed more than ten
          times a day; today, small teams routinely release several times a day.
        </p>
      </>
    ),
  },
];

export function ReleaseWeekend() {
  return (
    <ScrollStory
      sections={SECTIONS}
      persistent
      renderScene={(i) => <Scene index={i} />}
      intro={
        <div>
          <p className="text-accent text-xs font-medium tracking-wide uppercase">Scroll story</p>
          <h2 className="mt-2 text-2xl font-semibold tracking-tight sm:text-3xl">
            The release weekend
          </h2>
          <p className="text-muted mt-3 text-[15px]">
            A quarter of work, joined up and shipped in one go. What could go wrong?
          </p>
        </div>
      }
    />
  );
}
