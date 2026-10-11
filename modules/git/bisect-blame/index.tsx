"use client";

import { defineModule } from "@/lib/module-sdk";
import { initialState, type BisectState } from "./state";
import { Dictionary, Bisect, Blame, Detective, BisectCheck, Wrap } from "./steps";

export default defineModule<BisectState>({
  initialState,
  steps: [
    { id: "story", title: "Finding a word in a dictionary", Component: Dictionary },
    { id: "bisect", title: "Find the bad commit in 1,000", Component: Bisect },
    { id: "blame", title: "Who last changed this line?", Component: Blame },
    { id: "detective", title: "More history detective tools", Component: Detective },
    {
      id: "check",
      title: "Bisect, blame or log?",
      checkpoint: "git-bisect-blame",
      Component: BisectCheck,
    },
    { id: "wrap", title: "What to remember", Component: Wrap },
  ],
});
