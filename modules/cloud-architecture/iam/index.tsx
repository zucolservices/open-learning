"use client";

import { defineModule } from "@/lib/module-sdk";
import { initialState, type IamState } from "./state";
import { AllowedOrDenied, CutItDown, Evaluate, KeyCards, ThreeClouds, Wrap } from "./steps";

export default defineModule<IamState>({
  initialState,
  steps: [
    { id: "cards", title: "Hotel key cards", Component: KeyCards },
    { id: "clouds", title: "Who, what, where", Component: ThreeClouds },
    { id: "evaluate", title: "Allowed or denied?", Component: Evaluate },
    { id: "cut", title: "Cut it down to size", Component: CutItDown },
    {
      id: "check",
      title: "Predict the answer",
      checkpoint: "allowed-or-denied",
      Component: AllowedOrDenied,
    },
    { id: "wrap", title: "What to remember", Component: Wrap },
  ],
});
