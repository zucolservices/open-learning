"use client";

import { motion } from "motion/react";
import { useSceneState } from "@/lib/module-sdk";
import { StepLayout } from "@/toolkit/layout/step-layout";
import { SortCheckpoint } from "@/toolkit/checkpoints/sort";
import { Segmented } from "@/toolkit/controls/segmented";
import { Term } from "@/toolkit/glossary/term";
import { cn } from "@/lib/cn";
import type { WhyRagState } from "./state";

/* 2 ─ Three ways to teach a model ----------------------------------------------------------------- */

type Approach = WhyRagState["approach"];
type Rating = "good" | "mixed" | "poor";

const ROWS = [
  "Adding new facts",
  "Keeping up with changes",
  "Showing sources",
  "Cost per question",
  "Changing style and format",
];

const APPROACHES: Record<
  Approach,
  { name: string; how: string; ratings: [Rating, string][]; evidence: string }
> = {
  rag: {
    name: "Retrieval (RAG)",
    how: "Search your documents for each question and put the best passages in the prompt.",
    ratings: [
      ["good", "The facts arrive with the question"],
      ["good", "Update the documents; re-index"],
      ["good", "You know which passages were used"],
      ["good", "Only a few passages per question"],
      ["poor", "Not what it's for"],
    ],
    evidence:
      "Ovadia et al. (EMNLP 2024) compared the two for adding knowledge and found RAG “consistently outperforms” unsupervised fine-tuning.",
  },
  finetune: {
    name: "Fine-tuning",
    how: "Train the model further on your own examples, changing its weights.",
    ratings: [
      ["mixed", "Learned slowly, and can raise hallucinations"],
      ["poor", "Retrain for every change"],
      ["poor", "Knowledge is blended into the weights"],
      ["good", "No extra text per question"],
      ["good", "Its real strength: tone, format, behaviour"],
    ],
    evidence:
      "Gekhman et al. (EMNLP 2024): new facts are “learned significantly slower” in fine-tuning and “linearly increase the model's tendency to hallucinate”. Fine-tune for how to answer; retrieve for what is true.",
  },
  long: {
    name: "Long context",
    how: "Skip the search: paste whole documents into a context window of about a million tokens.",
    ratings: [
      ["good", "If everything fits"],
      ["good", "Paste the new version"],
      ["mixed", "Possible, but the model must find the spot"],
      ["poor", "Every question pays for every page"],
      ["poor", "Not what it's for"],
    ],
    evidence:
      "Li et al. (EMNLP 2024): with enough resources, long context beat RAG on average, but “RAG's significantly lower cost remains a distinct advantage”. And models miss facts buried in the middle of long inputs (Liu et al., 2024).",
  },
};

const DOT: Record<Rating, string> = {
  good: "bg-good",
  mixed: "bg-viz-compute",
  poor: "bg-bad",
};

export function ThreeWays() {
  const [s, set] = useSceneState<WhyRagState>();
  const a = APPROACHES[s.approach];
  return (
    <StepLayout
      eyebrow="Compare"
      title="Three ways to teach a model"
      stage={
        <div className="flex flex-1 flex-col gap-3">
          <Segmented
            size="sm"
            value={s.approach}
            options={[
              ["rag", "Retrieval"],
              ["finetune", "Fine-tuning"],
              ["long", "Long context"],
            ]}
            onChange={(v) => set({ approach: v })}
          />
          <motion.div
            key={s.approach}
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-col gap-2"
          >
            <p className="text-sm">
              <span className="font-semibold">{a.name}: </span>
              {a.how}
            </p>
            <ul className="border-line bg-surface divide-line divide-y rounded-xl border">
              {ROWS.map((r, i) => (
                <li key={r} className="flex items-center gap-3 px-3 py-2 text-xs">
                  <span className={cn("size-2.5 shrink-0 rounded-full", DOT[a.ratings[i][0]])} />
                  <span className="w-28 shrink-0 font-medium sm:w-40">{r}</span>
                  <span className="text-muted">{a.ratings[i][1]}</span>
                </li>
              ))}
            </ul>
            <p className="text-muted border-line border-l-2 pl-3 text-xs">{a.evidence}</p>
          </motion.div>
          <div className="text-muted flex flex-wrap gap-x-4 gap-y-1 text-[10px]">
            {(
              [
                ["good", "Strong"],
                ["mixed", "It depends"],
                ["poor", "Weak"],
              ] as [Rating, string][]
            ).map(([k, l]) => (
              <span key={k} className="flex items-center gap-1.5">
                <span className={cn("size-2 rounded-full", DOT[k])} /> {l}
              </span>
            ))}
          </div>
        </div>
      }
    >
      <p>
        There are three main ways to get your organisation&apos;s knowledge into an answer. Compare
        them. They aren&apos;t rivals: many real systems combine two.
      </p>
      <p>
        <Term id="fine-tuning">Fine-tuning</Term> changes the model itself. A long{" "}
        <Term id="context-window">context window</Term> lets you paste in a lot. Retrieval picks
        just the right pieces each time, which is what the rest of this track is about.
      </p>
      <p className="text-muted text-sm">
        <Term id="prompt-caching">Prompt caching</Term> can make long, repeated context much
        cheaper, which narrows the gap for small, stable document sets.
      </p>
    </StepLayout>
  );
}

/* 3 ─ Which one fits? ------------------------------------------------------------------------------ */

export function FitCheck() {
  return (
    <StepLayout
      eyebrow="Checkpoint"
      title="Which one fits?"
      stage={
        <div className="flex flex-1 flex-col justify-center">
          <SortCheckpoint
            id="rag-fit"
            prompt="Which approach fits each job best?"
            categories={[
              { id: "rag", label: "Retrieval" },
              { id: "ft", label: "Fine-tuning" },
              { id: "long", label: "Long context" },
            ]}
            items={[
              {
                id: "policies",
                label: "Answer staff questions from 3,000 policy PDFs that change every month",
                category: "rag",
                why: "Far too much to paste in each time, and it changes often: search it, and re-index when it changes.",
              },
              {
                id: "tone",
                label: "Make every reply follow the support team's tone and a fixed JSON format",
                category: "ft",
                why: "That's behaviour, not facts: what fine-tuning is good at (clear instructions often work too).",
              },
              {
                id: "contract",
                label: "Summarise one 60-page contract a lawyer has just uploaded",
                category: "long",
                why: "One document, used once, that fits in the window: no index needed.",
              },
              {
                id: "circulars",
                label: "Answer citizens from this week's government circulars, showing the source",
                category: "rag",
                why: "Fresh documents and visible sources are retrieval's strengths.",
              },
            ]}
          />
        </div>
      }
    >
      <p>
        Sort each job. More than one approach could work for some of them; pick the one that fits
        best.
      </p>
    </StepLayout>
  );
}

/* 4 ─ Wrap --------------------------------------------------------------------------------------- */

const TAKEAWAYS: [string, string][] = [
  [
    "Models answer from memory",
    "They can't know your documents or recent changes, and may guess confidently.",
  ],
  ["RAG is an open-book exam", "Find the right passages first, then answer from them."],
  ["Update documents, not models", "Re-index when things change; no retraining."],
  [
    "Right tool for the job",
    "Retrieve for facts, fine-tune for behaviour, long context for one big document.",
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
        An Indian example: Jugalbandi (2023), a WhatsApp chatbot built by AI4Bharat, OpenNyAI and
        partners with Microsoft, let people ask about government schemes in their own language. It
        found the relevant scheme information, usually written in English, and replied in theirs: 10
        languages and 171 schemes at launch.
      </p>
      <p>Next: a whole RAG system, end to end, running on a small set of documents.</p>
    </StepLayout>
  );
}
