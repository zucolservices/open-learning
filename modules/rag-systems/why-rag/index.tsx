"use client";

import { defineModule } from "@/lib/module-sdk";
import { initialState, type WhyRagState } from "./state";
import { OpenBook } from "./steps-story";
import { FitCheck, ThreeWays, Wrap } from "./steps";

export default defineModule<WhyRagState>({
  initialState,
  steps: [
    { id: "open-book", title: "Closed book, open book", Component: OpenBook },
    { id: "three-ways", title: "Three ways to teach a model", Component: ThreeWays },
    { id: "fit", title: "Which one fits?", checkpoint: "rag-fit", Component: FitCheck },
    { id: "wrap", title: "What to remember", Component: Wrap },
  ],
});
