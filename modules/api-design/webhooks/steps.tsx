"use client";

import { motion } from "motion/react";
import { Check, PhoneCall, PhoneIncoming } from "lucide-react";
import { useSceneState } from "@/lib/module-sdk";
import { StepLayout } from "@/toolkit/layout/step-layout";
import { SortCheckpoint } from "@/toolkit/checkpoints/sort";
import { Code } from "@/toolkit/controls/stepper";
import { Term } from "@/toolkit/glossary/term";
import { cn } from "@/lib/cn";
import { DEFENCES, day, type Defence } from "./model";
import type { HookState } from "./state";

/* 1 ─ The tailor will call ------------------------------------------------------------------------ */

export function Tailor() {
  return (
    <StepLayout
      eyebrow="Story"
      title="The tailor will call"
      stage={
        <div className="grid flex-1 content-center gap-3 sm:grid-cols-2">
          <div className="border-line bg-surface flex flex-col gap-2 rounded-xl border px-4 py-3">
            <PhoneCall className="text-muted size-5" />
            <p className="font-semibold">You ring every morning</p>
            <p className="text-muted text-sm">
              &ldquo;Is my kurta ready?&rdquo; &ldquo;Not yet.&rdquo; Nine calls wasted, and you
              still hear a day late.
            </p>
          </div>
          <div className="border-accent/50 bg-accent-soft flex flex-col gap-2 rounded-xl border px-4 py-3">
            <PhoneIncoming className="text-accent size-5" />
            <p className="font-semibold">The tailor rings you</p>
            <p className="text-muted text-sm">One call, the moment it&apos;s ready.</p>
          </div>
        </div>
      }
    >
      <p>
        Asking again and again is <Term id="polling">polling</Term>. Being told is a{" "}
        <Term id="webhook">webhook</Term>: the API sends an HTTP request to a URL you gave it, the
        moment something happens. Jeff Lindsay described them in 2007 as &ldquo;user defined
        callbacks made with HTTP POST&rdquo;.
      </p>
      <p>
        Payment providers use them to say a payment succeeded, failed or was refunded. Now the roles
        are reversed: <em>you</em> run the server, and the provider is the client, with all the
        network trouble that brings.
      </p>
    </StepLayout>
  );
}

/* 2 ─ A bad day of deliveries ⭐ ------------------------------------------------------------------ */

export function BadDay() {
  const [s, set] = useSceneState<HookState>();
  const on = s.on ?? [];
  const r = day(on);
  const toggle = (d: Defence) =>
    set({ on: on.includes(d) ? on.filter((x) => x !== d) : [...on, d] });
  return (
    <StepLayout
      eyebrow="Simulation"
      title="A bad day of deliveries"
      stage={
        <div className="flex flex-1 flex-col justify-center gap-3">
          <div className="grid gap-1.5 sm:grid-cols-2">
            {DEFENCES.map((d) => {
              const active = on.includes(d.id);
              return (
                <button
                  key={d.id}
                  type="button"
                  aria-pressed={active}
                  onClick={() => toggle(d.id)}
                  className={cn(
                    "flex items-start gap-2 rounded-lg border px-3 py-1.5 text-left text-xs",
                    active ? "border-accent bg-accent-soft" : "border-line hover:bg-surface-2",
                  )}
                >
                  <span
                    className={cn(
                      "mt-0.5 flex size-3.5 shrink-0 items-center justify-center rounded border",
                      active ? "border-accent bg-accent text-accent-fg" : "border-line",
                    )}
                  >
                    {active && <Check className="size-2.5" />}
                  </span>
                  <span>
                    <span className="font-medium">{d.label}</span>
                    <span className="text-muted block text-[11px]">{d.note}</span>
                  </span>
                </button>
              );
            })}
          </div>
          <div className="flex flex-col gap-1.5">
            {r.rows.map((row, i) => (
              <motion.div
                key={row.label + on.join()}
                initial={{ opacity: 0, x: 6 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.06 * i }}
                className={cn(
                  "rounded-lg border px-3 py-1.5",
                  row.bad ? "border-bad/50 bg-bad/10" : "border-good/40 bg-good/5",
                )}
              >
                <p className="font-mono text-[10px]">{row.label}</p>
                <p className="text-xs">{row.outcome}</p>
              </motion.div>
            ))}
          </div>
          <p
            className={cn(
              "rounded-lg border px-3 py-2 text-sm font-semibold",
              r.problems ? "border-bad/50 bg-bad/10" : "border-good/50 bg-good/10",
            )}
          >
            {r.problems
              ? `${r.problems} problem${r.problems > 1 ? "s" : ""}: ${r.shipped} parcels shipped for 2 real orders.`
              : "Two real orders, two parcels, every status correct."}
          </p>
          <p className="text-subtle text-[10px]">Illustrative deliveries.</p>
        </div>
      }
    >
      <p>
        A shop ships parcels when its payment provider says a payment succeeded. Today the
        deliveries misbehave in every way they really do. Switch on defences until nothing goes
        wrong.
      </p>
      <p>
        These aren&apos;t rare. Stripe&apos;s docs warn that the same event may arrive &ldquo;more
        than once&rdquo; and that it &ldquo;doesn&apos;t guarantee the delivery of events in the
        order that they&apos;re generated&rdquo;. Webhooks are delivered at least once, not exactly
        once.
      </p>
    </StepLayout>
  );
}

/* 3 ─ Is it really from them? --------------------------------------------------------------------- */

const HEADERS: [string, string][] = [
  ["Stripe", "Stripe-Signature: t=1759566000,v1=5257a8…"],
  ["GitHub", "X-Hub-Signature-256: sha256=757107ea…"],
  ["Razorpay", "X-Razorpay-Signature: 3b8f1c…"],
  ["Standard Webhooks", "webhook-id, webhook-timestamp, webhook-signature"],
];

export function Signing() {
  return (
    <StepLayout
      eyebrow="Explore"
      title="Is it really from them?"
      stage={
        <div className="flex flex-1 flex-col justify-center gap-3">
          <Code>{`expected = HMAC_SHA256(secret, timestamp + "." + raw_body)
if not constant_time_equal(expected, signature_from_header):
    return 400            # not from the provider
if now - timestamp > 5 minutes:
    return 400            # an old message being replayed`}</Code>
          <div className="flex flex-col gap-1">
            {HEADERS.map(([w, h]) => (
              <p key={w} className="grid grid-cols-[8rem_1fr] gap-2 text-[11px]">
                <span className="font-semibold">{w}</span>
                <span className="text-muted font-mono break-all">{h}</span>
              </p>
            ))}
          </div>
        </div>
      }
    >
      <p>
        Your webhook URL is public: anyone can POST to it. So providers <Term id="hmac">sign</Term>{" "}
        every delivery with a secret only you and they share. You recompute the signature over the
        exact bytes received and compare.
      </p>
      <p>
        Two details matter. GitHub&apos;s docs say never to compare signatures with a plain{" "}
        <code>==</code>; use a constant-time comparison so timing doesn&apos;t leak the answer. And
        include the timestamp: Stripe&apos;s libraries reject events older than five minutes by
        default, which stops a captured message being replayed later.
      </p>
    </StepLayout>
  );
}

/* 4 ─ The sender's side --------------------------------------------------------------------------- */

const SENDERS: [string, string][] = [
  [
    "Retries",
    "Stripe retries for up to three days in live mode; Razorpay for 24 hours, then disables the webhook; GitHub doesn't retry automatically.",
  ],
  [
    "Timeouts",
    "GitHub expects a 2xx within 10 seconds; Razorpay within 5. Reply first, work later.",
  ],
  [
    "Thin or full events",
    "A full event carries the whole object; a thin one (Stripe's v2 'thin events') just says what changed, and you fetch the details.",
  ],
  [
    "Standards",
    "CloudEvents (a CNCF graduated spec) gives events a common envelope: id, source, specversion, type. AsyncAPI describes event-driven APIs the way OpenAPI describes REST.",
  ],
  [
    "Don't become a weapon",
    "If customers can set any webhook URL, someone will point it at your internal network. OWASP lists custom webhooks as a server-side request forgery risk.",
  ],
];

export function SenderSide() {
  return (
    <StepLayout
      eyebrow="Explore"
      title="The sender's side"
      stage={
        <div className="flex flex-1 flex-col justify-center gap-2">
          {SENDERS.map(([t, d], i) => (
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
        If you&apos;re the API sending webhooks, you owe your receivers the same care: sign every
        delivery, retry with backoff, give each event a unique ID, and let people see and resend
        failed deliveries.
      </p>
      <p>
        The Standard Webhooks specification, written by a community group including Svix, Zapier,
        Twilio and Kong, recommends using the <code>webhook-id</code> as an idempotency key, which
        ties straight back to module 8.
      </p>
    </StepLayout>
  );
}

/* 5 ─ Should the receiver…? ----------------------------------------------------------------------- */

export function ReceiverRules() {
  return (
    <StepLayout
      eyebrow="Checkpoint"
      title="Should the receiver…?"
      stage={
        <div className="flex flex-1 flex-col justify-center">
          <SortCheckpoint
            id="receiver-rules"
            prompt="Which of these should a webhook receiver do?"
            categories={[
              { id: "do", label: "Do" },
              { id: "dont", label: "Don't" },
            ]}
            items={[
              {
                id: "verify",
                label: "Check the signature before trusting anything in the body",
                category: "do",
                why: "Anyone can POST to your URL.",
              },
              {
                id: "ack",
                label: "Reply 2xx quickly and process the event in the background",
                category: "do",
                why: "Slow replies cause timeouts and retries.",
              },
              {
                id: "ids",
                label: "Record event IDs and skip ones already handled",
                category: "do",
                why: "Deliveries are at least once.",
              },
              {
                id: "secret-url",
                label: "Trust events because the URL is hard to guess",
                category: "dont",
                why: "URLs leak in logs and screenshots; only a signature proves the sender.",
              },
              {
                id: "eq",
                label: "Compare signatures with a plain ==",
                category: "dont",
                why: "Use a constant-time comparison.",
              },
              {
                id: "order",
                label: "Assume events arrive in the order they happened",
                category: "dont",
                why: "Providers don't guarantee order; check the current state.",
              },
            ]}
            explanation="Verify, acknowledge fast, deduplicate, and never rely on secrecy or ordering."
          />
        </div>
      }
    >
      <p>Your receiver is a public API now. Treat it like one.</p>
    </StepLayout>
  );
}

/* 6 ─ Wrap ---------------------------------------------------------------------------------------- */

const POINTS: [string, string][] = [
  ["Webhooks push, polling pulls", "Learn sooner, waste less."],
  ["At least once", "Expect duplicates; dedupe by event ID."],
  ["No ordering promise", "Check current state before acting."],
  ["Verify every delivery", "HMAC signature, constant-time, with a timestamp."],
  ["Ack fast", "Reply 2xx, then do the work."],
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
      <p>Next: when updates must reach a screen within a second, polling, streams and sockets.</p>
    </StepLayout>
  );
}
