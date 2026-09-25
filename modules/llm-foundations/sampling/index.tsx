"use client";

import { defineModule } from "@/lib/module-sdk";
import { initialState, type SampleState } from "./state";
import { Arithmetic, Deterministic, Dials, Settings, Wrap } from "./steps";

export default defineModule<SampleState>({
  initialState,
  steps: [
    { id: "dials", title: "Turn the dials", Component: Dials },
    { id: "arithmetic", title: "From scores to probabilities", Component: Arithmetic },
    {
      id: "zero",
      title: "Is temperature 0 repeatable?",
      checkpoint: "temp-zero",
      Component: Deterministic,
    },
    { id: "settings", title: "Sampling settings you'll meet", Component: Settings },
    { id: "wrap", title: "What to remember", Component: Wrap },
  ],
});
