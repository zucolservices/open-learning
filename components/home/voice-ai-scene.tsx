"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { cn } from "@/lib/cn";

type Part = { id: string; name: string; text: string };

/** Tour order: follow one caller's words out to the model and back. */
const PARTS: Part[] = [
  {
    id: "caller",
    name: "A caller",
    text: "speaks into a phone or browser; sound is a wave, sampled thousands of times a second, with echo and noise to clean up (modules 1, 2, 6).",
  },
  {
    id: "transport",
    name: "Carrying audio",
    text: "WebRTC for apps, WebSockets between servers, SIP for phone calls; a small gap beats a stall (module 13).",
  },
  {
    id: "turn",
    name: "Turns and interruptions",
    text: "decide when the caller has finished, ignore “mm-hm”, and stop at once when cut off (modules 5, 12).",
  },
  {
    id: "stt",
    name: "Speech-to-text",
    text: "streaming recognition, measured by word error rate (module 4).",
  },
  {
    id: "model",
    name: "The model and its tools",
    text: "a language model, or one speech-to-speech model, that talks and acts in the same call (modules 3, 11, 15).",
  },
  {
    id: "tts",
    name: "A voice",
    text: "text-to-speech with words written for the ear, and only voices used with consent (modules 7–9).",
  },
  {
    id: "budget",
    name: "The latency budget",
    text: "every hop costs milliseconds; streaming keeps the reply within about a second (module 10).",
  },
  {
    id: "quality",
    name: "Design and testing",
    text: "a conversation that confirms, recovers and hands over, tested with simulated callers on any platform (modules 14, 16, 17).",
  },
];

function Box({
  x,
  y,
  w,
  h,
  label,
  on,
}: {
  x: number;
  y: number;
  w: number;
  h: number;
  label: string;
  on: boolean;
}) {
  return (
    <g>
      <rect
        x={x}
        y={y}
        width={w}
        height={h}
        rx={4}
        className={on ? "fill-accent/15 stroke-accent" : "fill-surface stroke-line-strong"}
        strokeWidth={on ? 1.6 : 1}
      />
      <text
        x={x + w / 2}
        y={y + h / 2 + 3}
        textAnchor="middle"
        className={cn("font-mono text-[7px]", on ? "fill-accent" : "fill-fg")}
      >
        {label}
      </text>
    </g>
  );
}

function Diagram({ active, onSelect }: { active: string; onSelect(id: string): void }) {
  const f = (ids: string[]) => ({
    opacity: ids.includes(active) ? 1 : 0.35,
    transition: { duration: 0.35 },
  });
  const hit = (id: string) => ({
    onClick: () => onSelect(id),
    style: { cursor: "pointer" } as const,
    role: "button",
    "aria-label": PARTS.find((p) => p.id === id)?.name,
  });
  const on = (id: string) => active === id;
  const PATH = "M36 85 V51 H300 Q336 51 336 85 V109 Q336 141 300 141 H36 V109";
  return (
    <svg viewBox="0 0 380 200" className="w-full" fill="none" strokeLinecap="round">
      <path d={PATH} className="stroke-line-strong" strokeWidth={1} />
      {[0, 1, 2, 3].map((k) => (
        <circle key={k} r={2.4} className="fill-accent">
          <animateMotion dur="5s" begin={`-${k * 1.25}s`} repeatCount="indefinite" path={PATH} />
        </circle>
      ))}
      <motion.g animate={f(["caller"])} {...hit("caller")}>
        <Box x={8} y={85} w={56} h={24} label="caller" on={on("caller")} />
      </motion.g>
      <motion.g animate={f(["transport"])} {...hit("transport")}>
        <Box x={76} y={40} w={58} h={22} label="webrtc · sip" on={on("transport")} />
      </motion.g>
      <motion.g animate={f(["turn"])} {...hit("turn")}>
        <Box x={146} y={40} w={58} h={22} label="turn-taking" on={on("turn")} />
      </motion.g>
      <motion.g animate={f(["stt"])} {...hit("stt")}>
        <Box x={216} y={40} w={58} h={22} label="speech→text" on={on("stt")} />
      </motion.g>
      <motion.g animate={f(["model"])} {...hit("model")}>
        <Box x={300} y={85} w={72} h={24} label="model + tools" on={on("model")} />
      </motion.g>
      <motion.g animate={f(["tts"])} {...hit("tts")}>
        <Box x={216} y={130} w={58} h={22} label="text→speech" on={on("tts")} />
      </motion.g>
      <motion.g animate={f(["quality"])} {...hit("quality")}>
        <Box x={120} y={85} w={120} h={24} label="design · test callers" on={on("quality")} />
      </motion.g>
      <motion.g animate={f(["budget"])} {...hit("budget")}>
        {[
          [36, 30],
          [66, 24],
          [90, 26],
          [116, 70],
          [186, 40],
          [226, 30],
        ].map(([x, w], i) => (
          <rect
            key={i}
            x={x}
            y={166}
            width={w - 2}
            height={8}
            rx={2}
            className={on("budget") ? "fill-accent/40" : "fill-surface-2"}
          />
        ))}
        <line x1={300} y1={160} x2={300} y2={180} className="stroke-bad" strokeDasharray="2 2" />
        <text x={304} y={173} className="fill-muted font-mono text-[6px]">
          ~1 s
        </text>
      </motion.g>
      <text x={10} y={196} className="fill-muted font-mono text-[7px]">
        one call&apos;s round trip, from voice to voice
      </text>
    </svg>
  );
}

/** Voice AI showcase: one call's round trip, toured part by part; click any part. */
export function VoiceAiScene() {
  const [i, setI] = useState(0);
  const [auto, setAuto] = useState(true);
  useEffect(() => {
    if (!auto) return;
    const id = setInterval(() => setI((n) => (n + 1) % PARTS.length), 2600);
    return () => clearInterval(id);
  }, [auto]);
  const part = PARTS[i];
  return (
    <div className="flex flex-col gap-3">
      <Diagram
        active={part.id}
        onSelect={(id) => {
          setAuto(false);
          setI(PARTS.findIndex((p) => p.id === id));
        }}
      />
      <AnimatePresence mode="wait">
        <motion.p
          key={part.id}
          initial={{ opacity: 0, y: 4 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0 }}
          className="text-muted min-h-10 text-sm"
        >
          <span className="text-fg font-semibold">{part.name}:</span> {part.text}
        </motion.p>
      </AnimatePresence>
    </div>
  );
}
