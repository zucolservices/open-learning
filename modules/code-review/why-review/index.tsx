"use client";

import { defineModule } from "@/lib/module-sdk";
import { initialState, type WhyState } from "./state";
import { BillSplit } from "./steps-story";
import { TagComments, History, Limits, WhyCheck, Wrap } from "./steps";

export default defineModule<WhyState>({
  initialState,
  steps: [
    { id: "story", title: "Two pairs of eyes", Component: BillSplit },
    { id: "tag", title: "What did each comment achieve?", Component: TagComments },
    { id: "history", title: "From meeting rooms to pull requests", Component: History },
    { id: "limits", title: "What review can't do", Component: Limits },
    { id: "check", title: "Fact or myth?", checkpoint: "review-why", Component: WhyCheck },
    { id: "wrap", title: "What to remember", Component: Wrap },
  ],
});
