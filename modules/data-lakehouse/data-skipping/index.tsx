"use client";

import { defineModule } from "@/lib/module-sdk";
import { initialState, type SkippingState } from "./state";
import { LabelsOnBoxes } from "./steps-intro";
import { LayoutCheck, LayoutLab } from "./steps-lab";
import { BloomFilters, KeepingLayout, TechniqueSort, Wrap } from "./steps-more";

export default defineModule<SkippingState>({
  initialState,
  steps: [
    { id: "labels", title: "A label on every box", Component: LabelsOnBoxes },
    { id: "lab", title: "The layout lab", Component: LayoutLab },
    { id: "pick", title: "Pick the layout", checkpoint: "pick-layout", Component: LayoutCheck },
    { id: "bloom", title: "Bloom filters", Component: BloomFilters },
    { id: "maintain", title: "Keeping the layout", Component: KeepingLayout },
    {
      id: "technique",
      title: "Match the technique",
      checkpoint: "technique",
      Component: TechniqueSort,
    },
    { id: "wrap", title: "Takeaways", Component: Wrap },
  ],
});
