"use client";

import { defineModule } from "@/lib/module-sdk";
import { initialState, type UnsupState } from "./state";
import { Library, KMeans, Shapes, Pca, WhichTechnique, Wrap } from "./steps";

export default defineModule<UnsupState>({
  initialState,
  steps: [
    { id: "story", title: "Sorting a box of buttons", Component: Library },
    { id: "kmeans", title: "Segment customers with k-means", Component: KMeans },
    { id: "shapes", title: "When clusters aren't round", Component: Shapes },
    { id: "pca", title: "Squashing many columns into few", Component: Pca },
    {
      id: "check",
      title: "Which technique?",
      checkpoint: "which-technique",
      Component: WhichTechnique,
    },
    { id: "wrap", title: "What to remember", Component: Wrap },
  ],
});
