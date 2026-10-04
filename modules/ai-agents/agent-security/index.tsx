"use client";

import { defineModule } from "@/lib/module-sdk";
import { initialState, type SecState } from "./state";
import { Letter, PoisonedPage, RealCases, Patterns, WhichLeg, Wrap } from "./steps";

export default defineModule<SecState>({
  initialState,
  steps: [
    { id: "story", title: "The forged note", Component: Letter },
    { id: "page", title: "The poisoned web page", Component: PoisonedPage },
    { id: "cases", title: "It has happened", Component: RealCases },
    { id: "patterns", title: "Defences that work", Component: Patterns },
    {
      id: "check",
      title: "Which leg does it remove?",
      checkpoint: "which-leg",
      Component: WhichLeg,
    },
    { id: "wrap", title: "What to remember", Component: Wrap },
  ],
});
