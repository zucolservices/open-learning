"use client";

import { motion } from "motion/react";
import { AlertTriangle, Check, Package, X } from "lucide-react";
import { useSceneState } from "@/lib/module-sdk";
import { StepLayout } from "@/toolkit/layout/step-layout";
import { SortCheckpoint } from "@/toolkit/checkpoints/sort";
import { Term } from "@/toolkit/glossary/term";
import { cn } from "@/lib/cn";
import { DECISIONS, INCIDENTS, outcome, type Level, type Verdict } from "./model";
import type { CapState } from "./state";

/* 1 ─ The brief ---------------------------------------------------------------------------------- */

const NEEDS: [string, string][] = [
  ["Easy to adopt", "A start-up should integrate in days, not weeks."],
  ["Safe to retry", "Networks fail; a retry must never book a second pickup."],
  ["Private by default", "Each partner and customer sees only their own parcels."],
  ["Fair to everyone", "No single partner can slow the API for the rest."],
  ["Able to change", "The API will evolve for years without breaking partners."],
];

export function Brief() {
  return (
    <StepLayout
      eyebrow="The brief"
      title="An API for a parcel service"
      stage={
        <div className="flex flex-1 flex-col justify-center gap-2">
          <div className="border-accent/40 bg-accent-soft flex items-center gap-3 rounded-xl border px-4 py-3">
            <Package className="text-accent size-6 shrink-0" />
            <p className="text-sm">
              An illustrative Indian parcel company opens its systems to partners: online shops,
              marketplaces and its own customer app. They&apos;ll book pickups, track parcels and
              hear about deliveries through your API.
            </p>
          </div>
          {NEEDS.map(([t, d], i) => (
            <motion.div
              key={t}
              initial={{ opacity: 0, x: -6 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.08 * i }}
              className="border-line bg-surface grid grid-cols-[7.5rem_1fr] gap-2 rounded-lg border px-3 py-2 text-sm"
            >
              <span className="font-semibold">{t}</span>
              <span className="text-muted">{d}</span>
            </motion.div>
          ))}
        </div>
      }
    >
      <p>
        You design the parcel company&apos;s public <Term id="api">API</Term>. Each decision in the
        next step draws on a module in this track, from resource URLs and{" "}
        <Term id="idempotency-key">idempotency keys</Term> to webhooks, authorisation and limits.
      </p>
      <p>
        Real systems like this exist: ONDC publishes open API specifications for logistics, built on
        the Beckn protocol, and India Post offers API integration to registered bulk customers.
      </p>
      <p>
        Then a year of things that really happen to APIs. There are no marks, and you can change
        your mind as often as you like.
      </p>
    </StepLayout>
  );
}

/* 2 ─ Make the choices ⭐ ------------------------------------------------------------------------- */

const VERDICT_CLS: Record<Verdict, string> = {
  good: "text-good",
  warn: "text-accent",
  bad: "text-bad",
};

export function Choose() {
  const [s, set] = useSceneState<CapState>();
  const choices = s.choices ?? {};
  const made = DECISIONS.filter((d) => choices[d.id]).length;
  return (
    <StepLayout
      eyebrow="Design"
      title="Make the choices"
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
              : "Every decision made. Continue to the first year."}
          </p>
        </div>
      }
    >
      <p>
        Nine decisions, from how the URLs look to who may see which parcel. Choose what you would
        actually ship. Some options are traps real APIs fall into.
      </p>
      <p>A note under each choice says what it buys you. The real test comes next.</p>
    </StepLayout>
  );
}

/* 3 ─ The first year ⭐ ------------------------------------------------------------------------------- */

const LEVEL: Record<Level, { cls: string; icon: typeof Check; label: string }> = {
  holds: { cls: "border-good/50 bg-good/10", icon: Check, label: "Holds" },
  degrades: { cls: "border-accent/50 bg-accent-soft", icon: AlertTriangle, label: "Degrades" },
  breaks: { cls: "border-bad/60 bg-bad/10", icon: X, label: "Breaks" },
};

export function BadNight() {
  const [s, set] = useSceneState<CapState>();
  const choices = s.choices ?? {};
  const inc = INCIDENTS.find((x) => x.id === s.incident) ?? INCIDENTS[0];
  const o = outcome(inc.id, choices);
  const all = INCIDENTS.map((x) => ({ x, o: outcome(x.id, choices) }));
  return (
    <StepLayout
      eyebrow="Branching scenario"
      title="The first year"
      stage={
        <div className="flex flex-1 flex-col justify-center gap-3">
          <div className="flex flex-wrap gap-1.5">
            {all.map(({ x, o: r }) => {
              const Icon = r ? LEVEL[r.level].icon : null;
              return (
                <button
                  key={x.id}
                  type="button"
                  onClick={() => set({ incident: x.id })}
                  className={cn(
                    "flex items-center gap-1 rounded-full border px-3 py-1 text-xs",
                    s.incident === x.id
                      ? "border-accent bg-accent-soft"
                      : "border-line hover:bg-surface-2",
                  )}
                >
                  {Icon && r && (
                    <Icon
                      className={cn(
                        "size-3",
                        r.level === "holds"
                          ? "text-good"
                          : r.level === "breaks"
                            ? "text-bad"
                            : "text-accent",
                      )}
                    />
                  )}
                  {x.name}
                </button>
              );
            })}
          </div>
          <p className="text-sm">{inc.text}</p>
          <motion.div
            key={`${inc.id}-${JSON.stringify(choices)}`}
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            className={cn(
              "rounded-xl border px-4 py-3",
              o ? LEVEL[o.level].cls : "border-line bg-surface",
            )}
          >
            {o ? (
              <>
                <p className="font-semibold">
                  {LEVEL[o.level].label}{" "}
                  <span className="text-muted text-xs font-normal">· see module {o.module}</span>
                </p>
                <p className="text-sm">{o.text}</p>
              </>
            ) : (
              <p className="text-muted text-sm">
                The decision this depends on isn&apos;t made yet. Go back a step to choose.
              </p>
            )}
          </motion.div>
        </div>
      }
    >
      <p>
        Nine things that happen to a public API in its first year. Pick one to see how your design
        copes; the icons show every result at a glance.
      </p>
      <p>
        Go back, change a choice, and come here again. Several depend on two decisions together, as
        real ones do.
      </p>
    </StepLayout>
  );
}

/* 4 ─ What to fix first -------------------------------------------------------------------------- */

export function FixFirst() {
  return (
    <StepLayout
      eyebrow="Checkpoint"
      title="What to fix first"
      stage={
        <div className="flex flex-1 flex-col justify-center">
          <SortCheckpoint
            id="api-fix-first"
            prompt="A colleague's API review found these. Which must be fixed before partners go live?"
            categories={[
              { id: "now", label: "Before launch" },
              { id: "later", label: "Improve later" },
            ]}
            items={[
              {
                id: "owner",
                label: "Any signed-in partner can read any parcel by changing the ID",
                category: "now",
                why: "Broken object level authorisation: a data breach waiting to happen.",
              },
              {
                id: "retry",
                label: "POST /shipments has no idempotency key",
                category: "now",
                why: "The first network blip at scale books duplicate pickups.",
              },
              {
                id: "unbounded",
                label: "List endpoints return everything, with no page size limit",
                category: "now",
                why: "Adding pagination later is a breaking change, and one big list can take the API down.",
              },
              {
                id: "sdk",
                label: "There's no Python SDK yet",
                category: "later",
                why: "Nice to have; curl examples and OpenAPI let people start.",
              },
              {
                id: "graphql",
                label: "Some partners would like a GraphQL endpoint",
                category: "later",
                why: "A possible addition, not a launch blocker.",
              },
              {
                id: "portal",
                label: "The developer portal's design looks dated",
                category: "later",
                why: "Content matters more than looks; fix later.",
              },
            ]}
            explanation="Anything that leaks data, duplicates real-world actions or can't be fixed later without breaking clients blocks launch; polish and extras can follow."
          />
        </div>
      }
    >
      <p>Reviewing someone else&apos;s design is half the job.</p>
    </StepLayout>
  );
}

/* 5 ─ The whole track ---------------------------------------------------------------------------- */

const CHAPTERS: [string, string][] = [
  ["The big picture", "What an API is, HTTP, and the main styles."],
  ["Designing REST APIs", "Resources, status codes and errors, payloads, pagination, idempotency."],
  ["Contracts and change", "OpenAPI, versioning, deprecation."],
  ["Beyond REST", "gRPC, GraphQL, webhooks, real-time APIs."],
  [
    "Security and operations",
    "Authentication, API security, rate limits, caching, gateways, and this capstone.",
  ],
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
        That&apos;s API design: twenty-one modules from a single tap in a delivery app to a parcel
        API that partners can adopt in days and rely on for years.
      </p>
      <p>
        The habits carry over to any style: design for the caller, name things clearly, say exactly
        what happened, make retries safe, write the contract down, change it without breaking
        anyone, check every request, and tell people how to come back.
      </p>
    </StepLayout>
  );
}
