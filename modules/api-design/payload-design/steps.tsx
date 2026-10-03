"use client";

import { motion } from "motion/react";
import { Check, RotateCcw } from "lucide-react";
import { useSceneState } from "@/lib/module-sdk";
import { StepLayout } from "@/toolkit/layout/step-layout";
import { SortCheckpoint } from "@/toolkit/checkpoints/sort";
import { Code } from "@/toolkit/controls/stepper";
import { Term } from "@/toolkit/glossary/term";
import { cn } from "@/lib/cn";
import { TRAPS } from "./model";
import type { PayloadState } from "./state";

/* 1 ─ Which date? --------------------------------------------------------------------------------- */

const READINGS: [string, string][] = [
  ["India, UK", "3 October 2026"],
  ["United States", "10 March 2026"],
  ["A computer", "Depends who wrote the parser"],
];

export function WhichDate() {
  return (
    <StepLayout
      eyebrow="Story"
      title="Which date?"
      stage={
        <div className="flex flex-1 flex-col justify-center gap-3">
          <p className="border-line bg-surface rounded-xl border px-4 py-4 text-center font-mono text-2xl font-semibold">
            03/10/2026
          </p>
          {READINGS.map(([who, reads], i) => (
            <motion.div
              key={who}
              initial={{ opacity: 0, x: -6 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.12 * i }}
              className="border-line bg-surface grid grid-cols-[7rem_1fr] gap-2 rounded-lg border px-3 py-2 text-sm"
            >
              <span className="text-muted">{who}</span>
              <span className={i === 2 ? "text-bad" : ""}>{reads}</span>
            </motion.div>
          ))}
          <p className="border-good/50 bg-good/5 rounded-lg border px-3 py-2 text-center font-mono text-sm">
            2026-10-03
          </p>
        </div>
      }
    >
      <p>
        A form asks for a date and you write 03/10/2026. In India that&apos;s the 3rd of October; in
        the United States it&apos;s the 10th of March. Nobody did anything wrong, and someone still
        turns up on the wrong day.
      </p>
      <p>
        The data an API sends is part of its <Term id="api-contract">contract</Term>. Every field
        whose meaning a client has to guess will, sooner or later, be guessed wrong. Most of the
        traps are in a few familiar places: money, dates, big numbers and missing values.
      </p>
    </StepLayout>
  );
}

/* 2 ─ Fix the payment ⭐ -------------------------------------------------------------------------- */

export function FixPayment() {
  const [s, set] = useSceneState<PayloadState>();
  const fixed = s.fixed ?? [];
  const open = TRAPS.find((t) => t.id === s.open);
  const json = `{\n  ${TRAPS.map((t) => (fixed.includes(t.id) ? t.good : t.bad)).join(",\n  ")}\n}`;
  return (
    <StepLayout
      eyebrow="Fix the problem"
      title="Fix the payment"
      stage={
        <div className="flex flex-1 flex-col justify-center gap-3">
          <div className="grid gap-3 sm:grid-cols-[1fr_1fr]">
            <div className="flex flex-col gap-1.5">
              {TRAPS.map((t) => {
                const done = fixed.includes(t.id);
                return (
                  <button
                    key={t.id}
                    type="button"
                    onClick={() => set({ open: t.id, fixed: done ? fixed : [...fixed, t.id] })}
                    className={cn(
                      "flex items-center gap-2 rounded-lg border px-3 py-1.5 text-left text-xs",
                      s.open === t.id
                        ? "border-accent bg-accent-soft"
                        : done
                          ? "border-good/50 bg-good/5"
                          : "border-bad/40 bg-bad/5 hover:bg-bad/10",
                    )}
                  >
                    {done ? (
                      <Check className="text-good size-3.5 shrink-0" />
                    ) : (
                      <span className="bg-bad size-1.5 shrink-0 rounded-full" />
                    )}
                    {t.label}
                  </button>
                );
              })}
              {fixed.length > 0 && (
                <button
                  type="button"
                  onClick={() => set({ fixed: [], open: null })}
                  className="text-muted flex items-center gap-1 self-start text-xs"
                >
                  <RotateCcw className="size-3" /> Reset
                </button>
              )}
            </div>
            <Code>{json}</Code>
          </div>
          {open ? (
            <motion.div
              key={open.id}
              initial={{ opacity: 0, y: 4 }}
              animate={{ opacity: 1, y: 0 }}
              className="border-line bg-surface rounded-xl border px-4 py-3 text-sm"
            >
              <p className="font-semibold">{open.label}</p>
              <p className="text-muted mt-1">{open.problem}</p>
            </motion.div>
          ) : (
            <p className="text-muted text-xs">Tap a trap to see what goes wrong, and fix it.</p>
          )}
          {fixed.length === TRAPS.length && (
            <p className="text-good text-sm">
              Every field now means one thing to every client, in every language.
            </p>
          )}
        </div>
      }
    >
      <p>
        A UPI payment response, written in a hurry. Six fields will each mislead some client
        somewhere. Find them and fix them.
      </p>
      <p>
        Two of the demonstrations run live in your browser: JavaScript really does get these sums
        and IDs wrong. The JSON standard&apos;s own advice for interoperable data (I-JSON, RFC 7493)
        recommends sending numbers that big, or that precise, as strings.
      </p>
    </StepLayout>
  );
}

/* 3 ─ Pick a style, keep it ----------------------------------------------------------------------- */

const STYLES: [string, string, string][] = [
  [
    "Google (proto → JSON)",
    "payerName",
    "lower_snake_case in .proto files, lowerCamelCase in JSON",
  ],
  ["Microsoft Azure", "payerName", "“DO use camel case for all JSON field names.”"],
  ["Zalando", "payer_name", "Property names must be snake_case, never camelCase"],
  ["Stripe", "has_more", "snake_case parameters and fields, such as starting_after"],
];

export function Conventions() {
  return (
    <StepLayout
      eyebrow="Compare"
      title="Pick a style, keep it"
      stage={
        <div className="flex flex-1 flex-col justify-center gap-3">
          {STYLES.map(([who, eg, rule], i) => (
            <motion.div
              key={who}
              initial={{ opacity: 0, x: -6 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.07 * i }}
              className="border-line bg-surface grid gap-x-3 rounded-lg border px-3 py-2 sm:grid-cols-[10rem_7rem_1fr]"
            >
              <span className="text-sm font-semibold">{who}</span>
              <span className="text-accent font-mono text-xs">{eg}</span>
              <span className="text-muted text-xs">{rule}</span>
            </motion.div>
          ))}
          <Code>{`{ "data": [ … ], "meta": { "next": "…" } }   // an envelope
[ … ]                                       // a bare list`}</Code>
        </div>
      }
    >
      <p>
        snake_case or camelCase? Respected guides choose differently, and either works. Mixing them
        doesn&apos;t.
      </p>
      <p>
        The same goes for envelopes: some APIs wrap every response in an object such as{" "}
        <code>{"{ data, meta }"}</code> (JSON:API does), others return the resource directly. A
        wrapper leaves room to add paging links and metadata later without breaking anyone, which a
        bare list does not.
      </p>
    </StepLayout>
  );
}

/* 4 ─ Missing, null and new ----------------------------------------------------------------------- */

const CASES: [string, string, string][] = [
  ["Field absent", '{ "name": "Asha" }', "In a PATCH: leave the phone number as it is."],
  ["Field is null", '{ "phone": null }', "In a JSON Merge Patch: remove the phone number."],
  [
    "New enum value",
    '{ "status": "on_hold" }',
    "A value the client has never seen: show a sensible default, don't crash.",
  ],
];

export function NullsEnums() {
  return (
    <StepLayout
      eyebrow="Explore"
      title="Missing, null and new"
      stage={
        <div className="flex flex-1 flex-col justify-center gap-2">
          {CASES.map(([t, code, d], i) => (
            <motion.div
              key={t}
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.08 * i }}
              className="border-line bg-surface rounded-lg border px-3 py-2"
            >
              <p className="text-sm font-semibold">{t}</p>
              <p className="font-mono text-xs">{code}</p>
              <p className="text-muted text-xs">{d}</p>
            </motion.div>
          ))}
        </div>
      }
    >
      <p>
        &ldquo;Not sent&rdquo; and &ldquo;sent as null&rdquo; can mean different things, and an API
        should say which. JSON Merge Patch (RFC 7396) is a common rule: &ldquo;Null values in the
        merge patch are given special meaning to indicate the removal of existing values.&rdquo;
      </p>
      <p>
        Lists of allowed values (<Term id="enum">enums</Term>) grow over time. Zalando&apos;s
        guidelines tell clients to be prepared for new values and to &ldquo;provide default behavior
        for unknown values&rdquo;. Google&apos;s convention starts every enum with an{" "}
        <code>_UNSPECIFIED</code> value, so &ldquo;not set&rdquo; is never mistaken for a real one.
      </p>
    </StepLayout>
  );
}

/* 5 ─ Safe or trap? ------------------------------------------------------------------------------- */

export function SafeOrTrap() {
  return (
    <StepLayout
      eyebrow="Checkpoint"
      title="Safe or trap?"
      stage={
        <div className="flex flex-1 flex-col justify-center">
          <SortCheckpoint
            id="safe-or-trap"
            prompt="Is each field safe for every client, or a trap?"
            categories={[
              { id: "safe", label: "Safe" },
              { id: "trap", label: "Trap" },
            ]}
            items={[
              {
                id: "minor",
                label: '"amount": 1099, "currency": "usd"',
                category: "safe",
                why: "Whole cents plus the currency: Stripe's own convention.",
              },
              {
                id: "iso",
                label: '"due": "2026-10-03T09:00:00Z"',
                category: "safe",
                why: "RFC 3339: year first, with the offset.",
              },
              {
                id: "strid",
                label: '"id": "ord_7XKq2"',
                category: "safe",
                why: "A string ID: never rounded, and it can change format later.",
              },
              {
                id: "float",
                label: '"price": 10.99',
                category: "trap",
                why: "Floating-point money: rounding errors creep into totals.",
              },
              {
                id: "short",
                label: '"due": "10/03/26"',
                category: "trap",
                why: "Which day, month and century?",
              },
              {
                id: "bignum",
                label: '"id": 12345678901234567890',
                category: "trap",
                why: "Too big for a JavaScript number: it silently changes.",
              },
            ]}
            explanation="Money in minor units with a currency, timestamps in RFC 3339, IDs as strings."
          />
        </div>
      }
    >
      <p>Would a client in any language, anywhere, read these the same way?</p>
    </StepLayout>
  );
}

/* 6 ─ Wrap ---------------------------------------------------------------------------------------- */

const POINTS: [string, string][] = [
  ["Money", "Integer minor units plus an ISO 4217 currency code."],
  ["Time", "RFC 3339 timestamps with an offset."],
  ["IDs", "Strings, even when they look like numbers."],
  ["One naming style", "snake_case or camelCase, everywhere."],
  ["Plan for change", "Say what null means; tolerate unknown enum values."],
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
      <p>Next: when there are a million records, how to hand them over a page at a time.</p>
    </StepLayout>
  );
}
