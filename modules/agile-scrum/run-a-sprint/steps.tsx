"use client";

import { AnimatePresence, motion } from "motion/react";
import { AlertTriangle, Check, X, type LucideIcon } from "lucide-react";
import { useSceneState } from "@/lib/module-sdk";
import { StepLayout } from "@/toolkit/layout/step-layout";
import { ChoiceCheckpoint } from "@/toolkit/checkpoints/choice";
import { Term } from "@/toolkit/glossary/term";
import { cn } from "@/lib/cn";
import { DAYS, EVENTS, FORECAST, HOLIDAY_AFTER, run, type Choice, type Outcome } from "./model";
import type { SprintState } from "./state";

const FIT: Record<Choice["fit"], [string, string, LucideIcon]> = {
  good: ["Works well", "border-good/50 bg-good/10", Check],
  care: ["Can work, with care", "border-line-strong bg-surface-2", AlertTriangle],
  poor: ["Likely to hurt", "border-bad/50 bg-bad/10", X],
};

/* 1 ─ The briefing -------------------------------------------------------------------------------- */

const CAL: { d: number; kind: "work" | "weekend" | "holiday" }[] = Array.from(
  { length: 14 },
  (_, i) => {
    const d = 12 + i;
    const dow = i % 7; // 12 October 2026 is a Monday
    return { d, kind: dow >= 5 ? "weekend" : d === 20 ? "holiday" : "work" };
  },
);

export function Briefing() {
  return (
    <StepLayout
      eyebrow="Capstone"
      title="The briefing"
      stage={
        <div className="flex flex-1 flex-col justify-center gap-3">
          <div className="border-line bg-surface rounded-xl border p-3">
            <p className="text-muted mb-2 text-[10px] tracking-wide uppercase">October 2026</p>
            <div className="grid grid-cols-7 gap-1 text-center text-[10px]">
              {["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].map((d) => (
                <span key={d} className="text-muted">
                  {d}
                </span>
              ))}
              {CAL.map((c) => (
                <span
                  key={c.d}
                  className={cn(
                    "rounded-md py-1.5 font-medium",
                    c.kind === "work" && "bg-accent-soft",
                    c.kind === "weekend" && "text-muted",
                    c.kind === "holiday" && "bg-viz-idle/30 text-muted line-through",
                  )}
                >
                  {c.d}
                </span>
              ))}
            </div>
            <p className="text-muted mt-2 text-[11px]">
              Sprint: 12–23 October. Tuesday 20th is Dussehra, a holiday, so there are nine working
              days.
            </p>
          </div>
          <div className="grid grid-cols-3 gap-2 text-center">
            {[
              ["Team", "5 Developers"],
              ["Last 3 Sprints", "24 · 22 · 26 pts"],
              ["Forecast", `≈ ${FORECAST} pts`],
            ].map(([k, v]) => (
              <div key={k} className="border-line bg-surface rounded-lg border px-2 py-1.5">
                <p className="text-muted text-[10px]">{k}</p>
                <p className="text-sm font-semibold">{v}</p>
              </div>
            ))}
          </div>
          <div className="border-accent bg-surface rounded-r-xl border-l-4 px-3 py-2 text-sm">
            <span className="text-muted text-[10px] tracking-wide uppercase">Sprint Goal</span>
            <p className="font-semibold">Patients can reschedule an appointment online.</p>
          </div>
        </div>
      }
    >
      <p>
        Everything in this track, in one Sprint. You&apos;re helping a Bengaluru team build an
        appointment app for a chain of clinics. The Product Owner, Meera, sits with the client; the
        Developers are Ravi, Sana, Joseph, Priya and Arjun.
      </p>
      <p>
        You&apos;ll plan the Sprint, then live through it day by day. Surprises will arrive. At each
        one, choose what the team does and watch the <Term id="burndown">burndown</Term> respond.
        There are better and worse choices, but no score: the debrief explains each one.
      </p>
      <p className="text-muted text-xs">
        The team, client and numbers are made up; the holiday is real.
      </p>
    </StepLayout>
  );
}

/* 2 ─ Run the Sprint ⭐ (simulation + branching) --------------------------------------------------- */

const W = 360;
const H = 170;
const L = 28;
const R = 350;
const T = 10;
const B = 140;
const MAXY = 35;
const n = DAYS.length;
const sx = (i: number) => L + (i / n) * (R - L);
const sy = (v: number) => B - (v / MAXY) * (B - T);

function Burndown({ o, day }: { o: Outcome; day: number }) {
  const pts = [o.start, ...o.days.map((d) => d.remaining)];
  const scope = [o.start, ...o.days.map((d) => d.scope)];
  const line = (vs: number[]) =>
    vs.map((v, i) => `${i ? "L" : "M"}${sx(i).toFixed(1)},${sy(v).toFixed(1)}`).join("");
  return (
    <svg
      viewBox={`0 0 ${W} ${H}`}
      className="max-h-56 w-full"
      role="img"
      aria-label="Sprint burndown"
    >
      {[0, 10, 20, 30].map((v) => (
        <g key={v}>
          <line x1={L} x2={R} y1={sy(v)} y2={sy(v)} className="stroke-line" strokeDasharray="2 3" />
          <text x={L - 4} y={sy(v) + 3} textAnchor="end" className="fill-muted text-[8px]">
            {v}
          </text>
        </g>
      ))}
      <rect
        x={(sx(HOLIDAY_AFTER + 1) + sx(HOLIDAY_AFTER + 2)) / 2 - 3}
        y={T}
        width={6}
        height={B - T}
        className="fill-viz-idle/30"
      />
      <text
        x={(sx(HOLIDAY_AFTER + 1) + sx(HOLIDAY_AFTER + 2)) / 2}
        y={T - 2}
        textAnchor="middle"
        className="fill-muted text-[7px]"
      >
        Dussehra
      </text>
      {DAYS.map((d, i) => (
        <text
          key={d}
          x={sx(i + 1)}
          y={B + 12}
          textAnchor="middle"
          className={cn("text-[7px]", i < day ? "fill-fg" : "fill-muted")}
        >
          {d.split(" ")[1]}
        </text>
      ))}
      <text x={(L + R) / 2} y={B + 26} textAnchor="middle" className="fill-muted text-[8px]">
        October (end of each working day)
      </text>
      <line
        x1={sx(0)}
        y1={sy(o.start)}
        x2={sx(n)}
        y2={sy(0)}
        className="stroke-muted"
        strokeDasharray="4 3"
      />
      {day > 0 && (
        <>
          <path
            d={line(scope.slice(0, day + 1))}
            fill="none"
            className="stroke-viz-meta"
            strokeWidth={1.2}
            strokeDasharray="1 2"
          />
          <path
            d={line(pts.slice(0, day + 1))}
            fill="none"
            className="stroke-accent"
            strokeWidth={2.5}
          />
        </>
      )}
      <circle
        cx={sx(Math.min(day, n))}
        cy={sy(pts[Math.min(day, n)])}
        r={3.5}
        className="fill-accent"
      />
    </svg>
  );
}

function EventCard({
  ev,
  pick,
  onPick,
}: {
  ev: (typeof EVENTS)[number];
  pick?: string;
  onPick(id: string): void;
}) {
  const chosen = ev.choices.find((c) => c.id === pick);
  return (
    <motion.div
      key={ev.id}
      initial={{ opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
      className="border-accent/50 bg-surface flex flex-col gap-2 rounded-xl border p-3"
    >
      <p className="text-sm font-semibold">{ev.title}</p>
      <p className="text-muted text-xs">{ev.text}</p>
      <div className="flex flex-col gap-1.5">
        {ev.choices.map((c) => (
          <button
            key={c.id}
            type="button"
            aria-pressed={pick === c.id}
            onClick={() => onPick(c.id)}
            className={cn(
              "rounded-lg border px-3 py-1.5 text-left text-xs",
              pick === c.id
                ? "border-accent bg-accent-soft"
                : "border-line bg-surface hover:bg-surface-2",
            )}
          >
            {c.label}
          </button>
        ))}
      </div>
      {chosen && (
        <motion.div
          key={chosen.id}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className={cn("rounded-lg border px-3 py-2 text-xs", FIT[chosen.fit][1])}
        >
          <p className="font-semibold">{FIT[chosen.fit][0]}</p>
          <p className="mt-0.5">{chosen.result}</p>
        </motion.div>
      )}
    </motion.div>
  );
}

export function TheSprint() {
  const [s, set] = useSceneState<SprintState>();
  const day = Math.min(s.day, n);
  const o = run(s.picks, day);
  const pending = EVENTS.filter((e) => e.day === day);
  const open = pending.find((e) => !s.picks[e.id]) ?? null;
  const shown = pending.filter((e) => s.picks[e.id] || e === open);
  const finished = day === n && !open;
  const today = day < n ? `${DAYS[day]} October` : "Fri 23 October, afternoon";
  return (
    <StepLayout
      eyebrow="Simulation · branching"
      title="Run the Sprint"
      stage={
        <div className="flex flex-1 flex-col gap-3">
          <div className="flex items-center justify-between gap-2">
            <p className="text-sm">
              <span className="text-muted text-xs">Today </span>
              <span className="font-semibold">{today}</span>
            </p>
            <div className="text-muted flex gap-3 text-[11px] tabular-nums">
              <span>In Sprint: {Math.round(day > 0 ? o.days[day - 1].scope : o.start)} pts</span>
              <span>Left: {(day > 0 ? o.days[day - 1].remaining : o.start).toFixed(1)}</span>
            </div>
          </div>
          <Burndown o={o} day={day} />
          <div className="text-muted flex flex-wrap gap-x-3 gap-y-1 text-[10px]">
            <span className="flex items-center gap-1">
              <span className="bg-accent h-0.5 w-4" /> Work left
            </span>
            <span className="flex items-center gap-1">
              <span className="border-muted w-4 border-t border-dashed" /> Ideal
            </span>
            <span className="flex items-center gap-1">
              <span className="border-viz-meta w-4 border-t border-dotted" /> Sprint Backlog size
            </span>
          </div>
          <AnimatePresence mode="popLayout">
            {shown.map((ev) => (
              <EventCard
                key={ev.id}
                ev={ev}
                pick={s.picks[ev.id]}
                onPick={(id) => set({ picks: { ...s.picks, [ev.id]: id } })}
              />
            ))}
          </AnimatePresence>
          {s.picks.sick === "negotiate" && s.picks.plan === "goal" && day >= 5 && day <= 6 && (
            <p className="text-muted text-xs">
              (Photos weren&apos;t in this Sprint, so there was nothing to move.)
            </p>
          )}
          {!open && day < n && (
            <button
              type="button"
              onClick={() => set({ day: day + 1 })}
              className="bg-accent text-accent-fg self-start rounded-full px-4 py-1.5 text-xs font-medium"
            >
              {day === 0
                ? "Start the Sprint"
                : day === HOLIDAY_AFTER
                  ? "Next working day (after Dussehra)"
                  : "Next day"}
            </button>
          )}
          {finished && (
            <p className="text-good text-sm font-medium">
              Sprint complete. Continue to the debrief.
            </p>
          )}
          {day > 0 && (
            <button
              type="button"
              onClick={() => set({ day: 0, picks: {} })}
              className="text-muted self-start text-[11px] underline"
            >
              Start the Sprint again
            </button>
          )}
        </div>
      }
    >
      <p>
        Make each call, then move to the next day. The orange line is the work left in the Sprint
        Backlog; the dotted line shows its size, which changes when scope does.
      </p>
      <p className="text-muted text-sm">
        Remember the rules of the Sprint: &ldquo;No changes are made that would endanger the Sprint
        Goal&rdquo;, &ldquo;Quality does not decrease&rdquo;, and scope &ldquo;may be clarified and
        renegotiated with the Product Owner as more is learned.&rdquo;
      </p>
    </StepLayout>
  );
}

/* 3 ─ The debrief ------------------------------------------------------------------------------- */

export function Debrief() {
  const [s] = useSceneState<SprintState>();
  const o = run(s.picks);
  const played = EVENTS.filter((e) => s.picks[e.id]);
  const left = Math.max(0, o.scope - o.done);
  return (
    <StepLayout
      eyebrow="Debrief"
      title="The debrief"
      stage={
        <div className="flex flex-1 flex-col gap-3">
          {played.length < EVENTS.length ? (
            <p className="text-muted text-sm">
              Finish the Sprint in the previous step to see your debrief. ({played.length} of{" "}
              {EVENTS.length} calls made.)
            </p>
          ) : (
            <>
              <div className="grid grid-cols-2 gap-2 text-center sm:grid-cols-4">
                {[
                  [
                    "Sprint Goal",
                    o.goalMet ? "Met" : "Not met",
                    o.goalMet ? "text-good" : "text-bad",
                  ],
                  ["Done", `${o.done.toFixed(0)} pts`, ""],
                  ["Back to backlog", `${left.toFixed(0)} pts`, left > 0.5 ? "text-bad" : ""],
                  [
                    "New debt",
                    o.debt ? `${o.debt} pts` : "none",
                    o.debt ? "text-bad" : "text-good",
                  ],
                ].map(([k, v, c]) => (
                  <div key={k} className="border-line bg-surface rounded-lg border px-2 py-1.5">
                    <p className="text-muted text-[10px]">{k}</p>
                    <p className={cn("text-sm font-semibold", c)}>{v}</p>
                  </div>
                ))}
              </div>
              {(o.weekend || o.bugWaits) && (
                <p className="text-muted text-xs">
                  {o.weekend && "The team worked a Saturday. "}
                  {o.bugWaits && "Some patients couldn't pay online until the next Sprint."}
                </p>
              )}
              <ul className="flex flex-col gap-1.5">
                {played.map((ev) => {
                  const mine = ev.choices.find((c) => c.id === s.picks[ev.id])!;
                  const best = ev.choices.filter((c) => c.fit === "good");
                  const Icon = FIT[mine.fit][2];
                  return (
                    <li
                      key={ev.id}
                      className={cn("rounded-lg border px-3 py-2 text-xs", FIT[mine.fit][1])}
                    >
                      <p className="flex items-center gap-1.5 font-semibold">
                        <Icon className="size-3.5 shrink-0" />
                        {ev.title}
                      </p>
                      <p className="mt-0.5">You chose: {mine.label}</p>
                      {mine.fit !== "good" && best[0] && (
                        <p className="text-muted mt-0.5">
                          Stronger option: {best[0].label}. {best[0].result}
                        </p>
                      )}
                    </li>
                  );
                })}
              </ul>
            </>
          )}
        </div>
      }
    >
      <p>
        How did your Sprint go? Each call is shown with how it tends to play out, and a stronger
        option where there is one.
      </p>
      <p>
        Want to see a different Sprint? Go back and choose differently: overload the plan, or add
        the side request quietly, and watch the Sprint Goal slip.
      </p>
    </StepLayout>
  );
}

/* 4 ─ One more surprise ------------------------------------------------------------------------ */

export function CancelCheck() {
  return (
    <StepLayout
      eyebrow="Checkpoint"
      title="One more surprise"
      stage={
        <div className="flex flex-1 flex-col justify-center">
          <ChoiceCheckpoint
            id="sprint-cancel"
            prompt="Imagine a different ending. On Thursday 22nd the clinic chain announces it's dropping online rescheduling altogether. What happens to the Sprint?"
            options={[
              {
                id: "sm",
                label: "The Scrum Master cancels it",
                feedback: "The Scrum Master helps the team, but cancelling isn't theirs to decide.",
              },
              {
                id: "po",
                label: "The Product Owner may cancel it, because the Sprint Goal is now obsolete",
                correct: true,
                feedback:
                  "“A Sprint could be cancelled if the Sprint Goal becomes obsolete. Only the Product Owner has the authority to cancel the Sprint.”",
              },
              {
                id: "never",
                label: "Nothing: Sprints can never be cancelled",
                feedback: "They can, but only for this reason, and only by the Product Owner.",
              },
              {
                id: "client",
                label: "The client cancels it",
                feedback: "The client talks to the Product Owner, who decides.",
              },
            ]}
          />
        </div>
      }
    >
      <p>A sick teammate or an urgent bug doesn&apos;t make a Sprint Goal obsolete. This might.</p>
    </StepLayout>
  );
}

/* 5 ─ Wrap --------------------------------------------------------------------------------------- */

const TAKEAWAYS: [string, string][] = [
  ["Plan to the pace", "Average velocity × the days you really have, with room for surprises."],
  [
    "Protect the goal, not the plan",
    "Renegotiate scope with the Product Owner; keep the Sprint Goal.",
  ],
  ["Never trade quality", "Skipped tests and quick patches aren't Done; they come back as debt."],
  [
    "Ship when it's Done",
    "The Review isn't a gate. An urgent fix goes out as soon as it meets the Definition of Done.",
  ],
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
        Why not just work the weekend? Economist John Pencavel, studying First World War munition
        workers, found output rose in step with hours only up to about 49 a week, and output at 70
        hours differed little from output at 56. Over years, WHO and ILO (2021) linked 55+ hour
        weeks to a 35% higher risk of stroke.
      </p>
      <p>
        The Manifesto&apos;s principle: a pace &ldquo;sponsors, developers, and users should be able
        to maintain… indefinitely.&rdquo; One more capstone to go: diagnosing a struggling team.
      </p>
    </StepLayout>
  );
}
