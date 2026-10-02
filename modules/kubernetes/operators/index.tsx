"use client";

import { defineModule } from "@/lib/module-sdk";
import { initialState, type OpState } from "./state";
import { InTheWild, NewWord, Specialist, WhichApproach, Wrap } from "./steps";

export default defineModule<OpState>({
  initialState,
  steps: [
    { id: "specialist", title: "A specialist on staff", Component: Specialist },
    { id: "word", title: "Teach the cluster a new word", Component: NewWord },
    { id: "wild", title: "Operators in the wild", Component: InTheWild },
    {
      id: "check",
      title: "Built-in, operator or managed?",
      checkpoint: "which-approach",
      Component: WhichApproach,
    },
    { id: "wrap", title: "What to remember", Component: Wrap },
  ],
});
