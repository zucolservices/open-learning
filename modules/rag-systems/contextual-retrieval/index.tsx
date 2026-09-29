"use client";

import { defineModule } from "@/lib/module-sdk";
import { initialState, type ContextState } from "./state";
import { AddContext, HowItsDone, SearchSmall, TornPage, WhereToStart, Wrap } from "./steps";

export default defineModule<ContextState>({
  initialState,
  steps: [
    { id: "torn", title: "The torn-out page", Component: TornPage },
    { id: "add", title: "Give each chunk its context", Component: AddContext },
    { id: "how", title: "How it's done, and what it costs", Component: HowItsDone },
    { id: "small", title: "Search small, answer big", Component: SearchSmall },
    {
      id: "start",
      title: "Where to start",
      checkpoint: "context-first",
      Component: WhereToStart,
    },
    { id: "wrap", title: "What to remember", Component: Wrap },
  ],
});
