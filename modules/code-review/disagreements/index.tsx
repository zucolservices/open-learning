"use client";

import { defineModule } from "@/lib/module-sdk";
import { initialState, type DisState } from "./state";
import { Referee, Three, Ladder, Commit, DisCheck, Wrap } from "./steps";

export default defineModule<DisState>({
  initialState,
  steps: [
    { id: "story", title: "The rulebook, the conversation and the referee", Component: Referee },
    { id: "three", title: "Settle three disagreements", Component: Three },
    { id: "ladder", title: "Facts, principles, preferences", Component: Ladder },
    { id: "commit", title: "Disagree and commit, and don't defer the cleanup", Component: Commit },
    {
      id: "check",
      title: "Climb the ladder",
      checkpoint: "review-disagreements",
      Component: DisCheck,
    },
    { id: "wrap", title: "What to remember", Component: Wrap },
  ],
});
