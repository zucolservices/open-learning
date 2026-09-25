"use client";

import { defineModule } from "@/lib/module-sdk";
import { initialState, type ResponsibleState } from "./state";
import { Consent, Oversight, Review, Scenario, Story, SwapTheName, Wrap } from "./steps";

export default defineModule<ResponsibleState>({
  initialState,
  steps: [
    { id: "story", title: "The new clerk", Component: Story },
    { id: "scenario", title: "Design the eligibility assistant", Component: Scenario },
    { id: "review", title: "Launch review", Component: Review },
    { id: "swap", title: "Swap the name", Component: SwapTheName },
    { id: "consent", title: "Reusing the chats", checkpoint: "reuse-chats", Component: Consent },
    { id: "oversight", title: "Which safeguard?", checkpoint: "safeguards", Component: Oversight },
    { id: "wrap", title: "What to remember", Component: Wrap },
  ],
});
