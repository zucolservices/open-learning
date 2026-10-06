"use client";

import { defineModule } from "@/lib/module-sdk";
import { initialState, type FeState } from "./state";
import { Ingredients, BuildFeatures, Encodings, Shapes, WhichEncoding, Wrap } from "./steps";

export default defineModule<FeState>({
  initialState,
  steps: [
    { id: "story", title: "Ingredients, prepared", Component: Ingredients },
    { id: "build", title: "Build features, watch the score", Component: BuildFeatures },
    { id: "encodings", title: "Turning categories into numbers", Component: Encodings },
    { id: "shapes", title: "Scales, logs and clocks", Component: Shapes },
    {
      id: "check",
      title: "Which encoding?",
      checkpoint: "which-encoding",
      Component: WhichEncoding,
    },
    { id: "wrap", title: "What to remember", Component: Wrap },
  ],
});
