"use client";

import { defineModule } from "@/lib/module-sdk";
import { initialState, type CdcState } from "./state";
import { ChangeEvent, Consistent, Databases, DualWrite, Ledger, Wrap } from "./steps";

export default defineModule<CdcState>({
  initialState,
  steps: [
    { id: "ledger", title: "The ledger and the text message", Component: Ledger },
    { id: "dual", title: "Lose an event", Component: DualWrite },
    { id: "event", title: "Inside a change event", Component: ChangeEvent },
    { id: "databases", title: "Reading each database's log", Component: Databases },
    {
      id: "check",
      title: "Consistent or not?",
      checkpoint: "consistent-or-not",
      Component: Consistent,
    },
    { id: "wrap", title: "What to remember", Component: Wrap },
  ],
});
