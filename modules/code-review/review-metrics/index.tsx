"use client";

import { defineModule } from "@/lib/module-sdk";
import { initialState, type MetricsState } from "./state";
import { Cobra, Pick, Frameworks, Questions, MetricsCheck, Wrap } from "./steps";

export default defineModule<MetricsState>({
  initialState,
  steps: [
    { id: "story", title: "Paid by the call", Component: Cobra },
    { id: "pick", title: "Pick three targets for next quarter", Component: Pick },
    { id: "frameworks", title: "Measuring flow: DORA and SPACE", Component: Frameworks },
    { id: "questions", title: "Use numbers to ask questions", Component: Questions },
    {
      id: "check",
      title: "Signal or game?",
      checkpoint: "review-metrics",
      Component: MetricsCheck,
    },
    { id: "wrap", title: "What to remember", Component: Wrap },
  ],
});
