"use client";

import { defineModule } from "@/lib/module-sdk";
import { initialState, type OpsState } from "./state";
import { Shift, FixOps, Probes, Correlation, OpsCheck, Wrap } from "./steps";

export default defineModule<OpsState>({
  initialState,
  steps: [
    { id: "story", title: "A good shift handover", Component: Shift },
    { id: "fix", title: "Make the service easy to run", Component: FixOps },
    { id: "probes", title: "Probes and the shutdown sequence", Component: Probes },
    { id: "correlation", title: "Following one request across services", Component: Correlation },
    {
      id: "check",
      title: "Liveness or readiness?",
      checkpoint: "backend-logs-health",
      Component: OpsCheck,
    },
    { id: "wrap", title: "What to remember", Component: Wrap },
  ],
});
