"use client";

import { defineModule } from "@/lib/module-sdk";
import { initialState, type HookState } from "./state";
import { Checklist, WireHooks, Sharing, HooksVsCi, HookCheck, Wrap } from "./steps";

export default defineModule<HookState>({
  initialState,
  steps: [
    { id: "story", title: "Checks at the kitchen door", Component: Checklist },
    { id: "wire", title: "Attach checks, then commit a secret", Component: WireHooks },
    { id: "share", title: "Sharing hooks with a team", Component: Sharing },
    { id: "ci", title: "Hooks or CI?", Component: HooksVsCi },
    { id: "check", title: "Where should it run?", checkpoint: "git-hooks", Component: HookCheck },
    { id: "wrap", title: "What to remember", Component: Wrap },
  ],
});
