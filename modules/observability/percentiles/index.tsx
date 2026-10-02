"use client";

import { defineModule } from "@/lib/module-sdk";
import { initialState, type PctState } from "./state";
import { AverageHides, CalmAverage, NeverAverage, TailAtScale, Wrap } from "./steps";

export default defineModule<PctState>({
  initialState,
  steps: [
    { id: "hides", title: "Where the average hides", Component: AverageHides },
    { id: "tail", title: "The tail at scale", Component: TailAtScale },
    { id: "never", title: "Never average percentiles", Component: NeverAverage },
    { id: "check", title: "The calm average", checkpoint: "calm-average", Component: CalmAverage },
    { id: "wrap", title: "What to remember", Component: Wrap },
  ],
});
