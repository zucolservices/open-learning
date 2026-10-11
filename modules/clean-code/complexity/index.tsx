"use client";

import { defineModule } from "@/lib/module-sdk";
import { initialState, type ComplexState } from "./state";
import { Directions, Flatten, Measures, Techniques, ComplexCheck, Wrap } from "./steps";

export default defineModule<ComplexState>({
  initialState,
  steps: [
    { id: "story", title: "Directions you have to hold in your head", Component: Directions },
    { id: "flatten", title: "Flatten a nested function", Component: Flatten },
    { id: "measures", title: "Two ways to measure complexity", Component: Measures },
    { id: "techniques", title: "Ways to bring it down", Component: Techniques },
    {
      id: "check",
      title: "What helps most?",
      checkpoint: "clean-complexity",
      Component: ComplexCheck,
    },
    { id: "wrap", title: "What to remember", Component: Wrap },
  ],
});
