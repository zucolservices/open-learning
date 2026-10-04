"use client";

import { defineModule } from "@/lib/module-sdk";
import { initialState, type SfState } from "./state";
import { FigStory } from "./steps-story";
import { Strangle, BranchByAbstraction, Toolkit, InOrder, Wrap } from "./steps";

export default defineModule<SfState>({
  initialState,
  steps: [
    { id: "story", title: "Grow around the old tree", Component: FigStory },
    { id: "strangle", title: "Strangle it route by route", Component: Strangle },
    { id: "branch", title: "Branch by abstraction", Component: BranchByAbstraction },
    { id: "toolkit", title: "The migration toolkit", Component: Toolkit },
    { id: "check", title: "In the right order", checkpoint: "strangler-order", Component: InOrder },
    { id: "wrap", title: "What to remember", Component: Wrap },
  ],
});
