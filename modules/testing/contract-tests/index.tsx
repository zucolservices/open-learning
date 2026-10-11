"use client";

import { defineModule } from "@/lib/module-sdk";
import { initialState, type ContractState } from "./state";
import { PlugShape, Collide, Flow, Tools, ContractCheck, Wrap } from "./steps";

export default defineModule<ContractState>({
  initialState,
  steps: [
    { id: "story", title: "Agree on the plug, build apart", Component: PlugShape },
    { id: "collide", title: "Change the API and see who notices", Component: Collide },
    { id: "flow", title: "How a consumer-driven contract travels", Component: Flow },
    { id: "tools", title: "Contracts, schemas and tools", Component: Tools },
    {
      id: "check",
      title: "Safe or breaking?",
      checkpoint: "testing-contract",
      Component: ContractCheck,
    },
    { id: "wrap", title: "What to remember", Component: Wrap },
  ],
});
