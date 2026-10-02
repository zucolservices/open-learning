"use client";

import { motion } from "motion/react";
import { ScrollStory, type StorySection } from "@/toolkit/layout/scroll-story";
import { Term } from "@/toolkit/glossary/term";
import { cn } from "@/lib/cn";

/* Scene ------------------------------------------------------------------------------------------ */

/** A CPU line that stays calm (and even dips) while customers fail. */
function CpuGraph({ dip }: { dip: boolean }) {
  const pts = Array.from({ length: 40 }, (_, i) => {
    const base = 38 + Math.sin(i / 3) * 3;
    const v = dip && i > 22 ? base - 14 : base;
    return `${10 + i * 7.5},${110 - v}`;
  }).join(" ");
  return (
    <svg viewBox="0 0 320 130" className="w-full" fill="none">
      <text x={10} y={14} className="fill-muted font-mono text-[8px]">
        CPU, all servers
      </text>
      <path d="M10 110H310" className="stroke-line" />
      <path d="M10 30H310" className="stroke-bad/40" strokeDasharray="3 3" />
      <text x={262} y={26} className="fill-bad font-mono text-[7px]">
        alert at 90%
      </text>
      <motion.polyline
        points={pts}
        className="stroke-viz-compute"
        strokeWidth={2}
        initial={{ pathLength: 0 }}
        animate={{ pathLength: 1 }}
        transition={{ duration: 1.2 }}
      />
      {dip && (
        <text x={190} y={122} className="fill-viz-compute font-mono text-[8px]">
          CPU drops while customers fail
        </text>
      )}
    </svg>
  );
}

const QUESTIONS = ["Which customers?", "Which bank?", "Which app version?", "Which step is slow?"];

function Questions() {
  return (
    <div className="flex h-full flex-col justify-center gap-2">
      {QUESTIONS.map((q, i) => (
        <motion.div
          key={q}
          initial={{ opacity: 0, x: -8 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.15 * i }}
          className="border-line bg-surface flex items-center justify-between rounded-lg border px-3 py-2 text-sm"
        >
          {q}
          <span className="text-bad font-mono text-xs">no data</span>
        </motion.div>
      ))}
    </div>
  );
}

const ANSWERS: [string, string, string][] = [
  ["metric", "Errors by bank", "Bank C: 34% · others < 1%"],
  ["trace", "A failing request", "bank-gateway span: 30 s, timed out"],
  ["log", "The gateway's log line", "TLS handshake failed: certificate expired"],
];

function Answers() {
  return (
    <div className="flex h-full flex-col justify-center gap-2">
      {ANSWERS.map(([k, t, d], i) => (
        <motion.div
          key={t}
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.25 * i }}
          className={cn(
            "rounded-lg border px-3 py-2",
            i === 2 ? "border-good/50 bg-good/10" : "border-accent/50 bg-accent-soft",
          )}
        >
          <p className="text-muted font-mono text-[10px]">{k}</p>
          <p className="text-sm font-semibold">{t}</p>
          <p className="font-mono text-xs">{d}</p>
        </motion.div>
      ))}
      <p className="text-muted text-center font-mono text-[10px]">
        from page to cause in 12 minutes
      </p>
    </div>
  );
}

const TIMELINE: [string, string][] = [
  ["1960", "Rudolf Kálmán defines observability in control theory"],
  ["2016", "Honeycomb borrows the term for software"],
  ["2019", "OpenTracing and OpenCensus merge into OpenTelemetry"],
  ["2022", "Observability Engineering (Majors, Fong-Jones, Miranda)"],
];

function Scene({ index }: { index: number }) {
  if (index === 0) return <CpuGraph dip={false} />;
  if (index === 1) return <CpuGraph dip />;
  if (index === 2) return <Questions />;
  if (index === 3) return <Answers />;
  return (
    <div className="flex h-full flex-col justify-center gap-1.5">
      {TIMELINE.map(([y, t], i) => (
        <motion.div
          key={y}
          initial={{ opacity: 0, x: -8 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.08 * i }}
          className="grid grid-cols-[3.5rem_1fr] items-center gap-2 text-xs"
        >
          <span className="text-accent font-mono">{y}</span>
          <span className="border-line bg-surface rounded border px-2 py-1">{t}</span>
        </motion.div>
      ))}
    </div>
  );
}

/* Story ------------------------------------------------------------------------------------------ */

const SECTIONS: StorySection[] = [
  {
    id: "page",
    kicker: "3:02 a.m.",
    title: "The phone rings",
    body: (
      <>
        <p>
          You&apos;re on call for a payments app. The alert says checkout errors are up. You open
          the dashboard: CPU, memory and disk for every server. All of it looks normal.
        </p>
        <p>
          The graphs answer the questions someone thought of when they built them: is a server
          overloaded, is a disk full? Tonight&apos;s problem isn&apos;t one of those.
        </p>
      </>
    ),
  },
  {
    id: "guess",
    kicker: "3:25 a.m.",
    title: "Guessing",
    body: (
      <>
        <p>
          You restart a few servers. You add capacity. Nothing changes. If anything, CPU goes{" "}
          <em>down</em>: requests are stuck waiting on something, so the servers have less to do.
        </p>
        <p>
          That happened for real at Slack on 4 January 2021. Waiting threads made CPU use drop,
          which triggered automatic downscaling in the middle of the outage, and the dashboards
          themselves went down while the team investigated.
        </p>
      </>
    ),
  },
  {
    id: "questions",
    kicker: "4:10 a.m.",
    title: "Questions nobody predicted",
    body: (
      <>
        <p>
          What you need to know is new: which customers are failing, through which bank, on which
          app version, at which step? None of that was collected, so none of it can be asked.
        </p>
        <p>
          <Term id="monitoring">Monitoring</Term> watches for problems you predicted. The hard
          incidents are the ones nobody predicted.
        </p>
      </>
    ),
  },
  {
    id: "again",
    kicker: "Rewind",
    title: "The same night, with observability",
    body: (
      <>
        <p>
          This time every request is recorded with its details. Errors broken down by bank point at
          Bank C straight away. One failing request&apos;s <Term id="trace">trace</Term> shows a
          30-second timeout calling that bank&apos;s gateway; the gateway&apos;s{" "}
          <Term id="log">log</Term> says a certificate expired.
        </p>
        <p>
          Same system, same bug. The difference is <Term id="telemetry">telemetry</Term> rich enough
          to answer questions you think of in the moment.
        </p>
      </>
    ),
  },
  {
    id: "word",
    kicker: "The word",
    title: "Where 'observability' comes from",
    body: (
      <>
        <p>
          The engineer Rudolf Kálmán coined it in 1960 for control systems: can you work out
          what&apos;s going on inside just by watching what comes out? Honeycomb borrowed it for
          software in 2016.
        </p>
        <p>
          <em>Observability Engineering</em> (2022) gives the test: &ldquo;If you can understand any
          bizarre or novel state without needing to ship new code, you have observability.&rdquo;
        </p>
      </>
    ),
  },
];

export function ThreeAm() {
  return (
    <ScrollStory
      sections={SECTIONS}
      persistent
      renderScene={(i) => <Scene index={i} />}
      intro={
        <div>
          <p className="text-accent text-xs font-medium tracking-wide uppercase">Scroll story</p>
          <h2 className="mt-2 text-2xl font-semibold tracking-tight sm:text-3xl">3 a.m.</h2>
          <p className="text-muted mt-3 text-[15px]">
            Checkout is failing, and every graph says everything is fine.
          </p>
        </div>
      }
    />
  );
}
