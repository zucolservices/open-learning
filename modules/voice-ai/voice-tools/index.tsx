"use client";

import { defineModule } from "@/lib/module-sdk";
import { initialState, type ToolsState } from "./state";
import { OnHold, ChangeBooking, NoDeadAir, ReadBack, AskFirst, Wrap } from "./steps";

export default defineModule<ToolsState>({
  initialState,
  steps: [
    { id: "story", title: "“Bear with me a moment”", Component: OnHold },
    { id: "change", title: "Change a booking mid-call", Component: ChangeBooking },
    { id: "dead-air", title: "Three ways to avoid dead air", Component: NoDeadAir },
    { id: "read-back", title: "Numbers, letters and cards", Component: ReadBack },
    {
      id: "check",
      title: "Just do it, or ask first?",
      checkpoint: "ask-first",
      Component: AskFirst,
    },
    { id: "wrap", title: "What to remember", Component: Wrap },
  ],
});
