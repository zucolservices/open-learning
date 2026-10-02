"use client";

import { motion } from "motion/react";
import { Gauge, Globe2, Layers, MousePointerClick, TrendingUp } from "lucide-react";
import { ScrollStory, type StorySection } from "@/toolkit/layout/scroll-story";
import { Term } from "@/toolkit/glossary/term";
import { cn } from "@/lib/cn";
import { demand } from "./demand";

const YEAR = demand("results");
const PEAK = Math.max(...YEAR);
const W = 300;
const H = 150;
const x = (d: number) => (d / 364) * W;
const y = (v: number) => H - (v / (PEAK + 2)) * (H - 10);
const line = (vals: number[]) =>
  vals.map((v, d) => `${x(d).toFixed(1)},${y(v).toFixed(1)}`).join(" ");

/* Scenes ----------------------------------------------------------------------------------------- */

function Cupboard() {
  return (
    <svg
      viewBox="0 0 200 160"
      className="h-full w-full"
      role="img"
      aria-label="A small server rack in an office cupboard"
    >
      <rect
        x="55"
        y="10"
        width="90"
        height="140"
        rx="6"
        className="fill-surface-2 stroke-line"
        strokeWidth="2"
      />
      {[0, 1, 2, 3, 4].map((i) => (
        <g key={i}>
          <rect
            x="65"
            y={22 + i * 24}
            width="70"
            height="16"
            rx="3"
            className="fill-surface stroke-line"
          />
          {[0, 1, 2].map((j) => (
            <motion.circle
              key={j}
              cx={74 + j * 7}
              cy={30 + i * 24}
              r="1.8"
              fill="var(--accent)"
              animate={{ opacity: [1, 0.2, 1] }}
              transition={{ duration: 1 + ((i + j) % 3) * 0.6, repeat: Infinity }}
            />
          ))}
        </g>
      ))}
      <text x="100" y="158" textAnchor="middle" className="fill-muted text-[7px]">
        bought for five years, sized by guesswork
      </text>
    </svg>
  );
}

function DemandChart({ mode }: { mode: "fixed" | "rented" }) {
  const cap = 6;
  const rented = YEAR.map((v) => Math.ceil(v));
  return (
    <svg
      viewBox={`0 0 ${W} ${H + 24}`}
      className="h-full w-full"
      role="img"
      aria-label="A year of demand with the capacity provided"
    >
      {mode === "fixed" ? (
        <>
          <rect x="0" y={y(cap)} width={W} height={H - y(cap)} className="fill-viz-idle/25" />
          <line
            x1="0"
            x2={W}
            y1={y(cap)}
            y2={y(cap)}
            className="stroke-fg"
            strokeWidth="1.2"
            strokeDasharray="4 3"
          />
          <text x="4" y={y(cap) - 4} className="fill-fg text-[7px]">
            the servers you bought
          </text>
        </>
      ) : (
        <motion.polyline
          points={line(rented)}
          fill="none"
          className="stroke-fg"
          strokeWidth="1"
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ duration: 1.2 }}
        />
      )}
      <polyline points={line(YEAR)} fill="none" stroke="var(--accent)" strokeWidth="1.6" />
      {mode === "fixed" && (
        <text x={x(150) + 6} y={y(PEAK) + 8} className="fill-bad text-[7px]">
          results day: site down
        </text>
      )}
      <text x="0" y={H + 16} className="fill-muted text-[7px]">
        Jan
      </text>
      <text x={W} y={H + 16} textAnchor="end" className="fill-muted text-[7px]">
        Dec
      </text>
      <text x={W / 2} y={H + 16} textAnchor="middle" className="fill-muted text-[7px]">
        {mode === "fixed" ? "grey: paid for, sitting idle" : "rented servers follow the demand"}
      </text>
    </svg>
  );
}

const NIST: [typeof MousePointerClick, string, string][] = [
  [
    MousePointerClick,
    "On-demand self-service",
    "Get a server from a web page or an API, without asking a person.",
  ],
  [
    Globe2,
    "Broad network access",
    "Use it over the network, from a phone, laptop or another server.",
  ],
  [Layers, "Resource pooling", "Many customers share the same buildings and machines, kept apart."],
  [TrendingUp, "Rapid elasticity", "Grow and shrink quickly; capacity seems almost unlimited."],
  [Gauge, "Measured service", "Usage is metered, so you can be billed for what you use."],
];

function Five() {
  return (
    <div className="grid h-full content-center gap-2">
      {NIST.map(([Icon, t, d], i) => (
        <motion.div
          key={t}
          initial={{ opacity: 0, x: 10 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.12 * i }}
          className="border-line bg-surface flex items-start gap-2 rounded-lg border px-3 py-1.5"
        >
          <Icon className="text-accent mt-0.5 size-4 shrink-0" />
          <div>
            <p className="text-xs font-semibold">{t}</p>
            <p className="text-muted text-[11px]">{d}</p>
          </div>
        </motion.div>
      ))}
    </div>
  );
}

const SCALE: [string, string, string][] = [
  ["AWS", "39 regions", "124 availability zones"],
  ["Google Cloud", "43 regions", "130 zones"],
  ["Microsoft Azure", "80+ regions", "zone total not published"],
];
const SHARE: [string, number][] = [
  ["Amazon", 28],
  ["Microsoft", 20],
  ["Google", 15],
  ["Everyone else", 37],
];

function Hyperscale() {
  return (
    <div className="flex h-full flex-col justify-center gap-3">
      <div className="grid gap-2 sm:grid-cols-3">
        {SCALE.map(([n, r, z], i) => (
          <motion.div
            key={n}
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 * i }}
            className="border-line bg-surface rounded-lg border px-3 py-2"
          >
            <p className="text-xs font-semibold">{n}</p>
            <p className="text-accent font-mono text-sm">{r}</p>
            <p className="text-muted text-[10px]">{z}</p>
          </motion.div>
        ))}
      </div>
      <div>
        <p className="text-muted mb-1 text-[10px]">
          Share of cloud infrastructure spending, April–June 2026 (Synergy Research estimate)
        </p>
        <div className="flex h-5 overflow-hidden rounded">
          {SHARE.map(([n, v], i) => (
            <div
              key={n}
              style={{ width: `${v}%` }}
              className={cn(
                "grid place-items-center text-[9px] font-medium",
                i === 3
                  ? "bg-surface-2 text-muted"
                  : i === 0
                    ? "bg-accent text-accent-fg"
                    : i === 1
                      ? "bg-accent/70 text-accent-fg"
                      : "bg-accent/45 text-fg",
              )}
            >
              {n} {v}%
            </div>
          ))}
        </div>
      </div>
      <p className="text-muted text-[10px]">
        Region and zone counts from each provider&apos;s own pages, October 2026.
      </p>
    </div>
  );
}

/* Story ------------------------------------------------------------------------------------------ */

const SECTIONS: StorySection[] = [
  {
    id: "cupboard",
    kicker: "Before",
    title: "The server cupboard",
    body: (
      <>
        <p>
          Twenty years ago, an office that needed a website or a payroll system bought its own
          servers. Someone guessed how big they needed to be, ordered them, waited weeks, and
          installed them in a cupboard or a server room.
        </p>
        <p>
          Those machines were meant to last about five years. Electricity, cooling, repairs and
          security were all the office&apos;s problem. This is called running{" "}
          <Term id="on-premises">on premises</Term>.
        </p>
      </>
    ),
  },
  {
    id: "guess",
    kicker: "The problem",
    title: "Guessing wrong, both ways",
    body: (
      <>
        <p>
          Take an exam results website. It is quiet all year, then on results day everyone visits at
          once. Buy enough servers for that one day, and they sit idle for the other 364. Buy for a
          normal day, and the site falls over exactly when it matters.
        </p>
        <p>Owning servers means paying up front for a guess about the future.</p>
      </>
    ),
  },
  {
    id: "rent",
    kicker: "2006",
    title: "Renting computers by the hour",
    body: (
      <>
        <p>
          In March 2006 Amazon started renting out storage (S3), and that August it opened a test
          version of rentable servers (EC2). Google and Microsoft followed with their own clouds by
          2010.
        </p>
        <p>
          The idea: instead of buying machines, rent them from a huge shared data centre, start them
          when you need them, and stop paying when you stop them. Today, rented virtual servers are
          billed by the second or the minute.
        </p>
        <p>
          That is <Term id="cloud-computing">cloud computing</Term>: someone else&apos;s data
          centre, rented through a website, paid like a meter.
        </p>
      </>
    ),
  },
  {
    id: "five",
    kicker: "The definition",
    title: "Five things that make it a cloud",
    body: (
      <>
        <p>
          In 2011 the US standards body NIST wrote the definition still used today: on-demand
          network access to a shared pool of computing resources that can be provided and released
          quickly, with little effort.
        </p>
        <p>
          It names five traits. Being able to grow and shrink quickly is called{" "}
          <Term id="elasticity">elasticity</Term>, and it is what fixes the results-day problem.
        </p>
      </>
    ),
  },
  {
    id: "scale",
    kicker: "Today",
    title: "Data centres the size of towns",
    body: (
      <>
        <p>
          The big three providers now run data centres in dozens of regions around the world. An
          older data centre draws 10–25 megawatts; a large new AI data centre can draw 100 megawatts
          or more, about as much electricity in a year as 100,000 homes.
        </p>
        <p>
          The rest of this track is about building on these platforms well, whichever one you use.
        </p>
      </>
    ),
  },
];

export function CupboardToCloud() {
  return (
    <ScrollStory
      sections={SECTIONS}
      renderScene={(i) =>
        i === 0 ? (
          <Cupboard />
        ) : i === 1 ? (
          <DemandChart mode="fixed" />
        ) : i === 2 ? (
          <DemandChart mode="rented" />
        ) : i === 3 ? (
          <Five />
        ) : (
          <Hyperscale />
        )
      }
      intro={
        <div>
          <p className="text-accent text-xs font-medium tracking-wide uppercase">Scroll story</p>
          <h2 className="mt-2 text-2xl font-semibold tracking-tight sm:text-3xl">
            From a cupboard to the cloud
          </h2>
          <p className="text-muted mt-3 text-[15px]">
            Why organisations stopped buying servers and started renting them, and what makes
            something a cloud.
          </p>
        </div>
      }
    />
  );
}
