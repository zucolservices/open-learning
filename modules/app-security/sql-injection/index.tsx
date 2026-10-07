"use client";

import { defineModule } from "@/lib/module-sdk";
import { initialState, type SqlState } from "./state";
import { FillTheForm, QueryLab, Defences, Breaches, SafeOrNot, Wrap } from "./steps";

export default defineModule<SqlState>({
  initialState,
  steps: [
    { id: "story", title: "A form with a blank to fill", Component: FillTheForm },
    { id: "lab", title: "Watch the query change", Component: QueryLab },
    { id: "defences", title: "The fix, and the backups", Component: Defences },
    { id: "breaches", title: "Twenty-five years of the same bug", Component: Breaches },
    { id: "check", title: "Safe or not?", checkpoint: "sqli-safe", Component: SafeOrNot },
    { id: "wrap", title: "What to remember", Component: Wrap },
  ],
});
