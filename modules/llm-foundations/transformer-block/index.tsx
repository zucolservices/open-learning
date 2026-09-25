"use client";

import { defineModule } from "@/lib/module-sdk";
import { initialState, type BlockState } from "./state";
import { Journey, Lens, Parameters, TwoStations, Wrap } from "./steps";

export default defineModule<BlockState>({
  initialState,
  steps: [
    { id: "journey", title: "One token's journey", Component: Journey },
    { id: "lens", title: "Watch a prediction form", Component: Lens },
    { id: "parameters", title: "Where the parameters live", Component: Parameters },
    {
      id: "stations",
      title: "Two stations, two jobs",
      checkpoint: "two-stations",
      Component: TwoStations,
    },
    { id: "wrap", title: "What to remember", Component: Wrap },
  ],
});
