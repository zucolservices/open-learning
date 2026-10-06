"use client";

import { defineModule } from "@/lib/module-sdk";
import { initialState, type OverfitState } from "./state";
import { Memoriser, TrainVsValid, LearningCurves, Remedies, WhichProblem, Wrap } from "./steps";

export default defineModule<OverfitState>({
  initialState,
  steps: [
    { id: "story", title: "The student who memorised the answers", Component: Memoriser },
    { id: "train-valid", title: "Train versus validation error", Component: TrainVsValid },
    { id: "curves", title: "Learning curves", Component: LearningCurves },
    { id: "remedies", title: "Reining models in", Component: Remedies },
    {
      id: "check",
      title: "Overfitting or underfitting?",
      checkpoint: "over-or-under",
      Component: WhichProblem,
    },
    { id: "wrap", title: "What to remember", Component: Wrap },
  ],
});
