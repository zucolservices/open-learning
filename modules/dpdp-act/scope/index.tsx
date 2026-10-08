"use client";

import { defineModule } from "@/lib/module-sdk";
import { initialState, type ScopeState } from "./state";
import {
  LedgerAndApp,
  ScopeSorter,
  AcrossTheBorder,
  PublicIsntFree,
  ScopeCheck,
  Wrap,
} from "./steps";

export default defineModule<ScopeState>({
  initialState,
  steps: [
    { id: "story", title: "The ledger and the app", Component: LedgerAndApp },
    { id: "sorter", title: "In scope or not?", Component: ScopeSorter },
    { id: "border", title: "Across the border", Component: AcrossTheBorder },
    { id: "myths", title: "Four myths about scope", Component: PublicIsntFree },
    { id: "check", title: "Covered or not?", checkpoint: "dpdp-scope", Component: ScopeCheck },
    { id: "wrap", title: "What to remember", Component: Wrap },
  ],
});
