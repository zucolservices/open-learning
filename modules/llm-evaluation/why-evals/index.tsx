"use client";

import { defineModule } from "@/lib/module-sdk";
import { initialState, type WhyEvalsState } from "./state";
import { OneSpoonful } from "./steps-story";
import { FiveVsHundred, NotLikeTests, Lifecycle, VibeOrEval, Wrap } from "./steps";

export default defineModule<WhyEvalsState>({
  initialState,
  steps: [
    { id: "story", title: "One spoonful", Component: OneSpoonful },
    {
      id: "five-vs-hundred",
      title: "Five answers versus a hundred cases",
      Component: FiveVsHundred,
    },
    { id: "not-like-tests", title: "Why ordinary tests aren't enough", Component: NotLikeTests },
    { id: "lifecycle", title: "Evals across a product's life", Component: Lifecycle },
    {
      id: "check",
      title: "Vibe check or eval?",
      checkpoint: "vibe-or-eval",
      Component: VibeOrEval,
    },
    { id: "wrap", title: "What to remember", Component: Wrap },
  ],
});
