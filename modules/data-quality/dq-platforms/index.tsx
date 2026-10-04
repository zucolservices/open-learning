"use client";

import { defineModule } from "@/lib/module-sdk";
import { initialState, type PlatState } from "./state";
import { Toolbox, Map, Moving, Choosing, WhichKind, Wrap } from "./steps";

export default defineModule<PlatState>({
  initialState,
  steps: [
    { id: "story", title: "The toolbox, not the brand", Component: Toolbox },
    { id: "map", title: "The tool map", Component: Map },
    { id: "moving", title: "A market on the move", Component: Moving },
    { id: "choosing", title: "Choosing for your team", Component: Choosing },
    { id: "check", title: "What kind of tool?", checkpoint: "tool-kind", Component: WhichKind },
    { id: "wrap", title: "What to remember", Component: Wrap },
  ],
});
