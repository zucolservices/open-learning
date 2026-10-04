"use client";

import { defineModule } from "@/lib/module-sdk";
import { initialState, type LevelState } from "./state";
import { Architect, ThreeLevels, Notation, NotTheSame, WhichLevel, Wrap } from "./steps";

export default defineModule<LevelState>({
  initialState,
  steps: [
    { id: "story", title: "From sketch to blueprint", Component: Architect },
    { id: "levels", title: "A library, three ways", Component: ThreeLevels },
    { id: "notation", title: "Drawing relationships", Component: Notation },
    { id: "aside", title: "Three levels, two meanings", Component: NotTheSame },
    {
      id: "check",
      title: "Which level decides?",
      checkpoint: "which-level",
      Component: WhichLevel,
    },
    { id: "wrap", title: "What to remember", Component: Wrap },
  ],
});
