"use client";

import { defineModule } from "@/lib/module-sdk";
import { initialState, type DurableState } from "./state";
import { SaveGame, Crash, Pausing, Engines, WhatGoesWrong, Wrap } from "./steps";

export default defineModule<DurableState>({
  initialState,
  steps: [
    { id: "story", title: "Saving the game", Component: SaveGame },
    { id: "crash", title: "Crash and resume", Component: Crash },
    { id: "pausing", title: "Pausing for a person", Component: Pausing },
    { id: "engines", title: "Tools for durable agents", Component: Engines },
    {
      id: "check",
      title: "What could go wrong?",
      checkpoint: "resume-risk",
      Component: WhatGoesWrong,
    },
    { id: "wrap", title: "What to remember", Component: Wrap },
  ],
});
