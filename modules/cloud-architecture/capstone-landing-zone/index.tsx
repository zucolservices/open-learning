"use client";

import { defineModule } from "@/lib/module-sdk";
import { initialState, type CapState } from "./state";
import { Brief, Choose, FixFirst, Review, Wrap } from "./steps";

export default defineModule<CapState>({
  initialState,
  steps: [
    { id: "brief", title: "The brief", Component: Brief },
    { id: "choose", title: "Make the choices", Component: Choose },
    { id: "review", title: "Review your design", Component: Review },
    { id: "fix", title: "What to fix first", checkpoint: "fix-first", Component: FixFirst },
    { id: "wrap", title: "The whole track", Component: Wrap },
  ],
});
