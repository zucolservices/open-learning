"use client";

import { defineModule } from "@/lib/module-sdk";
import { initialState, type TableState } from "./state";
import { FolderVsTable, HiveTables } from "./steps-intro";
import { Incidents } from "./steps-incidents";
import { NameIt, OneThing, ThreeAnswers, WhatFormatsAdd, Wrap } from "./steps-fixes";

export default defineModule<TableState>({
  initialState,
  steps: [
    { id: "folder", title: "A folder isn't a table", Component: FolderVsTable },
    { id: "hive", title: "How Hive tables work", Component: HiveTables },
    { id: "incidents", title: "Three incidents", Component: Incidents },
    { id: "one-fix", title: "One fix for all three", checkpoint: "one-fix", Component: OneThing },
    { id: "name-it", title: "Name the problem", checkpoint: "name-problem", Component: NameIt },
    { id: "formats", title: "What a table format adds", Component: WhatFormatsAdd },
    { id: "answers", title: "Three answers", Component: ThreeAnswers },
    { id: "wrap", title: "Takeaways", Component: Wrap },
  ],
});
