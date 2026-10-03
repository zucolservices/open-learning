"use client";

import { motion } from "motion/react";
import { useSceneState } from "@/lib/module-sdk";
import { StepLayout } from "@/toolkit/layout/step-layout";
import { SortCheckpoint } from "@/toolkit/checkpoints/sort";
import { Code } from "@/toolkit/controls/stepper";
import { Term } from "@/toolkit/glossary/term";
import { cn } from "@/lib/cn";
import { EVENTS, METHODS, simulate, type Method } from "./model";
import type { RtState } from "./state";

/* 1 ─ Are we there yet? --------------------------------------------------------------------------- */

export function AreWeThere() {
  return (
    <StepLayout
      eyebrow="Story"
      title="Are we there yet?"
      stage={
        <div className="flex flex-1 flex-col justify-center gap-2">
          {[
            ["Every five minutes", "“Are we there yet?” “No.”", "Polling"],
            ["“Wake me when we arrive”", "One question, answered when it's true", "Long polling"],
            ["The car radio", "The driver announces each town as you pass", "Server-sent events"],
            ["A walkie-talkie", "Either of you can talk at any moment", "WebSocket"],
          ].map(([t, d, k], i) => (
            <motion.div
              key={k}
              initial={{ opacity: 0, x: -6 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1 * i }}
              className="border-line bg-surface grid gap-x-3 rounded-lg border px-3 py-2 sm:grid-cols-[1fr_8rem]"
            >
              <span className="text-sm">
                <span className="font-semibold">{t}</span> <span className="text-muted">{d}</span>
              </span>
              <span className="text-accent text-xs sm:text-right">{k}</span>
            </motion.div>
          ))}
        </div>
      }
    >
      <p>
        HTTP is built around asking: the client sends a request, the server answers, done. That
        works until the client needs to know about something the moment it happens: a chat message,
        a wicket, a driver turning into your street.
      </p>
      <p>
        There are four common ways to get news to a screen fast, each with a different cost. Think
        of children on a long car journey.
      </p>
    </StepLayout>
  );
}

/* 2 ─ Live scores, four ways ⭐ ------------------------------------------------------------------- */

export function LiveScores() {
  const [s, set] = useSceneState<RtState>();
  const r = simulate(s.method, s.interval);
  const x = (t: number) => `${(t / 60) * 100}%`;
  return (
    <StepLayout
      eyebrow="Simulation"
      title="Live scores, four ways"
      stage={
        <div className="flex flex-1 flex-col justify-center gap-3">
          <div className="flex flex-wrap gap-1.5">
            {(Object.keys(METHODS) as Method[]).map((m) => (
              <button
                key={m}
                type="button"
                aria-pressed={s.method === m}
                onClick={() => set({ method: m })}
                className={cn(
                  "rounded-full border px-3 py-1 text-xs",
                  s.method === m
                    ? "border-accent bg-accent-soft"
                    : "border-line hover:bg-surface-2",
                )}
              >
                {METHODS[m].name}
              </button>
            ))}
          </div>
          <p className="text-muted text-xs">{METHODS[s.method].idea}</p>
          {s.method === "poll" && (
            <div className="flex items-center gap-1.5 text-xs">
              <span className="text-muted">ask every</span>
              {[2, 5, 15].map((v) => (
                <button
                  key={v}
                  type="button"
                  onClick={() => set({ interval: v })}
                  className={cn(
                    "rounded border px-2 py-0.5 font-mono",
                    s.interval === v ? "border-accent bg-accent-soft" : "border-line",
                  )}
                >
                  {v} s
                </button>
              ))}
            </div>
          )}
          <div className="border-line bg-surface rounded-xl border px-3 py-3">
            <div className="relative h-16">
              <div className="bg-line absolute inset-x-0 top-7 h-px" />
              {EVENTS.map((e) => (
                <div key={e.t} className="absolute top-0 -translate-x-1/2" style={{ left: x(e.t) }}>
                  <p className="text-viz-compute font-mono text-[9px] whitespace-nowrap">
                    {e.label}
                  </p>
                  <div className="bg-viz-compute mx-auto mt-0.5 h-3 w-0.5" />
                </div>
              ))}
              {r.ticks.map((t, i) => (
                <motion.div
                  key={`${s.method}-${s.interval}-${i}`}
                  initial={{ opacity: 0, y: 4 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.02 * i }}
                  className={cn(
                    "absolute top-8 size-2 -translate-x-1/2 rounded-full",
                    r.learned.includes(t) ? "bg-good" : "bg-viz-idle",
                  )}
                  style={{ left: x(t) }}
                />
              ))}
              {(s.method === "sse" || s.method === "ws") && (
                <div className="bg-accent/60 absolute inset-x-0 top-[2.1rem] h-1 rounded-full" />
              )}
            </div>
            <div className="text-muted flex justify-between font-mono text-[9px]">
              <span>0 s</span>
              <span>one minute of the match</span>
              <span>60 s</span>
            </div>
          </div>
          <div className="grid grid-cols-3 gap-2">
            {[
              ["Requests", String(r.requests)],
              ["Empty answers", String(r.empty)],
              ["Avg delay", r.avgDelay < 0.5 ? "instant" : `${r.avgDelay.toFixed(1)} s`],
            ].map(([l, v]) => (
              <div key={l} className="border-line bg-surface rounded-lg border px-2 py-1.5">
                <p className="text-muted text-[10px]">{l}</p>
                <p className="font-mono text-sm font-semibold">{v}</p>
              </div>
            ))}
          </div>
          <p className="text-muted text-[11px]">Connections held open: {r.open}.</p>
          <p className="text-subtle text-[10px]">
            Illustrative. Grey dots: requests that found nothing new. Green: the moment the app
            learned of an event.
          </p>
        </div>
      }
    >
      <p>
        Six things happen in one minute of a match. Deliver them to a scores app four ways and
        compare: how many requests, how many wasted, and how late the app hears.
      </p>
      <p>
        Polling trades freshness for waste: ask often and most answers are empty; ask rarely and
        you&apos;re late. The streaming options hold a connection open instead, which costs the
        server memory per viewer but makes news instant.
      </p>
    </StepLayout>
  );
}

/* 3 ─ Server-sent events -------------------------------------------------------------------------- */

export function Sse() {
  return (
    <StepLayout
      eyebrow="Explore"
      title="Server-sent events"
      stage={
        <div className="flex flex-1 flex-col justify-center gap-3">
          <Code>{`GET /matches/ind-aus/live
Accept: text/event-stream

HTTP/1.1 200 OK
Content-Type: text/event-stream

id: 41
event: ball
data: {"over":"18.3","runs":4}

id: 42
event: ball
data: {"over":"18.4","wicket":true}
`}</Code>
          <p className="text-muted text-[11px]">
            If the connection drops, the browser reconnects and sends Last-Event-ID: 42, so the
            server can resume where it left off.
          </p>
        </div>
      }
    >
      <p>
        <Term id="sse">Server-sent events</Term> are plain HTTP: one response that never quite ends,
        with the server writing events into it. Browsers support them natively with{" "}
        <code>EventSource</code>, including automatic reconnection.
      </p>
      <p>
        They&apos;re how AI chat APIs stream answers word by word: both OpenAI&apos;s and
        Anthropic&apos;s APIs use server-sent events when you ask for <code>stream: true</code>. One
        caution from MDN: over HTTP/1.1, browsers allow only six connections per domain, shared
        across tabs; HTTP/2 lifts that to a negotiated limit (100 by default).
      </p>
    </StepLayout>
  );
}

/* 4 ─ WebSockets and beyond ----------------------------------------------------------------------- */

export function Sockets() {
  return (
    <StepLayout
      eyebrow="Explore"
      title="WebSockets and beyond"
      stage={
        <div className="flex flex-1 flex-col justify-center gap-3">
          <Code>{`GET /chat HTTP/1.1
Upgrade: websocket
Connection: Upgrade
Sec-WebSocket-Key: dGhlIHNhbXBsZSBub25jZQ==

HTTP/1.1 101 Switching Protocols
Upgrade: websocket
(from here on: messages in both directions)`}</Code>
          <div className="grid gap-2 sm:grid-cols-2">
            {[
              [
                "Who uses them",
                "Discord's Gateway: “Gateway connections are persistent WebSockets”. Slack's Socket Mode too.",
              ],
              [
                "The cost",
                "Long-lived connections need load balancers and servers built for them, and a plan for reconnecting.",
              ],
            ].map(([t, d]) => (
              <div key={t} className="border-line bg-surface rounded-lg border px-3 py-2">
                <p className="text-sm font-semibold">{t}</p>
                <p className="text-muted text-xs">{d}</p>
              </div>
            ))}
          </div>
        </div>
      }
    >
      <p>
        A <Term id="websocket">WebSocket</Term> (RFC 6455, 2011) starts life as an HTTP request
        asking to upgrade. Once the server agrees, the same connection carries messages in both
        directions, with no request-and-response structure at all.
      </p>
      <p>
        That suits chat, collaborative editing and games, where the client talks as much as it
        listens. A newer option, WebTransport, became a W3C Candidate Recommendation in 2026 and
        works in current browsers, though its IETF protocol is still a draft.
      </p>
    </StepLayout>
  );
}

/* 5 ─ Pick the channel ---------------------------------------------------------------------------- */

export function PickChannel() {
  return (
    <StepLayout
      eyebrow="Checkpoint"
      title="Pick the channel"
      stage={
        <div className="flex flex-1 flex-col justify-center">
          <SortCheckpoint
            id="pick-channel"
            prompt="Which delivery method fits each feature best?"
            categories={[
              { id: "poll", label: "Polling" },
              { id: "sse", label: "SSE" },
              { id: "ws", label: "WebSocket" },
            ]}
            items={[
              {
                id: "status",
                label: "A parcel's status, checked when the user opens the app",
                category: "poll",
                why: "Changes a few times a day; a request now and then is plenty.",
              },
              {
                id: "report",
                label: "A report job that takes about a minute; check until done",
                category: "poll",
                why: "A handful of requests, nothing to hold open.",
              },
              {
                id: "ai",
                label: "Streaming an AI assistant's answer as it's written",
                category: "sse",
                why: "One-way, from server to client: what AI APIs use.",
              },
              {
                id: "scores",
                label: "Live cricket scores for millions of viewers",
                category: "sse",
                why: "Server to client only, with built-in reconnection.",
              },
              {
                id: "chat",
                label: "A support chat where both sides type",
                category: "ws",
                why: "Messages flow both ways, any time.",
              },
              {
                id: "game",
                label: "A multiplayer quiz with instant answers",
                category: "ws",
                why: "Two-way and low latency.",
              },
            ]}
            explanation="Rare changes: poll. Server-to-client streams: SSE. Constant two-way traffic: WebSocket."
          />
        </div>
      }
    >
      <p>Match the method to how often things change, and who talks.</p>
    </StepLayout>
  );
}

/* 6 ─ Wrap ---------------------------------------------------------------------------------------- */

const POINTS: [string, string][] = [
  ["Polling", "Simple; wasteful and late for fast-changing data."],
  ["Long polling", "Instant, but a request per event."],
  ["Server-sent events", "One-way stream over plain HTTP, with reconnection."],
  ["WebSockets", "Two-way, for chat and games."],
  ["Open connections cost", "Plan servers and load balancers for them."],
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
        That completes the tour of API styles. The last chapter is about who may call, how often,
        how fast, and how they find out how.
      </p>
    </StepLayout>
  );
}
