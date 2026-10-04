"use client";

import { motion } from "motion/react";
import { useSceneState } from "@/lib/module-sdk";
import { StepLayout } from "@/toolkit/layout/step-layout";
import { SortCheckpoint } from "@/toolkit/checkpoints/sort";
import { Code } from "@/toolkit/controls/stepper";
import { Term } from "@/toolkit/glossary/term";
import { cn } from "@/lib/cn";
import { CHANGES, MODES, UPGRADE, V1, allowed } from "./model";
import type { SchemaState } from "./state";

/* 1 ─ The new plug -------------------------------------------------------------------------------- */

export function Plug() {
  return (
    <StepLayout
      eyebrow="Story"
      title="The new plug"
      stage={
        <div className="grid flex-1 content-center gap-3 sm:grid-cols-3">
          {[
            [
              "Old phone, new charger",
              "Works if the new charger still fits the old socket.",
              "good",
            ],
            [
              "New phone, old charger",
              "Works if the new socket still accepts the old plug.",
              "good",
            ],
            ["New shape entirely", "Nothing fits until everyone buys new cables.", "bad"],
          ].map(([t, d, tone], i) => (
            <motion.div
              key={t}
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.15 * i }}
              className={cn(
                "rounded-xl border px-4 py-3",
                tone === "good" ? "border-good bg-good/10" : "border-bad bg-bad/10",
              )}
            >
              <p className="text-sm font-semibold">{t}</p>
              <p className="text-muted mt-1 text-xs">{d}</p>
            </motion.div>
          ))}
        </div>
      }
    >
      <p>
        When a phone maker changes its charging socket, two questions matter: will new phones still
        take old chargers, and will old phones take new ones? Change the shape completely and
        nobody&apos;s cables work.
      </p>
      <p>
        Data schemas change too: fields get added, removed or retyped.{" "}
        <Term id="schema-evolution">Schema evolution</Term> is changing a schema in ways existing
        readers survive, and a <Term id="schema-registry">schema registry</Term> is the referee that
        refuses changes that would break them.
      </p>
    </StepLayout>
  );
}

/* 2 ─ Evolve a schema ⭐ -------------------------------------------------------------------------- */

function Reader({ title, ok, sub }: { title: string; ok: boolean; sub: string }) {
  return (
    <div
      className={cn(
        "rounded-xl border px-3 py-2 text-xs",
        ok ? "border-good bg-good/10" : "border-bad bg-bad/10",
      )}
    >
      <p className="font-semibold">
        {ok ? "✓" : "✗"} {title}
      </p>
      <p className="text-muted text-[11px]">{sub}</p>
    </div>
  );
}

export function Evolve() {
  const [s, set] = useSceneState<SchemaState>();
  const c = CHANGES.find((x) => x.id === s.change) ?? CHANGES[0];
  const ok = allowed(c, s.mode);
  return (
    <StepLayout
      eyebrow="Simulation"
      title="Evolve a schema"
      stage={
        <div className="flex flex-1 flex-col justify-center gap-3">
          <div className="grid gap-3 lg:grid-cols-2">
            <div className="flex flex-col gap-2">
              <p className="text-muted text-[10px]">ORDER SCHEMA, VERSION 1 (AVRO)</p>
              <Code>{V1}</Code>
              <p className="text-muted text-[10px]">VERSION 2 CHANGES ONE THING</p>
              <div className="flex flex-col gap-1">
                {CHANGES.map((x) => (
                  <button
                    key={x.id}
                    type="button"
                    aria-pressed={s.change === x.id}
                    onClick={() => set({ change: x.id })}
                    className={cn(
                      "rounded-lg border px-3 py-1.5 text-left text-xs",
                      s.change === x.id ? "border-accent bg-accent-soft" : "border-line bg-surface",
                    )}
                  >
                    {x.label}
                  </button>
                ))}
              </div>
            </div>
            <div className="flex flex-col gap-2">
              <Code>{c.diff}</Code>
              <Reader
                title="New consumer reads yesterday's events"
                ok={c.newReadsOld}
                sub="v2 reader, v1 data: what BACKWARD checks"
              />
              <Reader
                title="Old consumer reads today's events"
                ok={c.oldReadsNew}
                sub="v1 reader, v2 data: what FORWARD checks"
              />
              <p className="text-muted text-[11px]">{c.why}</p>
              <div className="flex flex-wrap items-center gap-1 pt-1">
                <span className="text-muted mr-1 text-[10px]">REGISTRY MODE</span>
                {MODES.map((m) => (
                  <button
                    key={m}
                    type="button"
                    aria-pressed={s.mode === m}
                    onClick={() => set({ mode: m })}
                    className={cn(
                      "rounded-md border px-2 py-1 font-mono text-[11px]",
                      s.mode === m ? "border-accent bg-accent-soft" : "border-line",
                    )}
                  >
                    {m}
                  </button>
                ))}
              </div>
              <motion.div
                key={`${c.id}-${s.mode}`}
                initial={{ opacity: 0, y: 4 }}
                animate={{ opacity: 1, y: 0 }}
                className={cn(
                  "rounded-xl border px-3 py-2 text-xs",
                  ok ? "border-good bg-good/10" : "border-bad bg-bad/10",
                )}
              >
                <p className="font-semibold">
                  {ok ? "Registry accepts version 2" : "Registry rejects version 2"}
                </p>
                <p className="text-muted text-[11px]">
                  {ok
                    ? s.mode === "NONE" && !(c.newReadsOld && c.oldReadsNew)
                      ? "Accepted, but some consumer will break."
                      : UPGRADE[s.mode]
                    : "The producer's deploy fails before a single broken event is written."}
                </p>
              </motion.div>
            </div>
          </div>
        </div>
      }
    >
      <p>
        Pick a change to the order schema and a registry mode. Two readers matter: a consumer
        already on the new schema reading old events (
        <Term id="backward-compatibility">backward compatibility</Term>), and a consumer still on
        the old schema reading new events (forward compatibility).
      </p>
      <p>
        In Avro, the default value is what makes changes safe: it gives a reader something to fill
        in when a field is missing. A new field with no default breaks backward compatibility.
      </p>
    </StepLayout>
  );
}

/* 3 ─ The compatibility modes --------------------------------------------------------------------- */

export function Modes() {
  const rows: [string, string, string, string][] = [
    ["BACKWARD", "v2 reads v1 data", "Remove fields; add fields with defaults", "Consumers first"],
    ["FORWARD", "v1 reads v2 data", "Add fields; remove fields with defaults", "Producers first"],
    ["FULL", "Both", "Add or remove fields with defaults only", "Any order"],
    ["NONE", "Nothing", "Anything", "You coordinate"],
  ];
  return (
    <StepLayout
      eyebrow="Explore"
      title="The compatibility modes"
      stage={
        <div className="flex flex-1 flex-col justify-center gap-2 text-xs">
          <div className="text-muted grid grid-cols-[5.5rem_1fr_1.5fr_1fr] gap-2 px-3 text-[10px]">
            <span>MODE</span>
            <span>CHECKS</span>
            <span>YOU MAY</span>
            <span>UPGRADE</span>
          </div>
          {rows.map((r, i) => (
            <motion.div
              key={r[0]}
              initial={{ opacity: 0, x: -6 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.08 * i }}
              className="border-line bg-surface grid grid-cols-[5.5rem_1fr_1.5fr_1fr] gap-2 rounded-lg border px-3 py-2"
            >
              <span className="text-accent font-mono">{r[0]}</span>
              <span>{r[1]}</span>
              <span className="text-muted">{r[2]}</span>
              <span className="text-muted">{r[3]}</span>
            </motion.div>
          ))}
          <p className="text-muted px-1 text-[11px]">
            Each mode also has a <span className="font-mono">_TRANSITIVE</span> version that checks
            against every earlier version, not just the latest.
          </p>
        </div>
      }
    >
      <p>
        Confluent Schema Registry defaults to BACKWARD, because Kafka consumers often need to rewind
        and reread old events with their current code.
      </p>
      <p>
        Plain BACKWARD only compares with the previous version. If consumers might read events
        written several versions ago, BACKWARD_TRANSITIVE is the safer choice.
      </p>
    </StepLayout>
  );
}

/* 4 ─ Registries and tables ----------------------------------------------------------------------- */

export function Registries() {
  const items: [string, string][] = [
    [
      "Confluent Schema Registry",
      "Avro, Protobuf, JSON Schema. Source-available (Confluent Community License); client libraries are Apache 2.0.",
    ],
    [
      "AWS Glue Schema Registry",
      "Avro, JSON Schema, Protobuf. Modes are named BACKWARD_ALL and so on, plus DISABLED.",
    ],
    [
      "Azure Event Hubs Schema Registry",
      "Evolution checks for Avro only: Backward, Forward or None.",
    ],
    ["Apicurio Registry", "Open source (Apache 2.0), with Confluent-style mode names."],
    [
      "Apache Iceberg tables",
      "Tracks columns by ID, so add, drop, rename, reorder and widening types are metadata-only.",
    ],
    [
      "Delta Lake tables",
      "Rejects mismatched writes; mergeSchema adds columns. Rename and drop need column mapping, which can't be turned off.",
    ],
  ];
  return (
    <StepLayout
      eyebrow="Explore"
      title="Registries and tables"
      stage={
        <div className="grid flex-1 content-center gap-2 sm:grid-cols-2">
          {items.map(([t, d], i) => (
            <motion.div
              key={t}
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.06 * i }}
              className="border-line bg-surface rounded-lg border px-3 py-2 text-xs"
            >
              <p className="font-semibold">{t}</p>
              <p className="text-muted mt-0.5">{d}</p>
            </motion.div>
          ))}
        </div>
      }
    >
      <p>
        Every major streaming platform has a registry, with slightly different names and limits. The
        Avro rules you just tried don&apos;t carry over exactly to JSON Schema, whose rules depend
        on how strict the schema is about extra fields.
      </p>
      <p>
        Lakehouse table formats handle evolution in the table itself. Iceberg can rename a column
        safely because it never looks columns up by name.
      </p>
    </StepLayout>
  );
}

/* 5 ─ Which kind of change? ----------------------------------------------------------------------- */

export function WhichMode() {
  return (
    <StepLayout
      eyebrow="Checkpoint"
      title="Which kind of change?"
      stage={
        <div className="flex flex-1 flex-col justify-center">
          <SortCheckpoint
            id="which-mode"
            prompt="Using Avro rules, which compatibility does each change keep?"
            categories={[
              { id: "full", label: "Full" },
              { id: "backward", label: "Backward only" },
              { id: "forward", label: "Forward only" },
              { id: "neither", label: "Neither" },
            ]}
            items={[
              {
                id: "nick",
                label: "Add nickname with default null",
                category: "full",
                why: "A default works in both directions.",
              },
              {
                id: "region",
                label: "Add a required region, no default",
                category: "forward",
                why: "Old readers ignore it; new readers have nothing to fill old records with.",
              },
              {
                id: "legacy",
                label: "Remove legacy_code, which had no default",
                category: "backward",
                why: "New readers skip it; old readers can't fill it in.",
              },
              {
                id: "price",
                label: "Change price from double to string",
                category: "neither",
                why: "No reader can convert between the two.",
              },
            ]}
            explanation="Defaults make fields safe to add or remove. Adding without a default only keeps forward compatibility; removing a field without a default only keeps backward."
          />
        </div>
      }
    >
      <p>Sort the changes.</p>
    </StepLayout>
  );
}

/* 6 ─ Wrap ---------------------------------------------------------------------------------------- */

const POINTS: [string, string][] = [
  ["Backward", "New readers can read old data. Upgrade consumers first."],
  ["Forward", "Old readers can read new data. Upgrade producers first."],
  ["Full", "Both: add or remove only fields with defaults."],
  ["Defaults matter", "In Avro they make fields safe to add or remove."],
  ["Registries enforce it", "A breaking schema fails at deploy, not in production."],
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
      <p>Next: who owns each dataset, and who you call when it breaks.</p>
    </StepLayout>
  );
}
