"use client";

import { defineModule } from "@/lib/module-sdk";
import { initialState, type A11yState } from "./state";
import { Ramp, Listen, Settings, Rules, A11yCheck, Wrap } from "./steps";

export default defineModule<A11yState>({
  initialState,
  steps: [
    { id: "story", title: "The ramp everyone uses", Component: Ramp },
    { id: "listen", title: "Listen to the dish screen", Component: Listen },
    { id: "settings", title: "Settings people rely on", Component: Settings },
    { id: "rules", title: "Laws, labels and testing", Component: Rules },
    { id: "check", title: "Hide, label or role?", checkpoint: "mobile-a11y", Component: A11yCheck },
    { id: "wrap", title: "What to remember", Component: Wrap },
  ],
});
