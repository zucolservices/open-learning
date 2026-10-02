"use client";

import { defineModule } from "@/lib/module-sdk";
import { initialState, type TopoState } from "./state";
import { Build, Engines, SameInCode, SortingRoom, WhichTool, Wrap } from "./steps";

export default defineModule<TopoState>({
  initialState,
  steps: [
    { id: "room", title: "The sorting room", Component: SortingRoom },
    { id: "build", title: "Wire a topology", Component: Build },
    { id: "code", title: "The same topology in code", Component: SameInCode },
    { id: "engines", title: "Where it runs", Component: Engines },
    { id: "check", title: "Which tool?", checkpoint: "which-tool", Component: WhichTool },
    { id: "wrap", title: "What to remember", Component: Wrap },
  ],
});
