"use client";

import { defineModule } from "@/lib/module-sdk";
import { initialState, type MigState } from "./state";
import { Cutover, MoveData, MovingHouse, Portfolio, SevenRs, WhichR, Wrap } from "./steps";

export default defineModule<MigState>({
  initialState,
  steps: [
    { id: "house", title: "Moving house", Component: MovingHouse },
    { id: "rs", title: "The 7 Rs", Component: SevenRs },
    { id: "portfolio", title: "Decide the fate of ten apps", Component: Portfolio },
    { id: "data", title: "Moving the data", Component: MoveData },
    { id: "cutover", title: "Waves and cut-over", Component: Cutover },
    { id: "which", title: "Which R?", checkpoint: "which-r", Component: WhichR },
    { id: "wrap", title: "What to remember", Component: Wrap },
  ],
});
