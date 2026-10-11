"use client";

import { defineModule } from "@/lib/module-sdk";
import { initialState, type A11yState } from "./state";
import { Ramp, Simulate, Wcag, Law, A11yCheck, Wrap } from "./steps";

export default defineModule<A11yState>({
  initialState,
  steps: [
    { id: "story", title: "The ramp everyone uses", Component: Ramp },
    { id: "simulate", title: "Use the page with only a keyboard", Component: Simulate },
    { id: "wcag", title: "WCAG 2.2 in a nutshell", Component: Wcag },
    { id: "law", title: "The law, and who uses what", Component: Law },
    { id: "check", title: "Tool or human?", checkpoint: "frontend-a11y", Component: A11yCheck },
    { id: "wrap", title: "What to remember", Component: Wrap },
  ],
});
