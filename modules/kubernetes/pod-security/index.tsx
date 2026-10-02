"use client";

import { defineModule } from "@/lib/module-sdk";
import { initialState, type PsState } from "./state";
import { Beyond, BuildingCodes, PassingPod, WhichLevel, Wrap } from "./steps";

export default defineModule<PsState>({
  initialState,
  steps: [
    { id: "codes", title: "Three building codes", Component: BuildingCodes },
    { id: "build", title: "Build a pod that passes", Component: PassingPod },
    { id: "beyond", title: "Beyond the standards", Component: Beyond },
    {
      id: "check",
      title: "Which level allows it?",
      checkpoint: "which-pss-level",
      Component: WhichLevel,
    },
    { id: "wrap", title: "What to remember", Component: Wrap },
  ],
});
