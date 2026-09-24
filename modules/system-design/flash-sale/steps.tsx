"use client";

import { AnimatePresence, motion } from "motion/react";
import { useSceneState } from "@/lib/module-sdk";
import { StepLayout } from "@/toolkit/layout/step-layout";
import { ChoiceCheckpoint } from "@/toolkit/checkpoints/choice";
import { Code, FrameCaption, Stepper } from "@/toolkit/controls/stepper";
import { Term } from "@/toolkit/glossary/term";
import { cn } from "@/lib/cn";
import { TICKETS, sale, type Approach } from "./model";
import type { SaleState } from "./state";

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

/* 1 ─ The last cake ⭐ ------------------------------------------------------------------------------ */

const RACE: {
  title: string;
  text: string;
  stock: number;
  a: string;
  b: string;
  tone?: "good" | "bad";
}[] = [
  {
    title: "One left",
    text: "The stock table says 1 ticket remains. Two buyers press Book in the same millisecond.",
    stock: 1,
    a: "presses Book",
    b: "presses Book",
  },
  {
    title: "Both check",
    text: "Each request reads the stock: both see 1. So far nothing is wrong.",
    stock: 1,
    a: "reads stock = 1",
    b: "reads stock = 1",
  },
  {
    title: "Both decide",
    text: "Each thinks 'one left, it's mine' and creates an order.",
    stock: 1,
    a: "creates order",
    b: "creates order",
  },
  {
    title: "Both write",
    text: "Each writes stock = 1 − 1 = 0. The second write overwrites the first: a lost update.",
    stock: 0,
    a: "writes stock = 0",
    b: "writes stock = 0",
  },
  {
    title: "One seat, two tickets",
    text: "Two orders for one seat. At a million requests a second, this happens thousands of times.",
    stock: 0,
    a: "has a ticket",
    b: "has the same ticket",
    tone: "bad",
  },
];

export function LastCake() {
  const [s, set] = useSceneState<SaleState>();
  const step = Math.min(s.raceFrame, RACE.length - 1);
  const f = RACE[step];
  return (
    <StepLayout
      eyebrow="The big idea"
      title="The last ticket"
      stage={
        <div className="flex flex-1 flex-col gap-4">
          <div className="grid grid-cols-3 items-center gap-3">
            {(["Ananya", "stock", "Rohan"] as const).map((who) => (
              <motion.div
                key={who}
                layout
                className={cn(
                  "rounded-xl border px-3 py-4 text-center",
                  who === "stock"
                    ? "border-viz-data/60 bg-viz-data/10"
                    : step === RACE.length - 1
                      ? "border-bad/50 bg-bad/10"
                      : "border-line bg-surface",
                )}
              >
                <p className="text-sm font-semibold">{who === "stock" ? "Stock row" : who}</p>
                <AnimatePresence mode="wait">
                  <motion.p
                    key={`${who}${step}`}
                    initial={{ opacity: 0, y: 4 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-muted mt-1 font-mono text-xs"
                  >
                    {who === "stock" ? `tickets_left = ${f.stock}` : who === "Ananya" ? f.a : f.b}
                  </motion.p>
                </AnimatePresence>
              </motion.div>
            ))}
          </div>
          <Stepper step={step} count={RACE.length} onChange={(n) => set({ raceFrame: n })} />
          <FrameCaption frameKey={step} title={f.title} tone={f.tone}>
            {f.text}
          </FrameCaption>
          <Code>
            {
              "SELECT tickets_left FROM events WHERE id = 7;   -- 1\n-- … decide …\nUPDATE events SET tickets_left = 0 WHERE id = 7;"
            }
          </Code>
        </div>
      }
    >
      <p>
        A bakery has one last special cake at 10:00, and two customers reach the counter at the same
        moment. Each sees it in the case, each pays a different assistant, and each is promised the
        cake.
      </p>
      <p>
        Software does the same thing whenever it checks a value and then changes it in two separate
        steps, causing a <Term id="lost-update">lost update</Term>. Step through two buyers racing
        for the last ticket.
      </p>
      <p className="text-muted text-sm">
        Normally such collisions are rare. In a flash sale, everyone hits the same row at once: the
        ultimate <Term id="hot-key">hot key</Term>.
      </p>
    </StepLayout>
  );
}

/* 2 ─ 10:00:00 ⭐ -------------------------------------------------------------------------------- */

const APPROACHES: Record<Approach, { label: string; code: string }> = {
  naive: {
    label: "Read, then write",
    code: "SELECT tickets_left …;  UPDATE … SET tickets_left = ?",
  },
  lock: { label: "Row lock", code: "BEGIN; SELECT tickets_left … FOR UPDATE; … UPDATE …; COMMIT;" },
  conditional: {
    label: "Conditional update",
    code: "UPDATE events SET tickets_left = tickets_left - 1\nWHERE id = 7 AND tickets_left > 0;   -- 1 row changed = you got one",
  },
  counter: {
    label: "In-memory counter",
    code: "-- atomic script in Redis/Valkey:\nif tonumber(redis.call('GET', KEYS[1])) > 0 then return redis.call('DECR', KEYS[1]) else return -1 end",
  },
  room: {
    label: "Waiting room",
    code: "-- edge: hold visitors on a queue page, admit N per minute\n-- checkout: then any of the safe methods",
  },
};

export function TenOClock() {
  const [s, set] = useSceneState<SaleState>();
  const r = sale(s.approach);
  const good = r.oversold === 0 && r.otherPagesOk;
  return (
    <StepLayout
      eyebrow="Simulation"
      title="10:00:00"
      stage={
        <div className="flex flex-1 flex-col gap-3">
          <div className="flex flex-wrap gap-1.5">
            {(Object.keys(APPROACHES) as Approach[]).map((k) => (
              <button
                key={k}
                type="button"
                onClick={() => set({ approach: k })}
                className={cn(
                  "rounded-full border px-2.5 py-1 text-xs",
                  s.approach === k
                    ? "border-accent bg-accent-soft"
                    : "border-line hover:bg-surface-2",
                )}
              >
                {APPROACHES[k].label}
              </button>
            ))}
          </div>
          <Code>{APPROACHES[s.approach].code}</Code>
          <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
            <Stat
              label={`Tickets sold (of ${TICKETS.toLocaleString("en-IN")})`}
              value={r.sold.toLocaleString("en-IN")}
              bad={r.oversold > 0}
            />
            <Stat
              label="Sold out after"
              value={
                r.soldOutS === null
                  ? "—"
                  : r.soldOutS < 1
                    ? `${Math.round(r.soldOutS * 1000)} ms`
                    : `${Math.round(r.soldOutS)} s`
              }
            />
            <Stat
              label="Peak load on the database"
              value={`${r.dbPeak.toLocaleString("en-IN")}/s`}
              bad={r.dbPeak > 20000}
            />
            <Stat
              label="Errors and timeouts"
              value={r.errors.toLocaleString("en-IN")}
              bad={r.errors > 0}
            />
            <Stat
              label="Rest of the site"
              value={r.otherPagesOk ? "fine" : "down"}
              bad={!r.otherPagesOk}
            />
            <Stat label="Who wins" value={r.fairness} />
          </div>
          <AnimatePresence mode="wait">
            <motion.p
              key={s.approach}
              initial={{ opacity: 0, y: 4 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className={cn(
                "rounded-xl border px-4 py-3 text-sm",
                good ? "border-good/40 bg-good/10" : "border-bad/40 bg-bad/10",
              )}
            >
              {r.verdict}
            </motion.p>
          </AnimatePresence>
          <p className="text-muted text-[11px]">
            A million people press Book in the first ten seconds; the database handles about 20,000
            queries a second with 500 connections. Illustrative numbers.
          </p>
        </div>
      }
    >
      <p>
        Concert tickets go on sale at 10:00: 1,000 seats, a million fans. Try five ways of taking
        the bookings. Two things must hold: never sell a seat twice, and don&apos;t take the whole
        site down.
      </p>
      <p className="text-muted text-sm">
        Row locks are <em>pessimistic</em> (assume a clash, block others); conditional updates are
        closer to <em>optimistic</em> (just try, and check it worked). Both are correct; they differ
        in how much waiting they cause.
      </p>
    </StepLayout>
  );
}

/* 3 ─ Checkpoint --------------------------------------------------------------------------------- */

export function WhyAtomic() {
  return (
    <StepLayout
      eyebrow="Checkpoint"
      title="Why can't it oversell?"
      stage={
        <div className="flex flex-1 flex-col justify-center">
          <ChoiceCheckpoint
            id="atomic"
            prompt="Why does “UPDATE … SET tickets_left = tickets_left − 1 WHERE tickets_left > 0” never sell more than the stock, even with thousands of buyers at once?"
            options={[
              {
                id: "atomic",
                label:
                  "The database checks and changes the row in one indivisible step, so no two buyers can both see the last ticket",
                correct: true,
                feedback:
                  "Right. The condition is re-checked while the row is being changed; when stock hits 0, further updates change 0 rows, and those buyers are told it's sold out.",
              },
              {
                id: "fast",
                label: "It runs so fast that collisions can't happen",
                feedback:
                  "Speed only makes collisions rarer. Correctness comes from doing the check and the change together.",
              },
              {
                id: "cache",
                label: "The result is cached",
                feedback: "Caching stock would make overselling more likely, not less.",
              },
              {
                id: "index",
                label: "Because tickets_left is indexed",
                feedback: "Indexes speed up finding the row; they don't make read-then-write safe.",
              },
            ]}
            explanation="The general rule: don't read a value into your app and write it back. Let the store do the check and the change together: conditional updates, compare-and-set, or an atomic script."
          />
        </div>
      }
    >
      <p>The difference between the broken and the working versions is one line of SQL.</p>
    </StepLayout>
  );
}

/* 4 ─ Held but never paid ⭐ ----------------------------------------------------------------------- */

const MINUTES = ["10:00", "10:05", "10:10", "10:15", "10:20"];

/** 100 seats (each stands for 10). 30% of people holding a seat abandon checkout. */
function seats(minute: number, expiry: boolean): ("sold" | "held" | "stuck" | "free")[] {
  const out: ("sold" | "held" | "stuck" | "free")[] = Array(100).fill("free");
  if (minute === 0) return out.fill("held");
  let sold = 70;
  let held = 0;
  let stuck = 30;
  if (expiry) {
    // abandoned holds expire at 10:10 and go to the next people in the queue, 70% of whom pay
    if (minute === 1) [sold, stuck, held] = [70, 0, 30];
    if (minute === 2) [sold, stuck, held] = [70, 0, 30];
    if (minute === 3) [sold, stuck, held] = [91, 0, 9];
    if (minute === 4) [sold, stuck, held] = [97, 0, 3];
  } else if (minute >= 1) [sold, stuck, held] = [70, 30, 0];
  return out.map((_, i) =>
    i < sold ? "sold" : i < sold + held ? "held" : i < sold + held + stuck ? "stuck" : "free",
  );
}

export function Holds() {
  const [s, set] = useSceneState<SaleState>();
  const grid = seats(s.minute, s.expiry);
  const count = (k: string) => grid.filter((g) => g === k).length * 10;
  const done = s.minute === MINUTES.length - 1;
  return (
    <StepLayout
      eyebrow="Fix the problem"
      title="Held, but never paid for"
      stage={
        <div className="flex flex-1 flex-col gap-3">
          <label className="flex items-center gap-2 text-sm">
            <input
              type="checkbox"
              checked={s.expiry}
              onChange={(e) => set({ expiry: e.target.checked, minute: 0 })}
              className="accent-[var(--accent)]"
            />
            Holds expire after 10 minutes
          </label>
          <div className="mx-auto grid w-full max-w-md grid-cols-20 gap-0.5">
            {grid.map((g, i) => (
              <motion.span
                key={i}
                initial={false}
                animate={{ opacity: 1 }}
                className={cn(
                  "aspect-square rounded-[3px] transition-colors",
                  g === "sold"
                    ? "bg-good/70"
                    : g === "held"
                      ? "bg-viz-compute/70"
                      : g === "stuck"
                        ? "bg-bad/60"
                        : "bg-surface-2",
                )}
              />
            ))}
          </div>
          <div className="text-muted flex flex-wrap gap-3 text-[10px]">
            <span className="flex items-center gap-1">
              <span className="bg-good/70 size-2.5 rounded-sm" /> paid
            </span>
            <span className="flex items-center gap-1">
              <span className="bg-viz-compute/70 size-2.5 rounded-sm" /> held in checkout
            </span>
            <span className="flex items-center gap-1">
              <span className="bg-bad/60 size-2.5 rounded-sm" /> held by someone who left
            </span>
          </div>
          <Stepper
            step={s.minute}
            count={MINUTES.length}
            onChange={(n) => set({ minute: n })}
            label={<span className="font-mono">{MINUTES[s.minute]}</span>}
          />
          <div className="grid grid-cols-3 gap-2">
            <Stat label="Paid" value={count("sold").toLocaleString("en-IN")} />
            <Stat label="Held in checkout" value={count("held").toLocaleString("en-IN")} />
            <Stat
              label="Held by people who left"
              value={count("stuck").toLocaleString("en-IN")}
              bad={count("stuck") > 0}
            />
          </div>
          {done && (
            <p
              className={cn(
                "rounded-xl border px-4 py-3 text-sm",
                s.expiry ? "border-good/40 bg-good/10" : "border-bad/40 bg-bad/10",
              )}
            >
              {s.expiry
                ? "Abandoned holds expired at 10:10 and went to the next people in the queue. Nearly every seat is paid for."
                : "The site says 'sold out', but 300 seats sit empty: held by people who closed the tab. Fans rage; resellers smile."}
            </p>
          )}
        </div>
      }
    >
      <p>
        A booking isn&apos;t instant: buyers need a few minutes to pay. So the system puts a{" "}
        <Term id="inventory-hold">hold</Term> on the seat, then confirms it on payment. But about a
        third of people abandon checkout.
      </p>
      <p>Step through the first twenty minutes with and without an expiry on holds.</p>
      <p className="text-muted text-sm">
        Ticketmaster sets its checkout timer by demand, typically 5 to 10 minutes. Expiry is easy
        with a timestamp on each hold, or a key that expires in an in-memory store.
      </p>
    </StepLayout>
  );
}

/* 5 ─ Checkpoint: fairness ------------------------------------------------------------------------ */

export function Fairness() {
  return (
    <StepLayout
      eyebrow="Checkpoint"
      title="Why shuffle the queue?"
      stage={
        <div className="flex flex-1 flex-col justify-center">
          <ChoiceCheckpoint
            id="shuffle"
            prompt="A waiting room opens at 9:45 for a 10:00 sale. At 10:00 it randomly shuffles everyone already waiting, then lets later arrivals join the back in order. Why shuffle?"
            options={[
              {
                id: "fair",
                label:
                  "So arriving at 9:45 or 9:59, or refreshing faster, doesn't decide who gets in: everyone there on time has the same chance",
                correct: true,
                feedback:
                  "Right. First-come-first-served rewards bots and fast clicks. A random draw among on-time arrivals is fairer and removes the rush at 9:59:59.",
              },
              {
                id: "load",
                label: "It spreads out server load",
                feedback: "The admission rate controls load. Shuffling is about who goes first.",
              },
              {
                id: "security",
                label: "It stops people seeing the queue length",
                feedback:
                  "Waiting rooms usually show your position or an estimate; shuffling is about fairness.",
              },
              {
                id: "cost",
                label: "Random queues are cheaper to run",
                feedback: "Cost is similar; the reason is fairness.",
              },
            ]}
            explanation="Queue-it and Cloudflare Waiting Room both offer this: a pre-queue randomised at the start time, then first-in-first-out for everyone after."
          />
        </div>
      }
    >
      <p>
        A <Term id="waiting-room">virtual waiting room</Term> turns a stampede into a queue. How the
        queue is ordered matters.
      </p>
    </StepLayout>
  );
}

/* 6 ─ In the real world --------------------------------------------------------------------------- */

const REAL: [string, string][] = [
  [
    "Ticketmaster, Nov 2022",
    "The Taylor Swift Eras Tour presale drew 3.5 billion system requests, four times its previous peak. 3.5 million people registered as Verified Fans and about 1.5 million were invited; over 2 million tickets sold that day.",
  ],
  [
    "IRCTC Tatkal",
    "India's railway booking opens Tatkal quotas at 10:00 (AC) and 11:00 (non-AC). Since July 2025 it needs Aadhaar-verified accounts and an OTP, and agents are blocked for the first 30 minutes of each window.",
  ],
  [
    "Alibaba Singles' Day",
    "The 2020 sale peaked at 583,000 orders a second, 26 seconds after midnight.",
  ],
  [
    "Waiting rooms",
    "Cloudflare Waiting Room (first-in-first-out or random), Queue-it (randomised pre-queue), and many build their own at the CDN edge. AWS's reference 'Virtual Waiting Room' solution is deprecated.",
  ],
  [
    "Database tools",
    "SELECT … FOR UPDATE SKIP LOCKED (PostgreSQL 9.5+, MySQL 8.0+) lets many buyers grab different seats without queueing on each other; conditional writes (DynamoDB condition expressions) give optimistic updates.",
  ],
];

export function RealWorld() {
  return (
    <StepLayout
      eyebrow="The landscape"
      title="In the real world"
      stage={
        <div className="grid flex-1 content-center gap-2 sm:grid-cols-2">
          {REAL.map(([t, d], i) => (
            <motion.div
              key={t}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.05 * i }}
              className="border-line bg-surface rounded-xl border px-3 py-2"
            >
              <p className="text-sm font-semibold">{t}</p>
              <p className="text-muted mt-0.5 text-xs">{d}</p>
            </motion.div>
          ))}
        </div>
      }
    >
      <p>
        Every big launch is a flash sale. The winners plan for bots, queues and fairness, not just
        speed.
      </p>
    </StepLayout>
  );
}

/* 7 ─ Wrap ----------------------------------------------------------------------------------------- */

const TAKEAWAYS = [
  ["Never read-then-write", "Check and change in one atomic step."],
  [
    "Keep the hot row away from everything else",
    "An in-memory counter or queue protects the main database.",
  ],
  ["Hold with an expiry", "Abandoned carts must release their seats."],
  ["Queue the crowd", "A waiting room admits people at a rate the system can take."],
  ["Be fair on purpose", "Randomise the start; stop bots from winning by speed."],
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
      <p>That completes the design problems.</p>
      <p>The final chapter puts everything together: the building blocks, then two capstones.</p>
    </StepLayout>
  );
}
