"use client";

import { defineModule } from "@/lib/module-sdk";
import { initialState, type GroupState } from "./state";
import { Commits, Kitchen, Protocols, ShareTheWork, WhatHappens, Wrap } from "./steps";

export default defineModule<GroupState>({
  initialState,
  steps: [
    { id: "kitchen", title: "Cooks and order rails", Component: Kitchen },
    { id: "group", title: "Share the work", Component: ShareTheWork },
    { id: "commits", title: "Bookmarks: committed offsets", Component: Commits },
    { id: "protocols", title: "Rebalancing, gently", Component: Protocols },
    { id: "check", title: "What happens?", checkpoint: "what-happens", Component: WhatHappens },
    { id: "wrap", title: "What to remember", Component: Wrap },
  ],
});
