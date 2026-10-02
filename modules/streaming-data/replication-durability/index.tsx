"use client";

import { defineModule } from "@/lib/module-sdk";
import { initialState, type ReplState } from "./state";
import { Clerks, KillBroker, Lessons, Platforms, SafeOrNot, Wrap } from "./steps";

export default defineModule<ReplState>({
  initialState,
  steps: [
    { id: "clerks", title: "A register and two clerks", Component: Clerks },
    { id: "kill", title: "Lose a broker", Component: KillBroker },
    { id: "lessons", title: "Lessons learned the hard way", Component: Lessons },
    { id: "platforms", title: "How others keep copies", Component: Platforms },
    {
      id: "check",
      title: "Safe, lost or offline?",
      checkpoint: "safe-or-not",
      Component: SafeOrNot,
    },
    { id: "wrap", title: "What to remember", Component: Wrap },
  ],
});
