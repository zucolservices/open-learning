"use client";

import { defineModule } from "@/lib/module-sdk";
import { initialState, type ChunkState } from "./state";
import { BeyondBasics, ChunkLab, CompareAll, Flashcards, SymptomFix, Wrap } from "./steps";

export default defineModule<ChunkState>({
  initialState,
  steps: [
    { id: "flashcards", title: "Cutting flashcards", Component: Flashcards },
    { id: "lab", title: "The chunk lab", Component: ChunkLab },
    { id: "compare", title: "Every setting at once", Component: CompareAll },
    { id: "beyond", title: "Search small, return big", Component: BeyondBasics },
    { id: "fix", title: "Which fix?", checkpoint: "chunk-fix", Component: SymptomFix },
    { id: "wrap", title: "What to remember", Component: Wrap },
  ],
});
