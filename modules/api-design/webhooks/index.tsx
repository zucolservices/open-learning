"use client";

import { defineModule } from "@/lib/module-sdk";
import { initialState, type HookState } from "./state";
import { Tailor, BadDay, Signing, SenderSide, ReceiverRules, Wrap } from "./steps";

export default defineModule<HookState>({
  initialState,
  steps: [
    { id: "tailor", title: "The tailor will call", Component: Tailor },
    { id: "badday", title: "A bad day of deliveries", Component: BadDay },
    { id: "signing", title: "Is it really from them?", Component: Signing },
    { id: "sender", title: "The sender's side", Component: SenderSide },
    {
      id: "check",
      title: "Should the receiver…?",
      checkpoint: "receiver-rules",
      Component: ReceiverRules,
    },
    { id: "wrap", title: "What to remember", Component: Wrap },
  ],
});
