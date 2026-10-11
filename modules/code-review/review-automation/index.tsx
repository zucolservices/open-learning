"use client";

import { defineModule } from "@/lib/module-sdk";
import { initialState, type AutoState } from "./state";
import { Spellcheck, Assign, Mandatory, Toolbox, AutoCheck, Wrap } from "./steps";

export default defineModule<AutoState>({
  initialState,
  steps: [
    { id: "story", title: "The editor who fixes commas", Component: Spellcheck },
    { id: "assign", title: "Hand the robot comments to robots", Component: Assign },
    { id: "mandatory", title: "Make the robots mandatory", Component: Mandatory },
    { id: "toolbox", title: "A small toolbox of review bots", Component: Toolbox },
    {
      id: "check",
      title: "Order the safety nets",
      checkpoint: "review-automation",
      Component: AutoCheck,
    },
    { id: "wrap", title: "What to remember", Component: Wrap },
  ],
});
