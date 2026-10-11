"use client";

import { defineModule } from "@/lib/module-sdk";
import { initialState, type ReadableState } from "./state";
import { Note, FixTest, Naming, Damp, ReadableCheck, Wrap } from "./steps";

export default defineModule<ReadableState>({
  initialState,
  steps: [
    { id: "story", title: "A note on the fridge", Component: Note },
    { id: "fix", title: "Make a cryptic test explain itself", Component: FixTest },
    { id: "naming", title: "Four ways to name the same test", Component: Naming },
    { id: "damp", title: "DAMP, not DRY", Component: Damp },
    {
      id: "check",
      title: "Helps or hurts?",
      checkpoint: "testing-readable",
      Component: ReadableCheck,
    },
    { id: "wrap", title: "What to remember", Component: Wrap },
  ],
});
