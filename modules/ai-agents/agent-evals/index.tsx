"use client";

import { defineModule } from "@/lib/module-sdk";
import { initialState, type EvalState } from "./state";
import { DrivingTest, ScoreRuns, Reliability, Benchmarks, OutcomeOrPath, Wrap } from "./steps";

export default defineModule<EvalState>({
  initialState,
  steps: [
    { id: "story", title: "The driving test", Component: DrivingTest },
    { id: "score", title: "Score ten runs", Component: ScoreRuns },
    { id: "reliability", title: "Once, or every time?", Component: Reliability },
    { id: "benchmarks", title: "Benchmarks for agents", Component: Benchmarks },
    {
      id: "check",
      title: "Outcome or path?",
      checkpoint: "outcome-or-path",
      Component: OutcomeOrPath,
    },
    { id: "wrap", title: "What to remember", Component: Wrap },
  ],
});
