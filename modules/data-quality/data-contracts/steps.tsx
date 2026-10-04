"use client";

import { motion } from "motion/react";
import { useSceneState } from "@/lib/module-sdk";
import { StepLayout } from "@/toolkit/layout/step-layout";
import { SortCheckpoint } from "@/toolkit/checkpoints/sort";
import { Code } from "@/toolkit/controls/stepper";
import { Term } from "@/toolkit/glossary/term";
import { cn } from "@/lib/cn";
import { CHANGES, CLAUSES, HEADER, evaluate, type Clause } from "./model";
import type { ContractState } from "./state";

/* 1 ─ The tenancy agreement ----------------------------------------------------------------------- */

export function Tenancy() {
  return (
    <StepLayout
      eyebrow="Story"
      title="The tenancy agreement"
      stage={
        <div className="grid flex-1 content-center gap-3 sm:grid-cols-2">
          <div className="border-line bg-surface rounded-xl border px-4 py-3 text-xs">
            <p className="text-sm font-semibold">No agreement</p>
            <p className="text-muted mt-1">
              The landlord decides to repaint, change the locks and double the rent. The tenant
              finds out at the door.
            </p>
          </div>
          <div className="border-accent bg-accent-soft rounded-xl border px-4 py-3 text-xs">
            <p className="text-sm font-semibold">A written agreement</p>
            <p className="text-muted mt-1">
              What&apos;s provided, what can change, how much notice is given, and who to call when the
              boiler breaks.
            </p>
          </div>
        </div>
      }
    >
      <p>
        Without a tenancy agreement, a landlord can change anything and the tenant learns about it
        too late. With one, both sides know what&apos;s promised, how changes are announced and who
        to call.
      </p>
      <p>
        Most data breaks the first way: a team changes its database and never knows who depended on
        it. A <Term id="data-contract">data contract</Term> is the written agreement between a{" "}
        <Term id="data-producer">producer</Term> and its consumers: what the data looks like, what
        it means, how fresh it is and who owns it, checked automatically.
      </p>
    </StepLayout>
  );
}

/* 2 ─ Write a contract ⭐ ------------------------------------------------------------------------- */

export function WriteContract() {
  const [s, set] = useSceneState<ContractState>();
  const clauses = s.clauses ?? [];
  const toggle = (c: Clause) =>
    set({ clauses: clauses.includes(c) ? clauses.filter((x) => x !== c) : [...clauses, c] });
  const chg = CHANGES.find((x) => x.id === s.change) ?? CHANGES[0];
  const r = evaluate(chg, clauses);
  const yaml = [
    HEADER,
    ...(Object.keys(CLAUSES) as Clause[])
      .filter((c) => clauses.includes(c))
      .map((c) => CLAUSES[c].yaml),
  ].join("\n");
  const caughtAll = CHANGES.filter((c) => evaluate(c, clauses).status !== "broke").length;
  return (
    <StepLayout
      eyebrow="Build and connect"
      title="Write a contract"
      stage={
        <div className="flex flex-1 flex-col justify-center gap-3">
          <div className="grid gap-3 lg:grid-cols-2">
            <div className="flex flex-col gap-2">
              <p className="text-muted text-[10px]">CONTRACT CLAUSES</p>
              <div className="flex flex-wrap gap-1">
                {(Object.keys(CLAUSES) as Clause[]).map((c) => (
                  <button
                    key={c}
                    type="button"
                    aria-pressed={clauses.includes(c)}
                    onClick={() => toggle(c)}
                    className={cn(
                      "rounded-md border px-2 py-1 text-[11px]",
                      clauses.includes(c) ? "border-accent bg-accent-soft" : "border-line",
                    )}
                  >
                    {clauses.includes(c) ? "✓ " : "+ "}
                    {CLAUSES[c].label}
                  </button>
                ))}
              </div>
              <div className="max-h-64 overflow-y-auto">
                <Code>{yaml}</Code>
              </div>
            </div>
            <div className="flex flex-col gap-2">
              <p className="text-muted text-[10px]">THE CHECKOUT TEAM WANTS TO…</p>
              <div className="flex flex-col gap-1">
                {CHANGES.map((c) => {
                  const e = evaluate(c, clauses);
                  return (
                    <button
                      key={c.id}
                      type="button"
                      aria-pressed={s.change === c.id}
                      onClick={() => set({ change: c.id })}
                      className={cn(
                        "flex items-center justify-between gap-2 rounded-lg border px-3 py-1.5 text-left text-xs",
                        s.change === c.id
                          ? "border-accent bg-accent-soft"
                          : "border-line bg-surface",
                      )}
                    >
                      <span>{c.label}</span>
                      <span
                        className={cn(
                          "text-[10px] font-semibold",
                          e.status === "broke" ? "text-bad" : "text-good",
                        )}
                      >
                        {e.status === "broke" ? "breaks" : e.status === "safe" ? "safe" : "caught"}
                      </span>
                    </button>
                  );
                })}
              </div>
              <motion.div
                key={`${s.change}-${clauses.join()}`}
                initial={{ opacity: 0, y: 4 }}
                animate={{ opacity: 1, y: 0 }}
                className={cn(
                  "rounded-xl border px-3 py-2 text-xs",
                  r.status === "broke" ? "border-bad bg-bad/10" : "border-good bg-good/10",
                )}
              >
                <p>{r.text}</p>
                {r.status !== "safe" && (
                  <p className="text-muted mt-1 text-[11px]">
                    {"owner" in r && r.owner
                      ? "Consumers know who to ask: #orders-data."
                      : "And nobody knows who owns this feed."}
                  </p>
                )}
              </motion.div>
              <p className="text-muted text-[11px]">
                {caughtAll} of {CHANGES.length} changes handled safely.
              </p>
            </div>
          </div>
          <p className="text-subtle text-[10px]">
            Field names follow the Open Data Contract Standard v3.2; the contract is shortened for
            teaching.
          </p>
        </div>
      }
    >
      <p>
        Build a contract for the checkout team&apos;s orders feed, clause by clause, then try the
        changes they want to make. Without the right clause a change breaks a consumer silently;
        with it, the producer finds out before shipping.
      </p>
      <p>
        A contract usually covers the schema, quality rules, service levels such as freshness, and
        the owning team. It doesn&apos;t freeze the data: safe changes like adding a column are
        fine, and breaking ones become a new version, agreed in advance.
      </p>
    </StepLayout>
  );
}

/* 3 ─ Where contracts came from ------------------------------------------------------------------- */

export function Origins() {
  const items: [string, string][] = [
    [
      "2021",
      "Andrew Jones at GoCardless writes publicly about data contracts; his December post explains how they improved data quality.",
    ],
    [
      "2022",
      "Chad Sanderson at Convoy, “The Rise of Data Contracts”: copying service databases straight into analytics made them a “non-consensual API”.",
    ],
    [
      "2023",
      "Jones's book, Driving Data Quality with Data Contracts. PayPal's open-source contract template becomes the start of an open standard.",
    ],
    [
      "2024",
      "Open Data Contract Standard (ODCS) v3.0.0, under Bitol at the Linux Foundation's LF AI & Data.",
    ],
    [
      "2026",
      "Bitol graduates (July); ODCS v3.2.0 (September). The older Data Contract Specification is deprecated in favour of ODCS.",
    ],
  ];
  return (
    <StepLayout
      eyebrow="Explore"
      title="Where contracts came from"
      stage={
        <div className="flex flex-1 flex-col justify-center gap-2">
          {items.map(([y, t], i) => (
            <motion.div
              key={y}
              initial={{ opacity: 0, x: -6 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1 * i }}
              className="border-line bg-surface grid grid-cols-[3.5rem_1fr] gap-2 rounded-lg border px-3 py-2 text-xs"
            >
              <span className="text-accent font-mono">{y}</span>
              <span className="text-muted">{t}</span>
            </motion.div>
          ))}
        </div>
      }
    >
      <p>
        The idea comes from software, where services publish APIs instead of letting others read
        their internal databases. Data contracts apply the same discipline to data.
      </p>
      <p>
        Tooling has grown around the open standard: the open-source datacontract-cli, for example,
        can lint a contract, test real data against it and convert it to other formats.
      </p>
    </StepLayout>
  );
}

/* 4 ─ Contracts inside a project ------------------------------------------------------------------ */

export function DbtContracts() {
  return (
    <StepLayout
      eyebrow="Explore"
      title="Contracts inside a project"
      stage={
        <div className="flex flex-1 flex-col justify-center gap-3">
          <Code>{`models:
  - name: fct_orders
    config:
      contract:
        enforced: true
    columns:
      - name: order_id
        data_type: varchar
        constraints:
          - type: not_null
      - name: amount
        data_type: numeric`}</Code>
          <div className="grid gap-2 sm:grid-cols-2">
            <div className="border-line bg-surface rounded-lg border px-3 py-2 text-xs">
              <p className="font-semibold">Checks</p>
              <p className="text-muted">
                Column names and types, at build time: dbt won&apos;t build a model whose shape
                doesn&apos;t match.
              </p>
            </div>
            <div className="border-line bg-surface rounded-lg border px-3 py-2 text-xs">
              <p className="font-semibold">Doesn&apos;t check</p>
              <p className="text-muted">
                Values, freshness or ownership; and it doesn&apos;t apply to Python or ephemeral
                models.
              </p>
            </div>
          </div>
        </div>
      }
    >
      <p>
        dbt model contracts (since dbt 1.5, April 2023) are a narrower cousin. Mark a model&apos;s
        contract as enforced and dbt refuses to build it if its columns or types drift from the
        YAML.
      </p>
      <p>
        Think of them as the schema clause of a full contract, guarding a model that many people
        depend on (the Data Modelling track covers versioning such models).
      </p>
    </StepLayout>
  );
}

/* 5 ─ In the contract or not? --------------------------------------------------------------------- */

export function InContract() {
  return (
    <StepLayout
      eyebrow="Checkpoint"
      title="In the contract or not?"
      stage={
        <div className="flex flex-1 flex-col justify-center">
          <SortCheckpoint
            id="in-contract"
            prompt="Does each belong in a data contract?"
            categories={[
              { id: "in", label: "In the contract" },
              { id: "out", label: "Not in the contract" },
            ]}
            items={[
              {
                id: "types",
                label: "Column names and types",
                category: "in",
                why: "The shape consumers rely on.",
              },
              {
                id: "fresh",
                label: "Data is no more than a day old",
                category: "in",
                why: "A service-level promise.",
              },
              {
                id: "owner",
                label: "The owning team and where to ask questions",
                category: "in",
                why: "Someone to call.",
              },
              {
                id: "sql",
                label: "The producer's internal SQL and table layout",
                category: "out",
                why: "Internals can change freely; that's the point.",
              },
              {
                id: "chart",
                label: "Which chart a consumer uses on their dashboard",
                category: "out",
                why: "That's the consumer's business.",
              },
              {
                id: "values",
                label: "The allowed values of status",
                category: "in",
                why: "Meaning consumers depend on.",
              },
            ]}
            explanation="A contract promises the interface (shape, meaning, quality, freshness, ownership), not the producer's internals or the consumer's use."
          />
        </div>
      }
    >
      <p>Sort the items.</p>
    </StepLayout>
  );
}

/* 6 ─ Wrap ---------------------------------------------------------------------------------------- */

const POINTS: [string, string][] = [
  ["An API for data", "A written, checked promise from producer to consumers."],
  ["What it covers", "Schema, meaning, quality rules, freshness, owner."],
  ["Checked automatically", "Breaking changes fail before they ship."],
  ["Open standard", "ODCS v3.2 (Bitol, Linux Foundation)."],
  ["Change by version", "Safe changes are fine; breaking ones are agreed first."],
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
      <p>Next: which schema changes are safe, and how registries enforce compatibility.</p>
    </StepLayout>
  );
}
