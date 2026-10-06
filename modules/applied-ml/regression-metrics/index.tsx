"use client";

import { defineModule } from "@/lib/module-sdk";
import { initialState, type RegMetState } from "./state";
import { Darts, HugeMiss, MeanMedian, Residuals, WhichMetric, Wrap } from "./steps";

export default defineModule<RegMetState>({
  initialState,
  steps: [
    { id: "story", title: "How good is the weather forecast?", Component: Darts },
    { id: "miss", title: "One huge miss, three metrics", Component: HugeMiss },
    { id: "mean-median", title: "Your metric picks your target", Component: MeanMedian },
    { id: "residuals", title: "Reading residuals", Component: Residuals },
    { id: "check", title: "Which metric?", checkpoint: "which-metric", Component: WhichMetric },
    { id: "wrap", title: "What to remember", Component: Wrap },
  ],
});
