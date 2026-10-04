"use client";

import { motion } from "motion/react";
import { useSceneState } from "@/lib/module-sdk";
import { StepLayout } from "@/toolkit/layout/step-layout";
import { SortCheckpoint } from "@/toolkit/checkpoints/sort";
import { Segmented } from "@/toolkit/controls/segmented";
import { Code } from "@/toolkit/controls/stepper";
import { Term } from "@/toolkit/glossary/term";
import { cn } from "@/lib/cn";
import { FITNESS, SECTIONS, TITLE } from "./model";
import type { AdrState } from "./state";

/* 1 ─ What were they thinking? -------------------------------------------------------------------- */

export function WhatWereThey() {
  return (
    <StepLayout
      eyebrow="Story"
      title="What were they thinking?"
      stage={
        <div className="flex flex-1 flex-col justify-center gap-3">
          <Code>{`// claims/domain/ApproveClaim.java
// Why does everything go through this PolicyStore interface?
// There's only one implementation. Delete it?`}</Code>
          <div className="grid gap-2 sm:grid-cols-2">
            <div className="border-line bg-surface rounded-lg border px-3 py-2 text-xs">
              <p className="font-semibold">Blindly accept</p>
              <p className="text-muted">Keep it forever, even after the reason has gone.</p>
            </div>
            <div className="border-line bg-surface rounded-lg border px-3 py-2 text-xs">
              <p className="font-semibold">Blindly change</p>
              <p className="text-muted">
                Delete it, and break the mainframe migration planned for next year.
              </p>
            </div>
          </div>
        </div>
      }
    >
      <p>
        A new developer finds an odd design choice. Nobody who made it is still on the team. Michael
        Nygard, in 2011, described the two options they&apos;re left with: blindly accept the
        decision, or blindly change it. Both can be expensive.
      </p>
      <p>
        His fix was the <Term id="adr">architecture decision record</Term>: a short note, kept with
        the code, for each &ldquo;architecturally significant&rdquo; decision, written &ldquo;as if
        it is a conversation with a future developer.&rdquo;
      </p>
    </StepLayout>
  );
}

/* 2 ─ Write it, then guard it ⭐ ------------------------------------------------------------------ */

export function WriteAndGuard() {
  const [s, set] = useSceneState<AdrState>();
  const picks = s.picks ?? {};
  const complete = SECTIONS.every((sec) => picks[sec.id] !== undefined);
  const allGood = complete && SECTIONS.every((sec) => sec.options[picks[sec.id]].good);
  return (
    <StepLayout
      eyebrow="Simulation"
      title="Write it, then guard it"
      stage={
        <div className="flex flex-1 flex-col justify-center gap-3">
          <p className="font-mono text-xs font-semibold">{TITLE}</p>
          {SECTIONS.map((sec) => (
            <div key={sec.id} className="flex flex-col gap-1">
              <p className="text-muted text-[10px] uppercase">{sec.name}</p>
              {sec.options.map((o, i) => (
                <button
                  key={i}
                  type="button"
                  aria-pressed={picks[sec.id] === i}
                  onClick={() => set({ picks: { ...picks, [sec.id]: i } })}
                  className={cn(
                    "rounded-lg border px-3 py-1.5 text-left text-xs",
                    picks[sec.id] === i
                      ? o.good
                        ? "border-good/50 bg-good/10"
                        : "border-bad/50 bg-bad/10"
                      : "border-line hover:bg-surface-2",
                  )}
                >
                  {o.text}
                  {picks[sec.id] === i && (
                    <span className="text-muted mt-0.5 block text-[10px]">{o.why}</span>
                  )}
                </button>
              ))}
            </div>
          ))}
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-muted text-[10px] uppercase">Status</span>
            <Segmented<AdrState["status"]>
              size="sm"
              value={s.status}
              onChange={(status) => set({ status })}
              options={[
                ["proposed", "Proposed"],
                ["accepted", "Accepted"],
                ["superseded", "Superseded"],
              ]}
            />
          </div>
          {allGood && s.status === "accepted" && (
            <motion.div
              initial={{ opacity: 0, y: 4 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex flex-col gap-2"
            >
              {!s.fitness ? (
                <button
                  type="button"
                  onClick={() => set({ fitness: true })}
                  className="bg-accent text-accent-fg self-start rounded-md px-3 py-1.5 text-xs font-medium"
                >
                  Turn the decision into an automated check
                </button>
              ) : (
                <>
                  <Code>{FITNESS}</Code>
                  <button
                    type="button"
                    onClick={() => set({ commit: !s.commit })}
                    className="border-line hover:bg-surface-2 self-start rounded-md border px-3 py-1.5 text-xs"
                  >
                    {s.commit
                      ? "Undo the commit"
                      : "Simulate a commit that imports JDBC into the domain"}
                  </button>
                  <p
                    className={cn(
                      "rounded-lg border px-3 py-2 font-mono text-[11px]",
                      s.commit ? "border-bad/50 bg-bad/10" : "border-good/50 bg-good/10",
                    )}
                  >
                    {s.commit
                      ? "CI ✗ domain_is_independent: ApproveClaim depends on java.sql.Connection (ADR 7: claims rules stay independent of storage)"
                      : "CI ✓ all architecture rules pass"}
                  </p>
                </>
              )}
            </motion.div>
          )}
          {complete && !allGood && (
            <p className="text-muted text-xs">
              Pick the stronger option in each section to finish the record.
            </p>
          )}
          {allGood && s.status !== "accepted" && (
            <p className="text-muted text-xs">
              A good record. Mark it accepted once the team agrees.
            </p>
          )}
        </div>
      }
    >
      <p>
        Write the record for a decision from module 13: keep the claims rules free of database code.
        Pick the stronger wording for each section, accept it, then turn it into an automated check
        and try to break it.
      </p>
      <p>
        That check is a <Term id="fitness-function">fitness function</Term>, from &ldquo;Building
        Evolutionary Architectures&rdquo; (Ford, Parsons and Kua, 2017): it &ldquo;provides an
        objective integrity assessment of some architectural characteristic(s).&rdquo; The example
        is written with ArchUnit, which checks Java architecture inside ordinary unit tests.
      </p>
    </StepLayout>
  );
}

/* 3 ─ Five short sections ------------------------------------------------------------------------- */

const PARTS: [string, string][] = [
  ["Title", "A short noun phrase, numbered: “ADR 9: LDAP for Multitenant Integration”."],
  ["Context", "The forces at play, technological, political, social, in value-neutral language."],
  ["Decision", "Full sentences, active voice: “We will …”"],
  [
    "Status",
    "Proposed, accepted, or later deprecated or superseded, with a link to the replacement.",
  ],
  ["Consequences", "“All consequences should be listed here, not just the ‘positive’ ones.”"],
];

export function FiveParts() {
  return (
    <StepLayout
      eyebrow="Explore"
      title="Five short sections"
      stage={
        <div className="flex flex-1 flex-col justify-center gap-1.5">
          {PARTS.map(([t, d], i) => (
            <motion.div
              key={t}
              initial={{ opacity: 0, x: -6 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.06 * i }}
              className="border-line bg-surface grid grid-cols-[6.5rem_1fr] gap-2 rounded-lg border px-3 py-2"
            >
              <span className="text-sm font-semibold">{t}</span>
              <span className="text-muted text-xs">{d}</span>
            </motion.div>
          ))}
        </div>
      }
    >
      <p>
        Nygard&apos;s format, in his order. One or two pages at most: &ldquo;Large documents are
        never kept up to date.&rdquo; Records are numbered and never reused; a reversed decision
        stays, marked superseded, so the history survives.
      </p>
      <p>
        Thoughtworks&apos; Technology Radar moved lightweight ADRs to Adopt in 2017, recommending
        storing them in source control, next to the code. The popular MADR template (Markdown
        Architectural Decision Records, version 4.0.0 from 2024) adds optional sections for the
        options considered.
      </p>
    </StepLayout>
  );
}

/* 4 ─ Fitness functions --------------------------------------------------------------------------- */

const KINDS: [string, string][] = [
  [
    "Architecture tests",
    "ArchUnit (Java), NetArchTest (.NET), dependency-cruiser (JavaScript and TypeScript), import-linter (Python): no forbidden dependencies, no cycles, layers respected.",
  ],
  ["Performance budgets", "The checkout page must render in under 1 second in the CI benchmark."],
  ["Resilience tests", "Netflix's Chaos Monkey switches off servers to prove the system copes."],
  ["Security and compliance", "No personal data in logs; every service has an owner tag."],
];

export function Fitness() {
  return (
    <StepLayout
      eyebrow="Explore"
      title="Fitness functions"
      stage={
        <div className="flex flex-1 flex-col justify-center gap-2">
          {KINDS.map(([t, d], i) => (
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
          <Code>{`// .dependency-cruiser.js
{ name: "no-ui-in-domain", severity: "error",
  from: { path: "^src/domain" }, to: { path: "^src/ui" } }`}</Code>
        </div>
      }
    >
      <p>
        An ADR records an intention; a fitness function checks it on every build. The book&apos;s
        authors say fitness functions cover familiar practices such as tests and metrics, and also
        things like Chaos Monkey. The second edition (2022, with Pramod Sadalage) is subtitled
        &ldquo;Automated Software Governance&rdquo;.
      </p>
      <p>
        Good candidates are the rules most likely to erode quietly: dependency directions, module
        boundaries, performance and data protection. Link each check back to its ADR, as the
        ArchUnit example does with <code>.because()</code>.
      </p>
    </StepLayout>
  );
}

/* 5 ─ Worth a record? ----------------------------------------------------------------------------- */

export function WorthIt() {
  return (
    <StepLayout
      eyebrow="Checkpoint"
      title="Worth a record?"
      stage={
        <div className="flex flex-1 flex-col justify-center">
          <SortCheckpoint
            id="worth-adr"
            prompt="Which decisions deserve an architecture decision record?"
            categories={[
              { id: "adr", label: "Write an ADR" },
              { id: "no", label: "Not architectural" },
            ]}
            items={[
              {
                id: "events",
                label: "Contexts will integrate through events on a broker, not direct calls",
                category: "adr",
                why: "Affects structure and every team's dependencies.",
              },
              {
                id: "db",
                label: "Use PostgreSQL rather than a document database for claims",
                category: "adr",
                why: "A long-lived technology choice with consequences.",
              },
              {
                id: "modular",
                label: "Start as a modular monolith; split services out later",
                category: "adr",
                why: "Shapes deployment and teams.",
              },
              {
                id: "name",
                label: "Rename a local variable to make a function clearer",
                category: "no",
                why: "Code-level; no lasting structural effect.",
              },
              {
                id: "colour",
                label: "Change a button colour",
                category: "no",
                why: "Not architecturally significant.",
              },
            ]}
            explanation="Nygard: record decisions that affect “the structure, non-functional characteristics, dependencies, interfaces, or construction techniques”."
          />
        </div>
      }
    >
      <p>Not every decision needs a record. Sort them.</p>
    </StepLayout>
  );
}

/* 6 ─ Wrap ---------------------------------------------------------------------------------------- */

const POINTS: [string, string][] = [
  ["Record the why", "Context, decision, consequences: one or two pages."],
  ["Keep them with the code", "In source control, numbered, never deleted."],
  ["Supersede, don't erase", "History matters to the next reader."],
  ["Automate the rule", "Fitness functions check decisions on every build."],
  ["Significant only", "Structure, dependencies, interfaces, qualities."],
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
        Decisions inside one system are one thing. Next: seeing across hundreds of systems, with
        diagrams, maps, radars and governance that helps rather than blocks.
      </p>
    </StepLayout>
  );
}
