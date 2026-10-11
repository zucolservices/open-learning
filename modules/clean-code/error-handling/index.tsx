"use client";

import { defineModule } from "@/lib/module-sdk";
import { initialState, type ErrorState } from "./state";
import { Smoke, FixSwallow, Languages, FailFast, ErrorCheck, Wrap } from "./steps";

export default defineModule<ErrorState>({
  initialState,
  steps: [
    { id: "story", title: "The alarm with the battery taken out", Component: Smoke },
    { id: "fix", title: "Find the swallowed error, then fix it three ways", Component: FixSwallow },
    { id: "languages", title: "Exceptions or error values?", Component: Languages },
    { id: "failfast", title: "Fail fast, and say something useful", Component: FailFast },
    {
      id: "check",
      title: "Good handling or a hidden alarm?",
      checkpoint: "clean-errors",
      Component: ErrorCheck,
    },
    { id: "wrap", title: "What to remember", Component: Wrap },
  ],
});
