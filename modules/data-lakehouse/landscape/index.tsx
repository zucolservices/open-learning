"use client";

import { defineModule } from "@/lib/module-sdk";
import { initialState, type LandscapeState } from "./state";
import { GovernanceCheck, LockInSort, Rosetta, RunItYourself, Vendors, Wrap } from "./steps";

export default defineModule<LandscapeState>({
  initialState,
  steps: [
    { id: "rosetta", title: "One architecture, many names", Component: Rosetta },
    { id: "vendors", title: "The vendors, and what they add", Component: Vendors },
    { id: "diy", title: "Run it yourself", Component: RunItYourself },
    {
      id: "lock-in",
      title: "What actually locks you in?",
      checkpoint: "lock-in",
      Component: LockInSort,
    },
    {
      id: "governance",
      title: "When open source changes course",
      checkpoint: "oss-governance",
      Component: GovernanceCheck,
    },
    { id: "wrap", title: "What to remember", Component: Wrap },
  ],
});
