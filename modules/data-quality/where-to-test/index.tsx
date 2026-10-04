"use client";

import { defineModule } from "@/lib/module-sdk";
import { initialState, type WhereState } from "./state";
import { Kitchen, PlaceChecks, Wap, Branches, WhereCheck, Wrap } from "./steps";

export default defineModule<WhereState>({
  initialState,
  steps: [
    { id: "story", title: "Taste as you cook", Component: Kitchen },
    { id: "place", title: "Checks along a pipeline", Component: PlaceChecks },
    { id: "wap", title: "Write, audit, publish", Component: Wap },
    { id: "branches", title: "Branches for data", Component: Branches },
    {
      id: "check",
      title: "Where would you check?",
      checkpoint: "where-check",
      Component: WhereCheck,
    },
    { id: "wrap", title: "What to remember", Component: Wrap },
  ],
});
