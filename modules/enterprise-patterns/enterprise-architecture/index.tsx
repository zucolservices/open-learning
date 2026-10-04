"use client";

import { defineModule } from "@/lib/module-sdk";
import { initialState, type EaState } from "./state";
import { CityPlanner, ZoomC4, Radar, Frameworks, WhichLevel, Wrap } from "./steps";

export default defineModule<EaState>({
  initialState,
  steps: [
    { id: "story", title: "The city planner", Component: CityPlanner },
    { id: "c4", title: "Zoom in with C4", Component: ZoomC4 },
    { id: "radar", title: "Your technology radar", Component: Radar },
    { id: "frameworks", title: "Frameworks and paved roads", Component: Frameworks },
    { id: "check", title: "Which C4 level?", checkpoint: "which-c4", Component: WhichLevel },
    { id: "wrap", title: "What to remember", Component: Wrap },
  ],
});
