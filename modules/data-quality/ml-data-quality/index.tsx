"use client";

import { defineModule } from "@/lib/module-sdk";
import { initialState, type MlState } from "./state";
import { Recipe, Train, Skew, ForAI, WhichProblem, Wrap } from "./steps";

export default defineModule<MlState>({
  initialState,
  steps: [
    { id: "story", title: "Learning from a bad recipe book", Component: Recipe },
    { id: "train", title: "Train, then drift", Component: Train },
    { id: "skew", title: "Checking ML data", Component: Skew },
    { id: "ai", title: "Data for AI applications", Component: ForAI },
    {
      id: "check",
      title: "Which problem is it?",
      checkpoint: "ml-problem",
      Component: WhichProblem,
    },
    { id: "wrap", title: "What to remember", Component: Wrap },
  ],
});
