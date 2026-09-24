"use client";

import { defineModule } from "@/lib/module-sdk";
import { initialState, type RetryState } from "./state";
import {
  DoubleCharge,
  GoThrough,
  PredictLayers,
  RealWorld,
  RetryStorm,
  SafeToRepeat,
  Spread,
  Wrap,
} from "./steps";

export default defineModule<RetryState>({
  initialState,
  steps: [
    { id: "go-through", title: "Did it go through?", Component: GoThrough },
    { id: "storm", title: "The retry storm", Component: RetryStorm },
    { id: "spread", title: "Spread them out", Component: Spread },
    {
      id: "layers",
      title: "Retries at every layer",
      checkpoint: "layers",
      Component: PredictLayers,
    },
    { id: "double", title: "Charged twice", Component: DoubleCharge },
    { id: "safe", title: "Safe to repeat?", checkpoint: "safe-to-repeat", Component: SafeToRepeat },
    { id: "real", title: "Where you'll meet this", Component: RealWorld },
    { id: "wrap", title: "What to remember", Component: Wrap },
  ],
});
