"use client";

import { defineModule } from "@/lib/module-sdk";
import { initialState, type LogState } from "./state";
import { Anatomy, FindIt, LogOrNot, NeverLog, Wrap } from "./steps";

export default defineModule<LogState>({
  initialState,
  steps: [
    { id: "find", title: "Find the failed payment", Component: FindIt },
    { id: "anatomy", title: "Anatomy of a log record", Component: Anatomy },
    { id: "never", title: "What never goes in a log", Component: NeverLog },
    { id: "check", title: "Log it or not?", checkpoint: "log-or-not", Component: LogOrNot },
    { id: "wrap", title: "What to remember", Component: Wrap },
  ],
});
