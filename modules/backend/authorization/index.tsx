"use client";

import { defineModule } from "@/lib/module-sdk";
import { initialState, type AuthzState } from "./state";
import { Hotel, FixChecks, Models, Engines, AuthzCheck, Wrap } from "./steps";

export default defineModule<AuthzState>({
  initialState,
  steps: [
    { id: "story", title: "The hotel key card", Component: Hotel },
    { id: "fix", title: "Find and fix the missing checks", Component: FixChecks },
    { id: "models", title: "Roles, attributes and relationships", Component: Models },
    { id: "engines", title: "Policy engines", Component: Engines },
    {
      id: "check",
      title: "Real protection?",
      checkpoint: "backend-authorization",
      Component: AuthzCheck,
    },
    { id: "wrap", title: "What to remember", Component: Wrap },
  ],
});
