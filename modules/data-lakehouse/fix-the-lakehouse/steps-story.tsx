"use client";

import { motion } from "motion/react";
import { ScrollStory, type StorySection } from "@/toolkit/layout/scroll-story";
import { cn } from "@/lib/cn";

/* 1 ─ Six months later ⭐ ------------------------------------------------------------------------- */

const MONTHS = ["Apr", "May", "Jun", "Jul", "Aug", "Sep"];
const QUERY_S = [4, 9, 21, 38, 61, 92];
const BILL_K = [5.8, 7.1, 9.4, 12.2, 14.9, 17.5];

function Chart({
  values,
  max,
  label,
  unit,
  upto,
  tone,
}: {
  values: number[];
  max: number;
  label: string;
  unit: string;
  upto: number;
  tone: string;
}) {
  return (
    <div className="border-line bg-surface rounded-xl border p-3">
      <p className="text-muted text-[11px]">{label}</p>
      <div className="mt-2 flex h-24 items-end gap-2">
        {values.map((v, i) => (
          <div key={i} className="flex h-full flex-1 flex-col items-center justify-end">
            <motion.span
              initial={false}
              animate={{ opacity: i <= upto ? 1 : 0 }}
              className="text-muted mb-0.5 font-mono text-[9px]"
            >
              {v}
              {unit}
            </motion.span>
            <motion.div
              initial={false}
              animate={{ height: i <= upto ? `${(v / max) * 100}%` : "0%" }}
              transition={{ type: "spring", stiffness: 120, damping: 18 }}
              className={cn("w-full rounded-t", tone)}
            />
          </div>
        ))}
      </div>
      <div className="mt-1 flex gap-2">
        {MONTHS.map((m) => (
          <span key={m} className="text-subtle flex-1 text-center text-[9px]">
            {m}
          </span>
        ))}
      </div>
    </div>
  );
}

const UPTO = [0, 2, 5, 5, 5];

function Scene({ stage }: { stage: number }) {
  return (
    <div className="flex h-full flex-col justify-center gap-3">
      <Chart
        values={QUERY_S}
        max={100}
        label="Branch dashboard load time"
        unit="s"
        upto={UPTO[stage]}
        tone="bg-bad/70"
      />
      <Chart
        values={BILL_K}
        max={20}
        label="Monthly bill ($ thousand)"
        unit="k"
        upto={UPTO[stage]}
        tone="bg-viz-compute/70"
      />
      <motion.div
        initial={false}
        animate={{ opacity: stage >= 3 ? 1 : 0, y: stage >= 3 ? 0 : 6 }}
        className="border-bad/40 bg-bad/10 rounded-xl border px-3 py-2 text-xs"
      >
        Finance: &ldquo;Revenue on the dashboard is 3% higher than in the accounts.&rdquo;
      </motion.div>
    </div>
  );
}

const SECTIONS: StorySection[] = [
  {
    id: "launch",
    kicker: "April",
    title: "A good launch",
    body: (
      <p>
        Brewline&apos;s lakehouse went live in April. Dashboards loaded in four seconds, and the
        bill was about $6,000 a month. Everyone was pleased.
      </p>
    ),
  },
  {
    id: "creep",
    kicker: "June",
    title: "It gets slower",
    body: (
      <p>
        By June, dashboards take twenty seconds. Nobody changed the queries. Data grew, but not that
        much.
      </p>
    ),
  },
  {
    id: "now",
    kicker: "September",
    title: "Ninety seconds, and triple the bill",
    body: (
      <p>
        Now branch managers wait a minute and a half, and the bill is $17,500. Someone suggests
        doubling the cluster.
      </p>
    ),
  },
  {
    id: "numbers",
    kicker: "Worse",
    title: "And the numbers are wrong",
    body: (
      <p>
        Finance notices dashboard revenue runs 3% above the accounts. Slow and expensive is bad;
        wrong is worse.
      </p>
    ),
  },
  {
    id: "doctor",
    kicker: "Your job",
    title: "Diagnose before you prescribe",
    body: (
      <>
        <p>
          A good doctor doesn&apos;t prescribe before examining. Symptoms (slow, costly, wrong)
          rarely have one cause.
        </p>
        <p>
          You&apos;re called in. Next, you&apos;ll examine the evidence, find the causes, and fix
          them. Several problems are compounding.
        </p>
      </>
    ),
  },
];

export function SixMonthsLater() {
  return (
    <ScrollStory
      sections={SECTIONS}
      renderScene={(i) => <Scene stage={i} />}
      intro={
        <div>
          <p className="text-accent text-xs font-medium tracking-wide uppercase">Capstone</p>
          <h2 className="mt-2 text-2xl font-semibold tracking-tight sm:text-3xl">
            Six months later
          </h2>
          <p className="text-muted mt-3 text-[15px]">
            A lakehouse that started well, and slowly went wrong.
          </p>
        </div>
      }
    />
  );
}
