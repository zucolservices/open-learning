"use client";

import { defineModule } from "@/lib/module-sdk";
import { initialState, type ApiState } from "./state";
import { OneTap } from "./steps-story";
import { ChangeIt, Consumers, ContractOrNot, Wrap } from "./steps";

export default defineModule<ApiState>({
  initialState,
  steps: [
    { id: "story", title: "One tap", Component: OneTap },
    { id: "change", title: "Change the menu", Component: ChangeIt },
    { id: "consumers", title: "Design for the caller", Component: Consumers },
    {
      id: "check",
      title: "Part of the contract?",
      checkpoint: "contract-or-not",
      Component: ContractOrNot,
    },
    { id: "wrap", title: "What to remember", Component: Wrap },
  ],
});
