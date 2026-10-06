"use client";

import { defineModule } from "@/lib/module-sdk";
import { initialState, type MetricsState } from "./state";
import { SmokeAlarm, Threshold, Curves, ChooseThreshold, PrecisionOrRecall, Wrap } from "./steps";

export default defineModule<MetricsState>({
  initialState,
  steps: [
    { id: "story", title: "The smoke alarm", Component: SmokeAlarm },
    { id: "threshold", title: "Move the fraud threshold", Component: Threshold },
    { id: "curves", title: "ROC and precision–recall curves", Component: Curves },
    { id: "choose", title: "Choosing the threshold", Component: ChooseThreshold },
    {
      id: "check",
      title: "Precision or recall?",
      checkpoint: "precision-or-recall",
      Component: PrecisionOrRecall,
    },
    { id: "wrap", title: "What to remember", Component: Wrap },
  ],
});
