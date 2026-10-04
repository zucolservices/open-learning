"use client";

import { defineModule } from "@/lib/module-sdk";
import { initialState, type DimState } from "./state";
import { HealthCheck, FindDefects, Measure, Frameworks, NameDimension, Wrap } from "./steps";

export default defineModule<DimState>({
  initialState,
  steps: [
    { id: "story", title: "A health check, not a feeling", Component: HealthCheck },
    { id: "find", title: "Find the defect, name the dimension", Component: FindDefects },
    { id: "measure", title: "Measuring each dimension", Component: Measure },
    { id: "frameworks", title: "More than one list", Component: Frameworks },
    {
      id: "check",
      title: "Which dimension?",
      checkpoint: "which-dimension",
      Component: NameDimension,
    },
    { id: "wrap", title: "What to remember", Component: Wrap },
  ],
});
