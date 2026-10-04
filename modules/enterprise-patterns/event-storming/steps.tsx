"use client";

import { motion } from "motion/react";
import { RotateCcw } from "lucide-react";
import { useSceneState } from "@/lib/module-sdk";
import { StepLayout } from "@/toolkit/layout/step-layout";
import { SortCheckpoint } from "@/toolkit/checkpoints/sort";
import { Term } from "@/toolkit/glossary/term";
import { cn } from "@/lib/cn";
import { EVENTS, EXTRAS, LAYERS, type Layer } from "./model";
import type { EsState } from "./state";

const EVENT_CLS = "border-viz-compute bg-viz-compute/20";

/* 1 ─ A long wall and orange notes ---------------------------------------------------------------- */

const WALL = [
  "Order placed",
  "Payment taken",
  "Kitchen accepted",
  "Rider assigned",
  "Food picked up",
  "Order delivered",
];

export function LongWall() {
  return (
    <StepLayout
      eyebrow="Story"
      title="A long wall and orange notes"
      stage={
        <div className="flex flex-1 flex-col justify-center gap-3">
          <div className="border-line bg-surface-2 relative overflow-hidden rounded-xl border px-3 py-6">
            <div className="flex flex-wrap gap-2">
              {WALL.map((w, i) => (
                <motion.div
                  key={w}
                  initial={{ opacity: 0, y: -10, rotate: 0 }}
                  animate={{ opacity: 1, y: 0, rotate: i % 2 ? 2 : -2 }}
                  transition={{ delay: 0.15 * i }}
                  className={cn(
                    "w-24 rounded-sm border px-2 py-3 text-[11px] shadow-sm",
                    EVENT_CLS,
                  )}
                >
                  {w}
                </motion.div>
              ))}
            </div>
            <p className="text-muted mt-4 text-[10px]">← time →</p>
          </div>
          <p className="text-muted text-xs">
            Everything that happens, in the past tense, in order. A food-delivery example.
          </p>
        </div>
      }
    >
      <p>
        Put the people who ask questions (developers) and the people who know the answers (domain
        experts) in one room, with a long roll of paper on the wall and a stack of orange sticky
        notes. Ask everyone to write down things that happen in the business, in the past tense, and
        stick them on a timeline.
      </p>
      <p>
        That&apos;s <Term id="event-storming">EventStorming</Term>, created by Alberto Brandolini,
        who first wrote it up in November 2013 after experiments from 2012. He calls it &ldquo;a
        workshop format for quickly exploring complex business domains.&rdquo; Within an hour, the
        wall shows how the business really works, including the parts nobody agrees on.
      </p>
    </StepLayout>
  );
}

/* 2 ─ Storm a home loan ⭐ ------------------------------------------------------------------------ */

export function StormIt() {
  const [s, set] = useSceneState<EsState>();
  const placed = s.placed ?? 0;
  const layers = s.layers ?? [];
  const done = placed >= EVENTS.length;
  // A stable shuffle of the remaining events.
  const order = [3, 6, 0, 7, 2, 5, 1, 4];
  const pool = order.filter((i) => i >= placed);
  const pick = (i: number) => {
    if (i === placed) set({ placed: placed + 1, miss: "" });
    else set({ miss: `Can "${EVENTS[i]}" happen before "${EVENTS[placed]}"?` });
  };
  const toggle = (l: Layer) =>
    set({ layers: layers.includes(l) ? layers.filter((x) => x !== l) : [...layers, l] });
  return (
    <StepLayout
      eyebrow="Simulation"
      title="Storm a home loan"
      stage={
        <div className="flex flex-1 flex-col justify-center gap-3">
          {!done ? (
            <div className="flex flex-col gap-2">
              <p className="text-xs font-semibold">
                What happens next? Pick the event that comes after the last one.
              </p>
              <div className="flex flex-wrap gap-1.5">
                {pool.map((i) => (
                  <button
                    key={i}
                    type="button"
                    onClick={() => pick(i)}
                    className={cn(
                      "rounded-sm border px-2 py-1.5 text-left text-[11px] hover:brightness-110",
                      EVENT_CLS,
                    )}
                  >
                    {EVENTS[i]}
                  </button>
                ))}
              </div>
              {s.miss && <p className="text-bad text-xs">{s.miss}</p>}
            </div>
          ) : (
            <div className="flex flex-col gap-1.5">
              <p className="text-xs font-semibold">Now add the other stickies:</p>
              <div className="flex flex-wrap gap-1">
                {(Object.keys(LAYERS) as Layer[]).map((l) => (
                  <button
                    key={l}
                    type="button"
                    aria-pressed={layers.includes(l)}
                    onClick={() => toggle(l)}
                    className={cn(
                      "rounded-sm border px-2 py-1 text-[11px]",
                      layers.includes(l) ? LAYERS[l].cls : "border-line hover:bg-surface-2",
                    )}
                  >
                    {LAYERS[l].name}
                  </button>
                ))}
              </div>
            </div>
          )}
          <div className="flex flex-col gap-1">
            {EVENTS.slice(0, placed).map((e, i) => (
              <motion.div
                key={e}
                initial={{ opacity: 0, x: -6 }}
                animate={{ opacity: 1, x: 0 }}
                className="flex flex-wrap items-center gap-1.5"
              >
                <span className="text-subtle w-4 font-mono text-[10px]">{i + 1}</span>
                <span
                  className={cn("rounded-sm border px-2 py-1 text-[11px] font-medium", EVENT_CLS)}
                >
                  {e}
                </span>
                {EXTRAS.filter((x) => x.at === i && layers.includes(x.layer)).map((x) => (
                  <motion.span
                    key={x.text}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className={cn(
                      "rounded-sm border px-1.5 py-0.5 text-[10px]",
                      LAYERS[x.layer].cls,
                      x.layer === "actor" && "rounded-full",
                    )}
                  >
                    {x.layer === "hotspot" ? `! ${x.text}` : x.text}
                  </motion.span>
                ))}
              </motion.div>
            ))}
          </div>
          {placed > 0 && (
            <button
              type="button"
              onClick={() => set({ placed: 0, layers: [], miss: "" })}
              className="text-muted flex items-center gap-1 self-end text-xs"
            >
              <RotateCcw className="size-3" /> Start again
            </button>
          )}
        </div>
      }
    >
      <p>
        A bank wants to understand its home-loan process. First build the timeline of{" "}
        <Term id="domain-event">domain events</Term>, then add the other kinds of sticky: who
        triggers things, which systems are involved, the automatic rules, and the problems people
        raise.
      </p>
      <p>
        The magenta notes are <Term id="hot-spot">hot spots</Term>: questions, disagreements and
        pain. In a real session they&apos;re often the most valuable thing on the wall. A{" "}
        <Term id="es-policy">policy</Term> is a rule of the form &ldquo;whenever this happens, do
        that&rdquo;.
      </p>
    </StepLayout>
  );
}

/* 3 ─ The colour code ----------------------------------------------------------------------------- */

const LEGEND: [string, string, string][] = [
  ["Domain event", "orange", "Something that happened, past tense: “Offer accepted”."],
  ["Command", "blue", "A decision or request that causes an event: “Approve loan”."],
  ["Actor", "small yellow", "A person or role who issues a command."],
  ["Policy", "lilac", "Automatic reaction: “whenever X, then Y”."],
  ["External system", "large pink", "Something outside the team's control."],
  ["Read model", "green", "Information someone needs to make a decision."],
  ["Hot spot", "magenta", "A question, conflict or problem to come back to."],
];

const LEGEND_CLS: Record<string, string> = {
  orange: EVENT_CLS,
  blue: LAYERS.command.cls,
  "small yellow": LAYERS.actor.cls,
  lilac: LAYERS.policy.cls,
  "large pink": LAYERS.external.cls,
  green: LAYERS.read.cls,
  magenta: LAYERS.hotspot.cls,
};

export function Legend() {
  return (
    <StepLayout
      eyebrow="Explore"
      title="The colour code"
      stage={
        <div className="flex flex-1 flex-col justify-center gap-1.5">
          {LEGEND.map(([t, colour, d], i) => (
            <motion.div
              key={t}
              initial={{ opacity: 0, x: -6 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.05 * i }}
              className="grid grid-cols-[2.5rem_1fr] items-center gap-3"
            >
              <span className={cn("h-7 rounded-sm border", LEGEND_CLS[colour])} />
              <div>
                <p className="text-sm font-semibold">
                  {t} <span className="text-muted text-[11px] font-normal">({colour})</span>
                </p>
                <p className="text-muted text-xs">{d}</p>
              </div>
            </motion.div>
          ))}
          <p className="text-subtle mt-1 text-[10px]">
            Colours shown as closely as this site&apos;s palette allows.
          </p>
        </div>
      }
    >
      <p>
        Brandolini&apos;s notation, as described in his book (still being written on Leanpub). The
        colours are a convention, born, he says, from whatever sticky notes were available; teams
        adapt them.
      </p>
      <p>
        Every event has a cause: a person issuing a command, an external system, time passing
        (&ldquo;Payment terms expired&rdquo;), or a policy reacting to another event. Asking
        &ldquo;what caused this?&rdquo; for each orange note is how the wall fills up.
      </p>
    </StepLayout>
  );
}

/* 4 ─ Three formats ------------------------------------------------------------------------------- */

const FORMATS: [string, string, string][] = [
  [
    "Big Picture",
    "15–30 people",
    "A large-scale workshop to discover the intricacies of an entire business line. Finds the hot spots and natural boundaries.",
  ],
  [
    "Process Modelling",
    "a smaller team",
    "Targets one end-to-end process, including its variations. Every path completed, every hot spot addressed.",
  ],
  [
    "Software Design",
    "the people building it",
    "Originally for discovering aggregates; now used to find boundaries and design loosely coupled systems.",
  ],
];

export function Formats() {
  return (
    <StepLayout
      eyebrow="Explore"
      title="Three formats"
      stage={
        <div className="flex flex-1 flex-col justify-center gap-2">
          {FORMATS.map(([t, who, d], i) => (
            <motion.div
              key={t}
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.08 * i }}
              className="border-line bg-surface rounded-lg border px-3 py-2"
            >
              <div className="flex items-baseline justify-between gap-2">
                <p className="text-sm font-semibold">{t}</p>
                <p className="text-accent text-[11px]">{who}</p>
              </div>
              <p className="text-muted text-xs">{d}</p>
            </motion.div>
          ))}
        </div>
      }
    >
      <p>
        EventStorming grew into three main flavours. A common path: run a Big Picture session to
        find the area that most needs improving, then drill into it with Process Modelling.
      </p>
      <p>
        Boundaries show up on the wall by themselves: places where the vocabulary changes, where a
        different group of people takes over, or where one key event hands work from one part of the
        business to the next. Those are candidate bounded contexts from module 4.
      </p>
    </StepLayout>
  );
}

/* 5 ─ Which sticky? ------------------------------------------------------------------------------- */

export function WhichSticky() {
  return (
    <StepLayout
      eyebrow="Checkpoint"
      title="Which sticky?"
      stage={
        <div className="flex flex-1 flex-col justify-center">
          <SortCheckpoint
            id="which-sticky"
            prompt="What kind of sticky note is each one?"
            categories={[
              { id: "event", label: "Domain event" },
              { id: "command", label: "Command" },
              { id: "policy", label: "Policy" },
              { id: "hot", label: "Hot spot" },
            ]}
            items={[
              {
                id: "paid",
                label: "Payment received",
                category: "event",
                why: "Something that happened, past tense.",
              },
              {
                id: "reserved",
                label: "Seat reserved",
                category: "event",
                why: "Past tense, meaningful to the business.",
              },
              {
                id: "cancel",
                label: "Cancel booking",
                category: "command",
                why: "A request someone makes.",
              },
              {
                id: "suspend",
                label: "Whenever a payment fails three times, suspend the account",
                category: "policy",
                why: "An automatic reaction to an event.",
              },
              {
                id: "refunds",
                label: "Nobody knows who approves refunds over ₹50,000",
                category: "hot",
                why: "A question to resolve: mark it and move on.",
              },
            ]}
            explanation="Events are past tense; commands are requests; policies say 'whenever X, then Y'; hot spots mark questions and problems."
          />
        </div>
      }
    >
      <p>Sort the stickies.</p>
    </StepLayout>
  );
}

/* 6 ─ Wrap ---------------------------------------------------------------------------------------- */

const POINTS: [string, string][] = [
  ["Everyone in one room", "Developers and domain experts, one long wall."],
  ["Past-tense events first", "Then their causes: commands, systems, time, policies."],
  ["Hot spots are gold", "Questions and conflicts are what you came to find."],
  ["Boundaries emerge", "Where words, people or key events change."],
  ["Three formats", "Big Picture, Process Modelling, Software Design."],
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
        That closes the chapter on domains. You can find boundaries and model inside them. Next
        chapter: how separate systems actually talk to each other.
      </p>
    </StepLayout>
  );
}
