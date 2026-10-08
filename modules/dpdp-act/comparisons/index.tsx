"use client";

import { defineModule } from "@/lib/module-sdk";
import { initialState, type CompareState } from "./state";
import { DrivingAbroad, SideBySide, Rulebooks, WhichWins, CompareCheck, Wrap } from "./steps";

export default defineModule<CompareState>({
  initialState,
  steps: [
    { id: "story", title: "Driving in two countries", Component: DrivingAbroad },
    { id: "side", title: "DPDP and GDPR, side by side", Component: SideBySide },
    { id: "rulebooks", title: "One app, several rulebooks", Component: Rulebooks },
    { id: "wins", title: "When rules overlap, which wins?", Component: WhichWins },
    {
      id: "check",
      title: "GDPR, DPDP or both?",
      checkpoint: "dpdp-compare",
      Component: CompareCheck,
    },
    { id: "wrap", title: "What to remember", Component: Wrap },
  ],
});
