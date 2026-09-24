"use client";

import { defineModule } from "@/lib/module-sdk";
import { initialState, type FixState } from "./state";
import { SixMonthsLater } from "./steps-story";
import { Investigate } from "./steps-fix";
import { Guardrails, TrackEnd, WorkersCheck } from "./steps-more";

export default defineModule<FixState>({
  initialState,
  steps: [
    { id: "story", title: "Six months later", Component: SixMonthsLater },
    { id: "investigate", title: "Investigate and fix", Component: Investigate },
    {
      id: "workers",
      title: "Why didn't more workers help?",
      checkpoint: "more-workers",
      Component: WorkersCheck,
    },
    {
      id: "guardrails",
      title: "So it never happens again",
      checkpoint: "guardrails",
      Component: Guardrails,
    },
    { id: "end", title: "The whole lakehouse", Component: TrackEnd },
  ],
});
