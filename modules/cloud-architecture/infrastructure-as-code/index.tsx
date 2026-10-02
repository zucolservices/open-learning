"use client";

import { defineModule } from "@/lib/module-sdk";
import { initialState, type IacState } from "./state";
import { Drift, FloorPlan, ReadPlan, RunTwice, Tools, Wrap } from "./steps";

export default defineModule<IacState>({
  initialState,
  steps: [
    { id: "floorplan", title: "Draw the floor plan", Component: FloorPlan },
    { id: "twice", title: "Run it twice", Component: RunTwice },
    { id: "plan", title: "Read a plan", checkpoint: "read-plan", Component: ReadPlan },
    { id: "drift", title: "Someone clicked in the console", Component: Drift },
    { id: "tools", title: "The tools", Component: Tools },
    { id: "wrap", title: "What to remember", Component: Wrap },
  ],
});
