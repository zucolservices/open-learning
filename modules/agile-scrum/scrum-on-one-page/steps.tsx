"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { Pause, Play } from "lucide-react";
import { useSceneState } from "@/lib/module-sdk";
import { StepLayout } from "@/toolkit/layout/step-layout";
import { ChoiceCheckpoint } from "@/toolkit/checkpoints/choice";
import { SortCheckpoint } from "@/toolkit/checkpoints/sort";
import { Segmented } from "@/toolkit/controls/segmented";
import { Term } from "@/toolkit/glossary/term";
import { cn } from "@/lib/cn";
import { ScrumGuideCredit } from "../_shared/scrum-guide-credit";
import { ScrumMap } from "./scrum-map";
import { TOUR, byId } from "./parts";
import type { ScrumPageState } from "./state";

/* 1 ─ A relay, or a rugby team? ------------------------------------------------------------------- */

export function Relay() {
  const [s, set] = useSceneState<ScrumPageState>();
  const rugby = s.team === "rugby";
  return (
    <StepLayout
      eyebrow="Analogy"
      title="A relay, or a rugby team?"
      stage={
        <div className="flex flex-1 flex-col gap-3">
          <Segmented
            size="sm"
            value={s.team}
            options={[
              ["relay", "Relay race: hand over and stop"],
              ["rugby", "Rugby team: move together"],
            ]}
            onChange={(v) => set({ team: v })}
          />
          <div className="border-line bg-surface rounded-xl border p-3">
            <svg
              viewBox="0 0 340 140"
              className="w-full"
              role="img"
              aria-label={rugby ? "A team moving together" : "Runners handing over a baton"}
            >
              <line x1={10} y1={120} x2={330} y2={120} className="stroke-line-strong" />
              {[0, 1, 2, 3].map((i) => {
                const label = ["Analyse", "Design", "Build", "Test"][i];
                return rugby ? (
                  <motion.g
                    key={`r${i}`}
                    initial={{ x: 0 }}
                    animate={{ x: [0, 230] }}
                    transition={{
                      duration: 3.2,
                      repeat: Infinity,
                      repeatDelay: 0.6,
                      ease: "easeInOut",
                    }}
                  >
                    <circle
                      cx={30 + (i % 2) * 22}
                      cy={62 + Math.floor(i / 2) * 26}
                      r={9}
                      className="fill-accent/25 stroke-accent"
                    />
                    <text
                      x={30 + (i % 2) * 22}
                      y={62 + Math.floor(i / 2) * 26 + 3}
                      textAnchor="middle"
                      className="fill-fg text-[7px]"
                    >
                      {label[0]}
                    </text>
                  </motion.g>
                ) : (
                  <g key={`l${i}`}>
                    <motion.circle
                      cx={45 + i * 80}
                      cy={80}
                      r={11}
                      className="fill-viz-idle/20 stroke-viz-idle"
                      animate={{ opacity: [0.35, 1, 1, 0.35] }}
                      transition={{
                        duration: 4,
                        repeat: Infinity,
                        delay: i * 1,
                        times: [0, 0.05, 0.25, 0.3],
                      }}
                    />
                    <text
                      x={45 + i * 80}
                      y={104}
                      textAnchor="middle"
                      className="fill-muted text-[8px]"
                    >
                      {label}
                    </text>
                  </g>
                );
              })}
              {rugby ? (
                <motion.g
                  initial={{ x: 0 }}
                  animate={{ x: [0, 230] }}
                  transition={{
                    duration: 3.2,
                    repeat: Infinity,
                    repeatDelay: 0.6,
                    ease: "easeInOut",
                  }}
                >
                  <motion.circle
                    r={3.5}
                    cy={75}
                    className="fill-viz-compute"
                    animate={{ cx: [30, 52, 30, 52, 30] }}
                    transition={{ duration: 3.2, repeat: Infinity, repeatDelay: 0.6 }}
                  />
                </motion.g>
              ) : (
                <motion.rect
                  width={10}
                  height={4}
                  rx={2}
                  y={78}
                  className="fill-viz-compute"
                  animate={{ x: [40, 120, 200, 280] }}
                  transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
                />
              )}
            </svg>
          </div>
          <p className="border-line bg-surface-2 rounded-xl border px-3 py-2 text-sm">
            {rugby
              ? "Everyone moves up the field together, passing the ball back and forth. Analysts, designers, builders and testers work side by side through the whole journey."
              : "Each specialist runs their leg, hands the baton on, and stops. Nobody sees the whole race, and a dropped baton is found late."}
          </p>
        </div>
      }
    >
      <p>
        In 1986, Hirotaka Takeuchi and Ikujiro Nonaka studied how firms like Honda and Canon built
        new products. The slow ones worked like a relay. The fast ones worked like a rugby team.
      </p>
      <p>
        They wrote that &ldquo;a holistic or &lsquo;rugby&rsquo; approach—where a team tries to go
        the distance as a unit, passing the ball back and forth—may better serve today&apos;s
        competitive requirements.&rdquo;
      </p>
      <p className="text-muted text-sm">
        Jeff Sutherland borrowed the name for software in 1993, and he and Ken Schwaber presented
        Scrum publicly in 1995.
      </p>
    </StepLayout>
  );
}

/* 2 ─ Scrum on one page ⭐ ------------------------------------------------------------------------ */

const KIND_LABEL = {
  accountability: "Accountability",
  event: "Event",
  artifact: "Artifact",
} as const;

export function OnePage() {
  const [s, set] = useSceneState<ScrumPageState>();
  const [playing, setPlaying] = useState(false);
  useEffect(() => {
    if (!playing) return;
    const id = setInterval(() => {
      const i = TOUR.indexOf(s.part ?? "");
      set({ part: TOUR[(i + 1) % TOUR.length] });
    }, 2600);
    return () => clearInterval(id);
  }, [playing, s.part, set]);
  const part = s.part ? byId[s.part] : null;
  return (
    <StepLayout
      eyebrow="Animated infographic"
      title="Scrum on one page"
      stage={
        <div className="flex flex-1 flex-col gap-3">
          <div className="flex flex-wrap items-center gap-2">
            <button
              type="button"
              onClick={() => {
                if (!playing && !s.part) set({ part: TOUR[0] });
                setPlaying(!playing);
              }}
              className="bg-accent text-accent-fg flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-medium"
            >
              {playing ? <Pause className="size-3.5" /> : <Play className="size-3.5" />}
              {playing ? "Pause" : "Follow one Sprint"}
            </button>
            <span className="text-muted text-xs">or click any part</span>
          </div>
          <div className="border-line bg-surface rounded-xl border p-2">
            <ScrumMap
              active={s.part}
              onSelect={(id) => {
                setPlaying(false);
                set({ part: s.part === id ? null : id });
              }}
            />
          </div>
          <AnimatePresence mode="wait">
            {part ? (
              <motion.div
                key={part.id}
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className="border-accent/40 bg-accent-soft rounded-xl border px-4 py-3"
              >
                <p className="text-muted text-[10px] tracking-wide uppercase">
                  {KIND_LABEL[part.kind]}
                </p>
                <p className="font-semibold">{part.name}</p>
                <p className="mt-1 text-sm">&ldquo;{part.purpose}&rdquo;</p>
                <p className="text-muted mt-2 text-xs">
                  <span className="text-fg font-medium">When: </span>
                  {part.when}
                </p>
                <p className="text-muted mt-1 text-xs">{part.note}</p>
              </motion.div>
            ) : (
              <motion.p
                key="none"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-muted text-sm"
              >
                Three accountabilities (people), five events (the Sprint and four inside it) and
                three artifacts (with a commitment each). That&apos;s all of Scrum.
              </motion.p>
            )}
          </AnimatePresence>
          <ScrumGuideCredit adapted />
        </div>
      }
    >
      <p>
        The <Term id="scrum">Scrum</Term> Guide calls it &ldquo;a lightweight framework that helps
        people, teams and organizations generate value through adaptive solutions for complex
        problems.&rdquo;
      </p>
      <p>
        It has three kinds of parts: <Term id="accountability">accountabilities</Term> (who), events
        (when the team inspects and adapts), and <Term id="scrum-artifact">artifacts</Term> (what
        everyone can see).
      </p>
      <p className="text-muted text-sm">
        Press play to follow one <Term id="sprint">Sprint</Term>, or click around. The next modules
        go into each part.
      </p>
    </StepLayout>
  );
}

/* 3 ─ In the guide, or added on? ------------------------------------------------------------------ */

export function GuideOrAddOn() {
  return (
    <StepLayout
      eyebrow="Checkpoint"
      title="In the guide, or added on?"
      stage={
        <div className="flex flex-1 flex-col justify-center">
          <SortCheckpoint
            id="guide-or-addon"
            prompt="Which of these are part of Scrum as the 2020 Scrum Guide defines it, and which are common add-ons?"
            categories={[
              { id: "guide", label: "In the Scrum Guide" },
              { id: "addon", label: "Common add-on" },
            ]}
            items={[
              {
                id: "goal",
                label: "A Sprint Goal",
                category: "guide",
                why: "The Sprint Backlog's commitment: “the single objective for the Sprint”.",
              },
              {
                id: "points",
                label: "Story points and velocity",
                category: "addon",
                why: "Widely used for forecasting, but the guide never mentions them.",
              },
              {
                id: "dod",
                label: "A Definition of Done",
                category: "guide",
                why: "The Increment's commitment: the quality bar every Increment meets.",
              },
              {
                id: "stories",
                label: "User stories",
                category: "addon",
                why: "A popular way to write backlog items (next chapter), not part of Scrum itself.",
              },
              {
                id: "twoweeks",
                label: "Two-week Sprints",
                category: "addon",
                why: "A common choice. The guide only says one month or less.",
              },
              {
                id: "retro",
                label: "A Retrospective every Sprint",
                category: "guide",
                why: "One of the five events; it concludes each Sprint.",
              },
            ]}
          />
        </div>
      }
    >
      <p>
        The guide calls Scrum &ldquo;purposefully incomplete&rdquo;: teams add practices that suit
        them. That&apos;s fine, as long as everyone knows which parts are Scrum and which are
        choices they can change.
      </p>
    </StepLayout>
  );
}

/* 4 ─ How long is Sprint Planning? ---------------------------------------------------------------- */

export function Timebox() {
  return (
    <StepLayout
      eyebrow="Checkpoint"
      title="How long is Sprint Planning?"
      stage={
        <div className="flex flex-1 flex-col justify-center">
          <ChoiceCheckpoint
            id="timebox"
            prompt="A team runs two-week Sprints. What does the Scrum Guide say about how long their Sprint Planning can be?"
            options={[
              {
                id: "max",
                label:
                  "At most 8 hours for a one-month Sprint, and usually shorter for shorter Sprints",
                correct: true,
                feedback:
                  "Right. The guide sets a maximum (a timebox), not a formula. Many two-week teams plan in about half that, but that's a rule of thumb.",
              },
              {
                id: "four",
                label: "Exactly 4 hours",
                feedback:
                  "A common rule of thumb (half of 8 hours for half a month), but the guide doesn't say it.",
              },
              {
                id: "fifteen",
                label: "15 minutes",
                feedback: "That's the Daily Scrum's timebox.",
              },
              {
                id: "none",
                label: "There's no limit; plan until everything is clear",
                feedback:
                  "Every Scrum event is timeboxed. Planning until everything is clear would defeat the point of learning as you go.",
              },
            ]}
            explanation="A timebox is a maximum, not a target. Ending early is fine once the event's purpose is met."
          />
        </div>
      }
    >
      <p>
        Every Scrum event has a <Term id="timebox">timebox</Term>: a fixed maximum length.
      </p>
    </StepLayout>
  );
}

/* 5 ─ Wrap ----------------------------------------------------------------------------------------- */

const VALUES = ["Commitment", "Focus", "Openness", "Respect", "Courage"];

export function Wrap() {
  return (
    <StepLayout
      eyebrow="Wrap-up"
      title="What to remember"
      stage={
        <div className="flex flex-1 flex-col justify-center gap-3">
          <div className="grid gap-3 sm:grid-cols-3">
            {[
              [
                "3 accountabilities",
                "Product Owner, Scrum Master, Developers. One team of typically 10 or fewer.",
              ],
              [
                "5 events",
                "The Sprint, containing Planning, Daily Scrum, Review and Retrospective.",
              ],
              [
                "3 artifacts",
                "Product Backlog, Sprint Backlog, Increment, each with a commitment.",
              ],
            ].map(([t, d], i) => (
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
          <div className="border-line bg-surface rounded-xl border px-4 py-3">
            <p className="text-muted text-xs">
              &ldquo;Successful use of Scrum depends on people becoming more proficient in living
              five values&rdquo;:
            </p>
            <div className="mt-2 flex flex-wrap gap-1.5">
              {VALUES.map((v) => (
                <span key={v} className={cn("bg-accent-soft rounded-full px-2.5 py-0.5 text-xs")}>
                  {v}
                </span>
              ))}
            </div>
          </div>
          <ScrumGuideCredit />
        </div>
      }
    >
      <p>
        The guide is short, free, and worth reading in full. Its authors add that implementing only
        parts of Scrum is possible, but &ldquo;the result is not Scrum.&rdquo;
      </p>
      <p>Next: who decides what, in real situations.</p>
    </StepLayout>
  );
}
