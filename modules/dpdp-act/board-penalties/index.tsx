"use client";

import { defineModule } from "@/lib/module-sdk";
import { initialState, type PenState } from "./state";
import { MaxAndJudge, PenaltyExplorer, Toolkit, NoCompensation, PenCheck, Wrap } from "./steps";

export default defineModule<PenState>({
  initialState,
  steps: [
    { id: "story", title: "The maximum, and the judgement", Component: MaxAndJudge },
    { id: "explorer", title: "Where in the range?", Component: PenaltyExplorer },
    { id: "toolkit", title: "The Board's toolkit", Component: Toolkit },
    { id: "money", title: "Who gets the money?", Component: NoCompensation },
    { id: "check", title: "Match the cap", checkpoint: "dpdp-penalties", Component: PenCheck },
    { id: "wrap", title: "What to remember", Component: Wrap },
  ],
});
