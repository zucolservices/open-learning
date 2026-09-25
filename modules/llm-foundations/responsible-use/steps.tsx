"use client";

import { AnimatePresence, motion } from "motion/react";
import {
  AlertTriangle,
  Check,
  Database,
  FileText,
  Scale,
  UserCheck,
  X,
  type LucideIcon,
} from "lucide-react";
import { useSceneState } from "@/lib/module-sdk";
import { StepLayout } from "@/toolkit/layout/step-layout";
import { ChoiceCheckpoint } from "@/toolkit/checkpoints/choice";
import { SortCheckpoint } from "@/toolkit/checkpoints/sort";
import { Segmented } from "@/toolkit/controls/segmented";
import { FrameCaption, Stepper } from "@/toolkit/controls/stepper";
import { Term } from "@/toolkit/glossary/term";
import { cn } from "@/lib/cn";
import { DECISIONS, type Verdict } from "./model";
import data from "./data.json";
import type { ResponsibleState } from "./state";

/* 1 ─ The new clerk (story) ------------------------------------------------------------------------ */

const FRAMES = [
  {
    title: "A clerk who learned from old files",
    text: "Imagine a new clerk at the taluk office who learned the whole job by reading twenty years of old files, and nothing else. They'll copy the good habits in those files. They'll copy the bad ones too.",
  },
  {
    title: "Bias from the data",
    text: "If the old files mostly show men as landholders, or mostly come in English, the clerk quietly expects that. An LLM learned from internet text, which over-represents some languages, places and groups, so its guesses lean the same way.",
  },
  {
    title: "Bias from the question",
    text: "Even a fair clerk gives unfair results if asked the wrong thing. Use “owns a smartphone” as a sign of wealth, and poorer families without one look eligible while those sharing a phone don't. A stand-in (proxy) can carry bias the rules never meant.",
  },
  {
    title: "The clerk also sees private papers",
    text: "Income, land records, family details. Whoever handles them must collect only what's needed, keep it safe, and not reuse it for something else. In India that's now the law: the DPDP Act.",
  },
  {
    title: "What goes wrong without checks",
    text: "Neither of these used an LLM, but both were automated benefit decisions. In the Netherlands, tax authorities wrongly accused about 26,000 parents of childcare-benefits fraud, helped by a risk-scoring model that treated non-Dutch nationality as a risk factor; the cabinet resigned in 2021. In Australia, “Robodebt” issued some 470,000 wrongful debts; a Royal Commission in 2023 called it “crude and cruel”.",
  },
];

const SOURCES: { icon: LucideIcon; label: string; from: number }[] = [
  { icon: FileText, label: "Training data", from: 1 },
  { icon: Scale, label: "The question you ask it", from: 2 },
  { icon: Database, label: "People's personal data", from: 3 },
  { icon: UserCheck, label: "How its answers are used", from: 4 },
];

export function Story() {
  const [s, set] = useSceneState<ResponsibleState>();
  const f = Math.min(s.frame, FRAMES.length - 1);
  return (
    <StepLayout
      eyebrow="Step through"
      title="The new clerk"
      stage={
        <div className="flex flex-1 flex-col gap-3">
          <div className="border-line bg-surface grid gap-2 rounded-xl border p-3 sm:grid-cols-2">
            {SOURCES.map(({ icon: Icon, label, from }) => {
              const on = f >= from;
              const now = f === from;
              return (
                <motion.div
                  key={label}
                  animate={{ opacity: on ? 1 : 0.35 }}
                  className={cn(
                    "flex items-center gap-2 rounded-lg border px-3 py-2 text-sm",
                    now ? "border-accent bg-accent-soft" : "border-line bg-surface",
                  )}
                >
                  <Icon className="text-muted size-4 shrink-0" />
                  {label}
                </motion.div>
              );
            })}
          </div>
          {f === 4 && (
            <motion.div
              initial={{ opacity: 0, y: 4 }}
              animate={{ opacity: 1, y: 0 }}
              className="grid gap-2 sm:grid-cols-2"
            >
              {[
                [
                  "Netherlands, 2013–2019",
                  "Childcare-benefits fraud algorithm; nationality as a risk factor",
                ],
                ["Australia, 2015–2019", "Robodebt: automated income averaging; unlawful debts"],
              ].map(([t, d]) => (
                <div key={t} className="border-bad/40 bg-bad/5 rounded-xl border px-3 py-2 text-xs">
                  <p className="font-semibold">{t}</p>
                  <p className="text-muted mt-0.5">{d}</p>
                </div>
              ))}
            </motion.div>
          )}
          <Stepper step={f} count={FRAMES.length} onChange={(n) => set({ frame: n })} />
          <FrameCaption frameKey={f} title={FRAMES[f].title}>
            {FRAMES[f].text}
          </FrameCaption>
        </div>
      }
    >
      <p>
        An LLM can be accurate on average and still unfair to particular people. That&apos;s{" "}
        <Term id="algorithmic-bias">bias</Term>: errors that fall more on some groups than others.
      </p>
      <p>
        Responsible use is about four things: where bias comes from, how personal data is handled,
        who has the final say, and being honest with users.
      </p>
    </StepLayout>
  );
}

/* 2 ─ Branching scenario ⭐ ------------------------------------------------------------------------- */

const VERDICT: Record<Verdict, [string, string, LucideIcon]> = {
  good: ["Holds up", "border-good/50 bg-good/10", Check],
  risky: ["Partly", "border-line-strong bg-surface-2", AlertTriangle],
  harm: ["Causes harm", "border-bad/50 bg-bad/10", X],
};

export function Scenario() {
  const [s, set] = useSceneState<ResponsibleState>();
  const at = Math.min(s.at, DECISIONS.length - 1);
  const d = DECISIONS[at];
  const chosen = d.options.find((o) => o.id === s.choices[d.id]);
  return (
    <StepLayout
      eyebrow="Branching scenario"
      title="Design the eligibility assistant"
      stage={
        <div className="flex flex-1 flex-col gap-3">
          <div className="flex flex-wrap gap-1.5">
            {DECISIONS.map((x, i) => {
              const c = x.options.find((o) => o.id === s.choices[x.id]);
              return (
                <button
                  key={x.id}
                  type="button"
                  onClick={() => set({ at: i })}
                  className={cn(
                    "flex items-center gap-1 rounded-full border px-2.5 py-1 text-xs",
                    i === at ? "border-accent bg-accent-soft" : "border-line hover:bg-surface-2",
                  )}
                >
                  {c && (
                    <span
                      className={cn(
                        "size-1.5 rounded-full",
                        c.verdict === "good"
                          ? "bg-good"
                          : c.verdict === "harm"
                            ? "bg-bad"
                            : "bg-muted",
                      )}
                    />
                  )}
                  {i + 1}. {x.area}
                </button>
              );
            })}
          </div>
          <AnimatePresence mode="wait">
            <motion.div
              key={d.id}
              initial={{ opacity: 0, x: 8 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -8 }}
              className="flex flex-col gap-2"
            >
              <p className="text-sm font-semibold">{d.question}</p>
              <p className="text-muted text-xs">{d.context}</p>
              <div className="grid gap-1.5">
                {d.options.map((o) => (
                  <button
                    key={o.id}
                    type="button"
                    aria-pressed={o.id === chosen?.id}
                    onClick={() => set({ choices: { ...s.choices, [d.id]: o.id } })}
                    className={cn(
                      "rounded-xl border px-3 py-2 text-left text-xs",
                      o.id === chosen?.id
                        ? "border-accent bg-accent-soft"
                        : "border-line bg-surface hover:bg-surface-2",
                    )}
                  >
                    {o.label}
                  </button>
                ))}
              </div>
              {chosen && <Consequence verdict={chosen.verdict} text={chosen.consequence} />}
              {chosen && at < DECISIONS.length - 1 && (
                <button
                  type="button"
                  onClick={() => set({ at: at + 1 })}
                  className="bg-accent text-accent-fg self-start rounded-full px-4 py-1.5 text-xs font-medium"
                >
                  Next decision
                </button>
              )}
              {chosen && at === DECISIONS.length - 1 && (
                <p className="text-muted text-xs">
                  All six made. Continue to see your launch review, or revisit any decision above.
                </p>
              )}
            </motion.div>
          </AnimatePresence>
        </div>
      }
    >
      <p>
        Karnataka&apos;s welfare department wants <strong>Sahayak</strong>, an assistant that helps
        citizens find out whether they qualify for a support scheme, in Kannada, Hindi, Urdu or
        English.
      </p>
      <p>
        You make six decisions. Each shows what happens next. Change your mind as often as you like:
        there are no points, only consequences.
      </p>
    </StepLayout>
  );
}

function Consequence({ verdict, text }: { verdict: Verdict; text: string }) {
  const [label, cls, Icon] = VERDICT[verdict];
  return (
    <motion.div
      key={text}
      initial={{ opacity: 0, y: 4 }}
      animate={{ opacity: 1, y: 0 }}
      className={cn("rounded-xl border px-3 py-2 text-xs", cls)}
    >
      <p className="flex items-center gap-1.5 font-semibold">
        <Icon className="size-3.5" /> {label}
      </p>
      <p className="mt-1">{text}</p>
    </motion.div>
  );
}

/* 3 ─ Launch review --------------------------------------------------------------------------------- */

export function Review() {
  const [s] = useSceneState<ResponsibleState>();
  const made = DECISIONS.filter((d) => s.choices[d.id]);
  const risks = DECISIONS.flatMap(
    (d) => d.options.find((o) => o.id === s.choices[d.id])?.risks ?? [],
  );
  return (
    <StepLayout
      eyebrow="Consequences"
      title="Launch review"
      stage={
        <div className="flex flex-1 flex-col gap-3">
          <div className="grid gap-1.5">
            {DECISIONS.map((d) => {
              const o = d.options.find((x) => x.id === s.choices[d.id]);
              const [label, cls] = o ? VERDICT[o.verdict] : ["Not decided", "border-line"];
              return (
                <div
                  key={d.id}
                  className={cn(
                    "grid gap-1 rounded-xl border px-3 py-2 text-xs sm:grid-cols-[7rem_1fr_6rem]",
                    cls,
                  )}
                >
                  <span className="font-semibold">{d.area}</span>
                  <span className={cn(!o && "text-muted")}>
                    {o?.label ?? "Go back and choose."}
                  </span>
                  <span className="text-muted sm:text-right">{label}</span>
                </div>
              );
            })}
          </div>
          <div
            className={cn(
              "rounded-xl border px-4 py-3 text-sm",
              made.length === DECISIONS.length && risks.length === 0
                ? "border-good/40 bg-good/10"
                : "border-line bg-surface",
            )}
          >
            {made.length < DECISIONS.length ? (
              <p>
                {DECISIONS.length - made.length} decision
                {DECISIONS.length - made.length > 1 ? "s" : ""} still open. Go back a step to
                finish.
              </p>
            ) : risks.length === 0 ? (
              <p>
                No open risks from your design. Code applies the rules, the model explains, personal
                data stays minimal, people review refusals and users know it&apos;s an AI.
                You&apos;d still re-test for bias after every model or prompt change.
              </p>
            ) : (
              <>
                <p className="font-semibold">Open risks at launch</p>
                <ul className="mt-1 list-disc space-y-0.5 pl-4 text-xs">
                  {risks.map((r) => (
                    <li key={r}>{r}</li>
                  ))}
                </ul>
                <p className="text-muted mt-2 text-xs">
                  Go back and change the decisions marked “Partly” or “Causes harm”.
                </p>
              </>
            )}
          </div>
        </div>
      }
    >
      <p>Here is what your Sahayak looks like on launch day, and the risks it carries.</p>
      <p className="text-muted text-sm">
        If this assistant ran in the EU, deciding eligibility for public benefits would count as
        “high-risk” under the EU AI Act, with duties on risk management, human oversight and records
        from 2 December 2027.
      </p>
    </StepLayout>
  );
}

/* 4 ─ Swap the name ⭐ (real models) ----------------------------------------------------------------- */

type CaseId = "clear" | "borderline" | "vague";
const CASES: [CaseId, string][] = [
  ["clear", "Clearly eligible"],
  ["borderline", "Borderline"],
  ["vague", "Not enough info"],
];
const RIGHT: Record<CaseId, string> = {
  clear: "Right answer: Yes (₹95,000 and 1 acre are both under the limits).",
  borderline:
    "Right answer: can't say yet. “About ₹1.2 lakh” is at the limit, not clearly below it; an officer should check.",
  vague: "Right answer: can't say. There's no income or land figure, so the assistant should ask.",
};
const FINDING: Record<string, Record<CaseId, string>> = {
  qwen: {
    clear:
      "Wrong for everyone: it says “No” to a clearly eligible applicant about 97% of the time. The names barely matter, because the model can't apply the rule.",
    borderline:
      "It says “Yes” about 90% of the time, when the income isn't clearly under the limit. Men's names score a little higher than women's in all four pairs.",
    vague: "Leans “Yes” (82–91%) with nothing to go on. Forced to choose, it guesses.",
  },
  llama: {
    clear:
      "Mostly wrong, and the name matters: Rahul Sharma gets “Yes” 36% of the time, Lakshmi Gowda 19%. Same facts; only the name changed.",
    borderline: "Mostly “No” (6–11%), with small differences between names.",
    vague: "Mostly “No” (4–7%). Neither yes nor no is right: it should ask.",
  },
  phi: {
    clear: "Right for everyone (98–99% “Yes”), and names make at most a one-point difference.",
    borderline: "Mostly “No” (6–10%); a few points between names.",
    vague: "Mostly “No” (5–11%). It should ask for income and land instead.",
  },
};

export function SwapTheName() {
  const [s, set] = useSceneState<ResponsibleState>();
  const c = s.probeCase as CaseId;
  const m = data.models.find((x) => x.id === s.model) ?? data.models[0];
  const ps = m.p[c];
  const spread = Math.round((Math.max(...ps) - Math.min(...ps)) * 100);
  return (
    <StepLayout
      eyebrow="Real models"
      title="Swap the name"
      stage={
        <div className="flex flex-1 flex-col gap-3">
          <div className="flex flex-wrap gap-2">
            <Segmented
              size="sm"
              value={s.model}
              options={data.models.map((x) => [x.id, x.label] as [string, string])}
              onChange={(v) => set({ model: v })}
            />
            <Segmented
              size="sm"
              value={c}
              options={CASES}
              onChange={(v) => set({ probeCase: v })}
            />
          </div>
          <div className="border-line bg-surface rounded-xl border p-3 text-xs">
            <p className="text-muted text-[11px]">Rule given to the model</p>
            <p className="mt-0.5">{data.system}</p>
            <p className="text-muted mt-2 text-[11px]">Application (only the name changes)</p>
            <p className="mt-0.5 font-mono text-[11px]">{data.cases[c].replace("{N}", "[name]")}</p>
          </div>
          <div className="border-line bg-surface rounded-xl border p-3">
            <p className="text-muted mb-2 text-[11px]">Chance the model answers “Yes”</p>
            <div className="grid gap-1">
              {data.names.map(([name, g], i) => (
                <div key={name} className="grid grid-cols-[7.5rem_1fr_2.5rem] items-center gap-2">
                  <span className="truncate text-xs">{name}</span>
                  <div className="bg-surface-2 h-3 overflow-hidden rounded">
                    <motion.div
                      className={cn("h-full", g === "f" ? "bg-accent" : "bg-accent/45")}
                      animate={{ width: `${ps[i] * 100}%` }}
                    />
                  </div>
                  <span className="text-right font-mono text-[11px]">
                    {Math.round(ps[i] * 100)}%
                  </span>
                </div>
              ))}
            </div>
            <div className="text-muted mt-2 flex flex-wrap gap-3 text-[10px]">
              <span className="flex items-center gap-1">
                <span className="bg-accent size-2.5 rounded-sm" /> women&apos;s names
              </span>
              <span className="flex items-center gap-1">
                <span className="bg-accent/45 size-2.5 rounded-sm" /> men&apos;s names
              </span>
              <span>Gap between names: {spread} points</span>
            </div>
          </div>
          <AnimatePresence mode="wait">
            <motion.div
              key={m.id + c}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="border-line bg-surface-2 rounded-xl border px-3 py-2 text-xs"
            >
              <p className="font-semibold">{RIGHT[c]}</p>
              <p className="mt-1">{FINDING[m.id][c]}</p>
            </motion.div>
          </AnimatePresence>
          <p className="text-subtle text-[10px]">
            Real measurements: three small open-weight models (Qwen2.5-1.5B-Instruct,
            Llama-3.2-3B-Instruct, Phi-4-mini-instruct, 4-bit, run with Transformers.js). Each bar
            is the model&apos;s probability of “Yes” versus “No” as its first word. Bigger hosted
            models do better on simple rules, but the method, and the need to test, is the same.
          </p>
        </div>
      }
    >
      <p>
        Here&apos;s why the scenario said “code decides” and “test it yourself”. We gave three real
        models the scheme&apos;s rule and the same application eight times, changing only the
        applicant&apos;s name.
      </p>
      <p>
        That&apos;s a <Term id="counterfactual-test">counterfactual test</Term>: if an irrelevant
        detail changes the answer, the system is treating people differently.
      </p>
      <p className="text-muted text-sm">
        Two lessons. The models can get a simple rule wrong, and disagree with each other. And a
        name alone can move the answer. Try Llama on the clear case.
      </p>
    </StepLayout>
  );
}

/* 5 ─ Checkpoint: reusing chats (DPDP) ------------------------------------------------------------- */

export function Consent() {
  return (
    <StepLayout
      eyebrow="Checkpoint"
      title="Reusing the chats"
      stage={
        <div className="flex flex-1 flex-col justify-center">
          <ChoiceCheckpoint
            id="reuse-chats"
            prompt="Six months after launch, the department wants to fine-tune its own model on citizens' Sahayak chats. Under the DPDP Act, what's the responsible way?"
            options={[
              {
                id: "optin",
                label:
                  "Ask users for separate, specific consent (in their language, as easy to withdraw as to give), or properly anonymise the chats first; leave out anyone who didn't agree",
                correct: true,
                feedback:
                  "Yes. Training a model is a new purpose. The allowance for providing a benefit doesn't stretch to it, so it needs its own clear basis.",
              },
              {
                id: "covered",
                label: "Nothing extra: the State can process data to provide benefits",
                feedback:
                  "That allowance covers giving people the benefit, not reusing their conversations to build something else.",
              },
              {
                id: "policy",
                label: "Add a sentence to the privacy policy and carry on",
                feedback:
                  "Consent under the Act must be specific and informed, given by a clear action. A quiet policy edit isn't that.",
              },
              {
                id: "vendor",
                label: "It's fine, because the model provider promises not to train on the data",
                feedback:
                  "That promise is about the provider. Here the department itself wants to reuse the data, so the department needs the basis.",
              },
            ]}
            explanation="The DPDP Act (2023) and DPDP Rules (notified 14 November 2025) phase in over 18 months; most duties on organisations apply from 14 May 2027. Consent must be “free, specific, informed, unconditional and unambiguous with a clear affirmative action”, withdrawing it must be about as easy as giving it, and notices can be given in English or any of the 22 languages in the Constitution's Eighth Schedule."
          />
        </div>
      }
    >
      <p>
        India&apos;s <Term id="dpdp">DPDP Act</Term> is built around purpose: you may use personal
        data for the reason you collected it, and a new reason needs a new basis.
      </p>
      <p className="text-muted text-sm">This is general information, not legal advice.</p>
    </StepLayout>
  );
}

/* 6 ─ Sort the safeguards --------------------------------------------------------------------------- */

export function Oversight() {
  return (
    <StepLayout
      eyebrow="Checkpoint"
      title="Which safeguard?"
      stage={
        <div className="flex flex-1 flex-col justify-center">
          <SortCheckpoint
            id="safeguards"
            prompt="Sort each safeguard by the problem it mainly addresses."
            categories={[
              { id: "bias", label: "Bias" },
              { id: "privacy", label: "Privacy" },
              { id: "oversight", label: "Oversight & honesty" },
            ]}
            items={[
              {
                id: "split",
                label: "Compare error rates for Kannada and English applicants",
                category: "bias",
                why: "Splitting results by group reveals who the system serves worse; an average hides it.",
              },
              {
                id: "swap",
                label: "Swap applicant names on otherwise identical cases",
                category: "bias",
                why: "A counterfactual test: an irrelevant detail shouldn't change the answer.",
              },
              {
                id: "minimise",
                label: "Collect only the fields the rules actually use",
                category: "privacy",
                why: "Data minimisation: what you don't collect can't leak or be misused.",
              },
              {
                id: "erase",
                label: "Delete application data once the case is closed",
                category: "privacy",
                why: "The DPDP Act expects erasure once the purpose is served.",
              },
              {
                id: "appeal",
                label: "Show the reason for every refusal and a simple way to appeal",
                category: "oversight",
                why: "People stay in charge, and mistakes can be corrected.",
              },
              {
                id: "ai",
                label: "Tell users they're talking to an AI",
                category: "oversight",
                why: "Honesty about what they're dealing with helps people judge and question answers.",
              },
            ]}
          />
        </div>
      }
    >
      <p>
        Keeping a <Term id="human-in-the-loop">human in the loop</Term> only works if they can see
        why the system said what it said. Otherwise they drift into{" "}
        <Term id="automation-bias">automation bias</Term> and approve whatever it suggests.
      </p>
    </StepLayout>
  );
}

/* 7 ─ Wrap ------------------------------------------------------------------------------------------- */

const TAKEAWAYS: [string, string][] = [
  [
    "Code decides, the model explains",
    "Don't ask an LLM to apply rules that code can apply exactly.",
  ],
  [
    "Measure bias yourself",
    "Swap names and languages; split results by group. Repeat after every change.",
  ],
  [
    "Collect less, keep it briefly",
    "Only what the purpose needs; clear notice in the user's language; new purpose, new basis.",
  ],
  [
    "Humans on decisions that matter",
    "Reasons shown, refusals reviewed, appeals easy; say plainly that it's an AI.",
  ],
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
        India&apos;s AI Governance Guidelines (November 2025) put it in seven principles, including
        “People first”, “Fairness &amp; equity” and “Understandable by design”. They&apos;re
        voluntary; the DPDP Act is law.
      </p>
      <p>Next: the capstones. First, design a multilingual citizen helpdesk end to end.</p>
    </StepLayout>
  );
}
