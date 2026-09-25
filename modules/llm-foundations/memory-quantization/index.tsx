"use client";

import { defineModule } from "@/lib/module-sdk";
import { initialState, type MemState } from "./state";
import {
  FitsOrNot,
  MethodMatters,
  MixtureOfExperts,
  PredictSize,
  Rounding,
  WhatYouLose,
  WillItFit,
  Wrap,
} from "./steps";

export default defineModule<MemState>({
  initialState,
  steps: [
    { id: "rounding", title: "Rounding the weights", Component: Rounding },
    { id: "size", title: "Size it up", checkpoint: "size-70b", Component: PredictSize },
    { id: "fit", title: "Will it fit?", Component: WillItFit },
    { id: "lose", title: "What do you lose?", Component: WhatYouLose },
    { id: "method", title: "Not all 8-bit is equal", Component: MethodMatters },
    { id: "moe", title: "Mixture of experts", Component: MixtureOfExperts },
    { id: "fits", title: "One GPU or more?", checkpoint: "fits", Component: FitsOrNot },
    { id: "wrap", title: "What to remember", Component: Wrap },
  ],
});
