"use client";

import { defineModule } from "@/lib/module-sdk";
import { initialState, type EstimationState } from "./state";
import { Estimator, Fermi, Ladder, PredictUpi, RulesOfThumb, StorageCheck, Wrap } from "./steps";

export default defineModule<EstimationState>({
  initialState,
  steps: [
    { id: "fermi", title: "Good-enough numbers, fast", Component: Fermi },
    { id: "estimator", title: "The estimator", Component: Estimator },
    { id: "ladder", title: "The latency ladder", Component: Ladder },
    {
      id: "upi",
      title: "India's payments, per second",
      checkpoint: "upi-per-second",
      Component: PredictUpi,
    },
    {
      id: "storage",
      title: "How much storage?",
      checkpoint: "photo-storage",
      Component: StorageCheck,
    },
    { id: "thumb", title: "Rules of thumb", Component: RulesOfThumb },
    { id: "wrap", title: "What to remember", Component: Wrap },
  ],
});
