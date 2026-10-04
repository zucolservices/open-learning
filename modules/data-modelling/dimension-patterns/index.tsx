"use client";

import { defineModule } from "@/lib/module-sdk";
import { initialState, type PatState } from "./state";
import { Toolbox, FixFive, JunkCombos, Snowflake, NamePattern, Wrap } from "./steps";

export default defineModule<PatState>({
  initialState,
  steps: [
    { id: "story", title: "The right tool", Component: Toolbox },
    { id: "fix", title: "Fix five awkward designs", Component: FixFive },
    { id: "junk", title: "Only what actually happens", Component: JunkCombos },
    { id: "snow", title: "Snowflake or flat?", Component: Snowflake },
    { id: "check", title: "Name the pattern", checkpoint: "name-pattern", Component: NamePattern },
    { id: "wrap", title: "What to remember", Component: Wrap },
  ],
});
