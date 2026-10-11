"use client";

import { defineModule } from "@/lib/module-sdk";
import { initialState, type CapState } from "./state";
import { NewJob, Risk, Techniques, ReleaseDay, Checklist, CapCheck, Wrap } from "./steps";

export default defineModule<CapState>({
  initialState,
  steps: [
    { id: "story", title: "The service nobody dares to touch", Component: NewJob },
    { id: "risk", title: "Spend a week's testing where the risk is", Component: Risk },
    { id: "techniques", title: "Pick the right kind of test for each part", Component: Techniques },
    { id: "release", title: "Friday: run your plan against the release", Component: ReleaseDay },
    { id: "checklist", title: "The whole track as a checklist", Component: Checklist },
    {
      id: "check",
      title: "Plan your first week",
      checkpoint: "testing-capstone",
      Component: CapCheck,
    },
    { id: "wrap", title: "What to remember", Component: Wrap },
  ],
});
