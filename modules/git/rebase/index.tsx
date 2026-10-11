"use client";

import { defineModule } from "@/lib/module-sdk";
import { initialState, type RebaseState } from "./state";
import { NewDraft, RebaseIt, Interactive, OneRule, RebaseCheck, Wrap } from "./steps";

export default defineModule<RebaseState>({
  initialState,
  steps: [
    { id: "story", title: "Redo your notes on the new draft", Component: NewDraft },
    { id: "rebase", title: "Rebase specials onto main", Component: RebaseIt },
    { id: "interactive", title: "Tidy up with interactive rebase", Component: Interactive },
    { id: "rule", title: "The one rule", Component: OneRule },
    { id: "check", title: "Rebase here?", checkpoint: "git-rebase", Component: RebaseCheck },
    { id: "wrap", title: "What to remember", Component: Wrap },
  ],
});
