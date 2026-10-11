"use client";

import { defineModule } from "@/lib/module-sdk";
import { initialState, type DsState } from "./state";
import { Paint, Tokenise, Tiers, Approaches, DsCheck, Wrap } from "./steps";

export default defineModule<DsState>({
  initialState,
  steps: [
    { id: "story", title: "Fifty shades of brand purple", Component: Paint },
    { id: "tokens", title: "Turn one-off values into tokens", Component: Tokenise },
    { id: "tiers", title: "Three tiers of tokens", Component: Tiers },
    { id: "approaches", title: "The same button, five ways to style it", Component: Approaches },
    {
      id: "check",
      title: "Which tier?",
      checkpoint: "frontend-design-systems",
      Component: DsCheck,
    },
    { id: "wrap", title: "What to remember", Component: Wrap },
  ],
});
