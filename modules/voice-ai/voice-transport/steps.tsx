"use client";

import { useRef, useState } from "react";
import { motion } from "motion/react";
import { useSceneState } from "@/lib/module-sdk";
import { StepLayout } from "@/toolkit/layout/step-layout";
import { SortCheckpoint } from "@/toolkit/checkpoints/sort";
import { Term } from "@/toolkit/glossary/term";
import { cn } from "@/lib/cn";
import { PATHS, simulate, type PathId } from "./model";
import type { TransportState } from "./state";

/* 1 ─ Letters and phone calls --------------------------------------------------------------------- */

export function Pipes() {
  return (
    <StepLayout
      eyebrow="Story"
      title="Letters and phone calls"
      stage={
        <div className="grid flex-1 content-center gap-3 sm:grid-cols-2">
          <div className="border-line bg-surface rounded-xl border px-4 py-3">
            <p className="text-sm font-semibold">A numbered letter series</p>
            <div className="mt-2 flex gap-1">
              {[1, 2, 3, 4, 5, 6].map((n) => (
                <motion.span
                  key={n}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: n === 3 ? 1.4 : 0.15 * n }}
                  className={cn(
                    "rounded px-1.5 py-0.5 font-mono text-[10px]",
                    n === 3
                      ? "bg-viz-compute/30"
                      : n > 3
                        ? "bg-viz-compute/15 text-muted"
                        : "bg-viz-data/25",
                  )}
                >
                  {n}
                </motion.span>
              ))}
            </div>
            <p className="text-muted mt-2 text-xs">
              Letter 3 goes missing, so you wait for a copy before reading 4, 5 and 6. Nothing is
              lost, but everything is late.
            </p>
          </div>
          <div className="border-line bg-surface rounded-xl border px-4 py-3">
            <p className="text-sm font-semibold">A live radio show</p>
            <div className="mt-2 flex gap-1">
              {[1, 2, 3, 4, 5, 6].map((n) => (
                <motion.span
                  key={n}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.15 * n }}
                  className={cn(
                    "rounded px-1.5 py-0.5 font-mono text-[10px]",
                    n === 3 ? "border-line text-subtle border border-dashed" : "bg-viz-data/25",
                  )}
                >
                  {n === 3 ? "~" : n}
                </motion.span>
              ))}
            </div>
            <p className="text-muted mt-2 text-xs">
              A burst of crackle, and the show carries on. A moment is lost, but nothing is delayed.
            </p>
          </div>
        </div>
      }
    >
      <p>
        Live speech travels as a stream of small packets, each holding about 20 milliseconds of
        sound. On a real network some get lost. There are two ways to cope: wait for a resend, like
        the letters, or skip and cover the gap, like the radio.
      </p>
      <p>
        For conversation, being late is usually worse than a tiny crackle. That idea decides most of
        how voice audio is carried.
      </p>
    </StepLayout>
  );
}

/* 2 ─ Three ways to carry audio ⭐ ----------------------------------------------------------------- */

export function ThreeRoads() {
  const [s, set] = useSceneState<TransportState>();
  return (
    <StepLayout
      eyebrow="Animated infographic"
      title="Three ways to carry audio"
      stage={
        <div className="flex flex-1 flex-col justify-center gap-3">
          <label className="flex items-center gap-2 text-xs">
            <span className="text-muted">packets lost</span>
            <input
              type="range"
              min={0}
              max={10}
              value={s.loss}
              onChange={(e) => set({ loss: Number(e.target.value) })}
              className="accent-accent flex-1"
              aria-label="Packet loss"
            />
            <span className="w-8 font-mono">{s.loss}%</span>
          </label>
          {PATHS.map((p) => {
            const r = simulate(p, s.loss);
            const on = s.path === p.id;
            return (
              <button
                key={p.id}
                type="button"
                aria-pressed={on}
                onClick={() => set({ path: p.id as PathId })}
                className={cn(
                  "rounded-xl border px-3 py-2 text-left",
                  on ? "border-accent bg-accent-soft" : "border-line bg-surface",
                )}
              >
                <div className="flex flex-wrap items-baseline justify-between gap-x-3">
                  <span className="text-sm font-semibold">{p.name}</span>
                  <span className="text-muted text-[11px]">{p.who}</span>
                </div>
                <div className="mt-1.5 flex gap-[3px]">
                  {r.cells.map((c, i) => (
                    <motion.span
                      key={`${i}-${c}`}
                      initial={{ opacity: 0, x: -4 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.012 * i }}
                      className={cn(
                        "h-3 flex-1 rounded-sm",
                        c === "ok"
                          ? "bg-viz-data/70"
                          : c === "late"
                            ? "bg-viz-compute"
                            : "border-subtle border border-dashed",
                      )}
                    />
                  ))}
                </div>
                <p className="text-muted mt-1.5 text-[11px]">
                  {p.loss === "conceal"
                    ? r.concealed
                      ? `${r.concealed} packet${r.concealed > 1 ? "s" : ""} skipped and smoothed over: brief crackles, no extra delay.`
                      : "Every packet on time."
                    : r.stall
                      ? `Each lost packet is resent, and everything behind it waits: about ${r.stall} ms of stalls in this stretch.`
                      : "Every packet on time."}
                </p>
                {on && (
                  <div className="mt-2 grid grid-cols-2 gap-x-3 gap-y-0.5 text-[11px] sm:grid-cols-4">
                    {[
                      ["Carried by", p.transport],
                      ["Codec", p.codec],
                      ["Sample rate", p.rate],
                      ["Extra delay", `~${Math.round(r.delay)} ms`],
                    ].map(([k, v]) => (
                      <span key={k}>
                        <span className="text-subtle block">{k}</span>
                        {v}
                      </span>
                    ))}
                  </div>
                )}
              </button>
            );
          })}
          <div className="text-subtle flex flex-wrap gap-3 text-[10px]">
            <span>
              <span className="bg-viz-data/70 mr-1 inline-block h-2 w-3 rounded-sm" />
              on time
            </span>
            <span>
              <span className="border-subtle mr-1 inline-block h-2 w-3 rounded-sm border border-dashed" />
              skipped, covered over
            </span>
            <span>
              <span className="bg-viz-compute mr-1 inline-block h-2 w-3 rounded-sm" />
              waiting
            </span>
            <span>Illustrative numbers.</span>
          </div>
        </div>
      }
    >
      <p>
        Most voice agents use some mix of three roads. <Term id="webrtc">WebRTC</Term> carries audio
        from browsers and apps the radio way. A <Term id="websocket">WebSocket</Term> is a simple
        two-way pipe over TCP, which delivers everything in order, the letter way. Phone calls come
        in from the phone network through <Term id="sip">SIP</Term>.
      </p>
      <p>
        Raise the packet loss, as on a shaky mobile or café Wi-Fi connection. WebSocket audio starts
        to stall. That&apos;s why OpenAI, for example, recommends WebRTC for browsers and phones and
        WebSockets for server-to-server links, where networks are steady.
      </p>
    </StepLayout>
  );
}

/* 3 ─ Why phones sound thin ----------------------------------------------------------------------- */

export function Narrowband() {
  const ctx = useRef<AudioContext | null>(null);
  const [playing, setPlaying] = useState<string | null>(null);
  const play = (phone: boolean) => {
    ctx.current ??= new AudioContext();
    const ac = ctx.current;
    const len = Math.floor(ac.sampleRate * 0.8);
    const buf = ac.createBuffer(1, len, ac.sampleRate);
    const d = buf.getChannelData(0);
    for (let i = 0; i < len; i++) {
      const env = Math.min(1, i / 2000, (len - i) / 4000);
      d[i] = (Math.random() * 2 - 1) * 0.25 * env;
    }
    const src = ac.createBufferSource();
    src.buffer = buf;
    const hi = ac.createBiquadFilter();
    hi.type = "highpass";
    hi.frequency.value = phone ? 300 : 20;
    const lo = ac.createBiquadFilter();
    lo.type = "lowpass";
    lo.frequency.value = phone ? 3400 : 16000;
    src.connect(hi).connect(lo).connect(ac.destination);
    src.start();
    setPlaying(phone ? "phone" : "full");
    src.onended = () => setPlaying(null);
  };
  const bands: [string, number, string][] = [
    ["Phone (G.711)", 3.4, "8,000 samples a second, 64 kb/s"],
    ["Opus wideband", 8, "16,000 samples a second"],
    ["Opus fullband", 20, "48,000 samples a second"],
  ];
  return (
    <StepLayout
      eyebrow="Explore"
      title="Why phones sound thin"
      stage={
        <div className="flex flex-1 flex-col justify-center gap-3">
          <p className="text-muted text-[11px]">Highest pitch each can carry (kHz)</p>
          {bands.map(([n, k, d]) => (
            <div key={n} className="grid grid-cols-[7rem_1fr] items-center gap-2 text-xs">
              <span>{n}</span>
              <div>
                <div className="bg-surface-2 h-3 overflow-hidden rounded">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${(k / 20) * 100}%` }}
                    className="bg-viz-data h-full"
                  />
                </div>
                <p className="text-subtle mt-0.5 text-[10px]">
                  up to ~{k} kHz · {d}
                </p>
              </div>
            </div>
          ))}
          <div className="flex flex-wrap gap-2">
            <button
              type="button"
              onClick={() => play(false)}
              className={cn(
                "rounded-full border px-3 py-1 text-xs",
                playing === "full" ? "border-accent bg-accent-soft" : "border-line",
              )}
            >
              ▶ An &ldquo;sss&rdquo; hiss, full range
            </button>
            <button
              type="button"
              onClick={() => play(true)}
              className={cn(
                "rounded-full border px-3 py-1 text-xs",
                playing === "phone" ? "border-accent bg-accent-soft" : "border-line",
              )}
            >
              ▶ The same hiss, phone range
            </button>
          </div>
          <p className="text-subtle text-[10px]">
            Synthesised in your browser. Turn your volume down first.
          </p>
        </div>
      }
    >
      <p>
        An <Term id="audio-codec">audio codec</Term> packs sound into fewer bits. The classic phone
        codec, G.711, takes 8,000 <Term id="sample-rate">samples a second</Term>, so it can&apos;t
        carry anything above about 4 kHz. Much of the energy of &ldquo;s&rdquo; and &ldquo;f&rdquo;
        lives higher than that, which is why they blur on the phone.
      </p>
      <p>
        Opus, the codec WebRTC prefers, scales from narrow phone-like speech up to full-range music.
        WebRTC must support G.711 too, so it can talk to phone systems. A voice agent on the phone
        gets 8 kHz audio whatever vendor you use, and may need to convert it.
      </p>
    </StepLayout>
  );
}

/* 4 ─ How a phone call reaches your agent --------------------------------------------------------- */

export function PhoneRoute() {
  const hops: [string, string][] = [
    ["Caller's phone", "Dials your number."],
    ["Phone network", "Routes the call to your carrier."],
    [
      "SIP trunk",
      "Your carrier hands the call over as SIP: messages that set up and end the call. The sound flows separately, as RTP packets.",
    ],
    [
      "Your system",
      "Either the model provider answers the SIP call directly, or a telephony service streams the audio to your server over a WebSocket (Twilio's Media Streams, for example, always sends 8 kHz μ-law, base64-encoded).",
    ],
    ["The agent", "Hears, thinks and replies; the reply makes the same trip back."],
  ];
  return (
    <StepLayout
      eyebrow="Explore"
      title="How a phone call reaches your agent"
      stage={
        <div className="flex flex-1 flex-col justify-center gap-1">
          {hops.map(([t, d], i) => (
            <motion.div
              key={t}
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.12 * i }}
              className="flex flex-col items-stretch"
            >
              <div className="border-line bg-surface rounded-lg border px-3 py-2 text-xs">
                <span className="font-semibold">{t}: </span>
                <span className="text-muted">{d}</span>
              </div>
              {i < hops.length - 1 && <span className="text-accent self-center text-xs">↓</span>}
            </motion.div>
          ))}
        </div>
      }
    >
      <p>
        <Term id="sip">SIP</Term> (2002) is the language internet phone systems use to set up,
        change and end calls. A <Term id="sip-trunk">SIP trunk</Term> is the connection that brings
        ordinary phone calls into your system.
      </p>
      <p>
        Each hop adds delay, which is why phone agents usually feel a little slower than browser
        ones. In browsers, WebRTC has its own setup: it uses ICE, STUN and TURN to find a path
        between two devices, relaying through a server when no direct path exists. A{" "}
        <Term id="jitter-buffer">jitter buffer</Term> then holds packets briefly so playback is
        smooth.
      </p>
    </StepLayout>
  );
}

/* 5 ─ Pick the road ------------------------------------------------------------------------------- */

export function PickRoad() {
  return (
    <StepLayout
      eyebrow="Checkpoint"
      title="Pick the road"
      stage={
        <div className="flex flex-1 flex-col justify-center">
          <SortCheckpoint
            id="pick-road"
            prompt="Which way would you usually carry the audio in each case?"
            categories={[
              { id: "webrtc", label: "WebRTC" },
              { id: "ws", label: "WebSocket" },
              { id: "sip", label: "Phone / SIP" },
            ]}
            items={[
              {
                id: "widget",
                label: "A talk button on your website, used on phones over mobile data",
                category: "webrtc",
                why: "Browser client on a shaky network: WebRTC copes with loss without stalling.",
              },
              {
                id: "backend",
                label: "Your backend relaying audio to a model provider, inside a data centre",
                category: "ws",
                why: "Server-to-server on a steady network: a WebSocket is simple and fine.",
              },
              {
                id: "tollfree",
                label: "Customers ring a helpline number",
                category: "sip",
                why: "Phone calls arrive through the phone network via a SIP trunk.",
              },
              {
                id: "app",
                label: "A voice feature in a native mobile app",
                category: "webrtc",
                why: "Client device, real-world network: WebRTC.",
              },
            ]}
            explanation="Clients on real-world networks: WebRTC. Steady server links: WebSockets. Phone numbers: SIP. Many products use all three."
          />
        </div>
      }
    >
      <p>Sort the situations.</p>
    </StepLayout>
  );
}

/* 6 ─ Wrap ---------------------------------------------------------------------------------------- */

const POINTS: [string, string][] = [
  ["A small gap beats a stall", "Skip and cover lost audio rather than wait."],
  ["WebRTC for clients", "UDP, encrypted, Opus."],
  ["WebSockets for servers", "TCP is in-order, so loss stalls."],
  ["Phones are narrowband", "G.711, 8 kHz, via SIP."],
  ["Every hop adds delay", "Phone paths are slower."],
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
      <p>Next: designing what the agent says, so callers never feel trapped in a phone menu.</p>
    </StepLayout>
  );
}
