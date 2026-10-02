"use client";

import { defineModule } from "@/lib/module-sdk";
import { initialState, type OtelState } from "./state";
import { AutoAndManual, CodeToBackend, OneStandard, WhoAddsIt, Wrap } from "./steps";

export default defineModule<OtelState>({
  initialState,
  steps: [
    { id: "story", title: "One standard instead of many", Component: OneStandard },
    { id: "path", title: "From code to backend", Component: CodeToBackend },
    { id: "auto", title: "Automatic, and by hand", Component: AutoAndManual },
    {
      id: "check",
      title: "Automatic or by hand?",
      checkpoint: "auto-or-manual",
      Component: WhoAddsIt,
    },
    { id: "wrap", title: "What to remember", Component: Wrap },
  ],
});
