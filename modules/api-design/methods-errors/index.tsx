"use client";

import { defineModule } from "@/lib/module-sdk";
import { initialState, type ErrState } from "./state";
import { HelpfulNo, PickCode, FixError, MethodMeaning, BestResponse, Wrap } from "./steps";

export default defineModule<ErrState>({
  initialState,
  steps: [
    { id: "no", title: "A helpful no", Component: HelpfulNo },
    { id: "codes", title: "Answer the requests", Component: PickCode },
    { id: "fix", title: "Fix the error", Component: FixError },
    { id: "methods", title: "PUT, PATCH and redirects", Component: MethodMeaning },
    {
      id: "check",
      title: "The best response",
      checkpoint: "best-response",
      Component: BestResponse,
    },
    { id: "wrap", title: "What to remember", Component: Wrap },
  ],
});
