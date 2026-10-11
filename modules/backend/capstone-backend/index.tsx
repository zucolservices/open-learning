"use client";

import { defineModule } from "@/lib/module-sdk";
import { initialState, type CapState } from "./state";
import { Launch, Design, Incidents, Sale, Picture, CapCheck, Wrap } from "./steps";

export default defineModule<CapState>({
  initialState,
  steps: [
    { id: "story", title: "Opening day for online orders", Component: Launch },
    { id: "design", title: "Week one: design decisions", Component: Design },
    { id: "incidents", title: "Launch day: six incidents", Component: Incidents },
    { id: "sale", title: "The Diwali sale", Component: Sale },
    { id: "picture", title: "One order, end to end", Component: Picture },
    {
      id: "check",
      title: "Inside one order request",
      checkpoint: "backend-capstone",
      Component: CapCheck,
    },
    { id: "wrap", title: "What to remember", Component: Wrap },
  ],
});
