"use client";

import { defineModule } from "@/lib/module-sdk";
import { initialState, type TimeState } from "./state";
import { Engines, GoneWrong, Postcards, Replay, WhichTime, Wrap } from "./steps";

export default defineModule<TimeState>({
  initialState,
  steps: [
    { id: "postcards", title: "Postmarks and delivery dates", Component: Postcards },
    { id: "replay", title: "Replay an hour of payments", Component: Replay },
    { id: "engines", title: "Watermarks in each engine", Component: Engines },
    { id: "wrong", title: "When watermarks go wrong", Component: GoneWrong },
    {
      id: "check",
      title: "Event time or processing time?",
      checkpoint: "which-time",
      Component: WhichTime,
    },
    { id: "wrap", title: "What to remember", Component: Wrap },
  ],
});
