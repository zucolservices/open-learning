"use client";

import { defineModule } from "@/lib/module-sdk";
import { initialState, type MutationState } from "./state";
import { FireDrill, KillMutants, AtScale, Tools, MutationCheck, Wrap } from "./steps";

export default defineModule<MutationState>({
  initialState,
  steps: [
    { id: "story", title: "Testing the smoke alarm", Component: FireDrill },
    { id: "mutants", title: "Plant bugs and see which survive", Component: KillMutants },
    { id: "scale", title: "Making it affordable", Component: AtScale },
    { id: "tools", title: "Mutation testing tools", Component: Tools },
    {
      id: "check",
      title: "A mutant survived",
      checkpoint: "testing-mutation",
      Component: MutationCheck,
    },
    { id: "wrap", title: "What to remember", Component: Wrap },
  ],
});
