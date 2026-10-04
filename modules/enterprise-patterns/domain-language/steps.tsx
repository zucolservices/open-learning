"use client";

import { motion } from "motion/react";
import { useSceneState } from "@/lib/module-sdk";
import { StepLayout } from "@/toolkit/layout/step-layout";
import { SortCheckpoint } from "@/toolkit/checkpoints/sort";
import { Code } from "@/toolkit/controls/stepper";
import { Term } from "@/toolkit/glossary/term";
import { cn } from "@/lib/cn";
import { DEPTS, clashes, type Dept } from "./model";
import type { LangState } from "./state";

/* 1 ─ Lost in translation ------------------------------------------------------------------------- */

export function LostInTranslation() {
  return (
    <StepLayout
      eyebrow="Story"
      title="Lost in translation"
      stage={
        <div className="flex flex-1 flex-col justify-center gap-3">
          <div className="grid grid-cols-[1fr_auto_1fr] items-center gap-3">
            <div className="border-viz-compute bg-viz-compute/10 rounded-xl border px-3 py-3 text-center">
              <p className="text-xs font-semibold">Ground software</p>
              <p className="mt-1 font-mono text-sm">pound-force · seconds</p>
            </div>
            <span className="text-bad font-mono text-xs">≠</span>
            <div className="border-viz-data bg-viz-data/10 rounded-xl border px-3 py-3 text-center">
              <p className="text-xs font-semibold">Navigation software</p>
              <p className="mt-1 font-mono text-sm">newton · seconds</p>
            </div>
          </div>
          <svg viewBox="0 0 300 110" className="mx-auto w-full max-w-sm" aria-hidden>
            <circle cx={250} cy={70} r={34} className="fill-viz-remove/15 stroke-viz-remove" />
            <text x={250} y={74} textAnchor="middle" className="fill-fg text-[9px]">
              Mars
            </text>
            <path
              d="M10 20 Q150 10 215 40"
              className="stroke-good"
              strokeDasharray="4 3"
              strokeWidth={1.4}
              fill="none"
            />
            <motion.path
              d="M10 20 Q150 20 224 60"
              className="stroke-bad"
              strokeWidth={1.6}
              fill="none"
              initial={{ pathLength: 0 }}
              animate={{ pathLength: 1 }}
              transition={{ duration: 2 }}
            />
            <text x={110} y={10} className="fill-good text-[8px]">
              planned
            </text>
            <text x={40} y={60} className="fill-bad text-[8px]">
              actual: about 170 km too low
            </text>
          </svg>
          <p className="text-muted text-xs">
            Each thruster firing&apos;s effect was underestimated by a factor of 4.45.
          </p>
        </div>
      }
    >
      <p>
        On 23 September 1999, NASA lost contact with the Mars Climate Orbiter as it arrived at Mars.
        The investigation found that one piece of ground software reported thruster data in
        pound-force seconds; the navigation software, as the written interface specification
        required, expected newton-seconds. Nobody converted.
      </p>
      <p>
        The board also named &ldquo;inadequate communications between project elements&rdquo; as a
        cause. Two teams, one number, two units. Most software failures are less dramatic, but many
        start exactly like this.
      </p>
    </StepLayout>
  );
}

/* 2 ─ One word, five meanings ⭐ ------------------------------------------------------------------ */

export function OneWord() {
  const [s, set] = useSceneState<LangState>();
  const picked = s.picked ?? [];
  const toggle = (d: Dept) =>
    set({ picked: picked.includes(d) ? picked.filter((x) => x !== d) : [...picked, d] });
  const cl = clashes(picked);
  const fields = picked.flatMap((d) => DEPTS[d].fields);
  return (
    <StepLayout
      eyebrow="Simulation"
      title="One word, five meanings"
      stage={
        <div className="flex flex-1 flex-col justify-center gap-3">
          <div className="grid gap-1.5">
            {(Object.keys(DEPTS) as Dept[]).map((d) => (
              <button
                key={d}
                type="button"
                aria-pressed={picked.includes(d)}
                onClick={() => toggle(d)}
                className={cn(
                  "grid grid-cols-[5.5rem_1fr] items-start gap-2 rounded-lg border px-3 py-1.5 text-left",
                  picked.includes(d)
                    ? "border-accent bg-accent-soft"
                    : "border-line bg-surface hover:bg-surface-2",
                )}
              >
                <span className="text-xs font-semibold">{DEPTS[d].name}</span>
                <span className="text-muted text-[11px]">
                  &ldquo;customer&rdquo; = {DEPTS[d].means}
                </span>
              </button>
            ))}
          </div>
          <div className="grid gap-2 sm:grid-cols-2">
            <div className="bg-surface-2 rounded-xl px-3 py-2 font-mono text-[10px] leading-relaxed">
              <p className="text-accent">class Customer {"{"}</p>
              <p className="pl-3">id; name; phone;</p>
              {fields.map((f) => (
                <motion.p
                  key={f}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="pl-3"
                >
                  {f}; <span className="text-subtle">{"// maybe null"}</span>
                </motion.p>
              ))}
              <p className="text-accent">{"}"}</p>
            </div>
            <div className="flex flex-col gap-1">
              <p className={cn("text-xs font-semibold", cl.length ? "text-bad" : "text-good")}>
                {cl.length} contradiction{cl.length === 1 ? "" : "s"} in one model
              </p>
              {cl.map(([, , q]) => (
                <motion.p
                  key={q}
                  initial={{ opacity: 0, x: -4 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="border-bad/40 bg-bad/5 rounded-md border px-2 py-1 text-[11px]"
                >
                  {q}
                </motion.p>
              ))}
            </div>
          </div>
          <p className="text-subtle text-[10px]">A fictional insurer. Illustrative.</p>
        </div>
      }
    >
      <p>
        An insurer wants one shared Customer record for the whole company. Add each
        department&apos;s idea of a customer and watch the single model grow fields nobody else
        understands, and rules that contradict each other.
      </p>
      <p>
        <Term id="domain-driven-design">Domain-driven design</Term>, from Eric Evans&apos;s 2003
        book, starts here. A <Term id="domain">domain</Term> is &ldquo;a sphere of knowledge,
        influence, or activity&rdquo;, and the words people use inside it matter. The fix is not to
        force one meaning on everyone; the next module shows what to do instead.
      </p>
    </StepLayout>
  );
}

/* 3 ─ The language in the code -------------------------------------------------------------------- */

export function InTheCode() {
  return (
    <StepLayout
      eyebrow="Compare"
      title="The language in the code"
      stage={
        <div className="grid flex-1 content-center gap-3 sm:grid-cols-2">
          <div className="flex flex-col gap-1.5">
            <p className="text-bad text-xs font-semibold">Developer-speak</p>
            <Code>{`record = db.get(id)
if record.status == 3:
    record.flag2 = True
    process(record)`}</Code>
            <p className="text-muted text-xs">
              What is status 3? What does flag2 mean? Only the person who wrote it knows.
            </p>
          </div>
          <div className="flex flex-col gap-1.5">
            <p className="text-good text-xs font-semibold">The business&apos;s own words</p>
            <Code>{`claim = claims.find(claim_id)
if claim.is_approved():
    claim.schedule_payout()`}</Code>
            <p className="text-muted text-xs">
              A claims manager could read this aloud and say whether it&apos;s right.
            </p>
          </div>
        </div>
      }
    >
      <p>
        Evans&apos;s answer is a <Term id="ubiquitous-language">ubiquitous language</Term>: &ldquo;a
        language structured around the domain model and used by all team members within a bounded
        context to connect all the activities of the team with the software.&rdquo;
      </p>
      <p>
        Use the same words in conversations, diagrams and code. And &ldquo;recognize that a change
        in the language is a change to the model&rdquo;: when the business renames something, rename
        the classes and methods too. As Martin Fowler puts it, &ldquo;software doesn&apos;t cope
        well with ambiguity.&rdquo;
      </p>
    </StepLayout>
  );
}

/* 4 ─ Learning from domain experts ---------------------------------------------------------------- */

const TIPS: [string, string][] = [
  [
    "Ask for real examples",
    "“Walk me through the last claim you handled” beats “what are the requirements?”",
  ],
  [
    "Write down the words",
    "Keep a short glossary of terms and their meaning, and fix it when it's wrong.",
  ],
  ["Hunt for synonyms", "If “client”, “member” and “policyholder” mean the same thing, pick one."],
  ["Hunt for homonyms", "If one word means two things, it's a sign of two models (next module)."],
  ["Let experts object", "Evans: experts “should object to terms or structures that are awkward”."],
];

export function ListenWell() {
  return (
    <StepLayout
      eyebrow="Explore"
      title="Learning from domain experts"
      stage={
        <div className="flex flex-1 flex-col justify-center gap-2">
          {TIPS.map(([t, d], i) => (
            <motion.div
              key={t}
              initial={{ opacity: 0, x: -6 }}
              animate={{ opacity: 1, x: 0 }}
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
        A <Term id="domain-expert">domain expert</Term> is someone who knows the business area
        deeply: an underwriter, a nurse, a dispatcher. They rarely know software; developers rarely
        know the business. The language is built between them.
      </p>
      <p>
        Evans warns that translation in either direction &ldquo;blunts communication&rdquo;. So
        developers learn the business&apos;s words, rather than the business learning
        developers&apos; words.
      </p>
    </StepLayout>
  );
}

/* 5 ─ Healthy or smelly? -------------------------------------------------------------------------- */

export function SmellOrNot() {
  return (
    <StepLayout
      eyebrow="Checkpoint"
      title="Healthy or smelly?"
      stage={
        <div className="flex flex-1 flex-col justify-center">
          <SortCheckpoint
            id="language-smells"
            prompt="Is each habit a healthy shared language, or a smell?"
            categories={[
              { id: "good", label: "Healthy" },
              { id: "smell", label: "Smell" },
            ]}
            items={[
              {
                id: "rename",
                label:
                  "Underwriters start saying 'cover' instead of 'plan', so the team renames the Plan class",
                category: "good",
                why: "A change in the language is a change to the model.",
              },
              {
                id: "glossary",
                label: "The team keeps a one-page glossary, reviewed with the claims manager",
                category: "good",
                why: "Words agreed with the people who use them.",
              },
              {
                id: "status",
                label: "Code uses status codes 1–9 that only developers can decode",
                category: "smell",
                why: "Developer-speak the business can't check.",
              },
              {
                id: "translate",
                label:
                  "A business analyst translates every meeting into 'tech terms' for developers",
                category: "smell",
                why: "Translation blunts communication; developers should learn the domain's words.",
              },
              {
                id: "synonyms",
                label:
                  "'Client', 'member' and 'policyholder' are used for the same thing in one team",
                category: "smell",
                why: "Synonyms cause confusion; agree one word.",
              },
            ]}
            explanation="A healthy language is agreed with domain experts, used everywhere including code, and changed deliberately."
          />
        </div>
      }
    >
      <p>Sort these habits.</p>
    </StepLayout>
  );
}

/* 6 ─ Wrap ---------------------------------------------------------------------------------------- */

const POINTS: [string, string][] = [
  ["Words cause bugs", "Two teams, one word, two meanings."],
  ["Ubiquitous language", "One agreed vocabulary, in talk and in code."],
  ["Learn from experts", "Developers adopt the business's words."],
  ["Change together", "Rename the code when the language changes."],
  ["Within a boundary", "A language holds inside a context, not across the whole company."],
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
        The insurer&apos;s five meanings of &ldquo;customer&rdquo; can&apos;t be one language. Next:
        bounded contexts, where each meaning gets a home of its own.
      </p>
    </StepLayout>
  );
}
