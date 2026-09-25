"use client";

import { defineModule } from "@/lib/module-sdk";
import { initialState, type EmbedState } from "./state";
import { Analogy, Cosine, Landscape, MeaningMap, Search, Where, Wrap } from "./steps";

export default defineModule<EmbedState>({
  initialState,
  steps: [
    { id: "map", title: "A map of meaning", Component: MeaningMap },
    { id: "search", title: "Search by meaning", Component: Search },
    { id: "cosine", title: "Measuring closeness", Component: Cosine },
    { id: "analogy", title: "King − man + woman", Component: Analogy },
    { id: "miss", title: "Why did it miss?", checkpoint: "embed-miss", Component: Where },
    { id: "landscape", title: "Embedding models you'll meet", Component: Landscape },
    { id: "wrap", title: "What to remember", Component: Wrap },
  ],
});
