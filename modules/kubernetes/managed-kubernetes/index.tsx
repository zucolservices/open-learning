"use client";

import { defineModule } from "@/lib/module-sdk";
import { initialState, type MkState } from "./state";
import { HandOver, OwnLease, PriceCluster, WhichPlatform, Wrap } from "./steps";

export default defineModule<MkState>({
  initialState,
  steps: [
    { id: "lease", title: "Own, lease, or take a taxi", Component: OwnLease },
    { id: "price", title: "Price the same cluster", Component: PriceCluster },
    { id: "hand", title: "What you hand over", Component: HandOver },
    {
      id: "check",
      title: "Which platform?",
      checkpoint: "which-platform",
      Component: WhichPlatform,
    },
    { id: "wrap", title: "What to remember", Component: Wrap },
  ],
});
