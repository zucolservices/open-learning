"use client";

import { defineModule } from "@/lib/module-sdk";
import { initialState, type BcState } from "./state";
import { Meter, SplitIt, ThreeKinds, BoundariesTeams, WhichKind, Wrap } from "./steps";

export default defineModule<BcState>({
  initialState,
  steps: [
    { id: "story", title: "What's a meter?", Component: Meter },
    { id: "split", title: "Split the Customer", Component: SplitIt },
    { id: "kinds", title: "Core, supporting, generic", Component: ThreeKinds },
    { id: "teams", title: "Boundaries and teams", Component: BoundariesTeams },
    { id: "check", title: "Build or buy?", checkpoint: "which-subdomain", Component: WhichKind },
    { id: "wrap", title: "What to remember", Component: Wrap },
  ],
});
