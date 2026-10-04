"use client";

import { defineModule } from "@/lib/module-sdk";
import { initialState, type DesignState } from "./state";
import { NoScreen, RescueMenu, Ladder, SayAi, ConfirmHow, Wrap } from "./steps";

export default defineModule<DesignState>({
  initialState,
  steps: [
    { id: "story", title: "No screen to fall back on", Component: NoScreen },
    { id: "rescue", title: "Rescue a phone menu", Component: RescueMenu },
    { id: "ladder", title: "When the agent doesn't understand", Component: Ladder },
    { id: "say-ai", title: "Say you're an AI", Component: SayAi },
    {
      id: "check",
      title: "Ask, or just repeat back?",
      checkpoint: "confirm-how",
      Component: ConfirmHow,
    },
    { id: "wrap", title: "What to remember", Component: Wrap },
  ],
});
