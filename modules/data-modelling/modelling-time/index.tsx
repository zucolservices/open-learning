"use client";

import { defineModule } from "@/lib/module-sdk";
import { initialState, type TimeState } from "./state";
import { Payslip, TwoClocks, TemporalSql, SnapshotsEvents, WhichClock, Wrap } from "./steps";

export default defineModule<TimeState>({
  initialState,
  steps: [
    { id: "story", title: "The backdated pay rise", Component: Payslip },
    { id: "sim", title: "Two clocks", Component: TwoClocks },
    { id: "sql", title: "Temporal tables in SQL", Component: TemporalSql },
    { id: "events", title: "Snapshots and events", Component: SnapshotsEvents },
    { id: "check", title: "Which clock?", checkpoint: "which-clock", Component: WhichClock },
    { id: "wrap", title: "What to remember", Component: Wrap },
  ],
});
