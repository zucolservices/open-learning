"use client";

import { defineModule } from "@/lib/module-sdk";
import { initialState, type LineageState } from "./state";
import { River, Trace, Columns, OpenLineage, UpOrDown, Wrap } from "./steps";

export default defineModule<LineageState>({
  initialState,
  steps: [
    { id: "story", title: "Up the river", Component: River },
    { id: "trace", title: "Trace a broken dashboard", Component: Trace },
    { id: "columns", title: "Column-level lineage", Component: Columns },
    { id: "openlineage", title: "Collecting lineage", Component: OpenLineage },
    {
      id: "check",
      title: "Upstream or downstream?",
      checkpoint: "up-or-down",
      Component: UpOrDown,
    },
    { id: "wrap", title: "What to remember", Component: Wrap },
  ],
});
