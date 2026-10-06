"use client";

import { defineModule } from "@/lib/module-sdk";
import { initialState, type EnsState } from "./state";
import { TheOx, VoteAndBoost, Crowds, Libraries, BagOrBoost, Wrap } from "./steps";

export default defineModule<EnsState>({
  initialState,
  steps: [
    { id: "story", title: "Guessing the weight of an ox", Component: TheOx },
    { id: "vote", title: "Vote and boost", Component: VoteAndBoost },
    { id: "crowds", title: "Why many beat one", Component: Crowds },
    { id: "libraries", title: "The boosting libraries", Component: Libraries },
    {
      id: "check",
      title: "Bagging or boosting?",
      checkpoint: "bag-or-boost",
      Component: BagOrBoost,
    },
    { id: "wrap", title: "What to remember", Component: Wrap },
  ],
});
