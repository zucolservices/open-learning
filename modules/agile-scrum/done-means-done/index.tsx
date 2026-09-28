"use client";

import { defineModule } from "@/lib/module-sdk";
import { initialState, type DoneState } from "./state";
import { DebtGuess, DebtQuadrant, Dishes, HonestDone, TwelveSprints, Wrap } from "./steps";

export default defineModule<DoneState>({
  initialState,
  steps: [
    { id: "dishes", title: "Clean as you go", Component: Dishes },
    { id: "guess", title: "Guess first", checkpoint: "debt-guess", Component: DebtGuess },
    { id: "sprints", title: "Twelve Sprints", Component: TwelveSprints },
    { id: "quadrant", title: "Not all debt is reckless", Component: DebtQuadrant },
    {
      id: "honest",
      title: "Honest Done or hidden debt?",
      checkpoint: "honest-done",
      Component: HonestDone,
    },
    { id: "wrap", title: "What to remember", Component: Wrap },
  ],
});
