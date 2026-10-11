"use client";

import { defineModule } from "@/lib/module-sdk";
import { initialState, type StateState } from "./state";
import { Scoreboard, Cart, Declarative, Frameworks, StateCheck, Wrap } from "./steps";

export default defineModule<StateState>({
  initialState,
  steps: [
    { id: "story", title: "Two scoreboards, one match", Component: Scoreboard },
    { id: "cart", title: "Duplicated state versus derived values", Component: Cart },
    { id: "declarative", title: "Describe the result, not the steps", Component: Declarative },
    {
      id: "frameworks",
      title: "State and derived values in four frameworks",
      Component: Frameworks,
    },
    {
      id: "check",
      title: "Store it or derive it?",
      checkpoint: "frontend-state",
      Component: StateCheck,
    },
    { id: "wrap", title: "What to remember", Component: Wrap },
  ],
});
