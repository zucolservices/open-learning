"use client";

import { defineModule } from "@/lib/module-sdk";
import { initialState, type LegitState } from "./state";
import { TailorsCall, PickGround, NineUses, NoCatchAll, LegitCheck, Wrap } from "./steps";

export default defineModule<LegitState>({
  initialState,
  steps: [
    { id: "story", title: "The tailor's phone call", Component: TailorsCall },
    { id: "pick", title: "Which ground applies?", Component: PickGround },
    { id: "uses", title: "The nine legitimate uses", Component: NineUses },
    { id: "catchall", title: "No catch-all", Component: NoCatchAll },
    { id: "check", title: "Consent needed?", checkpoint: "dpdp-legit", Component: LegitCheck },
    { id: "wrap", title: "What to remember", Component: Wrap },
  ],
});
