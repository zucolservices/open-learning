"use client";

import { defineModule } from "@/lib/module-sdk";
import { initialState, type BgState } from "./state";
import { Pager, Ready, Rules, Push, BgCheck, Wrap } from "./steps";

export default defineModule<BgState>({
  initialState,
  steps: [
    { id: "story", title: "The buzzing pager", Component: Pager },
    { id: "ready", title: "Your order is ready", Component: Ready },
    { id: "rules", title: "What the system allows", Component: Rules },
    { id: "push", title: "How a push travels", Component: Push },
    { id: "check", title: "Pick the tool", checkpoint: "mobile-background", Component: BgCheck },
    { id: "wrap", title: "What to remember", Component: Wrap },
  ],
});
