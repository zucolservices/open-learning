"use client";

import { defineModule } from "@/lib/module-sdk";
import { initialState, type ContractState } from "./state";
import { Tenancy, Review, Model, Lessons, ContractCheck, Wrap } from "./steps";

export default defineModule<ContractState>({
  initialState,
  steps: [
    { id: "story", title: "Read the lease before you move in", Component: Tenancy },
    { id: "review", title: "Fix the draft contract", Component: Review },
    { id: "model", title: "India's model contract", Component: Model },
    { id: "lessons", title: "Lessons from India and abroad", Component: Lessons },
    {
      id: "check",
      title: "Safe clause or risky?",
      checkpoint: "gov-contracts",
      Component: ContractCheck,
    },
    { id: "wrap", title: "What to remember", Component: Wrap },
  ],
});
