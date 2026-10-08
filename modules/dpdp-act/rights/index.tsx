"use client";

import { defineModule } from "@/lib/module-sdk";
import { initialState, type RightsState } from "./state";
import { Passbook, AnswerRequest, WhoCanAsk, NotInTheAct, RightsCheck, Wrap } from "./steps";

export default defineModule<RightsState>({
  initialState,
  steps: [
    { id: "story", title: "Update my passbook", Component: Passbook },
    { id: "answer", title: "Answer Asha's request", Component: AnswerRequest },
    { id: "who", title: "Who can ask, and how", Component: WhoCanAsk },
    { id: "not", title: "Rights the Act doesn't give", Component: NotInTheAct },
    {
      id: "check",
      title: "Erase, keep or rotate?",
      checkpoint: "dpdp-rights",
      Component: RightsCheck,
    },
    { id: "wrap", title: "What to remember", Component: Wrap },
  ],
});
