"use client";

import { defineModule } from "@/lib/module-sdk";
import { initialState, type AgreementState } from "./state";
import { SecondOpinion, JudgeVsExperts, Kappa, Loop, TrustIt, Wrap } from "./steps";

export default defineModule<AgreementState>({
  initialState,
  steps: [
    { id: "story", title: "Checking the new examiner", Component: SecondOpinion },
    { id: "versus", title: "Judge versus experts", Component: JudgeVsExperts },
    { id: "kappa", title: "Agreement beyond luck", Component: Kappa },
    { id: "loop", title: "The calibration loop", Component: Loop },
    { id: "check", title: "Trust it more or less?", checkpoint: "trust-it", Component: TrustIt },
    { id: "wrap", title: "What to remember", Component: Wrap },
  ],
});
