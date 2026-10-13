"use client";

import { defineModule } from "@/lib/module-sdk";
import { initialState, type HostState } from "./state";
import { Lockers, Place, Ladder, DataRules, HostCheck, Wrap } from "./steps";

export default defineModule<HostState>({
  initialState,
  steps: [
    { id: "story", title: "Lockers, vaults and safes", Component: Lockers },
    { id: "place", title: "Where should each service live?", Component: Place },
    { id: "ladder", title: "Government hosting options", Component: Ladder },
    { id: "rules", title: "Rules about where data lives", Component: DataRules },
    { id: "check", title: "Which category?", checkpoint: "gov-hosting", Component: HostCheck },
    { id: "wrap", title: "What to remember", Component: Wrap },
  ],
});
