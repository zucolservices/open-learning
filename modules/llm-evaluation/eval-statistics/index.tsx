"use client";

import { defineModule } from "@/lib/module-sdk";
import { initialState, type StatsState } from "./state";
import { Poll, Wobble, HowMany, Advice, Meaningful, Wrap } from "./steps";

export default defineModule<StatsState>({
  initialState,
  steps: [
    { id: "story", title: "An opinion poll", Component: Poll },
    { id: "wobble", title: "Watch the score wobble", Component: Wobble },
    { id: "how-many", title: "How many questions do you need?", Component: HowMany },
    { id: "advice", title: "Reporting results honestly", Component: Advice },
    { id: "check", title: "A real difference?", checkpoint: "meaningful", Component: Meaningful },
    { id: "wrap", title: "What to remember", Component: Wrap },
  ],
});
