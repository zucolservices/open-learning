"use client";

import { defineModule } from "@/lib/module-sdk";
import { initialState, type ToolsMapState } from "./state";
import { Toolbox, ToolMap, Moving, Choosing, WhichKind, Wrap } from "./steps";

export default defineModule<ToolsMapState>({
  initialState,
  steps: [
    { id: "story", title: "The right tool for the job", Component: Toolbox },
    { id: "map", title: "The eval tool map", Component: ToolMap },
    { id: "moving", title: "The ground keeps moving", Component: Moving },
    { id: "choosing", title: "Choosing, and staying portable", Component: Choosing },
    { id: "check", title: "Which kind of tool?", checkpoint: "which-tool", Component: WhichKind },
    { id: "wrap", title: "What to remember", Component: Wrap },
  ],
});
