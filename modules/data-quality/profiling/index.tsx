"use client";

import { defineModule } from "@/lib/module-sdk";
import { initialState, type ProfState } from "./state";
import { CheckUp, ProfileFile, ThreeLevels, Tools, RuleOrInvestigate, Wrap } from "./steps";

export default defineModule<ProfState>({
  initialState,
  steps: [
    { id: "story", title: "A check-up before a diagnosis", Component: CheckUp },
    { id: "profile", title: "Profile a supplier file", Component: ProfileFile },
    { id: "levels", title: "Beyond single columns", Component: ThreeLevels },
    { id: "tools", title: "Profiling tools", Component: Tools },
    {
      id: "check",
      title: "Rule or investigate?",
      checkpoint: "rule-or-investigate",
      Component: RuleOrInvestigate,
    },
    { id: "wrap", title: "What to remember", Component: Wrap },
  ],
});
