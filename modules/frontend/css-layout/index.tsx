"use client";

import { defineModule } from "@/lib/module-sdk";
import { initialState, type LayoutState } from "./state";
import { Shelves, Flex, Grid, BoxModel, LayoutCheck, Wrap } from "./steps";

export default defineModule<LayoutState>({
  initialState,
  steps: [
    { id: "story", title: "Shelves and pigeonholes", Component: Shelves },
    { id: "flex", title: "Arrange a row with flexbox", Component: Flex },
    { id: "grid", title: "Rows and columns with grid", Component: Grid },
    { id: "box", title: "Every element is a box", Component: BoxModel },
    {
      id: "check",
      title: "Flexbox or grid?",
      checkpoint: "frontend-layout",
      Component: LayoutCheck,
    },
    { id: "wrap", title: "What to remember", Component: Wrap },
  ],
});
