"use client";

import { defineModule } from "@/lib/module-sdk";
import { initialState, type PrState } from "./state";
import { Delivery, Rebuild, Templates, OnePurpose, PrCheck, Wrap } from "./steps";

export default defineModule<PrState>({
  initialState,
  steps: [
    { id: "story", title: "A parcel with a note", Component: Delivery },
    { id: "rebuild", title: "Turn a vague pull request into an easy review", Component: Rebuild },
    { id: "templates", title: "A template does the remembering", Component: Templates },
    { id: "purpose", title: "One purpose per pull request", Component: OnePurpose },
    {
      id: "check",
      title: "Belongs in the PR, or not?",
      checkpoint: "review-anatomy",
      Component: PrCheck,
    },
    { id: "wrap", title: "What to remember", Component: Wrap },
  ],
});
