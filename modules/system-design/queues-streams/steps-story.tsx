"use client";

import { AnimatePresence, motion } from "motion/react";
import { ScrollStory, type StorySection } from "@/toolkit/layout/scroll-story";
import { Term } from "@/toolkit/glossary/term";

/* 1 ─ The ticket rail ⭐ ----------------------------------------------------------------------------- */

const SECTIONS: StorySection[] = [
  {
    id: "direct",
    kicker: "Direct",
    title: "The waiter waits",
    body: (
      <>
        <p>
          In a small café, a waiter takes an order, walks to the cook and waits while the cook makes
          it. That&apos;s a direct call: the caller can&apos;t do anything else until the answer
          comes back.
        </p>
        <p>It works fine while the café is quiet.</p>
      </>
    ),
  },
  {
    id: "rush",
    kicker: "Rush",
    title: "Then the lunch rush",
    body: (
      <>
        <p>
          Five waiters queue at one cook. Tables go unserved while their waiter stands in line, and
          some customers give up and leave.
        </p>
        <p>
          In software, a slow downstream service makes every caller wait, and callers start timing
          out.
        </p>
      </>
    ),
  },
  {
    id: "rail",
    kicker: "Rail",
    title: "A ticket rail",
    body: (
      <>
        <p>
          Now waiters clip each order ticket to a rail and go straight back to their tables. The
          cook takes the next ticket when ready. During the rush the rail fills up, but no order is
          lost and no waiter is stuck.
        </p>
        <p>
          That rail is a <Term id="queue">queue</Term>. The waiters are <em>producers</em>, the cook
          a <em>consumer</em>, and the tickets <em>messages</em>.
        </p>
      </>
    ),
  },
  {
    id: "cooks",
    kicker: "More cooks",
    title: "Add cooks, not waiters",
    body: (
      <>
        <p>
          If the rail keeps growing, add cooks. Each ticket goes to exactly one cook, who takes it
          off the rail when the dish is done. Producers and consumers now scale independently.
        </p>
        <p>
          A queue that grows for ever is a warning sign: consumers can&apos;t keep up. Pushing back
          on producers when that happens is called <Term id="backpressure">backpressure</Term>.
        </p>
      </>
    ),
  },
  {
    id: "log",
    kicker: "Log",
    title: "A receipt roll that everyone reads",
    body: (
      <>
        <p>
          Some cafés print every order onto one long roll instead. Nothing is torn off. The kitchen,
          the bar and the accounts desk each read the whole roll, each keeping a finger on where
          they&apos;ve got to.
        </p>
        <p>
          That&apos;s an <Term id="event-log">event log</Term> (a <em>stream</em>): messages stay
          for a set time, every reader gets all of them, and a new reader can start from the
          beginning. Its finger is the <Term id="offset">offset</Term>.
        </p>
      </>
    ),
  },
];

const TICKET = { w: 16, h: 20 };

function Person({
  x,
  y,
  label,
  tone,
}: {
  x: number;
  y: number;
  label: string;
  tone: "waiter" | "cook" | "gone";
}) {
  const fill =
    tone === "cook" ? "var(--viz-compute)" : tone === "gone" ? "var(--bad)" : "var(--line-strong)";
  return (
    <motion.g
      initial={{ opacity: 0 }}
      animate={{ opacity: 1, x, y }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.4 }}
    >
      <circle cx={0} cy={-8} r={6} fill={fill} />
      <rect x={-7} y={-1} width={14} height={14} rx={4} fill={fill} />
      <text y={26} textAnchor="middle" className="fill-muted text-[8px]">
        {label}
      </text>
    </motion.g>
  );
}

function Ticket({ x, y, n, faded }: { x: number; y: number; n: number; faded?: boolean }) {
  return (
    <motion.g
      initial={{ opacity: 0, y: y - 10 }}
      animate={{ opacity: faded ? 0.35 : 1, x, y }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.35 }}
    >
      <rect
        width={TICKET.w}
        height={TICKET.h}
        rx={2}
        fill="var(--surface)"
        stroke="var(--viz-data)"
      />
      <text x={TICKET.w / 2} y={13} textAnchor="middle" className="fill-fg text-[7px]">
        {n}
      </text>
    </motion.g>
  );
}

function Scene({ stage }: { stage: number }) {
  const waiters = stage === 1 ? 5 : stage === 0 ? 2 : 3;
  const cooks = stage >= 3 ? (stage === 4 ? 0 : 3) : 1;
  const tickets = stage === 2 ? 7 : stage === 3 ? 3 : 0;
  return (
    <svg
      viewBox="0 0 320 200"
      className="mx-auto h-full max-h-[26rem] w-full max-w-2xl"
      role="img"
      aria-label="Café ordering scene"
    >
      <AnimatePresence>
        {/* producers */}
        {stage !== 4 &&
          Array.from({ length: waiters }, (_, i) =>
            stage === 1 ? (
              <Person
                key={`w${i}`}
                x={170 + i * 22 - 88}
                y={100}
                label={i === 0 ? "waiting" : ""}
                tone="waiter"
              />
            ) : (
              <Person key={`w${i}`} x={36} y={40 + i * 55} label="waiter" tone="waiter" />
            ),
          )}
        {stage === 1 &&
          [0, 1].map((i) => (
            <Person key={`g${i}`} x={24} y={45 + i * 110} label="gave up" tone="gone" />
          ))}
        {/* consumers */}
        {Array.from({ length: cooks }, (_, i) => (
          <Person
            key={`c${i}`}
            x={284}
            y={cooks === 1 ? 100 : 45 + i * 55}
            label="cook"
            tone="cook"
          />
        ))}
        {/* the rail */}
        {(stage === 2 || stage === 3) && (
          <motion.line
            key="rail"
            x1={80}
            y1={90}
            x2={250}
            y2={90}
            stroke="var(--line-strong)"
            strokeWidth={2}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          />
        )}
        {Array.from({ length: tickets }, (_, i) => (
          <Ticket
            key={`t${i + (stage === 3 ? 4 : 0)}`}
            x={228 - i * 21}
            y={92}
            n={i + (stage === 3 ? 5 : 1)}
          />
        ))}
        {stage === 0 && (
          <motion.path
            key="arrow"
            d="M60,95 L262,95"
            stroke="var(--line-strong)"
            strokeDasharray="4 3"
            markerEnd="url(#arr)"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          />
        )}
        {/* the log */}
        {stage === 4 && (
          <motion.g
            key="log"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <text x={20} y={46} className="fill-muted text-[8px]">
              oldest
            </text>
            <text x={300} y={46} textAnchor="end" className="fill-muted text-[8px]">
              newest →
            </text>
            {Array.from({ length: 12 }, (_, i) => (
              <Ticket key={`l${i}`} x={20 + i * 24} y={56} n={i + 1} />
            ))}
            {(
              [
                ["kitchen", 10],
                ["bar", 7],
                ["accounts", 2],
              ] as const
            ).map(([label, at], j) => (
              <g key={label}>
                <path
                  d={`M${28 + at * 24},${80} L${28 + at * 24},${104 + j * 26}`}
                  stroke="var(--viz-compute)"
                  strokeWidth={1.5}
                />
                <circle cx={28 + at * 24} cy={80} r={2.5} fill="var(--viz-compute)" />
                <text x={28 + at * 24 + 5} y={107 + j * 26} className="fill-fg text-[8px]">
                  {label} is at #{at + 1}
                </text>
              </g>
            ))}
          </motion.g>
        )}
      </AnimatePresence>
      <defs>
        <marker
          id="arr"
          viewBox="0 0 10 10"
          refX={9}
          refY={5}
          markerWidth={6}
          markerHeight={6}
          orient="auto"
        >
          <path d="M0,0 L10,5 L0,10 z" fill="var(--line-strong)" />
        </marker>
      </defs>
    </svg>
  );
}

export function TicketRail() {
  return (
    <ScrollStory
      sections={SECTIONS}
      renderScene={(i) => <Scene stage={i} />}
      intro={
        <div>
          <p className="text-accent text-xs font-medium tracking-wide uppercase">Scroll story</p>
          <h2 className="mt-2 text-2xl font-semibold tracking-tight sm:text-3xl">
            The ticket rail
          </h2>
          <p className="text-muted mt-3 text-[15px]">
            How a café survives lunch, and what it teaches about queues and logs.
          </p>
        </div>
      }
    />
  );
}
