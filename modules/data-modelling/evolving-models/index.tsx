"use client";

import { defineModule } from "@/lib/module-sdk";
import { initialState, type EvoState } from "./state";
import { StreetNames, SafeRename, Names, Contracts, BreakingOrNot, Wrap } from "./steps";

export default defineModule<EvoState>({
  initialState,
  steps: [
    { id: "story", title: "Renaming a street", Component: StreetNames },
    { id: "rename", title: "Rename a column, safely", Component: SafeRename },
    { id: "names", title: "Names are an interface", Component: Names },
    { id: "contracts", title: "Contracts and versions", Component: Contracts },
    {
      id: "check",
      title: "Breaking or not?",
      checkpoint: "breaking-change",
      Component: BreakingOrNot,
    },
    { id: "wrap", title: "What to remember", Component: Wrap },
  ],
});
