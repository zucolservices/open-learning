"use client";

import { defineModule } from "@/lib/module-sdk";
import { initialState, type BlocksState } from "./state";
import { LockIn, Rosetta, Translate, WhoDoesWhat, Wrap } from "./steps";

export default defineModule<BlocksState>({
  initialState,
  steps: [
    { id: "rosetta", title: "One diagram, four languages", Component: Rosetta },
    {
      id: "translate",
      title: "Translate the diagram",
      checkpoint: "translate",
      Component: Translate,
    },
    { id: "who", title: "Who does what?", Component: WhoDoesWhat },
    { id: "lock-in", title: "How locked in are you?", checkpoint: "lock-in", Component: LockIn },
    { id: "wrap", title: "What to remember", Component: Wrap },
  ],
});
