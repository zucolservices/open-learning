"use client";

import { defineModule } from "@/lib/module-sdk";
import { initialState, type ChooseState } from "./state";
import { Brief, Debrief, Decide, NewRule, Replay, ThreeLanguages } from "./steps";

export default defineModule<ChooseState>({
  initialState,
  steps: [
    { id: "brief", title: "The brief", checkpoint: "kannada-tokens", Component: Brief },
    { id: "languages", title: "Same answer, three languages", Component: ThreeLanguages },
    { id: "decide", title: "Make your design", Component: Decide },
    { id: "replay", title: "Replay a day of questions", Component: Replay },
    {
      id: "new-rule",
      title: "A rule changes tomorrow",
      checkpoint: "new-rule",
      Component: NewRule,
    },
    { id: "debrief", title: "What to remember", Component: Debrief },
  ],
});
