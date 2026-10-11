"use client";

import { defineModule } from "@/lib/module-sdk";
import { initialState, type VitalsState } from "./state";
import { Restaurant, FixVitals, Thresholds, LabField, VitalsCheck, Wrap } from "./steps";

export default defineModule<VitalsState>({
  initialState,
  steps: [
    { id: "story", title: "How a restaurant feels", Component: Restaurant },
    { id: "fix", title: "Get all three vitals to good", Component: FixVitals },
    { id: "thresholds", title: "How the web is doing", Component: Thresholds },
    { id: "lab", title: "Lab tests and real users", Component: LabField },
    {
      id: "check",
      title: "Which vital does it hurt?",
      checkpoint: "frontend-vitals",
      Component: VitalsCheck,
    },
    { id: "wrap", title: "What to remember", Component: Wrap },
  ],
});
