"use client";

import { defineModule } from "@/lib/module-sdk";
import { initialState, type LifeState } from "./state";
import { Desk, Lifecycle, Saving, Changes, LifeCheck, Wrap } from "./steps";

export default defineModule<LifeState>({
  initialState,
  steps: [
    { id: "story", title: "The hot desk", Component: Desk },
    { id: "lifecycle", title: "A phone call, then a process death", Component: Lifecycle },
    { id: "saving", title: "Where to save, on each platform", Component: Saving },
    { id: "changes", title: "Recent platform changes", Component: Changes },
    {
      id: "check",
      title: "What survives what?",
      checkpoint: "mobile-lifecycle",
      Component: LifeCheck,
    },
    { id: "wrap", title: "What to remember", Component: Wrap },
  ],
});
