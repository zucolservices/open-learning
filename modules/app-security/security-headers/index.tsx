"use client";

import { defineModule } from "@/lib/module-sdk";
import { initialState, type HdrState } from "./state";
import { ParcelLabels, HeaderLab, StrictCsp, OtherHeaders, WhichHeader, Wrap } from "./steps";

export default defineModule<HdrState>({
  initialState,
  steps: [
    { id: "story", title: "Labels on a parcel", Component: ParcelLabels },
    { id: "lab", title: "Switch on the headers", Component: HeaderLab },
    { id: "csp", title: "A policy that actually works", Component: StrictCsp },
    { id: "others", title: "Old headers, new headers, grades", Component: OtherHeaders },
    {
      id: "check",
      title: "Which header does that?",
      checkpoint: "which-header",
      Component: WhichHeader,
    },
    { id: "wrap", title: "What to remember", Component: Wrap },
  ],
});
