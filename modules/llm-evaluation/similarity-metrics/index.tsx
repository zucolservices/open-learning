"use client";

import { defineModule } from "@/lib/module-sdk";
import { initialState, type SimilarityState } from "./state";
import { SpotTheDifference, OverlapLies, Meaning, Evidence, WouldItCatch, Wrap } from "./steps";

export default defineModule<SimilarityState>({
  initialState,
  steps: [
    { id: "story", title: "Marking by matching words", Component: SpotTheDifference },
    { id: "overlap", title: "When overlap lies", Component: OverlapLies },
    { id: "meaning", title: "Comparing meanings instead", Component: Meaning },
    { id: "evidence", title: "What the evidence says", Component: Evidence },
    {
      id: "check",
      title: "Would similarity catch it?",
      checkpoint: "would-it-catch",
      Component: WouldItCatch,
    },
    { id: "wrap", title: "What to remember", Component: Wrap },
  ],
});
