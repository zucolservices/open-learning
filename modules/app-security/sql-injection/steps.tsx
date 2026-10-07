"use client";

import { motion } from "motion/react";
import { useSceneState } from "@/lib/module-sdk";
import { StepLayout } from "@/toolkit/layout/step-layout";
import { SortCheckpoint } from "@/toolkit/checkpoints/sort";
import { Code } from "@/toolkit/controls/stepper";
import { Term } from "@/toolkit/glossary/term";
import { cn } from "@/lib/cn";
import { CASES, INPUTS, run } from "./model";
import type { SqlState } from "./state";

/* 1 ─ A form with a blank to fill ----------------------------------------------------------------- */

export function FillTheForm() {
  return (
    <StepLayout
      eyebrow="Story"
      title="A form with a blank to fill"
      stage={
        <div className="flex flex-1 flex-col items-center justify-center gap-3">
          <div className="border-line bg-surface w-full max-w-sm rounded-xl border px-5 py-4 text-sm">
            <p>
              Please pay the bearer{" "}
              <span className="border-accent text-accent border-b-2 px-1">Ravi Kumar</span> the sum
              of ₹500.
            </p>
          </div>
          <div className="border-bad bg-bad/10 w-full max-w-sm rounded-xl border px-5 py-4 text-sm">
            <p>
              Please pay the bearer{" "}
              <span className="border-bad text-bad border-b-2 px-1">
                Ravi Kumar ₹500, and also pay Ravi everything in the vault,
              </span>{" "}
              the sum of ₹500.
            </p>
          </div>
          <p className="text-subtle text-[10px]">
            The second filler doesn&apos;t fill the blank; it rewrites the instruction.
          </p>
        </div>
      }
    >
      <p>
        Imagine a bank clerk who follows any written instruction exactly. A payment slip has a blank
        for the name. Someone writes, in the blank, words that read as more instructions. A careless
        clerk follows the whole sentence.
      </p>
      <p>
        <Term id="sql-injection">SQL injection</Term> is that mistake in software. An app builds a
        database command by pasting what a user typed into the text of the command. If the input is
        written in the database&apos;s own language, it stops being a name and becomes part of the
        instruction.
      </p>
    </StepLayout>
  );
}

/* 2 ─ Watch the query change ⭐ ------------------------------------------------------------------- */

export function QueryLab() {
  const [s, set] = useSceneState<SqlState>();
  const inp = INPUTS.find((i) => i.id === s.input) ?? INPUTS[0];
  const out = run(s.input, s.mode);
  return (
    <StepLayout
      eyebrow="Simulation"
      title="Watch the query change"
      stage={
        <div className="flex flex-1 flex-col justify-center gap-3">
          <div className="flex flex-col gap-1">
            <p className="text-muted text-[10px] uppercase">What goes in the username box</p>
            {INPUTS.map((i) => (
              <button
                key={i.id}
                type="button"
                aria-pressed={s.input === i.id}
                onClick={() => set({ input: i.id })}
                className={cn(
                  "rounded-lg border px-3 py-1.5 text-left text-xs",
                  s.input === i.id ? "border-accent bg-accent-soft" : "border-line bg-surface",
                )}
              >
                {i.label}
              </button>
            ))}
          </div>
          <div className="flex flex-wrap gap-1.5">
            {(["concat", "param"] as const).map((m) => (
              <button
                key={m}
                type="button"
                aria-pressed={s.mode === m}
                onClick={() => set({ mode: m })}
                className={cn(
                  "rounded-full border px-3 py-1 text-xs",
                  s.mode === m ? "border-accent bg-accent-soft" : "border-line",
                )}
              >
                {m === "concat" ? "Query built by pasting text" : "Parameterised query"}
              </button>
            ))}
          </div>
          <div className="border-line bg-surface rounded-lg border p-3 font-mono text-[11px] leading-relaxed">
            <span className="text-viz-compute">SELECT * FROM users WHERE name = </span>
            {s.mode === "param" ? (
              <>
                <span className="text-viz-compute">?</span>
                <div className="mt-2 flex items-center gap-2">
                  <span className="text-muted">data sent separately →</span>
                  <span className="bg-viz-data/20 text-fg rounded px-1.5 py-0.5">{inp.shown}</span>
                </div>
              </>
            ) : (
              <motion.span
                key={s.input}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className={cn(
                  "rounded px-1",
                  out.parsedAs === "code" ? "bg-bad/25 text-bad" : "bg-viz-data/20",
                )}
              >
                &apos;{inp.shown}&apos;
              </motion.span>
            )}
          </div>
          <div className="grid grid-cols-2 gap-2 text-xs">
            <div className="border-line bg-surface rounded-lg border px-3 py-2">
              <p className="text-muted text-[10px] uppercase">Database reads the input as</p>
              <p
                className={cn("font-semibold", out.parsedAs === "code" ? "text-bad" : "text-good")}
              >
                {out.parsedAs === "code" ? "part of the command" : "a value to look for"}
              </p>
            </div>
            <div
              className={cn(
                "rounded-lg border px-3 py-2",
                out.bad ? "border-bad bg-bad/10" : "border-good bg-good/10",
              )}
            >
              <p className="text-muted text-[10px] uppercase">Result</p>
              <p>{out.result}</p>
            </div>
          </div>
          <p className="text-subtle text-[10px]">
            A rules-based simulation. Crafted inputs are described, not shown; no real attack
            strings are used.
          </p>
        </div>
      }
    >
      <p>
        Pick an input, then switch how the query is built. When the app pastes text together,
        crafted input can close the quoted value early and add its own SQL: the red part is now
        code. The database can&apos;t tell which words the developer meant.
      </p>
      <p>
        With a <Term id="parameterised-query">parameterised query</Term>, the command and the data
        travel separately. The database fills the placeholder with the input as a value, whatever
        characters it contains, so crafted input just fails to match anyone.
      </p>
    </StepLayout>
  );
}

/* 3 ─ The fix, and the backups -------------------------------------------------------------------- */

export function Defences() {
  const [s, set] = useSceneState<SqlState>();
  return (
    <StepLayout
      eyebrow="Explore"
      title="The fix, and the backups"
      stage={
        <div className="flex flex-1 flex-col justify-center gap-3">
          <Code>{`# Python (psycopg): the value is a parameter, never part of the SQL text
cur.execute("SELECT * FROM users WHERE name = %s", (username,))

// Java (JDBC)
PreparedStatement st = conn.prepareStatement("SELECT * FROM users WHERE name = ?");
st.setString(1, username);`}</Code>
          <div className="flex gap-1.5">
            {(["builder", "raw"] as const).map((m) => (
              <button
                key={m}
                type="button"
                aria-pressed={s.orm === m}
                onClick={() => set({ orm: m })}
                className={cn(
                  "rounded-full border px-3 py-1 text-xs",
                  s.orm === m ? "border-accent bg-accent-soft" : "border-line",
                )}
              >
                {m === "builder" ? "ORM query builder" : "ORM raw SQL with pasted text"}
              </button>
            ))}
          </div>
          <div
            className={cn(
              "rounded-lg border px-3 py-2 text-xs",
              s.orm === "builder" ? "border-good bg-good/10" : "border-bad bg-bad/10",
            )}
          >
            {s.orm === "builder"
              ? "User.objects.filter(name=username) — the ORM sends a parameter for you. Safe."
              : "A raw query built with string formatting brings the bug straight back, ORM or not."}
          </div>
          <div className="grid gap-2 sm:grid-cols-3">
            {[
              [
                "Allow-lists",
                "For parts that can't be parameters, such as a sort column: only accept known names.",
              ],
              [
                "Least privilege",
                "The app's database user can't drop tables. Limits damage; doesn't prevent injection.",
              ],
              [
                "Not escaping",
                "OWASP strongly discourages hand-escaping as a defence: easy to get wrong.",
              ],
            ].map(([t, d]) => (
              <div key={t} className="border-line bg-surface rounded-lg border px-3 py-2 text-xs">
                <p className="font-semibold">{t}</p>
                <p className="text-muted">{d}</p>
              </div>
            ))}
          </div>
        </div>
      }
    >
      <p>
        Every mainstream language and database supports parameterised queries; OWASP lists them as
        the first and main defence. Stored procedures are safe too, as long as they don&apos;t build
        SQL from strings inside.
      </p>
      <p>
        ORMs (libraries that write SQL for you) use parameters by default, but most also have a “raw
        SQL” escape hatch. That&apos;s where the bug comes back.
      </p>
    </StepLayout>
  );
}

/* 4 ─ Twenty-five years of the same bug ----------------------------------------------------------- */

export function Breaches() {
  return (
    <StepLayout
      eyebrow="Explore"
      title="Twenty-five years of the same bug"
      stage={
        <div className="flex flex-1 flex-col justify-center gap-2">
          <div className="border-line bg-surface grid grid-cols-[4.5rem_1fr] gap-2 rounded-lg border px-3 py-2 text-xs">
            <span className="text-accent font-mono">1998</span>
            <span className="text-muted">
              One of the earliest public write-ups appears in the hacker magazine Phrack, before the
              technique had its name.
            </span>
          </div>
          {CASES.map(([t, d], i) => (
            <motion.div
              key={t}
              initial={{ opacity: 0, x: -6 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1 * i }}
              className="border-line bg-surface rounded-lg border px-3 py-2 text-xs"
            >
              <p className="font-semibold">{t}</p>
              <p className="text-muted">{d}</p>
            </motion.div>
          ))}
          <div className="border-line bg-surface grid grid-cols-[4.5rem_1fr] gap-2 rounded-lg border px-3 py-2 text-xs">
            <span className="text-accent font-mono">2025</span>
            <span className="text-muted">
              SQL injection is #2 in MITRE&apos;s CWE Top 25 most dangerous software weaknesses.
            </span>
          </div>
        </div>
      }
    >
      <p>
        The fix has been known for decades, yet SQL injection keeps appearing, usually in old code,
        quick scripts and forgotten pages. xkcd&apos;s comic “Exploits of a Mom” (xkcd.com/327),
        about a school database and a boy nicknamed Little Bobby Tables, is the classic joke about
        it.
      </p>
    </StepLayout>
  );
}

/* 5 ─ Safe or not? -------------------------------------------------------------------------------- */

export function SafeOrNot() {
  return (
    <StepLayout
      eyebrow="Checkpoint"
      title="Safe or not?"
      stage={
        <div className="flex flex-1 flex-col justify-center">
          <SortCheckpoint
            id="sqli-safe"
            prompt="Does each approach prevent SQL injection?"
            categories={[
              { id: "safe", label: "Prevents it" },
              { id: "unsafe", label: "Doesn't" },
            ]}
            items={[
              {
                id: "param",
                label: "A prepared statement with the username as a parameter",
                category: "safe",
                why: "Data never becomes code.",
              },
              {
                id: "concat",
                label: "Building the query by joining strings, after trimming spaces",
                category: "unsafe",
                why: "Trimming changes nothing.",
              },
              {
                id: "orm",
                label: "An ORM filter such as filter(name=username)",
                category: "safe",
                why: "The ORM uses parameters.",
              },
              {
                id: "raw",
                label: "An ORM's raw SQL method with the value formatted into the text",
                category: "unsafe",
                why: "Back to string-building.",
              },
              {
                id: "escape",
                label: "Escaping quotes by hand",
                category: "unsafe",
                why: "Fragile; OWASP strongly discourages it.",
              },
              {
                id: "allow",
                label: "Sorting by a column chosen from a fixed allow-list",
                category: "safe",
                why: "Only known names can appear.",
              },
            ]}
            explanation="Keep code and data apart: parameters for values, allow-lists for identifiers. Least privilege then limits damage if something slips."
          />
        </div>
      }
    >
      <p>Sort the approaches.</p>
    </StepLayout>
  );
}

/* 6 ─ Wrap ---------------------------------------------------------------------------------------- */

const POINTS: [string, string][] = [
  ["Input became code", "String-built queries let data change the command."],
  ["Parameterise", "Command and data travel separately."],
  ["Allow-list the rest", "Column names, sort order."],
  ["ORMs have raw holes", "Raw SQL brings the bug back."],
  ["Least privilege limits damage", "It doesn't prevent injection."],
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
      <p>Next: the same mistake in the browser, cross-site scripting.</p>
    </StepLayout>
  );
}
