"use client";

import { AnimatePresence, motion } from "motion/react";
import { Check, CheckCheck } from "lucide-react";
import { useSceneState } from "@/lib/module-sdk";
import { StepLayout } from "@/toolkit/layout/step-layout";
import { Segmented } from "@/toolkit/controls/segmented";
import { ChoiceCheckpoint } from "@/toolkit/checkpoints/choice";
import { FrameCaption, Stepper } from "@/toolkit/controls/stepper";
import { Term } from "@/toolkit/glossary/term";
import { cn } from "@/lib/cn";
import { ARRIVALS, WINDOW, simulate, type Transport } from "./transport";
import { chatFrames, type Edge, type Node } from "./frames";
import type { ChatState } from "./state";

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

/* 1 ─ Are we there yet? ⭐ -------------------------------------------------------------------------- */

const TRANSPORTS: Record<Transport, { label: string; text: string }> = {
  poll: {
    label: "Polling",
    text: "The phone asks 'anything new?' every 5 seconds. Simple, but most answers are 'no', and a message waits up to 5 s.",
  },
  long: {
    label: "Long polling",
    text: "The phone asks, and the server holds the request open until there's news (or 25 s pass), then the phone asks again. Near-instant, with fewer wasted requests.",
  },
  sse: {
    label: "Server-sent events",
    text: "One long-lived HTTP response that the server keeps writing events into. Instant, but one-way: the phone sends messages with ordinary requests.",
  },
  ws: {
    label: "WebSocket",
    text: "One connection that stays open, carrying messages both ways, instantly. The usual choice for chat.",
  },
};

export function Transports() {
  const [s, set] = useSceneState<ChatState>();
  const r = simulate(s.transport);
  const W = 360;
  const x = (t: number) => 10 + (t / WINDOW) * (W - 20);
  return (
    <StepLayout
      eyebrow="The big idea"
      title="Are we there yet?"
      stage={
        <div className="flex flex-1 flex-col gap-3">
          <Segmented
            size="sm"
            value={s.transport}
            options={(Object.keys(TRANSPORTS) as Transport[]).map(
              (k) => [k, TRANSPORTS[k].label] as [string, string],
            )}
            onChange={(v) => set({ transport: v as Transport })}
          />
          <div className="border-line bg-surface rounded-xl border p-3">
            <svg
              viewBox={`0 0 ${W} 110`}
              className="mx-auto w-full max-w-xl"
              role="img"
              aria-label="Requests and message deliveries over one minute"
            >
              <text x={10} y={12} className="fill-muted text-[8px]">
                messages sent to you
              </text>
              {ARRIVALS.map((a) => (
                <circle key={a} cx={x(a)} cy={22} r={3} fill="var(--viz-data)" />
              ))}
              <text x={10} y={44} className="fill-muted text-[8px]">
                {r.requestCount === 1
                  ? "one open connection"
                  : `${r.requestCount} requests from the phone`}
              </text>
              {r.requests.map((q, i) => (
                <motion.rect
                  key={`${s.transport}${i}`}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: i * 0.04 }}
                  x={x(q.at)}
                  y={50 + (r.requestCount > 1 ? (i % 2) * 7 : 0)}
                  width={Math.max(2, x(q.end) - x(q.at))}
                  height={5}
                  rx={2}
                  fill="var(--viz-compute)"
                  opacity={0.8}
                />
              ))}
              <text x={10} y={80} className="fill-muted text-[8px]">
                when your phone shows them
              </text>
              {r.delivered.map((d) => (
                <g key={d.sent}>
                  <line
                    x1={x(d.sent)}
                    y1={25}
                    x2={x(d.got)}
                    y2={88}
                    stroke="var(--line-strong)"
                    strokeDasharray="2 2"
                  />
                  <circle
                    cx={x(d.got)}
                    cy={90}
                    r={3}
                    fill={d.got - d.sent > 1 ? "var(--bad)" : "var(--good)"}
                  />
                </g>
              ))}
              {[0, 15, 30, 45, 60].map((t) => (
                <text
                  key={t}
                  x={x(t)}
                  y={107}
                  textAnchor={t === 60 ? "end" : t === 0 ? "start" : "middle"}
                  className="fill-subtle text-[7px]"
                >
                  {t}s
                </text>
              ))}
            </svg>
          </div>
          <div className="grid grid-cols-3 gap-2">
            <Stat
              label="Requests per minute"
              value={String(r.requestCount)}
              bad={r.requestCount > 6}
            />
            <Stat
              label="Average delay"
              value={r.avgDelay < 0.1 ? "instant" : `${r.avgDelay.toFixed(1)} s`}
              bad={r.avgDelay > 1}
            />
            <Stat
              label="Phone can send on it"
              value={r.twoWay ? "yes" : s.transport === "sse" ? "no" : "no, new request"}
            />
          </div>
          <AnimatePresence mode="wait">
            <motion.p
              key={s.transport}
              initial={{ opacity: 0, y: 4 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="border-line bg-surface rounded-xl border px-4 py-3 text-sm"
            >
              {TRANSPORTS[s.transport].text}
            </motion.p>
          </AnimatePresence>
        </div>
      }
    >
      <p>
        Children in the back seat ask &ldquo;are we there yet?&rdquo; every few minutes. Better:
        &ldquo;wake me when we arrive.&rdquo;
      </p>
      <p>
        Web browsers and apps started with the first approach, because HTTP is ask-and-answer.
        Compare four ways a phone can learn about new messages over one minute, from polling and{" "}
        <Term id="long-polling">long polling</Term> to the usual winner for chat, the{" "}
        <Term id="websocket">WebSocket</Term>.
      </p>
      <p className="text-muted text-sm">
        The cost of &ldquo;instant&rdquo;: every online user now holds an open connection, and your
        servers must keep millions of them.
      </p>
    </StepLayout>
  );
}

/* 2 ─ One message, end to end ⭐ -------------------------------------------------------------------- */

const NODES: Record<Node, { x: number; y: number; label: string }> = {
  priya: { x: 32, y: 60, label: "Priya" },
  g1: { x: 100, y: 60, label: "Gateway G1" },
  chat: { x: 180, y: 60, label: "Chat service" },
  db: { x: 180, y: 128, label: "Messages DB" },
  registry: { x: 180, y: 12, label: "Session registry" },
  g7: { x: 260, y: 60, label: "Gateway G7" },
  arjun: { x: 330, y: 60, label: "Arjun" },
  push: { x: 280, y: 128, label: "Push service" },
};
const LINKS: [Node, Node][] = [
  ["priya", "g1"],
  ["g1", "chat"],
  ["chat", "db"],
  ["chat", "registry"],
  ["chat", "g7"],
  ["g7", "arjun"],
  ["chat", "push"],
];

export function Journey() {
  const [s, set] = useSceneState<ChatState>();
  const fs = chatFrames(s.scenario);
  const step = Math.min(s.frame, fs.length - 1);
  const f = fs[step];
  const on = (a: Node, b: Node) =>
    f.active.includes(`${a}-${b}` as Edge) || f.active.includes(`${b}-${a}` as Edge);
  return (
    <StepLayout
      eyebrow="Step through"
      title="One message, end to end"
      stage={
        <div className="flex flex-1 flex-col gap-3">
          <Segmented
            size="sm"
            value={s.scenario}
            options={[
              ["online", "Both online"],
              ["offline", "Arjun offline"],
              ["drop", "Priya's signal drops"],
            ]}
            onChange={(v) => set({ scenario: v as ChatState["scenario"], frame: 0 })}
          />
          <div className="border-line bg-surface rounded-xl border p-3">
            <svg
              viewBox="0 0 360 150"
              className="mx-auto w-full max-w-xl"
              role="img"
              aria-label="Path of a chat message"
            >
              {LINKS.map(([a, b]) => (
                <motion.line
                  key={`${a}${b}`}
                  x1={NODES[a].x}
                  y1={NODES[a].y}
                  x2={NODES[b].x}
                  y2={NODES[b].y}
                  animate={{
                    stroke: on(a, b) ? "var(--accent)" : "var(--line-strong)",
                    strokeWidth: on(a, b) ? 2.5 : 1,
                  }}
                  strokeDasharray={b === "push" ? "3 3" : undefined}
                />
              ))}
              {(Object.keys(NODES) as Node[]).map((k) => {
                const n = NODES[k];
                const off = k === "arjun" && !f.arjunOnline;
                const phone = k === "priya" || k === "arjun";
                return (
                  <g key={k} opacity={off ? 0.35 : 1}>
                    <rect
                      x={n.x - (phone ? 24 : 32)}
                      y={n.y - 11}
                      width={phone ? 48 : 64}
                      height={22}
                      rx={phone ? 8 : 5}
                      fill={phone ? "var(--accent-soft)" : "var(--surface)"}
                      stroke={
                        phone
                          ? "var(--accent)"
                          : k === "db"
                            ? "var(--viz-data)"
                            : "var(--line-strong)"
                      }
                    />
                    <text x={n.x} y={n.y + 3.5} textAnchor="middle" className="fill-fg text-[8px]">
                      {n.label}
                      {off ? " (off)" : ""}
                    </text>
                  </g>
                );
              })}
            </svg>
            <div className="mt-1 flex items-center justify-center gap-2 text-xs">
              <span className="text-muted">Priya sees:</span>
              <span className="border-line inline-flex items-center gap-1 rounded-full border px-2 py-0.5">
                Coffee at 6?
                {f.ticks === 0 ? (
                  <span className="text-subtle">🕓</span>
                ) : f.ticks === 1 ? (
                  <Check className="text-muted size-3.5" />
                ) : (
                  <CheckCheck
                    className={cn("size-3.5", f.ticks === 3 ? "text-accent" : "text-muted")}
                  />
                )}
              </span>
            </div>
          </div>
          <Stepper step={step} count={fs.length} onChange={(n) => set({ frame: n })} />
          <FrameCaption frameKey={`${s.scenario}${step}`} title={f.title} tone={f.tone}>
            {f.text}
          </FrameCaption>
        </div>
      }
    >
      <p>
        Follow &ldquo;Coffee at 6?&rdquo; from Priya&apos;s phone to Arjun&apos;s, and watch the
        ticks change. Then try the two things that happen all the time on mobile: the recipient is
        offline, or the sender loses signal.
      </p>
      <p className="text-muted text-sm">
        Two ideas carry the design: messages are stored before they&apos;re acknowledged, and every
        message has an ID, so retries and catch-ups are safe.
      </p>
    </StepLayout>
  );
}

/* 3 ─ Checkpoint: ordering ------------------------------------------------------------------------ */

export function Ordering() {
  return (
    <StepLayout
      eyebrow="Checkpoint"
      title="Who spoke first?"
      stage={
        <div className="flex flex-1 flex-col justify-center">
          <ChoiceCheckpoint
            id="chat-order"
            prompt="In a group chat, Meera and Kabir send messages 5 milliseconds apart from different phones. How do you make sure everyone sees them in the same order?"
            options={[
              {
                id: "seq",
                label:
                  "The server gives each message the next sequence number for that conversation, and every phone sorts by it",
                correct: true,
                feedback:
                  "Right. One authority per conversation decides the order; phones just follow the numbers, and gaps reveal missing messages.",
              },
              {
                id: "clock",
                label: "Sort by each phone's timestamp",
                feedback:
                  "Phone clocks drift and can be set to anything; two phones can disagree by seconds.",
              },
              {
                id: "arrival",
                label: "Each phone shows them in the order they arrive",
                feedback:
                  "Different phones can receive them in different orders, so the chat would read differently for each person.",
              },
              {
                id: "alpha",
                label: "Sort by sender name when times are close",
                feedback: "Consistent, but it can put a reply before the question it answers.",
              },
            ]}
            explanation="Order per conversation, not globally: one server (or one partition) owns each conversation's sequence. That's also how chat systems shard, by conversation ID."
          />
        </div>
      }
    >
      <p>
        Leslie Lamport&apos;s classic 1978 paper showed why clocks on different machines can&apos;t
        be trusted to order events. Chat apps sidestep the problem.
      </p>
    </StepLayout>
  );
}

/* 4 ─ A million open connections ------------------------------------------------------------------ */

const USERS = [1e6, 1e7, 5e7];
const PER_SERVER = [100_000, 500_000, 1_000_000];

export function Connections() {
  const [s, set] = useSceneState<ChatState>();
  const users = USERS[s.users];
  const per = PER_SERVER[s.perServer];
  const servers = Math.ceil((users * 1.3) / per); // 30% headroom
  const restartBurst = per; // phones reconnecting when one gateway restarts
  const peakPerSec = s.jitter ? Math.round(per / 30) : per;
  const human = (n: number) => (n >= 1e6 ? `${n / 1e6} million` : `${n / 1e3} thousand`);
  return (
    <StepLayout
      eyebrow="Explore"
      title="Millions of open connections"
      stage={
        <div className="flex flex-1 flex-col gap-3">
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-muted w-40 text-xs">Users online at peak</span>
            <Segmented
              size="sm"
              value={String(s.users)}
              options={USERS.map((u, i) => [String(i), human(u)] as [string, string])}
              onChange={(v) => set({ users: Number(v) })}
            />
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-muted w-40 text-xs">Connections per gateway</span>
            <Segmented
              size="sm"
              value={String(s.perServer)}
              options={PER_SERVER.map((u, i) => [String(i), human(u)] as [string, string])}
              onChange={(v) => set({ perServer: Number(v) })}
            />
          </div>
          <label className="flex items-center gap-2 text-sm">
            <input
              type="checkbox"
              checked={s.jitter}
              onChange={(e) => set({ jitter: e.target.checked })}
              className="accent-[var(--accent)]"
            />
            Phones wait a random 0–30 s before reconnecting
          </label>
          <div className="grid grid-cols-3 gap-2">
            <Stat label="Gateway servers (+30% spare)" value={String(servers)} />
            <Stat label="Phones cut off when one restarts" value={human(restartBurst)} />
            <Stat
              label="Reconnects in the first second"
              value={peakPerSec.toLocaleString("en-IN")}
              bad={!s.jitter}
            />
          </div>
          <div className="border-line bg-surface rounded-xl border p-3">
            <div className="flex flex-wrap gap-0.5">
              {Array.from({ length: Math.min(servers, 200) }, (_, i) => (
                <motion.span
                  key={i}
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: i * 0.003 }}
                  className="bg-viz-compute/70 size-2.5 rounded-sm"
                />
              ))}
            </div>
            {servers > 200 && (
              <p className="text-muted mt-1 text-[10px]">(showing 200 of {servers})</p>
            )}
          </div>
          <p
            className={cn(
              "rounded-xl border px-4 py-3 text-sm",
              s.jitter ? "border-good/40 bg-good/10" : "border-bad/40 bg-bad/10",
            )}
          >
            {s.jitter
              ? "Spread over 30 seconds, the reconnects are a manageable trickle for the other gateways and the session registry."
              : "Deploying a new gateway version means restarting it. Without jitter, all its phones reconnect in the same second: a thundering herd that can knock over the servers they land on."}
          </p>
        </div>
      }
    >
      <p>
        Every online user holds an open connection, and the system tracks their{" "}
        <Term id="presence">presence</Term>. How many gateway servers do you need, and what happens
        when one restarts?
      </p>
      <p className="text-muted text-sm">
        For scale: in 2012 WhatsApp reported over 2 million connections on a single server, using
        Erlang on FreeBSD. Most teams plan for far fewer per server, and spread conversations over
        chat servers by consistent hashing, as Slack describes.
      </p>
    </StepLayout>
  );
}

/* 5 ─ Landscape ----------------------------------------------------------------------------------- */

const TOOLS: [string, string][] = [
  [
    "Protocols",
    "WebSocket (RFC 6455, 2011; also over HTTP/2 and HTTP/3), server-sent events (in the HTML standard), and WebTransport, now in all major browsers, though its protocol is still an IETF draft.",
  ],
  [
    "Managed services",
    "AWS API Gateway WebSocket APIs (connections last up to 2 hours, 10 minutes idle), AWS AppSync, Azure Web PubSub and SignalR Service, Firebase, Ably and Pusher.",
  ],
  [
    "WhatsApp",
    "Erlang servers; messages are deleted from servers once delivered, and undelivered ones are kept (encrypted) for up to 30 days.",
  ],
  [
    "Discord",
    "An Elixir real-time gateway; trillions of messages moved from Cassandra to ScyllaDB in 2022, with Snowflake-style message IDs.",
  ],
  [
    "Slack",
    "Gateway servers hold client connections; channel servers own channels, assigned by consistent hashing; messages reach clients worldwide in about 500 ms.",
  ],
];

export function Landscape() {
  return (
    <StepLayout
      eyebrow="The landscape"
      title="How others do it"
      stage={
        <div className="grid flex-1 content-center gap-2 sm:grid-cols-2">
          {TOOLS.map(([t, d], i) => (
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
      <p>
        Different stacks, the same shape: gateways for connections, a service that orders and
        stores, and a registry of who&apos;s where.
      </p>
    </StepLayout>
  );
}

/* 6 ─ Wrap ----------------------------------------------------------------------------------------- */

const TAKEAWAYS = [
  ["Keep a connection open", "WebSockets deliver instantly both ways; polling wastes requests."],
  ["Store, then acknowledge", "A tick means the message is safe, not just received."],
  ["Order per conversation", "Sequence numbers from the server, not phone clocks."],
  ["Plan for flaky phones", "Message IDs make retries safe; sync from the last number seen."],
  ["Mind the herd", "Jitter reconnects when a gateway restarts."],
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
      <p>
        Chat is many people, each in their own conversations. Next: many people all wanting the same
        thing at the same moment, in a flash sale.
      </p>
    </StepLayout>
  );
}
