"use client";

import { motion } from "motion/react";
import { Bug, Check, Clock } from "lucide-react";
import { useSceneState } from "@/lib/module-sdk";
import { StepLayout } from "@/toolkit/layout/step-layout";
import { WrapStep } from "@/toolkit/layout/wrap-step";
import { SortCheckpoint } from "@/toolkit/checkpoints/sort";
import { Term } from "@/toolkit/glossary/term";
import { cn } from "@/lib/cn";
import { CHARTERS, TIMEBOX } from "./model";
import type { ExploreState } from "./state";

/* 1 ─ Story ---------------------------------------------------------------------------------------- */

export function Detective() {
  return (
    <StepLayout
      eyebrow="Story"
      title="The inspector and the detective"
      stage={
        <div className="grid flex-1 content-center gap-3 sm:grid-cols-2">
          <motion.div
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            className="border-line bg-surface rounded-xl border p-3 text-xs"
          >
            <p className="font-semibold">The inspector</p>
            <p className="text-muted">
              Works through a checklist. Confirms what was expected. Never wonders about the noise
              in the cellar.
            </p>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15 }}
            className="border-accent bg-accent-soft rounded-xl border p-3 text-xs"
          >
            <p className="font-semibold">The detective</p>
            <p className="text-muted">
              Has a mission, follows clues, changes plan as they learn. Finds what nobody knew to
              look for.
            </p>
          </motion.div>
        </div>
      }
    >
      <p>
        Automated tests are the inspector: they check what someone thought to write down, every
        time, without tiring. But they can&apos;t notice the thing nobody anticipated.
      </p>
      <p>
        <Term id="exploratory-testing">Exploratory testing</Term> is the detective: a person
        deliberately probing the software with a mission, learning as they go, and steering by what
        they find. It&apos;s structured, not random clicking.
      </p>
    </StepLayout>
  );
}

/* 2 ─ Explore ⭐ ----------------------------------------------------------------------------------- */

export function Session() {
  const [s, set] = useSceneState<ExploreState>();
  const ch = CHARTERS.find((c) => c.id === s.charter)!;
  const used = s.used[ch.id] ?? [];
  const left = TIMEBOX - used.length;
  const allBugs = CHARTERS.flatMap((c) =>
    (s.used[c.id] ?? []).map((id) => c.probes.find((p) => p.id === id)!).filter((p) => p.bug),
  );
  const probe = (id: string) => left > 0 && set({ used: { ...s.used, [ch.id]: [...used, id] } });
  return (
    <StepLayout
      eyebrow="Branching scenario"
      title="Run three time-boxed sessions"
      stage={
        <div className="flex flex-1 flex-col justify-center gap-3">
          <div className="flex flex-wrap gap-1">
            {CHARTERS.map((c, i) => (
              <button
                key={c.id}
                type="button"
                aria-pressed={s.charter === c.id}
                onClick={() => set({ charter: c.id })}
                className={cn(
                  "rounded-full border px-3 py-1 text-xs",
                  s.charter === c.id
                    ? "border-accent bg-accent text-accent-fg"
                    : "border-line-strong text-muted",
                )}
              >
                Session {i + 1}
              </button>
            ))}
          </div>
          <div className="border-line bg-surface rounded-lg border px-3 py-2 text-xs">
            <p className="text-muted text-[10px] font-medium">Charter</p>
            <p>{ch.charter}</p>
            <p
              className={cn(
                "mt-1 flex items-center gap-1 text-[10px]",
                left ? "text-muted" : "text-bad",
              )}
            >
              <Clock className="size-3" />{" "}
              {left
                ? `${left} of ${TIMEBOX} probes left in this 60-minute session`
                : "Time's up for this session"}
              {!left && (
                <button
                  type="button"
                  onClick={() => set({ used: { ...s.used, [ch.id]: [] } })}
                  className="border-line-strong text-fg ml-2 rounded-full border px-2"
                >
                  Run this session again
                </button>
              )}
            </p>
          </div>
          <div className="grid gap-1">
            {ch.probes.map((p) => {
              const done = used.includes(p.id);
              return (
                <button
                  key={p.id}
                  type="button"
                  disabled={done || left === 0}
                  onClick={() => probe(p.id)}
                  className={cn(
                    "rounded-lg border px-3 py-1.5 text-left text-xs disabled:cursor-default",
                    done
                      ? p.bug
                        ? "border-bad/50 bg-bad/10"
                        : "border-good/40 bg-good/10"
                      : left === 0
                        ? "border-line bg-surface opacity-50"
                        : "border-line bg-surface hover:border-accent",
                  )}
                >
                  <span className="text-accent mr-1.5 text-[10px] font-medium">{p.heuristic}</span>
                  {p.action}
                  {done && (
                    <span className="mt-0.5 flex items-start gap-1 text-[10px]">
                      {p.bug ? (
                        <Bug className="text-bad mt-px size-3 shrink-0" />
                      ) : (
                        <Check className="text-good mt-px size-3 shrink-0" />
                      )}
                      {p.bug ?? p.fine}
                    </span>
                  )}
                </button>
              );
            })}
          </div>
          <div className="border-line bg-surface-2 rounded-lg border px-3 py-2 text-xs">
            <p className="font-semibold">
              Session notes: {allBugs.length} bug{allBugs.length === 1 ? "" : "s"} found
            </p>
            <p className="text-muted text-[10px]">
              Automated suite for this app: 214 tests, all passing.
            </p>
          </div>
        </div>
      }
    >
      <p>
        The café&apos;s booking app passes every automated test. Run three short sessions, each with
        a <Term id="charter">charter</Term> (a mission) and time for only four probes. Choose the
        probes you think are most likely to reveal something.
      </p>
      <p>
        The small labels are <strong>heuristics</strong>: rules of thumb that suggest where bugs
        hide. Every bug you find is a candidate for a new automated test, so it never comes back.
      </p>
    </StepLayout>
  );
}

/* 3 ─ Testing vs checking --------------------------------------------------------------------------- */

export function TestingChecking() {
  return (
    <StepLayout
      eyebrow="Explore"
      title="Testing versus checking"
      stage={
        <div className="flex flex-1 flex-col justify-center gap-2">
          <div className="grid gap-2 sm:grid-cols-2">
            <div className="border-line bg-surface rounded-lg border px-3 py-2 text-xs">
              <p className="font-semibold">Checking</p>
              <p className="text-muted">
                Confirming known expectations. Machines do it brilliantly: fast, tireless,
                repeatable.
              </p>
            </div>
            <div className="border-accent bg-accent-soft rounded-lg border px-3 py-2 text-xs">
              <p className="font-semibold">Testing</p>
              <p className="text-muted">
                Learning about the product by exploring and experimenting, including questioning the
                expectations themselves.
              </p>
            </div>
          </div>
          <div className="border-line bg-surface rounded-lg border px-3 py-2 text-xs">
            <p className="font-semibold">A charter template</p>
            <p className="font-mono text-[11px]">
              Explore &lt;target&gt; with &lt;resources&gt; to discover &lt;information&gt;
            </p>
            <p className="text-muted text-[10px]">
              From Elisabeth Hendrickson&apos;s book <em>Explore It!</em> (2013)
            </p>
          </div>
        </div>
      }
    >
      <p>
        Cem Kaner coined the term &ldquo;exploratory testing&rdquo; in the 1980s; it appeared in
        Kaner&apos;s 1988 book <em>Testing Computer Software</em>. Jonathan and James Bach added
        structure with session-based test management in 2000: a charter, a time-box (often 60 to 120
        minutes), notes, and a debrief.
      </p>
      <p>
        Michael Bolton and James Bach separate <em>checking</em>, which can be automated, from{" "}
        <em>testing</em>, which needs a thinking person. Teams need both.
      </p>
    </StepLayout>
  );
}

/* 4 ─ Heuristics ----------------------------------------------------------------------------------- */

export function Heuristics() {
  return (
    <StepLayout
      eyebrow="Explore"
      title="Heuristics: where bugs like to hide"
      stage={
        <div className="grid flex-1 content-center gap-1.5 sm:grid-cols-2">
          {[
            ["Zero, one, many", "Nothing, exactly one, lots."],
            ["Goldilocks", "Too big, too small, just right."],
            ["Interrupt it", "Back, refresh, double-click, go offline."],
            ["Boundaries", "At, just under and just over every limit."],
            ["CRUD", "Create, read, update, delete each thing."],
            ["Time and place", "Time zones, midnight, leap years, languages."],
          ].map(([t, b], i) => (
            <motion.div
              key={t}
              initial={{ opacity: 0, y: 4 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.05 * i }}
              className="border-line bg-surface rounded-lg border px-3 py-2 text-xs"
            >
              <p className="font-semibold">{t}</p>
              <p className="text-muted">{b}</p>
            </motion.div>
          ))}
        </div>
      }
    >
      <p>
        Experienced testers carry lists of heuristics. Elisabeth Hendrickson&apos;s Test Heuristics
        Cheat Sheet and James Bach&apos;s Heuristic Test Strategy Model (with its product elements:
        structure, function, data, interfaces, platform, operations, time) are two well-known ones.
      </p>
      <p>
        Exploration is a skill anyone on the team can build. Developers who spend twenty minutes
        exploring their own feature before calling it done catch a surprising amount.
      </p>
    </StepLayout>
  );
}

/* 5 ─ Checkpoint ----------------------------------------------------------------------------------- */

export function ExploreCheck() {
  return (
    <StepLayout
      eyebrow="Checkpoint"
      title="Check or explore?"
      stage={
        <div className="flex flex-1 flex-col justify-center">
          <SortCheckpoint
            id="testing-exploratory"
            prompt="Is each activity better as an automated check or as exploration by a person?"
            categories={[
              { id: "check", label: "Automated check" },
              { id: "explore", label: "Exploration" },
            ]}
            items={[
              {
                id: "gst",
                label: "GST is 5% on every food item, on every change",
                category: "check",
                why: "Known rule, needs repeating forever.",
              },
              {
                id: "new",
                label: "Find out how a brand-new feature behaves when people use it oddly",
                category: "explore",
                why: "Nobody knows yet what to expect.",
              },
              {
                id: "regress",
                label: "The double-booking bug you just found never returns",
                category: "check",
                why: "Now it's known, automate it.",
              },
              {
                id: "confuse",
                label: "Notice that the confirmation screen is confusing",
                category: "explore",
                why: "Needs human judgement.",
              },
              {
                id: "tz",
                label: "Probe how the app copes with travelling customers",
                category: "explore",
                why: "An open question to investigate.",
              },
            ]}
            explanation="Automate what you already know to expect. Explore to discover what you don't, then turn discoveries into new checks."
          />
        </div>
      }
    >
      <p>Sort each activity.</p>
    </StepLayout>
  );
}

/* 6 ─ Wrap ----------------------------------------------------------------------------------------- */

export function Wrap() {
  return (
    <WrapStep
      points={[
        ["Scripts check, people explore", "Both are needed."],
        ["Structured, not random", "Charter, time-box, notes, debrief."],
        ["Heuristics guide the search", "Zero-one-many, boundaries, interruptions, time."],
        ["Discoveries become checks", "Automate each bug you find."],
        ["Anyone can explore", "Including the developer who built it."],
      ]}
    >
      <p>Next: the one environment that is exactly like production.</p>
    </WrapStep>
  );
}
