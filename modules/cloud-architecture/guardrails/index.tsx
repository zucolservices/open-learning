"use client";

import { defineModule } from "@/lib/module-sdk";
import { initialState, type GuardState } from "./state";
import { Kinds, Locks, SameRule, ShiftLeft, TryIt, Wrap } from "./steps";

export default defineModule<GuardState>({
  initialState,
  steps: [
    { id: "locks", title: "Locks, cameras and caretakers", Component: Locks },
    { id: "try", title: "Try to break the rules", Component: TryIt },
    { id: "code", title: "The same rule on three clouds", Component: SameRule },
    { id: "shift", title: "Catch it before it ships", Component: ShiftLeft },
    { id: "kinds", title: "Block, flag or fix?", checkpoint: "guardrail-kinds", Component: Kinds },
    { id: "wrap", title: "What to remember", Component: Wrap },
  ],
});
