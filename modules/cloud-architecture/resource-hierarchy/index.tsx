"use client";

import { defineModule } from "@/lib/module-sdk";
import { initialState, type TreeState } from "./state";
import { BuildTree, FlowDown, Flats, SameOrSeparate, ThreeTrees, Wrap } from "./steps";

export default defineModule<TreeState>({
  initialState,
  steps: [
    { id: "flats", title: "One big house, or flats?", Component: Flats },
    { id: "build", title: "Build the tree", Component: BuildTree },
    { id: "flow", title: "What flows down", Component: FlowDown },
    { id: "three", title: "Three clouds, three trees", Component: ThreeTrees },
    {
      id: "check",
      title: "Same account or separate?",
      checkpoint: "same-or-separate",
      Component: SameOrSeparate,
    },
    { id: "wrap", title: "What to remember", Component: Wrap },
  ],
});
