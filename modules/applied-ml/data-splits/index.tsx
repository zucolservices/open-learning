"use client";

import { defineModule } from "@/lib/module-sdk";
import { initialState, type SplitsState } from "./state";
import { SealedExam, ThreeSplits, CrossValidation, RealCases, WhichSplit, Wrap } from "./steps";

export default defineModule<SplitsState>({
  initialState,
  steps: [
    { id: "story", title: "A sealed exam", Component: SealedExam },
    { id: "splits", title: "Random, time and group splits", Component: ThreeSplits },
    { id: "cv", title: "Validation and cross-validation", Component: CrossValidation },
    { id: "cases", title: "When splits went wrong", Component: RealCases },
    { id: "check", title: "Which split?", checkpoint: "which-split", Component: WhichSplit },
    { id: "wrap", title: "What to remember", Component: Wrap },
  ],
});
