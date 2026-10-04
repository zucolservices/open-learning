"use client";

import { defineModule } from "@/lib/module-sdk";
import { initialState, type IncState } from "./state";
import { Recall, Monday, Severity, Repair, Steps, Wrap } from "./steps";

export default defineModule<IncState>({
  initialState,
  steps: [
    { id: "story", title: "The product recall", Component: Recall },
    { id: "monday", title: "Monday, 09:10", Component: Monday },
    { id: "severity", title: "How bad is it?", Component: Severity },
    { id: "repair", title: "Repairing data safely", Component: Repair },
    { id: "check", title: "In what order?", checkpoint: "incident-order", Component: Steps },
    { id: "wrap", title: "What to remember", Component: Wrap },
  ],
});
