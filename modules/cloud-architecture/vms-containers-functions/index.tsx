"use client";

import { defineModule } from "@/lib/module-sdk";
import { initialState, type ComputeState } from "./state";
import { BestFit, CarOrTaxi, SameApp, ThreeWays, Wrap } from "./steps";

export default defineModule<ComputeState>({
  initialState,
  steps: [
    { id: "car", title: "Lease, car-share or taxi", Component: CarOrTaxi },
    { id: "three", title: "Three ways to run an app", Component: ThreeWays },
    { id: "same", title: "Same app, same traffic", Component: SameApp },
    { id: "fit", title: "Which fits?", checkpoint: "compute-fit", Component: BestFit },
    { id: "wrap", title: "What to remember", Component: Wrap },
  ],
});
