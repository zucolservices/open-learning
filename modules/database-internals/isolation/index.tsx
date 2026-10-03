"use client";

import { defineModule } from "@/lib/module-sdk";
import { initialState, type IsoState } from "./state";
import { FourGlitches } from "./steps-story";
import { Collide, Defaults, Fixes, NameIt, Wrap } from "./steps";

export default defineModule<IsoState>({
  initialState,
  steps: [
    { id: "story", title: "Four glitches", Component: FourGlitches },
    { id: "collide", title: "Collide two transactions", Component: Collide },
    { id: "defaults", title: "Every database picks a default", Component: Defaults },
    { id: "fixes", title: "Fixing a race", Component: Fixes },
    { id: "check", title: "Name the anomaly", checkpoint: "name-the-anomaly", Component: NameIt },
    { id: "wrap", title: "What to remember", Component: Wrap },
  ],
});
