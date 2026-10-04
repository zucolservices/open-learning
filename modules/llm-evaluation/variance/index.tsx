"use client";

import { defineModule } from "@/lib/module-sdk";
import { initialState, type VarianceState } from "./state";
import { FreeThrows, EveryTime, SameQuestion, SeveralRuns, WhichMeasure, Wrap } from "./steps";

export default defineModule<VarianceState>({
  initialState,
  steps: [
    { id: "story", title: "Free throws", Component: FreeThrows },
    { id: "every-time", title: "Right every time?", Component: EveryTime },
    { id: "same", title: "Same question, different answers", Component: SameQuestion },
    { id: "runs", title: "Run each case several times", Component: SeveralRuns },
    {
      id: "check",
      title: "At least once, or every time?",
      checkpoint: "which-measure",
      Component: WhichMeasure,
    },
    { id: "wrap", title: "What to remember", Component: Wrap },
  ],
});
