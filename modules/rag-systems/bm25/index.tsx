"use client";

import { defineModule } from "@/lib/module-sdk";
import { initialState, type Bm25State } from "./state";
import { BackOfTheBook, FindsOrMisses, LiveSearch, TwoKnobs, Wrap } from "./steps";

export default defineModule<Bm25State>({
  initialState,
  steps: [
    { id: "book", title: "The index at the back of the book", Component: BackOfTheBook },
    { id: "live", title: "Search, live", Component: LiveSearch },
    { id: "knobs", title: "The two knobs", Component: TwoKnobs },
    {
      id: "finds",
      title: "Finds it or misses it?",
      checkpoint: "bm25-finds",
      Component: FindsOrMisses,
    },
    { id: "wrap", title: "What to remember", Component: Wrap },
  ],
});
