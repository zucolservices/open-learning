"use client";

import { defineModule } from "@/lib/module-sdk";
import { initialState, type CapState } from "./state";
import { Launch, Design, WeekOne, RealCases, Checklist, WhereFrom, Wrap } from "./steps";

export default defineModule<CapState>({
  initialState,
  steps: [
    { id: "story", title: "Launch week", Component: Launch },
    { id: "design", title: "Design the agent", Component: Design },
    { id: "week", title: "Week one: five failures", Component: WeekOne },
    { id: "real", title: "It happened to them", Component: RealCases },
    { id: "checklist", title: "Before you launch", Component: Checklist },
    {
      id: "check",
      title: "Which part of the track?",
      checkpoint: "capstone-fixes",
      Component: WhereFrom,
    },
    { id: "wrap", title: "What to remember", Component: Wrap },
  ],
});
