"use client";

import { motion } from "motion/react";
import { Check, CircleAlert, X } from "lucide-react";
import { useSceneState } from "@/lib/module-sdk";
import { StepLayout } from "@/toolkit/layout/step-layout";
import { WrapStep } from "@/toolkit/layout/wrap-step";
import { SortCheckpoint } from "@/toolkit/checkpoints/sort";
import { Segmented } from "@/toolkit/controls/segmented";
import { Term } from "@/toolkit/glossary/term";
import { cn } from "@/lib/cn";
import { CHANGES, MODES, USED, verdict, type ChangeId, type Mode } from "./model";
import type { ContractState } from "./state";

/* 1 ─ Story ---------------------------------------------------------------------------------------- */

export function PlugShape() {
  return (
    <StepLayout
      eyebrow="Story"
      title="Agree on the plug, build apart"
      stage={
        <div className="grid flex-1 content-center gap-3 sm:grid-cols-3">
          {[
            ["Appliance maker", "Builds the plug to the agreed shape."],
            ["The agreement", "Three pins, this size, this spacing."],
            ["Socket maker", "Builds the socket to the same shape."],
          ].map(([t, b], i) => (
            <motion.div
              key={t}
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.12 * i }}
              className={cn(
                "rounded-xl border p-3 text-xs",
                i === 1 ? "border-accent bg-accent-soft" : "border-line bg-surface",
              )}
            >
              <p className="font-semibold">{t}</p>
              <p className="text-muted">{b}</p>
            </motion.div>
          ))}
        </div>
      }
    >
      <p>
        Two companies make plugs and sockets without ever testing them together. It works because
        both check their product against a shared, written agreement about the shape.
      </p>
      <p>
        When two services talk over an API, a <Term id="contract-test">contract test</Term> plays
        that role. The consumer writes down exactly what it needs; the provider checks every change
        against it. Teams can deploy separately without a full end-to-end rehearsal.
      </p>
    </StepLayout>
  );
}

/* 2 ─ Collide ⭐ ----------------------------------------------------------------------------------- */

export function Collide() {
  const [s, set] = useSceneState<ContractState>();
  const toggle = (id: ChangeId) =>
    set({
      changes: s.changes.includes(id) ? s.changes.filter((x) => x !== id) : [...s.changes, id],
    });
  const picked = CHANGES.filter((c) => s.changes.includes(c.id));
  return (
    <StepLayout
      eyebrow="Build"
      title="Change the API and see who notices"
      stage={
        <div className="flex flex-1 flex-col justify-center gap-3">
          <div className="grid gap-2 sm:grid-cols-2">
            <div className="border-line bg-surface rounded-lg border px-3 py-2 font-mono text-[10.5px]">
              <p className="text-muted mb-1 font-sans text-[10px] font-medium">
                The kitchen display&apos;s contract
              </p>
              <pre className="whitespace-pre-wrap">{`given "order 42 exists"
GET /orders/42
→ 200
  id:     a number
  status: text, e.g. "cooking"
  items:  [{ name: text }]`}</pre>
            </div>
            <div className="border-line bg-surface rounded-lg border px-3 py-2 text-xs">
              <p className="text-muted mb-1 text-[10px] font-medium">
                Proposed changes to the orders API
              </p>
              {CHANGES.map((c) => (
                <label key={c.id} className="flex items-start gap-1.5 py-0.5">
                  <input
                    type="checkbox"
                    checked={s.changes.includes(c.id)}
                    onChange={() => toggle(c.id)}
                    className="accent-accent mt-0.5"
                  />
                  {c.label}
                </label>
              ))}
            </div>
          </div>
          <Segmented<Mode>
            value={s.mode}
            onChange={(m) => set({ mode: m })}
            options={MODES.map((m) => [m.id, m.label])}
          />
          <div className="grid gap-1">
            {picked.length === 0 && <p className="text-muted text-xs">Tick a change to try it.</p>}
            {picked.map((c) => {
              const v = verdict(c, s.mode);
              const falseAlarm = s.mode === "schema" && !c.breaks && c.schemaFlags;
              return (
                <motion.div
                  key={`${c.id}-${s.mode}`}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className={cn(
                    "rounded-lg border px-3 py-1.5 text-xs",
                    v.where === "production"
                      ? "border-bad/50 bg-bad/10"
                      : falseAlarm
                        ? "border-line-strong bg-surface-2"
                        : v.where === "build"
                          ? "border-good/50 bg-good/10"
                          : "border-line bg-surface",
                  )}
                >
                  <p className="flex items-center gap-1.5 font-medium">
                    {v.where === "production" ? (
                      <X className="text-bad size-3.5" />
                    ) : falseAlarm ? (
                      <CircleAlert className="text-accent size-3.5" />
                    ) : (
                      <Check className="text-good size-3.5" />
                    )}
                    {c.label}
                  </p>
                  <p className="text-muted pl-5 text-[10px]">{v.text}</p>
                </motion.div>
              );
            })}
          </div>
          <p className="text-muted text-[10px]">The display reads only: {USED.join(", ")}.</p>
        </div>
      }
    >
      <p>
        The orders team wants to tidy their API. Tick some of their changes, then switch between
        three ways of checking them before deploy: none, a diff of the API schema, or the
        consumer&apos;s contract.
      </p>
      <p>
        With no checks, breaking changes reach production. A schema diff catches them, but also
        blocks removing a field nobody reads. The consumer&apos;s contract knows what is actually
        used, so it blocks only real breaks.
      </p>
    </StepLayout>
  );
}

/* 3 ─ The flow -------------------------------------------------------------------------------------- */

const FLOW: [string, string][] = [
  [
    "1 · Consumer test",
    "The display's unit test runs against a mock of the orders API. Each interaction it uses is recorded as a contract.",
  ],
  ["2 · Share", "The contract is published to a broker that both teams can reach."],
  [
    "3 · Provider verifies",
    "The orders API's build replays every interaction against the real service, setting up provider states such as “order 42 exists”.",
  ],
  [
    "4 · Can I deploy?",
    "Before either side deploys, a check asks: does this version satisfy every contract with the versions already live?",
  ],
];

export function Flow() {
  const [s, set] = useSceneState<ContractState>();
  return (
    <StepLayout
      eyebrow="Explore"
      title="How a consumer-driven contract travels"
      stage={
        <div className="flex flex-1 flex-col justify-center gap-1.5">
          {FLOW.map(([t, b], i) => (
            <button
              key={t}
              type="button"
              onClick={() => set({ flow: i })}
              aria-pressed={s.flow === i}
              className={cn(
                "rounded-lg border px-3 py-2 text-left text-xs",
                s.flow === i ? "border-accent bg-accent-soft" : "border-line bg-surface",
              )}
            >
              <p className="font-semibold">{t}</p>
              {s.flow === i && <p className="text-muted">{b}</p>}
            </button>
          ))}
        </div>
      }
    >
      <p>
        &ldquo;Consumer-driven&rdquo; means the people who depend on an API say what they need, and
        the provider is held to it. Pact is the best-known open-source tool for this; its broker
        command for step 4 is called <code>can-i-deploy</code>.
      </p>
      <p>Click each stage.</p>
    </StepLayout>
  );
}

/* 4 ─ Tools ---------------------------------------------------------------------------------------- */

export function Tools() {
  return (
    <StepLayout
      eyebrow="Explore"
      title="Contracts, schemas and tools"
      stage={
        <div className="flex flex-1 flex-col justify-center gap-2">
          {[
            [
              "Pact",
              "Open-source consumer-driven contracts for many languages, now sharing a common Rust core. The specification is at version 4.",
            ],
            [
              "PactFlow",
              "A hosted broker from SmartBear (since 2022). Its bi-directional contract testing, which compares consumer contracts with a provider's OpenAPI document, is a paid feature.",
            ],
            [
              "Spring Cloud Contract",
              "Provider-driven contracts for the JVM. In July 2026 Spring handed it back to its creator; it continues as Stubborn.sh.",
            ],
            [
              "Schema-based checks",
              "Tools like Schemathesis generate requests from an OpenAPI document to find responses that break the schema. Dredd, an older tool, is archived.",
            ],
          ].map(([t, b], i) => (
            <motion.div
              key={t}
              initial={{ opacity: 0, y: 4 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.07 * i }}
              className="border-line bg-surface rounded-lg border px-3 py-2 text-xs"
            >
              <p className="font-semibold">{t}</p>
              <p className="text-muted">{b}</p>
            </motion.div>
          ))}
        </div>
      }
    >
      <p>
        A schema says what <em>could</em> be sent. A consumer contract says what{" "}
        <em>this consumer actually uses</em>. Both are useful: schemas document the whole API;
        contracts tell a provider which changes are safe.
      </p>
      <p>
        Contract tests suit teams that own separate services. Inside one codebase, plain integration
        tests are usually simpler.
      </p>
    </StepLayout>
  );
}

/* 5 ─ Checkpoint ----------------------------------------------------------------------------------- */

export function ContractCheck() {
  return (
    <StepLayout
      eyebrow="Checkpoint"
      title="Safe or breaking?"
      stage={
        <div className="flex flex-1 flex-col justify-center">
          <SortCheckpoint
            id="testing-contract"
            prompt="A mobile app reads only name, price and inStock from GET /menu. Is each provider change safe for it?"
            categories={[
              { id: "safe", label: "Safe" },
              { id: "breaking", label: "Breaking" },
            ]}
            items={[
              {
                id: "add",
                label: "Add a calories field",
                category: "safe",
                why: "Additive; the app ignores it.",
              },
              {
                id: "drop",
                label: "Remove an internalSku field",
                category: "safe",
                why: "The app never reads it.",
              },
              {
                id: "price",
                label: "Send price in paise instead of rupees",
                category: "breaking",
                why: "Same field, different meaning: ₹120 becomes ₹12,000.",
              },
              {
                id: "stock",
                label: "Rename inStock to available",
                category: "breaking",
                why: "The app's field disappears.",
              },
              {
                id: "null",
                label: "Allow name to be null",
                category: "breaking",
                why: "The app expects text.",
              },
            ]}
            explanation="Only changes to what the consumer actually reads (names, types, meanings) can break it. That's exactly what its contract records."
          />
        </div>
      }
    >
      <p>Sort each change.</p>
    </StepLayout>
  );
}

/* 6 ─ Wrap ----------------------------------------------------------------------------------------- */

export function Wrap() {
  return (
    <WrapStep
      points={[
        ["A written agreement", "The consumer records what it needs from the API."],
        ["Provider verifies", "Every provider build replays the consumer's expectations."],
        ["Deploy separately", "No full end-to-end rehearsal needed."],
        ["Contract beats schema for safety", "It knows which fields are really used."],
        ["Names, types, meanings", "Change any of those and someone may break."],
      ]}
    >
      <p>Next: testing what the user sees on screen.</p>
    </WrapStep>
  );
}
