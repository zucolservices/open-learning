"use client";

import { defineModule } from "@/lib/module-sdk";
import { initialState, type SecState } from "./state";
import { Locksmith, Refund, ToolsPeople, Specialist, SecCheck, Wrap } from "./steps";

export default defineModule<SecState>({
  initialState,
  steps: [
    { id: "story", title: "The builder and the burglar", Component: Locksmith },
    { id: "refund", title: "A security pass on a refund endpoint", Component: Refund },
    { id: "tools", title: "What tools catch, and what needs a person", Component: ToolsPeople },
    { id: "specialist", title: "When to call in a specialist", Component: Specialist },
    { id: "check", title: "Tool or person?", checkpoint: "review-security", Component: SecCheck },
    { id: "wrap", title: "What to remember", Component: Wrap },
  ],
});
