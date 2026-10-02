"use client";

import { defineModule } from "@/lib/module-sdk";
import { initialState, type AnatomyState } from "./state";
import { InOrder, OnePush, Recipe, SameIdeas, Wrap } from "./steps";

export default defineModule<AnatomyState>({
  initialState,
  steps: [
    { id: "recipe", title: "A recipe kept with the code", Component: Recipe },
    { id: "push", title: "One push, start to finish", Component: OnePush },
    { id: "words", title: "Same ideas, different words", Component: SameIdeas },
    { id: "check", title: "Put it in order", checkpoint: "push-order", Component: InOrder },
    { id: "wrap", title: "What to remember", Component: Wrap },
  ],
});
