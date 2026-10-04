"use client";

import { defineModule } from "@/lib/module-sdk";
import { initialState, type TransportState } from "./state";
import { Pipes, ThreeRoads, Narrowband, PhoneRoute, PickRoad, Wrap } from "./steps";

export default defineModule<TransportState>({
  initialState,
  steps: [
    { id: "story", title: "Letters and phone calls", Component: Pipes },
    { id: "roads", title: "Three ways to carry audio", Component: ThreeRoads },
    { id: "narrowband", title: "Why phones sound thin", Component: Narrowband },
    { id: "phone-route", title: "How a phone call reaches your agent", Component: PhoneRoute },
    { id: "check", title: "Pick the road", checkpoint: "pick-road", Component: PickRoad },
    { id: "wrap", title: "What to remember", Component: Wrap },
  ],
});
