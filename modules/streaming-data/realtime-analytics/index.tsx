"use client";

import { defineModule } from "@/lib/module-sdk";
import { initialState, type RtState } from "./state";
import { Race, Scoreboard, Stores, WhereLive, WhyFast, Wrap } from "./steps";

export default defineModule<RtState>({
  initialState,
  steps: [
    { id: "scoreboard", title: "Scoreboard or newspaper", Component: Scoreboard },
    { id: "race", title: "Race to the dashboard", Component: Race },
    { id: "fast", title: "Why they're fast", Component: WhyFast },
    { id: "stores", title: "Meet the stores", Component: Stores },
    { id: "check", title: "Where should it live?", checkpoint: "where-live", Component: WhereLive },
    { id: "wrap", title: "What to remember", Component: Wrap },
  ],
});
