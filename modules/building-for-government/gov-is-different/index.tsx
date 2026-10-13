"use client";

import { defineModule } from "@/lib/module-sdk";
import { initialState, type DiffState } from "./state";
import { OneFamily } from "./steps-story";
import { WhoFinishes, Numbers, Accountable, DiffCheck, Wrap } from "./steps";

export default defineModule<DiffState>({
  initialState,
  steps: [
    { id: "story", title: "One family, one ration card", Component: OneFamily },
    { id: "finish", title: "Who can finish?", Component: WhoFinishes },
    { id: "numbers", title: "The scale, in numbers", Component: Numbers },
    { id: "rules", title: "Rules, accountability and audit", Component: Accountable },
    {
      id: "check",
      title: "Fine for a shop, but for a government?",
      checkpoint: "gov-different",
      Component: DiffCheck,
    },
    { id: "wrap", title: "What to remember", Component: Wrap },
  ],
});
