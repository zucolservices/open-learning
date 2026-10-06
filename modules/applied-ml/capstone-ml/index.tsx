"use client";

import { defineModule } from "@/lib/module-sdk";
import { initialState, type CapState } from "./state";
import { Memo, Design, Surprises, Happened, Checklist, WhereFrom, Wrap } from "./steps";

export default defineModule<CapState>({
  initialState,
  steps: [
    { id: "story", title: "“Stop customers leaving”", Component: Memo },
    { id: "design", title: "Design the project", Component: Design },
    { id: "surprises", title: "Five surprises", Component: Surprises },
    { id: "happened", title: "It happened to them", Component: Happened },
    { id: "checklist", title: "The whole track as a checklist", Component: Checklist },
    {
      id: "check",
      title: "Which part of the track?",
      checkpoint: "capstone-ml-fixes",
      Component: WhereFrom,
    },
    { id: "wrap", title: "What to remember", Component: Wrap },
  ],
});
