"use client";

import { defineModule } from "@/lib/module-sdk";
import { initialState, type ServeState } from "./state";
import { Bakery, Skew, FourWays, ShipSafely, WhichWay, Wrap } from "./steps";

export default defineModule<ServeState>({
  initialState,
  steps: [
    { id: "story", title: "Bake overnight or made to order?", Component: Bakery },
    { id: "skew", title: "Same model, different answers", Component: Skew },
    { id: "ways", title: "Four ways to serve", Component: FourWays },
    { id: "ship", title: "Ship a new model safely", Component: ShipSafely },
    { id: "check", title: "Which way to serve?", checkpoint: "serve-mode", Component: WhichWay },
    { id: "wrap", title: "What to remember", Component: Wrap },
  ],
});
