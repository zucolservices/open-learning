"use client";

import { defineModule } from "@/lib/module-sdk";
import { initialState, type CkState } from "./state";
import { Barriers, CrashRestore, Photographs, Sinks, WhatHappens, Wrap } from "./steps";

export default defineModule<CkState>({
  initialState,
  steps: [
    { id: "photos", title: "Photographs of the tally", Component: Photographs },
    { id: "crash", title: "Crash, restore, replay", Component: CrashRestore },
    { id: "barriers", title: "Barriers and snapshots", Component: Barriers },
    { id: "sinks", title: "Exactly once to the outside", Component: Sinks },
    {
      id: "check",
      title: "Correct, duplicated or lost?",
      checkpoint: "after-restore",
      Component: WhatHappens,
    },
    { id: "wrap", title: "What to remember", Component: Wrap },
  ],
});
