"use client";

import { defineModule } from "@/lib/module-sdk";
import { initialState, type SecGovState } from "./state";
import { Drill, Incident, Rules, Institutions, SecCheck, Wrap } from "./steps";

export default defineModule<SecGovState>({
  initialState,
  steps: [
    { id: "story", title: "The fire drill", Component: Drill },
    { id: "incident", title: "An incident, hour by hour", Component: Incident },
    { id: "rules", title: "CERT-In's rules", Component: Rules },
    { id: "institutions", title: "Who does what, and lessons learned", Component: Institutions },
    {
      id: "check",
      title: "Report within six hours?",
      checkpoint: "gov-security",
      Component: SecCheck,
    },
    { id: "wrap", title: "What to remember", Component: Wrap },
  ],
});
