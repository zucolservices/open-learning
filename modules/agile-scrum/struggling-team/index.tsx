"use client";

import { defineModule } from "@/lib/module-sdk";
import { initialState, type CaseState } from "./state";
import { Diagnose, Evidence, TheCase, Treat, Wrap } from "./steps";

export default defineModule<CaseState>({
  initialState,
  steps: [
    { id: "case", title: "The case", Component: TheCase },
    { id: "evidence", title: "Gather the evidence", Component: Evidence },
    { id: "diagnose", title: "What's really wrong?", checkpoint: "diagnose", Component: Diagnose },
    { id: "treat", title: "Choose the first changes", Component: Treat },
    { id: "wrap", title: "What to remember", Component: Wrap },
  ],
});
