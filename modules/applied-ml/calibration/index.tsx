"use client";

import { defineModule } from "@/lib/module-sdk";
import { initialState, type CalState } from "./state";
import { Forecaster, Reliability, Brier, WhenItMatters, MattersOrNot, Wrap } from "./steps";

export default defineModule<CalState>({
  initialState,
  steps: [
    { id: "story", title: "“70% chance of rain”", Component: Forecaster },
    { id: "reliability", title: "Does 70% mean 70%?", Component: Reliability },
    { id: "brier", title: "Scoring probabilities", Component: Brier },
    { id: "matters", title: "When calibration matters", Component: WhenItMatters },
    {
      id: "check",
      title: "Probability or ranking?",
      checkpoint: "matters-or-not",
      Component: MattersOrNot,
    },
    { id: "wrap", title: "What to remember", Component: Wrap },
  ],
});
