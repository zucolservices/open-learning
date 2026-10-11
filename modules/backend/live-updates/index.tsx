"use client";

import { defineModule } from "@/lib/module-sdk";
import { initialState, type LiveState } from "./state";
import { Pizza, Compare, Protocols, Operating, LiveCheck, Wrap } from "./steps";

export default defineModule<LiveState>({
  initialState,
  steps: [
    { id: "story", title: "“Is my pizza ready yet?”", Component: Pizza },
    { id: "compare", title: "Live order status for 10,000 customers", Component: Compare },
    { id: "protocols", title: "The protocols", Component: Protocols },
    { id: "operating", title: "Keeping long connections healthy", Component: Operating },
    {
      id: "check",
      title: "Pick the method",
      checkpoint: "backend-live-updates",
      Component: LiveCheck,
    },
    { id: "wrap", title: "What to remember", Component: Wrap },
  ],
});
