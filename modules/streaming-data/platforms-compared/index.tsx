"use client";

import { defineModule } from "@/lib/module-sdk";
import { initialState, type PlatState } from "./state";
import { Caveats, PickPlatform, StreamMap, Vehicles, Wrap } from "./steps";

export default defineModule<PlatState>({
  initialState,
  steps: [
    { id: "vehicles", title: "Own, lease or ride", Component: Vehicles },
    { id: "map", title: "The streaming map", Component: StreamMap },
    { id: "caveats", title: "Compatible isn't identical", Component: Caveats },
    { id: "pick", title: "Pick a platform", checkpoint: "pick-platform", Component: PickPlatform },
    { id: "wrap", title: "What to remember", Component: Wrap },
  ],
});
