"use client";

import { defineModule } from "@/lib/module-sdk";
import { initialState, type RespondState } from "./state";
import { Tasting, Reply, Habits, CloseLoop, RespondCheck, Wrap } from "./steps";

export default defineModule<RespondState>({
  initialState,
  steps: [
    { id: "story", title: "Feedback on the new recipe", Component: Tasting },
    { id: "reply", title: "Answer the review on your pull request", Component: Reply },
    { id: "habits", title: "Four habits from Google's guide for authors", Component: Habits },
    { id: "loop", title: "Closing the loop", Component: CloseLoop },
    {
      id: "check",
      title: "Helpful reply or not?",
      checkpoint: "review-responding",
      Component: RespondCheck,
    },
    { id: "wrap", title: "What to remember", Component: Wrap },
  ],
});
