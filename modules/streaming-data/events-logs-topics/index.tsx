"use client";

import { defineModule } from "@/lib/module-sdk";
import { initialState, type LogState } from "./state";
import { Anatomy, LogOrQueue, Passbook, Platforms, TheLog, Wrap } from "./steps";

export default defineModule<LogState>({
  initialState,
  steps: [
    { id: "passbook", title: "A passbook nobody can rewrite", Component: Passbook },
    { id: "anatomy", title: "What's in an event", Component: Anatomy },
    { id: "log", title: "Write once, read many times", Component: TheLog },
    { id: "platforms", title: "Same idea, different names", Component: Platforms },
    { id: "check", title: "Log or queue?", checkpoint: "log-or-queue", Component: LogOrQueue },
    { id: "wrap", title: "What to remember", Component: Wrap },
  ],
});
