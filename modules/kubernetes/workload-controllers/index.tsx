"use client";

import { defineModule } from "@/lib/module-sdk";
import { initialState, type WlState } from "./state";
import { FinePrint, FiveStaff, Watch, WhichController, Wrap } from "./steps";

export default defineModule<WlState>({
  initialState,
  steps: [
    { id: "staff", title: "Five kinds of staff", Component: FiveStaff },
    { id: "watch", title: "Watch each controller", Component: Watch },
    { id: "fine", title: "The fine print", Component: FinePrint },
    {
      id: "check",
      title: "Which controller?",
      checkpoint: "which-controller",
      Component: WhichController,
    },
    { id: "wrap", title: "What to remember", Component: Wrap },
  ],
});
