"use client";

import { defineModule } from "@/lib/module-sdk";
import { initialState, type FTState } from "./state";
import { BankStatement, ThreeTables, Additivity, Factless, WhichType, Wrap } from "./steps";

export default defineModule<FTState>({
  initialState,
  steps: [
    { id: "story", title: "Three ways to keep score", Component: BankStatement },
    { id: "sim", title: "One process, three fact tables", Component: ThreeTables },
    { id: "add", title: "What can you add up?", Component: Additivity },
    { id: "factless", title: "Facts with no numbers", Component: Factless },
    {
      id: "check",
      title: "Which kind of fact table?",
      checkpoint: "which-fact-table",
      Component: WhichType,
    },
    { id: "wrap", title: "What to remember", Component: Wrap },
  ],
});
