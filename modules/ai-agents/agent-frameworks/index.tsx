"use client";

import { defineModule } from "@/lib/module-sdk";
import { initialState, type FwState } from "./state";
import { FlatPack, Map, Landscape, Portable, FrameworkOrPlatform, Wrap } from "./steps";

export default defineModule<FwState>({
  initialState,
  steps: [
    { id: "story", title: "Build it, or buy a kit", Component: FlatPack },
    { id: "map", title: "Who does which job?", Component: Map },
    { id: "landscape", title: "The main options", Component: Landscape },
    { id: "portable", title: "Choosing and staying portable", Component: Portable },
    {
      id: "check",
      title: "Framework or platform?",
      checkpoint: "framework-platform",
      Component: FrameworkOrPlatform,
    },
    { id: "wrap", title: "What to remember", Component: Wrap },
  ],
});
