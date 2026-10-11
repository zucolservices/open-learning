"use client";

import { defineModule } from "@/lib/module-sdk";
import { initialState, type UiState } from "./state";
import { Board, Screen, Imperative, Lists, UiCheck, Wrap } from "./steps";

export default defineModule<UiState>({
  initialState,
  steps: [
    { id: "story", title: "The menu board", Component: Board },
    { id: "screen", title: "One screen, three frameworks", Component: Screen },
    { id: "imperative", title: "Describing versus instructing", Component: Imperative },
    { id: "lists", title: "Lists that scale", Component: Lists },
    { id: "check", title: "The stale price", checkpoint: "mobile-declarative", Component: UiCheck },
    { id: "wrap", title: "What to remember", Component: Wrap },
  ],
});
