"use client";

import { motion } from "motion/react";
import { RotateCcw } from "lucide-react";
import { useSceneState } from "@/lib/module-sdk";
import { StepLayout } from "@/toolkit/layout/step-layout";
import { SortCheckpoint } from "@/toolkit/checkpoints/sort";
import { FrameCaption, Stepper } from "@/toolkit/controls/stepper";
import { Term } from "@/toolkit/glossary/term";
import { cn } from "@/lib/cn";
import { ADDABLE, FRAMES, START, balance, spendByCategory } from "./model";
import type { EsState } from "./state";

const inr = (n: number) => `${n < 0 ? "−" : ""}₹${Math.abs(n).toLocaleString("en-IN")}`;

/* 1 ─ Nobody erases a ledger ---------------------------------------------------------------------- */

const LEDGER: [string, number][] = [
  ["Salary", 10000],
  ["Rent", -4000],
  ["Coffee", -300],
  ["Duplicate charge", -2000],
  ["Reversal of duplicate charge", 2000],
];

const LEDGER_ROWS = LEDGER.map(([l, a], i) => ({
  l,
  a,
  run: LEDGER.slice(0, i + 1).reduce((sum, [, x]) => sum + x, 0),
}));

export function Ledger() {
  return (
    <StepLayout
      eyebrow="Story"
      title="Nobody erases a ledger"
      stage={
        <div className="flex flex-1 flex-col justify-center gap-1">
          <div className="text-muted grid grid-cols-[1fr_6rem_6rem] gap-2 px-3 text-[10px]">
            <span>entry</span>
            <span className="text-right">amount</span>
            <span className="text-right">balance</span>
          </div>
          {LEDGER_ROWS.map(({ l, a, run }, i) => (
            <motion.div
              key={l}
              initial={{ opacity: 0, x: -6 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.12 * i }}
              className={cn(
                "grid grid-cols-[1fr_6rem_6rem] gap-2 rounded-md border px-3 py-1.5 font-mono text-xs",
                i >= 3 ? "border-viz-compute/50 bg-viz-compute/10" : "border-line bg-surface",
              )}
            >
              <span>{l}</span>
              <span className={cn("text-right", a < 0 ? "text-bad" : "text-good")}>{inr(a)}</span>
              <span className="text-right">{inr(run)}</span>
            </motion.div>
          ))}
          <p className="text-muted mt-2 text-xs">
            The mistake stays on the page; a new line corrects it. The balance is the sum.
          </p>
        </div>
      }
    >
      <p>
        Look at a bank passbook. When the bank charges you twice by mistake, it doesn&apos;t rub out
        the wrong line; it adds a new one that reverses it. Every line stays, and the balance is
        just the running total. Accountants have worked this way for centuries.
      </p>
      <p>
        <Term id="event-sourcing">Event sourcing</Term> stores software&apos;s data the same way.
        Martin Fowler&apos;s summary: &ldquo;Capture all changes to an application state as a
        sequence of events.&rdquo; Current state isn&apos;t stored; it&apos;s worked out from the
        events.
      </p>
    </StepLayout>
  );
}

/* 2 ─ Rebuild a balance ⭐ ------------------------------------------------------------------------ */

export function Rebuild() {
  const [s, set] = useSceneState<EsState>();
  const events = [...START, ...(s.added ?? [])];
  const at = s.at < 0 || s.at > events.length ? events.length : s.at;
  const bal = balance(events, at);
  return (
    <StepLayout
      eyebrow="Simulation"
      title="Rebuild a balance"
      stage={
        <div className="flex flex-1 flex-col justify-center gap-3">
          <div className="flex flex-wrap gap-1.5">
            {ADDABLE.map((a) => (
              <button
                key={a.label}
                type="button"
                onClick={() => set({ added: [...(s.added ?? []), a.ev], at: -1 })}
                className="border-line hover:bg-surface-2 rounded-full border px-2.5 py-1 text-[11px]"
              >
                + {a.label}
              </button>
            ))}
            <button
              type="button"
              onClick={() => set({ triedDelete: true })}
              className="border-bad/50 text-bad rounded-full border border-dashed px-2.5 py-1 text-[11px]"
            >
              Delete the mistaken charge
            </button>
          </div>
          {s.triedDelete && (
            <motion.p
              initial={{ opacity: 0, y: 3 }}
              animate={{ opacity: 1, y: 0 }}
              className="border-bad/40 bg-bad/5 rounded-lg border px-3 py-2 text-xs"
            >
              Events can&apos;t be deleted or edited: they record what happened. Add a reversal
              event instead, a compensating event, and the history stays honest.
            </motion.p>
          )}
          <div className="bg-surface-2 flex flex-col gap-0.5 rounded-xl px-3 py-2 font-mono text-[11px]">
            <p className="text-muted">event store: account A-81 (append-only)</p>
            {events.map((e, i) => (
              <button
                key={i}
                type="button"
                onClick={() => set({ at: i + 1 })}
                className={cn(
                  "grid grid-cols-[1.5rem_1fr_5.5rem] gap-2 rounded px-1 text-left",
                  i < at ? "text-fg" : "text-subtle",
                  i === at - 1 && "bg-accent-soft",
                )}
              >
                <span>{i + 1}</span>
                <span>
                  {e.type}
                  {e.note ? ` (${e.note})` : ""}
                </span>
                <span
                  className={cn(
                    "text-right",
                    e.amount < 0 ? "text-bad" : e.amount > 0 ? "text-good" : "",
                  )}
                >
                  {e.amount ? inr(e.amount) : ""}
                </span>
              </button>
            ))}
          </div>
          <div className="grid grid-cols-2 gap-2">
            <div className="border-accent bg-accent-soft rounded-lg border px-3 py-2">
              <p className="text-muted text-[10px]">balance after event {at}</p>
              <motion.p
                key={bal + "-" + at}
                initial={{ opacity: 0.4 }}
                animate={{ opacity: 1 }}
                className="font-mono text-lg font-semibold"
              >
                {inr(bal)}
              </motion.p>
            </div>
            <div className="border-line bg-surface flex items-center justify-between gap-2 rounded-lg border px-3 py-2">
              <p className="text-muted text-[11px]">
                Click any event to see the account as it was then.
              </p>
              {(s.added?.length ?? 0) > 0 && (
                <button
                  type="button"
                  onClick={() => set({ added: [], at: -1, triedDelete: false })}
                  className="text-muted flex shrink-0 items-center gap-1 text-xs"
                >
                  <RotateCcw className="size-3" /> Reset
                </button>
              )}
            </div>
          </div>
        </div>
      }
    >
      <p>
        Add events to the account, including a mistaken charge and its reversal. Then click an
        earlier event to see the balance as it was at that moment: a temporal query, free with event
        sourcing.
      </p>
      <p>
        The events live in an <Term id="event-store">event store</Term>, which only ever appends.
        Mistakes are fixed with a <Term id="compensating-event">compensating event</Term>, as
        Microsoft&apos;s guidance puts it: &ldquo;a new event that reverses or corrects the effect
        of a previous event.&rdquo;
      </p>
    </StepLayout>
  );
}

/* 3 ─ Separate reads from writes ------------------------------------------------------------------ */

export function ReadModels() {
  const [s, set] = useSceneState<EsState>();
  const f = FRAMES[Math.min(s.frame ?? 0, FRAMES.length - 1)];
  const events = [...START, ...(s.added ?? [])];
  const cats = spendByCategory(events);
  const box = (on: boolean, cls: string) =>
    cn(
      "rounded-xl border px-3 py-2 transition-opacity",
      on ? cls : "border-line border-dashed opacity-30",
    );
  return (
    <StepLayout
      eyebrow="Step-through"
      title="Separate reads from writes"
      stage={
        <div className="flex flex-1 flex-col justify-center gap-3">
          <Stepper step={s.frame ?? 0} count={FRAMES.length} onChange={(n) => set({ frame: n })} />
          <div className="grid grid-cols-[1fr_auto_1fr] items-center gap-2">
            <div className={box(f.show.includes("write"), "border-viz-data bg-viz-data/10")}>
              <p className="text-xs font-semibold">Write side</p>
              <p className="text-muted text-[11px]">commands → aggregate → events appended</p>
              <p className="mt-1 font-mono text-[10px]">{events.length} events stored</p>
            </div>
            <span className="text-muted text-xs">{f.show.includes("lag") ? "→ ⏱ →" : "→"}</span>
            <div className="flex flex-col gap-2">
              <div className={box(f.show.includes("balances"), "border-viz-add bg-viz-add/10")}>
                <p className="text-xs font-semibold">Read model: balances</p>
                <p className="font-mono text-[10px]">A-81: {inr(balance(events, events.length))}</p>
              </div>
              <div className={box(f.show.includes("categories"), "border-viz-meta bg-viz-meta/10")}>
                <p className="text-xs font-semibold">Read model: spend by category</p>
                <p className="font-mono text-[10px]">
                  {Object.entries(cats)
                    .map(([k, v]) => `${k} ${inr(v)}`)
                    .join(" · ")}
                </p>
              </div>
            </div>
          </div>
          <FrameCaption frameKey={s.frame ?? 0} title={f.title}>
            {f.text}
          </FrameCaption>
        </div>
      }
    >
      <p>
        Bertrand Meyer&apos;s <Term id="cqs">command-query separation</Term> said a method should
        either change state or answer a question, never both: &ldquo;Asking a question should not
        change the answer.&rdquo; Greg Young named and popularised <Term id="cqrs">CQRS</Term>{" "}
        around 2010, applying the idea to whole models: one for writing, others for reading.
      </p>
      <p>
        Read models are built by <Term id="projection">projections</Term> and are eventually
        consistent with the write side. CQRS and event sourcing pair well, but each works without
        the other, and CQRS doesn&apos;t even need messaging or a second database.
      </p>
    </StepLayout>
  );
}

/* 4 ─ Powerful, and often overused ---------------------------------------------------------------- */

const NOT: string[] = [
  "Simple create, read, update, delete with no need for history or audit",
  "Prototypes and short-lived systems",
  "Screens that need every view updated instantly and consistently",
  "Mostly static reference data, such as lookup tables",
  "Teams new to event-driven systems",
];

export function WhenNot() {
  return (
    <StepLayout
      eyebrow="Explore"
      title="Powerful, and often overused"
      stage={
        <div className="flex flex-1 flex-col justify-center gap-3">
          <div className="border-bad/40 bg-bad/5 rounded-xl border px-4 py-3">
            <p className="text-sm font-semibold">Probably not suitable for</p>
            {NOT.map((n) => (
              <p key={n} className="text-muted mt-1 text-xs">
                − {n}
              </p>
            ))}
          </div>
          <div className="border-line bg-surface rounded-xl border px-4 py-3 text-xs">
            <p className="text-sm font-semibold">Event stores</p>
            <p className="text-muted mt-1">
              KurrentDB (formerly EventStoreDB, renamed 2024–25); Marten, a .NET library on
              PostgreSQL; Axon Server for the Java ecosystem. Many teams build one on a relational
              database or a log such as Kafka.
            </p>
          </div>
        </div>
      }
    >
      <p>
        Fowler&apos;s warning about CQRS: &ldquo;for most systems CQRS adds risky complexity&rdquo;,
        and use it only on parts of a system, a bounded context, not the whole. Microsoft says the
        same of event sourcing: &ldquo;For most systems and most parts of a system, traditional data
        management is sufficient.&rdquo;
      </p>
      <p>
        Where it shines: a payment ledger, an order pipeline, anywhere history, audit and the reason
        for each change matter. Elsewhere, use ordinary tables.
      </p>
    </StepLayout>
  );
}

/* 5 ─ Good fit? ----------------------------------------------------------------------------------- */

export function FitOrNot() {
  return (
    <StepLayout
      eyebrow="Checkpoint"
      title="Good fit?"
      stage={
        <div className="flex flex-1 flex-col justify-center">
          <SortCheckpoint
            id="es-fit"
            prompt="Is event sourcing a good fit for each?"
            categories={[
              { id: "fit", label: "Good fit" },
              { id: "no", label: "Probably overkill" },
            ]}
            items={[
              {
                id: "ledger",
                label: "A wallet's payment ledger, audited by a regulator",
                category: "fit",
                why: "History and audit are the point.",
              },
              {
                id: "claims",
                label: "Insurance claims, where why each status changed matters",
                category: "fit",
                why: "Events capture intent and reasons.",
              },
              {
                id: "profile",
                label: "Users' notification preferences",
                category: "no",
                why: "Simple settings; ordinary updates are fine.",
              },
              {
                id: "catalogue",
                label: "A list of country codes",
                category: "no",
                why: "Static reference data.",
              },
              {
                id: "mvp",
                label: "A six-week prototype to test an idea",
                category: "no",
                why: "Short-lived; complexity without payoff.",
              },
            ]}
            explanation="Use it where history, audit and intent matter; use plain tables everywhere else."
          />
        </div>
      }
    >
      <p>Decide where it pays.</p>
    </StepLayout>
  );
}

/* 6 ─ Wrap ---------------------------------------------------------------------------------------- */

const POINTS: [string, string][] = [
  ["Store what happened", "Events, appended, never edited."],
  ["Derive the state", "Replay to rebuild, or to see any past moment."],
  ["Fix with new events", "Compensating events, like a ledger reversal."],
  ["CQRS", "Separate models for writing and reading; read models catch up."],
  ["Selectively", "Ledgers and pipelines yes; most CRUD no."],
];

export function Wrap() {
  return (
    <StepLayout
      eyebrow="Wrap-up"
      title="What to remember"
      stage={
        <div className="flex flex-1 flex-col justify-center gap-1.5">
          {POINTS.map(([t, d], i) => (
            <motion.div
              key={t}
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.07 * i }}
              className="border-line bg-surface rounded-lg border px-3 py-2"
            >
              <p className="text-sm font-semibold">{t}</p>
              <p className="text-muted text-xs">{d}</p>
            </motion.div>
          ))}
        </div>
      }
    >
      <p>
        Next: when many systems need the same data, who owns it? Shared databases, master data and
        data mesh.
      </p>
    </StepLayout>
  );
}
