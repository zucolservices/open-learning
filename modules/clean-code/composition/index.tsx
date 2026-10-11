"use client";

import { defineModule } from "@/lib/module-sdk";
import { initialState, type CompState } from "./state";
import { Lego, AddOptions, Fragile, WhenFits, CompCheck, Wrap } from "./steps";

export default defineModule<CompState>({
  initialState,
  steps: [
    { id: "story", title: "A family tree or a box of parts?", Component: Lego },
    { id: "options", title: "Add options and count the classes", Component: AddOptions },
    { id: "fragile", title: "The fragile base class", Component: Fragile },
    { id: "fits", title: "When inheritance still fits", Component: WhenFits },
    {
      id: "check",
      title: "Inherit or compose?",
      checkpoint: "clean-composition",
      Component: CompCheck,
    },
    { id: "wrap", title: "What to remember", Component: Wrap },
  ],
});
