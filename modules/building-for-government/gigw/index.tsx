"use client";

import { defineModule } from "@/lib/module-sdk";
import { initialState, type GigwState } from "./state";
import { Highway, Audit, Covers, Certify, GigwCheck, Wrap } from "./steps";

export default defineModule<GigwState>({
  initialState,
  steps: [
    { id: "story", title: "Signs on the highway", Component: Highway },
    { id: "audit", title: "Audit the department's website", Component: Audit },
    { id: "covers", title: "What GIGW 3.0 covers", Component: Covers },
    { id: "certify", title: "Certification and WCAG", Component: Certify },
    { id: "check", title: "Whose job is it?", checkpoint: "gov-gigw", Component: GigwCheck },
    { id: "wrap", title: "What to remember", Component: Wrap },
  ],
});
