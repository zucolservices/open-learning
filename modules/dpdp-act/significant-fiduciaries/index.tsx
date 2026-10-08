"use client";

import { defineModule } from "@/lib/module-sdk";
import { initialState, type SdfState } from "./state";
import { Stadiums, Dials, DpoAndAudit, OtherDirection, SdfCheck, Wrap } from "./steps";

export default defineModule<SdfState>({
  initialState,
  steps: [
    { id: "story", title: "Houses and stadiums", Component: Stadiums },
    { id: "dials", title: "Would it be named significant?", Component: Dials },
    { id: "dpo", title: "The DPO, the DPIA and the audit", Component: DpoAndAudit },
    { id: "other", title: "More duties for some, fewer for others", Component: OtherDirection },
    {
      id: "check",
      title: "Everyone, or only significant ones?",
      checkpoint: "dpdp-sdf",
      Component: SdfCheck,
    },
    { id: "wrap", title: "What to remember", Component: Wrap },
  ],
});
