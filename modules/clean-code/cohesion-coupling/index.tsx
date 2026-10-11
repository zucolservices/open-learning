"use client";

import { defineModule } from "@/lib/module-sdk";
import { initialState, type CohesionState } from "./state";
import { Kitchen, Rearrange, Origins, Spectrum, CohesionCheck, Wrap } from "./steps";

export default defineModule<CohesionState>({
  initialState,
  steps: [
    { id: "story", title: "Stations in a kitchen", Component: Kitchen },
    { id: "rearrange", title: "Rearrange the code by what changes together", Component: Rearrange },
    { id: "origins", title: "Old ideas that still hold", Component: Origins },
    { id: "spectrum", title: "From loose to tight coupling", Component: Spectrum },
    {
      id: "check",
      title: "Cohesive or not?",
      checkpoint: "clean-cohesion",
      Component: CohesionCheck,
    },
    { id: "wrap", title: "What to remember", Component: Wrap },
  ],
});
