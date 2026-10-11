"use client";

import { defineModule } from "@/lib/module-sdk";
import { initialState, type ApprState } from "./state";
import { Houses, Choose, Families, Pwa, ApprCheck, Wrap } from "./steps";

export default defineModule<ApprState>({
  initialState,
  steps: [
    { id: "story", title: "Building, prefab, or a pop-up?", Component: Houses },
    { id: "choose", title: "Pick an approach for five projects", Component: Choose },
    { id: "families", title: "How each approach draws the screen", Component: Families },
    { id: "pwa", title: "Web apps on phones", Component: Pwa },
    {
      id: "check",
      title: "Which approach is it?",
      checkpoint: "mobile-approach",
      Component: ApprCheck,
    },
    { id: "wrap", title: "What to remember", Component: Wrap },
  ],
});
