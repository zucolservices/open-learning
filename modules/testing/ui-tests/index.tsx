"use client";

import { defineModule } from "@/lib/module-sdk";
import { initialState, type UiState } from "./state";
import { Directions, Redesign, Priority, Visual, UiCheck, Wrap } from "./steps";

export default defineModule<UiState>({
  initialState,
  steps: [
    { id: "story", title: "Directions that survive a repaint", Component: Directions },
    { id: "redesign", title: "Redesign a form and see which tests break", Component: Redesign },
    { id: "priority", title: "Which query first?", Component: Priority },
    { id: "visual", title: "Catching what the eye would catch", Component: Visual },
    {
      id: "check",
      title: "Pick the sturdiest query",
      checkpoint: "testing-ui",
      Component: UiCheck,
    },
    { id: "wrap", title: "What to remember", Component: Wrap },
  ],
});
