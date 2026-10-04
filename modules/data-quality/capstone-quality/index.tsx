"use client";

import { defineModule } from "@/lib/module-sdk";
import { initialState, type CapState } from "./state";
import { Slide, Investigate, Repair, Defences, RealWorld, Layers, Wrap } from "./steps";

export default defineModule<CapState>({
  initialState,
  steps: [
    { id: "story", title: "The number on slide 3", Component: Slide },
    { id: "investigate", title: "Find the cause", Component: Investigate },
    { id: "repair", title: "Contain and repair", Component: Repair },
    { id: "defences", title: "Choose your defences", Component: Defences },
    { id: "real", title: "It happens to everyone", Component: RealWorld },
    { id: "check", title: "Which layer?", checkpoint: "defence-layer", Component: Layers },
    { id: "wrap", title: "What to remember", Component: Wrap },
  ],
});
