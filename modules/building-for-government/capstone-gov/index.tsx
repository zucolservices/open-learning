"use client";

import { defineModule } from "@/lib/module-sdk";
import { initialState, type CapState } from "./state";
import { Well, Design, Audit, Launch, Journey, CapCheck, Wrap } from "./steps";

export default defineModule<CapState>({
  initialState,
  steps: [
    { id: "story", title: "The village well", Component: Well },
    { id: "design", title: "Buying and designing", Component: Design },
    { id: "audit", title: "The pre-launch audit", Component: Audit },
    { id: "launch", title: "Deadline season", Component: Launch },
    { id: "journey", title: "One application, end to end", Component: Journey },
    {
      id: "check",
      title: "From tender to results",
      checkpoint: "gov-capstone",
      Component: CapCheck,
    },
    { id: "wrap", title: "What to remember", Component: Wrap },
  ],
});
