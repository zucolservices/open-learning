"use client";

import { defineModule } from "@/lib/module-sdk";
import { initialState, type BtState } from "./state";
import { GuideWords, GrowTree, FindKey, Ranges, HowManyReads, Wrap } from "./steps";

export default defineModule<BtState>({
  initialState,
  steps: [
    { id: "guide", title: "Guide words", Component: GuideWords },
    { id: "grow", title: "Grow a B-tree", Component: GrowTree },
    { id: "find", title: "Find one key", Component: FindKey },
    { id: "ranges", title: "Ranges and real engines", Component: Ranges },
    {
      id: "check",
      title: "How many reads?",
      checkpoint: "how-many-reads",
      Component: HowManyReads,
    },
    { id: "wrap", title: "What to remember", Component: Wrap },
  ],
});
