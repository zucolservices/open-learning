"use client";

import { defineModule } from "@/lib/module-sdk";
import { initialState, type RerankState } from "./state";
import { FilterLab, NothingPassed, RerankLab, Rerankers, TwoRounds, Wrap } from "./steps";

export default defineModule<RerankState>({
  initialState,
  steps: [
    { id: "rounds", title: "Two rounds of selection", Component: TwoRounds },
    { id: "rerank", title: "Rerank the shortlist", Component: RerankLab },
    { id: "filter", title: "Keep only what helps", Component: FilterLab },
    {
      id: "nothing",
      title: "When nothing passes",
      checkpoint: "rerank-nothing",
      Component: NothingPassed,
    },
    { id: "rerankers", title: "Rerankers to know", Component: Rerankers },
    { id: "wrap", title: "What to remember", Component: Wrap },
  ],
});
