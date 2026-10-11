"use client";

import { defineModule } from "@/lib/module-sdk";
import { initialState, type LookState } from "./state";
import { Inspector, Prioritise, TheList, Standard, LookCheck, Wrap } from "./steps";

export default defineModule<LookState>({
  initialState,
  steps: [
    { id: "story", title: "The inspector who checked the paint", Component: Inspector },
    {
      id: "prioritise",
      title: "You have time for four comments. Which ones?",
      Component: Prioritise,
    },
    { id: "list", title: "Google's list, in order", Component: TheList },
    { id: "standard", title: "When is it good enough?", Component: Standard },
    {
      id: "check",
      title: "Biggest questions first",
      checkpoint: "review-look",
      Component: LookCheck,
    },
    { id: "wrap", title: "What to remember", Component: Wrap },
  ],
});
