"use client";

import { defineModule } from "@/lib/module-sdk";
import { initialState, type FeedbackState } from "./state";
import { Coach, Rewrite, Advice, Tone, FeedbackCheck, Wrap } from "./steps";

export default defineModule<FeedbackState>({
  initialState,
  steps: [
    { id: "story", title: "Two cricket coaches", Component: Coach },
    { id: "rewrite", title: "Rewrite five unhelpful comments", Component: Rewrite },
    { id: "advice", title: "Four habits for comments", Component: Advice },
    { id: "tone", title: "Why tone matters", Component: Tone },
    {
      id: "check",
      title: "Useful or not?",
      checkpoint: "review-feedback",
      Component: FeedbackCheck,
    },
    { id: "wrap", title: "What to remember", Component: Wrap },
  ],
});
