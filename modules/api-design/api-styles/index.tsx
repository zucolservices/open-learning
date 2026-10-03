"use client";

import { defineModule } from "@/lib/module-sdk";
import { initialState, type StylesState } from "./state";
import { FourWays, SameTask, WhoUses, MatchIt, Wrap } from "./steps";

export default defineModule<StylesState>({
  initialState,
  steps: [
    { id: "four", title: "Four ways to order dinner", Component: FourWays },
    { id: "same", title: "Same task, four styles", Component: SameTask },
    { id: "who", title: "Who uses what", Component: WhoUses },
    { id: "check", title: "Match the integration", checkpoint: "match-style", Component: MatchIt },
    { id: "wrap", title: "What to remember", Component: Wrap },
  ],
});
