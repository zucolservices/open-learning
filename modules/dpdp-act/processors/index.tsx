"use client";

import { defineModule } from "@/lib/module-sdk";
import { initialState, type ProcState } from "./state";
import { SchoolTrip, BuildContract, Tiers, CloudTerms, ProcCheck, Wrap } from "./steps";

export default defineModule<ProcState>({
  initialState,
  steps: [
    { id: "story", title: "The school trip", Component: SchoolTrip },
    { id: "build", title: "Write the vendor contract, then test it", Component: BuildContract },
    { id: "tiers", title: "Required, needed, nice to have", Component: Tiers },
    { id: "cloud", title: "What the big clouds' terms say", Component: CloudTerms },
    { id: "check", title: "Which tier?", checkpoint: "dpdp-processors", Component: ProcCheck },
    { id: "wrap", title: "What to remember", Component: Wrap },
  ],
});
