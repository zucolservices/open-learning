"use client";

import { motion } from "motion/react";
import { Bike, Check, X } from "lucide-react";
import { useSceneState } from "@/lib/module-sdk";
import { StepLayout } from "@/toolkit/layout/step-layout";
import { OrderCheckpoint } from "@/toolkit/checkpoints/order";
import { Term } from "@/toolkit/glossary/term";
import { cn } from "@/lib/cn";
import { DECISIONS, PRECEDENTS, QUESTIONS, type Verdict } from "./model";
import type { CapState } from "./state";

/* 1 ─ The brief ----------------------------------------------------------------------------------- */

export function Brief() {
  return (
    <StepLayout
      eyebrow="The brief"
      title="Model a food-delivery business"
      stage={
        <div className="flex flex-1 flex-col justify-center gap-2">
          <div className="border-accent/40 bg-accent-soft flex items-center gap-3 rounded-xl border px-4 py-3">
            <Bike className="text-accent size-6 shrink-0" />
            <p className="text-sm">
              Tiffin Run, a made-up food-delivery company, has orders, dishes, restaurants, couriers
              and refunds. Its warehouse is a pile of copied tables, and every meeting starts with
              an argument about numbers.
            </p>
          </div>
          <div className="grid gap-1 sm:grid-cols-2">
            {QUESTIONS.map((q, i) => (
              <motion.p
                key={q.q}
                initial={{ opacity: 0, x: -4 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.04 * i }}
                className="border-line bg-surface rounded-md border px-2.5 py-1.5 text-xs"
              >
                <span className="text-muted font-mono">{i + 1}.</span> {q.q}
              </motion.p>
            ))}
          </div>
        </div>
      }
    >
      <p>
        You&apos;ve interviewed the business and written down ten questions it needs answered. Your
        job is to design the analytical model: grains, fact tables, dimensions, history, metrics and
        safeguards.
      </p>
      <p>
        Every decision draws on a module in this track. Then the model meets the ten questions.
        There are no marks, and you can change any decision as often as you like.
      </p>
    </StepLayout>
  );
}

/* 2 ─ Make the design choices ⭐ ------------------------------------------------------------------ */

const VERDICT_CLS: Record<Verdict, string> = {
  good: "text-good",
  warn: "text-accent",
  bad: "text-bad",
};

export function Design() {
  const [s, set] = useSceneState<CapState>();
  const choices = s.choices ?? {};
  const made = DECISIONS.filter((d) => choices[d.id]).length;
  return (
    <StepLayout
      eyebrow="Design"
      title="Make the design choices"
      stage={
        <div className="flex flex-1 flex-col justify-center gap-2">
          {DECISIONS.map((d) => {
            const o = d.options.find((x) => x.id === choices[d.id]);
            return (
              <div key={d.id} className="border-line bg-surface rounded-xl border px-3 py-2">
                <p className="text-xs font-semibold">
                  {d.area} <span className="text-muted font-normal">· module {d.module}</span>
                </p>
                <div className="mt-1 flex flex-wrap gap-1">
                  {d.options.map((opt) => (
                    <button
                      key={opt.id}
                      type="button"
                      onClick={() => set({ choices: { ...choices, [d.id]: opt.id } })}
                      className={cn(
                        "rounded-lg border px-2 py-1 text-left text-[11px]",
                        choices[d.id] === opt.id
                          ? "border-accent bg-accent-soft"
                          : "border-line hover:bg-surface-2",
                      )}
                    >
                      {opt.label}
                    </button>
                  ))}
                </div>
                {o && <p className={cn("mt-1 text-[10px]", VERDICT_CLS[o.verdict])}>{o.note}</p>}
              </div>
            );
          })}
          <p className="text-muted text-xs">
            {made < DECISIONS.length
              ? `${DECISIONS.length - made} decisions still open.`
              : "Every decision made. Continue to the ten questions."}
          </p>
        </div>
      }
    >
      <p>
        Seven decisions, from the <Term id="grain">grain</Term> of the orders fact to how refunds
        are recorded. Choose what you would actually build. Some options are traps teams really fall
        into.
      </p>
      <p>A note under each choice says what it buys you; the real test comes next.</p>
    </StepLayout>
  );
}

/* 3 ─ Ten real questions -------------------------------------------------------------------------- */

export function TenQuestions() {
  const [s] = useSceneState<CapState>();
  const choices = s.choices ?? {};
  const results = QUESTIONS.map((q) => {
    const missing = Object.entries(q.needs).filter(([k, ok]) => !ok.includes(choices[k] ?? ""));
    return {
      ...q,
      ok: missing.length === 0,
      missing: missing.map(([k]) => DECISIONS.find((d) => d.id === k)!),
    };
  });
  const answered = results.filter((r) => r.ok).length;
  return (
    <StepLayout
      eyebrow="Test"
      title="Ten real questions"
      stage={
        <div className="flex flex-1 flex-col justify-center gap-2">
          <p
            className={cn(
              "text-sm font-semibold",
              answered === QUESTIONS.length ? "text-good" : "text-fg",
            )}
          >
            Your model answers {answered} of {QUESTIONS.length}.
          </p>
          <div className="flex flex-col gap-1">
            {results.map((r, i) => (
              <motion.div
                key={r.q}
                initial={{ opacity: 0, x: -4 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.04 * i }}
                className={cn(
                  "flex gap-2 rounded-lg border px-3 py-1.5 text-xs",
                  r.ok ? "border-good/50 bg-good/10" : "border-bad/50 bg-bad/10",
                )}
              >
                {r.ok ? (
                  <Check className="text-good mt-0.5 size-3.5 shrink-0" />
                ) : (
                  <X className="text-bad mt-0.5 size-3.5 shrink-0" />
                )}
                <span>
                  <span className="font-semibold">{r.q}</span>
                  <span className="text-muted">
                    {" "}
                    ·{" "}
                    {r.ok
                      ? r.why
                      : `Revisit: ${r.missing.map((m) => `${m.area.toLowerCase()} (module ${m.module})`).join(", ")}.`}
                  </span>
                </span>
              </motion.div>
            ))}
          </div>
        </div>
      }
    >
      <p>
        The business&apos;s ten questions, checked against your design. Each miss names the decision
        behind it; go back and change it to see the question turn green.
      </p>
      <p>
        This is the real test of any model: not whether it looks tidy, but whether it answers the
        questions people actually ask, correctly, and keeps answering them as things change.
      </p>
    </StepLayout>
  );
}

/* 4 ─ It happens for real ------------------------------------------------------------------------- */

export function Precedents() {
  return (
    <StepLayout
      eyebrow="Explore"
      title="It happens for real"
      stage={
        <div className="flex flex-1 flex-col justify-center gap-2">
          {PRECEDENTS.map((p, i) => (
            <motion.div
              key={p.who}
              initial={{ opacity: 0, x: -6 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.15 * i }}
              className="border-line bg-surface grid grid-cols-[5rem_1fr] gap-2 rounded-lg border px-3 py-3 text-xs"
            >
              <div>
                <p className="font-semibold">{p.who}</p>
                <p className="text-muted font-mono text-[10px]">{p.when}</p>
              </div>
              <p className="text-muted">{p.what}</p>
            </motion.div>
          ))}
        </div>
      }
    >
      <p>
        Tiffin Run is made up; its problems aren&apos;t. Airbnb and Uber both wrote publicly about
        the same pattern: too many look-alike tables and different answers to the same question.
      </p>
      <p>
        Both responded the way this track suggests: certified core models, clear owners, metrics
        defined once, and treating schema changes like code changes.
      </p>
    </StepLayout>
  );
}

/* 5 ─ A design routine ---------------------------------------------------------------------------- */

export function DesignOrder() {
  return (
    <StepLayout
      eyebrow="Checkpoint"
      title="A design routine"
      stage={
        <div className="flex flex-1 flex-col justify-center">
          <OrderCheckpoint
            id="design-routine"
            prompt="Put the steps of designing an analytical model in a sensible order."
            items={[
              { id: "questions", label: "Interview the business and list its questions" },
              { id: "process", label: "Pick the business processes behind them" },
              { id: "grain", label: "Declare each fact table's grain" },
              { id: "dims", label: "Choose conformed dimensions and how each keeps history" },
              { id: "facts", label: "Add facts, and define metrics once in a semantic layer" },
              { id: "test", label: "Test against the questions, then add contracts and owners" },
            ]}
            explanation="Questions, process, grain, dimensions, facts and metrics, then test and protect. Each step depends on the one before."
          />
        </div>
      }
    >
      <p>Order the routine.</p>
    </StepLayout>
  );
}

/* 6 ─ The whole track ----------------------------------------------------------------------------- */

const CHAPTERS: [string, string][] = [
  ["The big picture", "Why model data; conceptual, logical and physical."],
  ["Relational foundations", "Keys, normalisation, transactions vs analytics."],
  ["Dimensional modelling", "Stars, grain, fact types, conformed dimensions, patterns, SCDs."],
  ["Other approaches", "Inmon and Kimball, Data Vault, one big table, semantic layers."],
  ["Modern practice", "dbt layers, NoSQL, graphs, time, and changing models safely."],
];

export function Wrap() {
  return (
    <StepLayout
      eyebrow="Wrap-up"
      title="The whole track"
      stage={
        <div className="flex flex-1 flex-col justify-center gap-1.5">
          {CHAPTERS.map(([t, d], i) => (
            <motion.div
              key={t}
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.06 * i }}
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
        That&apos;s Data Modelling: twenty-one modules from a café&apos;s messy spreadsheet to a
        delivery company&apos;s warehouse.
      </p>
      <p>
        The habits carry everywhere: start from the questions, say exactly what one row means, keep
        each fact in one place until you have a reason not to, decide how history is kept, define
        metrics once, and change shapes the way cities rename streets.
      </p>
    </StepLayout>
  );
}
