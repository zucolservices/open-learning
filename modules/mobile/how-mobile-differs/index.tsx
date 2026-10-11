"use client";

import { defineModule } from "@/lib/module-sdk";
import { initialState, type DiffState } from "./state";
import { OneOrder } from "./steps-story";
import { Situations, Numbers, Platforms, DiffCheck, Wrap } from "./steps";

export default defineModule<DiffState>({
  initialState,
  steps: [
    { id: "story", title: "One order on the move", Component: OneOrder },
    { id: "situations", title: "What should the app do?", Component: Situations },
    { id: "numbers", title: "Who's on what", Component: Numbers },
    { id: "platforms", title: "The platforms in October 2026", Component: Platforms },
    {
      id: "check",
      title: "Coming back after a call",
      checkpoint: "mobile-differs",
      Component: DiffCheck,
    },
    { id: "wrap", title: "What to remember", Component: Wrap },
  ],
});
