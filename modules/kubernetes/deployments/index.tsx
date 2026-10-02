"use client";

import { defineModule } from "@/lib/module-sdk";
import { initialState, type DeployState } from "./state";
import { DoesItRoll, RollItOut, ShiftChange, UnderTheHood, Wrap } from "./steps";

export default defineModule<DeployState>({
  initialState,
  steps: [
    { id: "shift", title: "Shift change at a busy restaurant", Component: ShiftChange },
    { id: "roll", title: "Roll it out", Component: RollItOut },
    { id: "hood", title: "Under the hood", Component: UnderTheHood },
    { id: "check", title: "Does it roll?", checkpoint: "does-it-roll", Component: DoesItRoll },
    { id: "wrap", title: "What to remember", Component: Wrap },
  ],
});
