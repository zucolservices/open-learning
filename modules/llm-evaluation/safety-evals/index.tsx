"use client";

import { defineModule } from "@/lib/module-sdk";
import { initialState, type SafetyState } from "./state";
import { FireDrill, TwoSided, RedTeams, WhoTests, HelpOrDecline, Wrap } from "./steps";

export default defineModule<SafetyState>({
  initialState,
  steps: [
    { id: "story", title: "Hiring someone to break in", Component: FireDrill },
    { id: "two-sided", title: "Red-team a chatbot", Component: TwoSided },
    { id: "red-teams", title: "How red-teaming works", Component: RedTeams },
    { id: "who", title: "Who tests the biggest models?", Component: WhoTests },
    {
      id: "check",
      title: "Help or decline?",
      checkpoint: "help-or-decline",
      Component: HelpOrDecline,
    },
    { id: "wrap", title: "What to remember", Component: Wrap },
  ],
});
