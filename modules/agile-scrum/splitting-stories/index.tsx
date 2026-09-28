"use client";

import { defineModule } from "@/lib/module-sdk";
import { initialState, type SplitState } from "./state";
import { Cake, Sandbox, SplitMyths, WhySmall, Wrap } from "./steps";

export default defineModule<SplitState>({
  initialState,
  steps: [
    { id: "cake", title: "Slice the cake", Component: Cake },
    { id: "sandbox", title: "Split the big feature", Component: Sandbox },
    {
      id: "myths",
      title: "Good split or bad split?",
      checkpoint: "split-myths",
      Component: SplitMyths,
    },
    { id: "why", title: "Why small?", checkpoint: "why-small", Component: WhySmall },
    { id: "wrap", title: "What to remember", Component: Wrap },
  ],
});
