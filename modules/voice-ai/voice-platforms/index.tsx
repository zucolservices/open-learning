"use client";

import { defineModule } from "@/lib/module-sdk";
import { initialState, type PlatformsState } from "./state";
import { Kitchen, StackMap, Frameworks, Swappable, WhichLayer, Wrap } from "./steps";

export default defineModule<PlatformsState>({
  initialState,
  steps: [
    { id: "story", title: "Cook, kit or takeaway", Component: Kitchen },
    { id: "map", title: "The voice stack map", Component: StackMap },
    { id: "frameworks", title: "The glue: open frameworks", Component: Frameworks },
    { id: "swappable", title: "Build for swapping", Component: Swappable },
    { id: "check", title: "Which layer?", checkpoint: "which-layer", Component: WhichLayer },
    { id: "wrap", title: "What to remember", Component: Wrap },
  ],
});
