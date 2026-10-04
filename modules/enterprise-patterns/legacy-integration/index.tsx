"use client";

import { defineModule } from "@/lib/module-sdk";
import { initialState, type LegacyState } from "./state";
import { CobolCall, Connect, Bubbles, StillHere, WhichStrategy, Wrap } from "./steps";

export default defineModule<LegacyState>({
  initialState,
  steps: [
    { id: "story", title: "Wanted: COBOL programmers", Component: CobolCall },
    { id: "connect", title: "Connect to the mainframe", Component: Connect },
    { id: "bubbles", title: "Four strategies", Component: Bubbles },
    { id: "today", title: "Still here", Component: StillHere },
    {
      id: "check",
      title: "Which strategy?",
      checkpoint: "which-strategy",
      Component: WhichStrategy,
    },
    { id: "wrap", title: "What to remember", Component: Wrap },
  ],
});
