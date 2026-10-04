"use client";

import { defineModule } from "@/lib/module-sdk";
import { initialState, type GuardState } from "./state";
import { KeyCard, Permissions, ExcessiveAgency, Layers, WhichDefence, Wrap } from "./steps";

export default defineModule<GuardState>({
  initialState,
  steps: [
    { id: "story", title: "The hotel key card", Component: KeyCard },
    { id: "permissions", title: "Permissions for an email agent", Component: Permissions },
    { id: "excessive", title: "Excessive agency", Component: ExcessiveAgency },
    { id: "layers", title: "Layers of guardrails", Component: Layers },
    {
      id: "check",
      title: "Which defence is it?",
      checkpoint: "which-defence",
      Component: WhichDefence,
    },
    { id: "wrap", title: "What to remember", Component: Wrap },
  ],
});
