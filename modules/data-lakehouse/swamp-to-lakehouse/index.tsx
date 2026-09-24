"use client";

import { defineModule } from "@/lib/module-sdk";
import { initialState, type SwampState } from "./state";
import { SortQuestions, TwoJobs } from "./steps-intro";
import { Story } from "./steps-story";
import { Compare, Separation, StackOrder, Wrap } from "./steps-compare";

export default defineModule<SwampState>({
  initialState,
  steps: [
    { id: "two-jobs", title: "One database, two jobs", Component: TwoJobs },
    { id: "sort", title: "App or analytics?", checkpoint: "oltp-olap", Component: SortQuestions },
    { id: "story", title: "30 years in one scroll", Component: Story },
    { id: "compare", title: "Compare the architectures", Component: Compare },
    { id: "stack", title: "Build the stack", checkpoint: "stack-order", Component: StackOrder },
    {
      id: "separation",
      title: "Storage ≠ compute",
      checkpoint: "separation",
      Component: Separation,
    },
    { id: "wrap", title: "Takeaways", Component: Wrap },
  ],
});
