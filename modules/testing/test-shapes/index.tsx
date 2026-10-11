"use client";

import { defineModule } from "@/lib/module-sdk";
import { initialState, type ShapesState } from "./state";
import { Inspection, MixSuite, Shapes, SizeScope, ShapesCheck, Wrap } from "./steps";

export default defineModule<ShapesState>({
  initialState,
  steps: [
    { id: "story", title: "Tasting, plating, and the mystery diner", Component: Inspection },
    { id: "mix", title: "Mix a test suite", Component: MixSuite },
    { id: "shapes", title: "Pyramid, trophy, honeycomb", Component: Shapes },
    { id: "size", title: "Size is not the same as scope", Component: SizeScope },
    { id: "check", title: "Which level?", checkpoint: "testing-shapes", Component: ShapesCheck },
    { id: "wrap", title: "What to remember", Component: Wrap },
  ],
});
