"use client";

import { defineModule } from "@/lib/module-sdk";
import { initialState, type DashState } from "./state";
import { AsCode, FiveSeconds, TopOrDrill, TopToBottom, Wrap } from "./steps";

export default defineModule<DashState>({
  initialState,
  steps: [
    { id: "five", title: "Five seconds at 3 a.m.", Component: FiveSeconds },
    { id: "layout", title: "General to specific", Component: TopToBottom },
    { id: "code", title: "Dashboards as code", Component: AsCode },
    {
      id: "check",
      title: "Top row or drill-down?",
      checkpoint: "top-or-drill",
      Component: TopOrDrill,
    },
    { id: "wrap", title: "What to remember", Component: Wrap },
  ],
});
