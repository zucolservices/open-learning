"use client";

import { defineModule } from "@/lib/module-sdk";
import { initialState, type DesignState } from "./state";
import { Brief } from "./steps-brief";
import { AuditorCheck, Decisions, LayoutCheck } from "./steps-design";
import { Wrap, YourArchitecture } from "./steps-summary";

export default defineModule<DesignState>({
  initialState,
  steps: [
    { id: "brief", title: "The brief", Component: Brief },
    { id: "decisions", title: "Make the decisions", Component: Decisions },
    {
      id: "layout",
      title: "Defend the layout",
      checkpoint: "capstone-layout",
      Component: LayoutCheck,
    },
    {
      id: "auditor",
      title: "The auditor returns",
      checkpoint: "capstone-auditor",
      Component: AuditorCheck,
    },
    { id: "architecture", title: "Your architecture", Component: YourArchitecture },
    { id: "wrap", title: "What to remember", Component: Wrap },
  ],
});
