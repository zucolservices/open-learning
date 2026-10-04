"use client";

import { defineModule } from "@/lib/module-sdk";
import { initialState, type CapState } from "./state";
import { Proposal, Design, WeekOne, Happened, Checklist, WhereFrom, Wrap } from "./steps";

export default defineModule<CapState>({
  initialState,
  steps: [
    { id: "story", title: "60% cheaper, just as good?", Component: Proposal },
    { id: "design", title: "Design the evaluation", Component: Design },
    { id: "week", title: "Five surprises", Component: WeekOne },
    { id: "happened", title: "It happened to them", Component: Happened },
    { id: "checklist", title: "The launch decision", Component: Checklist },
    {
      id: "check",
      title: "Which part of the track?",
      checkpoint: "capstone-evals-fixes",
      Component: WhereFrom,
    },
    { id: "wrap", title: "What to remember", Component: Wrap },
  ],
});
