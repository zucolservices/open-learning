"use client";

import { defineModule } from "@/lib/module-sdk";
import { initialState, type LegacyState } from "./state";
import { OldHouse, PinDown, Recipe, GoldenMaster, LegacyCheck, Wrap } from "./steps";

export default defineModule<LegacyState>({
  initialState,
  steps: [
    { id: "story", title: "Rewiring an old house", Component: OldHouse },
    { id: "pin", title: "Record what it does, then refactor safely", Component: PinDown },
    { id: "recipe", title: "Feathers' recipe, and seams", Component: Recipe },
    { id: "golden", title: "Approval tests and golden masters", Component: GoldenMaster },
    {
      id: "check",
      title: "Put the recipe in order",
      checkpoint: "testing-legacy",
      Component: LegacyCheck,
    },
    { id: "wrap", title: "What to remember", Component: Wrap },
  ],
});
