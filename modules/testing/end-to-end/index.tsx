"use client";

import { defineModule } from "@/lib/module-sdk";
import { initialState, type E2eState } from "./state";
import { Shopper, Waits, Journeys, Tools, E2eCheck, Wrap } from "./steps";

export default defineModule<E2eState>({
  initialState,
  steps: [
    { id: "story", title: "The mystery shopper", Component: Shopper },
    {
      id: "waits",
      title: "Fix a flaky checkout test",
      Component: Waits,
    },
    { id: "journeys", title: "Which journeys deserve one?", Component: Journeys },
    { id: "tools", title: "Browser automation tools", Component: Tools },
    {
      id: "check",
      title: "End-to-end or lower down?",
      checkpoint: "testing-e2e",
      Component: E2eCheck,
    },
    { id: "wrap", title: "What to remember", Component: Wrap },
  ],
});
