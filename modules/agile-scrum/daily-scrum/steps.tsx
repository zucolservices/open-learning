"use client";

import { AnimatePresence, motion } from "motion/react";
import { Check, X } from "lucide-react";
import { useSceneState } from "@/lib/module-sdk";
import { StepLayout } from "@/toolkit/layout/step-layout";
import { SortCheckpoint } from "@/toolkit/checkpoints/sort";
import { Term } from "@/toolkit/glossary/term";
import { cn } from "@/lib/cn";
import { ScrumGuideCredit } from "../_shared/scrum-guide-credit";
import { STANDUPS, type Line, type Option } from "./standups";
import type { DailyState } from "./state";

/* 1 ─ Fifteen minutes, for the Developers --------------------------------------------------------- */

const GUIDE: [string, string][] = [
  [
    "Purpose",
    "The purpose of the Daily Scrum is to inspect progress toward the Sprint Goal and adapt the Sprint Backlog as necessary, adjusting the upcoming planned work.",
  ],
  [
    "Who and when",
    "The Daily Scrum is a 15-minute event for the Developers of the Scrum Team. To reduce complexity, it is held at the same time and place every working day of the Sprint.",
  ],
  [
    "Any format",
    "The Developers can select whatever structure and techniques they want, as long as their Daily Scrum focuses on progress toward the Sprint Goal and produces an actionable plan for the next day of work.",
  ],
  [
    "Not the only time",
    "The Daily Scrum is not the only time Developers are allowed to adjust their plan. They often meet throughout the day for more detailed discussions about adapting or re-planning the rest of the Sprint's work.",
  ],
];

export function Huddle() {
  return (
    <StepLayout
      eyebrow="Analogy"
      title="Fifteen minutes, for the Developers"
      stage={
        <div className="flex flex-1 flex-col gap-2">
          {GUIDE.map(([t, q], i) => (
            <motion.div
              key={t}
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.08 * i }}
              className="border-line bg-surface rounded-xl border px-4 py-3"
            >
              <p className="text-accent text-[11px] font-semibold tracking-wide uppercase">{t}</p>
              <p className="mt-1 text-sm">&ldquo;{q}&rdquo;</p>
            </motion.div>
          ))}
          <ScrumGuideCredit />
        </div>
      }
    >
      <p>
        Between overs, the bowler and fielders huddle for a few seconds: what&apos;s the plan for
        the next six balls? It isn&apos;t a report to the coach. It&apos;s the players adjusting
        their plan to win.
      </p>
      <p>
        The <Term id="daily-scrum">Daily Scrum</Term> is that huddle for the Developers, once a day,
        focused on the Sprint Goal.
      </p>
      <p className="text-muted text-sm">
        The famous &ldquo;three questions&rdquo; (what did I do yesterday, what will I do today, any
        impediments?) were only &ldquo;an example of what might be used&rdquo; in 2017, and the 2020
        guide removed them as part of dropping prescriptive language.
      </p>
    </StepLayout>
  );
}

/* 2 ─ Three stand-ups that go wrong ⭐ ------------------------------------------------------------ */

function Transcript({ lines, good }: { lines: Line[]; good?: boolean }) {
  return (
    <div
      className={cn(
        "grid gap-1 rounded-xl border p-3",
        good ? "border-good/40 bg-good/5" : "border-line bg-surface",
      )}
    >
      {lines.map((l, i) => (
        <motion.p
          key={i}
          initial={{ opacity: 0, x: -4 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.08 * i }}
          className="text-xs"
        >
          <span className={cn("font-semibold", l.who.startsWith("(") ? "text-bad" : "")}>
            {l.who}:
          </span>{" "}
          {l.text}
        </motion.p>
      ))}
    </div>
  );
}

function Pick({
  title,
  options,
  picked,
  onPick,
}: {
  title: string;
  options: Option[];
  picked?: string;
  onPick: (id: string) => void;
}) {
  const p = options.find((o) => o.id === picked);
  return (
    <div>
      <p className="mb-1 text-xs font-semibold">{title}</p>
      <div className="grid gap-1.5">
        {options.map((o) => (
          <button
            key={o.id}
            type="button"
            aria-pressed={picked === o.id}
            onClick={() => onPick(o.id)}
            className={cn(
              "rounded-xl border px-3 py-2 text-left text-xs",
              picked === o.id
                ? o.right
                  ? "border-good bg-good/10"
                  : "border-bad bg-bad/10"
                : "border-line bg-surface hover:bg-surface-2",
            )}
          >
            {o.label}
          </button>
        ))}
      </div>
      {p && (
        <p className="mt-1.5 flex gap-1.5 text-xs">
          {p.right ? (
            <Check className="text-good mt-0.5 size-3.5 shrink-0" />
          ) : (
            <X className="text-bad mt-0.5 size-3.5 shrink-0" />
          )}
          <span>{p.feedback}</span>
        </p>
      )}
    </div>
  );
}

export function Standups() {
  const [s, set] = useSceneState<DailyState>();
  const at = Math.min(s.at, STANDUPS.length - 1);
  const st = STANDUPS[at];
  const smellRight = st.smells.find((o) => o.id === s.smell[st.id])?.right;
  const fixRight = st.fixes.find((o) => o.id === s.fix[st.id])?.right;
  return (
    <StepLayout
      eyebrow="Fix the problem"
      title="Three stand-ups that go wrong"
      stage={
        <div className="flex flex-1 flex-col gap-3">
          <div className="flex flex-wrap gap-1.5">
            {STANDUPS.map((x, i) => (
              <button
                key={x.id}
                type="button"
                onClick={() => set({ at: i })}
                className={cn(
                  "rounded-full border px-2.5 py-1 text-xs",
                  i === at ? "border-accent bg-accent-soft" : "border-line hover:bg-surface-2",
                )}
              >
                {x.title.split(":")[0]}
              </button>
            ))}
          </div>
          <AnimatePresence mode="wait">
            <motion.div
              key={st.id}
              initial={{ opacity: 0, x: 8 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -8 }}
              className="flex flex-col gap-3"
            >
              <div>
                <p className="text-sm font-semibold">{st.title}</p>
                <p className="text-muted text-xs">{st.setting}</p>
              </div>
              <Transcript lines={st.lines} />
              <Pick
                title="1. What's going wrong?"
                options={st.smells}
                picked={s.smell[st.id]}
                onPick={(id) => set({ smell: { ...s.smell, [st.id]: id } })}
              />
              {smellRight && (
                <Pick
                  title="2. What would help?"
                  options={st.fixes}
                  picked={s.fix[st.id]}
                  onPick={(id) => set({ fix: { ...s.fix, [st.id]: id } })}
                />
              )}
              {fixRight && (
                <motion.div initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }}>
                  <p className="mb-1 text-xs font-semibold">3. The same morning, done better</p>
                  <Transcript lines={st.better} good />
                  <p className="text-subtle mt-1 text-[10px]">{st.source}</p>
                  {at < STANDUPS.length - 1 && (
                    <button
                      type="button"
                      onClick={() => set({ at: at + 1 })}
                      className="bg-accent text-accent-fg mt-2 rounded-full px-4 py-1.5 text-xs font-medium"
                    >
                      Next stand-up
                    </button>
                  )}
                </motion.div>
              )}
            </motion.div>
          </AnimatePresence>
        </div>
      }
    >
      <p>
        Three mornings on the citizen-portal team. Each stand-up looks normal and each one fails its
        purpose. Spot the problem, then pick the fix.
      </p>
      <p className="text-muted text-sm">
        The problem names come from Jason Yip&apos;s widely used catalogue of stand-up patterns and
        smells (martinfowler.com).
      </p>
    </StepLayout>
  );
}

/* 3 ─ Guide or myth? ----------------------------------------------------------------------------- */

export function Myths() {
  return (
    <StepLayout
      eyebrow="Checkpoint"
      title="Guide or myth?"
      stage={
        <div className="flex flex-1 flex-col justify-center">
          <SortCheckpoint
            id="daily-myths"
            prompt="Sort each statement about the Daily Scrum."
            categories={[
              { id: "guide", label: "The Scrum Guide says so" },
              { id: "myth", label: "Myth" },
            ]}
            items={[
              {
                id: "status",
                label: "It's a daily status report for the manager or Scrum Master",
                category: "myth",
                why: "It's “a 15-minute event for the Developers”, to replan towards the Sprint Goal.",
              },
              {
                id: "questions",
                label: "Everyone must answer three questions",
                category: "myth",
                why: "The Developers “can select whatever structure and techniques they want”. The questions were removed in 2020.",
              },
              {
                id: "po",
                label:
                  "The Product Owner and Scrum Master join as Developers only if they're working on Sprint Backlog items",
                category: "guide",
                why: "“If the Product Owner or Scrum Master are actively working on items in the Sprint Backlog, they participate as Developers.”",
              },
              {
                id: "solve",
                label: "Problems should be solved during the Daily Scrum",
                category: "myth",
                why: "Raise them; solve them afterwards with the right people. Developers “often meet throughout the day for more detailed discussions”.",
              },
              {
                id: "same",
                label: "Same time and place every working day",
                category: "guide",
                why: "“To reduce complexity, it is held at the same time and place every working day of the Sprint.”",
              },
              {
                id: "only",
                label: "It's the only time the plan can change",
                category: "myth",
                why: "“The Daily Scrum is not the only time Developers are allowed to adjust their plan.”",
              },
            ]}
          />
        </div>
      }
    >
      <p>
        Standing up isn&apos;t in the Scrum Guide at all. The &ldquo;stand-up&rdquo; comes from
        Extreme Programming, where &ldquo;Everyone stands up in a circle to avoid long
        discussions.&rdquo;
      </p>
    </StepLayout>
  );
}

/* 4 ─ Wrap ------------------------------------------------------------------------------------------- */

const TAKEAWAYS: [string, string][] = [
  ["For the Developers", "A replanning huddle, not a report to anyone."],
  ["About the goal", "Is the Sprint Goal still reachable? What's the plan for today?"],
  [
    "Headlines, then offline",
    "Raise problems in a sentence; solve them afterwards with the right people.",
  ],
  [
    "Look at the work",
    "Walking the board right to left shows what's stuck; round-robin reports hide it.",
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
        The Scrum Guide&apos;s promise: &ldquo;Daily Scrums improve communications, identify
        impediments, promote quick decision-making, and consequently eliminate the need for other
        meetings.&rdquo;
      </p>
      <p>Next: the two events at the end of every Sprint, the Review and the Retrospective.</p>
    </StepLayout>
  );
}
