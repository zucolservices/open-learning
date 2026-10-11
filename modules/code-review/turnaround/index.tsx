"use client";

import { defineModule } from "@/lib/module-sdk";
import { initialState, type TurnState } from "./state";
import { Laundry, Week, Numbers, FirstResponse, TurnCheck, Wrap } from "./steps";

export default defineModule<TurnState>({
  initialState,
  steps: [
    { id: "story", title: "The dry cleaner that collects once a week", Component: Laundry },
    { id: "week", title: "A week of pull requests", Component: Week },
    { id: "numbers", title: "What fast teams actually do", Component: Numbers },
    { id: "first", title: "Fast response isn't fast approval", Component: FirstResponse },
    {
      id: "check",
      title: "Faster or slower?",
      checkpoint: "review-turnaround",
      Component: TurnCheck,
    },
    { id: "wrap", title: "What to remember", Component: Wrap },
  ],
});
