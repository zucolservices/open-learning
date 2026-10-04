"use client";

import { defineModule } from "@/lib/module-sdk";
import { initialState, type MultiState } from "./state";
import { Kitchen, Compare, Handoffs, Debate, OneOrMany, Wrap } from "./steps";

export default defineModule<MultiState>({
  initialState,
  steps: [
    { id: "story", title: "Too many cooks", Component: Kitchen },
    { id: "compare", title: "One agent or a team?", Component: Compare },
    { id: "handoffs", title: "Two ways to pass work", Component: Handoffs },
    { id: "debate", title: "What builders learned", Component: Debate },
    { id: "check", title: "One agent or many?", checkpoint: "one-or-many", Component: OneOrMany },
    { id: "wrap", title: "What to remember", Component: Wrap },
  ],
});
