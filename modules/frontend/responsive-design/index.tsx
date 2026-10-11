"use client";

import { defineModule } from "@/lib/module-sdk";
import { initialState, type RespState } from "./state";
import { Water, Sandbox, Tools, Beyond, RespCheck, Wrap } from "./steps";

export default defineModule<RespState>({
  initialState,
  steps: [
    { id: "story", title: "Be like water", Component: Water },
    { id: "sandbox", title: "Make a shop page fit every screen", Component: Sandbox },
    { id: "tools", title: "The responsive toolkit", Component: Tools },
    { id: "beyond", title: "Responsive is more than width", Component: Beyond },
    {
      id: "check",
      title: "Media query or container query?",
      checkpoint: "frontend-responsive",
      Component: RespCheck,
    },
    { id: "wrap", title: "What to remember", Component: Wrap },
  ],
});
