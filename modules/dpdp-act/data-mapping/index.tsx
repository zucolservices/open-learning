"use client";

import { defineModule } from "@/lib/module-sdk";
import { initialState, type MapState } from "./state";
import { MovingHouse, Hunt, Scanners, AadhaarCase, MapCheck, Wrap } from "./steps";

export default defineModule<MapState>({
  initialState,
  steps: [
    { id: "story", title: "Packing to move", Component: MovingHouse },
    { id: "hunt", title: "Where does it hide?", Component: Hunt },
    { id: "scanners", title: "Can a scanner find it for you?", Component: Scanners },
    { id: "aadhaar", title: "Aadhaar in a support ticket", Component: AadhaarCase },
    {
      id: "check",
      title: "Does it belong on the map?",
      checkpoint: "dpdp-map",
      Component: MapCheck,
    },
    { id: "wrap", title: "What to remember", Component: Wrap },
  ],
});
