"use client";

import { defineModule } from "@/lib/module-sdk";
import { initialState, type FramingState } from "./state";
import { Doctor, FrameIt, Baseline, Proxies, WhichType, Wrap } from "./steps";

export default defineModule<FramingState>({
  initialState,
  steps: [
    { id: "story", title: "“I feel unwell”", Component: Doctor },
    { id: "frame", title: "From “reduce churn” to a prediction target", Component: FrameIt },
    { id: "baseline", title: "Beat the dumb baseline", Component: Baseline },
    { id: "proxies", title: "When the target is a stand-in", Component: Proxies },
    {
      id: "check",
      title: "Classification, regression or ranking?",
      checkpoint: "which-type",
      Component: WhichType,
    },
    { id: "wrap", title: "What to remember", Component: Wrap },
  ],
});
