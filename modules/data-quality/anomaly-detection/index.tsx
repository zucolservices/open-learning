"use client";

import { defineModule } from "@/lib/module-sdk";
import { initialState, type AnomState } from "./state";
import { Thermostat, Tune, Robust, Fatigue, WhichMonitor, Wrap } from "./steps";

export default defineModule<AnomState>({
  initialState,
  steps: [
    { id: "story", title: "What's normal for a Sunday?", Component: Thermostat },
    { id: "tune", title: "Tune a row-count monitor", Component: Tune },
    { id: "robust", title: "Better baselines", Component: Robust },
    { id: "fatigue", title: "Crying wolf", Component: Fatigue },
    { id: "check", title: "Which monitor?", checkpoint: "which-monitor", Component: WhichMonitor },
    { id: "wrap", title: "What to remember", Component: Wrap },
  ],
});
