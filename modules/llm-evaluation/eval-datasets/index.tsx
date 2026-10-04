"use client";

import { defineModule } from "@/lib/module-sdk";
import { initialState, type DatasetState } from "./state";
import { DrivingTest, GrowSet, ReadTraces, KeepSeparate, WhichKind, Wrap } from "./steps";

export default defineModule<DatasetState>({
  initialState,
  steps: [
    { id: "story", title: "A driving test on an empty road", Component: DrivingTest },
    { id: "grow", title: "Grow an eval set", Component: GrowSet },
    { id: "traces", title: "Start by reading", Component: ReadTraces },
    { id: "separate", title: "Keep the exam secret", Component: KeepSeparate },
    {
      id: "check",
      title: "Typical, edge or adversarial?",
      checkpoint: "which-kind",
      Component: WhichKind,
    },
    { id: "wrap", title: "What to remember", Component: Wrap },
  ],
});
