"use client";

import { motion } from "motion/react";
import { Check, X } from "lucide-react";
import { useSceneState } from "@/lib/module-sdk";
import { StepLayout } from "@/toolkit/layout/step-layout";
import { SortCheckpoint } from "@/toolkit/checkpoints/sort";
import { Segmented } from "@/toolkit/controls/segmented";
import { Code, FrameCaption, Stepper } from "@/toolkit/controls/stepper";
import { Term } from "@/toolkit/glossary/term";
import { cn } from "@/lib/cn";
import { CHANGES, V1, allowed } from "./rules";
import type { Change, Mode, SchemaState } from "./state";

/* 1 ─ Changing a printed form ----------------------------------------------------------------- */

export function Form() {
  const rows: [string, string, boolean][] = [
    [
      "Add a box “Alternate mobile (optional)”",
      "Old forms still accepted; clerks leave it blank.",
      true,
    ],
    [
      "Remove the “Fax number” box",
      "New forms are fine; old clerks who insist on reading it are stuck.",
      true,
    ],
    [
      "Rename “PNR” to “Booking ref”",
      "Clerks trained on the old form can't find the PNR. Queues stop.",
      false,
    ],
  ];
  return (
    <StepLayout
      eyebrow="Analogy"
      title="Changing a printed form"
      stage={
        <div className="flex flex-1 flex-col justify-center gap-2">
          {rows.map(([t, d, ok], i) => (
            <motion.div
              key={t}
              initial={{ opacity: 0, x: -8 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.15 * i }}
              className={cn(
                "flex gap-2 rounded-xl border px-4 py-3",
                ok ? "border-line bg-surface" : "border-bad/50 bg-bad/10",
              )}
            >
              {ok ? (
                <Check className="text-good mt-0.5 size-4 shrink-0" />
              ) : (
                <X className="text-bad mt-0.5 size-4 shrink-0" />
              )}
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
        A railway reservation form is read by thousands of clerks, and forms printed years ago are
        still in circulation. Some changes are harmless; others stop every counter.
      </p>
      <p>
        Events are the same. Producers and consumers agree on a <Term id="schema">schema</Term>, the
        shape of each event, and both keep changing for years. A{" "}
        <Term id="schema-registry">schema registry</Term> stores every version and refuses changes
        that would break the readers.
      </p>
    </StepLayout>
  );
}

/* 2 ─ Break a consumer, then fix it ⭐ ----------------------------------------------------------- */

const MODES: [Mode, string][] = [
  ["NONE", "NONE"],
  ["BACKWARD", "BACKWARD (default)"],
  ["FORWARD", "FORWARD"],
  ["FULL", "FULL"],
];

function Verdict({ label, v }: { label: string; v: [boolean, string] }) {
  return (
    <div
      className={cn(
        "rounded-lg border px-3 py-2 text-xs",
        v[0] ? "border-good/50 bg-good/10" : "border-bad/50 bg-bad/10",
      )}
    >
      <p className="flex items-center gap-1.5 font-semibold">
        {v[0] ? <Check className="text-good size-3.5" /> : <X className="text-bad size-3.5" />}
        {label}
      </p>
      <p className="text-muted mt-0.5">{v[1]}</p>
    </div>
  );
}

export function BreakAndFix() {
  const [s, set] = useSceneState<SchemaState>();
  const c = CHANGES[s.change];
  const ok = allowed(s.change, s.mode);
  const breaks = !c.backward[0] || !c.forward[0];
  return (
    <StepLayout
      eyebrow="Fix the problem · Avro's real resolution rules"
      title="Break a consumer, then fix it"
      stage={
        <div className="flex flex-1 flex-col justify-center gap-3">
          <div className="grid gap-2 lg:grid-cols-2">
            <div>
              <p className="text-muted mb-1 text-[10px]">Version 1 (in use)</p>
              <Code className="text-[10px] whitespace-pre-wrap">{V1}</Code>
            </div>
            <div>
              <p className="text-muted mb-1 text-[10px]">Proposed change</p>
              <div className="flex flex-wrap gap-1">
                {(Object.keys(CHANGES) as Change[]).map((k) => (
                  <button
                    key={k}
                    type="button"
                    onClick={() => set({ change: k })}
                    className={cn(
                      "rounded-full border px-2 py-0.5 text-[10px]",
                      s.change === k
                        ? "border-accent bg-accent-soft"
                        : "border-line hover:bg-surface-2",
                    )}
                  >
                    {CHANGES[k].label}
                  </button>
                ))}
              </div>
              <Code className="mt-2 text-[10px] whitespace-pre-wrap">{c.v2}</Code>
            </div>
          </div>
          <div className="grid gap-2 sm:grid-cols-2">
            <Verdict label="New consumer, old data (backward)" v={c.backward} />
            <Verdict label="Old consumer, new data (forward)" v={c.forward} />
          </div>
          <div className="flex flex-wrap items-center gap-2 text-xs">
            <span className="text-muted">Registry compatibility</span>
            <Segmented
              size="sm"
              value={s.mode}
              options={MODES}
              onChange={(v) => set({ mode: v })}
            />
          </div>
          <motion.div
            key={`${s.change}-${s.mode}`}
            initial={{ opacity: 0, y: 4 }}
            animate={{ opacity: 1, y: 0 }}
            className={cn(
              "rounded-xl border px-4 py-3 text-sm",
              ok
                ? breaks
                  ? s.mode === "NONE"
                    ? "border-bad/50 bg-bad/10"
                    : "border-accent/50 bg-accent-soft"
                  : "border-good/50 bg-good/10"
                : "border-accent/50 bg-accent-soft",
            )}
          >
            {ok
              ? breaks
                ? s.mode === "NONE"
                  ? "Registered without checks. The first consumer that can't read it crashes or writes nulls: a production incident."
                  : `Accepted under ${s.mode}. Safe only if you deploy in the right order: ${s.mode === "BACKWARD" ? "upgrade consumers first" : "upgrade producers first"}.`
                : "Accepted and safe in both directions: deploy producers and consumers in any order."
              : `Rejected by the registry: not ${s.mode.toLowerCase()} compatible. Nothing breaks in production; the producer team gets an error at build time.`}
          </motion.div>
        </div>
      }
    >
      <p>
        A payments team wants to change its event. Try each change and see who can still read what.
        Then turn on the registry&apos;s compatibility check and watch it catch the dangerous ones.
      </p>
      <p>
        <Term id="backward-compatible">Backward compatibility</Term>, Confluent&apos;s default,
        means consumers on the new schema can read old data, so you upgrade consumers first.{" "}
        <Term id="forward-compatible">Forward</Term> means old consumers can read new data, so
        producers go first. FULL needs both. The safest habit: add fields with defaults, never
        rename.
      </p>
    </StepLayout>
  );
}

/* 3 ─ How a registry works ---------------------------------------------------------------------- */

const WIRE: { title: string; text: string; bytes: string }[] = [
  {
    title: "1. Register",
    text: "The producer's serializer sends its schema to the registry under the subject payments-value (topic name + “-value”). If it's compatible, the registry returns an ID: 42.",
    bytes: "",
  },
  {
    title: "2. Write",
    text: "Each message carries a tiny header instead of the whole schema: a magic byte 0 and the 4-byte schema ID, then the Avro-encoded fields.",
    bytes: "00 | 00 00 00 2A | 12 70 61 79 2D 39 … (payload)",
  },
  {
    title: "3. Read",
    text: "The consumer's deserializer reads ID 42, fetches that schema once and caches it, then resolves it against the schema the consumer was built with.",
    bytes: "",
  },
  {
    title: "4. Evolve",
    text: "Version 2 gets a new ID. Old and new messages sit side by side in the topic; every one says which schema wrote it.",
    bytes: "00 | 00 00 00 2B | …",
  },
];

export function WireFormat() {
  const [s, set] = useSceneState<SchemaState>();
  const f = WIRE[s.frame] ?? WIRE[0];
  return (
    <StepLayout
      eyebrow="Step through"
      title="How a registry works"
      stage={
        <div className="flex flex-1 flex-col justify-center gap-3">
          {f.bytes && (
            <motion.div key={s.frame} initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <Code className="text-[11px]">{f.bytes}</Code>
            </motion.div>
          )}
          <FrameCaption frameKey={s.frame} title={f.title}>
            {f.text}
          </FrameCaption>
          <Stepper step={s.frame} count={WIRE.length} onChange={(n) => set({ frame: n })} />
          <p className="text-muted text-[11px]">
            Since Confluent Platform 8.1.1 the schema reference can also travel in a record header
            as a 16-byte GUID instead.
          </p>
        </div>
      }
    >
      <p>
        Sending the full schema with every message would waste bytes, so most setups send a schema
        ID and keep the schemas in the registry. Step through one message.
      </p>
      <p>
        The registry check happens when a producer first registers a new version, long before data
        flows.
      </p>
    </StepLayout>
  );
}

/* 4 ─ Formats and registries ------------------------------------------------------------------ */

const FORMATS: Record<SchemaState["format"], [string, string][]> = {
  avro: [
    ["Encoding", "Compact binary; the reader needs the writer's schema."],
    ["Safe changes", "Add fields with defaults; widen int → long; rename only with aliases."],
    ["Tip", "For optional fields use a union with null first and default null."],
  ],
  protobuf: [
    ["Encoding", "Fields identified by number, not name."],
    [
      "Safe changes",
      "Add or remove fields freely; never reuse a field number; mark deleted numbers reserved.",
    ],
    ["Tip", "Confluent suggests BACKWARD_TRANSITIVE for Protobuf."],
  ],
  json: [
    ["Encoding", "Plain JSON, human-readable, larger."],
    [
      "Surprise",
      "With Confluent's STRICT policy and JSON Schema's default open content model, adding an optional field is only forward compatible.",
    ],
    ["Tip", "Decide open or closed content models up front."],
  ],
};

const REGISTRIES: [string, string][] = [
  [
    "Confluent Schema Registry",
    "The de facto standard; Confluent Community License; BACKWARD by default.",
  ],
  [
    "Apicurio, Karapace",
    "Apache 2.0 alternatives that speak the same API; Apicurio enforces nothing until rules are set.",
  ],
  ["AWS Glue Schema Registry", "Avro, JSON Schema, Protobuf; eight modes; free."],
  ["Azure (Event Hubs)", "Evolution checks for Avro only; Backward, Forward or None."],
  [
    "Google Pub/Sub",
    "Avro and Protobuf schemas with up to 20 revisions; topics can accept a range.",
  ],
  ["Redpanda", "Registry built into the broker binary, same wire format."],
];

export function Formats() {
  const [s, set] = useSceneState<SchemaState>();
  return (
    <StepLayout
      eyebrow="Explore"
      title="Formats and registries"
      stage={
        <div className="flex flex-1 flex-col justify-center gap-3">
          <Segmented
            size="sm"
            value={s.format}
            options={[
              ["avro", "Avro"],
              ["protobuf", "Protobuf"],
              ["json", "JSON Schema"],
            ]}
            onChange={(v) => set({ format: v })}
          />
          <div className="flex flex-col gap-1">
            {FORMATS[s.format].map(([k, v]) => (
              <motion.div
                key={s.format + k}
                initial={{ opacity: 0, y: 3 }}
                animate={{ opacity: 1, y: 0 }}
                className="border-line bg-surface flex gap-3 rounded-lg border px-3 py-2 text-xs"
              >
                <span className="text-accent w-20 shrink-0 font-semibold">{k}</span>
                <span>{v}</span>
              </motion.div>
            ))}
          </div>
          <div className="grid gap-1 sm:grid-cols-2">
            {REGISTRIES.map(([t, d]) => (
              <div key={t} className="border-line rounded-lg border px-2.5 py-1.5">
                <p className="text-xs font-semibold">{t}</p>
                <p className="text-muted text-[11px]">{d}</p>
              </div>
            ))}
          </div>
        </div>
      }
    >
      <p>
        Three formats dominate: <Term id="avro">Avro</Term>, Protobuf and JSON Schema. Each has its
        own rules for safe changes.
      </p>
      <p>
        Beyond shape, &ldquo;data contracts&rdquo; add rules (for example, amount must be positive)
        and metadata (which fields hold personal data). Confluent supports them in its paid
        editions.
      </p>
    </StepLayout>
  );
}

/* 5 ─ Allowed under BACKWARD? ------------------------------------------------------------------ */

export function AllowedOrNot() {
  return (
    <StepLayout
      eyebrow="Checkpoint"
      title="Allowed under BACKWARD?"
      stage={
        <div className="flex flex-1 flex-col justify-center">
          <SortCheckpoint
            id="backward-allowed"
            prompt="Would an Avro registry set to BACKWARD accept each change?"
            categories={[
              { id: "yes", label: "Accepted" },
              { id: "no", label: "Rejected" },
            ]}
            items={[
              {
                id: "adddef",
                label: "Add an optional field with a default",
                category: "yes",
                why: "New readers fill old records with the default.",
              },
              {
                id: "addnodef",
                label: "Add a field with no default",
                category: "no",
                why: "New readers can't fill it for old records.",
              },
              {
                id: "del",
                label: "Delete a field",
                category: "yes",
                why: "New readers ignore it in old data.",
              },
              {
                id: "retype",
                label: "Change a field from int to string",
                category: "no",
                why: "Avro can't promote int to string.",
              },
              {
                id: "widen",
                label: "Widen a field from int to long",
                category: "yes",
                why: "Avro promotes int to long.",
              },
              {
                id: "rename",
                label: "Rename a field without an alias",
                category: "no",
                why: "Seen as delete plus add-without-default.",
              },
            ]}
            explanation="BACKWARD protects new consumers reading old data; that's why consumers are upgraded first."
          />
        </div>
      }
    >
      <p>Six changes. Predict the registry&apos;s answer.</p>
    </StepLayout>
  );
}

/* 6 ─ Wrap --------------------------------------------------------------------------------------- */

const TAKEAWAYS: [string, string][] = [
  ["Schemas are contracts", "Producers and consumers change on different days."],
  ["Backward vs forward", "New reads old (consumers first) vs old reads new (producers first)."],
  ["Let the registry say no", "Breaking changes fail at build time, not in production."],
  ["Safe habits", "Add with defaults, never rename, never reuse Protobuf numbers."],
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
      <p>Next: delivery guarantees, and what exactly-once really costs.</p>
    </StepLayout>
  );
}
