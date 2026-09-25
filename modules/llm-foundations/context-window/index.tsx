"use client";

import { defineModule } from "@/lib/module-sdk";
import { initialState, type CtxState } from "./state";
import { PredictCache, Quadratic, Stretch, Windows, WordOrder, Wrap } from "./steps";

export default defineModule<CtxState>({
  initialState,
  steps: [
    { id: "order", title: "Dog bites man", Component: WordOrder },
    { id: "stretch", title: "Stretch the window", Component: Stretch },
    { id: "cache", title: "Size the cache", checkpoint: "kv-size", Component: PredictCache },
    { id: "quadratic", title: "Double the context", checkpoint: "quadratic", Component: Quadratic },
    { id: "windows", title: "How big are windows now?", Component: Windows },
    { id: "wrap", title: "What to remember", Component: Wrap },
  ],
});
