"use client";

import { defineModule } from "@/lib/module-sdk";
import { initialState, type DeltaState } from "./state";
import { Anatomy, Explorer, Incident, ReaderCheck } from "./steps-intro";
import { Ledger } from "./steps-ledger";
import { PredictStorage, Restore, TimeTravel } from "./steps-timetravel";
import { Checkpoints, Concurrency, WriteOrder } from "./steps-scale";
import { Vacuum, VacuumCheck } from "./steps-vacuum";
import { ModernDelta, Wrap } from "./steps-modern";

export default defineModule<DeltaState>({
  initialState,
  steps: [
    { id: "incident", title: "The incident", Component: Incident },
    { id: "ledger", title: "The big idea: a passbook", Component: Ledger },
    { id: "explorer", title: "A table on disk", Component: Explorer },
    { id: "anatomy", title: "Anatomy of a commit", Component: Anatomy },
    {
      id: "reader",
      title: "How readers find the table",
      checkpoint: "reader-uses-log",
      Component: ReaderCheck,
    },
    { id: "time-travel", title: "Replay the log", Component: TimeTravel },
    {
      id: "predict",
      title: "What time travel costs",
      checkpoint: "files-in-storage",
      Component: PredictStorage,
    },
    { id: "restore", title: "Fix the incident", checkpoint: "restore-target", Component: Restore },
    { id: "checkpoints", title: "Checkpoints", Component: Checkpoints },
    { id: "concurrency", title: "Two writers, one log", Component: Concurrency },
    { id: "write-order", title: "Order a write", checkpoint: "write-order", Component: WriteOrder },
    { id: "vacuum", title: "VACUUM & retention", Component: Vacuum },
    {
      id: "after-vacuum",
      title: "After the clean-up",
      checkpoint: "after-vacuum",
      Component: VacuumCheck,
    },
    { id: "modern", title: "Modern Delta", Component: ModernDelta },
    { id: "wrap", title: "Takeaways", Component: Wrap },
  ],
});
