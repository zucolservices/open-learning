"use client";

import { motion } from "motion/react";
import { Check, X } from "lucide-react";
import { useSceneState } from "@/lib/module-sdk";
import { StepLayout } from "@/toolkit/layout/step-layout";
import { WrapStep } from "@/toolkit/layout/wrap-step";
import { OrderCheckpoint } from "@/toolkit/checkpoints/order";
import { Term } from "@/toolkit/glossary/term";
import { cn } from "@/lib/cn";
import { PARTS, SCENARIOS } from "./model";
import type { HookState } from "./state";

/* 1 ─ Story ---------------------------------------------------------------------------------------- */

export function Courier() {
  return (
    <StepLayout
      eyebrow="Story"
      title="A courier with a sealed envelope"
      stage={
        <div className="flex flex-1 flex-col justify-center gap-2">
          {[
            [
              "Write it in the ledger first",
              "So nothing is forgotten if the office closes suddenly.",
            ],
            [
              "Seal and stamp it",
              "The recipient can tell it's really from you, and when it was sent.",
            ],
            ["Try again if nobody answers", "Waiting longer each time."],
            [
              "The recipient keeps a list",
              "If the same envelope comes twice, they don't act twice.",
            ],
          ].map(([t, b], i) => (
            <motion.div
              key={t}
              initial={{ opacity: 0, x: -4 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1 * i }}
              className="border-line bg-surface rounded-lg border px-3 py-2 text-xs"
            >
              <span className="font-semibold">{t}</span>
              <span className="text-muted"> · {b}</span>
            </motion.div>
          ))}
        </div>
      }
    >
      <p>
        A reliable courier service records each delivery before sending, seals and stamps it, keeps
        trying until it&apos;s received, and the recipient ignores duplicates.
      </p>
      <p>
        <Term id="webhook">Webhooks</Term> are a backend&apos;s courier: an HTTP request sent to
        another system when something happens, like &ldquo;order paid&rdquo;. Making them reliable
        and trustworthy takes all four habits.
      </p>
    </StepLayout>
  );
}

/* 2 ─ Build ⭐ ------------------------------------------------------------------------------------- */

export function Pipeline() {
  const [s, set] = useSceneState<HookState>();
  const on = (id: string) => s.on.includes(id);
  const toggle = (id: string) => set({ on: on(id) ? s.on.filter((x) => x !== id) : [...s.on, id] });
  const results = SCENARIOS.map((sc) => ({ ...sc, ok: sc.needs.every(on) }));
  return (
    <StepLayout
      eyebrow="Build and connect"
      title="Build a reliable webhook pipeline"
      stage={
        <div className="grid flex-1 content-center gap-3 lg:grid-cols-2">
          <div className="grid content-start gap-1">
            {(["Sender", "Receiver"] as const).map((side) => (
              <div key={side} className="grid gap-1">
                <p className="text-muted text-[10px] font-medium">{side}</p>
                {PARTS.filter((p) => p.side === side).map((p) => (
                  <button
                    key={p.id}
                    type="button"
                    aria-pressed={on(p.id)}
                    onClick={() => toggle(p.id)}
                    className={cn(
                      "rounded-lg border px-3 py-1.5 text-left text-xs",
                      on(p.id) ? "border-good/50 bg-good/10" : "border-line bg-surface",
                    )}
                  >
                    {p.label}
                  </button>
                ))}
              </div>
            ))}
          </div>
          <div className="grid content-start gap-1">
            {results.map((r) => (
              <motion.div
                key={r.id}
                layout
                className={cn(
                  "rounded-lg border px-3 py-1.5 text-xs",
                  r.ok ? "border-good/50 bg-good/10" : "border-bad/40 bg-bad/10",
                )}
              >
                <p className="flex items-center gap-1 font-medium">
                  {r.ok ? (
                    <Check className="text-good size-3.5 shrink-0" />
                  ) : (
                    <X className="text-bad size-3.5 shrink-0" />
                  )}
                  {r.label}
                </p>
                <p className="text-muted text-[10.5px]">{r.ok ? r.pass : r.fail}</p>
              </motion.div>
            ))}
          </div>
        </div>
      }
    >
      <p>
        The café sends &ldquo;order paid&rdquo; events to a delivery partner. Add parts to the
        pipeline, on both the sending and receiving side, until all six scenarios pass.
      </p>
      <p>Attacks are described, not performed.</p>
    </StepLayout>
  );
}

/* 3 ─ Signatures ----------------------------------------------------------------------------------- */

export function Signatures() {
  return (
    <StepLayout
      eyebrow="Explore"
      title="How the big providers sign webhooks"
      stage={
        <div className="flex flex-1 flex-col justify-center gap-1.5">
          {[
            [
              "Standard Webhooks (late 2023)",
              "Headers webhook-id, webhook-timestamp and webhook-signature; HMAC-SHA256 over id.timestamp.body, with an optional Ed25519 variant.",
            ],
            [
              "Stripe",
              "A Stripe-Signature header with a timestamp; libraries reject anything older than 5 minutes; verify against the raw body. Retries for up to 3 days.",
            ],
            [
              "GitHub",
              "X-Hub-Signature-256 (sha256=…). Expects a reply within 10 seconds, and doesn't retry failed deliveries automatically.",
            ],
            ["Compare safely", "Use a constant-time comparison when checking signatures."],
          ].map(([t, b], i) => (
            <motion.div
              key={t}
              initial={{ opacity: 0, x: -4 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.05 * i }}
              className="border-line bg-surface rounded-lg border px-3 py-2 text-xs"
            >
              <span className="font-semibold">{t}</span>
              <span className="text-muted"> · {b}</span>
            </motion.div>
          ))}
        </div>
      }
    >
      <p>
        Anyone can send an HTTP request to your webhook URL. A signature, made with a secret only
        you and the sender know, proves who sent it; a timestamp stops old messages being replayed.
      </p>
      <p>
        Don&apos;t rely on delivery order either: providers like Stripe don&apos;t guarantee it.
      </p>
    </StepLayout>
  );
}

/* 4 ─ Outbox and events ---------------------------------------------------------------------------- */

export function Outbox() {
  return (
    <StepLayout
      eyebrow="Explore"
      title="The outbox, and a common event shape"
      stage={
        <div className="flex flex-1 flex-col justify-center gap-3">
          <pre className="border-line bg-surface overflow-x-auto rounded-lg border p-3 font-mono text-[10.5px]">
            {
              "BEGIN;\n  INSERT INTO orders …;\n  INSERT INTO outbox (type, payload) VALUES ('order.paid', …);\nCOMMIT;\n-- a relay reads new outbox rows and publishes them"
            }
          </pre>
          <pre className="border-line bg-surface overflow-x-auto rounded-lg border p-3 font-mono text-[10.5px]">
            {
              '{ "specversion": "1.0", "id": "evt_8f2", "source": "/chaicorner/orders",\n  "type": "order.paid", "time": "2026-10-12T09:15:00Z", "data": { … } }'
            }
          </pre>
        </div>
      }
    >
      <p>
        The <Term id="transactional-outbox">transactional outbox</Term> records the event in the
        same transaction as the change, so you never save an order but forget to announce it. The
        relay may publish an event twice, so receivers must handle duplicates.
      </p>
      <p>
        CloudEvents, a graduated CNCF project since January 2024, is a common envelope for events,
        with required id, source, specversion and type fields.
      </p>
    </StepLayout>
  );
}

/* 5 ─ Checkpoint ----------------------------------------------------------------------------------- */

export function HookCheck() {
  return (
    <StepLayout
      eyebrow="Checkpoint"
      title="Handling an incoming webhook"
      stage={
        <div className="flex flex-1 flex-col justify-center">
          <OrderCheckpoint
            id="backend-webhooks"
            prompt="Put a receiver's steps in order, first to last."
            items={[
              { id: "raw", label: "Read the raw request body" },
              { id: "verify", label: "Verify the signature and the timestamp" },
              { id: "seen", label: "Check this webhook ID hasn't been processed" },
              { id: "queue", label: "Store the event or queue the work" },
              { id: "ok", label: "Reply 2xx" },
            ]}
            explanation="Verify before trusting anything, skip duplicates, hand the work off, and reply quickly so the sender doesn't retry."
          />
        </div>
      }
    >
      <p>Drag into order.</p>
    </StepLayout>
  );
}

/* 6 ─ Wrap ----------------------------------------------------------------------------------------- */

export function Wrap() {
  return (
    <WrapStep
      points={[
        ["Record, then send", "The transactional outbox."],
        ["Sign and timestamp", "Receivers verify both."],
        ["Retry with backoff", "Not every provider does it for you."],
        ["Expect duplicates", "Dedupe by event ID."],
        ["Reply fast", "Queue the real work."],
      ]}
    >
      <p>Next: pushing updates to users the moment they happen.</p>
    </WrapStep>
  );
}
