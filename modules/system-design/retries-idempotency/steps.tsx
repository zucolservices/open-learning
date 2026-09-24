"use client";

import { useMemo } from "react";
import { AnimatePresence, motion } from "motion/react";
import { useSceneState } from "@/lib/module-sdk";
import { StepLayout } from "@/toolkit/layout/step-layout";
import { Segmented } from "@/toolkit/controls/segmented";
import { PredictCheckpoint } from "@/toolkit/checkpoints/predict";
import { SortCheckpoint } from "@/toolkit/checkpoints/sort";
import { Code } from "@/toolkit/controls/stepper";
import { Term } from "@/toolkit/glossary/term";
import { cn } from "@/lib/cn";
import { BUCKET, CAPACITY, HANG, SECONDS, TICK, storm } from "./sim";
import type { RetryState } from "./state";

/* 1 ─ Did it go through? ⭐ -------------------------------------------------------------------------- */

type Outcome = { text: string; ok: boolean };
const CASES: { title: string; what: string; outcomes: Record<RetryState["guarantee"], Outcome> }[] =
  [
    {
      title: "The request is lost",
      what: "It never reaches the server.",
      outcomes: {
        most: { text: "Never paid. The order is lost.", ok: false },
        least: { text: "The retry gets through. Paid once.", ok: true },
        effectively: { text: "The retry gets through. Paid once.", ok: true },
      },
    },
    {
      title: "The reply is lost",
      what: "The server charged the card, but the answer never arrives.",
      outcomes: {
        most: { text: "Paid once, but the customer is told it failed.", ok: false },
        least: { text: "The retry charges again. Paid twice!", ok: false },
        effectively: {
          text: "The server recognises the retry and replays its first answer. Paid once.",
          ok: true,
        },
      },
    },
    {
      title: "The server is slow",
      what: "The client gives up waiting just before the server finishes.",
      outcomes: {
        most: { text: "Paid once, but reported as failed.", ok: false },
        least: { text: "Both the original and the retry complete. Paid twice!", ok: false },
        effectively: {
          text: "The retry waits for, or replays, the first result. Paid once.",
          ok: true,
        },
      },
    },
  ];

export function GoThrough() {
  const [s, set] = useSceneState<RetryState>();
  return (
    <StepLayout
      eyebrow="The big idea"
      title="Did it go through?"
      stage={
        <div className="flex flex-1 flex-col gap-4">
          <Segmented
            size="sm"
            value={s.guarantee}
            options={[
              ["most", "Never retry"],
              ["least", "Retry"],
              ["effectively", "Retry + deduplicate"],
            ]}
            onChange={(v) => set({ guarantee: v as RetryState["guarantee"] })}
          />
          <p className="text-muted text-xs">
            {s.guarantee === "most"
              ? "At most once: never duplicated, but sometimes lost."
              : s.guarantee === "least"
                ? "At least once: never lost, but sometimes duplicated."
                : "Effectively once: at least once, plus the receiver ignores repeats."}
          </p>
          <div className="grid gap-2">
            {CASES.map((c) => {
              const o = c.outcomes[s.guarantee];
              return (
                <div
                  key={c.title}
                  className="border-line bg-surface grid gap-2 rounded-xl border p-3 sm:grid-cols-2"
                >
                  <div>
                    <p className="text-sm font-semibold">{c.title}</p>
                    <p className="text-muted text-xs">{c.what}</p>
                  </div>
                  <AnimatePresence mode="wait">
                    <motion.p
                      key={s.guarantee}
                      initial={{ opacity: 0, x: 6 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0 }}
                      className={cn(
                        "rounded-lg border px-3 py-2 text-xs",
                        o.ok ? "border-good/40 bg-good/10" : "border-bad/40 bg-bad/10",
                      )}
                    >
                      {o.text}
                    </motion.p>
                  </AnimatePresence>
                </div>
              );
            })}
          </div>
        </div>
      }
    >
      <p>
        You post a cheque to pay a bill and hear nothing back. Did it get lost, or did they just not
        reply? If you send another and the first arrived, you&apos;ve paid twice.
      </p>
      <p>
        A computer whose request times out is in the same spot. The three cases look identical from
        the client&apos;s side. Pick a strategy and see how each case ends.
      </p>
      <p className="text-muted text-sm">
        &ldquo;Exactly once&rdquo; delivery over a network isn&apos;t possible, but exactly-once{" "}
        <em>effects</em> are: retry, and make repeating the action{" "}
        <Term id="idempotent">idempotent</Term>. The cheque version: write the invoice number on it,
        so the biller can spot a duplicate.
      </p>
    </StepLayout>
  );
}

/* 2 ─ The retry storm ⭐ ------------------------------------------------------------------------------ */

function StormChart({
  offered,
  goodput,
  wasted,
}: {
  offered: number[];
  goodput: number[];
  wasted: number[];
}) {
  const W = 360;
  const H = 150;
  const max = 2600;
  const n = offered.length;
  const bw = (W - 38) / n;
  const x = (i: number) => 30 + i * bw;
  const y = (v: number) => H - 18 - (Math.min(v, max) / max) * (H - 28);
  const line = offered.map((v, i) => `${i === 0 ? "M" : "L"}${x(i) + bw / 2},${y(v)}`).join(" ");
  return (
    <svg
      viewBox={`0 0 ${W} ${H}`}
      className="mx-auto w-full max-w-xl"
      role="img"
      aria-label="Load and useful work over time"
    >
      <rect
        x={x((HANG[0] / (BUCKET * TICK)) | 0)}
        y={10}
        width={((HANG[1] - HANG[0]) / (BUCKET * TICK)) * bw}
        height={H - 28}
        fill="var(--bad)"
        opacity={0.12}
      />
      {goodput.map((g, i) => (
        <g key={i}>
          <rect
            x={x(i) + 0.3}
            y={y(g)}
            width={bw - 0.6}
            height={H - 18 - y(g)}
            fill="var(--good)"
            opacity={0.7}
          />
          <rect
            x={x(i) + 0.3}
            y={y(g + wasted[i])}
            width={bw - 0.6}
            height={y(g) - y(g + wasted[i])}
            fill="var(--bad)"
            opacity={0.55}
          />
        </g>
      ))}
      <line
        x1={30}
        x2={W - 8}
        y1={y(CAPACITY)}
        y2={y(CAPACITY)}
        stroke="var(--viz-compute)"
        strokeDasharray="4 3"
      />
      <path d={line} fill="none" stroke="var(--fg)" strokeWidth={1.2} />
      {[0, 1000, 2000].map((v) => (
        <text key={v} x={26} y={y(v) + 3} textAnchor="end" className="fill-subtle text-[7px]">
          {v}
        </text>
      ))}
      {[0, 15, 30, 45, SECONDS].map((sec) => (
        <text
          key={sec}
          x={x(sec / (BUCKET * TICK))}
          y={H - 4}
          textAnchor={sec === SECONDS ? "end" : "middle"}
          className="fill-subtle text-[8px]"
        >
          {sec}s
        </text>
      ))}
    </svg>
  );
}

export function RetryStorm() {
  const [s, set] = useSceneState<RetryState>();
  const r = useMemo(() => storm({ policy: s.policy, budget: s.budget }), [s.policy, s.budget]);
  const collapsed = r.recoveredAt === null;
  return (
    <StepLayout
      eyebrow="Simulation"
      title="The retry storm"
      stage={
        <div className="flex flex-1 flex-col gap-3">
          <Segmented
            size="sm"
            value={s.policy}
            options={[
              ["none", "No retries"],
              ["immediate", "Retry at once"],
              ["backoff", "Backoff"],
              ["jitter", "Backoff + jitter"],
            ]}
            onChange={(v) => set({ policy: v as RetryState["policy"] })}
          />
          <label
            className={cn("flex items-center gap-2 text-sm", s.policy === "none" && "opacity-40")}
          >
            <input
              type="checkbox"
              checked={s.budget}
              disabled={s.policy === "none"}
              onChange={(e) => set({ budget: e.target.checked })}
              className="accent-[var(--accent)]"
            />
            Retry budget (retries at most about 10% of requests)
          </label>
          <div className="border-line bg-surface rounded-xl border p-3">
            <StormChart offered={r.offered} goodput={r.goodput} wasted={r.wasted} />
            <div className="text-muted mt-1 flex flex-wrap justify-center gap-3 text-[10px]">
              <span className="flex items-center gap-1">
                <span className="bg-fg h-px w-4" /> requests/s sent (incl. retries)
              </span>
              <span className="flex items-center gap-1">
                <span className="bg-good/70 size-2.5" /> useful answers
              </span>
              <span className="flex items-center gap-1">
                <span className="bg-bad/55 size-2.5" /> work nobody waited for
              </span>
              <span className="flex items-center gap-1">
                <span className="border-viz-compute w-4 border-t border-dashed" /> capacity
              </span>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
            <Stat
              label="Success, normal times"
              value={`${(r.calmSuccess * 100).toFixed(1)}%`}
              bad={r.calmSuccess < 0.99}
            />
            <Stat
              label="Success after the stall"
              value={`${Math.round(r.successRate * 100)}%`}
              bad={r.successRate < 0.4}
            />
            <Stat
              label="Recovered at"
              value={collapsed ? "never" : `${r.recoveredAt}s`}
              bad={collapsed}
            />
            <Stat label="Peak load" value={`${r.peakLoad.toFixed(1)}×`} bad={r.peakLoad > 2} />
          </div>
          <AnimatePresence mode="wait">
            <motion.p
              key={`${s.policy}${s.budget}`}
              initial={{ opacity: 0, y: 4 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className={cn(
                "rounded-xl border px-4 py-3 text-sm",
                collapsed || s.policy === "none"
                  ? "border-bad/40 bg-bad/10"
                  : "border-good/40 bg-good/10",
              )}
            >
              {s.policy === "none"
                ? "The system recovers from the stall, but 3% of actions fail every day from small glitches that one retry would have fixed."
                : collapsed
                  ? s.policy === "immediate"
                    ? "Every failure becomes up to three requests. Load triples, the server's queue fills with requests whose clients have given up, and it never catches up, even though the stall ended at 14 s."
                    : "Backoff delays each retry, but new users keep arriving, so every failure is still retried: load still triples and the collapse persists. Backoff and jitter spread retries out; they don't reduce them."
                  : "The budget lets retries fix everyday glitches, but when most requests are failing, it runs dry and stops retries from multiplying the load. The system recovers."}
            </motion.p>
          </AnimatePresence>
          <details className="text-muted text-xs">
            <summary className="cursor-pointer">How this simulation works</summary>
            <p className="mt-2">
              New user actions arrive at 800 a second. The server handles {CAPACITY} a second from a
              first-in, first-out queue; 3% of answers are transient errors. Clients time out after
              1 s and try up to 3 times. The server stalls from {HANG[0]} s to {HANG[1]} s. The
              budget is a token bucket: each new request earns 0.1 token, each retry spends 1.
            </p>
          </details>
        </div>
      }
    >
      <p>
        Retries rescue you from small glitches. But when a service is struggling, every client
        retrying at once multiplies its load, a <Term id="retry-storm">retry storm</Term>, and can
        keep it down long after the original problem is gone.
      </p>
      <p>Try each policy, then add a retry budget.</p>
      <p className="text-muted text-sm">
        A system stuck in a bad state after its trigger is gone is called a{" "}
        <em>metastable failure</em>. Retries are the classic cause.
      </p>
    </StepLayout>
  );
}

function Stat({ label, value, bad }: { label: string; value: string; bad?: boolean }) {
  return (
    <div
      className={cn(
        "rounded-xl border px-3 py-2",
        bad ? "border-bad/40 bg-bad/5" : "border-line bg-surface",
      )}
    >
      <p className="text-muted text-[10px]">{label}</p>
      <motion.p
        key={value}
        initial={{ opacity: 0.4 }}
        animate={{ opacity: 1 }}
        className="font-mono text-sm"
      >
        {value}
      </motion.p>
    </div>
  );
}

/* 3 ─ Spread them out -------------------------------------------------------------------------- */

const N_CLIENTS = 40;
const BINS = 40; // 0.1 s over 4 s
const SLOT = 6; // server handles 6 per 0.1 s

function spreadHist(kind: RetryState["spread"]) {
  let a = 7;
  const rnd = () => {
    a = (a * 1103515245 + 12345) & 0x7fffffff;
    return a / 0x7fffffff;
  };
  const hist = Array(BINS).fill(0);
  for (let c = 0; c < N_CLIENTS; c++) {
    let t = 0;
    for (let k = 0; k < 3; k++) {
      const v = 0.5 * 2 ** k;
      const d = kind === "fixed" ? 1 : kind === "exp" ? v : rnd() * v;
      t += d;
      const bin = Math.min(BINS - 1, Math.floor(t / 0.1));
      hist[bin] += 1;
    }
  }
  return hist;
}

export function Spread() {
  const [s, set] = useSceneState<RetryState>();
  const hist = useMemo(() => spreadHist(s.spread), [s.spread]);
  const peak = Math.max(...hist);
  const over = hist.reduce((a, h) => a + Math.max(0, h - SLOT), 0);
  return (
    <StepLayout
      eyebrow="Explore"
      title="Spread them out"
      stage={
        <div className="flex flex-1 flex-col gap-4">
          <Segmented
            size="sm"
            value={s.spread}
            options={[
              ["fixed", "Every 1 s"],
              ["exp", "Exponential"],
              ["jitter", "Exponential + full jitter"],
            ]}
            onChange={(v) => set({ spread: v as RetryState["spread"] })}
          />
          <div className="border-line bg-surface rounded-xl border p-3">
            <div className="relative flex h-40 items-end gap-px">
              <div
                className="border-viz-compute pointer-events-none absolute inset-x-0 border-t border-dashed"
                style={{ bottom: `${(SLOT / N_CLIENTS) * 100}%` }}
              />
              {hist.map((h, i) => (
                <motion.div
                  key={i}
                  animate={{ height: `${(h / N_CLIENTS) * 100}%` }}
                  className={cn("flex-1 rounded-t-sm", h > SLOT ? "bg-bad/70" : "bg-viz-data/70")}
                />
              ))}
            </div>
            <div className="text-subtle mt-1 flex justify-between text-[9px]">
              <span>0 s</span>
              <span>1 s</span>
              <span>2 s</span>
              <span>3 s</span>
              <span>4 s</span>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-2">
            <Stat label="Most retries in one 0.1 s" value={String(peak)} bad={peak > SLOT} />
            <Stat label="Retries over capacity" value={String(over)} bad={over > 0} />
          </div>
          <Code>
            {s.spread === "fixed"
              ? "sleep(1s)"
              : s.spread === "exp"
                ? "sleep(base * 2^attempt)          // 0.5 s, 1 s, 2 s"
                : "sleep(random(0, base * 2^attempt))  // full jitter"}
          </Code>
        </div>
      }
    >
      <p>
        {N_CLIENTS} clients all fail at the same instant (say, a server restarted and dropped their
        connections). Each retries three times. The dashed line is what the server can take per
        tenth of a second.
      </p>
      <p>
        <Term id="exponential-backoff">Exponential backoff</Term> waits longer after each failure,
        but if everyone uses the same waits they still arrive together. Adding{" "}
        <Term id="jitter">jitter</Term> (a random wait) breaks up the crowd.
      </p>
      <p className="text-muted text-sm">
        AWS&apos;s analysis found &ldquo;full jitter&rdquo;, a random wait between zero and the
        backoff, does far less total work than no jitter. Cloud SDKs add jitter to their backoff for
        this reason.
      </p>
    </StepLayout>
  );
}

/* 4 ─ Predict: layers --------------------------------------------------------------------------- */

export function PredictLayers() {
  return (
    <StepLayout
      eyebrow="Predict"
      title="Retries at every layer"
      stage={
        <div className="flex flex-1 flex-col justify-center">
          <PredictCheckpoint
            id="layers"
            prompt="A request passes through 5 layers of services before reaching the database. Each layer tries up to 3 times. If the database is down, how many attempts can hit it for one user click?"
            min={1}
            max={300}
            step={1}
            unit=" attempts"
            answer={243}
            tolerance={5}
            explanation="3 × 3 × 3 × 3 × 3 = 3⁵ = 243. Each layer's 3 tries each cause 3 tries below. AWS's guidance is to retry at one layer only, usually the one closest to the user, and fail fast everywhere else."
          />
        </div>
      }
    >
      <p>Retries multiply when every layer adds its own.</p>
    </StepLayout>
  );
}

/* 5 ─ Fix the double charge ⭐ --------------------------------------------------------------------- */

const KEY = "5f2c-…-9e1a";

export function DoubleCharge() {
  const [s, set] = useSceneState<RetryState>();
  const n = s.payAttempts;
  const charges = s.useKey ? Math.min(n, 1) : n;
  const status =
    n === 0
      ? "Ready to pay"
      : n === 1
        ? "No answer after 10 s. Did it work?"
        : charges > 1
          ? `Retry succeeded. The card has now been charged ${charges} times.`
          : "Retry succeeded: the server replayed its first answer.";
  return (
    <StepLayout
      eyebrow="Fix the problem"
      title="Charged twice"
      stage={
        <div className="flex flex-1 flex-col gap-3">
          <label className="flex items-center gap-2 text-sm">
            <input
              type="checkbox"
              checked={s.useKey}
              onChange={(e) => set({ useKey: e.target.checked, payAttempts: 0 })}
              className="accent-[var(--accent)]"
            />
            Send an idempotency key with each payment
          </label>
          <div className="grid gap-3 sm:grid-cols-2">
            <div className="border-line bg-surface flex flex-col gap-2 rounded-xl border p-3">
              <p className="text-muted text-[10px] tracking-wide uppercase">Checkout app</p>
              <p className="text-sm">Coffee grinder · ₹1,499</p>
              <p className={cn("text-xs", charges > 1 ? "text-bad" : "text-muted")}>{status}</p>
              <button
                type="button"
                onClick={() => set({ payAttempts: n + 1 })}
                className="bg-accent text-accent-fg mt-auto rounded-full px-3 py-1.5 text-xs font-medium"
              >
                {n === 0 ? "Pay ₹1,499" : "Retry payment"}
              </button>
              {n > 0 && (
                <button
                  type="button"
                  onClick={() => set({ payAttempts: 0 })}
                  className="text-muted text-[10px] underline"
                >
                  start over
                </button>
              )}
            </div>
            <div className="border-line bg-surface flex flex-col gap-2 rounded-xl border p-3">
              <p className="text-muted text-[10px] tracking-wide uppercase">Payment server</p>
              <div className="space-y-1">
                <AnimatePresence initial={false}>
                  {Array.from({ length: n }, (_, i) => (
                    <motion.div
                      key={i}
                      initial={{ opacity: 0, x: -6 }}
                      animate={{ opacity: 1, x: 0 }}
                      className={cn(
                        "rounded-md border px-2 py-1 font-mono text-[10px]",
                        s.useKey && i > 0
                          ? "border-line text-muted"
                          : i > 0
                            ? "border-bad/50 bg-bad/10"
                            : "border-good/40 bg-good/10",
                      )}
                    >
                      {s.useKey && i > 0
                        ? `request ${i + 1}: key seen → replay saved answer`
                        : `request ${i + 1}: charge ₹1,499${i === 0 ? " (reply lost)" : ""}`}
                    </motion.div>
                  ))}
                </AnimatePresence>
                {n === 0 && <p className="text-subtle text-[10px]">No requests yet.</p>}
              </div>
              {s.useKey && n > 0 && (
                <div className="border-line mt-1 rounded-md border px-2 py-1">
                  <p className="text-muted text-[9px]">Idempotency keys</p>
                  <p className="font-mono text-[10px]">{KEY} → 200 OK, charge ch_1</p>
                </div>
              )}
            </div>
          </div>
          <Code>
            {s.useKey
              ? `POST /payments\nIdempotency-Key: ${KEY}   // made once per checkout, reused on retry\n\n-- server, in one transaction:\n-- if key exists → return the saved response\n-- else charge, save (key → response)`
              : 'POST /payments\n{ amount: 1499, currency: "INR" }'}
          </Code>
        </div>
      }
    >
      <p>
        Press <em>Pay</em>. The payment goes through, but the reply is lost on the way back. Then
        retry, as any sensible app would.
      </p>
      <p>
        Now fix it: turn on the <Term id="idempotency-key">idempotency key</Term>. The app makes a
        unique key once per checkout and sends the same key with every retry. The server remembers
        what it answered for each key.
      </p>
      <p className="text-muted text-sm">
        This is how Stripe&apos;s API works: it saves the first result for a key (even an error) and
        returns it for repeats, for at least 24 hours. Reusing a key with different details is
        rejected.
      </p>
    </StepLayout>
  );
}

/* 6 ─ Checkpoint: naturally idempotent? ------------------------------------------------------------ */

export function SafeToRepeat() {
  return (
    <StepLayout
      eyebrow="Checkpoint"
      title="Safe to repeat?"
      stage={
        <div className="flex flex-1 flex-col justify-center">
          <SortCheckpoint
            id="safe-to-repeat"
            prompt="If each of these ran twice by accident, would the result be the same as running it once?"
            categories={[
              { id: "safe", label: "Same result" },
              { id: "unsafe", label: "Needs a key" },
            ]}
            items={[
              {
                id: "status",
                label: "Set order 42's status to 'shipped'",
                category: "safe",
                why: "Setting a value to the same thing twice changes nothing.",
              },
              {
                id: "add",
                label: "Add ₹100 to a wallet",
                category: "unsafe",
                why: "Twice means ₹200. Record the transfer ID and skip repeats.",
              },
              {
                id: "delete",
                label: "DELETE /cart/items/7",
                category: "safe",
                why: "HTTP defines DELETE as idempotent: once gone, it stays gone.",
              },
              {
                id: "post",
                label: "POST /orders (create an order)",
                category: "unsafe",
                why: "Each POST creates a new order. This is where idempotency keys earn their keep.",
              },
              {
                id: "put",
                label: "PUT /users/7/email with a new address",
                category: "safe",
                why: "PUT replaces the value, so repeating it gives the same state.",
              },
              {
                id: "sms",
                label: "Send an OTP text message",
                category: "unsafe",
                why: "The customer gets two texts. Deduplicate by message ID before sending.",
              },
            ]}
          />
        </div>
      }
    >
      <p>
        Some operations are naturally idempotent; others need help. The HTTP standard (RFC 9110)
        defines GET, PUT and DELETE as idempotent, and POST as not.
      </p>
    </StepLayout>
  );
}

/* 7 ─ In the real world ---------------------------------------------------------------------------- */

const REAL: [string, string][] = [
  [
    "AWS SDKs",
    "Standard retry mode: up to 3 attempts, backoff with jitter, and a retry quota (a token bucket) per client. A revised retry behaviour becomes the default in November 2026.",
  ],
  [
    "gRPC",
    "Retry or hedging policies per method in service config; attempts capped at 5; retry throttling with a token bucket.",
  ],
  [
    "Envoy / service meshes",
    "Retry budgets: by default retries may be at most 20% of active requests.",
  ],
  [
    "Google SRE practice",
    "At most 3 attempts per request, and a per-client budget of retries under 10% of requests.",
  ],
  [
    "Stripe-style APIs",
    "An Idempotency-Key header on POST; the first response is saved and replayed.",
  ],
  [
    "Queues and logs",
    "Kafka's idempotent producer (the default in recent versions); SQS FIFO deduplication; Pub/Sub exactly-once delivery for pull subscriptions.",
  ],
];

export function RealWorld() {
  return (
    <StepLayout
      eyebrow="The landscape"
      title="Where you'll meet this"
      stage={
        <div className="grid flex-1 content-center gap-2 sm:grid-cols-2">
          {REAL.map(([t, d], i) => (
            <motion.div
              key={t}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.05 * i }}
              className="border-line bg-surface rounded-xl border px-3 py-2"
            >
              <p className="text-sm font-semibold">{t}</p>
              <p className="text-muted mt-0.5 text-xs">{d}</p>
            </motion.div>
          ))}
        </div>
      }
    >
      <p>You rarely write retry loops by hand. The libraries you use already have them.</p>
      <p className="text-muted text-sm">
        Know their defaults, and make sure only one layer is retrying.
      </p>
    </StepLayout>
  );
}

/* 8 ─ Wrap ----------------------------------------------------------------------------------------- */

const TAKEAWAYS = [
  ["Timeouts are ambiguous", "Lost request, lost reply and slow server look the same."],
  ["Retries need a budget", "Unlimited retries turn a short stall into a lasting outage."],
  ["Back off, with jitter", "Wait longer each time, randomly, so clients don't retry in waves."],
  ["Retry at one layer", "Retries multiply through every layer that adds them."],
  ["Make repeats harmless", "Idempotency keys turn at-least-once into effectively-once."],
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
      <p>Retries and idempotency go together: never one without the other.</p>
      <p>
        Next: event-driven architecture, where services react to events instead of calling each
        other.
      </p>
    </StepLayout>
  );
}
