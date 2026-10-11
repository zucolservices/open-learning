"use client";

import { motion } from "motion/react";
import { useSceneState } from "@/lib/module-sdk";
import { StepLayout } from "@/toolkit/layout/step-layout";
import { WrapStep } from "@/toolkit/layout/wrap-step";
import { ChoiceCheckpoint } from "@/toolkit/checkpoints/choice";
import { Segmented } from "@/toolkit/controls/segmented";
import { Term } from "@/toolkit/glossary/term";
import { cn } from "@/lib/cn";
import { MODES, TIMELINES, type Mode } from "./model";
import type { TxState } from "./state";

/* 1 ─ Story ---------------------------------------------------------------------------------------- */

export function LastSeat() {
  return (
    <StepLayout
      eyebrow="Story"
      title="The last seat on the bus"
      stage={
        <div className="flex flex-1 flex-col justify-center gap-2">
          {[
            ["Two ticket offices", "Both see one seat left on the 9:15."],
            ["Both sell it", "Two passengers, one seat, one unhappy traveller at the bus stop."],
            [
              "The fix",
              "Whoever takes the seat must check and claim it in one go, so the other office sees it's gone.",
            ],
          ].map(([t, b], i) => (
            <motion.div
              key={t}
              initial={{ opacity: 0, x: -4 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.12 * i }}
              className={cn(
                "rounded-lg border px-3 py-2 text-xs",
                i === 1 ? "border-bad/40 bg-bad/10" : "border-line bg-surface",
              )}
            >
              <span className="font-semibold">{t}</span>
              <span className="text-muted"> · {b}</span>
            </motion.div>
          ))}
        </div>
      }
    >
      <p>
        Two ticket offices selling the same last seat will, sooner or later, both sell it. Checking
        and then claiming, as two separate steps, leaves a gap.
      </p>
      <p>
        Servers handle many requests at once, so the same gap appears in code. A{" "}
        <Term id="transaction">transaction</Term> groups changes so they all happen or none do, and
        locks or version checks close the gap between checking and writing.
      </p>
    </StepLayout>
  );
}

/* 2 ─ Race ⭐ -------------------------------------------------------------------------------------- */

export function Race() {
  const [s, set] = useSceneState<TxState>();
  const t = TIMELINES[s.mode];
  return (
    <StepLayout
      eyebrow="Simulation"
      title="Two buyers, one chai"
      stage={
        <div className="flex flex-1 flex-col justify-center gap-3">
          <Segmented<Mode>
            size="sm"
            value={s.mode}
            onChange={(mode) =>
              set({ mode, tried: s.tried.includes(mode) ? s.tried : [...s.tried, mode] })
            }
            options={MODES.map((m) => [m.id, m.label])}
          />
          <div className="grid gap-1">
            {t.rows.map((r, i) => (
              <motion.div
                key={`${s.mode}-${i}`}
                initial={{ opacity: 0, x: r.who === "Asha" ? -6 : 6 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.15 }}
                className={cn(
                  "rounded-lg border px-3 py-1.5 text-xs",
                  r.who === "Asha"
                    ? "border-viz-data bg-viz-data/10 mr-6"
                    : "border-viz-meta bg-viz-meta/10 ml-6",
                )}
              >
                <span className="font-semibold">{r.who}</span>
                <code className="text-muted ml-2 font-mono text-[10.5px] break-all">{r.sql}</code>
                <span className="text-subtle block font-mono text-[10px]">
                  stock {r.stock}
                </span>
                {r.note && <p className="text-muted mt-0.5 text-[10px]">{r.note}</p>}
              </motion.div>
            ))}
          </div>
          <div
            className={cn(
              "rounded-lg border px-3 py-2 text-xs",
              t.ok ? "border-good/50 bg-good/10" : "border-bad/40 bg-bad/10",
            )}
          >
            <span className="font-mono font-semibold">
              {t.orders} order{t.orders > 1 ? "s" : ""}
            </span>{" "}
            · {t.verdict}
          </div>
          <label className="flex items-center gap-2 text-xs">
            <input type="checkbox" checked={s.tx} onChange={() => set({ tx: !s.tx })} />
            Wrap the stock change and the order in one transaction
          </label>
          <p className={cn("text-[11px]", s.tx ? "text-good" : "text-bad")}>
            If the server crashes after reducing stock but before saving the order:{" "}
            {s.tx
              ? "the whole transaction rolls back; the chai is still for sale."
              : "stock says 0 and there's no order. The chai has vanished."}
          </p>
        </div>
      }
    >
      <p>
        Asha and Ravi (both made up) tap Buy on the last masala chai at the same instant. Try each
        strategy and watch the order of events.
      </p>
      <p>
        Two separate problems: requests overlapping (fixed by conditional updates, locks or version
        checks) and half-finished work after a failure (fixed by a transaction).
      </p>
    </StepLayout>
  );
}

/* 3 ─ Isolation ------------------------------------------------------------------------------------ */

export function Isolation() {
  return (
    <StepLayout
      eyebrow="Explore"
      title="Isolation levels and their defaults"
      stage={
        <div className="flex flex-1 flex-col justify-center gap-2">
          <div className="grid gap-1.5 text-xs sm:grid-cols-3">
            {[
              ["PostgreSQL", "Read Committed"],
              ["MySQL (InnoDB)", "Repeatable Read"],
              ["SQL Server", "Read Committed (Azure SQL uses row versioning by default)"],
            ].map(([d, l]) => (
              <div key={d} className="border-line bg-surface rounded-lg border px-2 py-1.5">
                <p className="text-muted text-[10px]">{d}</p>
                <p className="font-semibold">{l}</p>
              </div>
            ))}
          </div>
          {[
            [
              "Lost update",
              "Two read-then-write requests overwrite each other. Read Committed doesn't prevent it.",
            ],
            ["Write skew", "Two requests each check a rule and both write, breaking it together."],
            [
              "Serializable",
              "The strictest level: the database may abort one transaction, and your code must retry.",
            ],
            [
              "Keep transactions short",
              "Never hold one open across a network call, like a payment provider.",
            ],
          ].map(([t, b], i) => (
            <motion.div
              key={t}
              initial={{ opacity: 0, x: -4 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.05 * i }}
              className="border-line bg-surface rounded-lg border px-3 py-1.5 text-xs"
            >
              <span className="font-semibold">{t}</span>
              <span className="text-muted"> · {b}</span>
            </motion.div>
          ))}
        </div>
      }
    >
      <p>
        Transactions are ACID: atomic, consistent, isolated and durable. &ldquo;Isolated&rdquo;
        comes in levels, and the defaults are weaker than many developers assume.
      </p>
      <p>
        The default levels allow the race you just saw. Don&apos;t rely on the isolation level
        alone; use one of the explicit techniques.
      </p>
    </StepLayout>
  );
}

/* 4 ─ Idempotency ---------------------------------------------------------------------------------- */

export function Idempotency() {
  return (
    <StepLayout
      eyebrow="Explore"
      title="Retries without double charges"
      stage={
        <div className="flex flex-1 flex-col justify-center gap-3">
          <pre className="border-line bg-surface overflow-x-auto rounded-lg border p-3 font-mono text-[10.5px]">
            {
              "POST /payments\nIdempotency-Key: 6f1c…  (a random ID the client makes once)\n\n1st try  → server charges, saves (key → response)\n2nd try  → same key seen: replay the saved response, no new charge"
            }
          </pre>
          <div className="grid gap-1 text-xs">
            {[
              [
                "Stripe",
                "Keys up to 255 characters, kept at least 24 hours; the saved response is replayed, even if it was an error.",
              ],
              [
                "The standard",
                "An IETF draft for an Idempotency-Key header expired in 2026 without becoming an RFC, but the pattern is widely used.",
              ],
            ].map(([t, b]) => (
              <div key={t} className="border-line bg-surface rounded-lg border px-3 py-1.5">
                <span className="font-semibold">{t}</span>
                <span className="text-muted"> · {b}</span>
              </div>
            ))}
          </div>
        </div>
      }
    >
      <p>
        Networks drop replies, so clients retry. For POST requests that create things, a retry can
        create a duplicate. An <Term id="idempotency-key">idempotency key</Term> lets the server
        recognise a retry.
      </p>
      <p>
        Store the key in the same transaction as the change it protects, with a unique constraint,
        so two simultaneous retries can&apos;t both succeed.
      </p>
    </StepLayout>
  );
}

/* 5 ─ Checkpoint ----------------------------------------------------------------------------------- */

export function TxCheck() {
  return (
    <StepLayout
      eyebrow="Checkpoint"
      title="Charged twice"
      stage={
        <div className="flex flex-1 flex-col justify-center">
          <ChoiceCheckpoint
            id="backend-transactions"
            prompt="A customer's Pay request timed out on a weak connection; the app retried automatically and they were charged twice. What's the right fix?"
            options={[
              {
                id: "noretry",
                label: "Stop the app retrying",
                feedback: "Then a genuinely lost request means no payment and a confused customer.",
              },
              {
                id: "key",
                label:
                  "Send an idempotency key with the request, and have the server replay the first result for repeats",
                correct: true,
                feedback: "Right: retries become safe, and the customer is charged once.",
              },
              {
                id: "serial",
                label: "Use the Serializable isolation level",
                feedback:
                  "Isolation protects concurrent transactions; it can't tell that two separate requests are the same payment.",
              },
            ]}
            explanation="Make retryable operations idempotent. A client-generated key lets the server spot and replay repeats."
          />
        </div>
      }
    >
      <p>Choose one.</p>
    </StepLayout>
  );
}

/* 6 ─ Wrap ----------------------------------------------------------------------------------------- */

export function Wrap() {
  return (
    <WrapStep
      points={[
        ["All or nothing", "Group related writes in a transaction."],
        ["Close the check-then-write gap", "Conditional update, lock or version."],
        ["Defaults are weaker than you think", "Don't rely on isolation alone."],
        ["Short transactions", "No network calls inside."],
        ["Idempotency keys", "Retries without duplicates."],
      ]}
    >
      <p>Next: caching, and keeping it fresh.</p>
    </WrapStep>
  );
}
