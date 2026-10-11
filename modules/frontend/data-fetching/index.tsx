"use client";

import { defineModule } from "@/lib/module-sdk";
import { initialState, type FetchState } from "./state";
import { Letters, Search, ServerState, Frameworks, FetchCheck, Wrap } from "./steps";

export default defineModule<FetchState>({
  initialState,
  steps: [
    { id: "story", title: "Letters that arrive out of order", Component: Letters },
    { id: "search", title: "Fix a glitchy search box", Component: Search },
    { id: "server", title: "Data libraries do the hard parts", Component: ServerState },
    { id: "frameworks", title: "Fetching the framework way", Component: Frameworks },
    {
      id: "check",
      title: "The wrong results",
      checkpoint: "frontend-fetching",
      Component: FetchCheck,
    },
    { id: "wrap", title: "What to remember", Component: Wrap },
  ],
});
