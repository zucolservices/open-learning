"use client";

import { defineModule } from "@/lib/module-sdk";
import { initialState, type RegionsState } from "./state";
import { Baskets, BreakIt, India, WhoSecures, Wrap } from "./steps";

export default defineModule<RegionsState>({
  initialState,
  steps: [
    { id: "baskets", title: "Eggs and baskets", Component: Baskets },
    { id: "break", title: "Break the data centre", Component: BreakIt },
    { id: "india", title: "Where the cloud is in India", Component: India },
    {
      id: "who",
      title: "Who secures what",
      checkpoint: "shared-responsibility",
      Component: WhoSecures,
    },
    { id: "wrap", title: "What to remember", Component: Wrap },
  ],
});
