import type { GlossaryEntry } from "./types";

/** LLM Evaluation track glossary. `module` slugs refer to this track. */
export const llmEvaluation = {
  "vibe-check": {
    term: "Vibe check",
    definition:
      "Trying a few examples by hand and judging whether the output feels right. A useful warning sign, but not evidence that a change is better.",
    module: "why-evals",
  },
  regression: {
    term: "Regression",
    definition:
      "Something that used to work and broke after a change. A regression suite re-runs old cases to catch these.",
    module: "why-evals",
  },
  "success-criteria": {
    term: "Success criteria",
    definition:
      "Specific, measurable statements of what a good result looks like, such as “at least 95% correct on 400 real questions”, agreed before testing.",
    module: "success-criteria",
  },
  "goodharts-law": {
    term: "Goodhart's law",
    definition:
      "“When a measure becomes a target, it ceases to be a good measure”: optimise one number hard and the system finds ways to raise it without really improving.",
    module: "success-criteria",
  },
  "eval-set": {
    term: "Eval set",
    definition:
      "The prepared test cases an eval runs on, each with an input and what a good answer should contain. Often called a golden dataset.",
    module: "eval-datasets",
  },
  "edge-case": {
    term: "Edge case",
    definition:
      "An unusual input at the limits of normal use, such as an empty message or a very long one, that a system must still handle.",
    module: "eval-datasets",
  },
  "held-out-set": {
    term: "Held-out set",
    definition:
      "Test cases kept back and never used while tuning prompts or models, so the score on them reflects how the system does on new questions.",
    module: "eval-datasets",
  },
  "exact-match": {
    term: "Exact match",
    definition:
      "A grader that passes an answer only if it equals the reference answer, usually after normalising case, punctuation and spacing.",
    module: "code-checks",
  },
  "pass-at-k": {
    term: "pass@k",
    definition:
      "The chance that at least one of k attempts passes the tests, used for generated code. pass@1 is the chance a single attempt passes.",
    module: "code-checks",
  },
  "similarity-metric": {
    term: "Similarity metric",
    definition:
      "A score for how closely an answer resembles a reference answer, by shared words or by meaning. It measures resemblance, not correctness.",
    module: "similarity-metrics",
  },
  "reference-answer": {
    term: "Reference answer",
    definition: "A known good answer that outputs are compared against.",
    module: "similarity-metrics",
  },
  bleu: {
    term: "BLEU",
    definition:
      "A 2002 machine-translation metric that counts word sequences an output shares with a reference, penalising outputs that are too short.",
    module: "similarity-metrics",
  },
  rouge: {
    term: "ROUGE",
    definition:
      "A 2004 summarisation metric family that measures how much of a reference's wording appears in an output.",
    module: "similarity-metrics",
  },
  "llm-judge": {
    term: "LLM judge",
    definition:
      "A language model used to grade other models' answers against a rubric, a reference or each other. Fast and cheap, but biased in known ways.",
    module: "llm-judge",
  },
  "position-bias": {
    term: "Position bias",
    definition:
      "A judge's tendency to prefer an answer because of where it appears (first or second) rather than what it says.",
    module: "llm-judge",
  },
  "verbosity-bias": {
    term: "Verbosity bias",
    definition:
      "A judge's tendency to prefer longer answers, even when a shorter one is just as good or better.",
    module: "llm-judge",
  },
  "confusion-matrix": {
    term: "Confusion matrix",
    definition:
      "A table counting how a grader's verdicts line up with the true labels: both fail, both pass, and the two kinds of disagreement.",
    module: "judge-agreement",
  },
  "cohens-kappa": {
    term: "Cohen's kappa",
    definition:
      "A measure of how much two raters agree beyond what chance alone would give: 1 is perfect, 0 is chance level.",
    module: "judge-agreement",
  },
  "criteria-drift": {
    term: "Criteria drift",
    definition:
      "People refining what they count as good while grading outputs, so a rubric can't be fully written in advance.",
    module: "judge-agreement",
  },
  "inter-rater-agreement": {
    term: "Inter-rater agreement",
    definition:
      "How consistently different people give the same label to the same item, usually reported with a chance-corrected statistic such as kappa.",
    module: "human-eval",
  },
  "krippendorffs-alpha": {
    term: "Krippendorff's alpha",
    definition:
      "An agreement statistic that works for any number of raters, missing ratings and ordered scales; 1 is perfect, 0 is chance.",
    module: "human-eval",
  },
  "bradley-terry": {
    term: "Bradley–Terry model",
    definition:
      "A statistical model that turns many head-to-head comparisons into a rating for each contestant, with uncertainty ranges. Used by Arena leaderboards.",
    module: "human-eval",
  },
  "confidence-interval": {
    term: "Confidence interval",
    definition:
      "A range around an estimate, built so that ranges made this way contain the true value a stated share of the time (often 95%).",
    module: "eval-statistics",
  },
  "standard-error": {
    term: "Standard error",
    definition:
      "How much an estimate such as an eval score would vary from sample to sample. For a pass rate p on n questions it is √(p(1−p)/n).",
    module: "eval-statistics",
  },
  bootstrap: {
    term: "Bootstrap",
    definition:
      "Estimating uncertainty by resampling your own data with replacement many times and looking at how much the result varies.",
    module: "eval-statistics",
  },
  "paired-comparison": {
    term: "Paired comparison",
    definition:
      "Comparing two versions on exactly the same cases, case by case, so differences between cases cancel out and fewer cases are needed.",
    module: "comparing-versions",
  },
  "p-value": {
    term: "p-value",
    definition:
      "How often a difference at least this big would appear by luck alone if there were no real difference. Small values suggest the difference is real.",
    module: "comparing-versions",
  },
  "win-rate": {
    term: "Win rate",
    definition:
      "The share of side-by-side comparisons one version wins. Only meaningful if you say how ties were counted.",
    module: "comparing-versions",
  },
  "batch-invariance": {
    term: "Batch invariance",
    definition:
      "Making a model server give the same output for a request however many other requests it is processed alongside, which removes a major cause of run-to-run differences.",
    module: "variance",
  },
  benchmark: {
    term: "Benchmark",
    definition:
      "A shared, public test set that many models are scored on, so their results can be compared.",
    module: "benchmarks",
  },
  "benchmark-saturation": {
    term: "Benchmark saturation",
    definition:
      "When top models all score near the maximum on a benchmark, so it can no longer tell them apart.",
    module: "benchmarks",
  },
  "data-contamination": {
    term: "Data contamination",
    definition:
      "Test questions ending up in a model's training data, so its score reflects memory rather than ability.",
    module: "contamination",
  },
  "live-benchmark": {
    term: "Live benchmark",
    definition:
      "A benchmark that keeps adding fresh, dated questions so models can be tested on material that didn't exist when they were trained.",
    module: "contamination",
  },
  "rag-triad": {
    term: "RAG triad",
    definition:
      "Three checks for a retrieval-augmented answer: were the retrieved passages relevant, is the answer supported by them, and does it address the question?",
    module: "eval-systems",
  },
  "trajectory-eval": {
    term: "Trajectory evaluation",
    definition:
      "Grading the path an agent took (which tools it called, with what inputs, in what order) rather than only its final result.",
    module: "eval-systems",
  },
} satisfies Record<string, GlossaryEntry>;
