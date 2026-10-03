"use client";

import { defineModule } from "@/lib/module-sdk";
import { initialState, type ShState } from "./state";
import { Kitchen, Ladder, WholePage, Forgetful, FastestFirst, Wrap } from "./steps";

export default defineModule<ShState>({
  initialState,
  steps: [
    { id: "kitchen", title: "Counter, fridge, shop", Component: Kitchen },
    { id: "ladder", title: "The latency ladder", Component: Ladder },
    { id: "page", title: "One row costs a page", Component: WholePage },
    { id: "forget", title: "Memory forgets", Component: Forgetful },
    {
      id: "check",
      title: "Fastest to slowest",
      checkpoint: "fastest-first",
      Component: FastestFirst,
    },
    { id: "wrap", title: "What to remember", Component: Wrap },
  ],
});
