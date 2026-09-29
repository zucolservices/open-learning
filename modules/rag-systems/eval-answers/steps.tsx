"use client";

import { motion } from "motion/react";
import { Check, X } from "lucide-react";
import { useSceneState } from "@/lib/module-sdk";
import { StepLayout } from "@/toolkit/layout/step-layout";
import { ChoiceCheckpoint } from "@/toolkit/checkpoints/choice";
import { Segmented } from "@/toolkit/controls/segmented";
import { Term } from "@/toolkit/glossary/term";
import { cn } from "@/lib/cn";
import data from "./data.json";
import type { JudgeState } from "./state";

const CASES = data.cases;

/** Answers were capped in length; mark the ones that were cut off. */
const ended = (t: string) => (/[.!?)\]]$/.test(t.trim()) ? t : `${t}…`);

function CasePills({
  value,
  onChange,
  done,
}: {
  value: number;
  onChange(i: number): void;
  done?: (id: string) => boolean;
}) {
  return (
    <div className="flex flex-wrap gap-1">
      {CASES.map((c, i) => (
        <button
          key={c.id}
          type="button"
          aria-pressed={value === i}
          aria-label={`Answer ${i + 1}`}
          onClick={() => onChange(i)}
          className={cn(
            "size-7 rounded-full border font-mono text-[11px]",
            value === i ? "border-accent bg-accent-soft" : "border-line hover:bg-surface-2",
            done?.(c.id) && value !== i && "bg-surface-2",
          )}
        >
          {i + 1}
        </button>
      ))}
    </div>
  );
}

function CaseView({ c }: { c: (typeof CASES)[number] }) {
  return (
    <div className="flex flex-col gap-2">
      <p className="border-line bg-surface rounded-xl border px-3 py-2 text-sm font-medium">
        {c.q}
        <span className="text-muted block text-[10px] font-normal">Real output from {c.src}</span>
      </p>
      <div>
        <p className="text-muted mb-0.5 text-[11px]">Passages the model was given</p>
        <ol className="flex max-h-36 flex-col gap-0.5 overflow-y-auto">
          {c.ctx.map((p, i) => (
            <li
              key={i}
              className="border-line bg-surface rounded border px-2 py-0.5 text-[10.5px] whitespace-pre-line"
            >
              <span className="font-mono">[{i + 1}]</span> {p}
            </li>
          ))}
        </ol>
      </div>
      <div className="border-accent bg-accent-soft rounded-lg border px-3 py-2 text-xs">
        <p className="text-muted text-[10px] tracking-wide uppercase">The answer</p>
        <p className="whitespace-pre-line">{ended(c.a)}</p>
      </div>
    </div>
  );
}

/* 1 ─ Marking an essay -------------------------------------------------------------------------- */

const QUESTIONS: [string, string, string][] = [
  [
    "Faithful?",
    "Is everything it says backed by the sources it was given?",
    "Checks the answer against the passages.",
  ],
  [
    "Relevant?",
    "Does it answer the question that was asked, without wandering?",
    "Checks the answer against the question.",
  ],
  [
    "Correct?",
    "Is it actually right?",
    "Needs the true answer, which the passages may not contain.",
  ],
];

export function Referee() {
  return (
    <StepLayout
      eyebrow="Analogy"
      title="Marking an essay"
      stage={
        <div className="grid flex-1 content-center gap-3 md:grid-cols-3">
          {QUESTIONS.map(([t, d, n], i) => (
            <motion.div
              key={t}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.15 * i }}
              className="border-line bg-surface rounded-xl border px-4 py-3"
            >
              <p className="font-semibold">{t}</p>
              <p className="mt-1 text-sm">{d}</p>
              <p className="text-muted mt-1 text-xs">{n}</p>
            </motion.div>
          ))}
        </div>
      }
    >
      <p>
        A teacher marking a sourced essay asks separate questions. Did the student stick to the
        sources? Did they answer the question set? Are they right? An essay can pass one and fail
        another.
      </p>
      <p>
        RAG answers get the same three checks. The first is called{" "}
        <Term id="faithfulness">faithfulness</Term> (or groundedness), the second{" "}
        <Term id="answer-relevance">answer relevance</Term>. The third, correctness, needs a known
        right answer, like the golden set from the last module.
      </p>
    </StepLayout>
  );
}

/* 2 ─ Judge them yourself ⭐ --------------------------------------------------------------------- */

function YesNo({
  label,
  value,
  onChange,
  truth,
}: {
  label: string;
  value?: number;
  onChange(v: number): void;
  truth?: number;
}) {
  return (
    <div className="flex items-center gap-2 text-xs">
      <span className="w-20 font-medium">{label}</span>
      {[1, 0].map((v) => (
        <button
          key={v}
          type="button"
          aria-pressed={value === v}
          onClick={() => onChange(v)}
          className={cn(
            "rounded-full border px-3 py-0.5",
            value === v
              ? truth === undefined
                ? "border-accent bg-accent-soft"
                : truth === v
                  ? "border-good bg-good/15"
                  : "border-bad bg-bad/15"
              : "border-line hover:bg-surface-2",
          )}
        >
          {v ? "Yes" : "No"}
        </button>
      ))}
      {truth !== undefined && value !== undefined && (
        <span className="text-muted text-[11px]">ours: {truth ? "yes" : "no"}</span>
      )}
    </div>
  );
}

export function JudgeYourself() {
  const [s, set] = useSceneState<JudgeState>();
  const c = CASES[s.i];
  const p = s.picks[c.id] ?? {};
  const both = p.f !== undefined && p.r !== undefined;
  const pick = (k: "f" | "r", v: number) =>
    set({ picks: { ...s.picks, [c.id]: { ...p, [k]: v } } });
  return (
    <StepLayout
      eyebrow="Fix the problem · real output"
      title="Judge them yourself"
      stage={
        <div className="flex flex-1 flex-col gap-3">
          <CasePills
            value={s.i}
            onChange={(i) => set({ i })}
            done={(id) => s.picks[id]?.f !== undefined && s.picks[id]?.r !== undefined}
          />
          <CaseView c={c} />
          <div className="flex flex-col gap-1.5">
            <YesNo
              label="Faithful?"
              value={p.f}
              onChange={(v) => pick("f", v)}
              truth={both ? c.ours.faithful : undefined}
            />
            <YesNo
              label="Relevant?"
              value={p.r}
              onChange={(v) => pick("r", v)}
              truth={both ? c.ours.relevant : undefined}
            />
          </div>
          {both && (
            <motion.p
              initial={{ opacity: 0, y: 4 }}
              animate={{ opacity: 1, y: 0 }}
              className="border-line bg-surface-2 rounded-lg border px-3 py-2 text-xs"
            >
              <span className="font-semibold">Correct? {c.ours.correct ? "Yes" : "No"}. </span>
              {c.ours.note}
            </motion.p>
          )}
        </div>
      }
    >
      <p>
        Nine real answers from earlier modules, with the passages each model was given. For each,
        decide: faithful? relevant? Then see our verdict, and whether it was correct.
      </p>
      <p>
        Watch for the ones that are faithful but wrong. Answer 5 sticks exactly to the five rows it
        was shown, and is wrong, because the right rows were never retrieved. Faithfulness checks
        the generator; it can&apos;t see a retrieval failure. That&apos;s why you measure both.
      </p>
    </StepLayout>
  );
}

/* 3 ─ Let a model judge ⭐ (real judge output) --------------------------------------------------- */

function Mark({ ok }: { ok: boolean | null }) {
  if (ok === null) return <span className="text-muted">–</span>;
  return ok ? (
    <Check className="text-good mx-auto size-3.5" />
  ) : (
    <X className="text-bad mx-auto size-3.5" />
  );
}

export function ModelJudge() {
  const [s, set] = useSceneState<JudgeState>();
  const c = CASES[s.j];
  const claimPass = (x: (typeof CASES)[number]) =>
    x.claims.score === null ? null : x.claims.score === 1;
  const agree1 = CASES.filter((x) => (x.judge.faithPass === 1) === (x.ours.faithful === 1)).length;
  const agree2 = CASES.filter(
    (x) => claimPass(x) !== null && claimPass(x) === (x.ours.faithful === 1),
  ).length;
  return (
    <StepLayout
      eyebrow="Comparison · real output"
      title="Let a model judge"
      stage={
        <div className="flex flex-1 flex-col gap-3">
          <div className="overflow-x-auto">
            <table className="w-full text-center text-[11px]">
              <thead>
                <tr className="text-muted">
                  <th className="py-1 text-left font-normal">Faithful?</th>
                  {CASES.map((x, i) => (
                    <th key={x.id} className="font-normal">
                      <button
                        type="button"
                        onClick={() => set({ j: i })}
                        className={cn(
                          "size-6 rounded-full font-mono",
                          s.j === i && "bg-accent-soft",
                        )}
                      >
                        {i + 1}
                      </button>
                    </th>
                  ))}
                  <th className="font-normal">Agrees</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-line border-t">
                  <td className="py-1 text-left">Our labels</td>
                  {CASES.map((x) => (
                    <td key={x.id}>
                      <Mark ok={x.ours.faithful === 1} />
                    </td>
                  ))}
                  <td />
                </tr>
                <tr className="border-line border-t">
                  <td className="py-1 text-left">One-shot judge</td>
                  {CASES.map((x) => (
                    <td key={x.id}>
                      <Mark ok={x.judge.faithPass === 1} />
                    </td>
                  ))}
                  <td className="font-mono">{agree1}/9</td>
                </tr>
                <tr className="border-line border-t">
                  <td className="py-1 text-left">Claim by claim</td>
                  {CASES.map((x) => (
                    <td key={x.id}>
                      <Mark ok={claimPass(x)} />
                    </td>
                  ))}
                  <td className="font-mono">{agree2}/9</td>
                </tr>
              </tbody>
            </table>
          </div>
          <Segmented
            size="sm"
            value={s.view}
            options={[
              ["oneshot", "One-shot verdict"],
              ["claims", "Claim by claim"],
            ]}
            onChange={(v) => set({ view: v })}
          />
          <motion.div
            key={`${s.j}-${s.view}`}
            initial={{ opacity: 0, y: 4 }}
            animate={{ opacity: 1, y: 0 }}
            className="border-line bg-surface rounded-lg border px-3 py-2 text-xs"
          >
            <p className="text-muted text-[10px]">
              Answer {s.j + 1}: &ldquo;{c.a.slice(0, 90)}
              {c.a.length > 90 ? "…" : ""}&rdquo;
            </p>
            {s.view === "oneshot" ? (
              <p className="mt-1 whitespace-pre-line">{ended(c.judge.faith)}</p>
            ) : c.claims.unique.length === 0 ? (
              <p className="mt-1">
                The claim splitter returned no claims, so there was nothing to score.
              </p>
            ) : (
              <ul className="mt-1 flex flex-col gap-0.5">
                {c.claims.unique.map((x) => (
                  <li key={x.claim} className="flex gap-1.5">
                    {x.ok ? (
                      <Check className="text-good mt-0.5 size-3 shrink-0" />
                    ) : (
                      <X className="text-bad mt-0.5 size-3 shrink-0" />
                    )}
                    {x.claim}
                  </li>
                ))}
                {c.claims.n > c.claims.unique.length && (
                  <li className="text-muted text-[11px]">
                    (The splitter repeated itself: {c.claims.n} claims, {c.claims.unique.length}{" "}
                    different.)
                  </li>
                )}
              </ul>
            )}
          </motion.div>
          <p className="text-muted text-[11px]">
            Our view of answer {s.j + 1}: {c.ours.note}
          </p>
        </div>
      }
    >
      <p>
        Checking every answer by hand doesn&apos;t scale, so teams use{" "}
        <Term id="llm-as-judge">a model as the judge</Term>. We tried two ways with Phi-4-mini.
      </p>
      <p>
        <strong>One-shot</strong>: &ldquo;is every claim supported? PASS or FAIL&rdquo;. It passed
        all nine, including the two that invent things (6 and 9). It even explained that
        &ldquo;W4&rdquo; was supported &ldquo;based on the figure mentioned in the answer&rdquo;.
      </p>
      <p>
        <strong>Claim by claim</strong>, the approach behind Ragas&apos; faithfulness score: split
        the answer into claims, check each. It caught both, but raised false alarms, partly because
        the splitter invented claims the answer never made (about credit scores, on answer 4).
        Neither is trustworthy without checking it against human labels.
      </p>
    </StepLayout>
  );
}

/* 4 ─ The judge's habits ------------------------------------------------------------------------ */

export function Biases() {
  const [a, b] = data.pairs;
  return (
    <StepLayout
      eyebrow="Explore · real output"
      title="The judge's habits"
      stage={
        <div className="flex flex-1 flex-col justify-center gap-3">
          <p className="text-muted text-[11px]">
            Which is better: the three-word &ldquo;I don&apos;t know&rdquo; (answer 3) or the long,
            padded one (answer 2)? Asked twice, with the order swapped.
          </p>
          {[a, b].map((p, i) => (
            <div key={i} className="border-line bg-surface rounded-lg border px-3 py-2 text-xs">
              <p className="text-muted text-[10px]">
                Round {i + 1}: A = {p.A === "widow-idk" ? "short" : "long"}, B ={" "}
                {p.B === "widow-idk" ? "short" : "long"}
              </p>
              <p className="mt-0.5 line-clamp-3">{p.verdict}</p>
              <p className="mt-1 font-medium">
                Picked the{" "}
                {(p.verdict.trim()[0] === "A" ? p.A : p.B) === "widow-idk" ? "short" : "long"}{" "}
                answer
              </p>
            </div>
          ))}
          <div className="grid gap-2 sm:grid-cols-3">
            {[
              [
                "Position",
                "Swap the order and GPT-4 kept its verdict only 65% of the time (MT-Bench study, 2023).",
              ],
              [
                "Length",
                "Padding answers with repeated points fooled older judges over 90% of the time; GPT-4 far less.",
              ],
              [
                "Self-preference",
                "Judges may favour answers in their own style; the evidence is mixed.",
              ],
            ].map(([t, d]) => (
              <div key={t} className="border-line bg-surface-2 rounded-lg border px-2.5 py-1.5">
                <p className="text-xs font-semibold">{t}</p>
                <p className="text-muted text-[11px]">{d}</p>
              </div>
            ))}
          </div>
        </div>
      }
    >
      <p>
        Asked to compare two answers, Phi-4-mini picked the long one both times. Consistent, so no
        position bias here, but a clear taste for length, even though the long answer wanders.
      </p>
      <p>
        Studies of model judges found these habits across the board. The usual fixes: ask twice with
        the order swapped, give the judge a reference answer, and ask for a pass/fail verdict on one
        clear question rather than a score out of ten.
      </p>
    </StepLayout>
  );
}

/* 5 ─ Making a judge trustworthy ---------------------------------------------------------------- */

const TRUST: [string, string][] = [
  [
    "Check the judge against people",
    "Label a sample by hand, run the judge on it, and look at what it catches and what it misses, not just overall agreement. Ours agreed 7 of 9 times and caught none of the failures.",
  ],
  [
    "Use a capable or specialised judge",
    "Small general models judge poorly. Small models trained for fact-checking can do well: MiniCheck (2024) matched GPT-4 at a fraction of the cost.",
  ],
  [
    "One clear question, pass or fail",
    "“Is claim X in the passages?” is easier to judge, and to check, than “rate this answer 1 to 10”.",
  ],
  [
    "Tools that do this",
    "Ragas, DeepEval, TruLens, Arize Phoenix, LangSmith, Promptfoo; managed: Amazon Bedrock RAG evaluation, Microsoft Foundry evaluators, Google's evaluation service. They define “faithfulness” differently, so read how.",
  ],
];

export function Trustworthy() {
  return (
    <StepLayout
      eyebrow="Explore"
      title="Making a judge trustworthy"
      stage={
        <div className="grid flex-1 content-center gap-2 sm:grid-cols-2">
          {TRUST.map(([t, d], i) => (
            <motion.div
              key={t}
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.06 * i }}
              className="border-line bg-surface rounded-xl border px-3 py-2"
            >
              <p className="text-sm font-semibold">{t}</p>
              <p className="text-muted mt-0.5 text-xs">{d}</p>
            </motion.div>
          ))}
        </div>
      }
    >
      <p>
        A model judge is a measuring instrument. Before trusting its readings, calibrate it against
        a sample you have measured by hand, and recheck when you change the judge or the prompt.
      </p>
      <p>
        Citations can be checked the same way: does each cited passage support its sentence
        (citation precision), and does each sentence have a supporting citation (citation recall)?
      </p>
    </StepLayout>
  );
}

/* 6 ─ A judge that always passes ---------------------------------------------------------------- */

export function WhenToTrust() {
  return (
    <StepLayout
      eyebrow="Checkpoint"
      title="A judge that always passes"
      stage={
        <div className="flex flex-1 flex-col justify-center">
          <ChoiceCheckpoint
            id="judge-passes"
            prompt="Your new LLM judge marks 98% of last week's answers as faithful. The team wants to put “98% faithful” on the dashboard. What do you do first?"
            options={[
              {
                id: "publish",
                label: "Publish it; the judge agreed with most answers",
                feedback:
                  "Ours passed every answer too, including two that invented facts. A judge that always says yes looks great.",
              },
              {
                id: "calibrate",
                label:
                  "Hand-label a sample that includes known bad answers and check how many of them the judge catches",
                correct: true,
                feedback:
                  "Yes. Agreement on good answers is easy; what matters is whether it catches the bad ones. Measure that before trusting the 98%.",
              },
              {
                id: "scale",
                label: "Switch to a 1-to-10 score so the number is more precise",
                feedback:
                  "Finer scales are harder for judges to apply consistently. Pass/fail on a clear question is easier to trust and to check.",
              },
            ]}
          />
        </div>
      }
    >
      <p>A number from an unchecked judge is a guess with a decimal point.</p>
    </StepLayout>
  );
}

/* 7 ─ Wrap --------------------------------------------------------------------------------------- */

const TAKEAWAYS: [string, string][] = [
  ["Three separate checks", "Faithful to the passages, relevant to the question, and correct."],
  ["Faithful can still be wrong", "If retrieval brought the wrong passages. Measure both halves."],
  [
    "Model judges have habits",
    "Lenient, fond of length, sensitive to order. Small ones especially.",
  ],
  ["Calibrate before trusting", "Check the judge on hand-labelled answers, especially bad ones."],
];

export function Wrap() {
  return (
    <StepLayout
      eyebrow="Wrap-up"
      title="What to remember"
      stage={
        <div className="grid flex-1 content-center gap-3 sm:grid-cols-2">
          {TAKEAWAYS.map(([t, d], i) => (
            <motion.div
              key={t}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.06 * i }}
              className="border-line bg-surface rounded-xl border px-4 py-3"
            >
              <p className="font-semibold">{t}</p>
              <p className="text-muted mt-1 text-sm">{d}</p>
            </motion.div>
          ))}
        </div>
      }
    >
      <p>
        Next: what happens when the documents themselves are the attack, with prompt injection, data
        leaks and access control in RAG.
      </p>
    </StepLayout>
  );
}
