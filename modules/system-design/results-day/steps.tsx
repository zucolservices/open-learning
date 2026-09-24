"use client";

import { useMemo } from "react";
import { motion } from "motion/react";
import { useSceneState } from "@/lib/module-sdk";
import { StepLayout } from "@/toolkit/layout/step-layout";
import { ChoiceCheckpoint } from "@/toolkit/checkpoints/choice";
import { PredictCheckpoint } from "@/toolkit/checkpoints/predict";
import { Term } from "@/toolkit/glossary/term";
import { cn } from "@/lib/cn";
import { END, START, replay, type Design } from "./model";
import type { ResultsState } from "./state";

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

/* 1 ─ The brief ----------------------------------------------------------------------------------- */

export function Brief() {
  return (
    <StepLayout
      eyebrow="Capstone"
      title="The brief"
      stage={
        <div className="flex flex-1 flex-col justify-center gap-4">
          <div className="border-line bg-surface rounded-xl border px-4 py-3 text-sm">
            <p className="font-semibold">From: the State Board of Secondary Education</p>
            <p className="text-muted mt-2">
              Class 10 results go live at <strong>10:00 on 20 May</strong>. About 8 lakh students
              will check, usually with a parent or two checking too. Most people refresh the page
              from 9:55. Last year the site was down until 11:40 and it made the evening news. It
              must not happen again, and we can&apos;t spend a fortune on servers that idle the
              other 364 days.
            </p>
          </div>
          <PredictCheckpoint
            id="peak-estimate"
            prompt="8 lakh students, each result looked up by 2 people, and 60% of those lookups in the first 10 minutes. About how many lookups per second is that, on average, over those 10 minutes?"
            min={0}
            max={5000}
            step={50}
            unit="/s"
            answer={1600}
            tolerance={150}
            explanation="800,000 × 2 × 0.6 ÷ 600 s = 1,600 a second on average, and the first minute or two will be several times that. Normal days see perhaps 50 a second: a surge of 100× or more."
          />
        </div>
      }
    >
      <p>
        Results day is a school gate at home time: silence all day, then everyone at once. This
        capstone pulls together estimation, caching, CDNs, scaling and reliability.
      </p>
      <p>Start where every design starts: with the numbers.</p>
    </StepLayout>
  );
}

/* 2 ─ Make your design ⭐ -------------------------------------------------------------------------- */

const DECISIONS: {
  key: "data" | "front" | "scale";
  q: string;
  opts: [string, string, string][];
}[] = [
  {
    key: "data",
    q: "1. How is a result produced?",
    opts: [
      [
        "db",
        "Look it up in the database",
        "Simple, always current; every lookup is a database query.",
      ],
      [
        "cache",
        "Database, with an in-memory cache",
        "Repeat lookups come from memory; each first lookup still hits the database.",
      ],
      [
        "static",
        "Pre-built file per roll number",
        "Results are fixed on the day, so generate every page in advance and store them as files.",
      ],
    ],
  },
  {
    key: "front",
    q: "2. What sits in front?",
    opts: [
      [
        "single",
        "One big server",
        "Easy to run. Also a single point of failure and a hard ceiling.",
      ],
      ["lb", "Load balancer + app servers", "Spread load over many servers that can be added."],
      [
        "cdn",
        "CDN + load balancer + app servers",
        "Edges near users answer anything cacheable before it reaches you.",
      ],
    ],
  },
  {
    key: "scale",
    q: "3. How do servers get ready?",
    opts: [
      [
        "auto",
        "Autoscale when traffic rises",
        "Pay only for what's used; new servers take about five minutes to be ready.",
      ],
      [
        "prescale",
        "Pre-scale to 30 servers at 09:45",
        "Ready before the surge. You know exactly when it's coming.",
      ],
    ],
  },
];

export function Decide() {
  const [s, set] = useSceneState<ResultsState>();
  return (
    <StepLayout
      eyebrow="Branching decisions"
      title="Make your design"
      stage={
        <div className="flex flex-1 flex-col gap-3">
          {DECISIONS.map((d) => (
            <div key={d.key}>
              <p className="mb-1 text-xs font-semibold">{d.q}</p>
              <div className="grid gap-1.5 sm:grid-cols-3">
                {d.opts.map(([id, label, hint]) => {
                  const disabled = d.key === "scale" && s.front === "single";
                  return (
                    <button
                      key={id}
                      type="button"
                      disabled={disabled}
                      onClick={() => set({ [d.key]: id, replayed: false })}
                      className={cn(
                        "rounded-xl border px-2.5 py-2 text-left disabled:opacity-40",
                        s[d.key] === id
                          ? "border-accent bg-accent-soft"
                          : "border-line hover:bg-surface-2",
                      )}
                    >
                      <span className="block text-xs font-medium">{label}</span>
                      <span className="text-muted mt-0.5 block text-[10px] leading-snug">
                        {hint}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>
          ))}
          <label className="flex items-center gap-2 text-sm">
            <input
              type="checkbox"
              checked={s.sms}
              onChange={(e) => set({ sms: e.target.checked, replayed: false })}
              className="accent-[var(--accent)]"
            />
            4. Also send each result by SMS to the registered phone number
          </label>
          <p className="text-muted text-xs">Your choices carry into the replay on the next step.</p>
        </div>
      }
    >
      <p>
        Four decisions, each a lesson from earlier modules. There&apos;s more than one good answer;
        some are much cheaper than others.
      </p>
      <p className="text-muted text-sm">
        Hint: what is special about exam results? They don&apos;t change once published, and
        they&apos;re known before 10:00.
      </p>
    </StepLayout>
  );
}

/* 3 ─ Replay results day ⭐ ----------------------------------------------------------------------- */

function DayChart({ minutes }: { minutes: ReturnType<typeof replay>["minutes"] }) {
  const W = 360;
  const H = 150;
  const max = 7500;
  const n = minutes.length;
  const x = (i: number) => 30 + (i / (n - 1)) * (W - 38);
  const y = (v: number) => H - 18 - (Math.min(v, max) / max) * (H - 28);
  const dem = minutes.map((m, i) => `${i === 0 ? "M" : "L"}${x(i)},${y(m.demand)}`).join(" ");
  const srv =
    `M${x(0)},${y(0)} ` +
    minutes.map((m, i) => `L${x(i)},${y(m.served)}`).join(" ") +
    ` L${x(n - 1)},${y(0)} Z`;
  const failed = minutes
    .map((m, i) => ({ i, gap: m.demand - m.served }))
    .filter((g) => g.gap > m5(minutes[g.i].demand));
  return (
    <svg
      viewBox={`0 0 ${W} ${H}`}
      className="mx-auto w-full max-w-xl"
      role="img"
      aria-label="Lookups wanted and served on results day"
    >
      {failed.map((f) => (
        <rect
          key={f.i}
          x={x(f.i) - (W - 38) / n / 2}
          y={10}
          width={(W - 38) / n}
          height={H - 28}
          fill="var(--bad)"
          opacity={0.12}
        />
      ))}
      <motion.path
        d={srv}
        fill="var(--good)"
        opacity={0.35}
        initial={{ d: srv }}
        animate={{ d: srv }}
        transition={{ duration: 0.5 }}
      />
      <path d={dem} fill="none" stroke="var(--fg)" strokeWidth={1.3} />
      {[0, 3000, 6000].map((v) => (
        <text key={v} x={26} y={y(v) + 3} textAnchor="end" className="fill-subtle text-[7px]">
          {v / 1000}k
        </text>
      ))}
      {[
        [-10, "9:50"],
        [0, "10:00"],
        [15, "10:15"],
        [30, "10:30"],
        [60, "11:00"],
      ].map(([t, l]) => (
        <text
          key={l}
          x={x((t as number) - START)}
          y={H - 4}
          textAnchor={t === END ? "end" : "middle"}
          className="fill-subtle text-[8px]"
        >
          {l}
        </text>
      ))}
    </svg>
  );
}
const m5 = (d: number) => d * 0.05;

export function Replay() {
  const [s, set] = useSceneState<ResultsState>();
  const design: Design = {
    data: s.data,
    front: s.front,
    scale: s.front === "single" ? "auto" : s.scale,
    sms: s.sms,
  };
  const r = useMemo(() => replay(design), [design.data, design.front, design.scale, design.sms]); // eslint-disable-line react-hooks/exhaustive-deps
  const great = r.successFirst15 > 0.99;
  const cheap = r.serverMinutes < 500;
  return (
    <StepLayout
      eyebrow="Simulation"
      title="Replay results day"
      stage={
        <div className="flex flex-1 flex-col gap-3">
          <p className="text-muted text-xs">
            Your design:{" "}
            {DECISIONS.map((d) => d.opts.find((o) => o[0] === design[d.key])?.[1]).join(" · ")}
            {s.sms ? " · SMS results" : ""}
          </p>
          {!s.replayed ? (
            <button
              type="button"
              onClick={() => set({ replayed: true })}
              className="bg-accent text-accent-fg self-start rounded-full px-4 py-1.5 text-xs font-medium"
            >
              Run 09:50 → 11:00
            </button>
          ) : (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex flex-col gap-3"
            >
              <div className="border-line bg-surface rounded-xl border p-3">
                <DayChart minutes={r.minutes} />
                <div className="text-muted mt-1 flex flex-wrap justify-center gap-3 text-[10px]">
                  <span className="flex items-center gap-1">
                    <span className="bg-fg h-px w-4" /> lookups wanted /s
                  </span>
                  <span className="flex items-center gap-1">
                    <span className="bg-good/40 size-2.5" /> answered
                  </span>
                  <span className="flex items-center gap-1">
                    <span className="bg-bad/20 size-2.5" /> minutes with failures
                  </span>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
                <Stat
                  label="Answered, 10:00–10:15"
                  value={`${Math.round(r.successFirst15 * 100)}%`}
                  bad={!great}
                />
                <Stat
                  label="Minutes with failures"
                  value={String(r.badMinutes)}
                  bad={r.badMinutes > 0}
                />
                <Stat
                  label="Peak database load /s"
                  value={Math.round(r.peakDb).toLocaleString("en-IN")}
                  bad={r.peakDb >= 2900}
                />
                <Stat
                  label="Server-minutes (cost)"
                  value={r.serverMinutes.toLocaleString("en-IN")}
                  bad={!cheap}
                />
              </div>
              <div
                className={cn(
                  "rounded-xl border px-4 py-3 text-sm",
                  great ? "border-good/40 bg-good/10" : "border-bad/40 bg-bad/10",
                )}
              >
                <p className="font-semibold">
                  {great
                    ? cheap
                      ? "Calm, and cheap. The board sends a thank-you note."
                      : "It held, but you paid for 30 idle servers."
                    : "The evening news again."}
                </p>
                <ul className="mt-1 list-disc space-y-0.5 pl-4 text-xs">
                  {r.notes.map((n) => (
                    <li key={n}>{n}</li>
                  ))}
                </ul>
              </div>
              <p className="text-muted text-xs">
                Go back and change your design, then replay. Can you get 100% for under 200
                server-minutes?
              </p>
            </motion.div>
          )}
        </div>
      }
    >
      <p>
        Here comes 10:00. Watch lookups wanted against lookups answered, minute by minute, and see
        which of your decisions mattered.
      </p>
      <p className="text-muted text-sm">
        Illustrative model: app servers handle 250–3,000 lookups a second depending on the design,
        the database 3,000, and new servers take five minutes to be ready.
      </p>
    </StepLayout>
  );
}

/* 4 ─ Checkpoint --------------------------------------------------------------------------------- */

export function WhyStatic() {
  return (
    <StepLayout
      eyebrow="Checkpoint"
      title="Why do files win?"
      stage={
        <div className="flex flex-1 flex-col justify-center">
          <ChoiceCheckpoint
            id="why-static"
            prompt="Why does 'a pre-built file per roll number on a CDN' survive results day so cheaply?"
            options={[
              {
                id: "static",
                label:
                  "Results never change after publishing, so all the work can be done in advance and served from caches everywhere, with nothing to compute at 10:00",
                correct: true,
                feedback:
                  "Right. Turn a dynamic problem into a static one whenever the data allows: precompute, then let the CDN do the heavy lifting.",
              },
              {
                id: "fast",
                label: "Files are faster to read than databases",
                feedback:
                  "Often true, but the key is that no server of yours is involved per request: the CDN answers.",
              },
              {
                id: "cheap",
                label: "CDNs are free",
                feedback:
                  "They're not, but serving cached files is far cheaper than running servers for a spike.",
              },
              {
                id: "secure",
                label: "Files are more secure",
                feedback:
                  "Security needs care either way (for example, unguessable URLs or a date-of-birth check).",
              },
            ]}
            explanation="Two more real-world touches: release files at 10:00 by publishing the link then (not by opening the database), and protect privacy by including a second factor such as date of birth in the lookup."
          />
        </div>
      }
    >
      <p>
        The biggest win in this capstone isn&apos;t more servers. It&apos;s less work per request.
      </p>
    </StepLayout>
  );
}

/* 5 ─ Debrief -------------------------------------------------------------------------------------- */

const TAKEAWAYS = [
  ["Estimate the spike", "8 lakh students × 2 lookups, mostly in ten minutes: 100× normal."],
  ["Precompute what you can", "Fixed results can be static files; the CDN serves them."],
  ["Scale before, not during", "When you know the time of the surge, don't wait for autoscaling."],
  ["Take load off the site", "SMS, apps and other channels mean fewer people on the website."],
  ["Protect the database", "It's the one part that doesn't scale by adding app servers."],
];

export function Debrief() {
  return (
    <StepLayout
      eyebrow="Debrief"
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
        Real boards in India combine these: results on several websites at once, by SMS, and as
        digital marksheets in DigiLocker. Each channel takes pressure off the others, like{" "}
        <Term id="cdn">CDN</Term> edges do.
      </p>
      <p>The final capstone: an outage in progress, and you&apos;re on call.</p>
    </StepLayout>
  );
}
