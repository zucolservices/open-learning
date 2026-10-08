"use client";

import { defineModule } from "@/lib/module-sdk";
import { initialState, type RetainState } from "./state";
import { Cloakroom, RetentionClock, WhoHasAClock, LegalHolds, RetainCheck, Wrap } from "./steps";

export default defineModule<RetainState>({
  initialState,
  steps: [
    { id: "story", title: "The cloakroom", Component: Cloakroom },
    { id: "clock", title: "Run the retention clock", Component: RetentionClock },
    { id: "who", title: "A fixed clock, or your own judgement?", Component: WhoHasAClock },
    { id: "holds", title: "Laws that keep data alive", Component: LegalHolds },
    { id: "check", title: "Erase or keep?", checkpoint: "dpdp-retain", Component: RetainCheck },
    { id: "wrap", title: "What to remember", Component: Wrap },
  ],
});
