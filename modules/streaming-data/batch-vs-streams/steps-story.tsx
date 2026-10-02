"use client";

import { motion } from "motion/react";
import { ScrollStory, type StorySection } from "@/toolkit/layout/scroll-story";
import { Term } from "@/toolkit/glossary/term";
import { AMOUNT, COUNT, TRIGGER } from "./attack";

/* Scenes ----------------------------------------------------------------------------------------- */

const W = 300;

/** Twenty payment dots along a ten-minute line; `stop` marks where (if anywhere) they are blocked. */
function Payments({ stop, label }: { stop: number | null; label: string }) {
  return (
    <svg viewBox="0 0 300 150" className="h-full w-full" role="img" aria-label={label}>
      <line x1="10" y1="80" x2="290" y2="80" className="stroke-line-strong" strokeWidth="1.5" />
      {Array.from({ length: COUNT }, (_, i) => {
        const x = 18 + i * 14;
        const blocked = stop !== null && i >= stop;
        return (
          <motion.g
            key={i}
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.06 }}
          >
            <circle
              cx={x}
              cy={80}
              r={5}
              className={
                blocked ? "fill-surface stroke-viz-idle" : "fill-viz-remove/70 stroke-viz-remove"
              }
            />
            {blocked && i === stop && (
              <path
                d={`M${x - 4} ${68}l8 -8M${x + 4} ${68}l-8 -8`}
                className="stroke-viz-add"
                strokeWidth="2"
              />
            )}
          </motion.g>
        );
      })}
      <text x="10" y="100" className="fill-muted text-[8px]">
        23:42
      </text>
      <text x="290" y="100" textAnchor="end" className="fill-muted text-[8px]">
        23:52
      </text>
      <text x={W / 2} y="128" textAnchor="middle" className="fill-fg text-[9px] font-semibold">
        {stop === null
          ? `${COUNT} × ₹${AMOUNT.toLocaleString("en-IN")} gone`
          : `blocked at payment ${stop + 1}`}
      </text>
      <text x={W / 2} y="30" textAnchor="middle" className="fill-muted text-[8px]">
        {label}
      </text>
    </svg>
  );
}

function Nightly() {
  return (
    <svg
      viewBox="0 0 300 150"
      className="h-full w-full"
      role="img"
      aria-label="A nightly batch job runs at 2 am, hours after the payments"
    >
      <line x1="10" y1="80" x2="290" y2="80" className="stroke-line-strong" strokeWidth="1.5" />
      {[
        ["22:00", 10],
        ["00:00", 110],
        ["02:00", 210],
      ].map(([t, x]) => (
        <text key={t as string} x={x as number} y="100" className="fill-muted text-[8px]">
          {t}
        </text>
      ))}
      <rect x="95" y="70" width="10" height="20" rx="2" className="fill-viz-remove/60" />
      <text x="100" y="62" textAnchor="middle" className="fill-viz-remove text-[8px]">
        payments
      </text>
      <motion.rect
        x="190"
        y="34"
        width="60"
        height="28"
        rx="6"
        className="fill-viz-compute/15 stroke-viz-compute"
        animate={{ opacity: [0.5, 1, 0.5] }}
        transition={{ duration: 2, repeat: Infinity }}
      />
      <path d="M220 62v18" className="stroke-viz-compute" strokeDasharray="2 2" />
      <text x="220" y="51" textAnchor="middle" className="fill-fg text-[8px]">
        batch job
      </text>
      <text x="150" y="130" textAnchor="middle" className="fill-fg text-[9px] font-semibold">
        It finds the pattern two hours too late
      </text>
    </svg>
  );
}

function BookRiver() {
  return (
    <svg
      viewBox="0 0 300 150"
      className="h-full w-full"
      role="img"
      aria-label="A book with a last page, and a river with no end"
    >
      <rect
        x="30"
        y="40"
        width="80"
        height="70"
        rx="4"
        className="fill-viz-data/15 stroke-viz-data"
      />
      <path d="M70 40v70" className="stroke-viz-data" />
      <text x="70" y="128" textAnchor="middle" className="fill-fg text-[9px]">
        bounded: a book
      </text>
      <motion.path
        d="M150 75q20-20 40 0t40 0t40 0"
        className="stroke-accent"
        strokeWidth="6"
        strokeLinecap="round"
        strokeDasharray="10 8"
        animate={{ strokeDashoffset: [36, 0] }}
        transition={{ duration: 1.2, repeat: Infinity, ease: "linear" }}
      />
      <text x="210" y="128" textAnchor="middle" className="fill-fg text-[9px]">
        unbounded: a river
      </text>
    </svg>
  );
}

function Scale() {
  return (
    <svg
      viewBox="0 0 300 150"
      className="h-full w-full"
      role="img"
      aria-label="About 9,300 UPI payments every second"
    >
      {Array.from({ length: 60 }, (_, i) => (
        <motion.circle
          key={i}
          cx={20 + (i % 15) * 18}
          cy={30 + Math.floor(i / 15) * 18}
          r={3}
          className="fill-accent"
          animate={{ opacity: [0.2, 1, 0.2] }}
          transition={{ duration: 1.5, repeat: Infinity, delay: (i % 7) * 0.2 }}
        />
      ))}
      <text x="150" y="122" textAnchor="middle" className="fill-fg text-[14px] font-semibold">
        ≈ 9,300 a second
      </text>
      <text x="150" y="138" textAnchor="middle" className="fill-muted text-[8px]">
        UPI, September 2026: 24 billion payments in the month
      </text>
    </svg>
  );
}

/* Story ----------------------------------------------------------------------------------------- */

const SECTIONS: StorySection[] = [
  {
    id: "attack",
    kicker: "23:42",
    title: "A payment at 11:42 pm",
    body: (
      <>
        <p>
          Someone has stolen a shopkeeper&apos;s UPI PIN. At 11:42 pm they start sending ₹4,999 to a
          new payee, every thirty seconds. Twenty payments in ten minutes empties the account.
        </p>
        <p className="text-muted text-sm">The story is made up; the pattern is a common one.</p>
      </>
    ),
  },
  {
    id: "batch",
    kicker: "02:00",
    title: "The nightly check",
    body: (
      <p>
        The bank runs its fraud rules in a <Term id="batch">batch</Term> job at 2 am, over
        everything from the day before. It spots the pattern perfectly: three payments to a new
        payee within two minutes. By then, all twenty have gone through.
      </p>
    ),
  },
  {
    id: "stream",
    kicker: "23:43",
    title: "Checking each payment as it happens",
    body: (
      <p>
        Now run the same rule on each payment the moment it arrives. The third payment makes the
        rule true, so it is declined on the spot. Same rule, same data, different timing: that is{" "}
        <Term id="streaming">stream processing</Term>. Real payment networks work this way;
        India&apos;s government says NPCI gives banks an AI-based monitoring tool that raises alerts
        and declines suspicious transactions.
      </p>
    ),
  },
  {
    id: "unbounded",
    kicker: "The idea",
    title: "A book and a river",
    body: (
      <p>
        A day&apos;s payments is <Term id="bounded-data">bounded</Term>: it has a last page, so you
        can read it all and then answer. The payments themselves never stop: they are{" "}
        <Term id="unbounded-data">unbounded</Term>. Tyler Akidau, who led Google&apos;s streaming
        work, defined a streaming system as &ldquo;a type of data processing engine that is designed
        with infinite data sets in mind&rdquo;.
      </p>
    ),
  },
  {
    id: "scale",
    kicker: "India",
    title: "Every second, thousands",
    body: (
      <p>
        UPI carried about 24 billion payments in September 2026, roughly 800 million a day, or about
        9,300 every second on average. The Finance Ministry told Parliament of 12.64 lakh UPI fraud
        cases worth ₹981 crore in 2024–25. At that scale, &ldquo;we&apos;ll check tonight&rdquo;
        isn&apos;t good enough for everything.
      </p>
    ),
  },
];

export function PaymentStory() {
  return (
    <ScrollStory
      sections={SECTIONS}
      renderScene={(i) =>
        i === 0 ? (
          <Payments stop={null} label="23:42 to 23:52" />
        ) : i === 1 ? (
          <Nightly />
        ) : i === 2 ? (
          <Payments stop={TRIGGER} label="the same payments, checked as they arrive" />
        ) : i === 3 ? (
          <BookRiver />
        ) : (
          <Scale />
        )
      }
      intro={
        <div>
          <p className="text-accent text-xs font-medium tracking-wide uppercase">Scroll story</p>
          <h2 className="mt-2 text-2xl font-semibold tracking-tight sm:text-3xl">
            A payment at 11:42 pm
          </h2>
          <p className="text-muted mt-3 text-[15px]">
            The same fraud rule, run tonight or run now, and why some data can&apos;t wait.
          </p>
        </div>
      }
    />
  );
}
