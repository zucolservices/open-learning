"use client";

import { motion } from "motion/react";
import { useSceneState } from "@/lib/module-sdk";
import { StepLayout } from "@/toolkit/layout/step-layout";
import { SortCheckpoint } from "@/toolkit/checkpoints/sort";
import { Code } from "@/toolkit/controls/stepper";
import { Term } from "@/toolkit/glossary/term";
import { cn } from "@/lib/cn";
import { BUGS, CASES, INTERPRETERS } from "./model";
import type { InjState } from "./state";

/* 1 ─ One messenger, many languages --------------------------------------------------------------- */

export function Messenger() {
  const desks = ["🍳 Kitchen", "💊 Pharmacy", "🔐 Locksmith"];
  return (
    <StepLayout
      eyebrow="Story"
      title="One messenger, many languages"
      stage={
        <div className="flex flex-1 flex-col items-center justify-center gap-3">
          <div className="border-line bg-surface rounded-lg border px-4 py-2 text-xs">
            📨 Note from a customer
          </div>
          <div className="text-muted">↓</div>
          <div className="flex flex-wrap justify-center gap-2">
            {desks.map((d, i) => (
              <motion.span
                key={d}
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.12 * i }}
                className="border-line bg-surface rounded-lg border px-3 py-2 text-xs"
              >
                {d}
              </motion.span>
            ))}
          </div>
          <p className="text-muted max-w-xs text-center text-[11px]">
            Each desk reads notes in its own language. A note can hide instructions in any of them.
          </p>
        </div>
      }
    >
      <p>
        A hotel messenger carries guests&apos; notes to the kitchen, the pharmacy and the locksmith.
        Each desk follows instructions written in its own jargon. If a guest writes the note in that
        jargon, the desk may do far more than pass on a message.
      </p>
      <p>
        Software is full of such desks: shells, template engines, databases, directories, even
        logging libraries. Each is an <Term id="interpreter">interpreter</Term> that runs
        instructions. SQL injection and XSS are two cases of one mistake; this module covers the
        rest.
      </p>
    </StepLayout>
  );
}

/* 2 ─ Fix three injections ⭐ --------------------------------------------------------------------- */

export function FixThree() {
  const [s, set] = useSceneState<InjState>();
  const picks = s.picks ?? {};
  const fixed = BUGS.filter((b) => b.fixes.find((f) => f.id === picks[b.id])?.root).length;
  return (
    <StepLayout
      eyebrow="Fix the problem"
      title="Fix three injections"
      stage={
        <div className="flex flex-1 flex-col justify-center gap-3">
          {BUGS.map((b) => {
            const f = b.fixes.find((x) => x.id === picks[b.id]);
            return (
              <div
                key={b.id}
                className={cn(
                  "rounded-lg border px-3 py-2 text-xs",
                  !f
                    ? "border-bad bg-bad/5"
                    : f.root
                      ? "border-good bg-good/10"
                      : "border-viz-compute bg-viz-compute/10",
                )}
              >
                <p className="font-semibold">
                  {b.title} <span className="text-muted font-normal">· {b.interpreter}</span>
                </p>
                <p className="text-muted">{b.attack}</p>
                <div className="mt-1">
                  <Code>{f?.root ? b.after : b.before}</Code>
                </div>
                <div className="mt-1 flex flex-col gap-1">
                  {b.fixes.map((x) => (
                    <button
                      key={x.id}
                      type="button"
                      aria-pressed={picks[b.id] === x.id}
                      onClick={() => set({ picks: { ...picks, [b.id]: x.id } })}
                      className={cn(
                        "rounded border px-2 py-1 text-left text-[11px]",
                        picks[b.id] === x.id ? "border-accent bg-accent-soft" : "border-line",
                      )}
                    >
                      {x.label}
                    </button>
                  ))}
                </div>
                {f && (
                  <p className={cn("mt-1", f.root ? "text-good" : "text-muted")}>
                    {f.root ? "Fixed at the root. " : "A patch. "}
                    {f.why}
                  </p>
                )}
              </div>
            );
          })}
          <p className="text-muted text-[11px]">{fixed} of 3 fixed at the root.</p>
          <p className="text-subtle text-[10px]">
            Attacks are described, not shown. Code is simplified.
          </p>
        </div>
      }
    >
      <p>
        Three features, three interpreters, one bug; the first is classic{" "}
        <Term id="command-injection">command injection</Term>. For each, pick the fix. Notice the
        pattern in the weak options: filtering a few characters, hiding errors, adding something
        unrelated.
      </p>
      <p>
        The root fix is always to use an interface that keeps data separate from code: a list of
        arguments instead of a shell string, a template with variables, a query built from checked
        values. Better still, avoid the interpreter entirely: create a folder with your
        language&apos;s own function rather than calling a shell command.
      </p>
    </StepLayout>
  );
}

/* 3 ─ Same mistake, everywhere -------------------------------------------------------------------- */

export function Interpreters() {
  const [s, set] = useSceneState<InjState>();
  const it = INTERPRETERS[s.interp] ?? INTERPRETERS[0];
  return (
    <StepLayout
      eyebrow="Explore"
      title="Same mistake, everywhere"
      stage={
        <div className="flex flex-1 flex-col justify-center gap-3">
          <div className="flex flex-wrap gap-1.5">
            {INTERPRETERS.map((x, i) => (
              <button
                key={x.name}
                type="button"
                aria-pressed={s.interp === i}
                onClick={() => set({ interp: i })}
                className={cn(
                  "rounded-full border px-3 py-1 text-xs",
                  s.interp === i ? "border-accent bg-accent-soft" : "border-line",
                )}
              >
                {x.name}
              </button>
            ))}
          </div>
          <motion.div
            key={it.name}
            initial={{ opacity: 0, y: 4 }}
            animate={{ opacity: 1, y: 0 }}
            className="grid gap-2 sm:grid-cols-2"
          >
            <div className="border-bad bg-bad/10 rounded-lg border px-3 py-2 text-xs">
              <p className="text-muted text-[10px] uppercase">The mistake</p>
              <p>{it.mixed}</p>
            </div>
            <div className="border-good bg-good/10 rounded-lg border px-3 py-2 text-xs">
              <p className="text-muted text-[10px] uppercase">The safe interface</p>
              <p>{it.safe}</p>
            </div>
          </motion.div>
          <p className="text-muted text-xs">
            OWASP&apos;s 2025 Top 10 groups 37 weaknesses under A05 Injection. OS command injection
            alone is #9 in MITRE&apos;s 2025 CWE Top 25.
          </p>
        </div>
      }
    >
      <p>
        Click through the interpreters. The mistake is identical each time: untrusted text glued
        into something that will be run. So is the fix: a safe interface that takes data as data.
      </p>
      <p>
        Even argument lists need care: if a value can start with a dash, a program may read it as an
        option. Putting <code>--</code> before user-supplied values, as in the converter fix, tells
        most programs “no more options”.
      </p>
    </StepLayout>
  );
}

/* 4 ─ When it went wrong -------------------------------------------------------------------------- */

export function Cases() {
  return (
    <StepLayout
      eyebrow="Explore"
      title="When it went wrong"
      stage={
        <div className="flex flex-1 flex-col justify-center gap-2">
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
        </div>
      }
    >
      <p>
        Injection bugs in widely used software are some of the most damaging ever found, because one
        flaw appears in millions of systems at once. Log4Shell was in so many Java applications that
        organisations spent weeks just finding where they used it, which is why the supply chain
        gets its own module.
      </p>
    </StepLayout>
  );
}

/* 5 ─ Root fix or patch? -------------------------------------------------------------------------- */

export function RootOrPatch() {
  return (
    <StepLayout
      eyebrow="Checkpoint"
      title="Root fix or patch?"
      stage={
        <div className="flex flex-1 flex-col justify-center">
          <SortCheckpoint
            id="root-or-patch"
            prompt="Does each change fix injection at the root, or only patch it?"
            categories={[
              { id: "root", label: "Root fix" },
              { id: "patch", label: "Patch" },
            ]}
            items={[
              {
                id: "list",
                label: "Run the program with an argument list instead of a shell string",
                category: "root",
                why: "No shell to interpret input.",
              },
              {
                id: "semi",
                label: "Block semicolons and pipes in filenames",
                category: "patch",
                why: "A deny-list misses other characters.",
              },
              {
                id: "lib",
                label: "Use the language's own function to make a folder",
                category: "root",
                why: "No interpreter involved at all.",
              },
              {
                id: "var",
                label: "Pass the user's name into a fixed template as a variable",
                category: "root",
                why: "Data stays data.",
              },
              {
                id: "regex",
                label: "Remove curly braces from user input",
                category: "patch",
                why: "Engine-specific and fragile.",
              },
              {
                id: "type",
                label: "Reject request values that aren't plain strings",
                category: "root",
                why: "Operator objects never reach the query.",
              },
            ]}
            explanation="Root fixes keep code and data apart through a safe interface; filters and deny-lists are patches that attackers work around."
          />
        </div>
      }
    >
      <p>Sort the changes.</p>
    </StepLayout>
  );
}

/* 6 ─ Wrap ---------------------------------------------------------------------------------------- */

const POINTS: [string, string][] = [
  ["Every interpreter is a target", "Shells, templates, NoSQL, LDAP, loggers."],
  ["One rule", "Keep code and data apart."],
  ["Avoid the interpreter", "Use a library function where you can."],
  ["Argument lists, fixed templates", "Data passed as data."],
  ["Deny-lists are patches", "Attackers find the character you missed."],
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
      <p>Next: checking everything that crosses a boundary, from form fields to uploaded files.</p>
    </StepLayout>
  );
}
