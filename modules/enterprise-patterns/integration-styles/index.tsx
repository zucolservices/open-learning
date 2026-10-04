"use client";

import { defineModule } from "@/lib/module-sdk";
import { initialState, type StyleState } from "./state";
import { FourWays, BreakIt, Choosing, ThenNow, WhichStyle, Wrap } from "./steps";

export default defineModule<StyleState>({
  initialState,
  steps: [
    { id: "story", title: "Four ways to pass a message", Component: FourWays },
    { id: "break", title: "Connect it, then break it", Component: BreakIt },
    { id: "choose", title: "How to choose", Component: Choosing },
    { id: "now", title: "Then and now", Component: ThenNow },
    { id: "check", title: "Which style?", checkpoint: "which-style", Component: WhichStyle },
    { id: "wrap", title: "What to remember", Component: Wrap },
  ],
});
