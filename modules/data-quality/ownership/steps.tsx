"use client";

import { motion } from "motion/react";
import { useSceneState } from "@/lib/module-sdk";
import { StepLayout } from "@/toolkit/layout/step-layout";
import { SortCheckpoint } from "@/toolkit/checkpoints/sort";
import { Code } from "@/toolkit/controls/stepper";
import { Term } from "@/toolkit/glossary/term";
import { cn } from "@/lib/cn";
import { DATASETS, INCIDENTS, MODELS, route, type Model } from "./model";
import type { OwnState } from "./state";

/* 1 ─ The shared garden --------------------------------------------------------------------------- */

export function Garden() {
  return (
    <StepLayout
      eyebrow="Story"
      title="The shared garden"
      stage={
        <div className="grid flex-1 content-center gap-3 sm:grid-cols-2">
          <div className="border-bad bg-bad/10 rounded-xl border px-4 py-3 text-xs">
            <p className="text-sm font-semibold">Everyone&apos;s garden</p>
            <p className="text-muted mt-1">
              Twenty neighbours enjoy it. Weeds grow, the tap drips, and each assumes someone else
              will deal with it.
            </p>
          </div>
          <div className="border-good bg-good/10 rounded-xl border px-4 py-3 text-xs">
            <p className="text-sm font-semibold">A named gardener</p>
            <p className="text-muted mt-1">
              Still everyone&apos;s to enjoy, but one person decides what&apos;s planted and gets
              the call when the tap breaks.
            </p>
          </div>
        </div>
      }
    >
      <p>
        A shared garden that belongs to everyone tends to belong to no one: problems are noticed by
        many and fixed by none. Give it a named gardener and things get done, even though everyone
        still uses it.
      </p>
      <p>
        Datasets are the same. <Term id="data-governance">Data governance</Term> is deciding who
        decides about data. Its first job is simple: put a <Term id="data-owner">data owner</Term>{" "}
        next to every important dataset.
      </p>
    </StepLayout>
  );
}

/* 2 ─ Assign owners, route incidents ⭐ ----------------------------------------------------------- */

export function Assign() {
  const [s, set] = useSceneState<OwnState>();
  const owners = s.owners ?? {};
  const setOwner = (id: string, m: Model) => set({ owners: { ...owners, [id]: m } });
  const results = INCIDENTS.map((i) => ({ i, r: route(i, owners, s.person) }));
  return (
    <StepLayout
      eyebrow="Simulation"
      title="Assign owners, route incidents"
      stage={
        <div className="flex flex-1 flex-col justify-center gap-3">
          <div className="grid gap-3 lg:grid-cols-2">
            <div className="flex flex-col gap-1.5">
              <p className="text-muted text-[10px]">WHO OWNS EACH DATASET?</p>
              {DATASETS.map((d) => (
                <div
                  key={d.id}
                  className="border-line bg-surface flex flex-wrap items-center justify-between gap-1 rounded-lg border px-2 py-1.5 text-xs"
                >
                  <span className="font-mono">{d.name}</span>
                  <span className="flex gap-1">
                    {MODELS.map((m) => (
                      <button
                        key={m.id}
                        type="button"
                        aria-label={`${d.name}: ${m.id === "domain" ? d.closest : m.label}`}
                        aria-pressed={(owners[d.id] ?? "nobody") === m.id}
                        onClick={() => setOwner(d.id, m.id)}
                        className={cn(
                          "rounded-md border px-1.5 py-0.5 text-[10px]",
                          (owners[d.id] ?? "nobody") === m.id
                            ? "border-accent bg-accent-soft"
                            : "border-line",
                        )}
                      >
                        {m.id === "domain" ? d.closest : m.label}
                      </button>
                    ))}
                  </span>
                </div>
              ))}
              <label className="text-muted mt-1 flex items-center gap-2 text-[11px]">
                <input
                  type="checkbox"
                  checked={!s.person}
                  onChange={(e) => set({ person: !e.target.checked })}
                  className="accent-accent"
                />
                Owners are teams, not named individuals
              </label>
            </div>
            <div className="flex flex-col gap-1.5">
              <p className="text-muted text-[10px]">FOUR INCIDENTS THIS MONTH</p>
              {results.map(({ i, r }) => (
                <motion.div
                  key={`${i.id}-${r.who}`}
                  initial={{ opacity: 0, y: 4 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={cn(
                    "rounded-lg border px-3 py-1.5 text-xs",
                    r.tone === "good"
                      ? "border-good bg-good/10"
                      : r.tone === "bad"
                        ? "border-bad bg-bad/10"
                        : "border-viz-compute bg-viz-compute/10",
                  )}
                >
                  <p className="font-semibold">{i.text}</p>
                  <p className="text-muted text-[11px]">
                    → {r.who}: {r.text}
                  </p>
                </motion.div>
              ))}
            </div>
          </div>
          <p className="text-subtle text-[10px]">
            A made-up company; the outcomes illustrate common patterns.
          </p>
        </div>
      }
    >
      <p>
        Every dataset starts with no owner. Give each one an owner and watch where this month&apos;s
        incidents land. A central data team can see problems, but often can&apos;t fix the source or
        answer what the data means.
      </p>
      <p>
        One more trap: the owner of revenue_daily is a named analyst who left in March. Make owners
        teams instead and the question still finds a home.
      </p>
    </StepLayout>
  );
}

/* 3 ─ Owners, stewards and RACI ------------------------------------------------------------------- */

export function Roles() {
  const rows: [string, string, string, string, string][] = [
    ["Approve a schema change", "A", "R", "C", "I"],
    ["Define 'active customer'", "A", "R", "C", "I"],
    ["Fix a failed quality rule", "A", "R", "I", "I"],
    ["Ask for a new column", "A", "C", "R", "—"],
  ];
  return (
    <StepLayout
      eyebrow="Explore"
      title="Owners, stewards and RACI"
      stage={
        <div className="flex flex-1 flex-col justify-center gap-3">
          <div className="grid gap-2 sm:grid-cols-3">
            {[
              [
                "Owner",
                "Decides and answers for the data: who may use it, what changes are allowed.",
              ],
              ["Steward", "Looks after it day to day: definitions, quality rules, fixing issues."],
              ["Consumer", "Uses it, reports problems and asks for changes."],
            ].map(([t, d]) => (
              <div key={t} className="border-line bg-surface rounded-lg border px-3 py-2 text-xs">
                <p className="font-semibold">{t}</p>
                <p className="text-muted">{d}</p>
              </div>
            ))}
          </div>
          <div className="border-line bg-surface rounded-xl border p-3 text-xs">
            <div className="text-muted grid grid-cols-[1fr_repeat(4,3.2rem)] gap-1 text-[10px]">
              <span>TASK (customers dataset)</span>
              <span>Owner</span>
              <span>Steward</span>
              <span>Consumer</span>
              <span>Others</span>
            </div>
            {rows.map((r) => (
              <div
                key={r[0]}
                className="border-line grid grid-cols-[1fr_repeat(4,3.2rem)] gap-1 border-t py-1"
              >
                {r.map((c, i) => (
                  <span
                    key={i}
                    className={cn(i > 0 && "font-mono", c === "A" && "text-accent font-semibold")}
                  >
                    {c}
                  </span>
                ))}
              </div>
            ))}
            <p className="text-subtle mt-1 text-[10px]">
              Responsible · Accountable · Consulted · Informed. A teaching example, not a standard.
            </p>
          </div>
        </div>
      }
    >
      <p>
        The DAMA body of knowledge treats a data owner as a business{" "}
        <Term id="data-steward">data steward</Term> with authority to approve decisions in their
        domain. A useful simplification: the owner decides and answers; the steward does the
        day-to-day care.
      </p>
      <p>
        Titles vary wildly between frameworks, so many teams write a RACI chart instead: for each
        task, who does it, who answers for it (ideally one), who is consulted and who is told.
      </p>
    </StepLayout>
  );
}

/* 4 ─ Ownership by domain ------------------------------------------------------------------------- */

export function Mesh() {
  return (
    <StepLayout
      eyebrow="Explore"
      title="Ownership by domain"
      stage={
        <div className="flex flex-1 flex-col justify-center gap-3">
          <div className="grid gap-2 sm:grid-cols-2">
            {[
              ["Domain-oriented ownership", "The team closest to the data owns it."],
              ["Data as a product", "With consumers, quality targets and a lifecycle."],
              ["Self-serve data platform", "So domain teams can publish without specialists."],
              ["Federated computational governance", "Shared rules, enforced automatically."],
            ].map(([t, d], i) => (
              <motion.div
                key={t}
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.08 * i }}
                className="border-line bg-surface rounded-lg border px-3 py-2 text-xs"
              >
                <p className="font-semibold">{t}</p>
                <p className="text-muted">{d}</p>
              </motion.div>
            ))}
          </div>
          <Code>{`# dbt: every group must name an owner
groups:
  - name: finance
    owner:
      name: Finance analytics
      email: finance-data@example.com`}</Code>
        </div>
      }
    >
      <p>
        <Term id="data-mesh">Data mesh</Term>, set out by Zhamak Dehghani in 2019 and given its four
        principles in December 2020, pushes ownership to the domain teams. Even her 2019 article
        asked each domain dataset to publish targets for timeliness and error rates.
      </p>
      <p>
        Whatever the model, catalogues make ownership visible: Unity Catalog, DataHub, OpenMetadata
        and dbt groups all record owners. Prefer teams to individuals, so ownership survives people
        leaving.
      </p>
    </StepLayout>
  );
}

/* 5 ─ Who does it? -------------------------------------------------------------------------------- */

export function WhoDoesIt() {
  return (
    <StepLayout
      eyebrow="Checkpoint"
      title="Who does it?"
      stage={
        <div className="flex flex-1 flex-col justify-center">
          <SortCheckpoint
            id="who-does-it"
            prompt="Who usually does each, in the simplified split?"
            categories={[
              { id: "owner", label: "Owner" },
              { id: "steward", label: "Steward" },
              { id: "consumer", label: "Consumer" },
            ]}
            items={[
              {
                id: "approve",
                label: "Approves a breaking change to the orders contract",
                category: "owner",
                why: "Decisions and accountability.",
              },
              {
                id: "rule",
                label: "Writes the validity rule for email addresses",
                category: "steward",
                why: "Day-to-day care of quality rules.",
              },
              {
                id: "report",
                label: "Notices the dashboard total looks wrong and raises it",
                category: "consumer",
                why: "Users are often first to see problems.",
              },
              {
                id: "access",
                label: "Decides who may see salary data",
                category: "owner",
                why: "Authority over use.",
              },
              {
                id: "define",
                label: "Keeps the glossary definition of 'active customer' up to date",
                category: "steward",
                why: "Definitions are stewardship.",
              },
            ]}
            explanation="Owners decide and answer; stewards look after definitions and quality; consumers use the data and report problems. Real titles vary; what matters is that each job has a name."
          />
        </div>
      }
    >
      <p>Sort the tasks.</p>
    </StepLayout>
  );
}

/* 6 ─ Wrap ---------------------------------------------------------------------------------------- */

const POINTS: [string, string][] = [
  ["No owner, no fix", "Shared data needs a name next to it."],
  ["Closest team", "The producer can fix the source and explain the meaning."],
  ["Owner and steward", "One decides and answers; one looks after it."],
  ["Teams, not people", "Ownership should survive someone leaving."],
  ["Make it visible", "Record owners in the catalogue and contracts."],
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
      <p>Next: turning &ldquo;the data should be fresh&rdquo; into a target an owner can keep.</p>
    </StepLayout>
  );
}
