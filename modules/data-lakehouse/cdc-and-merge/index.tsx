"use client";

import { defineModule } from "@/lib/module-sdk";
import { initialState, type CdcState } from "./state";
import { RowLife } from "./steps-story";
import { EventAnatomy, MergeWalk, TwoInsertsCheck } from "./steps-events";
import { ReplayLab } from "./steps-lab";
import { ChangeFeeds, ScdSort, ScdTypes, Wrap } from "./steps-history";

export default defineModule<CdcState>({
  initialState,
  steps: [
    { id: "row-life", title: "A row's life, told as events", Component: RowLife },
    { id: "anatomy", title: "Anatomy of a change event", Component: EventAnatomy },
    { id: "merge", title: "MERGE, clause by clause", Component: MergeWalk },
    {
      id: "two-inserts",
      title: "Two events, one new customer",
      checkpoint: "two-inserts",
      Component: TwoInsertsCheck,
    },
    { id: "replay-lab", title: "The replay lab", Component: ReplayLab },
    { id: "scd", title: "Overwrite, or keep history?", Component: ScdTypes },
    { id: "scd-sort", title: "Type 1 or Type 2?", checkpoint: "scd-sort", Component: ScdSort },
    { id: "change-feeds", title: "Change feeds", Component: ChangeFeeds },
    { id: "wrap", title: "What to remember", Component: Wrap },
  ],
});
