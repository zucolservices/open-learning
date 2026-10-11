"use client";

import { defineModule } from "@/lib/module-sdk";
import { initialState, type ReviewersState } from "./state";
import { Hospital, Owners, HowMany, Spread, ReviewersCheck, Wrap } from "./steps";

export default defineModule<ReviewersState>({
  initialState,
  steps: [
    { id: "story", title: "Who reads the X-ray?", Component: Hospital },
    { id: "owners", title: "Route four files to the right owners", Component: Owners },
    { id: "how-many", title: "How many reviewers?", Component: HowMany },
    { id: "spread", title: "Reviewing to spread knowledge", Component: Spread },
    {
      id: "check",
      title: "Fix the routing",
      checkpoint: "review-reviewers",
      Component: ReviewersCheck,
    },
    { id: "wrap", title: "What to remember", Component: Wrap },
  ],
});
