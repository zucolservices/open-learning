"use client";

import { defineModule } from "@/lib/module-sdk";
import { initialState, type TungstenState } from "./state";
import { Dishes, EngineRace, Stars, NativeEngines, WhichEngine, Wrap } from "./steps";

export default defineModule<TungstenState>({
  initialState,
  steps: [
    { id: "story", title: "Washing up", Component: Dishes },
    { id: "race", title: "Three ways to run a loop", Component: EngineRace },
    { id: "stars", title: "Stars in the plan", Component: Stars },
    { id: "native", title: "Native engines", Component: NativeEngines },
    { id: "check", title: "Which technique?", checkpoint: "which-engine", Component: WhichEngine },
    { id: "wrap", title: "What to remember", Component: Wrap },
  ],
});
