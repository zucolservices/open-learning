"use client";

import { defineModule } from "@/lib/module-sdk";
import { initialState, type OpsState } from "./state";
import { Taxi, TrimTrace, Anatomy, Levers, WhichLever, Wrap } from "./steps";

export default defineModule<OpsState>({
  initialState,
  steps: [
    { id: "story", title: "The taxi meter", Component: Taxi },
    { id: "trace", title: "Trace and trim a run", Component: TrimTrace },
    { id: "anatomy", title: "Anatomy of a trace", Component: Anatomy },
    { id: "levers", title: "Levers for cost and speed", Component: Levers },
    { id: "check", title: "Which lever?", checkpoint: "cost-lever", Component: WhichLever },
    { id: "wrap", title: "What to remember", Component: Wrap },
  ],
});
