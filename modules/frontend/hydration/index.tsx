"use client";

import { defineModule } from "@/lib/module-sdk";
import { initialState, type HydState } from "./state";
import { Photo, Stages, WhoDoes, ServerComponents, HydCheck, Wrap } from "./steps";

export default defineModule<HydState>({
  initialState,
  steps: [
    { id: "story", title: "The photo and the bricks", Component: Photo },
    { id: "stages", title: "From HTML to interactive, four ways", Component: Stages },
    { id: "who", title: "Partial hydration across frameworks", Component: WhoDoes },
    {
      id: "rsc",
      title: "Server components, and why patching matters",
      Component: ServerComponents,
    },
    {
      id: "check",
      title: "The button that does nothing",
      checkpoint: "frontend-hydration",
      Component: HydCheck,
    },
    { id: "wrap", title: "What to remember", Component: Wrap },
  ],
});
