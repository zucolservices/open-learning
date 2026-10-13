"use client";

import { defineModule } from "@/lib/module-sdk";
import { initialState, type CapState } from "./state";
import { Truck, Design, Beta, Launch, Journey, CapCheck, Wrap } from "./steps";

export default defineModule<CapState>({
  initialState,
  steps: [
    { id: "story", title: "The café goes mobile", Component: Truck },
    { id: "design", title: "Design decisions", Component: Design },
    { id: "beta", title: "Beta testing: six problems", Component: Beta },
    { id: "launch", title: "Launch week", Component: Launch },
    { id: "journey", title: "One order, end to end", Component: Journey },
    {
      id: "check",
      title: "From code to customers",
      checkpoint: "mobile-capstone",
      Component: CapCheck,
    },
    { id: "wrap", title: "What to remember", Component: Wrap },
  ],
});
