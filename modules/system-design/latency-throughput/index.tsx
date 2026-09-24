"use client";

import { defineModule } from "@/lib/module-sdk";
import { initialState, type LatencyState } from "./state";
import { CoffeeCounter, PredictWait } from "./steps-queue";
import { AveragesLie, FanOut, LittlesLaw, PercentileCheck, Wrap } from "./steps-tail";

export default defineModule<LatencyState>({
  initialState,
  steps: [
    { id: "counter", title: "The coffee counter", Component: CoffeeCounter },
    {
      id: "predict",
      title: "How long is the line?",
      checkpoint: "predict-wait",
      Component: PredictWait,
    },
    { id: "averages", title: "Averages lie", Component: AveragesLie },
    { id: "fan-out", title: "The tail at scale", Component: FanOut },
    { id: "little", title: "Little's Law", Component: LittlesLaw },
    {
      id: "dashboard",
      title: "The dashboard trap",
      checkpoint: "avg-percentiles",
      Component: PercentileCheck,
    },
    { id: "wrap", title: "What to remember", Component: Wrap },
  ],
});
