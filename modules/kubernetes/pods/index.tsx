"use client";

import { defineModule } from "@/lib/module-sdk";
import { initialState, type PodState } from "./state";
import { BuildPod, PodLife, SameOrSeparate, SharedFlat, Wrap } from "./steps";

export default defineModule<PodState>({
  initialState,
  steps: [
    { id: "flat", title: "A shared flat", Component: SharedFlat },
    { id: "build", title: "Build a pod", Component: BuildPod },
    { id: "life", title: "A pod's life", Component: PodLife },
    {
      id: "check",
      title: "Same pod or separate?",
      checkpoint: "same-or-separate",
      Component: SameOrSeparate,
    },
    { id: "wrap", title: "What to remember", Component: Wrap },
  ],
});
