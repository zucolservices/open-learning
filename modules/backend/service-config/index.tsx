"use client";

import { defineModule } from "@/lib/module-sdk";
import { initialState, type CfgState } from "./state";
import { Keys, MoveIt, TwelveFactor, Managers, CfgCheck, Wrap } from "./steps";

export default defineModule<CfgState>({
  initialState,
  steps: [
    { id: "story", title: "Keys taped to the front door", Component: Keys },
    { id: "move", title: "Move settings out of the code", Component: MoveIt },
    { id: "twelve", title: "Config in the environment, with care", Component: TwelveFactor },
    { id: "managers", title: "Secret managers, and why leaks last", Component: Managers },
    {
      id: "check",
      title: "The leaked password",
      checkpoint: "backend-config",
      Component: CfgCheck,
    },
    { id: "wrap", title: "What to remember", Component: Wrap },
  ],
});
