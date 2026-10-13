"use client";

import { defineModule } from "@/lib/module-sdk";
import { initialState, type ContState } from "./state";
import { Ledger, Flood, Records, Audit, ContCheck, Wrap } from "./steps";

export default defineModule<ContState>({
  initialState,
  steps: [
    { id: "story", title: "The land records ledger", Component: Ledger },
    { id: "flood", title: "The data centre floods", Component: Flood },
    { id: "records", title: "What must be kept, and for how long", Component: Records },
    { id: "audit", title: "Audits and recovery targets", Component: Audit },
    {
      id: "check",
      title: "Which retention category?",
      checkpoint: "gov-records",
      Component: ContCheck,
    },
    { id: "wrap", title: "What to remember", Component: Wrap },
  ],
});
