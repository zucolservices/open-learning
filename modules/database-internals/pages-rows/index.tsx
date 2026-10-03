"use client";

import { defineModule } from "@/lib/module-sdk";
import { initialState, type PageState } from "./state";
import { Ledger, SlottedPage, RowAddress, HeapOrTree, AfterUpdate, Wrap } from "./steps";

export default defineModule<PageState>({
  initialState,
  steps: [
    { id: "ledger", title: "A page with a contents list", Component: Ledger },
    { id: "page", title: "Inside an 8 kB page", Component: SlottedPage },
    { id: "address", title: "Addresses and padding", Component: RowAddress },
    { id: "heap", title: "Heaps, trees and big values", Component: HeapOrTree },
    { id: "check", title: "After an update", checkpoint: "after-update", Component: AfterUpdate },
    { id: "wrap", title: "What to remember", Component: Wrap },
  ],
});
