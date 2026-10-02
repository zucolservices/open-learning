"use client";

import { defineModule } from "@/lib/module-sdk";
import { initialState, type MigrationState } from "./state";
import { InPipeline, LockQueue, OrderSteps, RenameLive, Wrap } from "./steps";

export default defineModule<MigrationState>({
  initialState,
  steps: [
    { id: "rename", title: "Rename a column, live", Component: RenameLive },
    { id: "locks", title: "The lock queue", Component: LockQueue },
    { id: "pipeline", title: "Migrations in the pipeline", Component: InPipeline },
    {
      id: "check",
      title: "Put the steps in order",
      checkpoint: "expand-contract-order",
      Component: OrderSteps,
    },
    { id: "wrap", title: "What to remember", Component: Wrap },
  ],
});
