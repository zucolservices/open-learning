"use client";

import { defineModule } from "@/lib/module-sdk";
import { initialState, type FeedState } from "./state";
import { Celebrity, Paging, PredictFanout, PushOrPull, PushPull, Wrap } from "./steps";

export default defineModule<FeedState>({
  initialState,
  steps: [
    { id: "push-pull", title: "Deliver or collect?", Component: PushPull },
    { id: "celebrity", title: "The celebrity posts", Component: Celebrity },
    {
      id: "fanout-time",
      title: "How long to reach everyone?",
      checkpoint: "fanout-time",
      Component: PredictFanout,
    },
    { id: "paging", title: "Scrolling while it changes", Component: Paging },
    { id: "hybrid", title: "Push or pull?", checkpoint: "push-or-pull", Component: PushOrPull },
    { id: "wrap", title: "What to remember", Component: Wrap },
  ],
});
