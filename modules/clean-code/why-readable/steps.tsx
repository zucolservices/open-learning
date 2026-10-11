"use client";

import { useEffect, useRef, useState } from "react";
import { motion } from "motion/react";
import { Timer } from "lucide-react";
import { useSceneState } from "@/lib/module-sdk";
import { StepLayout } from "@/toolkit/layout/step-layout";
import { WrapStep } from "@/toolkit/layout/wrap-step";
import { SortCheckpoint } from "@/toolkit/checkpoints/sort";
import { cn } from "@/lib/cn";
import { Code, type Mark } from "../_shared/code";
import { RULES, VERSIONS } from "./model";
import type { ReadableState } from "./state";

/* 2 ─ Find the bug ⭐ ------------------------------------------------------------------------------- */

export function FindBug() {
  const [s, set] = useSceneState<ReadableState>();
  const v = VERSIONS[s.version];
  const start = useRef(0);
  const [miss, setMiss] = useState<number | null>(null);
  const found = s.times[v.id] !== undefined;
  useEffect(() => {
    start.current = performance.now();
  }, [s.version]);
  const click = (i: number) => {
    if (found) return;
    if (v.bug.includes(i)) {
      const secs = Math.round((performance.now() - start.current) / 100) / 10;
      set({ times: { ...s.times, [v.id]: secs } });
      setMiss(null);
    } else {
      setMiss(i);
      set({ misses: { ...s.misses, [v.id]: (s.misses[v.id] ?? 0) + 1 } });
    }
  };
  const marks: Record<number, Mark> = {};
  if (found) v.bug.forEach((b) => (marks[b] = "bad"));
  else if (miss !== null) marks[miss] = "dim";
  const allDone = VERSIONS.every((x) => s.times[x.id] !== undefined);
  return (
    <StepLayout
      eyebrow="Simulation"
      title="Find the bug, three times"
      stage={
        <div className="flex flex-1 flex-col justify-center gap-3">
          <div className="flex flex-wrap gap-1">
            {VERSIONS.map((x, i) => (
              <button
                key={x.id}
                type="button"
                aria-pressed={s.version === i}
                onClick={() => {
                  setMiss(null);
                  set({ version: i });
                }}
                className={cn(
                  "rounded-full border px-3 py-1 text-xs",
                  s.version === i
                    ? "border-accent bg-accent text-accent-fg"
                    : "border-line-strong text-muted",
                )}
              >
                {x.label}
                {s.times[x.id] !== undefined && ` · ${s.times[x.id]} s`}
              </button>
            ))}
          </div>
          <div className="border-line bg-surface rounded-lg border px-3 py-2 text-xs">
            <p className="text-muted text-[10px]">The rules</p>
            <p>{RULES}</p>
            <p className="text-bad mt-1">Bug report: {v.report}</p>
          </div>
          <Code
            key={v.id}
            lines={v.lines}
            marks={marks}
            onLine={click}
            title="Click the line that causes the bug"
          />
          {found ? (
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-good text-xs"
            >
              Found in {s.times[v.id]} s. {v.explain}
            </motion.p>
          ) : (
            <p className="text-muted flex items-center gap-1 text-[11px]">
              <Timer className="size-3" />{" "}
              {miss !== null
                ? "Not that line. Keep reading."
                : "The clock started when this version appeared."}
            </p>
          )}
          {allDone && (
            <p className="text-sm">
              Most people find the bug in version C fastest, even though it&apos;s the newest to
              them. The names and the constant say where each rule lives.
            </p>
          )}
        </div>
      }
    >
      <p>
        The same rule, written three ways, each with a different bug. Read the bug report, then
        click the line that causes it. A stopwatch runs quietly; it isn&apos;t a score, just a way
        to notice how reading time changes.
      </p>
      <p>
        Pay attention to <em>where</em> your time goes: decoding names, checking comments against
        code, or looking for the rule itself.
      </p>
    </StepLayout>
  );
}

/* 3 ─ Where the time goes --------------------------------------------------------------------------- */

export function TimeGoes() {
  return (
    <StepLayout
      eyebrow="Explore"
      title="Where developers' time goes"
      stage={
        <div className="flex flex-1 flex-col justify-center gap-3">
          {[
            ["Understanding code", 58, "78 professionals, 3,148 working hours (Xia et al., 2018)"],
            [
              "Understanding code",
              70,
              "18 developers, about 200 hours in one IDE (Minelli et al., 2015)",
            ],
            ["Editing code", 5, "same 2015 study"],
          ].map(([l, n, src], i) => (
            <div key={i} className="text-xs">
              <div className="flex justify-between">
                <span>{l as string}</span>
                <span className="font-mono">{n as number}%</span>
              </div>
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${n}%` }}
                transition={{ delay: 0.12 * i, duration: 0.5 }}
                className={cn("mt-0.5 h-2 rounded", i < 2 ? "bg-accent/60" : "bg-viz-idle/60")}
              />
              <p className="text-muted text-[10px]">{src as string}</p>
            </div>
          ))}
          <div className="border-line bg-surface rounded-lg border px-3 py-2 text-xs">
            <p className="font-semibold">Working memory is small</p>
            <p className="text-muted">
              People hold roughly four chunks of information at once (Cowan, 2001). Every cryptic
              name or extra branch uses one up.
            </p>
          </div>
        </div>
      }
    >
      <p>
        Martin&apos;s &ldquo;ten to one&rdquo; is an estimate, but measurements point the same way.
        Two studies that recorded developers at work found most of their time went on understanding
        code, and only a sliver on typing.
      </p>
      <p>
        That&apos;s why readability matters more than saving keystrokes. The studies are small, so
        treat the exact numbers as indicative; the direction is consistent.
      </p>
    </StepLayout>
  );
}

/* 4 ─ Schools of thought ------------------------------------------------------------------------------ */

export function Schools() {
  return (
    <StepLayout
      eyebrow="Explore"
      title="Not one rulebook"
      stage={
        <div className="flex flex-1 flex-col justify-center gap-2">
          {[
            [
              "Clean Code",
              "Robert C. Martin, 2008; a rewritten second edition in 2025.",
              "Small functions, expressive names, few comments.",
            ],
            [
              "A Philosophy of Software Design",
              "John Ousterhout, 2018.",
              "Deep modules with simple interfaces; comments explain what code can't.",
            ],
            [
              "The critics",
              "e.g. qntm (2020), Casey Muratori (2023).",
              "Some examples aged badly; taken literally, the rules can hurt clarity or speed.",
            ],
            [
              "The debate",
              "Ousterhout and Martin, in writing, 2024–25.",
              "They agreed code can be split too finely, and disagreed on comments and method length.",
            ],
          ].map(([t, w, b], i) => (
            <motion.div
              key={t}
              initial={{ opacity: 0, y: 4 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.07 * i }}
              className="border-line bg-surface rounded-lg border px-3 py-2 text-xs"
            >
              <p className="font-semibold">{t}</p>
              <p className="text-muted text-[10px]">{w}</p>
              <p>{b}</p>
            </motion.div>
          ))}
        </div>
      }
    >
      <p>
        &ldquo;Clean code&rdquo; is also the title of a famous book, and people argue about it. This
        track takes the goal (code that&apos;s easy to understand and change) and shows the
        competing advice side by side, so you can choose with judgement.
      </p>
      <p>
        Where experts agree, the track says so. Where they don&apos;t, you&apos;ll see both views
        and the trade-off between them.
      </p>
    </StepLayout>
  );
}

/* 5 ─ Checkpoint ----------------------------------------------------------------------------------- */

export function ReadableCheck() {
  return (
    <StepLayout
      eyebrow="Checkpoint"
      title="Easier or harder to read?"
      stage={
        <div className="flex flex-1 flex-col justify-center">
          <SortCheckpoint
            id="clean-why"
            prompt="Does each habit make code easier or harder for the next reader?"
            categories={[
              { id: "easier", label: "Easier" },
              { id: "harder", label: "Harder" },
            ]}
            items={[
              {
                id: "names",
                label: "Names that say what things mean",
                category: "easier",
                why: "The reader doesn't have to decode.",
              },
              {
                id: "magic",
                label: "Unexplained numbers like 3 and 10",
                category: "harder",
                why: "Hidden rules the reader must guess.",
              },
              {
                id: "lying",
                label: "A comment that no longer matches the code",
                category: "harder",
                why: "Now the reader has to check both.",
              },
              {
                id: "flag",
                label: "A function whose behaviour depends on a mystery flag",
                category: "harder",
                why: "Two behaviours under one name.",
              },
              {
                id: "constant",
                label: "A named constant for a business rule",
                category: "easier",
                why: "The rule lives in one findable place.",
              },
            ]}
            explanation="Readable code puts meaning where the reader looks first: in names, constants and small functions, not in comments that can drift."
          />
        </div>
      }
    >
      <p>Sort each habit.</p>
    </StepLayout>
  );
}

/* 6 ─ Wrap ----------------------------------------------------------------------------------------- */

export function Wrap() {
  return (
    <WrapStep
      points={[
        ["Reading dominates", "Most time on code is spent understanding it."],
        ["Clean means easy to change", "Not pretty, not clever: clear."],
        ["Meaning in the code itself", "Names, constants, small functions."],
        ["Schools disagree on details", "Learn the trade-offs, not one rulebook."],
        ["A team habit", "Everyone reads everyone's code."],
      ]}
    >
      <p>Next: the cheapest improvement of all, naming.</p>
    </WrapStep>
  );
}
