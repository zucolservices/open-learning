"use client";

import { defineModule } from "@/lib/module-sdk";
import { initialState, type AdaptState } from "./state";
import { Water, Resize, Classes, Rules, AdaptCheck, Wrap } from "./steps";

export default defineModule<AdaptState>({
  initialState,
  steps: [
    { id: "story", title: "Water takes the shape of the glass", Component: Water },
    { id: "resize", title: "Resize the café app", Component: Resize },
    { id: "classes", title: "Size classes on each platform", Component: Classes },
    { id: "rules", title: "The rules are tightening", Component: Rules },
    {
      id: "check",
      title: "Which width class?",
      checkpoint: "mobile-size-class",
      Component: AdaptCheck,
    },
    { id: "wrap", title: "What to remember", Component: Wrap },
  ],
});
