"use client";

import { defineModule } from "@/lib/module-sdk";
import { initialState, type PretrainState } from "./state";
import { Budget, Overtrain, PredictTokens, Scale, WatchItLearn, Wrap } from "./steps";

export default defineModule<PretrainState>({
  initialState,
  steps: [
    { id: "learn", title: "Watch a model learn", Component: WatchItLearn },
    { id: "budget", title: "Spend a compute budget", Component: Budget },
    {
      id: "tokens",
      title: "How much data for 70B?",
      checkpoint: "chinchilla-tokens",
      Component: PredictTokens,
    },
    { id: "scale", title: "The scale of it", Component: Scale },
    {
      id: "overtrain",
      title: "Why train past the sweet spot?",
      checkpoint: "overtrain",
      Component: Overtrain,
    },
    { id: "wrap", title: "What to remember", Component: Wrap },
  ],
});
