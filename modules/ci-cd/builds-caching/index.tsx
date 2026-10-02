"use client";

import { defineModule } from "@/lib/module-sdk";
import { initialState, type BuildState } from "./state";
import { Ecosystems, PinAndCache, RepeatableFaster, SameCode, Wrap } from "./steps";

export default defineModule<BuildState>({
  initialState,
  steps: [
    { id: "story", title: "Same code, different build", Component: SameCode },
    { id: "pin", title: "Pin it, then cache it", Component: PinAndCache },
    { id: "eco", title: "Every ecosystem has one", Component: Ecosystems },
    {
      id: "check",
      title: "Repeatable or faster?",
      checkpoint: "repeatable-faster",
      Component: RepeatableFaster,
    },
    { id: "wrap", title: "What to remember", Component: Wrap },
  ],
});
