"use client";

import { defineModule } from "@/lib/module-sdk";
import { initialState, type SolidState } from "./state";
import { Proverbs, FivePrinciples, Origins, Critics, SolidCheck, Wrap } from "./steps";

export default defineModule<SolidState>({
  initialState,
  steps: [
    { id: "story", title: "Proverbs, not laws", Component: Proverbs },
    { id: "five", title: "Five principles, five judgement calls", Component: FivePrinciples },
    { id: "origins", title: "Where the five came from", Component: Origins },
    { id: "critics", title: "The critics, and an alternative", Component: Critics },
    { id: "check", title: "Which principle?", checkpoint: "clean-solid", Component: SolidCheck },
    { id: "wrap", title: "What to remember", Component: Wrap },
  ],
});
