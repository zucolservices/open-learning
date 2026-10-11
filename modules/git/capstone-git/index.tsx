"use client";

import { defineModule } from "@/lib/module-sdk";
import { initialState, type CapState } from "./state";
import { MondayStory, Rescue, UndoOrRewrite, Guardrails, Checklist, CapCheck, Wrap } from "./steps";

export default defineModule<CapState>({
  initialState,
  steps: [
    { id: "story", title: "Monday morning", Component: MondayStory },
    { id: "rescue", title: "Rescue the lost work", Component: Rescue },
    { id: "undo", title: "Undo or rewrite?", Component: UndoOrRewrite },
    { id: "guards", title: "Set the rules", Component: Guardrails },
    { id: "checklist", title: "The whole track as a checklist", Component: Checklist },
    {
      id: "check",
      title: "Put the rescue in order",
      checkpoint: "git-capstone",
      Component: CapCheck,
    },
    { id: "wrap", title: "What to remember", Component: Wrap },
  ],
});
