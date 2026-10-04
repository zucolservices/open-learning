"use client";

import { defineModule } from "@/lib/module-sdk";
import { initialState, type CapState } from "./state";
import { Brief, Choose, TwoYears, Echoes, WhichPattern, Wrap } from "./steps";

export default defineModule<CapState>({
  initialState,
  steps: [
    { id: "brief", title: "The brief", Component: Brief },
    { id: "choose", title: "Make the decisions", Component: Choose },
    { id: "later", title: "Two years later", Component: TwoYears },
    { id: "echoes", title: "It happened for real", Component: Echoes },
    {
      id: "check",
      title: "Which pattern helps?",
      checkpoint: "capstone-patterns",
      Component: WhichPattern,
    },
    { id: "wrap", title: "What you can do now", Component: Wrap },
  ],
});
