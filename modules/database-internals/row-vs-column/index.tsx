"use client";

import { defineModule } from "@/lib/module-sdk";
import { initialState, type RcState } from "./state";
import { AnswerSheets, TwoLayouts, Compression, WhoStores, RowOrColumn, Wrap } from "./steps";

export default defineModule<RcState>({
  initialState,
  steps: [
    { id: "sheets", title: "Marking exam papers", Component: AnswerSheets },
    { id: "layouts", title: "Two queries, two layouts", Component: TwoLayouts },
    { id: "compress", title: "Columns compress", Component: Compression },
    { id: "who", title: "Who stores what", Component: WhoStores },
    { id: "check", title: "Row or column?", checkpoint: "row-or-column", Component: RowOrColumn },
    { id: "wrap", title: "What to remember", Component: Wrap },
  ],
});
