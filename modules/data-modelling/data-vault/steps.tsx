"use client";

import { motion } from "motion/react";
import { useSceneState } from "@/lib/module-sdk";
import { StepLayout } from "@/toolkit/layout/step-layout";
import { SortCheckpoint } from "@/toolkit/checkpoints/sort";
import { FrameCaption, Stepper } from "@/toolkit/controls/stepper";
import { Term } from "@/toolkit/glossary/term";
import { cn } from "@/lib/cn";
import { DV1, DV2, LOADS, vault, type Table } from "./model";
import type { DVState } from "./state";

/* 1 ─ Never rub anything out ---------------------------------------------------------------------- */

export function Ledger() {
  return (
    <StepLayout
      eyebrow="Story"
      title="Never rub anything out"
      stage={
        <div className="flex flex-1 items-center justify-center">
          <div className="border-line bg-surface w-72 rounded-lg border px-4 py-3 font-mono text-[11px]">
            {[
              ["5 Jan", "Asha, Pune", "CRM"],
              ["10 Feb", "order O-900 by Asha", "shop"],
              ["1 Jul", "Asha, Mumbai", "CRM"],
              ["1 Sep", "Asha: 1,200 points", "loyalty"],
            ].map(([d, t, src], i) => (
              <motion.div
                key={d}
                initial={{ opacity: 0, y: -4 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 * i }}
                className="border-line grid grid-cols-[3.5rem_1fr_3.5rem] gap-2 border-b py-1"
              >
                <span className="text-muted">{d}</span>
                <span>{t}</span>
                <span className="text-accent text-right">{src}</span>
              </motion.div>
            ))}
          </div>
        </div>
      }
    >
      <p>
        An auditor&apos;s ledger is written in ink. Nothing is rubbed out; corrections are new
        lines, each with a date and who made it. Years later you can reconstruct exactly what was
        known when.
      </p>
      <p>
        <Term id="data-vault">Data Vault</Term>, invented by Dan Linstedt in the 1990s and published
        in 2000, models a warehouse that way. Business keys go in <Term id="hub">hubs</Term>,
        relationships in <Term id="link-table">links</Term>, and descriptive history in{" "}
        <Term id="satellite">satellites</Term>. Every row records its load date and record source.
      </p>
    </StepLayout>
  );
}

/* 2 ─ Load a vault ⭐ ----------------------------------------------------------------------------- */

const KIND: Record<Table["kind"], string> = {
  hub: "border-viz-data bg-viz-data/10",
  link: "border-viz-compute bg-viz-compute/10",
  sat: "border-viz-meta bg-viz-meta/10",
};

export function LoadVault() {
  const [s, set] = useSceneState<DVState>();
  const tables = vault(s.load);
  const L = LOADS[s.load];
  return (
    <StepLayout
      eyebrow="Build and connect"
      title="Load a vault"
      stage={
        <div className="flex flex-1 flex-col justify-center gap-3">
          <Stepper
            step={s.load}
            count={LOADS.length}
            onChange={(n) => set({ load: n })}
            label={L.title}
          />
          <div className="grid min-h-48 gap-2 sm:grid-cols-2">
            {tables.length === 0 && (
              <p className="text-subtle col-span-2 self-center text-center text-xs">
                Step forward to load the first source.
              </p>
            )}
            {tables.map((t) => (
              <motion.div
                key={t.name}
                layout
                initial={{ opacity: 0, scale: 0.97 }}
                animate={{ opacity: 1, scale: 1 }}
                className={cn("overflow-x-auto rounded-lg border", KIND[t.kind])}
              >
                <p className="px-2 py-0.5 font-mono text-[10px] font-semibold">
                  {t.name} <span className="text-muted font-normal">· {t.kind}</span>
                </p>
                <table className="w-full font-mono text-[9px]">
                  <thead>
                    <tr className="text-muted">
                      {t.head.map((c) => (
                        <th key={c} className="px-1.5 text-left font-normal whitespace-nowrap">
                          {c}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {t.rows.map((r) => (
                      <motion.tr
                        key={r.cells.join()}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className={cn(
                          "border-line border-t",
                          r.load === s.load && "bg-accent-soft",
                        )}
                      >
                        {r.cells.map((c, j) => (
                          <td key={j} className="px-1.5 whitespace-nowrap">
                            {c}
                          </td>
                        ))}
                      </motion.tr>
                    ))}
                  </tbody>
                </table>
              </motion.div>
            ))}
          </div>
          <FrameCaption frameKey={s.load} title={L.title}>
            {L.note}
          </FrameCaption>
          <p className="text-subtle text-[10px]">
            Highlighted rows arrived in this load. The six-character keys stand in for hashes of the
            business keys.
          </p>
        </div>
      }
    >
      <p>
        Step through four loads: customers from a CRM, orders from the shop, a change of address,
        then a brand-new source. Watch which tables grow and which never change.
      </p>
      <p>
        Hubs and links are the skeleton and rarely change. Satellites are append-only: a change adds
        a row, like a type 2 dimension, so the full history is always there. A new source adds a
        satellite; nothing already built has to be redesigned.
      </p>
    </StepLayout>
  );
}

/* 3 ─ Why hash keys? ------------------------------------------------------------------------------ */

export function HashKeys() {
  const [s, set] = useSceneState<DVState>();
  const plan = s.v2 ? DV2 : DV1;
  const end = Math.max(...plan.map((p) => p.end));
  return (
    <StepLayout
      eyebrow="Explore"
      title="Why hash keys?"
      stage={
        <div className="flex flex-1 flex-col justify-center gap-3">
          <div className="flex gap-1.5">
            {[
              [false, "Data Vault 1.0: sequence numbers"],
              [true, "Data Vault 2.0: hash keys"],
            ].map(([v, l]) => (
              <button
                key={String(v)}
                type="button"
                aria-pressed={s.v2 === v}
                onClick={() => set({ v2: v as boolean })}
                className={cn(
                  "rounded-full border px-3 py-1 text-xs",
                  s.v2 === v ? "border-accent bg-accent-soft" : "border-line",
                )}
              >
                {l as string}
              </button>
            ))}
          </div>
          <div className="border-line bg-surface flex flex-col gap-1.5 rounded-xl border px-3 py-3">
            {plan.map((p) => (
              <div key={p.name} className="grid grid-cols-[5rem_1fr] items-center gap-2 text-xs">
                <span>{p.name}</span>
                <div className="relative h-3">
                  <motion.div
                    layout
                    className="bg-viz-data absolute h-full rounded"
                    style={{
                      left: `${(p.start / 7) * 100}%`,
                      width: `${((p.end - p.start) / 7) * 100}%`,
                    }}
                  />
                </div>
              </div>
            ))}
            <p className="text-muted mt-1 text-[11px]">
              Load finishes at step {end} of 7 (illustrative).
            </p>
          </div>
        </div>
      }
    >
      <p>
        In Data Vault 1.0 a hub assigned sequence numbers, so links and satellites had to wait for
        the hubs to load and look their numbers up. Data Vault 2.0 (2013) uses a hash of the
        business key instead: anyone can compute it, so hubs, links and satellites can load in
        parallel.
      </p>
      <p>
        A &ldquo;hash diff&rdquo; of all a satellite&apos;s attributes also shows in one comparison
        whether anything changed. The method is described in Linstedt and Olschimke&apos;s 2015
        book; the Data Vault Alliance now teaches version 2.1.
      </p>
    </StepLayout>
  );
}

/* 4 ─ Vault, then marts --------------------------------------------------------------------------- */

export function VaultThenMarts() {
  const layers: [string, string, string][] = [
    [
      "Raw vault",
      "Hubs, links and satellites loaded as the sources say: all the data, all the time.",
      "border-viz-data bg-viz-data/10",
    ],
    [
      "Business vault",
      "Business rules applied, plus helper tables for querying history.",
      "border-viz-compute bg-viz-compute/10",
    ],
    [
      "Star-schema marts",
      "What analysts actually query. Built from the vault, rebuildable at any time.",
      "border-viz-meta bg-viz-meta/10",
    ],
  ];
  return (
    <StepLayout
      eyebrow="Explore"
      title="Vault, then marts"
      stage={
        <div className="flex flex-1 flex-col justify-center gap-2">
          {layers.map(([t, d, c], i) => (
            <motion.div
              key={t}
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.15 * i }}
              className={cn("rounded-xl border px-4 py-3", c)}
            >
              <p className="text-sm font-semibold">{t}</p>
              <p className="text-muted text-xs">{d}</p>
            </motion.div>
          ))}
        </div>
      }
    >
      <p>
        People rarely query a vault directly: dozens of hubs, links and satellites make awkward
        reports. The vault is the integration and history layer; star schemas on top are for users.
        Databricks, for example, places the vault in the Silver layer of a lakehouse and Kimball
        marts in Gold.
      </p>
      <p>
        It fits best with many changing sources and strict audit needs. For a handful of stable
        sources it can be more machinery than you need.
      </p>
    </StepLayout>
  );
}

/* 5 ─ Hub, link or satellite? --------------------------------------------------------------------- */

export function HubLinkSat() {
  return (
    <StepLayout
      eyebrow="Checkpoint"
      title="Hub, link or satellite?"
      stage={
        <div className="flex flex-1 flex-col justify-center">
          <SortCheckpoint
            id="hub-link-sat"
            prompt="Where does each belong in a Data Vault?"
            categories={[
              { id: "hub", label: "Hub" },
              { id: "link", label: "Link" },
              { id: "sat", label: "Satellite" },
            ]}
            items={[
              {
                id: "custno",
                label: "The list of customer numbers",
                category: "hub",
                why: "Unique business keys.",
              },
              {
                id: "addr",
                label: "A customer's address and phone, with load dates",
                category: "sat",
                why: "Descriptive, changing attributes.",
              },
              {
                id: "placed",
                label: "Which customer placed which order",
                category: "link",
                why: "A relationship between hubs.",
              },
              {
                id: "vin",
                label: "Vehicle identification numbers",
                category: "hub",
                why: "Business keys again.",
              },
              {
                id: "status",
                label: "An order's status as it changes over time",
                category: "sat",
                why: "History hanging off the order hub.",
              },
              {
                id: "booking",
                label: "A booking connecting a passenger, a flight and a seat",
                category: "link",
                why: "Ties several hubs together.",
              },
            ]}
            explanation="Hubs hold business keys, links hold relationships, satellites hold descriptive history; every row records its load date and source."
          />
        </div>
      }
    >
      <p>Sort the data.</p>
    </StepLayout>
  );
}

/* 6 ─ Wrap ---------------------------------------------------------------------------------------- */

const POINTS: [string, string][] = [
  ["Hubs", "Unique business keys."],
  ["Links", "Relationships and transactions between hubs."],
  ["Satellites", "Descriptive attributes and their history, append-only."],
  ["Auditable", "Load date and record source on every row."],
  ["A layer, not the end", "Marts on top for people to query."],
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
      <p>Next: the opposite extreme, one big table with everything in it.</p>
    </StepLayout>
  );
}
