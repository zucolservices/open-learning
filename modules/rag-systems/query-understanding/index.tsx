"use client";

import { defineModule } from "@/lib/module-sdk";
import { initialState, type QueryState } from "./state";
import { AskingWell, FixQuestions, Techniques, WhenRewritingHurts, Wrap } from "./steps";

export default defineModule<QueryState>({
  initialState,
  steps: [
    { id: "asking", title: "The good shopkeeper", Component: AskingWell },
    { id: "fix", title: "Fix the question", Component: FixQuestions },
    { id: "techniques", title: "More techniques", Component: Techniques },
    {
      id: "hurts",
      title: "When rewriting hurts",
      checkpoint: "rewrite-hurts",
      Component: WhenRewritingHurts,
    },
    { id: "wrap", title: "What to remember", Component: Wrap },
  ],
});
