"use client";

import { defineModule } from "@/lib/module-sdk";
import { initialState, type RddState } from "./state";
import { BoxOrSheet, SameQuestion, Lineage, WhichApi, PickApi, Wrap } from "./steps";

export default defineModule<RddState>({
  initialState,
  steps: [
    { id: "story", title: "A box of papers or a spreadsheet?", Component: BoxOrSheet },
    { id: "same", title: "Same question, two APIs", Component: SameQuestion },
    { id: "lineage", title: "Rebuilding from the recipe", Component: Lineage },
    { id: "which", title: "Three APIs, one engine", Component: WhichApi },
    { id: "check", title: "Which API?", checkpoint: "which-api", Component: PickApi },
    { id: "wrap", title: "What to remember", Component: Wrap },
  ],
});
