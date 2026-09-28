"use client";

import { useMemo } from "react";
import { motion } from "motion/react";
import { Check } from "lucide-react";
import { useSceneState } from "@/lib/module-sdk";
import { StepLayout } from "@/toolkit/layout/step-layout";
import { PredictCheckpoint } from "@/toolkit/checkpoints/predict";
import { SortCheckpoint } from "@/toolkit/checkpoints/sort";
import { Term } from "@/toolkit/glossary/term";
import { cn } from "@/lib/cn";
import { ScrumGuideCredit } from "../_shared/scrum-guide-credit";
import { ALL, CAPACITY, ITEMS, SPRINTS, simulate, type SprintResult } from "./model";
import type { DoneState } from "./state";

/* 1 ─ Clean as you go -------------------------------------------------------------------------- */

const DAYS = ["Mon", "Tue", "Wed", "Thu", "Fri"];
const PILE = [2, 5, 8, 11, 14];
const LEAVE_MIN = [20, 23, 27, 32, 38];

function Kitchen({ title, pile, mins }: { title: string; pile: number[]; mins: number[] }) {
  return (
    <div className="border-line bg-surface rounded-xl border p-3">
      <p className="text-sm font-semibold">{title}</p>
      <div className="mt-2 grid grid-cols-5 gap-1.5">
        {DAYS.map((d, i) => (
          <div key={d} className="flex flex-col items-center gap-1">
            <div className="flex h-24 w-full flex-col-reverse items-center gap-[2px]">
              {pile[i] === 0 && (
                <span className="text-good flex items-center gap-0.5 text-[10px]">
                  <Check className="size-3" /> sink clear
                </span>
              )}
              {Array.from({ length: pile[i] }, (_, k) => (
                <motion.span
                  key={k}
                  initial={{ opacity: 0, y: -6 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.15 * i + 0.02 * k }}
                  className="bg-viz-idle/70 h-1 w-8 rounded-full"
                />
              ))}
            </div>
            <span className="text-muted text-[10px]">{d}</span>
            <span className="text-[11px] font-medium tabular-nums">{mins[i]} min</span>
          </div>
        ))}
      </div>
    </div>
  );
}

export function Dishes() {
  return (
    <StepLayout
      eyebrow="Analogy"
      title="Clean as you go"
      stage={
        <div className="flex flex-1 flex-col justify-center gap-3">
          <Kitchen title="Leave the dishes for later" pile={PILE} mins={LEAVE_MIN} />
          <Kitchen title="Clean as you go" pile={[0, 0, 0, 0, 0]} mins={[25, 25, 25, 25, 25]} />
          <p className="text-muted text-xs">
            Stacks show dirty dishes left in the sink; the number is how long dinner took. Made-up
            figures.
          </p>
        </div>
      }
    >
      <p>
        Two cooks make dinner every night. One washes up while cooking; the other leaves the dishes
        for &ldquo;later&rdquo;. On Monday the second cook is faster. By Friday they&apos;re hunting
        for a clean pan, scrubbing one before every step, and dinner takes much longer.
      </p>
      <p>
        Software works the same way. Skipped tests, unreviewed code and &ldquo;we&apos;ll tidy it
        later&rdquo; are dirty dishes. The team&apos;s{" "}
        <Term id="definition-of-done">Definition of Done</Term> decides whether the washing-up is
        part of cooking.
      </p>
    </StepLayout>
  );
}

/* 2 ─ Guess first --------------------------------------------------------------------------------- */

const SHORTCUT = simulate([]);
const THOROUGH = simulate(ALL);
const r = (n: number) => Math.round(n);

export function DebtGuess() {
  return (
    <StepLayout
      eyebrow="Checkpoint"
      title="Guess first"
      stage={
        <div className="flex flex-1 flex-col justify-center">
          <PredictCheckpoint
            id="debt-guess"
            prompt={`Team Shortcut counts work as done once the code is written. In Sprint 1 it delivers ${r(SHORTCUT[0].delivered)} points of features. Team Thorough, with a full Definition of Done, delivers ${r(THOROUGH[0].delivered)}. Same people, same capacity. By Sprint 12, how many points a Sprint is Team Shortcut delivering?`}
            min={0}
            max={50}
            step={1}
            unit=" points"
            answer={r(SHORTCUT[SPRINTS - 1].delivered)}
            tolerance={4}
            explanation={`In this model, about ${r(SHORTCUT[SPRINTS - 1].delivered)}: well below Team Thorough's steady ${r(THOROUGH[0].delivered)}. Every skipped step leaves undone work, and the undone work slows every Sprint after it. Next, run it yourself.`}
          />
        </div>
      }
    >
      <p>
        A <Term id="story-points">point</Term> here is just a unit of work. Both teams have the same{" "}
        {CAPACITY} points of effort each Sprint; the only difference is what &ldquo;done&rdquo;
        means.
      </p>
      <p>Make a guess before you see the model.</p>
    </StepLayout>
  );
}

/* 3 ─ Twelve Sprints ⭐ (simulation) ------------------------------------------------------------- */

const W = 400;
const H = 200;
const L = 30;
const R = 390;
const T = 12;
const B = 172;
const MAXY = 45;
const sx = (i: number) => L + (i / (SPRINTS - 1)) * (R - L);
const sy = (v: number) => B - (v / MAXY) * (B - T);
const path = (rs: SprintResult[]) =>
  rs.map((x, i) => `${i ? "L" : "M"}${sx(i).toFixed(1)},${sy(x.delivered).toFixed(1)}`).join("");
const total = (rs: SprintResult[]) => rs.reduce((a, x) => a + x.delivered, 0);

export function TwelveSprints() {
  const [s, set] = useSceneState<DoneState>();
  const full = s.dod.length === ALL.length;
  const fixAt = s.fix && !full ? 6 : null;
  const mine = useMemo(() => simulate(s.dod, fixAt), [s.dod, fixAt]);
  const last = mine[SPRINTS - 1];
  const toggle = (id: string) =>
    set({ dod: s.dod.includes(id) ? s.dod.filter((x) => x !== id) : [...s.dod, id] });
  return (
    <StepLayout
      eyebrow="Simulation"
      title="Twelve Sprints"
      stage={
        <div className="flex flex-1 flex-col gap-3">
          <div>
            <p className="text-muted mb-1.5 text-xs">Your Definition of Done: “written” plus…</p>
            <div className="grid gap-1.5 sm:grid-cols-2">
              {ITEMS.map((it) => {
                const on = s.dod.includes(it.id);
                return (
                  <button
                    key={it.id}
                    type="button"
                    role="checkbox"
                    aria-checked={on}
                    onClick={() => toggle(it.id)}
                    className={cn(
                      "flex items-center gap-2 rounded-lg border px-2.5 py-1.5 text-left text-xs",
                      on
                        ? "border-accent bg-accent-soft"
                        : "border-line bg-surface hover:bg-surface-2",
                    )}
                  >
                    <span
                      className={cn(
                        "grid size-4 shrink-0 place-items-center rounded border",
                        on ? "border-accent bg-accent text-accent-fg" : "border-line-strong",
                      )}
                    >
                      {on && <Check className="size-3" />}
                    </span>
                    {it.label}
                  </button>
                );
              })}
            </div>
          </div>
          <svg
            viewBox={`0 0 ${W} ${H}`}
            className="max-h-72 w-full"
            role="img"
            aria-label="Points delivered per Sprint"
          >
            {[0, 10, 20, 30, 40].map((v) => (
              <g key={v}>
                <line
                  x1={L}
                  x2={R}
                  y1={sy(v)}
                  y2={sy(v)}
                  className="stroke-line"
                  strokeDasharray="2 3"
                />
                <text x={L - 5} y={sy(v) + 3} textAnchor="end" className="fill-muted text-[8px]">
                  {v}
                </text>
              </g>
            ))}
            {Array.from({ length: SPRINTS }, (_, i) => (
              <text
                key={i}
                x={sx(i)}
                y={B + 12}
                textAnchor="middle"
                className="fill-muted text-[8px]"
              >
                {i + 1}
              </text>
            ))}
            <text x={(L + R) / 2} y={B + 25} textAnchor="middle" className="fill-muted text-[8px]">
              Sprint
            </text>
            <path
              d={path(SHORTCUT)}
              fill="none"
              className="stroke-muted"
              strokeWidth={1.5}
              strokeDasharray="4 3"
            />
            <path
              d={path(THOROUGH)}
              fill="none"
              className="stroke-good"
              strokeWidth={1.5}
              strokeDasharray="4 3"
            />
            <motion.path
              initial={false}
              animate={{ d: path(mine) }}
              fill="none"
              className="stroke-accent"
              strokeWidth={2.5}
            />
            {fixAt !== null && (
              <g>
                <line x1={sx(fixAt)} x2={sx(fixAt)} y1={T} y2={B} className="stroke-line-strong" />
                <text x={sx(fixAt) + 3} y={T + 8} className="fill-muted text-[8px]">
                  fix starts
                </text>
              </g>
            )}
          </svg>
          <div className="text-muted flex flex-wrap gap-x-4 gap-y-1 text-[11px]">
            <span className="flex items-center gap-1.5">
              <span className="bg-accent h-0.5 w-4" /> Your DoD
            </span>
            <span className="flex items-center gap-1.5">
              <span className="border-muted w-4 border-t border-dashed" /> “Code written” only
            </span>
            <span className="flex items-center gap-1.5">
              <span className="border-good w-4 border-t border-dashed" /> Full DoD
            </span>
          </div>
          <div className="grid grid-cols-3 gap-2 text-center">
            {[
              ["Sprint 12", `${r(last.delivered)} pts`, ""],
              ["Total, 12 Sprints", `${r(total(mine))} pts`, ""],
              ["Undone work left", `${r(last.debt)} pts`, last.debt > 1 ? "text-bad" : "text-good"],
            ].map(([k, v, c]) => (
              <div key={k} className="border-line bg-surface rounded-lg border px-2 py-1.5">
                <p className="text-muted text-[10px]">{k}</p>
                <p className={cn("text-sm font-semibold tabular-nums", c)}>{v}</p>
              </div>
            ))}
          </div>
          <label className={cn("flex items-center gap-2 text-xs", full && "text-muted opacity-60")}>
            <input
              type="checkbox"
              checked={s.fix && !full}
              disabled={full}
              onChange={(e) => set({ fix: e.target.checked })}
            />
            At the Sprint 6 Retrospective, adopt the full DoD and spend 30% of capacity paying back
          </label>
        </div>
      }
    >
      <p>
        Tick the steps your team counts as part of &ldquo;done&rdquo;. Each one costs a little
        effort now. Each one you skip leaves undone work behind, and that undone work, called{" "}
        <Term id="technical-debt">technical debt</Term>, slows every later Sprint: bugs to chase,
        code that&apos;s hard to change, manual checks before every release.
      </p>
      <p>
        Watch the totals. Skipping steps wins for a few Sprints, then loses. Then try the fix at
        Sprint 6: paying back is slow, because the debt has grown.
      </p>
      <p className="text-muted text-xs">
        A toy model with made-up rates. Martin Fowler notes that the real costs can&apos;t be
        measured objectively; the shape is the lesson.
      </p>
    </StepLayout>
  );
}

/* 4 ─ Not all debt is reckless -------------------------------------------------------------------- */

const QUADS: [string, string, string][] = [
  [
    "Reckless and deliberate",
    "“We don't have time for design”",
    "Cutting corners knowingly, with no plan to pay back.",
  ],
  [
    "Prudent and deliberate",
    "“We must ship now and deal with consequences”",
    "A conscious trade for a real deadline, visible and planned for repayment.",
  ],
  [
    "Reckless and inadvertent",
    "“What's Layering?”",
    "The team doesn't know good practice, so debt piles up unnoticed.",
  ],
  [
    "Prudent and inadvertent",
    "“Now we know how we should have done it”",
    "Even good teams learn a better design only after building. Normal and healthy to fix.",
  ],
];

export function DebtQuadrant() {
  const [s, set] = useSceneState<DoneState>();
  return (
    <StepLayout
      eyebrow="Explore"
      title="Not all debt is reckless"
      stage={
        <div className="flex flex-1 flex-col justify-center gap-3">
          <div className="text-muted grid grid-cols-2 text-center text-[10px] tracking-wide uppercase">
            <span>Reckless</span>
            <span>Prudent</span>
          </div>
          <div className="grid grid-cols-2 gap-2">
            {QUADS.map(([t, q, d], i) => (
              <button
                key={t}
                type="button"
                aria-pressed={s.quad === i}
                onClick={() => set({ quad: i })}
                className={cn(
                  "min-h-28 rounded-xl border p-3 text-left",
                  s.quad === i
                    ? "border-accent bg-accent-soft"
                    : "border-line bg-surface hover:bg-surface-2",
                )}
              >
                <p className="text-muted text-[10px] tracking-wide uppercase">{t}</p>
                <p className="mt-1 text-sm font-semibold">{q}</p>
                {s.quad === i && (
                  <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="text-muted mt-1 text-xs"
                  >
                    {d}
                  </motion.p>
                )}
              </button>
            ))}
          </div>
          <p className="text-muted text-center text-[10px]">
            Top row: deliberate · Bottom row: inadvertent. After Martin Fowler&apos;s Technical Debt
            Quadrant (2009).
          </p>
        </div>
      }
    >
      <p>
        Ward Cunningham introduced the debt metaphor in 1992: &ldquo;A little debt speeds
        development so long as it is paid back promptly with a rewrite… The danger occurs when the
        debt is not repaid.&rdquo;
      </p>
      <p>
        So debt isn&apos;t always a mistake. Martin Fowler sorts it by two questions: was it taken
        on deliberately, and was it prudent? Tap each quadrant.
      </p>
      <p className="text-muted text-sm">
        Cunningham later stressed he was &ldquo;never in favor of writing code poorly&rdquo;. His
        debt was about shipping what you understood so far, then improving it as you learned.
      </p>
    </StepLayout>
  );
}

/* 5 ─ Honest Done or hidden debt? -------------------------------------------------------------------- */

export function HonestDone() {
  return (
    <StepLayout
      eyebrow="Checkpoint"
      title="Honest Done or hidden debt?"
      stage={
        <div className="flex flex-1 flex-col justify-center">
          <SortCheckpoint
            id="honest-done"
            prompt="Does each habit keep “done” honest, or hide undone work?"
            categories={[
              { id: "honest", label: "Honest" },
              { id: "hidden", label: "Hides debt" },
            ]}
            items={[
              {
                id: "hardening",
                label: "Leave testing for a “hardening Sprint” before release",
                category: "hidden",
                why: "The Increments weren't really Done; the testing debt just moved to later, when fixes cost more.",
              },
              {
                id: "split",
                label: "Split a story so the finished slice fully meets the DoD",
                category: "honest",
                why: "Smaller, but truly Done. The rest goes back to the Product Backlog.",
              },
              {
                id: "bug",
                label: "Mark a story Done and open a bug ticket for a known failure",
                category: "hidden",
                why: "If it fails the Definition of Done it isn't Done; the Scrum Guide says it returns to the Product Backlog.",
              },
              {
                id: "retro",
                label: "Tighten the DoD at a Retrospective and plan for the extra effort",
                category: "honest",
                why: "The Retrospective is exactly where a team revisits its Definition of Done.",
              },
              {
                id: "prudent",
                label:
                  "Ship a quick version for a deadline, with a visible backlog item to rework it",
                category: "honest",
                why: "Prudent, deliberate debt: the Product Owner can see it and plan the payback.",
              },
            ]}
          />
        </div>
      }
    >
      <p>The danger isn&apos;t debt itself; it&apos;s debt nobody can see. Sort each habit.</p>
    </StepLayout>
  );
}

/* 6 ─ Wrap --------------------------------------------------------------------------------------- */

export function Wrap() {
  return (
    <StepLayout
      eyebrow="Wrap-up"
      title="What to remember"
      stage={
        <div className="flex flex-1 flex-col justify-center gap-3">
          <blockquote className="border-accent bg-surface rounded-r-xl border-l-4 px-4 py-3 text-sm">
            &ldquo;The Definition of Done is a formal description of the state of the Increment when
            it meets the quality measures required for the product.&rdquo;
            <br />
            <br />
            &ldquo;If a Product Backlog item does not meet the Definition of Done, it cannot be
            released or even presented at the Sprint Review. Instead, it returns to the Product
            Backlog for future consideration.&rdquo;
            <ScrumGuideCredit />
          </blockquote>
          <div className="grid gap-2 sm:grid-cols-2">
            <div className="border-line bg-surface rounded-xl border px-4 py-3">
              <p className="text-lg font-semibold tabular-nums">~13.5 of 41 hours</p>
              <p className="text-muted mt-1 text-xs">
                A week, on technical debt, as developers estimated for the average developer at
                their company. Stripe / Harris Poll survey, 2018.
              </p>
            </div>
            <div className="border-line bg-surface rounded-xl border px-4 py-3">
              <p className="text-lg font-semibold tabular-nums">20–40%</p>
              <p className="text-muted mt-1 text-xs">
                Of the value of their technology estate: 50 CIOs&apos; estimate of their tech debt.
                McKinsey survey, 2020.
              </p>
            </div>
          </div>
        </div>
      }
    >
      <p>
        A shared Definition of Done keeps every Increment usable and the product releasable. If the
        organisation has a standard (say, a government site that must meet GIGW 3.0 and its{" "}
        <Term id="wcag">WCAG 2.1 AA</Term> accessibility level), it&apos;s the minimum; the team can
        add more.
      </p>
      <p>
        Older Scrum Guides expected the DoD to grow &ldquo;more stringent&rdquo; as a team matures;
        the 2020 guide has the team revisit it at each Retrospective.
      </p>
      <p>
        Next: small batches and continuous integration, the engineering habits that make a strong
        DoD affordable.
      </p>
    </StepLayout>
  );
}
