"use client";

import { defineModule } from "@/lib/module-sdk";
import { initialState, type SmallState } from "./state";
import { Plates, SplitIt, HowSmall, HowSplit, SmallCheck, Wrap } from "./steps";

export default defineModule<SmallState>({
  initialState,
  steps: [
    { id: "story", title: "One plate at a time", Component: Plates },
    { id: "split", title: "Split a 1,200-line change into a stack", Component: SplitIt },
    { id: "small", title: "How small is small?", Component: HowSmall },
    { id: "how", title: "Ways to split a change", Component: HowSplit },
    {
      id: "check",
      title: "Split it or keep it together?",
      checkpoint: "review-small",
      Component: SmallCheck,
    },
    { id: "wrap", title: "What to remember", Component: Wrap },
  ],
});
