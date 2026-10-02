"use client";

import { defineModule } from "@/lib/module-sdk";
import { initialState, type PatternState } from "./state";
import { Cqrs, Passbook, Rebuild, Saga, Tools, WhichPattern, Wrap } from "./steps";

export default defineModule<PatternState>({
  initialState,
  steps: [
    { id: "passbook", title: "The passbook", Component: Passbook },
    { id: "rebuild", title: "Rebuild the balance", Component: Rebuild },
    { id: "cqrs", title: "Separate the reads", Component: Cqrs },
    { id: "saga", title: "A saga that undoes itself", Component: Saga },
    { id: "tools", title: "Tools and traps", Component: Tools },
    { id: "check", title: "Which pattern?", checkpoint: "which-pattern", Component: WhichPattern },
    { id: "wrap", title: "What to remember", Component: Wrap },
  ],
});
