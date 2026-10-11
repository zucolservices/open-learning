"use client";

import { defineModule } from "@/lib/module-sdk";
import { initialState, type WhyGitState } from "./state";
import { SharedFolder } from "./steps-story";
import { ReplayWeek, CentralOrDistributed, TwentyYears, DoesGit, Wrap } from "./steps";

export default defineModule<WhyGitState>({
  initialState,
  steps: [
    { id: "story", title: "menu_final_v2_REALLY.html", Component: SharedFolder },
    { id: "replay", title: "Replay the week", Component: ReplayWeek },
    { id: "central", title: "One server, or everyone's copy?", Component: CentralOrDistributed },
    { id: "history", title: "Twenty years of Git", Component: TwentyYears },
    { id: "check", title: "What does Git do?", checkpoint: "git-what", Component: DoesGit },
    { id: "wrap", title: "What to remember", Component: Wrap },
  ],
});
