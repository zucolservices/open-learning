"use client";

import { defineModule } from "@/lib/module-sdk";
import { initialState, type DescState } from "./state";
import { Handover, Build, SelfReview, Links, DescCheck, Wrap } from "./steps";

export default defineModule<DescState>({
  initialState,
  steps: [
    { id: "story", title: "The shift handover note", Component: Handover },
    { id: "build", title: "Write the description, one section at a time", Component: Build },
    { id: "self", title: "Review it yourself first", Component: SelfReview },
    { id: "links", title: "Connect it to the rest of the work", Component: Links },
    {
      id: "check",
      title: "Choose the first line",
      checkpoint: "review-describing",
      Component: DescCheck,
    },
    { id: "wrap", title: "What to remember", Component: Wrap },
  ],
});
