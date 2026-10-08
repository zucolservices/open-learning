"use client";

import { defineModule } from "@/lib/module-sdk";
import { initialState, type ChildState } from "./state";
import { PermissionSlip, SignUp, FourCases, Exemptions, ChildCheck, Wrap } from "./steps";

export default defineModule<ChildState>({
  initialState,
  steps: [
    { id: "story", title: "The permission slip", Component: PermissionSlip },
    { id: "signup", title: "Build PadhaiPal's sign-up", Component: SignUp },
    { id: "cases", title: "Four ways a parent is verified", Component: FourCases },
    { id: "exemptions", title: "Narrow exemptions", Component: Exemptions },
    {
      id: "check",
      title: "Allowed for a 14-year-old?",
      checkpoint: "dpdp-children",
      Component: ChildCheck,
    },
    { id: "wrap", title: "What to remember", Component: Wrap },
  ],
});
