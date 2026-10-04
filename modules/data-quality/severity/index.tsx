"use client";

import { defineModule } from "@/lib/module-sdk";
import { initialState, type SevState } from "./state";
import { Fuses, BadNight, HowTools, CircuitBreaker, ChooseAction, Wrap } from "./steps";

export default defineModule<SevState>({
  initialState,
  steps: [
    { id: "story", title: "Not every alarm means evacuate", Component: Fuses },
    { id: "night", title: "Warn, block or quarantine", Component: BadNight },
    { id: "tools", title: "How tools express it", Component: HowTools },
    { id: "breaker", title: "Circuit breakers", Component: CircuitBreaker },
    {
      id: "check",
      title: "Choose the response",
      checkpoint: "choose-action",
      Component: ChooseAction,
    },
    { id: "wrap", title: "What to remember", Component: Wrap },
  ],
});
