"use client";

import { defineModule } from "@/lib/module-sdk";
import { initialState, type CoverageState } from "./state";
import { Guard, FullCoverage, Kinds, UsingIt, CoverageCheck, Wrap } from "./steps";

export default defineModule<CoverageState>({
  initialState,
  steps: [
    { id: "story", title: "The guard who walked every corridor", Component: Guard },
    { id: "full", title: "Reach 100% and still ship a bug", Component: FullCoverage },
    { id: "kinds", title: "Lines, branches, conditions", Component: Kinds },
    { id: "using", title: "Use coverage as a flashlight, not a target", Component: UsingIt },
    {
      id: "check",
      title: "What does 100% tell you?",
      checkpoint: "testing-coverage",
      Component: CoverageCheck,
    },
    { id: "wrap", title: "What to remember", Component: Wrap },
  ],
});
