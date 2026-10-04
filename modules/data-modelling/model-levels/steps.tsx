"use client";

import { motion } from "motion/react";
import { useSceneState } from "@/lib/module-sdk";
import { StepLayout } from "@/toolkit/layout/step-layout";
import { SortCheckpoint } from "@/toolkit/checkpoints/sort";
import { Code, FrameCaption, Stepper } from "@/toolkit/controls/stepper";
import { Term } from "@/toolkit/glossary/term";
import { cn } from "@/lib/cn";
import {
  CARDS,
  CONCEPT_LINKS,
  DECIDES,
  ENTITIES,
  LOGICAL,
  PHYSICAL,
  TALK,
  type Card,
} from "./model";
import { LEVELS, type LevelState } from "./state";

/* 1 ─ From sketch to blueprint -------------------------------------------------------------------- */

export function Architect() {
  const rows: [string, string][] = [
    [
      "The sketch",
      "Three bedrooms, kitchen opens onto the garden. Something the family can argue about.",
    ],
    ["The plan", "Every room with its size and every door, but no brand of brick yet."],
    [
      "The blueprint",
      "Wall thickness, pipe sizes, which supplier's windows. What the builder needs.",
    ],
  ];
  return (
    <StepLayout
      eyebrow="Story"
      title="From sketch to blueprint"
      stage={
        <div className="flex flex-1 flex-col justify-center gap-2">
          {rows.map(([t, d], i) => (
            <motion.div
              key={t}
              initial={{ opacity: 0, x: -6 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.15 * i }}
              className="border-line bg-surface rounded-xl border px-4 py-3"
              style={{ marginLeft: `${i * 16}px` }}
            >
              <p className="text-sm font-semibold">{t}</p>
              <p className="text-muted text-xs">{d}</p>
            </motion.div>
          ))}
        </div>
      }
    >
      <p>
        An architect doesn&apos;t start with pipe sizes. First a sketch the family can understand,
        then a detailed plan, then a blueprint for one builder. Each adds detail; each is for a
        different reader.
      </p>
      <p>
        Data models go through the same three stages: a{" "}
        <Term id="conceptual-model">conceptual</Term> model of what the business means, a{" "}
        <Term id="logical-model">logical</Term> model with every attribute and key, and a{" "}
        <Term id="physical-model">physical</Term> model for one particular database.
      </p>
    </StepLayout>
  );
}

/* 2 ─ A library, three ways ⭐ -------------------------------------------------------------------- */

function Conceptual() {
  return (
    <div className="flex flex-col items-center gap-3">
      <div className="grid grid-cols-2 gap-x-16 gap-y-6">
        {ENTITIES.map((e, i) => (
          <motion.div
            key={e}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.08 * i }}
            className="border-viz-data bg-viz-data/10 rounded-lg border px-4 py-2 text-center text-sm font-semibold"
          >
            {e}
          </motion.div>
        ))}
      </div>
      <div className="flex flex-col gap-1">
        {CONCEPT_LINKS.map(([a, verb, b]) => (
          <p key={a + b} className="text-xs">
            <span className="font-semibold">{a}</span>{" "}
            <span className="text-accent italic">{verb}</span>{" "}
            <span className="font-semibold">{b}</span>
          </p>
        ))}
      </div>
    </div>
  );
}

function Logical() {
  return (
    <div className="grid grid-cols-2 gap-2">
      {LOGICAL.map((t, i) => (
        <motion.div
          key={t.name}
          initial={{ opacity: 0, y: 4 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.06 * i }}
          className="border-viz-data overflow-hidden rounded-lg border text-[11px]"
        >
          <p className="bg-viz-data/15 px-2 py-1 font-semibold">{t.name}</p>
          {t.attrs.map(([a, k]) => (
            <p
              key={a}
              className="border-line flex justify-between gap-2 border-t px-2 py-0.5 font-mono"
            >
              <span className={cn(k === "PK" && "underline")}>{a}</span>
              <span className={cn("text-[9px]", k.startsWith("FK") ? "text-accent" : "text-muted")}>
                {k}
              </span>
            </p>
          ))}
        </motion.div>
      ))}
    </div>
  );
}

export function ThreeLevels() {
  const [s, set] = useSceneState<LevelState>();
  const lvl = LEVELS[s.level] ?? "talk";
  const titles = ["The conversation", "Conceptual", "Logical", "Physical"];
  return (
    <StepLayout
      eyebrow="Step through"
      title="A library, three ways"
      stage={
        <div className="flex flex-1 flex-col justify-center gap-3">
          <Stepper
            step={s.level}
            count={LEVELS.length}
            onChange={(n) => set({ level: n })}
            label={titles[s.level]}
          />
          <motion.div
            key={lvl}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="min-h-56"
          >
            {lvl === "talk" && (
              <div className="flex flex-col gap-1.5">
                {TALK.map(([who, line], i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, x: who === "You" ? 8 : -8 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.15 * i }}
                    className={cn(
                      "max-w-[85%] rounded-xl border px-3 py-2 text-xs",
                      who === "You"
                        ? "border-accent bg-accent-soft self-end"
                        : "border-line bg-surface self-start",
                    )}
                  >
                    <p className="text-muted text-[10px]">{who}</p>
                    {line}
                  </motion.div>
                ))}
              </div>
            )}
            {lvl === "conceptual" && <Conceptual />}
            {lvl === "logical" && <Logical />}
            {lvl === "physical" && <Code>{PHYSICAL}</Code>}
          </motion.div>
          {lvl !== "talk" && (
            <FrameCaption
              frameKey={lvl}
              title={`${titles[s.level]}: for ${DECIDES[lvl].who.toLowerCase()}`}
            >
              {DECIDES[lvl].decides.join(" · ")}
            </FrameCaption>
          )}
        </div>
      }
    >
      <p>
        Start with a conversation with a librarian, then step through the three models it turns
        into. Notice what each level adds, and what it still leaves open.
      </p>
      <p>
        The conceptual model is a few boxes and verbs anyone can check. The logical model adds every
        attribute and the keys (module 3), and turns &ldquo;members borrow copies&rdquo; into a Loan
        entity. The physical model is real SQL for one database. Agile teams often skip a separate
        logical model, but they still make its decisions.
      </p>
    </StepLayout>
  );
}

/* 3 ─ Drawing relationships ----------------------------------------------------------------------- */

function CrowEnd({ x, many, left }: { x: number; many: boolean; left: boolean }) {
  const d = left ? 1 : -1;
  return many ? (
    <g className="stroke-accent" strokeWidth={1.5}>
      <path
        d={`M${x + d * 14} 40 L${x} 30 M${x + d * 14} 40 L${x} 50 M${x + d * 14} 40 L${x} 40`}
      />
    </g>
  ) : (
    <g className="stroke-accent" strokeWidth={1.5}>
      <path d={`M${x + d * 8} 32 V48 M${x + d * 12} 32 V48`} />
    </g>
  );
}

export function Notation() {
  const [s, set] = useSceneState<LevelState>();
  const c = CARDS[s.card];
  const leftMany = s.card === "n-n";
  const rightMany = s.card !== "1-1";
  return (
    <StepLayout
      eyebrow="Explore"
      title="Drawing relationships"
      stage={
        <div className="flex flex-1 flex-col justify-center gap-3">
          <div className="flex flex-wrap gap-1.5">
            {(Object.keys(CARDS) as Card[]).map((k) => (
              <button
                key={k}
                type="button"
                aria-pressed={s.card === k}
                onClick={() => set({ card: k })}
                className={cn(
                  "rounded-full border px-3 py-1 text-xs",
                  s.card === k ? "border-accent bg-accent-soft" : "border-line",
                )}
              >
                {CARDS[k].label}
              </button>
            ))}
            <span className="text-line">|</span>
            {[
              [false, "crow's foot"],
              [true, "Chen (1976)"],
            ].map(([v, l]) => (
              <button
                key={String(v)}
                type="button"
                aria-pressed={s.chen === v}
                onClick={() => set({ chen: v as boolean })}
                className={cn(
                  "rounded-full border px-3 py-1 text-xs",
                  s.chen === v ? "border-accent bg-accent-soft" : "border-line",
                )}
              >
                {l as string}
              </button>
            ))}
          </div>
          <svg
            viewBox="0 0 300 80"
            className="w-full max-w-md self-center"
            role="img"
            aria-label={`${c.example[0]} to ${c.example[1]}, ${c.label}`}
          >
            <rect
              x={6}
              y={26}
              width={80}
              height={28}
              rx={s.chen ? 0 : 4}
              className="fill-viz-data/10 stroke-viz-data"
            />
            <text x={46} y={44} textAnchor="middle" className="fill-fg text-[10px]">
              {c.example[0]}
            </text>
            <rect
              x={214}
              y={26}
              width={80}
              height={28}
              rx={s.chen ? 0 : 4}
              className="fill-viz-data/10 stroke-viz-data"
            />
            <text x={254} y={44} textAnchor="middle" className="fill-fg text-[10px]">
              {c.example[1]}
            </text>
            {s.chen ? (
              <>
                <path d="M86 40 H118 M182 40 H214" className="stroke-line-strong" />
                <polygon
                  points="150,22 182,40 150,58 118,40"
                  className="fill-accent/15 stroke-accent"
                />
                <text x={150} y={43} textAnchor="middle" className="fill-fg text-[8px]">
                  {s.card === "n-n" ? "borrows" : "has"}
                </text>
                <text x={100} y={34} textAnchor="middle" className="fill-accent text-[10px]">
                  {leftMany ? "M" : "1"}
                </text>
                <text x={200} y={34} textAnchor="middle" className="fill-accent text-[10px]">
                  {rightMany ? (leftMany ? "N" : "N") : "1"}
                </text>
              </>
            ) : (
              <>
                <path d="M86 40 H214" className="stroke-line-strong" />
                <CrowEnd x={86} many={leftMany} left />
                <CrowEnd x={214} many={rightMany} left={false} />
              </>
            )}
          </svg>
          <motion.p
            key={s.card}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-muted text-center text-xs"
          >
            {c.note}
          </motion.p>
        </div>
      }
    >
      <p>
        An <Term id="er-diagram">entity-relationship diagram</Term> draws entities as boxes and
        relationships as lines. Peter Chen introduced the idea in 1976, with diamonds for
        relationships. The <Term id="crows-foot">crow&apos;s foot</Term> symbol for
        &ldquo;many&rdquo;, now the most common style, is credited to Gordon Everest&apos;s paper
        the same year.
      </p>
      <p>
        Pick a <Term id="cardinality">cardinality</Term> and a notation. A bar means one; the
        three-pronged foot means many.
      </p>
    </StepLayout>
  );
}

/* 4 ─ Three levels, two meanings ------------------------------------------------------------------ */

export function NotTheSame() {
  return (
    <StepLayout
      eyebrow="Explore"
      title="Three levels, two meanings"
      stage={
        <div className="flex flex-1 flex-col justify-center gap-3">
          <div className="grid gap-2 sm:grid-cols-2">
            <div className="border-accent bg-accent-soft rounded-xl border px-4 py-3 text-xs">
              <p className="text-sm font-semibold">Stages of design</p>
              <p className="text-muted">conceptual → logical → physical</p>
              <p className="mt-2">
                How a model is worked out, from meaning to a specific database. This track uses
                these.
              </p>
            </div>
            <div className="border-line bg-surface rounded-xl border px-4 py-3 text-xs">
              <p className="text-sm font-semibold">ANSI/SPARC, 1975</p>
              <p className="text-muted">external · conceptual · internal</p>
              <p className="mt-2">
                Layers inside a running database: each user&apos;s view, the whole community&apos;s
                view, and storage. Meant to let each change without breaking the others.
              </p>
            </div>
          </div>
          <p className="text-muted text-center text-xs">
            Both have a &ldquo;conceptual&rdquo; level, but a physical model is not the same as an
            internal schema, and ANSI/SPARC has no logical model.
          </p>
        </div>
      }
    >
      <p>
        You&apos;ll meet another set of three levels in database books: the ANSI/SPARC architecture
        from 1975. It describes how a database separates users&apos; views from storage, not how a
        designer works.
      </p>
      <p>
        The names overlap, which causes confusion. When someone says &ldquo;the conceptual
        level&rdquo;, it&apos;s worth asking which they mean.
      </p>
    </StepLayout>
  );
}

/* 5 ─ Which level decides? ------------------------------------------------------------------------ */

export function WhichLevel() {
  return (
    <StepLayout
      eyebrow="Checkpoint"
      title="Which level decides?"
      stage={
        <div className="flex flex-1 flex-col justify-center">
          <SortCheckpoint
            id="which-level"
            prompt="At which level is each decision usually made?"
            categories={[
              { id: "c", label: "Conceptual" },
              { id: "l", label: "Logical" },
              { id: "p", label: "Physical" },
            ]}
            items={[
              {
                id: "track",
                label: "We keep track of members, books and loans",
                category: "c",
                why: "What matters to the business.",
              },
              {
                id: "borrow",
                label: "A member can borrow many books",
                category: "c",
                why: "A relationship in plain words.",
              },
              {
                id: "fk",
                label: "Loan holds member_id and copy_id, pointing at Member and Copy",
                category: "l",
                why: "Keys and attributes, no database yet.",
              },
              {
                id: "barcode",
                label: "Every copy has a unique barcode",
                category: "l",
                why: "An attribute and a uniqueness rule.",
              },
              {
                id: "bigint",
                label: "member_id is a BIGINT identity column",
                category: "p",
                why: "A type in one database.",
              },
              {
                id: "index",
                label: "Add a partial index on open loans",
                category: "p",
                why: "A performance choice for PostgreSQL.",
              },
            ]}
            explanation="Conceptual: what things and rules matter. Logical: every attribute, key and exact relationship. Physical: types, indexes and features of one database."
          />
        </div>
      }
    >
      <p>Sort the decisions.</p>
    </StepLayout>
  );
}

/* 6 ─ Wrap ---------------------------------------------------------------------------------------- */

const POINTS: [string, string][] = [
  ["Conceptual", "Things and rules, in the business's words."],
  ["Logical", "Every attribute, key and relationship; no product yet."],
  ["Physical", "Tables, types and indexes for one database."],
  ["ER diagrams", "Chen 1976; crow's foot for many."],
  ["Many-to-many", "Becomes a table in between."],
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
      <p>Next: keys, the way each row is identified and tables point at each other.</p>
    </StepLayout>
  );
}
