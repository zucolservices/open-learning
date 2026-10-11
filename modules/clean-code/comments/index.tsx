"use client";

import { defineModule } from "@/lib/module-sdk";
import { initialState, type CommentsState } from "./state";
import { Signs, Classify, TwoSchools, DocComments, CommentsCheck, Wrap } from "./steps";

export default defineModule<CommentsState>({
  initialState,
  steps: [
    { id: "story", title: "Signs in the café", Component: Signs },
    { id: "classify", title: "Sort the comments, then fix the code", Component: Classify },
    { id: "schools", title: "Two schools of thought", Component: TwoSchools },
    { id: "docs", title: "Comments for the people who call your code", Component: DocComments },
    {
      id: "check",
      title: "Keep it or cut it?",
      checkpoint: "clean-comments",
      Component: CommentsCheck,
    },
    { id: "wrap", title: "What to remember", Component: Wrap },
  ],
});
