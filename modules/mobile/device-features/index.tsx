"use client";

import { defineModule } from "@/lib/module-sdk";
import { initialState, type FeatState } from "./state";
import { Lighthouse, Tracking, Camera, Sensors, FeatCheck, Wrap } from "./steps";

export default defineModule<FeatState>({
  initialState,
  steps: [
    { id: "story", title: "Asking for directions", Component: Lighthouse },
    { id: "tracking", title: "Track the delivery", Component: Tracking },
    { id: "camera", title: "Camera and photos", Component: Camera },
    { id: "sensors", title: "Sensors and the background", Component: Sensors },
    { id: "check", title: "How precise?", checkpoint: "mobile-location", Component: FeatCheck },
    { id: "wrap", title: "What to remember", Component: Wrap },
  ],
});
