"use client";

import { defineModule } from "@/lib/module-sdk";
import { initialState, type CapState } from "./state";
import { Friday, Investigate, Echoes, WhichTool, Wrap } from "./steps";

export default defineModule<CapState>({
  initialState,
  steps: [
    { id: "story", title: "Friday evening, payments", Component: Friday },
    { id: "investigate", title: "Five problems", Component: Investigate },
    { id: "echoes", title: "It happened for real", Component: Echoes },
    { id: "check", title: "Which tool?", checkpoint: "which-tool", Component: WhichTool },
    { id: "wrap", title: "What you can do now", Component: Wrap },
  ],
});
