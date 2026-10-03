"use client";

import { defineModule } from "@/lib/module-sdk";
import { initialState, type VerState } from "./state";
import { Sockets, ShipIt, Schemes, LiveTogether, BestRename, Wrap } from "./steps";

export default defineModule<VerState>({
  initialState,
  steps: [
    { id: "sockets", title: "A new plug socket", Component: Sockets },
    { id: "ship", title: "v1 or v2?", Component: ShipIt },
    { id: "schemes", title: "Where the version goes", Component: Schemes },
    { id: "together", title: "Old and new, side by side", Component: LiveTogether },
    { id: "check", title: "The rename", checkpoint: "best-rename", Component: BestRename },
    { id: "wrap", title: "What to remember", Component: Wrap },
  ],
});
