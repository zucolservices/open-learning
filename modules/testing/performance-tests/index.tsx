"use client";

import { defineModule } from "@/lib/module-sdk";
import { initialState, type PerfState } from "./state";
import { Counter, Knee, Kinds, Honest, PerfCheck, Wrap } from "./steps";

export default defineModule<PerfState>({
  initialState,
  steps: [
    { id: "story", title: "The café counter at 1 pm", Component: Counter },
    { id: "knee", title: "Ramp up the traffic and find the knee", Component: Knee },
    { id: "kinds", title: "Load, stress, spike, soak", Component: Kinds },
    { id: "honest", title: "Measuring honestly", Component: Honest },
    { id: "check", title: "Reading the numbers", checkpoint: "testing-perf", Component: PerfCheck },
    { id: "wrap", title: "What to remember", Component: Wrap },
  ],
});
