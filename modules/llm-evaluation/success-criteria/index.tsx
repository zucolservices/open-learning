"use client";

import { defineModule } from "@/lib/module-sdk";
import { initialState, type CriteriaState } from "./state";
import { Brief, BuildCriteria, TradeOffs, Goodhart, Measurable, Wrap } from "./steps";

export default defineModule<CriteriaState>({
  initialState,
  steps: [
    { id: "story", title: "“Make it helpful”", Component: Brief },
    { id: "build", title: "From “helpful” to measurable", Component: BuildCriteria },
    { id: "trade-offs", title: "Criteria pull against each other", Component: TradeOffs },
    { id: "goodhart", title: "When a measure becomes a target", Component: Goodhart },
    { id: "check", title: "Measurable or not?", checkpoint: "measurable", Component: Measurable },
    { id: "wrap", title: "What to remember", Component: Wrap },
  ],
});
