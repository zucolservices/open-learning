"use client";

import { defineModule } from "@/lib/module-sdk";
import { initialState, type PermState } from "./state";
import { Keys, Moments, History, Disclose, PermCheck, Wrap } from "./steps";

export default defineModule<PermState>({
  initialState,
  steps: [
    { id: "story", title: "The house keys", Component: Keys },
    { id: "moments", title: "Ask at the right moment", Component: Moments },
    { id: "history", title: "Permissions keep getting finer", Component: History },
    { id: "disclose", title: "Telling people what you collect", Component: Disclose },
    {
      id: "check",
      title: "Does it need permission?",
      checkpoint: "mobile-permissions",
      Component: PermCheck,
    },
    { id: "wrap", title: "What to remember", Component: Wrap },
  ],
});
