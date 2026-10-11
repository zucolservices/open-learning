"use client";

import { defineModule } from "@/lib/module-sdk";
import { initialState, type HookState } from "./state";
import { Courier, Pipeline, Signatures, Outbox, HookCheck, Wrap } from "./steps";

export default defineModule<HookState>({
  initialState,
  steps: [
    { id: "story", title: "A courier with a sealed envelope", Component: Courier },
    { id: "pipeline", title: "Build a reliable webhook pipeline", Component: Pipeline },
    { id: "signatures", title: "How the big providers sign webhooks", Component: Signatures },
    { id: "outbox", title: "The outbox, and a common event shape", Component: Outbox },
    {
      id: "check",
      title: "Handling an incoming webhook",
      checkpoint: "backend-webhooks",
      Component: HookCheck,
    },
    { id: "wrap", title: "What to remember", Component: Wrap },
  ],
});
