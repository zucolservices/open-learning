"use client";

import { motion } from "motion/react";
import { useSceneState } from "@/lib/module-sdk";
import { StepLayout } from "@/toolkit/layout/step-layout";
import { SortCheckpoint } from "@/toolkit/checkpoints/sort";
import { Segmented } from "@/toolkit/controls/segmented";
import { FrameCaption, Stepper } from "@/toolkit/controls/stepper";
import { Term } from "@/toolkit/glossary/term";
import { cn } from "@/lib/cn";
import { ADVANCE, CLICKS, GAP, SIZE, USERS, windowsFor } from "./windows";
import type { Kind, WinState } from "./state";

/* 1 ─ Counting at a toll plaza ----------------------------------------------------------------- */

const QUESTIONS: [string, string, string][] = [
  [
    "“How many cars every 10 minutes?”",
    "Back-to-back blocks: 10:00–10:10, 10:10–10:20…",
    "Tumbling",
  ],
  [
    "“Every 5 minutes, how many in the last 10?”",
    "Overlapping blocks; each car counted twice.",
    "Hopping",
  ],
  ["“Were there ever 3 cars within 2 minutes?”", "A window that moves with every car.", "Sliding"],
  [
    "“How long did each convoy take to pass?”",
    "A group ends when the gap between cars gets long.",
    "Session",
  ],
];

export function TollPlaza() {
  return (
    <StepLayout
      eyebrow="Analogy"
      title="Counting at a toll plaza"
      stage={
        <div className="flex flex-1 flex-col justify-center gap-2">
          {QUESTIONS.map(([q, how, k], i) => (
            <motion.div
              key={k}
              initial={{ opacity: 0, x: -8 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.12 * i }}
              className="border-line bg-surface rounded-xl border px-4 py-2.5"
            >
              <p className="text-sm font-semibold">
                {q} <span className="text-accent text-xs font-medium">· {k}</span>
              </p>
              <p className="text-muted text-xs">{how}</p>
            </motion.div>
          ))}
        </div>
      }
    >
      <p>
        Cars never stop arriving at a toll plaza, so &ldquo;how many cars?&rdquo; has no answer
        until you say over what stretch of time. Different questions need differently shaped
        stretches.
      </p>
      <p>
        Stream processors call these stretches <Term id="stream-window">windows</Term>. They cut an
        endless stream into finite pieces you can count, sum or average, using the event time from
        module 12.
      </p>
    </StepLayout>
  );
}

/* 2 ─ One clickstream, four windows ⭐ ---------------------------------------------------------- */

const KINDS: [Kind, string][] = [
  ["tumbling", "Tumbling 10m"],
  ["hopping", "Hopping 10m / 5m"],
  ["sliding", "Sliding 10m"],
  ["session", "Session, 5m gap"],
];

const NOTE: Record<Kind, string> = {
  tumbling: `Fixed, back-to-back ${SIZE}-minute windows aligned to the clock. Every click is in exactly one window.`,
  hopping: `${SIZE}-minute windows starting every ${ADVANCE} minutes, so they overlap and every click is counted in ${SIZE / ADVANCE} windows.`,
  sliding:
    "Kafka Streams' sliding windows: a 10-minute window that ends at each click (both ends included), so you can ask “most clicks in any 10 minutes?”.",
  session: `Each user's clicks are grouped until there's a gap of ${GAP} minutes or more. Windows have no fixed size, and differ per user.`,
};

const X = (t: number) => `${(Math.max(0, Math.min(60, t)) / 60) * 100}%`;

export function WindowLab() {
  const [s, set] = useSceneState<WinState>();
  const wins = windowsFor(s.kind);
  return (
    <StepLayout
      eyebrow="Simulation · illustrative clicks"
      title="One clickstream, four windows"
      stage={
        <div className="flex flex-1 flex-col justify-center gap-3">
          <Segmented size="sm" value={s.kind} options={KINDS} onChange={(v) => set({ kind: v })} />
          <div className="flex flex-col gap-3">
            {USERS.map((u) => {
              const mine = wins.filter((w) => w.user === u);
              return (
                <div key={u}>
                  <p className="text-muted mb-0.5 text-[10px]">{u}</p>
                  <div className="bg-surface-2 relative h-4 rounded">
                    {CLICKS[u].map((t) => (
                      <span
                        key={t}
                        className="bg-accent absolute top-1/2 size-2.5 -translate-x-1/2 -translate-y-1/2 rounded-full"
                        style={{ left: X(t) }}
                      />
                    ))}
                  </div>
                  <div
                    className="relative mt-0.5"
                    style={{
                      height: `${Math.min(mine.length, s.kind === "sliding" ? 7 : 3) * 9 + 4}px`,
                    }}
                  >
                    {mine.map((w, i) => {
                      const lane = s.kind === "hopping" ? i % 2 : s.kind === "sliding" ? i : 0;
                      return (
                        <motion.div
                          key={`${s.kind}-${w.start}-${w.end}`}
                          initial={{ opacity: 0, scaleX: 0.6 }}
                          animate={{ opacity: 1, scaleX: 1 }}
                          transition={{ delay: 0.03 * i }}
                          className="border-viz-meta bg-viz-meta/15 absolute flex h-2 items-center justify-center rounded-sm border"
                          style={{
                            left: X(w.start),
                            width: `calc(${X(w.end)} - ${X(w.start)} + ${s.kind === "session" ? "6px" : "0px"})`,
                            top: `${lane * 9}px`,
                          }}
                        >
                          <span className="text-[7px] leading-none font-semibold">{w.count}</span>
                        </motion.div>
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </div>
          <div className="text-muted flex justify-between font-mono text-[9px]">
            <span>0</span>
            <span>15</span>
            <span>30</span>
            <span>45</span>
            <span>60 min</span>
          </div>
          <p className="text-xs">
            <span className="font-semibold">{wins.length} windows.</span>{" "}
            <span className="text-muted">{NOTE[s.kind]}</span>
          </p>
        </div>
      }
    >
      <p>
        The same three users&apos; clicks over an hour, cut four ways. Numbers on each window are
        the clicks inside it. Engines only create a window when an event falls into it, so empty
        windows never appear.
      </p>
      <p>
        <Term id="tumbling-window">Tumbling</Term> windows suit regular reports;{" "}
        <Term id="hopping-window">hopping</Term> windows give smooth rolling numbers;{" "}
        <Term id="session-window">session</Term> windows follow how people actually use an app.
      </p>
    </StepLayout>
  );
}

/* 3 ─ Late data and when to emit ⭐ --------------------------------------------------------------- */

const FRAMES = [
  {
    title: "1. Clicks arrive",
    text: "Clicks at 10:01, 10:04 and 10:06 fall in the 10:00–10:10 window.",
  },
  { title: "2. Another click", text: "A fourth click at 10:08." },
  {
    title: "3. Time moves on",
    text: "A click at 10:12 moves the watermark (or Kafka Streams' stream time) past 10:10. The window's end has passed.",
  },
  {
    title: "4. A straggler",
    text: "At 10:14 a click arrives that happened at 10:07, from a phone that was briefly offline.",
  },
  {
    title: "5. The window closes for good",
    text: "Once the end plus the allowed lateness has passed, no more changes are possible.",
  },
];

function outputs(
  frame: number,
  lateness: number,
  emit: "update" | "close",
): { text: string; late?: boolean }[] {
  const out: { text: string; late?: boolean }[] = [];
  if (emit === "update") {
    if (frame >= 0) out.push({ text: "count = 1" }, { text: "count = 2" }, { text: "count = 3" });
    if (frame >= 1) out.push({ text: "count = 4" });
    if (frame >= 3)
      out.push(
        lateness
          ? { text: "count = 5 (update)", late: true }
          : { text: "10:07 click dropped: too late", late: true },
      );
  } else {
    if (lateness === 0 && frame >= 2) out.push({ text: "final count = 4" });
    if (lateness === 0 && frame >= 3)
      out.push({ text: "10:07 click dropped: too late", late: true });
    if (lateness > 0 && frame >= 4) out.push({ text: "final count = 5" });
  }
  return out;
}

export function LateData() {
  const [s, set] = useSceneState<WinState>();
  const f = FRAMES[s.frame] ?? FRAMES[0];
  const out = outputs(s.frame, s.lateness, s.emit);
  return (
    <StepLayout
      eyebrow="Step through · Kafka Streams' rules"
      title="Late data and when to emit"
      stage={
        <div className="flex flex-1 flex-col justify-center gap-3">
          <div className="grid gap-2 text-xs sm:grid-cols-2">
            <div className="flex items-center gap-2">
              <span className="text-muted w-20 shrink-0">Grace</span>
              <Segmented
                size="sm"
                value={String(s.lateness) as "0" | "5"}
                options={[
                  ["0", "None"],
                  ["5", "5 minutes"],
                ]}
                onChange={(v) => set({ lateness: Number(v) as 0 | 5 })}
              />
            </div>
            <div className="flex items-center gap-2">
              <span className="text-muted w-20 shrink-0">Emit</span>
              <Segmented
                size="sm"
                value={s.emit}
                options={[
                  ["update", "Every update"],
                  ["close", "On close"],
                ]}
                onChange={(v) => set({ emit: v })}
              />
            </div>
          </div>
          <FrameCaption frameKey={s.frame} title={f.title}>
            {f.text}
          </FrameCaption>
          <Stepper step={s.frame} count={FRAMES.length} onChange={(n) => set({ frame: n })} />
          <div className="border-line bg-surface rounded-xl border px-3 py-2">
            <p className="text-muted mb-1 text-[10px]">
              Results sent downstream for window 10:00–10:10
            </p>
            {out.length === 0 && <p className="text-muted text-xs">nothing yet</p>}
            {out.map((o, i) => (
              <motion.p
                key={`${o.text}-${i}`}
                initial={{ opacity: 0, x: 6 }}
                animate={{ opacity: 1, x: 0 }}
                className={cn("font-mono text-[11px]", o.late && "text-accent")}
              >
                {o.text}
              </motion.p>
            ))}
          </div>
        </div>
      }
    >
      <p>
        One window, one straggler. Choose a grace period (how long a window accepts late events
        after its end) and when results go out: after every change, or once when the window closes.
      </p>
      <p>
        Emitting every update is fast but sends several versions, so downstream must keep only the
        latest per key and window (an upsert). Emitting on close sends one final answer, but later.
        Kafka Streams offers both (emit on close since 3.3); ksqlDB has EMIT CHANGES and EMIT FINAL;
        Flink SQL window aggregations emit only the final result.
      </p>
    </StepLayout>
  );
}

/* 4 ─ Same windows, different names ----------------------------------------------------------- */

const ROWS: [string, string, string, string, string][] = [
  ["Flink DataStream", "Tumbling", "Sliding", "–", "Session"],
  ["Flink SQL", "TUMBLE", "HOP (slide, size)", "–", "SESSION (1.19+)"],
  [
    "Kafka Streams",
    "TimeWindows (advance = size)",
    "TimeWindows (advance < size)",
    "SlidingWindows",
    "SessionWindows",
  ],
  ["Spark", "window(10 min)", "window(10, 5 min)", "–", "session_window"],
  ["Beam", "FixedWindows", "SlidingWindows", "–", "Sessions"],
  ["ksqlDB", "TUMBLING", "HOPPING", "–", "SESSION"],
];

export function Names() {
  return (
    <StepLayout
      eyebrow="Explore"
      title="Same windows, different names"
      stage={
        <div className="flex flex-1 flex-col justify-center">
          <div className="border-line overflow-x-auto rounded-xl border">
            <table className="w-full text-left text-[11px]">
              <thead className="bg-surface-2">
                <tr>
                  {["Engine", "Tumbling", "Hopping", "Sliding (true)", "Session"].map((h) => (
                    <th key={h} className="px-2 py-1.5 whitespace-nowrap">
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {ROWS.map((r) => (
                  <tr key={r[0]} className="border-line border-t">
                    {r.map((c, i) => (
                      <td
                        key={i}
                        className={cn(
                          "px-2 py-1.5",
                          i === 0 && "font-semibold",
                          i === 2 &&
                            ["Flink DataStream", "Spark", "Beam"].includes(r[0]) &&
                            "text-accent",
                        )}
                      >
                        {c}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="text-muted mt-2 text-xs">
            Highlighted: engines that call hopping windows “sliding”.
          </p>
        </div>
      }
    >
      <p>
        Watch out for the word &ldquo;sliding&rdquo;. Flink, Spark and Beam use it for what Kafka
        Streams and ksqlDB call hopping windows; Kafka Streams keeps it for windows that move with
        each record. Flink SQL also has CUMULATE windows, which grow within a period (for example,
        today so far, updated every minute).
      </p>
      <p>
        Grace and lateness differ too: Kafka Streams has required an explicit grace period since
        3.0; ksqlDB still defaults to 24 hours and asks you to set it; Flink&apos;s DataStream API
        allows lateness via allowedLateness and side outputs for anything later.
      </p>
    </StepLayout>
  );
}

/* 5 ─ Which window? ----------------------------------------------------------------------------- */

export function WhichWindow() {
  return (
    <StepLayout
      eyebrow="Checkpoint"
      title="Which window?"
      stage={
        <div className="flex flex-1 flex-col justify-center">
          <SortCheckpoint
            id="which-window"
            prompt="Pick the window for each question."
            categories={[
              { id: "tumbling", label: "Tumbling" },
              { id: "hopping", label: "Hopping" },
              { id: "sliding", label: "Sliding" },
              { id: "session", label: "Session" },
            ]}
            items={[
              {
                id: "hourly",
                label: "Orders per hour for the daily report",
                category: "tumbling",
                why: "Fixed, non-overlapping hours.",
              },
              {
                id: "rolling",
                label:
                  "A dashboard showing payments in the last 15 minutes, refreshed every minute",
                category: "hopping",
                why: "15-minute windows advancing every minute.",
              },
              {
                id: "burst",
                label: "Alert if any card is used 5 times within any 2 minutes",
                category: "sliding",
                why: "The 2 minutes can start anywhere, so the window moves with each event.",
              },
              {
                id: "visit",
                label: "How long each visitor spent on the app before going quiet",
                category: "session",
                why: "Activity grouped until a gap of inactivity.",
              },
            ]}
            explanation="Report periods: tumbling. Rolling numbers: hopping. 'Within any N minutes': sliding. Bursts of activity: session."
          />
        </div>
      }
    >
      <p>Four questions, four windows.</p>
    </StepLayout>
  );
}

/* 6 ─ Wrap --------------------------------------------------------------------------------------- */

const TAKEAWAYS: [string, string][] = [
  ["Windows make streams countable", "Cut by event time into finite pieces."],
  ["Four shapes", "Tumbling, hopping, sliding, session."],
  ["Names differ", "“Sliding” means hopping in Flink, Spark and Beam."],
  ["Late data costs", "Grace periods delay results or send updates."],
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
        Windows need memory to count. Next: state, and joining streams with tables and with each
        other.
      </p>
    </StepLayout>
  );
}
