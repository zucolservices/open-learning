"use client";

import { defineModule } from "@/lib/module-sdk";
import { initialState, type IKState } from "./state";
import { TwoBuilders, BuildRace, FourWords, Timeline, WhoSaid, Wrap } from "./steps";

export default defineModule<IKState>({
  initialState,
  steps: [
    { id: "story", title: "Two ways to build a town", Component: TwoBuilders },
    { id: "race", title: "One warehouse, two plans", Component: BuildRace },
    { id: "props", title: "Inmon's four words", Component: FourWords },
    { id: "timeline", title: "Where the ideas came from", Component: Timeline },
    {
      id: "check",
      title: "Inmon, Kimball or both?",
      checkpoint: "inmon-kimball",
      Component: WhoSaid,
    },
    { id: "wrap", title: "What to remember", Component: Wrap },
  ],
});
