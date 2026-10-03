"use client";

import { motion } from "motion/react";
import { ArrowUpDown, Coffee } from "lucide-react";
import { useSceneState } from "@/lib/module-sdk";
import { StepLayout } from "@/toolkit/layout/step-layout";
import { SortCheckpoint } from "@/toolkit/checkpoints/sort";
import { Code } from "@/toolkit/controls/stepper";
import { Term } from "@/toolkit/glossary/term";
import { cn } from "@/lib/cn";
import { FAILURES, run, type Failure } from "./model";
import type { IdemState } from "./state";

/* 1 ─ The lift button ----------------------------------------------------------------------------- */

export function LiftButton() {
  return (
    <StepLayout
      eyebrow="Story"
      title="The lift button"
      stage={
        <div className="grid flex-1 content-center gap-3 sm:grid-cols-2">
          <div className="border-good/40 bg-good/5 flex flex-col gap-2 rounded-xl border px-4 py-3">
            <ArrowUpDown className="text-good size-5" />
            <p className="font-semibold">Press it five times</p>
            <p className="text-muted text-sm">One lift comes. Pressing again changes nothing.</p>
          </div>
          <div className="border-bad/40 bg-bad/5 flex flex-col gap-2 rounded-xl border px-4 py-3">
            <Coffee className="text-bad size-5" />
            <p className="font-semibold">A vending machine</p>
            <p className="text-muted text-sm">
              Press &ldquo;coffee&rdquo; five times and pay for five coffees.
            </p>
          </div>
        </div>
      }
    >
      <p>
        Calling a lift is <Term id="idempotent">idempotent</Term>: doing it again has no extra
        effect. Buying a coffee isn&apos;t. That difference matters whenever you&apos;re not sure
        your first press worked.
      </p>
      <p>
        On a network you&apos;re often not sure. A request can be lost on the way, or the reply on
        the way back, and from the app&apos;s side the two look identical: silence. So apps retry,
        and an API has to make retrying safe.
      </p>
    </StepLayout>
  );
}

/* 2 ─ Pay ₹500, once ⭐ --------------------------------------------------------------------------- */

export function PayTwice() {
  const [s, set] = useSceneState<IdemState>();
  const r = run(s.failure, s.key);
  return (
    <StepLayout
      eyebrow="Simulation"
      title="Pay ₹500, once"
      stage={
        <div className="flex flex-1 flex-col justify-center gap-3">
          <div className="flex flex-wrap gap-1.5">
            {(Object.keys(FAILURES) as Failure[]).map((f) => (
              <button
                key={f}
                type="button"
                aria-pressed={s.failure === f}
                onClick={() => set({ failure: f })}
                className={cn(
                  "rounded-full border px-2.5 py-1 text-[11px]",
                  s.failure === f
                    ? "border-accent bg-accent-soft"
                    : "border-line hover:bg-surface-2",
                )}
              >
                {FAILURES[f].label}
              </button>
            ))}
          </div>
          <p className="text-muted text-xs">{FAILURES[s.failure].note}</p>
          <button
            type="button"
            aria-pressed={s.key}
            onClick={() => set({ key: !s.key })}
            className={cn(
              "flex items-center gap-2 self-start rounded-lg border px-3 py-1.5 text-xs",
              s.key ? "border-accent bg-accent-soft" : "border-line hover:bg-surface-2",
            )}
          >
            <span
              className={cn(
                "relative h-4 w-7 rounded-full transition-colors",
                s.key ? "bg-accent" : "bg-surface-2",
              )}
            >
              <span
                className={cn(
                  "bg-bg absolute top-0.5 size-3 rounded-full transition-all",
                  s.key ? "left-3.5" : "left-0.5",
                )}
              />
            </span>
            Send an Idempotency-Key
          </button>
          <div className="flex flex-col gap-1">
            {r.events.map((e, i) => (
              <motion.div
                key={`${s.failure}-${s.key}-${i}`}
                initial={{ opacity: 0, x: e.who === "app" ? -6 : 6 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.12 * i }}
                className={cn(
                  "max-w-[85%] rounded-lg border px-3 py-1.5 font-mono text-[11px]",
                  e.who === "app" ? "self-start" : "self-end",
                  e.bad
                    ? "border-bad/60 bg-bad/10"
                    : e.good
                      ? "border-good/50 bg-good/10"
                      : "border-line bg-surface",
                )}
              >
                <span className="text-muted mr-1">{e.who === "app" ? "app →" : "server:"}</span>
                {e.text}
              </motion.div>
            ))}
          </div>
          <motion.p
            key={`${s.failure}-${s.key}-out`}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.12 * r.events.length }}
            className={cn(
              "rounded-xl border px-4 py-2 text-sm font-semibold",
              r.charges > 1 ? "border-bad/60 bg-bad/10" : "border-good/50 bg-good/10",
            )}
          >
            Customer charged {r.charges === 1 ? "₹500, once" : `₹${500 * r.charges}: twice`}
          </motion.p>
          <p className="text-subtle text-[10px]">Illustrative timeline.</p>
        </div>
      }
    >
      <p>
        The app pays ₹500 and something goes wrong on the network. The app does the sensible thing
        and retries. Try all three failures, with and without the key.
      </p>
      <p>
        An <Term id="idempotency-key">idempotency key</Term> is a unique value the app generates
        once per payment and sends with every retry. The server remembers what it did for that key
        and, instead of charging again, replays the result.
      </p>
    </StepLayout>
  );
}

/* 3 ─ How the server remembers -------------------------------------------------------------------- */

export function KeyStore() {
  return (
    <StepLayout
      eyebrow="Explore"
      title="How the server remembers"
      stage={
        <div className="flex flex-1 flex-col justify-center gap-3">
          <Code>{`idempotency_keys
key        request_hash  state      response
9f1c…      a81e…         done       201 {"id":"pay_77",…}
c03b…      77d2…         running    —`}</Code>
          <div className="flex flex-col gap-1.5 text-xs">
            {[
              ["Same key, same request, finished", "Replay the saved status and body"],
              ["Same key, same request, still running", "409 Conflict: try again shortly"],
              ["Same key, different request", "422: that key was used for something else"],
              ["No key where one is required", "400 Bad Request"],
            ].map(([w, a]) => (
              <div
                key={w}
                className="border-line bg-surface grid gap-x-3 rounded-lg border px-3 py-1.5 sm:grid-cols-[1fr_1fr]"
              >
                <span>{w}</span>
                <span className="text-muted">{a}</span>
              </div>
            ))}
          </div>
          <p className="text-subtle text-[10px]">
            Behaviour suggested by the IETF Idempotency-Key Internet-Draft (latest -07, Oct 2025,
            not an RFC).
          </p>
        </div>
      }
    >
      <p>
        Stripe is a well-known example. Its idempotency layer works &ldquo;by saving the resulting
        status code and body of the first request made for any given idempotency key, regardless of
        whether it succeeds or fails&rdquo;. Keys may be pruned once they&apos;re at least 24 hours
        old, and reusing a key with different parameters is an error.
      </p>
      <p>
        Others do the same under different names: PayPal&apos;s <code>PayPal-Request-Id</code>,
        AWS&apos;s <code>ClientToken</code>. AWS describes the goal as a &ldquo;semantically
        equivalent response in every case for the same unique request identifier&rdquo;.
      </p>
    </StepLayout>
  );
}

/* 4 ─ Retrying politely --------------------------------------------------------------------------- */

const RULES: [string, string][] = [
  ["Retry only what's safe", "Idempotent methods, or requests carrying an idempotency key."],
  [
    "Back off, with jitter",
    "Wait longer after each failure, plus a random amount, so clients don't retry in lockstep.",
  ],
  ["Give up eventually", "A limit on attempts, then a clear error to the user."],
  ["Respect the server", "Honour Retry-After on 429 and 503."],
];

export function RetryWell() {
  return (
    <StepLayout
      eyebrow="Explore"
      title="Retrying politely"
      stage={
        <div className="flex flex-1 flex-col justify-center gap-2">
          {RULES.map(([t, d], i) => (
            <motion.div
              key={t}
              initial={{ opacity: 0, x: -6 }}
              animate={{ opacity: 1, x: 0 }}
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
        RFC 9110 explains why idempotency matters for retries: an idempotent request &ldquo;can be
        repeated automatically if a communication failure occurs before the client is able to read
        the server&apos;s response&rdquo;.
      </p>
      <p>
        How you retry matters too. Marc Brooker at AWS showed that retrying on a fixed schedule
        makes clients pile up together: &ldquo;The solution isn&apos;t to remove backoff. It&apos;s
        to add jitter.&rdquo; System Design&apos;s retries module shows a retry storm in action.
      </p>
    </StepLayout>
  );
}

/* 5 ─ Safe to retry? ------------------------------------------------------------------------------ */

export function SafeToRetry() {
  return (
    <StepLayout
      eyebrow="Checkpoint"
      title="Safe to retry?"
      stage={
        <div className="flex flex-1 flex-col justify-center">
          <SortCheckpoint
            id="safe-to-retry"
            prompt="The reply never arrived. Can the app safely send each request again?"
            categories={[
              { id: "safe", label: "Safe to retry" },
              { id: "risky", label: "Risky" },
            ]}
            items={[
              {
                id: "get",
                label: "GET /orders/ord_9",
                category: "safe",
                why: "Reading twice changes nothing.",
              },
              {
                id: "put",
                label: "PUT /members/9 with the full new address",
                category: "safe",
                why: "Replacing with the same data twice leaves the same result.",
              },
              {
                id: "delete",
                label: "DELETE /cards/card_3",
                category: "safe",
                why: "Already deleted stays deleted (the second reply may be 404, which is fine).",
              },
              {
                id: "keyed",
                label: "POST /payments with an Idempotency-Key",
                category: "safe",
                why: "The server replays the first result instead of charging again.",
              },
              {
                id: "post",
                label: "POST /payments with no key",
                category: "risky",
                why: "The server can't tell a retry from a new payment.",
              },
              {
                id: "sms",
                label: "POST /messages to send an OTP by SMS, no key",
                category: "risky",
                why: "The customer may get two codes, and the second may cancel the first.",
              },
            ]}
            explanation="Idempotent methods are safe to repeat; a POST becomes safe only with a key the server remembers."
          />
        </div>
      }
    >
      <p>Silence from the server: which of these can the app send again without harm?</p>
    </StepLayout>
  );
}

/* 6 ─ Wrap ---------------------------------------------------------------------------------------- */

const POINTS: [string, string][] = [
  ["Silence is ambiguous", "Lost request or lost reply look the same."],
  ["Clients will retry", "Design for it."],
  ["Idempotency keys", "One key per operation; the server replays the result."],
  ["Same key, different body", "Reject it."],
  ["Retry politely", "Backoff, jitter, limits, Retry-After."],
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
        That completes the core of REST design. Next chapter: writing the contract down precisely,
        and changing it without breaking anyone.
      </p>
    </StepLayout>
  );
}
