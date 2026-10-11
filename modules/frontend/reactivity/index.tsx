"use client";

import { defineModule } from "@/lib/module-sdk";
import { initialState, type ReactState } from "./state";
import { Notice, Counter, Families, Matters, ReactCheck, Wrap } from "./steps";

export default defineModule<ReactState>({
  initialState,
  steps: [
    { id: "story", title: "Three ways to update a notice board", Component: Notice },
    { id: "counter", title: "Click +1: how much work happens?", Component: Counter },
    { id: "families", title: "Who uses which approach (October 2026)", Component: Families },
    { id: "matters", title: "Does the approach matter?", Component: Matters },
    {
      id: "check",
      title: "Name the approach",
      checkpoint: "frontend-reactivity",
      Component: ReactCheck,
    },
    { id: "wrap", title: "What to remember", Component: Wrap },
  ],
});
