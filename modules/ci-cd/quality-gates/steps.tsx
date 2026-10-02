"use client";

import { motion } from "motion/react";
import { AlertTriangle, Check, ShieldCheck } from "lucide-react";
import { useSceneState } from "@/lib/module-sdk";
import { StepLayout } from "@/toolkit/layout/step-layout";
import { SortCheckpoint } from "@/toolkit/checkpoints/sort";
import { FrameCaption, Stepper } from "@/toolkit/controls/stepper";
import { Term } from "@/toolkit/glossary/term";
import { cn } from "@/lib/cn";
import { RULES, run, type Rule } from "./model";
import type { GateState } from "./state";

/* 1 ─ Set the rules for main ⭐ -------------------------------------------------------------------- */

function fmtWait(min: number) {
  if (min < 60) return `${Math.round(min)} min`;
  const h = Math.floor(min / 60);
  const m = Math.round(min % 60);
  return m ? `${h} h ${m} min` : `${h} h`;
}

export function SetRules() {
  const [s, set] = useSceneState<GateState>();
  const r = run(s.rules);
  const toggle = (id: Rule) =>
    set({ rules: s.rules.includes(id) ? s.rules.filter((x) => x !== id) : [...s.rules, id] });
  return (
    <StepLayout
      eyebrow="Build"
      title="Set the rules for main"
      stage={
        <div className="flex flex-1 flex-col justify-center gap-3 lg:flex-row lg:items-start">
          <div className="flex flex-col gap-1.5 lg:w-[44%]">
            <p className="text-muted text-[10px]">Rules on main</p>
            {RULES.map((rule) => {
              const on = s.rules.includes(rule.id);
              return (
                <button
                  key={rule.id}
                  type="button"
                  aria-pressed={on}
                  onClick={() => toggle(rule.id)}
                  className={cn(
                    "flex items-start gap-2 rounded-lg border px-2.5 py-1.5 text-left",
                    on
                      ? "border-accent bg-accent-soft"
                      : "border-line bg-surface hover:bg-surface-2",
                  )}
                >
                  <ShieldCheck
                    className={cn("mt-0.5 size-3.5 shrink-0", on ? "text-accent" : "text-subtle")}
                  />
                  <span>
                    <span className="block text-xs font-medium">{rule.name}</span>
                    <span className="text-muted block text-[10px]">{rule.detail}</span>
                  </span>
                </button>
              );
            })}
          </div>
          <div className="flex flex-1 flex-col gap-1.5">
            <p className="text-muted text-[10px]">Today&apos;s pull requests</p>
            {r.outcomes.map((o) => (
              <motion.div
                key={o.change.id}
                layout
                className={cn(
                  "rounded-lg border px-2.5 py-1.5",
                  o.status === "escaped"
                    ? "border-bad/60 bg-bad/10"
                    : o.status === "stopped"
                      ? "border-good/50 bg-good/10"
                      : "border-line bg-surface",
                )}
              >
                <div className="flex items-center justify-between gap-2">
                  <span className="text-xs font-medium">{o.change.title}</span>
                  <span
                    className={cn(
                      "flex shrink-0 items-center gap-1 font-mono text-[10px]",
                      o.status === "escaped"
                        ? "text-bad"
                        : o.status === "stopped"
                          ? "text-good"
                          : "text-muted",
                    )}
                  >
                    {o.status === "escaped" ? (
                      <AlertTriangle className="size-3" />
                    ) : (
                      <Check className="size-3" />
                    )}
                    {o.status === "merged"
                      ? "merged"
                      : o.status === "stopped"
                        ? `stopped: ${RULES.find((x) => x.id === o.by)!.name.toLowerCase()}`
                        : "reached main"}
                  </span>
                </div>
                {o.change.problem && o.status !== "merged" && (
                  <p className="text-muted mt-0.5 text-[10px]">{o.change.problem}</p>
                )}
              </motion.div>
            ))}
            <div className="mt-1 grid grid-cols-2 gap-2">
              <div className="border-line bg-surface rounded-lg border px-2 py-1.5">
                <p className="text-muted text-[10px]">Bad changes stopped</p>
                <p className={cn("font-mono text-sm font-semibold", r.escaped > 0 && "text-bad")}>
                  {r.caught} of {r.caught + r.escaped}
                </p>
              </div>
              <div className="border-line bg-surface rounded-lg border px-2 py-1.5">
                <p className="text-muted text-[10px]">Wait added to a good change</p>
                <p className="font-mono text-sm font-semibold">{fmtWait(r.goodWaitMin)}</p>
              </div>
            </div>
            <p className="text-muted text-[10px]">
              Illustrative waits: checks run side by side (the slowest counts); a review takes about
              three hours; code owners add two more on their area; the queue adds a quarter of an
              hour.
            </p>
          </div>
        </div>
      }
    >
      <p>
        A <Term id="quality-gate">quality gate</Term> is a check a change must pass before it joins
        main. On GitHub you set them with <Term id="branch-protection">branch protection</Term> or
        rulesets; GitLab, Azure Repos and Bitbucket have their own versions.
      </p>
      <p>
        Nine pull requests arrive today. Seven hide a problem, each of a different kind. Switch
        rules on until none reaches main, and watch what each one costs the good changes.
      </p>
      <p>
        Machines catch the mechanical problems quickly: tests, linters,{" "}
        <Term id="sast">static analysis</Term> and <Term id="secret-scanning">secret scanning</Term>
        . Only people, ideally the <Term id="codeowners">code owners</Term> of the area, catch a
        rounding rule that passes every test but loses money, and only a{" "}
        <Term id="merge-queue">merge queue</Term> catches two changes that pass alone and break
        together.
      </p>
    </StepLayout>
  );
}

/* 2 ─ Two changes, both green --------------------------------------------------------------------- */

const QUEUE_FRAMES = [
  {
    t: "Both pull requests are green",
    d: "PR A renames getPrice to getUnitPrice everywhere it's used today. PR B, written the same morning, adds a new call to getPrice. Each was tested against main as it was when it branched.",
  },
  {
    t: "A merges first",
    d: "Main now has getUnitPrice and no getPrice. B's checks are still green, because they ran before A existed.",
  },
  {
    t: "B merges: main is broken",
    d: "Git sees no conflicting lines, so it merges happily. The build fails on main for everyone. Martin Fowler calls this a semantic conflict: the text merges, the meaning doesn't.",
  },
  {
    t: "With a merge queue",
    d: "The queue builds B on top of the latest main, including A, and runs the required checks again before merging. B fails there, goes back to its author, and main stays green.",
  },
];

export function BothGreen() {
  const [s, set] = useSceneState<GateState>();
  const f = QUEUE_FRAMES[s.frame];
  const broken = s.frame === 2;
  const queued = s.frame === 3;
  return (
    <StepLayout
      eyebrow="Step-through"
      title="Two changes, both green"
      stage={
        <div className="flex flex-1 flex-col justify-center gap-3">
          <div className="grid grid-cols-3 items-center gap-2 text-center text-xs">
            {[
              { k: "PR A", d: "rename getPrice → getUnitPrice", ok: true },
              {
                k: "main",
                d: broken ? "✕ build fails" : s.frame >= 1 ? "getUnitPrice" : "getPrice",
                ok: !broken,
              },
              { k: "PR B", d: queued ? "✕ fails in queue" : "new call to getPrice", ok: !queued },
            ].map((x) => (
              <motion.div
                key={x.k}
                layout
                className={cn(
                  "rounded-xl border px-2 py-3",
                  x.ok ? "border-line bg-surface" : "border-bad/60 bg-bad/10",
                  x.k === "main" && "border-fg/40",
                )}
              >
                <p className="font-semibold">{x.k}</p>
                <p className="text-muted mt-1 font-mono text-[10px]">{x.d}</p>
              </motion.div>
            ))}
          </div>
          <Stepper
            step={s.frame}
            count={QUEUE_FRAMES.length}
            onChange={(frame) => set({ frame })}
          />
          <FrameCaption
            frameKey={s.frame}
            title={f.t}
            tone={broken ? "bad" : queued ? "good" : undefined}
          >
            {f.d}
          </FrameCaption>
        </div>
      }
    >
      <p>
        The rule &ldquo;branches must be up to date before merging&rdquo; fixes this too, but on a
        busy repository everyone keeps rebasing and re-running checks, racing each other to merge.
      </p>
      <p>
        A merge queue does the waiting for you. GitHub&apos;s became generally available in July
        2023; GitLab calls the same idea merge trains. Mergify, Aviator and Graphite offer it too.
      </p>
    </StepLayout>
  );
}

/* 3 ─ Machines or people? ------------------------------------------------------------------------- */

export function MachinesOrPeople() {
  return (
    <StepLayout
      eyebrow="Checkpoint"
      title="Machines or people?"
      stage={
        <div className="flex flex-1 flex-col justify-center">
          <SortCheckpoint
            id="machines-or-people"
            prompt="Which gate is the right one for each problem?"
            categories={[
              { id: "auto", label: "Automated check" },
              { id: "human", label: "A person's review" },
            ]}
            items={[
              {
                id: "format",
                label: "Inconsistent indentation and quotes",
                category: "auto",
                why: "A formatter fixes it without anyone discussing it.",
              },
              {
                id: "key",
                label: "An access token pasted into a config file",
                category: "auto",
                why: "Secret scanning with push protection stops it before it reaches the server.",
              },
              {
                id: "semantic",
                label: "Two pull requests that pass alone but break together",
                category: "auto",
                why: "A merge queue re-tests each one on top of the other.",
              },
              {
                id: "design",
                label: "A new table that duplicates one that already exists",
                category: "human",
                why: "Knowing the system's design is a reviewer's job.",
              },
              {
                id: "rule",
                label: "A refund rule that doesn't match what finance agreed",
                category: "human",
                why: "Tests only check what someone thought to write down.",
              },
              {
                id: "naming",
                label: "A function name that will confuse the next reader",
                category: "human",
                why: "Clarity is judged by people who have to read it.",
              },
            ]}
            explanation="Automate everything mechanical so reviews can focus on what only people can judge: design, intent and clarity."
          />
        </div>
      }
    >
      <p>
        Google&apos;s review standard says reviewers &ldquo;should favor approving a CL once it is
        in a state where it definitely improves the overall code health of the system being worked
        on, even if the CL isn&apos;t perfect.&rdquo; (CL is Google&apos;s word for a change.)
      </p>
    </StepLayout>
  );
}

/* 4 ─ Who approves? ------------------------------------------------------------------------------- */

export function WhoApproves() {
  return (
    <StepLayout
      eyebrow="Research"
      title="Who should approve?"
      stage={
        <div className="grid flex-1 content-center gap-3 sm:grid-cols-2">
          <div className="border-bad/40 bg-bad/5 rounded-xl border px-4 py-3">
            <p className="text-sm font-semibold">A weekly change board</p>
            <p className="text-muted mt-1 text-sm">
              A committee outside the team reviews a list of changes once a week. DORA found such
              external approval has &ldquo;a negative impact on software delivery
              performance&rdquo;, with &ldquo;no evidence&rdquo; that it lowers change failure
              rates.
            </p>
          </div>
          <div className="border-good/40 bg-good/5 rounded-xl border px-4 py-3">
            <p className="text-sm font-semibold">Peer review plus automation</p>
            <p className="text-muted mt-1 text-sm">
              A teammate who knows the code reviews each small change, and the pipeline proves the
              rest. DORA recommends this, and it still gives auditors separation of duties: the
              author can&apos;t approve their own change.
            </p>
          </div>
          <div className="border-line bg-surface rounded-xl border px-4 py-3 sm:col-span-2">
            <p className="text-sm font-semibold">Regulated? Still possible</p>
            <p className="text-muted mt-1 text-sm">
              Card-payment rules (PCI DSS 6.5) and SOC 2 ask for authorised, documented approval of
              changes. Required reviews, code owners and protected branches leave exactly that
              record, on every change, automatically.
            </p>
          </div>
        </div>
      }
    >
      <p>
        Google&apos;s 2018 study of its own code review found a median review time under four hours,
        on changes with a median of 24 lines. Small changes are quick to review well.
      </p>
      <p>
        A few settings are worth knowing. On GitHub, admins can bypass branch protection unless you
        tick &ldquo;Do not allow bypassing the above settings&rdquo;. And if a path filter skips a
        required workflow, its check sits at &ldquo;Pending&rdquo; and blocks the merge.
      </p>
    </StepLayout>
  );
}

/* 5 ─ Wrap ---------------------------------------------------------------------------------------- */

const POINTS: [string, string][] = [
  ["Gate main", "Required checks and reviews before anything merges."],
  ["Automate the mechanical", "Format, lint, types, SAST and secret scanning."],
  ["People for judgement", "Design, intent and the rules tests don't know."],
  ["Owners for risky areas", "CODEOWNERS routes payments code to people who know it."],
  ["Queue the merges", "Re-test on top of main so green means green."],
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
        Every rule costs time, so add each one for a problem you&apos;ve actually seen. The aim is a
        main branch that is always releasable, which is where the next chapter starts: turning that
        main branch into something you can ship.
      </p>
    </StepLayout>
  );
}
