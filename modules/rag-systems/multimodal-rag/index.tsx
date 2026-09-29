"use client";

import { defineModule } from "@/lib/module-sdk";
import { initialState, type MultimodalState } from "./state";
import {
  ColPali,
  ReadAloud,
  ThreeReaders,
  TryReport,
  WhereToStart,
  WhatIndexHolds,
  Wrap,
} from "./steps";

export default defineModule<MultimodalState>({
  initialState,
  steps: [
    { id: "aloud", title: "Reading a report aloud", Component: ReadAloud },
    { id: "readers", title: "Three ways to read a page", Component: ThreeReaders },
    { id: "index", title: "What the index holds", Component: WhatIndexHolds },
    { id: "try", title: "Ask the report", Component: TryReport },
    { id: "colpali", title: "Searching page images", Component: ColPali },
    {
      id: "start",
      title: "Where to start",
      checkpoint: "multimodal-start",
      Component: WhereToStart,
    },
    { id: "wrap", title: "What to remember", Component: Wrap },
  ],
});
