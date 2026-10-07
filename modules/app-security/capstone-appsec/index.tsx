"use client";

import { defineModule } from "@/lib/module-sdk";
import { initialState, type CapState } from "./state";
import { Memo, Design, Incidents, Happened, Checklist, WhereFrom, Wrap } from "./steps";

export default defineModule<CapState>({
  initialState,
  steps: [
    { id: "story", title: "“Launch in a quarter”", Component: Memo },
    { id: "design", title: "Design the defences", Component: Design },
    { id: "incidents", title: "The first quarter", Component: Incidents },
    { id: "happened", title: "It happened to them", Component: Happened },
    { id: "checklist", title: "The whole track as a checklist", Component: Checklist },
    {
      id: "check",
      title: "Which part of the track?",
      checkpoint: "capstone-appsec-fixes",
      Component: WhereFrom,
    },
    { id: "wrap", title: "What to remember", Component: Wrap },
  ],
});
