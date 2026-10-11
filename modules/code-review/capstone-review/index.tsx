"use client";

import { defineModule } from "@/lib/module-sdk";
import { initialState, type CapState } from "./state";
import { Friday, ReadOrder, WriteComments, Replies, Decide, CapCheck, Wrap } from "./steps";

export default defineModule<CapState>({
  initialState,
  steps: [
    { id: "story", title: "A pull request lands on your desk", Component: Friday },
    { id: "read", title: "Choose what to read, and in what order", Component: ReadOrder },
    { id: "comments", title: "Write the comments", Component: WriteComments },
    { id: "replies", title: "The author replies", Component: Replies },
    { id: "decide", title: "Is it ready to merge?", Component: Decide },
    {
      id: "check",
      title: "Must fix, or fine to merge?",
      checkpoint: "review-capstone",
      Component: CapCheck,
    },
    { id: "wrap", title: "What to remember", Component: Wrap },
  ],
});
