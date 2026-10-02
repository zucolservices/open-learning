"use client";

import { defineModule } from "@/lib/module-sdk";
import { initialState, type BranchState } from "./state";
import { BranchLife, SavePoints, ThreeFlows, ThreeWeekFeature, Wrap } from "./steps";

export default defineModule<BranchState>({
  initialState,
  steps: [
    { id: "save", title: "Save points and parallel copies", Component: SavePoints },
    { id: "life", title: "How long should a branch live?", Component: BranchLife },
    { id: "flows", title: "Three ways to branch", Component: ThreeFlows },
    {
      id: "check",
      title: "A three-week feature",
      checkpoint: "three-week-feature",
      Component: ThreeWeekFeature,
    },
    { id: "wrap", title: "What to remember", Component: Wrap },
  ],
});
