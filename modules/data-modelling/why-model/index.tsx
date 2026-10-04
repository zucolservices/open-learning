"use client";

import { defineModule } from "@/lib/module-sdk";
import { initialState, type WhyState } from "./state";
import { CafeStory } from "./steps-story";
import { TwoShapes, Meaning, Storage, WhichKind, Wrap } from "./steps";

export default defineModule<WhyState>({
  initialState,
  steps: [
    { id: "story", title: "The café's notebook", Component: CafeStory },
    { id: "shapes", title: "Same question, two shapes", Component: TwoShapes },
    { id: "meaning", title: "What does this field mean?", Component: Meaning },
    { id: "storage", title: "Where data lives matters too", Component: Storage },
    {
      id: "check",
      title: "Running the shop or understanding it?",
      checkpoint: "op-or-analytic",
      Component: WhichKind,
    },
    { id: "wrap", title: "What to remember", Component: Wrap },
  ],
});
