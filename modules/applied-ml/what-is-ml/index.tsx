"use client";

import { defineModule } from "@/lib/module-sdk";
import { initialState, type WhatState } from "./state";
import { ByExample } from "./steps-story";
import { RulesVsLearned, ThreeKinds, WhereItWins, WhichKind, Wrap } from "./steps";

export default defineModule<WhatState>({
  initialState,
  steps: [
    { id: "story", title: "Teaching by example", Component: ByExample },
    { id: "spam", title: "Rules versus a learned filter", Component: RulesVsLearned },
    { id: "kinds", title: "Three ways to learn", Component: ThreeKinds },
    { id: "wins", title: "Where classic ML still wins", Component: WhereItWins },
    {
      id: "check",
      title: "Which kind of learning?",
      checkpoint: "which-learning",
      Component: WhichKind,
    },
    { id: "wrap", title: "What to remember", Component: Wrap },
  ],
});
