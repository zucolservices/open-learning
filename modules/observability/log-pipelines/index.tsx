"use client";

import { defineModule } from "@/lib/module-sdk";
import { initialState, type PipeState } from "./state";
import { IndexOrLabels, KeepOrCut, Priced, StdoutToSearch, Wrap } from "./steps";

export default defineModule<PipeState>({
  initialState,
  steps: [
    { id: "flow", title: "From stdout to search", Component: StdoutToSearch },
    { id: "priced", title: "A month of logs, priced", Component: Priced },
    { id: "index", title: "Index everything, or only labels?", Component: IndexOrLabels },
    { id: "check", title: "Keep or cut?", checkpoint: "keep-or-cut", Component: KeepOrCut },
    { id: "wrap", title: "What to remember", Component: Wrap },
  ],
});
