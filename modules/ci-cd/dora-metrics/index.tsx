"use client";

import { defineModule } from "@/lib/module-sdk";
import { initialState, type DoraState } from "./state";
import { FiveNumbers, NoGaming, Ranking, TeamMonth, Wrap } from "./steps";

export default defineModule<DoraState>({
  initialState,
  steps: [
    { id: "five", title: "Five numbers", Component: FiveNumbers },
    { id: "month", title: "A team's month in five numbers", Component: TeamMonth },
    { id: "gaming", title: "Measure without gaming", Component: NoGaming },
    { id: "check", title: "The league table", checkpoint: "dora-league-table", Component: Ranking },
    { id: "wrap", title: "What to remember", Component: Wrap },
  ],
});
