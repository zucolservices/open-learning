"use client";

import { defineModule } from "@/lib/module-sdk";
import { initialState, type RbacState } from "./state";
import { BadgeDoors, Breach, BuildingBlocks, SafeOrDangerous, Wrap } from "./steps";

export default defineModule<RbacState>({
  initialState,
  steps: [
    { id: "badge", title: "A badge, and the doors it opens", Component: BadgeDoors },
    { id: "breach", title: "The breach", Component: Breach },
    { id: "blocks", title: "The building blocks", Component: BuildingBlocks },
    {
      id: "check",
      title: "Safe or dangerous?",
      checkpoint: "safe-or-dangerous",
      Component: SafeOrDangerous,
    },
    { id: "wrap", title: "What to remember", Component: Wrap },
  ],
});
