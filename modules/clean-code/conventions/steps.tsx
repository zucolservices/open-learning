"use client";

import { motion } from "motion/react";
import { useSceneState } from "@/lib/module-sdk";
import { StepLayout } from "@/toolkit/layout/step-layout";
import { WrapStep } from "@/toolkit/layout/wrap-step";
import { OrderCheckpoint } from "@/toolkit/checkpoints/order";
import { Term } from "@/toolkit/glossary/term";
import { cn } from "@/lib/cn";
import { ADR_SECTIONS, HOWS, PROPOSALS, type How } from "./model";
import type { ConvState } from "./state";

/* 1 ─ Story ---------------------------------------------------------------------------------------- */

export function HouseRules() {
  return (
    <StepLayout
      eyebrow="Story"
      title="House rules in a shared kitchen"
      stage={
        <div className="flex flex-1 flex-col justify-center gap-2">
          {[
            ["Labels on every container", "Agreed once; nobody argues about it again."],
            ["Knives back on the magnetic strip", "Anyone can find one, any shift."],
            [
              "Why the fryer moved",
              "A note on the wall: “Moved away from the window after the 2025 fire inspection.”",
            ],
          ].map(([t, b], i) => (
            <motion.div
              key={t}
              initial={{ opacity: 0, x: -4 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.12 * i }}
              className="border-line bg-surface rounded-lg border px-3 py-2 text-xs"
            >
              <span className="font-semibold">{t}</span>
              <span className="text-muted"> · {b}</span>
            </motion.div>
          ))}
        </div>
      }
    >
      <p>
        A shared kitchen runs on a few house rules, agreed once, so cooks on any shift can find
        things and work together. And when something surprising was decided, a note explains why, so
        nobody undoes it by accident.
      </p>
      <p>
        Teams need the same: <Term id="conventions">conventions</Term> for everyday choices, tools
        to enforce what can be enforced, and short written records of important decisions.
      </p>
    </StepLayout>
  );
}

/* 2 ─ Draft conventions ⭐ ------------------------------------------------------------------------- */

export function Draft() {
  const [s, set] = useSceneState<ConvState>();
  const auto = PROPOSALS.filter((p) => s.hows[p.id] === "automate").length;
  const written = PROPOSALS.filter((p) => s.hows[p.id] === "write").length;
  return (
    <StepLayout
      eyebrow="Build"
      title="Draft the team's conventions"
      stage={
        <div className="flex flex-1 flex-col justify-center gap-1.5">
          {PROPOSALS.map((p) => {
            const h = s.hows[p.id];
            return (
              <div
                key={p.id}
                className="border-line bg-surface rounded-lg border px-3 py-1.5 text-xs"
              >
                <div className="flex flex-wrap items-center justify-between gap-1.5">
                  <span>{p.text}</span>
                  <span className="flex gap-1">
                    {HOWS.map((x) => (
                      <button
                        key={x.id}
                        type="button"
                        aria-pressed={h === x.id}
                        onClick={() => set({ hows: { ...s.hows, [p.id]: x.id as How } })}
                        className={cn(
                          "rounded-full border px-2 py-0.5 text-[10px]",
                          h === x.id
                            ? x.id === p.answer
                              ? "border-good bg-good/20"
                              : "border-bad bg-bad/15"
                            : "border-line text-muted",
                        )}
                      >
                        {x.label}
                      </button>
                    ))}
                  </span>
                </div>
                {h && (
                  <p
                    className={cn(
                      "mt-0.5 text-[10px]",
                      h === p.answer ? "text-good" : "text-muted",
                    )}
                  >
                    {h === p.answer
                      ? p.why
                      : "Can a tool check this? Is it more than one person's taste?"}
                  </p>
                )}
              </div>
            );
          })}
          <p className="text-muted text-[11px]">
            Enforced by tools: {auto} · in the style guide: {written}
          </p>
        </div>
      }
    >
      <p>
        A café team&apos;s first meeting produced seven proposals. For each, decide: automate it
        with a formatter or linter, write it down in the style guide, or drop it.
      </p>
      <p>
        The rule of thumb: if a tool can check it, let the tool do it. Write down what needs
        judgement. Drop personal tastes; consistency beats any one preference.
      </p>
    </StepLayout>
  );
}

/* 3 ─ Write an ADR --------------------------------------------------------------------------------- */

export function Adr() {
  const [s, set] = useSceneState<ConvState>();
  return (
    <StepLayout
      eyebrow="Explore"
      title="Record a decision in an ADR"
      stage={
        <div className="flex flex-1 flex-col justify-center gap-2">
          <div className="border-line bg-surface-2 rounded-lg border px-3 py-1.5 font-mono text-[11px]">
            docs/adr/0007-store-orders-in-postgresql.md
          </div>
          {ADR_SECTIONS.map((sec) => {
            const pick = s.adr[sec.id];
            return (
              <div
                key={sec.id}
                className="border-line bg-surface rounded-lg border px-3 py-1.5 text-xs"
              >
                <p className="font-semibold">{sec.label}</p>
                <div className="mt-1 grid gap-1">
                  {sec.options.map((o, i) => (
                    <button
                      key={o.text}
                      type="button"
                      aria-pressed={pick === i}
                      onClick={() => set({ adr: { ...s.adr, [sec.id]: i } })}
                      className={cn(
                        "rounded border px-2 py-1 text-left text-[11px]",
                        pick === i
                          ? o.good
                            ? "border-good bg-good/15"
                            : "border-bad bg-bad/10"
                          : "border-line text-muted",
                      )}
                    >
                      {o.text}
                    </button>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      }
    >
      <p>
        An <Term id="adr">architecture decision record</Term> is a short file kept with the code
        that says what was decided and why. Michael Nygard proposed the format in 2011: title,
        context, decision, status and consequences.
      </p>
      <p>
        Pick the better sentence for each section. Good ADRs give the real context and admit the
        costs, so a future reader can tell when the decision should be revisited.
      </p>
    </StepLayout>
  );
}

/* 4 ─ Style guides --------------------------------------------------------------------------------- */

export function Guides() {
  return (
    <StepLayout
      eyebrow="Explore"
      title="Borrow a style guide, and keep it current"
      stage={
        <div className="flex flex-1 flex-col justify-center gap-1.5">
          {[
            [
              "Start from a published guide",
              "PEP 8 for Python, Google's style guides for many languages, the Airbnb guide for JavaScript.",
            ],
            [
              "Conventions age",
              "Effective Go says it is no longer actively updated; Airbnb's official lint config hasn't been released since 2021. Revisit yours too.",
            ],
            [
              "EditorConfig",
              "One small file (since 2011) keeps indentation and line endings consistent across editors.",
            ],
            [
              "MADR",
              "A popular set of decision-record templates (version 4, 2024), now called Markdown Any Decision Records.",
            ],
          ].map(([t, b], i) => (
            <motion.div
              key={t}
              initial={{ opacity: 0, x: -4 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.06 * i }}
              className="border-line bg-surface rounded-lg border px-3 py-2 text-xs"
            >
              <span className="font-semibold">{t}</span>
              <span className="text-muted"> · {b}</span>
            </motion.div>
          ))}
        </div>
      }
    >
      <p>
        You don&apos;t need to invent conventions from scratch. Adopt a well-known guide, note the
        few places your team differs, and let tools enforce as much as possible.
      </p>
      <p>
        Treat conventions like code: review them now and then, and delete the ones nobody needs.
      </p>
    </StepLayout>
  );
}

/* 5 ─ Checkpoint ----------------------------------------------------------------------------------- */

export function ConvCheck() {
  return (
    <StepLayout
      eyebrow="Checkpoint"
      title="The parts of an ADR"
      stage={
        <div className="flex flex-1 flex-col justify-center">
          <OrderCheckpoint
            id="clean-conventions"
            prompt="Drag the sections of a Nygard-style ADR into order."
            items={[
              { id: "title", label: "Title" },
              { id: "context", label: "Context" },
              { id: "decision", label: "Decision" },
              { id: "status", label: "Status" },
              { id: "consequences", label: "Consequences" },
            ]}
            explanation="Title, context, decision, status, consequences: short, kept with the code, and honest about the trade-offs."
          />
        </div>
      }
    >
      <p>Drag the sections into order.</p>
    </StepLayout>
  );
}

/* 6 ─ Wrap ----------------------------------------------------------------------------------------- */

export function Wrap() {
  return (
    <WrapStep
      points={[
        ["Agree once", "Conventions save a thousand small debates."],
        ["Automate what tools can check", "Formatters, linters, EditorConfig."],
        ["Write down what needs judgement", "A short style guide."],
        ["Record big decisions", "ADRs: context, decision, consequences."],
        ["Review them", "Conventions age like code."],
      ]}
    >
      <p>Next, the capstone: untangle a module nobody understands.</p>
    </WrapStep>
  );
}
