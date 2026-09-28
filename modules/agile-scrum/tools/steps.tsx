"use client";

import { AnimatePresence, motion } from "motion/react";
import { useSceneState } from "@/lib/module-sdk";
import { StepLayout } from "@/toolkit/layout/step-layout";
import { SortCheckpoint } from "@/toolkit/checkpoints/sort";
import { Segmented } from "@/toolkit/controls/segmented";
import { Term } from "@/toolkit/glossary/term";
import { cn } from "@/lib/cn";
import { SLOTS, TOOLS, type Slot } from "./tools";
import type { ToolsState } from "./state";

/* 1 ─ Same trip, different app ------------------------------------------------------------------ */

const APPS: [string, string[]][] = [
  ["Railway's own site", ["PNR 482…", "Train 12627", "Coach S4", "Berth 23"]],
  ["A travel app", ["Booking ref 482…", "12627 Karnataka Exp", "S4", "Seat 23 (Lower)"]],
  ["A wallet app", ["Trip 482…", "Karnataka Express", "Sleeper · S4", "23 LB"]],
];

export function Tickets() {
  return (
    <StepLayout
      eyebrow="Analogy"
      title="Same trip, different app"
      stage={
        <div className="grid flex-1 content-center gap-3 sm:grid-cols-3">
          {APPS.map(([app, fields], i) => (
            <motion.div
              key={app}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 * i }}
              className="border-line bg-surface rounded-xl border p-3"
            >
              <p className="text-muted text-[10px] tracking-wide uppercase">{app}</p>
              <ul className="mt-2 flex flex-col gap-1">
                {fields.map((f, k) => (
                  <li
                    key={f}
                    className={cn(
                      "rounded-md px-2 py-1 text-xs",
                      ["bg-viz-data/15", "bg-viz-meta/15", "bg-viz-compute/15", "bg-accent-soft"][
                        k
                      ],
                    )}
                  >
                    {f}
                  </li>
                ))}
              </ul>
            </motion.div>
          ))}
          <p className="text-muted text-xs sm:col-span-3">
            Same colour, same idea: booking reference, train, coach, berth. Made-up ticket.
          </p>
        </div>
      }
    >
      <p>
        Book the same train journey through three different apps and each screen looks different.
        One says &ldquo;PNR&rdquo;, another &ldquo;booking ref&rdquo;; one shows &ldquo;Berth
        23&rdquo;, another &ldquo;23 LB&rdquo;. But underneath, it&apos;s the same trip.
      </p>
      <p>
        Agile tools are the same. Every one has a backlog, a board, a way to plan a Sprint and a way
        to estimate. They just name and arrange them differently. Learn the ideas once and any tool
        is easy.
      </p>
    </StepLayout>
  );
}

/* 2 ─ One board, six tools ⭐ (animated infographic) ------------------------------------------- */

function Label({
  slot,
  tool,
  active,
  onPick,
}: {
  slot: Slot;
  tool: string;
  active: boolean;
  onPick(): void;
}) {
  const t = TOOLS.find((x) => x.id === tool) ?? TOOLS[0];
  return (
    <button
      type="button"
      onClick={onPick}
      className={cn(
        "relative inline-flex max-w-full rounded-md border px-1.5 py-0.5 text-left text-[10px] leading-tight font-medium break-words",
        active ? "border-accent bg-accent text-accent-fg" : "border-accent/40 bg-accent-soft",
      )}
    >
      <AnimatePresence mode="wait" initial={false}>
        <motion.span
          key={tool}
          initial={{ opacity: 0, y: 4 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -4 }}
          transition={{ duration: 0.18 }}
        >
          {t.short?.[slot] ?? t.names[slot]}
        </motion.span>
      </AnimatePresence>
    </button>
  );
}

function Card({ w = "w-3/4" }: { w?: string }) {
  return (
    <div className="border-line bg-surface rounded-md border px-1.5 py-1.5">
      <div className={cn("bg-line-strong h-1.5 rounded-full", w)} />
    </div>
  );
}

export function Rosetta() {
  const [s, set] = useSceneState<ToolsState>();
  const tool = TOOLS.find((t) => t.id === s.tool) ?? TOOLS[0];
  const L = (slot: Slot) => (
    <Label slot={slot} tool={tool.id} active={s.slot === slot} onPick={() => set({ slot })} />
  );
  return (
    <StepLayout
      eyebrow="Animated infographic"
      title="One board, six tools"
      stage={
        <div className="flex flex-1 flex-col gap-3">
          <Segmented
            size="sm"
            value={tool.id}
            options={TOOLS.map((t) => [t.id, t.name] as [string, string])}
            onChange={(v) => set({ tool: v })}
          />
          <div className="border-line bg-surface-2 grid gap-2 rounded-xl border p-2 sm:grid-cols-[1fr_2fr]">
            <div className="flex flex-col gap-1.5">
              <div className="min-h-5">{L("backlog")}</div>
              <div className="flex flex-col gap-1">
                <div className="min-h-5">{L("grouping")}</div>
                <Card />
                <Card w="w-1/2" />
                <Card w="w-2/3" />
              </div>
            </div>
            <div className="flex flex-col gap-1.5">
              <div className="flex flex-wrap items-center gap-1.5">
                {L("sprint")}
                {L("board")}
              </div>
              <div className="grid grid-cols-3 gap-1">
                {["To do", "In progress", "Done"].map((c, i) => (
                  <div key={c} className="bg-surface/60 flex flex-col gap-1 rounded-md p-1">
                    <span className="text-muted text-[9px]">{c}</span>
                    {i === 0 && (
                      <div className="border-line bg-surface flex flex-col gap-1 rounded-md border p-1.5">
                        {L("item")}
                        <div className="flex">{L("estimate")}</div>
                      </div>
                    )}
                    {i === 1 && (
                      <div className="border-line bg-surface flex flex-col gap-1 rounded-md border p-1.5">
                        <div className="bg-line-strong h-1.5 w-3/4 rounded-full" />
                        <div className="flex">{L("breakdown")}</div>
                      </div>
                    )}
                    {i === 2 && <Card />}
                    <Card w={i === 2 ? "w-1/2" : "w-2/3"} />
                  </div>
                ))}
              </div>
              <div className="flex items-center gap-2">
                <svg viewBox="0 0 60 20" className="h-5 w-14 shrink-0" aria-hidden>
                  <path
                    d="M2 3 L20 7 L34 8 L46 14 L58 17"
                    fill="none"
                    className="stroke-accent"
                    strokeWidth={1.5}
                  />
                </svg>
                {L("chart")}
              </div>
            </div>
          </div>
          <div className="border-line bg-surface rounded-xl border px-3 py-2">
            <ul className="grid gap-x-4 gap-y-1 text-[11px] sm:grid-cols-2">
              {SLOTS.map(([slot, idea]) => (
                <li
                  key={slot}
                  className={cn(
                    "flex justify-between gap-2",
                    s.slot === slot && "text-accent font-semibold",
                  )}
                >
                  <span className="text-muted">{idea}</span>
                  <span className="text-right">{tool.names[slot]}</span>
                </li>
              ))}
            </ul>
            <AnimatePresence mode="wait">
              <motion.p
                key={tool.id}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="text-muted border-line mt-2 border-t pt-2 text-[11px]"
              >
                {tool.note}
              </motion.p>
            </AnimatePresence>
          </div>
        </div>
      }
    >
      <p>
        Here is one Scrum board: a <Term id="product-backlog">Product Backlog</Term> on the left,
        the current Sprint on the right, a card with an estimate, a card broken into smaller pieces,
        and a progress chart. Switch tools and watch the labels change.
      </p>
      <p>
        Tap any orange label to highlight its row. The ideas are identical; only the words move.
        GitHub and GitLab come from code hosting, so they lean on generic{" "}
        <Term id="work-item">work items</Term> and fields you configure yourself.
      </p>
      <p className="text-muted text-xs">
        Names from each vendor&apos;s documentation, September 2026. Tools rename things often.
      </p>
    </StepLayout>
  );
}

/* 3 ─ Configure or leave alone? ----------------------------------------------------------------- */

export function Configure() {
  return (
    <StepLayout
      eyebrow="Checkpoint"
      title="Configure or leave alone?"
      stage={
        <div className="flex flex-1 flex-col justify-center">
          <SortCheckpoint
            id="tool-config"
            prompt="A new team is setting up its tool. Which of these are worth configuring, and which are better left alone?"
            categories={[
              { id: "do", label: "Configure" },
              { id: "skip", label: "Leave alone" },
            ]}
            items={[
              {
                id: "columns",
                label: "Board columns that match how work really flows",
                category: "do",
                why: "The board should show reality. Atlassian's advice: “include only the statuses and transitions you need.”",
              },
              {
                id: "twelve",
                label: "A separate status for every approval and sub-step (twelve columns)",
                category: "skip",
                why: "Too many statuses hide the flow and slow everyone down. Start simple; add a column when the team needs it.",
              },
              {
                id: "dod",
                label: "The Definition of Done, visible where the team works",
                category: "do",
                why: "Keeping it in view makes “done” mean the same thing to everyone.",
              },
              {
                id: "mandatory",
                label: "Ten mandatory fields before a card can move",
                category: "skip",
                why: "Friction teaches people to avoid updating the board, so it stops reflecting reality.",
              },
              {
                id: "individual",
                label: "A velocity dashboard for each developer",
                category: "skip",
                why: "Velocity belongs to the team, and comparing people with it invites gaming.",
              },
            ]}
          />
        </div>
      }
    >
      <p>
        Tools can be configured endlessly, and it&apos;s tempting to encode every rule in them. But
        the tool should support how the team works, not dictate it.
      </p>
    </StepLayout>
  );
}

/* 4 ─ Wrap --------------------------------------------------------------------------------------- */

const TAKEAWAYS: [string, string][] = [
  ["Ideas first", "Backlog, Sprint, board, estimate, chart: every tool has them under some name."],
  ["Start simple", "Few statuses, few required fields. Add only what the team needs."],
  ["Mind the tiers", "Some Scrum features sit in paid plans (GitLab's iterations, for example)."],
  ["Expect renames", "Jira's issues became work items; GitHub retired classic Projects in 2024."],
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
        The Agile Manifesto&apos;s first value says it plainly: &ldquo;Individuals and interactions
        over processes and tools.&rdquo; A great tool can&apos;t fix a team that doesn&apos;t talk,
        and a plain whiteboard works for a team that does.
      </p>
      <p>Next: the anti-patterns that creep into agile teams, whatever tool they use.</p>
    </StepLayout>
  );
}
