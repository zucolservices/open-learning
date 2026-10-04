"use client";

import { motion } from "motion/react";
import { useSceneState } from "@/lib/module-sdk";
import { StepLayout } from "@/toolkit/layout/step-layout";
import { SortCheckpoint } from "@/toolkit/checkpoints/sort";
import { Term } from "@/toolkit/glossary/term";
import { cn } from "@/lib/cn";
import { FIELDS, PAIRS, SRULES, SURVIVE, classify, survive, weight, type Rule } from "./model";
import type { DedupState } from "./state";

/* 1 ─ The school reunion -------------------------------------------------------------------------- */

export function Reunion() {
  return (
    <StepLayout
      eyebrow="Story"
      title="The school reunion"
      stage={
        <div className="grid flex-1 content-center gap-3 sm:grid-cols-2">
          {[
            [
              "“Is that… Priya Nair?”",
              "New surname, new city, same birthday and same laugh. Yes, it's her.",
            ],
            [
              "“John Smith! Remember me?”",
              "Same name, wrong face, different birthday. A stranger with a common name.",
            ],
          ].map(([t, d], i) => (
            <motion.div
              key={t}
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 * i }}
              className={cn(
                "rounded-xl border px-4 py-3",
                i === 0 ? "border-good bg-good/10" : "border-bad bg-bad/10",
              )}
            >
              <p className="text-sm font-semibold">{t}</p>
              <p className="text-muted mt-1 text-xs">{d}</p>
            </motion.div>
          ))}
        </div>
      }
    >
      <p>
        At a reunion you recognise people from many small clues. An old friend with a new surname is
        still her; someone who merely shares a common name is not. No single clue decides; you weigh
        them together.
      </p>
      <p>
        <Term id="entity-resolution">Entity resolution</Term> does this for records: deciding which
        rows in one or more systems describe the same real person or thing, without merging
        strangers.
      </p>
    </StepLayout>
  );
}

/* 2 ─ Match two customer lists ⭐ ----------------------------------------------------------------- */

const RULES: { id: Rule; label: string }[] = [
  { id: "email", label: "Exact email" },
  { id: "namepost", label: "Exact name + postcode" },
  { id: "weighted", label: "Weigh every field" },
];

const AG: Record<string, string> = { same: "=", close: "≈", differ: "≠", missing: "–" };

export function Match() {
  const [s, set] = useSceneState<DedupState>();
  const rows = PAIRS.map((p) => ({ p, c: classify(p, s.rule, s.lo, s.hi), w: weight(p) }));
  const found = rows.filter((r) => r.c === "match" && r.p.same).length;
  const wrong = rows.filter((r) => r.c === "match" && !r.p.same).length;
  const missed = rows.filter((r) => r.c === "non" && r.p.same).length;
  const review = rows.filter((r) => r.c === "review").length;
  return (
    <StepLayout
      eyebrow="Simulation"
      title="Match two customer lists"
      stage={
        <div className="flex flex-1 flex-col justify-center gap-3">
          <div className="flex flex-wrap gap-1">
            {RULES.map((r) => (
              <button
                key={r.id}
                type="button"
                aria-pressed={s.rule === r.id}
                onClick={() => set({ rule: r.id })}
                className={cn(
                  "rounded-md border px-2 py-1 text-xs",
                  s.rule === r.id ? "border-accent bg-accent-soft" : "border-line",
                )}
              >
                {r.label}
              </button>
            ))}
          </div>
          {s.rule === "weighted" && (
            <div className="grid gap-2 text-xs sm:grid-cols-2">
              <label className="flex items-center gap-2">
                <span className="text-muted w-20">review from</span>
                <input
                  type="range"
                  min={-4}
                  max={14}
                  value={s.lo}
                  onChange={(e) => set({ lo: Math.min(Number(e.target.value), s.hi) })}
                  className="accent-accent flex-1"
                  aria-label="Lower threshold"
                />
                <span className="w-6 font-mono">{s.lo}</span>
              </label>
              <label className="flex items-center gap-2">
                <span className="text-muted w-20">match from</span>
                <input
                  type="range"
                  min={0}
                  max={24}
                  value={s.hi}
                  onChange={(e) => set({ hi: Math.max(Number(e.target.value), s.lo) })}
                  className="accent-accent flex-1"
                  aria-label="Upper threshold"
                />
                <span className="w-6 font-mono">{s.hi}</span>
              </label>
            </div>
          )}
          <div className="border-line bg-surface overflow-x-auto rounded-xl border p-2">
            <table className="w-full text-[11px]">
              <thead>
                <tr className="text-muted text-[10px]">
                  <th className="px-1 text-left font-normal">CRM · billing</th>
                  {FIELDS.map((f) => (
                    <th key={f} className="px-1 font-normal">
                      {f}
                    </th>
                  ))}
                  <th className="px-1 font-normal">weight</th>
                  <th className="px-1 text-left font-normal">decision</th>
                </tr>
              </thead>
              <tbody>
                {rows.map(({ p, c, w }) => {
                  const right = (c === "match" && p.same) || (c === "non" && !p.same);
                  return (
                    <tr key={p.id} className="border-line border-t" title={p.note}>
                      <td className="px-1 py-1 whitespace-nowrap">
                        {p.a} · <span className="text-muted">{p.b}</span>
                      </td>
                      {FIELDS.map((f) => (
                        <td
                          key={f}
                          className={cn(
                            "px-1 text-center font-mono",
                            p.agree[f] === "same"
                              ? "text-good"
                              : p.agree[f] === "differ"
                                ? "text-bad"
                                : "text-muted",
                          )}
                        >
                          {AG[p.agree[f]]}
                        </td>
                      ))}
                      <td className="px-1 text-center font-mono">
                        {s.rule === "weighted" ? w : "·"}
                      </td>
                      <td className="px-1 whitespace-nowrap">
                        <span
                          className={cn(
                            "rounded px-1.5 py-0.5 text-[10px]",
                            c === "review"
                              ? "bg-viz-compute/15"
                              : right
                                ? "bg-good/15 text-good"
                                : "bg-bad/15 text-bad",
                          )}
                        >
                          {c === "match"
                            ? "merge"
                            : c === "review"
                              ? "person reviews"
                              : "keep apart"}
                          {c !== "review" && !right && (p.same ? " (missed)" : " (strangers!)")}
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
          <p className="text-xs">
            <span className="text-good font-semibold">{found} of 5</span> real duplicates merged ·{" "}
            <span className={cn("font-semibold", wrong ? "text-bad" : "text-good")}>
              {wrong} strangers merged
            </span>{" "}
            · {missed} missed · {review} sent to a person
          </p>
          <p className="text-subtle text-[10px]">
            = agrees · ≈ close · ≠ differs · – missing. Made-up records; weights are illustrative.
          </p>
        </div>
      }
    >
      <p>
        Eight candidate pairs from a CRM and a billing system. Five are the same person. Exact email
        is safe but misses anyone who changed address or left it blank. Exact name plus postcode
        merges a father and son.
      </p>
      <p>
        Weighing every field works like the reunion: agreeing on a rare value (an email) is strong
        evidence; agreeing on a common one (a postcode) is weak; a different birth date counts
        heavily against. Set the two thresholds so uncertain pairs go to a person instead of being
        guessed.
      </p>
    </StepLayout>
  );
}

/* 3 ─ Close enough -------------------------------------------------------------------------------- */

export function Fuzzy() {
  const items: [string, string, string][] = [
    [
      "Levenshtein distance (1965)",
      "Fewest single-letter edits to turn one string into another.",
      "Mohammed → Mohamed: 1",
    ],
    [
      "Jaro–Winkler (1989–90)",
      "Similarity from 0 to 1, with extra credit for a shared start; good for names.",
      "Martha vs Marhta: high",
    ],
    [
      "Soundex (patented 1918)",
      "Codes a surname by how it sounds: a letter plus three digits.",
      "Smith, Smyth: S530",
    ],
  ];
  return (
    <StepLayout
      eyebrow="Explore"
      title="Close enough"
      stage={
        <div className="flex flex-1 flex-col justify-center gap-3">
          {items.map(([t, d, e], i) => (
            <motion.div
              key={t}
              initial={{ opacity: 0, x: -6 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1 * i }}
              className="border-line bg-surface rounded-lg border px-3 py-2 text-xs"
            >
              <p className="font-semibold">{t}</p>
              <p className="text-muted">{d}</p>
              <p className="text-accent mt-0.5 font-mono">{e}</p>
            </motion.div>
          ))}
          <div className="border-line bg-surface rounded-lg border px-3 py-2 text-xs">
            <p className="font-semibold">Blocking</p>
            <p className="text-muted">
              Two lists of a million rows make a million million pairs. Compare only pairs that
              share a key (same postcode, same Soundex code), and use several keys so a typo in one
              doesn&apos;t hide a match.
            </p>
          </div>
        </div>
      }
    >
      <p>
        The ≈ in the table comes from fuzzy comparisons, which score how close two strings are
        instead of demanding an exact match.
      </p>
      <p>
        The weighting idea is Fellegi and Sunter&apos;s, from 1969: for each field, compare how
        often it agrees for true matches (m) with how often it agrees by coincidence (u).
        Open-source Splink (from the UK Ministry of Justice) uses it; dedupe and Zingg instead learn
        from pairs a person labels.
      </p>
    </StepLayout>
  );
}

/* 4 ─ The golden record --------------------------------------------------------------------------- */

export function Golden() {
  const [s, set] = useSceneState<DedupState>();
  const rules = s.survive ?? {};
  return (
    <StepLayout
      eyebrow="Explore"
      title="The golden record"
      stage={
        <div className="flex flex-1 flex-col justify-center gap-2">
          <div className="text-muted grid grid-cols-[4.5rem_1fr_1fr_1.2fr] gap-2 px-2 text-[10px]">
            <span>FIELD</span>
            <span>CRM (2023)</span>
            <span>BILLING (2026)</span>
            <span>RULE → KEEP</span>
          </div>
          {SURVIVE.map((row) => {
            const r = rules[row.field] ?? "recent";
            const kept = survive(row, r);
            return (
              <div
                key={row.field}
                className="border-line bg-surface grid grid-cols-[4.5rem_1fr_1fr_1.2fr] items-center gap-2 rounded-lg border px-2 py-2 text-[11px]"
              >
                <span className="font-semibold">{row.field}</span>
                <span
                  className={cn(
                    "font-mono break-all",
                    kept === row.crm && "text-accent font-semibold",
                  )}
                >
                  {row.crm}
                </span>
                <span
                  className={cn(
                    "font-mono break-all",
                    kept === row.billing && "text-accent font-semibold",
                  )}
                >
                  {row.billing}
                </span>
                <span className="flex flex-wrap gap-1">
                  {SRULES.map((o) => (
                    <button
                      key={o.id}
                      type="button"
                      aria-label={`${row.field}: ${o.label}`}
                      aria-pressed={r === o.id}
                      onClick={() => set({ survive: { ...rules, [row.field]: o.id } })}
                      className={cn(
                        "rounded border px-1 text-[10px]",
                        r === o.id ? "border-accent bg-accent-soft" : "border-line",
                      )}
                    >
                      {o.label}
                    </button>
                  ))}
                </span>
              </div>
            );
          })}
          <div className="border-accent bg-accent-soft rounded-lg border px-3 py-2 text-xs">
            <span className="font-semibold">Golden record: </span>
            {SURVIVE.map((row) => survive(row, rules[row.field] ?? "recent")).join(" · ")}
          </div>
        </div>
      }
    >
      <p>
        Once two records are matched, which values survive?{" "}
        <Term id="survivorship">Survivorship</Term> rules pick per field: the most recent email, the
        most complete name, the address from the system you trust for addresses.
      </p>
      <p>
        Try &ldquo;most recent&rdquo; for the name: you&apos;d keep the initials. Keeping one
        trusted, merged version of key records such as customers and products is the job of{" "}
        <Term id="master-data-management">master data management</Term>.
      </p>
    </StepLayout>
  );
}

/* 5 ─ Strong or weak evidence? -------------------------------------------------------------------- */

export function Evidence() {
  return (
    <StepLayout
      eyebrow="Checkpoint"
      title="Strong or weak evidence?"
      stage={
        <div className="flex flex-1 flex-col justify-center">
          <SortCheckpoint
            id="match-evidence"
            prompt="How much does each agreement suggest two records are the same person?"
            categories={[
              { id: "strong", label: "Strong evidence" },
              { id: "weak", label: "Weak evidence" },
            ]}
            items={[
              {
                id: "email",
                label: "Both have the same personal email address",
                category: "strong",
                why: "Rarely shared by coincidence.",
              },
              {
                id: "city",
                label: "Both live in London",
                category: "weak",
                why: "Millions of people do.",
              },
              {
                id: "surname",
                label: "Both have the rare surname Wojciechowska",
                category: "strong",
                why: "Rare values carry more weight.",
              },
              {
                id: "smith",
                label: "Both are called John Smith",
                category: "weak",
                why: "A very common name.",
              },
              {
                id: "phone",
                label: "Both have the same mobile number",
                category: "strong",
                why: "Usually one person each.",
              },
            ]}
            explanation="Agreement on a value that's rare by coincidence (low u) is strong evidence; agreement on a common value is weak. That's the heart of Fellegi–Sunter."
          />
        </div>
      }
    >
      <p>Sort the clues.</p>
    </StepLayout>
  );
}

/* 6 ─ Wrap ---------------------------------------------------------------------------------------- */

const POINTS: [string, string][] = [
  ["Weigh the clues", "Rare agreements count most; disagreements count against."],
  ["Two thresholds", "Merge, keep apart, or send to a person."],
  ["Fuzzy comparisons", "Edit distance, Jaro–Winkler, Soundex."],
  ["Block the pairs", "Only compare plausible candidates."],
  ["Survivorship", "Choose per field which value wins."],
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
      <p>Next: proving a copy of the data matches its source.</p>
    </StepLayout>
  );
}
