"use client";

import { defineModule } from "@/lib/module-sdk";
import { initialState, type AlignState } from "./state";
import { OverRefusal, Pipeline, Rater, Reward, Wrap } from "./steps";

export default defineModule<AlignState>({
  initialState,
  steps: [
    { id: "rater", title: "You are the rater", Component: Rater },
    { id: "reward", title: "Learn a reward, then chase it", Component: Reward },
    { id: "pipeline", title: "How preference training works", Component: Pipeline },
    {
      id: "refusal",
      title: "“I can't help with killing”",
      checkpoint: "over-refusal",
      Component: OverRefusal,
    },
    { id: "wrap", title: "What to remember", Component: Wrap },
  ],
});
