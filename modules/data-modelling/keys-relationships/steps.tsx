"use client";

import { motion } from "motion/react";
import { useSceneState } from "@/lib/module-sdk";
import { StepLayout } from "@/toolkit/layout/step-layout";
import { SortCheckpoint } from "@/toolkit/checkpoints/sort";
import { Code } from "@/toolkit/controls/stepper";
import { Term } from "@/toolkit/glossary/term";
import { cn } from "@/lib/cn";
import { ACTIONS, CANDIDATES, apply, replay, type ActionId } from "./model";
import type { KeyState } from "./state";

/* 1 ─ Numbered lockers ---------------------------------------------------------------------------- */

export function Lockers() {
  return (
    <StepLayout
      eyebrow="Story"
      title="Numbered lockers"
      stage={
        <div className="flex flex-1 flex-col items-center justify-center gap-4">
          <div className="flex gap-2">
            {[101, 102, 103, 104].map((n, i) => (
              <motion.div
                key={n}
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 * i }}
                className={cn(
                  "flex h-20 w-14 flex-col items-center justify-between rounded-md border p-1.5",
                  n === 103 ? "border-accent bg-accent-soft" : "border-line bg-surface",
                )}
              >
                <span className="font-mono text-xs font-semibold">{n}</span>
                <span className="bg-line-strong size-1.5 rounded-full" />
              </motion.div>
            ))}
          </div>
          <div className="border-line bg-surface rounded-lg border px-3 py-2 font-mono text-xs">
            claim ticket: locker 103
          </div>
        </div>
      }
    >
      <p>
        At a swimming pool, every locker has a number nobody else has, and your ticket just says
        &ldquo;103&rdquo;. The ticket doesn&apos;t describe your bag; it points to the locker.
      </p>
      <p>
        Tables work the same way. A <Term id="primary-key">primary key</Term> is each row&apos;s
        locker number: unique and never empty. A <Term id="foreign-key">foreign key</Term> is the
        claim ticket: a column in another table that must match an existing key. Together they keep{" "}
        <Term id="referential-integrity">referential integrity</Term>: no ticket for a locker that
        doesn&apos;t exist.
      </p>
    </StepLayout>
  );
}

/* 2 ─ Try to break the links ⭐ ------------------------------------------------------------------- */

function Mini({
  title,
  head,
  rows,
  bad,
}: {
  title: string;
  head: string[];
  rows: (string | number)[][];
  bad?: (r: (string | number)[]) => boolean;
}) {
  return (
    <div className="border-line overflow-hidden rounded-lg border">
      <p className="bg-surface-2 px-2 py-0.5 text-[10px] font-semibold">{title}</p>
      <table className="w-full font-mono text-[10px]">
        <thead>
          <tr className="text-muted">
            {head.map((h) => (
              <th key={h} className="px-2 text-left font-normal">
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((r, i) => (
            <motion.tr
              key={r.join("-") + i}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className={cn("border-line border-t", bad?.(r) && "bg-bad/15 text-bad")}
            >
              {r.map((c, j) => (
                <td key={j} className="px-2 py-0.5">
                  {c}
                </td>
              ))}
            </motion.tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export function Integrity() {
  const [s, set] = useSceneState<KeyState>();
  const log = s.log ?? [];
  const prev = replay(log.slice(0, -1), s.enforce);
  const last = log.length ? apply(prev.db, log[log.length - 1], s.enforce) : null;
  const { db } = replay(log, s.enforce);
  const orphans = last?.orphans ?? [];
  const custIds = new Set(db.customers.map((c) => c.id));
  const orderIds = new Set(db.orders.map((o) => o.id));
  const prodNos = new Set(db.products.map((p) => p.no));
  const dupIds = db.customers
    .filter((c, i) => db.customers.findIndex((x) => x.id === c.id) !== i)
    .map((c) => c.id);
  return (
    <StepLayout
      eyebrow="Build and connect"
      title="Try to break the links"
      stage={
        <div className="flex flex-1 flex-col justify-center gap-3">
          <div className="flex flex-wrap items-center gap-1.5 text-xs">
            <button
              type="button"
              aria-pressed={s.enforce}
              onClick={() => set({ enforce: !s.enforce, log: [] })}
              className={cn(
                "rounded-md border px-3 py-1 font-semibold",
                s.enforce ? "border-good bg-good/15 text-good" : "border-bad bg-bad/10 text-bad",
              )}
            >
              constraints {s.enforce ? "on" : "off"}
            </button>
            <button
              type="button"
              onClick={() => set({ log: [] })}
              className="border-line rounded-md border px-3 py-1"
            >
              reset data
            </button>
          </div>
          <div className="flex flex-wrap gap-1">
            {ACTIONS.map((a) => (
              <button
                key={a.id}
                type="button"
                onClick={() => set({ log: [...log, a.id as ActionId] })}
                className="border-line hover:bg-surface-2 rounded-full border px-2.5 py-1 text-[11px]"
              >
                {a.label}
              </button>
            ))}
          </div>
          <div className="grid gap-2 sm:grid-cols-2">
            <Mini
              title="customers (PK id, email unique)"
              head={["id", "name", "email"]}
              rows={db.customers.map((c) => [c.id, c.name, c.email])}
              bad={(r) => dupIds.includes(r[0] as number)}
            />
            <Mini
              title="products (PK no)"
              head={["no", "name"]}
              rows={db.products.map((p) => [p.no, p.name])}
            />
            <Mini
              title="orders (FK customer_id)"
              head={["id", "customer_id"]}
              rows={db.orders.map((o) => [o.id, o.customer_id])}
              bad={(r) => !custIds.has(r[1] as number)}
            />
            <Mini
              title="order_items (PK order_id + product_no)"
              head={["order_id", "product_no", "qty"]}
              rows={db.items.map((i) => [i.order_id, i.product_no, i.qty])}
              bad={(r) => !orderIds.has(r[0] as number) || !prodNos.has(r[1] as number)}
            />
          </div>
          {last && (
            <motion.div
              key={log.length}
              initial={{ opacity: 0, y: 4 }}
              animate={{ opacity: 1, y: 0 }}
              className={cn(
                "rounded-lg border px-3 py-2 text-xs",
                last.ok
                  ? orphans.length || dupIds.length
                    ? "border-bad bg-bad/10"
                    : "border-good bg-good/10"
                  : "border-viz-compute bg-viz-compute/10",
              )}
            >
              <p className="font-mono text-[11px]">
                {ACTIONS.find((a) => a.id === log[log.length - 1])?.sql}
              </p>
              <p className="mt-1 font-semibold">{last.msg}</p>
              {orphans.length > 0 && (
                <p className="text-bad mt-1">Orphaned rows: {orphans.join(", ")}</p>
              )}
            </motion.div>
          )}
        </div>
      }
    >
      <p>
        Four linked tables. Try each action with constraints on, where the database checks every
        key, then reset, switch them off and try again.
      </p>
      <p>
        With constraints on, bad rows are refused, and deleting an order takes its items with it (ON
        DELETE CASCADE) while a product still in use can&apos;t be deleted (RESTRICT). With them
        off, everything is accepted and the mess shows up later, in red.
      </p>
    </StepLayout>
  );
}

/* 3 ─ Choosing a primary key ---------------------------------------------------------------------- */

export function ChooseKey() {
  const [s, set] = useSceneState<KeyState>();
  const c = CANDIDATES[s.cand] ?? CANDIDATES[0];
  return (
    <StepLayout
      eyebrow="Explore"
      title="Choosing a primary key"
      stage={
        <div className="flex flex-1 flex-col justify-center gap-3">
          <p className="text-muted text-xs">
            Library members. Which column should be the primary key?
          </p>
          <div className="flex flex-wrap gap-1.5">
            {CANDIDATES.map((x, i) => (
              <button
                key={x.col}
                type="button"
                aria-pressed={s.cand === i}
                onClick={() => set({ cand: i })}
                className={cn(
                  "rounded-full border px-3 py-1 font-mono text-[11px]",
                  s.cand === i ? "border-accent bg-accent-soft" : "border-line",
                )}
              >
                {x.col}
              </button>
            ))}
          </div>
          <motion.div
            key={c.col}
            initial={{ opacity: 0, y: 4 }}
            animate={{ opacity: 1, y: 0 }}
            className={cn(
              "rounded-xl border px-4 py-3 text-xs",
              c.good ? "border-good bg-good/10" : "border-line bg-surface",
            )}
          >
            <div className="grid grid-cols-2 gap-2">
              <div>
                <p className="text-muted text-[10px]">unique?</p>
                <p className="font-semibold">{c.unique}</p>
              </div>
              <div>
                <p className="text-muted text-[10px]">stable?</p>
                <p className="font-semibold">{c.stable}</p>
              </div>
            </div>
            <p className="mt-2">{c.verdict}</p>
          </motion.div>
        </div>
      }
    >
      <p>
        Any column, or smallest set of columns, that identifies each row is a{" "}
        <Term id="candidate-key">candidate key</Term>. The primary key is the one you pick; keep the
        others unique with constraints.
      </p>
      <p>
        A <Term id="natural-key">natural key</Term> comes from the real world (an ISBN, an email). A{" "}
        <Term id="surrogate-key">surrogate key</Term> is a meaningless generated number. In data
        warehouses Kimball argued joins should always use surrogates, because source systems reuse
        and reformat their keys. In everyday applications both are legitimate.
      </p>
    </StepLayout>
  );
}

/* 4 ─ Many-to-many -------------------------------------------------------------------------------- */

export function ManyToMany() {
  return (
    <StepLayout
      eyebrow="Explore"
      title="Many-to-many"
      stage={
        <div className="flex flex-1 flex-col justify-center gap-3">
          <div className="flex items-center justify-center gap-2 text-xs">
            <div className="border-viz-data bg-viz-data/10 rounded-lg border px-3 py-2 font-semibold">
              orders
            </div>
            <span className="text-accent font-mono">—&lt;</span>
            <div className="border-accent bg-accent-soft rounded-lg border px-3 py-2 text-center">
              <p className="font-semibold">order_items</p>
              <p className="text-muted text-[10px]">one row per order + product</p>
            </div>
            <span className="text-accent font-mono">&gt;—</span>
            <div className="border-viz-data bg-viz-data/10 rounded-lg border px-3 py-2 font-semibold">
              products
            </div>
          </div>
          <Code>{`CREATE TABLE order_items (
  product_no integer REFERENCES products ON DELETE RESTRICT,
  order_id   integer REFERENCES orders   ON DELETE CASCADE,
  quantity   integer,
  PRIMARY KEY (product_no, order_id)
);`}</Code>
          <p className="text-subtle text-[10px]">
            Adapted from the PostgreSQL documentation&apos;s own example.
          </p>
        </div>
      }
    >
      <p>
        An order holds many products, and a product appears in many orders. No single column can
        hold that, so a <Term id="junction-table">junction table</Term> sits in between, with a
        foreign key to each side. Its primary key is the pair: a{" "}
        <Term id="composite-key">composite key</Term>.
      </p>
      <p>
        The junction table often carries facts of its own, like the quantity. You&apos;ll also hear
        it called an associative, link or bridge table.
      </p>
    </StepLayout>
  );
}

/* 5 ─ Good key or not? ---------------------------------------------------------------------------- */

export function GoodKey() {
  return (
    <StepLayout
      eyebrow="Checkpoint"
      title="Good key or not?"
      stage={
        <div className="flex flex-1 flex-col justify-center">
          <SortCheckpoint
            id="good-key"
            prompt="Would each make a good primary key?"
            categories={[
              { id: "good", label: "Good primary key" },
              { id: "poor", label: "Poor primary key" },
            ]}
            items={[
              {
                id: "gen",
                label: "A generated customer_id",
                category: "good",
                why: "Unique, never empty, never changes.",
              },
              {
                id: "name",
                label: "Customer name",
                category: "poor",
                why: "Two people can share a name.",
              },
              {
                id: "email",
                label: "Email address",
                category: "poor",
                why: "Unique, but people change it; keep it as a unique column instead.",
              },
              {
                id: "pair",
                label: "(order_id, product_no) in order_items",
                category: "good",
                why: "A composite key: each product once per order.",
              },
              {
                id: "phone",
                label: "Phone number",
                category: "poor",
                why: "Shared and changeable.",
              },
              {
                id: "isbn",
                label: "ISBN for a book edition",
                category: "good",
                why: "A natural key that is unique and stable for an edition.",
              },
            ]}
            explanation="A primary key must be unique and never empty, and ideally never change. Generated ids and well-defined natural codes work; personal details usually don't."
          />
        </div>
      }
    >
      <p>Sort the columns.</p>
    </StepLayout>
  );
}

/* 6 ─ Wrap ---------------------------------------------------------------------------------------- */

const POINTS: [string, string][] = [
  ["Primary key", "Unique and not null; one per table."],
  ["Foreign key", "Must match a row elsewhere: referential integrity."],
  ["Candidate keys", "Pick one as primary; keep the others unique."],
  ["Natural or surrogate", "Surrogates in warehouses; both fine in apps."],
  ["Many-to-many", "A junction table with a composite key."],
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
      <p>Next: normalisation, a method for deciding which facts belong in which table.</p>
    </StepLayout>
  );
}
