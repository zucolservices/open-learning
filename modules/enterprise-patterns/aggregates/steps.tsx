"use client";

import { motion } from "motion/react";
import { useSceneState } from "@/lib/module-sdk";
import { StepLayout } from "@/toolkit/layout/step-layout";
import { SortCheckpoint } from "@/toolkit/checkpoints/sort";
import { Code } from "@/toolkit/controls/stepper";
import { Term } from "@/toolkit/glossary/term";
import { cn } from "@/lib/cn";
import { DESIGNS, run, type Design } from "./model";
import type { AggState } from "./state";

/* 1 ─ The same, or just equal? -------------------------------------------------------------------- */

export function SameOrEqual() {
  return (
    <StepLayout
      eyebrow="Story"
      title="The same, or just equal?"
      stage={
        <div className="grid flex-1 content-center gap-3 sm:grid-cols-2">
          <div className="border-accent bg-accent-soft flex flex-col gap-1.5 rounded-xl border px-4 py-3">
            <p className="text-accent text-[10px] font-semibold uppercase">Entity</p>
            <p className="text-sm font-semibold">Priya, customer #81</p>
            {[
              "2019: Lake Road, 98450 11111",
              "2023: Hill Street, 98450 11111",
              "2026: Hill Street, 99000 22222",
            ].map((l, i) => (
              <motion.p
                key={l}
                initial={{ opacity: 0, x: -4 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2 * i }}
                className="text-muted font-mono text-[11px]"
              >
                {l}
              </motion.p>
            ))}
            <p className="text-xs">Every detail changed. Still the same person.</p>
          </div>
          <div className="border-viz-data bg-viz-data/10 flex flex-col gap-1.5 rounded-xl border px-4 py-3">
            <p className="text-viz-data text-[10px] font-semibold uppercase">Value object</p>
            <p className="text-sm font-semibold">₹500</p>
            <div className="flex gap-2">
              {["note A", "note B"].map((n) => (
                <span
                  key={n}
                  className="border-viz-data/60 rounded border px-2 py-3 font-mono text-[11px]"
                >
                  ₹500 · {n}
                </span>
              ))}
            </div>
            <p className="text-xs">
              Swap them and nothing changes. Equal values are interchangeable.
            </p>
          </div>
        </div>
      }
    >
      <p>
        Lend a friend a ₹500 note and you don&apos;t want that particular note back; any ₹500 will
        do. But if a bank mixes up two customers called Priya, it matters a great deal which one is
        which.
      </p>
      <p>
        That&apos;s the first distinction inside a model. An <Term id="entity">entity</Term> has an
        identity that lasts, &ldquo;a thread of continuity and identity&rdquo; in Evans&apos;s
        words, however its details change. A <Term id="value-object">value object</Term> is
        described only by its attributes, like an amount, a date range or an address, and is best
        treated as immutable: to change it, replace it.
      </p>
    </StepLayout>
  );
}

/* 2 ─ Two clerks, one order ⭐ -------------------------------------------------------------------- */

export function TwoClerks() {
  const [s, set] = useSceneState<AggState>();
  const r = run(s.design);
  return (
    <StepLayout
      eyebrow="Simulation"
      title="Two clerks, one order"
      stage={
        <div className="flex flex-1 flex-col justify-center gap-3">
          <div className="flex flex-wrap gap-1">
            {(Object.keys(DESIGNS) as Design[]).map((k) => (
              <button
                key={k}
                type="button"
                aria-pressed={s.design === k}
                onClick={() => set({ design: k })}
                className={cn(
                  "rounded-md border px-2 py-1 text-[11px]",
                  s.design === k
                    ? "border-accent bg-accent text-accent-fg"
                    : "border-line bg-surface hover:bg-surface-2",
                )}
              >
                {DESIGNS[k]}
              </button>
            ))}
          </div>
          <div className="flex flex-col gap-1 font-mono text-[11px]">
            {r.lines.map((l, i) => (
              <motion.div
                key={s.design + i}
                initial={{ opacity: 0, x: -4 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.07 * i }}
                className={cn(
                  "grid grid-cols-[4.5rem_1fr] gap-2 rounded-md border px-2 py-1",
                  l.tone === "bad"
                    ? "border-bad/50 bg-bad/10"
                    : l.tone === "good"
                      ? "border-good/50 bg-good/10"
                      : "border-line bg-surface",
                )}
              >
                <span
                  className={cn(
                    l.who === "A"
                      ? "text-accent"
                      : l.who === "B"
                        ? "text-viz-compute"
                        : "text-muted",
                  )}
                >
                  {l.who ? `Clerk ${l.who}` : ""}
                </span>
                <span>{l.text}</span>
              </motion.div>
            ))}
          </div>
          <motion.p
            key={s.design}
            initial={{ opacity: 0, y: 4 }}
            animate={{ opacity: 1, y: 0 }}
            className={cn(
              "rounded-xl border px-4 py-3 text-sm",
              r.ok ? "border-good/50 bg-good/10" : "border-bad/50 bg-bad/10",
            )}
          >
            {r.note}
          </motion.p>
          <p className="text-subtle text-[10px]">Illustrative amounts.</p>
        </div>
      }
    >
      <p>
        A business rule says an order&apos;s total may not exceed the customer&apos;s limit of
        ₹10,000. Two clerks add lines to the same order at the same moment. Try three designs.
      </p>
      <p>
        An <Term id="aggregate">aggregate</Term> is a cluster of entities and values that must stay
        consistent together, with one <Term id="aggregate-root">root</Term> that outsiders talk to.
        It&apos;s loaded and saved as a whole, and a version number, checked on every save, makes a
        stale write fail instead of silently winning. That&apos;s{" "}
        <Term id="optimistic-concurrency">optimistic concurrency</Term>.
      </p>
    </StepLayout>
  );
}

/* 3 ─ Four rules of thumb ------------------------------------------------------------------------- */

const RULES: [string, string][] = [
  [
    "Model true invariants in consistency boundaries",
    "Put things in one aggregate only if a rule must hold across them at every moment.",
  ],
  [
    "Design small aggregates",
    "Just the root and the values it needs. Big aggregates mean more clashes and slower loads.",
  ],
  [
    "Reference other aggregates by identity",
    "An order holds a customer ID, not the customer object.",
  ],
  [
    "Use eventual consistency outside the boundary",
    "Other aggregates catch up shortly after, through events, in their own transactions.",
  ],
];

export function FourRules() {
  return (
    <StepLayout
      eyebrow="Explore"
      title="Four rules of thumb"
      stage={
        <div className="flex flex-1 flex-col justify-center gap-2">
          {RULES.map(([t, d], i) => (
            <motion.div
              key={t}
              initial={{ opacity: 0, x: -6 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.08 * i }}
              className="border-line bg-surface grid grid-cols-[1.5rem_1fr] gap-2 rounded-lg border px-3 py-2"
            >
              <span className="text-accent font-mono text-sm">{i + 1}</span>
              <div>
                <p className="text-sm font-semibold">{t}</p>
                <p className="text-muted text-xs">{d}</p>
              </div>
            </motion.div>
          ))}
        </div>
      }
    >
      <p>
        Vaughn Vernon&apos;s 2011 essay &ldquo;Effective Aggregate Design&rdquo; gave four rules of
        thumb, still the standard advice. Aggregates, he wrote, &ldquo;are chiefly about consistency
        boundaries and not driven by a desire to design object graphs.&rdquo;
      </p>
      <p>
        How small? He reports that one team in financial derivatives designed about 70% of its
        aggregates as a single root entity with a few values, and the rest with just two or three
        entities. Not a law, but a hint: start smaller than feels natural. An{" "}
        <Term id="invariant">invariant</Term> that doesn&apos;t truly need to hold instantly
        doesn&apos;t need to share an aggregate.
      </p>
    </StepLayout>
  );
}

/* 4 ─ Repositories and events --------------------------------------------------------------------- */

export function AroundAggregates() {
  return (
    <StepLayout
      eyebrow="Explore"
      title="Repositories and events"
      stage={
        <div className="flex flex-1 flex-col justify-center gap-3">
          <Code>{`order = orders.get("1042")        # repository: load the whole aggregate
order.add_line(sku="TEA-250", qty=2)   # the root checks the rules
orders.save(order)                # fails if someone saved first
# → OrderLineAdded { order: 1042, sku: TEA-250, at: 10:42 }`}</Code>
          <div className="grid gap-2 sm:grid-cols-2">
            <div className="border-line bg-surface rounded-lg border px-3 py-2 text-xs">
              <p className="text-sm font-semibold">Repository</p>
              <p className="text-muted">
                Gives &ldquo;the illusion of an in-memory collection&rdquo; of one kind of
                aggregate. Code asks for an order, not for rows from five tables.
              </p>
            </div>
            <div className="border-line bg-surface rounded-lg border px-3 py-2 text-xs">
              <p className="text-sm font-semibold">Domain event</p>
              <p className="text-muted">
                &ldquo;Something happened that domain experts care about.&rdquo; Immutable, with a
                time and the IDs involved. Other aggregates react to it later.
              </p>
            </div>
          </div>
        </div>
      }
    >
      <p>
        Two more building blocks complete the picture. A <Term id="repository">repository</Term>{" "}
        loads and saves whole aggregates, one per aggregate type that needs it.
      </p>
      <p>
        A <Term id="domain-event">domain event</Term> records something that happened, in the past
        tense. Events are how rule 4 works in practice: the order aggregate says &ldquo;line
        added&rdquo;, and stock and invoicing update themselves in their own time. Events are also
        the raw material for the next module.
      </p>
    </StepLayout>
  );
}

/* 5 ─ Entity or value? ---------------------------------------------------------------------------- */

export function EntityOrValue() {
  return (
    <StepLayout
      eyebrow="Checkpoint"
      title="Entity or value?"
      stage={
        <div className="flex flex-1 flex-col justify-center">
          <SortCheckpoint
            id="entity-or-value"
            prompt="In a food-delivery app, is each an entity or a value object?"
            categories={[
              { id: "entity", label: "Entity" },
              { id: "value", label: "Value object" },
            ]}
            items={[
              {
                id: "rider",
                label: "A delivery rider",
                category: "entity",
                why: "The same rider over time, whatever their phone or vehicle.",
              },
              {
                id: "order",
                label: "An order",
                category: "entity",
                why: "Tracked from placed to delivered; identity matters.",
              },
              {
                id: "money",
                label: "₹249.00",
                category: "value",
                why: "Any ₹249.00 is as good as another.",
              },
              {
                id: "gps",
                label: "A GPS position (lat, long)",
                category: "value",
                why: "Defined entirely by its numbers.",
              },
              {
                id: "slot",
                label: "A delivery time slot, 7–8 pm",
                category: "value",
                why: "Two identical slots are interchangeable.",
              },
            ]}
            explanation="Ask: if every attribute changed, would it still be the same thing? Yes: entity. If two with the same attributes are interchangeable: value object."
          />
        </div>
      }
    >
      <p>
        The same idea can be either, depending on the domain: an address is a value for a shop, but
        might be an entity for a postal service that tracks each building.
      </p>
    </StepLayout>
  );
}

/* 6 ─ Wrap ---------------------------------------------------------------------------------------- */

const POINTS: [string, string][] = [
  ["Entity", "Identity that lasts while details change."],
  ["Value object", "Defined by its attributes; replace, don't modify."],
  ["Aggregate", "A consistency boundary with one root, saved as a whole."],
  ["Small, by ID", "Small aggregates, linked by identity."],
  ["Eventually consistent between", "Events update other aggregates afterwards."],
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
        Next: a workshop technique that finds aggregates, events and boundaries with nothing more
        than a long wall and a lot of sticky notes.
      </p>
    </StepLayout>
  );
}
