"use client";

import { defineModule } from "@/lib/module-sdk";
import { initialState, type IdState } from "./state";
import { Doorman, Verify, HowItWorks, LawAbroad, IdCheck, Wrap } from "./steps";

export default defineModule<IdState>({
  initialState,
  steps: [
    { id: "story", title: "How much should the guard ask?", Component: Doorman },
    { id: "verify", title: "How strongly to verify?", Component: Verify },
    { id: "how", title: "How Aadhaar authentication works", Component: HowItWorks },
    { id: "law", title: "The law, and other countries", Component: LawAbroad },
    { id: "check", title: "What comes back?", checkpoint: "gov-identity", Component: IdCheck },
    { id: "wrap", title: "What to remember", Component: Wrap },
  ],
});
