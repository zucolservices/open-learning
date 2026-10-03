"use client";

import { defineModule } from "@/lib/module-sdk";
import { initialState, type DistState } from "./state";
import { SplitAndCopy } from "./steps-story";
import { RaftSandbox, CommitWait, WhosWho, Survives, Wrap } from "./steps";

export default defineModule<DistState>({
  initialState,
  steps: [
    { id: "story", title: "Split and copy", Component: SplitAndCopy },
    { id: "raft", title: "Agree by majority", Component: RaftSandbox },
    { id: "clocks", title: "Clocks and commit wait", Component: CommitWait },
    { id: "systems", title: "Who's who", Component: WhosWho },
    { id: "check", title: "Still writing?", checkpoint: "majority-or-not", Component: Survives },
    { id: "wrap", title: "What to remember", Component: Wrap },
  ],
});
