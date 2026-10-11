"use client";

import { defineModule } from "@/lib/module-sdk";
import { initialState, type DaState } from "./state";
import { Shopping, NPlusOne, Pool, Orms, DaCheck, Wrap } from "./steps";

export default defineModule<DaState>({
  initialState,
  steps: [
    { id: "story", title: "One trip or twenty?", Component: Shopping },
    { id: "n1", title: "Load an order-history page", Component: NPlusOne },
    { id: "pool", title: "Connection pools and the database's limit", Component: Pool },
    { id: "orms", title: "SQL, query builders and ORMs", Component: Orms },
    {
      id: "check",
      title: "Too many clients",
      checkpoint: "backend-data-access",
      Component: DaCheck,
    },
    { id: "wrap", title: "What to remember", Component: Wrap },
  ],
});
