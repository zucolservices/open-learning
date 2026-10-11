"use client";

import { defineModule } from "@/lib/module-sdk";
import { initialState, type BigState } from "./state";
import { WholeLibrary, CloneFourWays, LargeFiles, KeepFast, BigCheck, Wrap } from "./steps";

export default defineModule<BigState>({
  initialState,
  steps: [
    { id: "story", title: "Do you need the whole library?", Component: WholeLibrary },
    { id: "clone", title: "Clone a huge repository four ways", Component: CloneFourWays },
    { id: "lfs", title: "Large files and Git LFS", Component: LargeFiles },
    { id: "fast", title: "Keeping a big repository fast", Component: KeepFast },
    { id: "check", title: "Which technique?", checkpoint: "git-big-repos", Component: BigCheck },
    { id: "wrap", title: "What to remember", Component: Wrap },
  ],
});
