"use client";

import { defineModule } from "@/lib/module-sdk";
import { initialState, type SemState } from "./state";
import {
  Dictionary,
  OneDefinition,
  WhatItLooksLike,
  Ecosystem,
  LayerOrDashboard,
  Wrap,
} from "./steps";

export default defineModule<SemState>({
  initialState,
  steps: [
    { id: "story", title: "One dictionary", Component: Dictionary },
    { id: "sim", title: "Three dashboards, three answers", Component: OneDefinition },
    { id: "code", title: "What a definition looks like", Component: WhatItLooksLike },
    { id: "ecosystem", title: "Tools and a standard", Component: Ecosystem },
    {
      id: "check",
      title: "Layer or dashboard?",
      checkpoint: "layer-or-dashboard",
      Component: LayerOrDashboard,
    },
    { id: "wrap", title: "What to remember", Component: Wrap },
  ],
});
