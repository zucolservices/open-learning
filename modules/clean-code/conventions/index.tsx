"use client";

import { defineModule } from "@/lib/module-sdk";
import { initialState, type ConvState } from "./state";
import { HouseRules, Draft, Adr, Guides, ConvCheck, Wrap } from "./steps";

export default defineModule<ConvState>({
  initialState,
  steps: [
    { id: "story", title: "House rules in a shared kitchen", Component: HouseRules },
    { id: "draft", title: "Draft the team's conventions", Component: Draft },
    { id: "adr", title: "Record a decision in an ADR", Component: Adr },
    { id: "guides", title: "Borrow a style guide, and keep it current", Component: Guides },
    {
      id: "check",
      title: "The parts of an ADR",
      checkpoint: "clean-conventions",
      Component: ConvCheck,
    },
    { id: "wrap", title: "What to remember", Component: Wrap },
  ],
});
