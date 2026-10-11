"use client";

import { defineModule } from "@/lib/module-sdk";
import { initialState, type RefactorState } from "./state";
import { Rearranging, Steps, TwoHats, Tools, RefactorCheck, Wrap } from "./steps";

export default defineModule<RefactorState>({
  initialState,
  steps: [
    { id: "story", title: "Rearranging the kitchen during service", Component: Rearranging },
    { id: "steps", title: "Refactor in small steps, or one big leap", Component: Steps },
    { id: "hats", title: "Two hats, and making the change easy", Component: TwoHats },
    { id: "tools", title: "Named moves, done by tools", Component: Tools },
    {
      id: "check",
      title: "One refactoring, in order",
      checkpoint: "clean-refactoring",
      Component: RefactorCheck,
    },
    { id: "wrap", title: "What to remember", Component: Wrap },
  ],
});
