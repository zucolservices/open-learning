"use client";

import { defineModule } from "@/lib/module-sdk";
import { initialState, type JobsState } from "./state";
import { DryCleaner, Simulate, Tools, Backoff, JobsCheck, Wrap } from "./steps";

export default defineModule<JobsState>({
  initialState,
  steps: [
    { id: "story", title: "The ticket at the dry cleaner", Component: DryCleaner },
    { id: "simulate", title: "Move slow work off the request", Component: Simulate },
    { id: "tools", title: "Job systems and queues", Component: Tools },
    { id: "backoff", title: "Retry slower each time, and randomly", Component: Backoff },
    { id: "check", title: "Now or later?", checkpoint: "backend-jobs", Component: JobsCheck },
    { id: "wrap", title: "What to remember", Component: Wrap },
  ],
});
