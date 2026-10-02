"use client";

import { defineModule } from "@/lib/module-sdk";
import { initialState, type EnvState } from "./state";
import { Previews, Rehearsals, SameOrDiffers, ThreeEnvironments, Wrap } from "./steps";

export default defineModule<EnvState>({
  initialState,
  steps: [
    { id: "rehearsals", title: "Rehearsals before opening night", Component: Rehearsals },
    { id: "three", title: "One release, three environments", Component: ThreeEnvironments },
    { id: "previews", title: "Previews and parity", Component: Previews },
    {
      id: "check",
      title: "Same everywhere, or per environment?",
      checkpoint: "same-or-differs",
      Component: SameOrDiffers,
    },
    { id: "wrap", title: "What to remember", Component: Wrap },
  ],
});
