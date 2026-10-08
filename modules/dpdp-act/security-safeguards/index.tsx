"use client";

import { defineModule } from "@/lib/module-sdk";
import { initialState, type SafeState } from "./state";
import { LockerRoom, Harden, RuleSix, Accuracy, SafeCheck, Wrap } from "./steps";

export default defineModule<SafeState>({
  initialState,
  steps: [
    { id: "story", title: "The bank's locker room", Component: LockerRoom },
    { id: "harden", title: "Harden the clinic, then test it", Component: Harden },
    { id: "rule6", title: "Rule 6, in plain words", Component: RuleSix },
    { id: "accuracy", title: "Accuracy, when it matters", Component: Accuracy },
    {
      id: "check",
      title: "Protect, detect or recover?",
      checkpoint: "dpdp-safeguards",
      Component: SafeCheck,
    },
    { id: "wrap", title: "What to remember", Component: Wrap },
  ],
});
