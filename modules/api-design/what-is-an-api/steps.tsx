"use client";

import { motion } from "motion/react";
import { Check, X } from "lucide-react";
import { useSceneState } from "@/lib/module-sdk";
import { StepLayout } from "@/toolkit/layout/step-layout";
import { SortCheckpoint } from "@/toolkit/checkpoints/sort";
import { Code } from "@/toolkit/controls/stepper";
import { Term } from "@/toolkit/glossary/term";
import { cn } from "@/lib/cn";
import { BEFORE, CHANGES, CLIENTS } from "./model";
import type { ApiState } from "./state";

/* 2 ─ Change the menu ⭐ -------------------------------------------------------------------------- */

export function ChangeIt() {
  const [s, set] = useSceneState<ApiState>();
  const ch = CHANGES.find((c) => c.id === s.change);
  const tried = s.tried ?? [];
  const pick = (id: string) =>
    set({ change: id, tried: tried.includes(id) ? tried : [...tried, id] });
  return (
    <StepLayout
      eyebrow="Simulation"
      title="Change the menu"
      stage={
        <div className="flex flex-1 flex-col justify-center gap-3">
          <div className="flex flex-wrap gap-1.5">
            {CHANGES.map((c) => (
              <button
                key={c.id}
                type="button"
                aria-pressed={s.change === c.id}
                onClick={() => pick(c.id)}
                className={cn(
                  "rounded-full border px-2.5 py-1 text-left text-[11px]",
                  s.change === c.id
                    ? "border-accent bg-accent-soft"
                    : tried.includes(c.id)
                      ? "border-line text-muted"
                      : "border-line hover:bg-surface-2",
                )}
              >
                {c.label}
              </button>
            ))}
          </div>
          <div className="grid gap-2 sm:grid-cols-2">
            <div>
              <p className="text-muted mb-1 font-mono text-[10px]">GET /menu/dish_42, before</p>
              <Code>{BEFORE}</Code>
            </div>
            <div>
              <p className="text-muted mb-1 font-mono text-[10px]">after the change</p>
              <Code>{ch ? ch.after : "pick a change above"}</Code>
            </div>
          </div>
          <div className="grid gap-1.5 sm:grid-cols-2">
            {CLIENTS.map((cl) => {
              const e = ch?.effects[cl.id];
              return (
                <motion.div
                  key={cl.id + (ch?.id ?? "")}
                  initial={{ opacity: 0.6 }}
                  animate={{ opacity: 1 }}
                  className={cn(
                    "rounded-lg border px-3 py-2",
                    !e
                      ? "border-line bg-surface"
                      : e === "ok"
                        ? "border-good/50 bg-good/5"
                        : "border-bad/50 bg-bad/10",
                  )}
                >
                  <p className="flex items-center gap-1.5 text-xs font-semibold">
                    {e === "ok" && <Check className="text-good size-3.5" />}
                    {e === "broken" && <X className="text-bad size-3.5" />}
                    {cl.name}
                  </p>
                  <p className="text-muted text-[11px]">{ch ? ch.why[cl.id] : cl.note}</p>
                </motion.div>
              );
            })}
          </div>
          {ch && (
            <motion.p
              key={ch.id}
              initial={{ opacity: 0, y: 4 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-sm"
            >
              {ch.lesson}
            </motion.p>
          )}
          <p className="text-subtle text-[10px]">
            Illustrative clients. Tried {tried.length} of {CHANGES.length} changes.
          </p>
        </div>
      }
    >
      <p>
        You run the menu <Term id="api">API</Term> for a food-delivery company. Four programs call
        it, and you only control one of them. Try each change and see who breaks.
      </p>
      <p>
        The <Term id="api-contract">contract</Term> is everything a caller can rely on: the
        addresses, the fields and their types, what errors mean. Behind it, you can rebuild
        anything. In front of it, every change is someone else&apos;s problem.
      </p>
    </StepLayout>
  );
}

/* 3 ─ Design for the caller ----------------------------------------------------------------------- */

const HABITS: [string, string][] = [
  [
    "Start from the caller's task",
    "“Show today's menu with prices”, not “expose the dishes table”.",
  ],
  ["Hide the kitchen", "Database columns, internal codes and team names stay behind the API."],
  ["Be predictable", "The same names, formats and error shapes everywhere."],
  ["Promise little, keep it", "Every behaviour you expose may become something people depend on."],
];

export function Consumers() {
  return (
    <StepLayout
      eyebrow="Principle"
      title="Design for the caller"
      stage={
        <div className="flex flex-1 flex-col justify-center gap-2">
          {HABITS.map(([t, d], i) => (
            <motion.div
              key={t}
              initial={{ opacity: 0, x: -6 }}
              animate={{ opacity: 1, x: 0 }}
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
        An API is a product, and its users are other programmers. The people who call it are called{" "}
        <Term id="api-consumer">consumers</Term> or clients; the team that runs it is the provider.
      </p>
      <p>
        Many teams now work <Term id="api-first">API-first</Term>: they design and agree the
        contract before writing the code behind it, so the app, the partners and the backend can all
        be built at once. In Postman&apos;s 2025 survey of over 5,700 developers, 82% of
        organisations were API-first to some degree and 25% fully.
      </p>
    </StepLayout>
  );
}

/* 4 ─ Part of the contract? ----------------------------------------------------------------------- */

export function ContractOrNot() {
  return (
    <StepLayout
      eyebrow="Checkpoint"
      title="Part of the contract?"
      stage={
        <div className="flex flex-1 flex-col justify-center">
          <SortCheckpoint
            id="contract-or-not"
            prompt="Can the provider make each change freely, or does it change the contract?"
            categories={[
              { id: "free", label: "Change freely" },
              { id: "contract", label: "Changes the contract" },
            ]}
            items={[
              {
                id: "db",
                label: "Rename a column in the database behind the API",
                category: "free",
                why: "Callers never see the database; the response stays the same.",
              },
              {
                id: "lang",
                label: "Rewrite the service in a different programming language",
                category: "free",
                why: "Same requests, same responses: nobody can tell.",
              },
              {
                id: "cache",
                label: "Add a cache inside the service so it's faster",
                category: "free",
                why: "Faster is welcome, as long as answers stay correct.",
              },
              {
                id: "field",
                label: "Rename the delivery_time field",
                category: "contract",
                why: "Every client reading the old name breaks.",
              },
              {
                id: "date",
                label: "Send dates as 03/10/2026 instead of 2026-10-03",
                category: "contract",
                why: "A format change is a breaking change, and this one is ambiguous too.",
              },
              {
                id: "endpoint",
                label: "Remove the /restaurants/{id}/reviews address",
                category: "contract",
                why: "Anyone calling it now gets an error.",
              },
            ]}
            explanation="What happens inside is yours to change. What callers can see, send or receive is the contract."
          />
        </div>
      }
    >
      <p>Inside the kitchen, or on the menu?</p>
    </StepLayout>
  );
}

/* 5 ─ Wrap ---------------------------------------------------------------------------------------- */

const POINTS: [string, string][] = [
  ["An API is a contract", "Requests it accepts, answers it promises."],
  ["Behind it, change anything", "Databases, languages, servers."],
  ["In front of it, be careful", "Callers you don't control break silently."],
  ["Everything observable gets depended on", "Even field order and speed."],
  ["Design for the caller", "Their task, predictable names, little exposed."],
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
        Next: HTTP, the protocol nearly every web API travels over, built up one piece at a time.
      </p>
    </StepLayout>
  );
}
