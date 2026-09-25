"use client";

import { defineModule } from "@/lib/module-sdk";
import { initialState, type OpenState } from "./state";
import { Benchmarks, Kitchens, PickHosting, WhatYouGet, WhereItRuns, Wrap } from "./steps";

export default defineModule<OpenState>({
  initialState,
  steps: [
    { id: "kitchens", title: "Restaurant, recipe or cookbook?", Component: Kitchens },
    { id: "licence", title: "Read the licence", Component: WhatYouGet },
    { id: "where", title: "Where can it run?", Component: WhereItRuns },
    {
      id: "benchmarks",
      title: "Leaderboards and their limits",
      checkpoint: "leaderboard",
      Component: Benchmarks,
    },
    { id: "hosting", title: "Pick the hosting", checkpoint: "hosting", Component: PickHosting },
    { id: "wrap", title: "What to remember", Component: Wrap },
  ],
});
