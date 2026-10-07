"use client";

import { defineModule } from "@/lib/module-sdk";
import { initialState, type ThreatState } from "./state";
import { SchoolTrip, Diagram, Letters, Respond, WhichLetter, Wrap } from "./steps";

export default defineModule<ThreatState>({
  initialState,
  steps: [
    { id: "story", title: "Planning a school trip", Component: SchoolTrip },
    { id: "diagram", title: "Draw it, then ask what can go wrong", Component: Diagram },
    { id: "stride", title: "Six questions called STRIDE", Component: Letters },
    { id: "respond", title: "What will we do about it?", Component: Respond },
    {
      id: "check",
      title: "Which STRIDE threat?",
      checkpoint: "stride-letter",
      Component: WhichLetter,
    },
    { id: "wrap", title: "What to remember", Component: Wrap },
  ],
});
