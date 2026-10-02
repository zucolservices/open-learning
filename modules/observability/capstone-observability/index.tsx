"use client";

import { defineModule } from "@/lib/module-sdk";
import { initialState, type CapState } from "./state";
import { BadNight, Brief, Choose, FixFirst, Wrap } from "./steps";

export default defineModule<CapState>({
  initialState,
  steps: [
    { id: "brief", title: "The brief", Component: Brief },
    { id: "choose", title: "Make the choices", Component: Choose },
    { id: "night", title: "The bad month", Component: BadNight },
    { id: "fix", title: "What to fix first", checkpoint: "obs-fix-first", Component: FixFirst },
    { id: "wrap", title: "The whole track", Component: Wrap },
  ],
});
