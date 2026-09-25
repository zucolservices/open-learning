"use client";

import { defineModule } from "@/lib/module-sdk";
import { initialState, type ServeState } from "./state";
import { BatchingSim, PagedMemory, ShareTheWalk, Toolbox, TuneForJob, Wrap } from "./steps";

export default defineModule<ServeState>({
  initialState,
  steps: [
    { id: "share", title: "Share the walk", Component: ShareTheWalk },
    { id: "batching", title: "Static or continuous batching", Component: BatchingSim },
    { id: "memory", title: "Memory limits the batch", Component: PagedMemory },
    { id: "tune", title: "Tune it for the job", checkpoint: "tune", Component: TuneForJob },
    { id: "toolbox", title: "The serving toolbox", Component: Toolbox },
    { id: "wrap", title: "What to remember", Component: Wrap },
  ],
});
