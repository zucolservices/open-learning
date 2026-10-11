"use client";

import { defineModule } from "@/lib/module-sdk";
import { initialState, type FunctionsState } from "./state";
import { Recipe, Extract, Flags, HowSmall, FunctionsCheck, Wrap } from "./steps";

export default defineModule<FunctionsState>({
  initialState,
  steps: [
    { id: "story", title: "A recipe with headings", Component: Recipe },
    { id: "extract", title: "Split a long function into named steps", Component: Extract },
    { id: "flags", title: "Arguments, flags and levels", Component: Flags },
    { id: "small", title: "How small is small?", Component: HowSmall },
    {
      id: "check",
      title: "Good sign or warning sign?",
      checkpoint: "clean-functions",
      Component: FunctionsCheck,
    },
    { id: "wrap", title: "What to remember", Component: Wrap },
  ],
});
