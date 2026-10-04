"use client";

import { defineModule } from "@/lib/module-sdk";
import { initialState, type CapState } from "./state";
import { Brief, Design, WeekOne, InPractice, Checklist, WhereFrom, Wrap } from "./steps";

export default defineModule<CapState>({
  initialState,
  steps: [
    { id: "story", title: "The phones never stop", Component: Brief },
    { id: "design", title: "Design the line", Component: Design },
    { id: "week", title: "Week one: five complaints", Component: WeekOne },
    { id: "practice", title: "Voice AI in healthcare today", Component: InPractice },
    { id: "checklist", title: "Before you go live", Component: Checklist },
    {
      id: "check",
      title: "Which part of the track?",
      checkpoint: "capstone-voice-fixes",
      Component: WhereFrom,
    },
    { id: "wrap", title: "What to remember", Component: Wrap },
  ],
});
