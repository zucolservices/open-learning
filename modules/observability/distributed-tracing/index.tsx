"use client";

import { defineModule } from "@/lib/module-sdk";
import { initialState, type TraceState } from "./state";
import { FollowCheckout, TheGap, Traceparent, Wrap } from "./steps";

export default defineModule<TraceState>({
  initialState,
  steps: [
    { id: "follow", title: "Follow one checkout", Component: FollowCheckout },
    { id: "header", title: "The header that holds it together", Component: Traceparent },
    { id: "check", title: "The gap", checkpoint: "trace-gap", Component: TheGap },
    { id: "wrap", title: "What to remember", Component: Wrap },
  ],
});
