"use client";

import { defineModule } from "@/lib/module-sdk";
import { initialState, type EddState } from "./state";
import { SpellCheck, Pipeline, ErrorAnalysis, TwoSuites, WhichSuite, Wrap } from "./steps";

export default defineModule<EddState>({
  initialState,
  steps: [
    { id: "story", title: "Tests first", Component: SpellCheck },
    { id: "ci", title: "Evals as tests in CI", Component: Pipeline },
    { id: "errors", title: "Error analysis: where cases come from", Component: ErrorAnalysis },
    { id: "suites", title: "Two kinds of suite", Component: TwoSuites },
    {
      id: "check",
      title: "Capability or regression?",
      checkpoint: "which-suite",
      Component: WhichSuite,
    },
    { id: "wrap", title: "What to remember", Component: Wrap },
  ],
});
