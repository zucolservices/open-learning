"use client";

import { defineModule } from "@/lib/module-sdk";
import { initialState, type OState } from "./state";
import { TillAndLedger, TwoJobs, Pipeline, Origins, WhichSystem, Wrap } from "./steps";

export default defineModule<OState>({
  initialState,
  steps: [
    { id: "story", title: "The till and the accounts", Component: TillAndLedger },
    { id: "sim", title: "One model, two jobs", Component: TwoJobs },
    { id: "pipeline", title: "Two systems, one pipeline", Component: Pipeline },
    { id: "origins", title: "Where “OLAP” came from", Component: Origins },
    { id: "check", title: "OLTP or OLAP?", checkpoint: "oltp-or-olap", Component: WhichSystem },
    { id: "wrap", title: "What to remember", Component: Wrap },
  ],
});
