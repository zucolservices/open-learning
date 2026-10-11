"use client";

import { motion } from "motion/react";
import { useSceneState } from "@/lib/module-sdk";
import { StepLayout } from "@/toolkit/layout/step-layout";
import { WrapStep } from "@/toolkit/layout/wrap-step";
import { SortCheckpoint } from "@/toolkit/checkpoints/sort";
import { Segmented } from "@/toolkit/controls/segmented";
import { Term } from "@/toolkit/glossary/term";
import { cn } from "@/lib/cn";
import { METHODS, type Method } from "./model";
import type { LiveState } from "./state";

/* 1 ─ Story ---------------------------------------------------------------------------------------- */

export function Pizza() {
  return (
    <StepLayout
      eyebrow="Story"
      title="“Is my pizza ready yet?”"
      stage={
        <div className="flex flex-1 flex-col justify-center gap-2">
          {[
            ["Ask every five minutes", "Polling: lots of calls, and you still hear late."],
            ["Stay on the line until it's ready", "Long polling: one call that waits."],
            ["They text you when it's ready", "Server push: one connection, instant news."],
            ["An open line both ways", "A conversation: you can add a drink while you wait."],
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
        You could ring the pizza shop every five minutes, hold the line, or wait for a text. Each
        works; they differ in effort and how quickly you hear.
      </p>
      <p>
        Plain HTTP is ask-and-answer. When users need news the moment it happens, the server can
        push it over a long-lived connection: <Term id="sse">server-sent events</Term> or{" "}
        <Term id="websocket">WebSockets</Term>.
      </p>
    </StepLayout>
  );
}

/* 2 ─ Simulation ⭐ -------------------------------------------------------------------------------- */

export function Compare() {
  const [s, set] = useSceneState<LiveState>();
  const m = METHODS.find((x) => x.id === s.method)!;
  const missed = m.push && s.multi && !s.pubsub;
  const rows: [string, string, boolean][] = [
    ["Requests to the server per minute", m.reqPerMin, m.id !== "poll"],
    ["Delay before a customer sees a change", m.delay, m.id !== "poll"],
    ["Connections held open", m.open, true],
    ["Direction", m.direction, true],
  ];
  return (
    <StepLayout
      eyebrow="Simulation"
      title="Live order status for 10,000 customers"
      stage={
        <div className="flex flex-1 flex-col justify-center gap-3">
          <Segmented<Method>
            size="sm"
            value={s.method}
            onChange={(method) => set({ method })}
            options={METHODS.map((x) => [x.id, x.label])}
          />
          <div className="grid gap-1">
            {rows.map(([l, v, ok]) => (
              <div
                key={l}
                className={cn(
                  "flex items-center justify-between gap-2 rounded-lg border px-3 py-1.5 text-xs",
                  ok ? "border-line bg-surface" : "border-bad/40 bg-bad/10",
                )}
              >
                <span className="text-muted">{l}</span>
                <span className="text-right font-medium">{v}</span>
              </div>
            ))}
          </div>
          <label className="flex items-center gap-2 text-xs">
            <input type="checkbox" checked={s.multi} onChange={() => set({ multi: !s.multi })} />
            Run three server instances behind a load balancer
          </label>
          <label className={cn("flex items-center gap-2 text-xs", !s.multi && "opacity-40")}>
            <input
              type="checkbox"
              disabled={!s.multi}
              checked={s.pubsub}
              onChange={() => set({ pubsub: !s.pubsub })}
            />
            Share updates between instances with a pub/sub channel
          </label>
          {s.multi && (
            <motion.p
              key={`${missed}`}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className={cn("text-xs", missed ? "text-bad" : "text-good")}
            >
              {missed
                ? "The kitchen's update reaches only the instance that handled it; two-thirds of customers are connected elsewhere and never hear."
                : m.push
                  ? "Every instance hears every update and pushes it to its own connected customers."
                  : "Polling works with any instance, at the cost of all those requests."}
            </motion.p>
          )}
        </div>
      }
    >
      <p>
        A café chain shows live order status to 10,000 customers at once. Compare the four methods,
        then run several server instances and see what pushing needs to work.
      </p>
      <p>Numbers are illustrative; real figures depend on how often orders change.</p>
    </StepLayout>
  );
}

/* 3 ─ Protocols ------------------------------------------------------------------------------------ */

export function Protocols() {
  return (
    <StepLayout
      eyebrow="Explore"
      title="The protocols"
      stage={
        <div className="flex flex-1 flex-col justify-center gap-1.5">
          {[
            [
              "Server-sent events",
              "Plain HTTP with a text/event-stream response. The browser reconnects automatically and sends Last-Event-ID to resume. Works everywhere since 2020.",
            ],
            [
              "The six-connection limit",
              "On HTTP/1.1 a browser allows about six open connections per site; HTTP/2 negotiates many more streams (often 100).",
            ],
            [
              "WebSockets",
              "RFC 6455 (2011): upgrade an HTTP connection to a two-way channel. Also over HTTP/2 (RFC 8441) and HTTP/3 (RFC 9220).",
            ],
            [
              "WebTransport",
              "Many streams plus fast, unreliable messages over HTTP/3. In all major browsers since March 2026; the protocol is still an IETF draft.",
            ],
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
        Server-sent events are the simplest push: one-way, plain HTTP, automatic reconnection. They
        also power the streaming replies in many AI chat apps.
      </p>
      <p>
        Choose WebSockets when the client also sends a stream of messages, like chat or
        collaboration.
      </p>
    </StepLayout>
  );
}

/* 4 ─ Operating ------------------------------------------------------------------------------------ */

export function Operating() {
  return (
    <StepLayout
      eyebrow="Explore"
      title="Keeping long connections healthy"
      stage={
        <div className="flex flex-1 flex-col justify-center gap-1.5">
          {[
            [
              "Heartbeats",
              "Load balancers and proxies often drop idle connections after about a minute; send a ping or a comment line regularly.",
            ],
            [
              "Reconnect with backoff",
              "When a server restarts, thousands of clients reconnect at once; add jitter.",
            ],
            [
              "Authentication",
              "The browser's EventSource can't set custom headers, so it usually relies on cookies.",
            ],
            [
              "Fan-out between instances",
              "A pub/sub channel (Redis, Valkey, NATS, Kafka) carries updates to every instance.",
            ],
            [
              "Sticky sessions",
              "Needed for long-polling fallbacks, such as Socket.IO's; pure WebSockets stay on one server anyway.",
            ],
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
        Long-lived connections change how a service behaves: deploys must drain them, memory grows
        with each one, and load balancers need the right timeouts.
      </p>
      <p>
        Polling is unfashionable but simple; for updates every few minutes it&apos;s often the right
        choice.
      </p>
    </StepLayout>
  );
}

/* 5 ─ Checkpoint ----------------------------------------------------------------------------------- */

export function LiveCheck() {
  return (
    <StepLayout
      eyebrow="Checkpoint"
      title="Pick the method"
      stage={
        <div className="flex flex-1 flex-col justify-center">
          <SortCheckpoint
            id="backend-live-updates"
            prompt="Which method suits each feature best?"
            categories={[
              { id: "poll", label: "Polling" },
              { id: "sse", label: "Server-sent events" },
              { id: "ws", label: "WebSockets" },
            ]}
            items={[
              {
                id: "status",
                label: "Live order status in a browser",
                category: "sse",
                why: "One-way updates from the server.",
              },
              {
                id: "chat",
                label: "A chat with typing indicators",
                category: "ws",
                why: "Messages flow both ways constantly.",
              },
              {
                id: "report",
                label: "A report that's ready within an hour",
                category: "poll",
                why: "Checking every minute is plenty.",
              },
              {
                id: "ai",
                label: "Streaming an AI answer word by word",
                category: "sse",
                why: "A one-way stream of text.",
              },
              {
                id: "board",
                label: "A shared whiteboard several people draw on",
                category: "ws",
                why: "Two-way, low-latency collaboration.",
              },
            ]}
            explanation="Rare updates: polling. One-way live updates: server-sent events. Constant two-way traffic: WebSockets."
          />
        </div>
      }
    >
      <p>Sort each feature.</p>
    </StepLayout>
  );
}

/* 6 ─ Wrap ----------------------------------------------------------------------------------------- */

export function Wrap() {
  return (
    <WrapStep
      points={[
        ["Push when timing matters", "SSE or WebSockets."],
        ["One-way? Use SSE", "Simple, automatic reconnects."],
        ["Two-way? WebSockets", "Chat and collaboration."],
        ["Fan out across instances", "A pub/sub channel."],
        ["Heartbeats and backoff", "Keep connections healthy."],
      ]}
    >
      <p>Next: handling large file uploads safely.</p>
    </WrapStep>
  );
}
